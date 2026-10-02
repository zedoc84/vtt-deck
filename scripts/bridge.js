import { MODULE_ID, PROTOCOL } from "./constants.js";

/**
 * Client WebSocket vers le plugin Stream Deck (qui écoute sur 127.0.0.1:3006 par défaut).
 * Reconnexion automatique avec temporisation croissante (2 s → 30 s).
 */
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
	}

	get host() {
		return game.settings.get(MODULE_ID, "host") || "127.0.0.1";
	}

	get port() {
		return Number(game.settings.get(MODULE_ID, "port")) || 3006;
	}

	get url() {
		const host = this.host.includes(":") && !this.host.startsWith("[") ? `[${this.host}]` : this.host;
		return `ws://${host}:${this.port}`;
	}

	start() {
		this.stopped = false;
		this.kicked = false;
		this.retry = 0;
		this.#open();
	}

	stop() {
		this.stopped = true;
		clearTimeout(this.timer);
		if (this.ws) {
			this.ws.onclose = null;
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
		if (this.ws?.readyState !== WebSocket.OPEN) return false;
		this.ws.send(JSON.stringify(msg));
		return true;
	}

	/** Le plugin a donné la main à une autre fenêtre Foundry */
	kick() {
		this.kicked = true;
		this.stop();
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
		ws.onopen = () => {
			this.retry = 0;
			this.lastError = null;
			this.#setConnected(true);
			this.send({
				type: "hello",
				protocol: PROTOCOL,
				foundry: {
					world: game.world?.title,
					user: game.user?.name,
					isGM: game.user?.isGM,
					version: game.version,
					system: game.system?.id,
					module: game.modules.get(MODULE_ID)?.version
				}
			});
		};
		ws.onmessage = (ev) => {
			let msg;
			try {
				msg = JSON.parse(ev.data);
			} catch {
				return;
			}
			this.onMessage(msg);
		};
		ws.onerror = () => {
			this.lastError = `Impossible de joindre ${this.url}`;
		};
		ws.onclose = () => {
			if (this.ws === ws) this.ws = null;
			this.#setConnected(false);
			if (!this.stopped && !this.kicked) this.#schedule();
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
