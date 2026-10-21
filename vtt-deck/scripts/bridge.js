import { MODULE_ID, PROTOCOL } from "./constants.js";
import { hmacSha256, normalizeCode, randomHex, sameString } from "./hmac.js";

/**
 * Client WebSocket vers le plugin Stream Deck (qui écoute sur 127.0.0.1:3006 par défaut).
 * Reconnexion automatique avec temporisation croissante (2 s → 30 s).
 *
 * Appairage (plugin 1.5.1 et plus) — défi / réponse dans les deux sens, le code ne circule jamais :
 *   plugin → { type: "challenge", nonce }
 *   Foundry → { type: "hello", auth: HMAC(code, "client:" + nonce), cnonce, … }
 *   plugin → { type: "hello", proof: HMAC(code, "server:" + cnonce), … }   (ou « authFailed » puis fermeture)
 * Tant que le plugin n'a pas prouvé qu'il connaît le code, ses messages sont ignorés.
 * Un plugin plus ancien n'envoie pas de défi : connexion « sans appairage », signalée dans la fenêtre d'état —
 * seulement tant qu'aucun code n'est saisi. Une fois le code saisi, un serveur qui ne lance pas le défi est refusé
 * (sinon un faux plugin n'aurait qu'à se taire pour contourner l'appairage).
 */
const LEGACY_WAIT = 1500;
/** Délai maximal pour recevoir le défi (code saisi) puis la preuve du plugin */
const AUTH_WAIT = 5000;

export class Bridge {
	constructor(onMessage, onState) {
		this.onMessage = onMessage;
		this.onState = onState;
		this.ws = null;
		this.connected = false;
		this.stopped = true;
		this.kicked = false;
		this.retry = 0;
		this.timer = null;
		this.lastError = null;
		/** « noCode » | « badCode » | « badProof » | null : l'appairage a échoué, on attend un nouveau code */
		this.authError = null;
		/** true quand le plugin est trop ancien pour l'appairage */
		this.legacy = false;
		/** true quand le programme sur le port ne lance pas le défi alors qu'un code est saisi */
		this.noChallenge = false;
	}

	get host() {
		return game.settings.get(MODULE_ID, "host") || "127.0.0.1";
	}

	get port() {
		return Number(game.settings.get(MODULE_ID, "port")) || 3006;
	}

	get code() {
		return normalizeCode(game.settings.get(MODULE_ID, "pairingCode"));
	}

	get url() {
		const host = this.host.includes(":") && !this.host.startsWith("[") ? `[${this.host}]` : this.host;
		return `ws://${host}:${this.port}`;
	}

	/** L'hôte est-il cet ordinateur ? (sinon la liaison traverse le réseau, en clair) */
	get isLocal() {
		const h = this.host.replace(/^\[|\]$/g, "");
		return h === "localhost" || h === "::1" || h.startsWith("127.");
	}

	start() {
		this.stopped = false;
		this.kicked = false;
		this.authError = null;
		this.noChallenge = false;
		this.retry = 0;
		this.#open();
	}

	stop() {
		this.stopped = true;
		clearTimeout(this.timer);
		if (this.ws) {
			clearTimeout(this.ws._legacyTimer);
			clearTimeout(this.ws._authTimer);
			this.ws.onclose = null;
			this.ws.onmessage = null;
			try {
				this.ws.close(1000, "stop");
			} catch {
				/* ignore */
			}
		}
		this.ws = null;
		this.#setConnected(false);
	}

	send(msg) {
		if (this.ws?.readyState !== WebSocket.OPEN || !this.connected) return false;
		this.ws.send(JSON.stringify(msg));
		return true;
	}

	/** Le plugin a donné la main à une autre fenêtre Foundry */
	kick() {
		this.kicked = true;
		this.stop();
	}

	#hello(extra = {}) {
		return {
			type: "hello",
			protocol: PROTOCOL,
			foundry: {
				world: game.world?.title,
				user: game.user?.name,
				isGM: game.user?.isGM,
				version: game.version,
				system: game.system?.id,
				module: game.modules.get(MODULE_ID)?.version
			},
			...extra
		};
	}

	#raw(ws, msg) {
		try {
			ws.send(JSON.stringify(msg));
		} catch {
			/* connexion fermée */
		}
	}

	#open() {
		clearTimeout(this.timer);
		if (this.stopped) return;
		let ws;
		try {
			ws = new WebSocket(this.url);
		} catch (err) {
			this.lastError = err.message;
			return this.#schedule();
		}
		this.ws = ws;
		/** « wait » (défi attendu) → « verify » (preuve du plugin attendue) → « ready » */
		let phase = "wait";
		let cnonce = null;

		/** abandon sans blâme (pas de défi, pas de réponse) : on ferme et on réessaiera plus tard */
		const giveUp = () => {
			clearTimeout(ws._legacyTimer);
			clearTimeout(ws._authTimer);
			try {
				ws.close(4000, "timeout");
			} catch {
				/* ignore */
			}
		};
		const fail = (reason) => {
			this.authError = reason;
			this.lastError = null;
			clearTimeout(ws._legacyTimer);
			try {
				ws.close(4003, reason);
			} catch {
				/* ignore */
			}
			this.onState?.(this.connected, { authError: reason });
		};

		ws.onopen = () => {
			if (this.ws !== ws) return;
			this.lastError = null;
			// Pas de défi après 1,5 s : plugin d'avant 1.5.1. Accepté sans appairage seulement si aucun code n'est saisi ;
			// sinon on attend encore (machine lente) puis on abandonne et on réessaie, sans jamais faire confiance.
			ws._legacyTimer = setTimeout(() => {
				if (phase !== "wait" || this.ws !== ws) return;
				if (this.code) {
					ws._authTimer = setTimeout(() => {
						if (phase !== "wait" || this.ws !== ws) return;
						this.noChallenge = true;
						giveUp();
					}, AUTH_WAIT - LEGACY_WAIT);
					return;
				}
				phase = "ready";
				this.retry = 0;
				this.legacy = true;
				this.#setConnected(true);
				this.#raw(ws, this.#hello());
			}, LEGACY_WAIT);
		};
		ws.onmessage = (ev) => {
			if (this.ws !== ws) return; // ancienne connexion, remplacée entre-temps
			let msg;
			try {
				msg = JSON.parse(ev.data);
			} catch {
				return;
			}
			if (phase === "ready") return this.onMessage(msg);
			if (phase === "wait" && msg.type === "challenge") {
				clearTimeout(ws._legacyTimer);
				clearTimeout(ws._authTimer);
				this.legacy = false;
				this.noChallenge = false;
				const code = this.code;
				if (!code) return fail("noCode");
				cnonce = randomHex(16);
				phase = "verify";
				this.#raw(ws, this.#hello({ auth: hmacSha256(code, `client:${msg.nonce}`), cnonce }));
				// le plugin doit répondre (preuve ou refus) dans les 5 s
				ws._authTimer = setTimeout(() => phase === "verify" && this.ws === ws && giveUp(), AUTH_WAIT);
				return;
			}
			if (msg.type === "authFailed") return fail(msg.reason === "noCode" ? "noCode" : "badCode");
			if (phase === "verify" && msg.type === "hello") {
				clearTimeout(ws._authTimer);
				if (!sameString(msg.proof, hmacSha256(this.code, `server:${cnonce}`))) return fail("badProof");
				phase = "ready";
				this.retry = 0;
				this.authError = null;
				this.#setConnected(true);
				return this.onMessage(msg);
			}
			// tout autre message avant l'appairage est ignoré
		};
		ws.onerror = () => {
			this.lastError = `Impossible de joindre ${this.url}`;
		};
		ws.onclose = () => {
			clearTimeout(ws._legacyTimer);
			clearTimeout(ws._authTimer);
			if (this.ws === ws) this.ws = null;
			this.#setConnected(false);
			// Appairage refusé : on attend que l'utilisateur corrige le code (le réglage relance la connexion)
			if (!this.stopped && !this.kicked && !this.authError) this.#schedule();
		};
	}

	#schedule() {
		const delay = Math.min(30000, 2000 * 2 ** this.retry);
		this.retry = Math.min(this.retry + 1, 4);
		this.timer = setTimeout(() => this.#open(), delay);
	}

	#setConnected(value) {
		if (this.connected === value) return;
		this.connected = value;
		this.onState?.(value);
	}
}
