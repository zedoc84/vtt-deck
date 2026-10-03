import { MODULE_ID, t } from "./constants.js";
import { Bridge } from "./bridge.js";
import { KeyRenderer } from "./renderer.js";
import { piData, defaultColor } from "./actions.js";
import { UserError } from "./helpers.js";

/**
 * Cœur du module : registre des touches visibles, file de rendu,
 * écoute des hooks Foundry et exécution des appuis.
 */
export class Deck {
	/** @type {Map<string, object>} context -> touche */
	keys = new Map();
	devices = new Map();
	/** Dernière signature rendue par touche (évite de renvoyer la même image) */
	signatures = new Map();
	pending = new Set();
	plugin = null;
	#flushTimer = null;
	#flushing = false;
	#hookIds = [];

	constructor(api) {
		this.api = api;
		this.renderer = new KeyRenderer();
		this.bridge = new Bridge(
			(msg) => this.#onMessage(msg),
			(connected) => this.#onState(connected)
		);
		this.#registerHooks();
	}

	/* ---------------------------------------------------------------- */
	get shouldConnect() {
		const mode = game.settings.get(MODULE_ID, "enabled");
		return mode === "on" || (mode === "auto" && game.user.isGM);
	}

	get connected() {
		return this.bridge.connected;
	}

	start() {
		if (this.shouldConnect) this.bridge.start();
	}

	restart() {
		this.bridge.stop();
		this.start();
		this.#refreshStatusApp();
	}

	/* ---------------------------------------------------------------- */
	/*  Messages venant du plugin                                       */
	/* ---------------------------------------------------------------- */
	#onState(connected) {
		if (!connected) {
			this.keys.clear();
			this.signatures.clear();
			this.pending.clear();
		}
		if (game.settings.get(MODULE_ID, "notify")) {
			if (connected) ui.notifications.info(t("Notify.Connected"));
			else if (this.plugin) ui.notifications.warn(t("Notify.Disconnected"));
		}
		if (!connected) this.plugin = null;
		this.#refreshStatusApp();
	}

	#onMessage(msg) {
		switch (msg.type) {
			case "hello":
				this.plugin = { version: msg.version, protocol: msg.protocol };
				this.keys.clear();
				this.signatures.clear();
				this.devices.clear();
				for (const d of msg.devices ?? []) this.devices.set(d.id, d);
				for (const k of msg.keys ?? []) this.keys.set(k.context, k);
				this.queueAll();
				this.#refreshStatusApp();
				break;
			case "willAppear":
				this.keys.set(msg.key.context, msg.key);
				this.signatures.delete(msg.key.context);
				this.queue(msg.key.context);
				break;
			case "willDisappear":
				this.keys.delete(msg.context);
				this.signatures.delete(msg.context);
				this.pending.delete(msg.context);
				break;
			case "settings":
				this.keys.set(msg.key.context, msg.key);
				this.signatures.delete(msg.key.context);
				this.queue(msg.key.context);
				break;
			case "keyDown":
				this.#press(msg);
				break;
			case "keyUp":
				break;
			case "piRequest":
				this.bridge.send({ type: "piData", what: msg.what, items: this.#safePiData(msg.what) });
				break;
			case "device":
				if (msg.event === "disconnect") this.devices.delete(msg.device.id);
				else this.devices.set(msg.device.id, msg.device);
				this.#refreshStatusApp();
				break;
			case "replaced":
				this.bridge.kick();
				ui.notifications.warn(t("Notify.Replaced"));
				this.#refreshStatusApp();
				break;
		}
	}

	#safePiData(what) {
		try {
			return piData(what, this.api);
		} catch (err) {
			console.error("VTT Deck | données inspecteur", what, err);
			return [];
		}
	}

	/* ---------------------------------------------------------------- */
	/*  Appuis                                                           */
	/* ---------------------------------------------------------------- */
	async #press(msg) {
		const key = this.keys.get(msg.context) ?? msg;
		const settings = msg.settings ?? key.settings ?? {};
		key.settings = settings;
		const handler = this.api.getAction(msg.action ?? key.action);
		if (!handler) return;
		try {
			await handler.press(settings, key);
		} catch (err) {
			if (err instanceof UserError) ui.notifications.warn(err.message);
			else {
				console.error("VTT Deck | erreur sur appui", err);
				ui.notifications.error(t("Errors.Generic", { msg: err?.message ?? err }));
			}
			this.bridge.send({ type: "feedback", context: msg.context, ok: false });
		}
		// Les hooks rafraîchissent normalement, mais on force la touche elle-même.
		this.signatures.delete(msg.context);
		this.queue(msg.context);
	}

	/* ---------------------------------------------------------------- */
	/*  Rendu                                                            */
	/* ---------------------------------------------------------------- */
	queue(context) {
		if (!this.connected) return;
		this.pending.add(context);
		if (!this.#flushTimer) this.#flushTimer = setTimeout(() => this.#flush(), 40);
	}

	queueAll() {
		for (const ctx of this.keys.keys()) this.queue(ctx);
	}

	queueType(types) {
		for (const [ctx, key] of this.keys) if (types.has(key.action)) this.queue(ctx);
	}

	async #flush() {
		this.#flushTimer = null;
		if (this.#flushing) {
			this.#flushTimer = setTimeout(() => this.#flush(), 40);
			return;
		}
		this.#flushing = true;
		const contexts = [...this.pending];
		this.pending.clear();
		const items = [];
		for (const ctx of contexts) {
			const key = this.keys.get(ctx);
			if (!key || key.inMultiAction) continue;
			try {
				const spec = await this.#spec(key);
				const sig = JSON.stringify(spec);
				if (this.signatures.get(ctx) === sig) continue;
				const image = await this.renderer.draw(spec);
				this.signatures.set(ctx, sig);
				items.push({ context: ctx, image, title: "" });
			} catch (err) {
				console.error("VTT Deck | rendu de touche", key, err);
			}
			// on envoie par paquets pour que les touches s'affichent vite
			if (items.length >= 8) this.bridge.send({ type: "renderBatch", items: items.splice(0) });
		}
		if (items.length) this.bridge.send({ type: "renderBatch", items });
		this.#flushing = false;
	}

	async #spec(key) {
		const s = key.settings ?? {};
		const handler = this.api.getAction(key.action);
		let spec = handler ? await handler.render(s, key) : { icon: "❓", text: [key.action] };
		spec = { ...spec };
		// Touche verrouillée (fonction Pro) : on ignore la personnalisation pour qu'elle reste reconnaissable
		if (spec.locked) {
			delete spec.vars;
			return spec;
		}
		spec.bg = s.bgColor || spec.bg || defaultColor(key.action);
		if (s.customImage) {
			spec.image = s.customImage;
			spec.fit = spec.fit ?? "cover";
		}
		if (s.hideText) spec.text = [];
		else if (s.label) {
			const vars = spec.vars ?? {};
			const txt = String(s.label).replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? vars[k] === 0 ? vars[k] : ""));
			spec.text = txt.split("|").map((l) => l.trim());
		}
		delete spec.vars;
		return spec;
	}

	/* ---------------------------------------------------------------- */
	/*  Hooks Foundry                                                    */
	/* ---------------------------------------------------------------- */
	#registerHooks() {
		this.rebuildHooks();
		// Changement de scène : les images peuvent changer, on vide le cache
		Hooks.on("canvasReady", () => this.renderer.clearCache());
	}

	/** (Ré)inscrit les hooks Foundry nécessaires aux actions enregistrées */
	rebuildHooks() {
		for (const [hook, id] of this.#hookIds) Hooks.off(hook, id);
		this.#hookIds = [];
		/** hook -> Set(types d'action) */
		const map = new Map();
		for (const [type, handler] of this.api.actions) {
			for (const hook of handler.hooks ?? []) {
				if (!map.has(hook)) map.set(hook, new Set());
				map.get(hook).add(type);
			}
		}
		for (const [hook, types] of map) {
			this.#hookIds.push([hook, Hooks.on(hook, () => this.queueType(types))]);
		}
		this.signatures.clear();
		this.queueAll();
	}

	#refreshStatusApp() {
		const app = foundry.applications.instances?.get("vtt-deck-status");
		if (app?.rendered) app.render();
	}
}
