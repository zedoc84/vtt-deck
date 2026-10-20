import { MODULE_ID, t } from "./constants.js";
import { Bridge } from "./bridge.js";
import { KeyRenderer } from "./renderer.js";
import { piData, defaultColor } from "./actions.js";
import { UserError, failPro } from "./helpers.js";

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
	/** molettes enfoncées : context -> { rotated } (tourner en appuyant n'est pas un appui) */
	#held = new Map();
	/** dernier message d'erreur par touche, pour ne pas répéter l'alerte à chaque cran de molette */
	#lastError = new Map();

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
				// Les extensions peuvent réagir à la connexion (ex. vérifier la version du plugin)
				Hooks.callAll("vttDeck.connected", this.plugin, this.api);
				this.#refreshStatusApp();
				break;
			case "willAppear":
				this.keys.set(msg.key.context, msg.key);
				this.signatures.delete(msg.key.context);
				this.queue(msg.key.context);
				this.#relayout();
				break;
			case "willDisappear":
				this.keys.delete(msg.context);
				this.signatures.delete(msg.context);
				this.pending.delete(msg.context);
				this.#relayout();
				break;
			case "settings":
				this.keys.set(msg.key.context, msg.key);
				this.signatures.delete(msg.key.context);
				this.queue(msg.key.context);
				this.#relayout();
				break;
			case "keyDown":
				this.#press(msg);
				break;
			case "keyUp":
				break;
			case "dialRotate":
				if (msg.pressed) {
					const held = this.#held.get(msg.context);
					if (held) held.rotated = true;
				}
				this.#dial(msg, "rotate");
				break;
			// L'appui sur une molette est traité au relâchement : tourner en appuyant n'est pas un appui
			case "dialDown":
				this.#held.set(msg.context, { rotated: false });
				break;
			case "dialUp": {
				const held = this.#held.get(msg.context);
				this.#held.delete(msg.context);
				if (!held?.rotated) this.#dial(msg, "press");
				break;
			}
			case "touchTap":
				this.#dial(msg, "touch");
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
	#press(msg) {
		return this.#run(msg, (handler, settings, key) => handler.press(settings, key));
	}

	/**
	 * Molette (Stream Deck +, Stream Deck + XL) : rotation (ticks), appui sur la molette ou sur l'écran tactile.
	 * Toutes les actions peuvent être posées sur une molette : l'appui fait comme la touche,
	 * la rotation appelle handler.dial() quand l'action en a un. Les molettes demandent VTT Deck Premium.
	 */
	#dial(msg, kind) {
		return this.#run(
			msg,
			(handler, settings, key) => {
				if (!this.api.isPro) failPro();
				if (kind === "rotate") return handler.dial?.(settings, key, { ticks: Number(msg.ticks) || 0, pressed: !!msg.pressed });
				if (kind === "touch" && handler.touch) return handler.touch(settings, key, { hold: !!msg.hold });
				return (handler.dialPress ?? handler.press).call(handler, settings, key);
			},
			{ throttle: kind === "rotate" }
		);
	}

	/** Exécute un appui (touche ou molette) : gardes, erreurs, retour visuel, rafraîchissement */
	async #run(msg, fn, { throttle = false } = {}) {
		const key = this.keys.get(msg.context) ?? msg;
		const settings = msg.settings ?? key.settings ?? {};
		key.settings = settings;
		const handler = this.api.getAction(msg.action ?? key.action);
		if (!handler) return;
		try {
			for (const guard of this.api.guards ?? []) {
				const verdict = guard(key, handler);
				if (verdict !== true && verdict !== undefined && verdict !== null)
					throw new UserError(typeof verdict === "string" ? verdict : t("Errors.NotAllowed"));
			}
			await fn(handler, settings, key);
		} catch (err) {
			// une molette qu'on tourne : la même erreur n'est signalée qu'une fois par seconde et demie
			const last = this.#lastError.get(msg.context);
			const now = Date.now();
			if (throttle && last && last.msg === err?.message && now - last.at < 1500) return;
			this.#lastError.set(msg.context, { msg: err?.message, at: now });
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
		if (typeof types === "string") types = new Set([types]);
		else if (Array.isArray(types)) types = new Set(types);
		for (const [ctx, key] of this.keys) if (types.has(key.action)) this.queue(ctx);
	}

	/** Envoie un message au plugin Stream Deck (ex. changement de profil) */
	send(msg) {
		return this.bridge.send(msg);
	}

	/**
	 * Position d'une touche parmi les touches « semblables » du même appareil,
	 * dans l'ordre de lecture (ligne par ligne, de gauche à droite).
	 * Sert aux rangées qui se remplissent toutes seules (initiative, pages dynamiques).
	 * @param {object} key
	 * @param {(k: object) => boolean} match  touches à compter avec celle-ci
	 * @returns {{ index: number, count: number, keys: object[] }} index = -1 si la touche n'a pas de position (multi-action)
	 */
	rank(key, match = () => true) {
		const ctl = (k) => k.controller ?? "Keypad";
		const same = [...this.keys.values()]
			.filter((k) => k.device === key.device && ctl(k) === ctl(key) && !k.inMultiAction && k.coordinates && match(k))
			.sort((a, b) => a.coordinates.row - b.coordinates.row || a.coordinates.column - b.coordinates.column);
		return { index: same.findIndex((k) => k.context === key.context), count: same.length, keys: same };
	}

	/** Les touches dont le contenu dépend de leur position sont redessinées quand la disposition change */
	#relayout() {
		const types = new Set();
		for (const [type, handler] of this.api.actions) if (handler.layout) types.add(type);
		if (types.size) this.queueType(types);
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
		const dials = [];
		for (const ctx of contexts) {
			const key = this.keys.get(ctx);
			if (!key || key.inMultiAction) continue;
			if (key.controller === "Encoder") {
				try {
					const feedback = await this.#dialSpec(key);
					const sig = `D${JSON.stringify(feedback)}`;
					if (this.signatures.get(ctx) === sig) continue;
					// petite image à gauche de l'écran tactile, dessinée comme une touche
					if (feedback.iconSpec) feedback.icon = await this.renderer.draw(feedback.iconSpec);
					delete feedback.iconSpec;
					this.signatures.set(ctx, sig);
					dials.push({ context: ctx, feedback });
				} catch (err) {
					console.error("VTT Deck | rendu de molette", key, err);
				}
				continue;
			}
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
		if (dials.length) this.bridge.send({ type: "dialFeedback", items: dials });
		this.#flushing = false;
	}

	/**
	 * Affichage d'une molette sur l'écran tactile :
	 * { title, value, indicator: { value: 0–100 }, iconSpec?: spec de touche dessinée en petite image }
	 * Action « Molette » : disposition « $B1 » (titre, image, valeur, jauge).
	 * Autres actions posées sur une molette : disposition « $A1 » (titre, image, valeur), d'après le dessin de la touche.
	 */
	async #dialSpec(key) {
		const s = key.settings ?? {};
		const handler = this.api.getAction(key.action);
		const name = t(`Actions.${key.action}`);
		// image par défaut : toujours envoyée, sinon l'écran garde l'image précédente
		const defIcon = key.action === "dial" ? "imgs/actions/dial-encoder.png" : `imgs/keys/${key.action}.png`;
		if (!this.api.isPro && key.action !== "dial") return { title: name, value: `🔒 ${t("Pro.Locked")}`, icon: defIcon };
		// action refusée par une garde (ex. mode joueur) : molette barrée
		for (const guard of this.api.guards ?? []) {
			let verdict = true;
			try {
				verdict = guard(key, handler);
			} catch {
				verdict = true;
			}
			if (verdict !== true && verdict !== undefined && verdict !== null) return { title: s.label || name, value: "🚫", icon: defIcon, ...(key.action === "dial" ? { indicator: { value: 0 } } : {}) };
		}
		let fb = handler?.renderDial ? await handler.renderDial(s, key) : null;
		if (fb) {
			fb = { ...fb };
			if (s.label && !fb.locked) fb.title = String(s.label);
		} else {
			// Dessin de la touche : l'image à gauche, le texte en valeur
			const spec = await this.#spec(key);
			const lines = [spec.big, ...(spec.text ?? [])].filter((x) => x !== null && x !== undefined && `${x}` !== "");
			fb = { title: name, value: lines.join(" · ") || "—", iconSpec: { ...spec, text: [], statusIcons: [] } };
		}
		if (fb.iconSpec) fb.iconSpec = { bg: defaultColor(key.action), ...fb.iconSpec };
		else fb.icon = fb.icon ?? defIcon;
		delete fb.locked;
		if (typeof fb.indicator === "number") fb.indicator = { value: fb.indicator };
		return fb;
	}

	async #spec(key) {
		const s = key.settings ?? {};
		const handler = this.api.getAction(key.action);
		let spec = handler ? await handler.render(s, key) : { icon: "❓", text: [key.action] };
		spec = { ...spec };
		// Touche verrouillée (fonction Premium) : on ignore la personnalisation pour qu'elle reste reconnaissable
		if (spec.locked) {
			delete spec.vars;
			return spec;
		}
		spec.bg = s.bgColor || spec.bg || defaultColor(key.action);
		if (s.customImage) {
			spec.image = s.customImage;
			spec.fit = spec.fit ?? "cover";
		}
		// Extensions (ex. couleurs selon des seuils, mode joueur)
		for (const decorate of this.api.decorators ?? []) {
			try {
				spec = decorate(spec, s, key) ?? spec;
			} catch (err) {
				console.error("VTT Deck | décorateur", err);
			}
		}
		if (spec.locked) {
			delete spec.vars;
			return spec;
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
