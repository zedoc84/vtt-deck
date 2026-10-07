/**
 * VTT Deck — plugin Stream Deck
 * ------------------------------------------------------------
 * Le plugin est volontairement « bête » : il ne connaît rien à Foundry.
 * Il héberge un serveur WebSocket local (127.0.0.1 / ::1) auquel le module
 * Foundry « vtt-deck » se connecte. Il relaie :
 *   Stream Deck  -> Foundry : apparition/disparition des touches, réglages, appuis
 *   Foundry -> Stream Deck  : images/titres des touches, données pour l'inspecteur
 * Toute la logique de jeu vit dans le module Foundry (facile à faire évoluer).
 */
import streamDeck from "@elgato/streamdeck";
import { WebSocketServer, WebSocket } from "ws";
import http from "node:http";

const PROTOCOL = 1;
const PLUGIN_VERSION = "1.2.0";
const DEFAULT_PORT = 3006;
const PREFIX = "com.vttdeck.foundry.";

const log = streamDeck.logger.createScope("Bridge");
streamDeck.logger.setLevel("info");

/* ------------------------------------------------------------------ */
/*  État                                                               */
/* ------------------------------------------------------------------ */
const state = {
	port: DEFAULT_PORT,
	allowRemote: false,
	servers: [],
	wss: null,
	client: null,
	foundry: null, // infos envoyées par Foundry (monde, utilisateur, version…)
	piCache: new Map() // what -> items (pour que l'inspecteur reste utilisable hors ligne)
};

const shortId = (uuid) => (uuid?.startsWith(PREFIX) ? uuid.slice(PREFIX.length) : uuid);

function describeKey(action, settings) {
	return {
		context: action.id,
		action: shortId(action.manifestId),
		device: action.device?.id,
		controller: action.controllerType,
		coordinates: action.isKey?.() ? action.coordinates ?? null : null,
		inMultiAction: action.isKey?.() ? action.isInMultiAction() : false,
		settings: settings ?? {}
	};
}

function describeDevice(d) {
	return { id: d.id, name: d.name, type: d.type, size: d.size, connected: d.isConnected };
}

/* ------------------------------------------------------------------ */
/*  Envoi vers Foundry                                                 */
/* ------------------------------------------------------------------ */
function send(msg) {
	const ws = state.client;
	if (!ws || ws.readyState !== WebSocket.OPEN) return false;
	try {
		ws.send(JSON.stringify(msg));
		return true;
	} catch (err) {
		log.warn("Envoi impossible", err);
		return false;
	}
}

async function sendHello() {
	const keys = [];
	for (const action of streamDeck.actions) {
		try {
			keys.push(describeKey(action, await action.getSettings()));
		} catch (err) {
			log.warn("Réglages illisibles pour", action.id, err);
		}
	}
	const devices = [...streamDeck.devices].map(describeDevice);
	send({ type: "hello", protocol: PROTOCOL, version: PLUGIN_VERSION, devices, keys });
}

async function applyRender(msg) {
	const action = streamDeck.actions.getActionById(msg.context);
	if (!action?.isKey() || action.isInMultiAction()) return;
	try {
		if ("image" in msg) await action.setImage(msg.image || undefined);
		if ("title" in msg) await action.setTitle(msg.title ?? "");
		if (typeof msg.state === "number") await action.setState(msg.state);
	} catch (err) {
		log.warn("Rendu impossible pour", msg.context, err?.message);
	}
}

/* ------------------------------------------------------------------ */
/*  Réception depuis Foundry                                           */
/* ------------------------------------------------------------------ */
async function handleFoundryMessage(raw) {
	let msg;
	try {
		msg = JSON.parse(raw.toString());
	} catch {
		return log.warn("Message non JSON ignoré");
	}
	switch (msg.type) {
		case "hello": // Foundry se présente
			state.foundry = msg.foundry ?? {};
			log.info(`Foundry connecté : ${state.foundry.world ?? "?"} (${state.foundry.user ?? "?"})`);
			await sendHello();
			pushStatusToPI();
			break;

		case "render":
			await applyRender(msg);
			break;

		case "renderBatch":
			for (const r of msg.items ?? []) await applyRender(r);
			break;

		case "feedback": {
			const action = streamDeck.actions.getActionById(msg.context);
			if (!action) return;
			if (msg.ok && action.isKey()) await action.showOk();
			else if (!msg.ok) await action.showAlert();
			break;
		}

		case "piData":
			state.piCache.set(msg.what, msg.items ?? []);
			await streamDeck.ui.sendToPropertyInspector({ type: "data", what: msg.what, items: msg.items ?? [], live: true });
			break;

		case "setSettings": {
			const action = streamDeck.actions.getActionById(msg.context);
			if (action) await action.setSettings(msg.settings ?? {});
			break;
		}

		case "ping":
			send({ type: "pong", t: msg.t });
			break;

		default:
			log.debug("Message Foundry inconnu", msg.type);
	}
}

/* ------------------------------------------------------------------ */
/*  Serveur WebSocket                                                  */
/* ------------------------------------------------------------------ */
function isLoopback(addr = "") {
	return addr === "::1" || addr.startsWith("127.") || addr.startsWith("::ffff:127.");
}

async function resetKeysToDefault() {
	for (const action of streamDeck.actions) {
		if (!action.isKey() || action.isInMultiAction()) continue;
		try {
			await action.setImage(undefined);
			await action.setTitle("");
		} catch {
			/* touche disparue */
		}
	}
}

function attachClient(ws, req) {
	if (state.client && state.client !== ws) {
		// Une seule session Foundry pilote le Stream Deck : la plus récente gagne.
		try {
			state.client.send(JSON.stringify({ type: "replaced" }));
			state.client.close(4001, "replaced");
		} catch {
			/* ignore */
		}
	}
	state.client = ws;
	state.foundry = null;
	ws.isAlive = true;
	log.info("Connexion entrante depuis", req.socket.remoteAddress, req.headers.origin ?? "");

	ws.on("pong", () => (ws.isAlive = true));
	ws.on("message", (data) => handleFoundryMessage(data).catch((err) => log.error("Erreur traitement message", err)));
	ws.on("close", () => {
		if (state.client !== ws) return;
		state.client = null;
		state.foundry = null;
		log.info("Foundry déconnecté");
		resetKeysToDefault();
		pushStatusToPI();
	});
	ws.on("error", (err) => log.warn("Erreur WebSocket", err.message));
	// On attend le « hello » de Foundry avant d'envoyer l'état du Stream Deck.
}

function listen(host) {
	return new Promise((resolve) => {
		const srv = http.createServer((req, res) => {
			// Réponse simple pour tester dans un navigateur : http://127.0.0.1:3006
			res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" });
			res.end(`VTT Deck bridge ${PLUGIN_VERSION} — OK. Foundry ${state.client ? "connected" : "not connected"}.\n`);
		});
		srv.on("upgrade", (req, socket, head) => {
			if (!state.allowRemote && !isLoopback(req.socket.remoteAddress)) {
				socket.destroy();
				return;
			}
			state.wss.handleUpgrade(req, socket, head, (ws) => state.wss.emit("connection", ws, req));
		});
		srv.once("error", (err) => {
			log.warn(`Écoute impossible sur ${host}:${state.port} — ${err.code ?? err.message}`);
			resolve(null);
		});
		srv.listen(state.port, host, () => {
			log.info(`Serveur WebSocket à l'écoute sur ${host}:${state.port}`);
			resolve(srv);
		});
	});
}

async function startServer() {
	await stopServer();
	state.wss = new WebSocketServer({ noServer: true, maxPayload: 8 * 1024 * 1024 });
	state.wss.on("connection", attachClient);
	const hosts = state.allowRemote ? ["::", "0.0.0.0"] : ["127.0.0.1", "::1"];
	for (const host of hosts) {
		const srv = await listen(host);
		if (srv) state.servers.push(srv);
		if (state.allowRemote && srv) break; // "::" couvre généralement aussi l'IPv4
	}
	if (!state.servers.length) log.error(`Aucun serveur démarré : le port ${state.port} est peut-être déjà utilisé.`);
}

async function stopServer() {
	if (state.client) {
		try {
			state.client.close(1001, "restart");
		} catch {
			/* ignore */
		}
	}
	state.client = null;
	for (const srv of state.servers) await new Promise((r) => srv.close(() => r()));
	state.servers = [];
	state.wss?.close();
	state.wss = null;
}

// Détection des connexions mortes (navigateur fermé brutalement, veille…)
setInterval(() => {
	const ws = state.client;
	if (!ws) return;
	if (!ws.isAlive) return ws.terminate();
	ws.isAlive = false;
	try {
		ws.ping();
	} catch {
		/* ignore */
	}
}, 15000);

/* ------------------------------------------------------------------ */
/*  Inspecteur de propriétés                                           */
/* ------------------------------------------------------------------ */
function statusPayload() {
	return {
		type: "status",
		connected: !!state.client,
		foundry: state.foundry,
		port: state.port,
		allowRemote: state.allowRemote,
		listening: state.servers.length > 0,
		version: PLUGIN_VERSION
	};
}

function pushStatusToPI() {
	streamDeck.ui.sendToPropertyInspector(statusPayload()).catch(() => {});
}

streamDeck.ui.onSendToPlugin(async (ev) => {
	const p = ev.payload ?? {};
	switch (p.type) {
		case "getStatus":
			await streamDeck.ui.sendToPropertyInspector(statusPayload());
			break;
		case "getData": {
			const cached = state.piCache.get(p.what);
			if (cached) await streamDeck.ui.sendToPropertyInspector({ type: "data", what: p.what, items: cached, live: false });
			if (!send({ type: "piRequest", what: p.what, context: ev.action.id })) {
				await streamDeck.ui.sendToPropertyInspector({ type: "data", what: p.what, items: cached ?? [], live: false, offline: true });
			}
			break;
		}
		case "setConnection": {
			const port = Number(p.port);
			state.port = Number.isInteger(port) && port > 1023 && port < 65536 ? port : DEFAULT_PORT;
			state.allowRemote = !!p.allowRemote;
			await streamDeck.settings.setGlobalSettings({ port: state.port, allowRemote: state.allowRemote });
			await startServer();
			pushStatusToPI();
			break;
		}
		case "openUrl":
			if (typeof p.url === "string" && /^https?:\/\//.test(p.url)) await streamDeck.system.openUrl(p.url);
			break;
	}
});

streamDeck.ui.onDidAppear(() => pushStatusToPI());

/* ------------------------------------------------------------------ */
/*  Événements Stream Deck -> Foundry                                  */
/* ------------------------------------------------------------------ */
streamDeck.actions.onWillAppear((ev) => send({ type: "willAppear", key: describeKey(ev.action, ev.payload.settings) }));
streamDeck.actions.onWillDisappear((ev) => send({ type: "willDisappear", context: ev.action.id }));
streamDeck.settings.onDidReceiveSettings((ev) => send({ type: "settings", key: describeKey(ev.action, ev.payload.settings) }));
streamDeck.actions.onKeyDown((ev) =>
	send({ type: "keyDown", ...describeKey(ev.action, ev.payload.settings), state: ev.payload.state })
);
streamDeck.actions.onKeyUp((ev) => send({ type: "keyUp", ...describeKey(ev.action, ev.payload.settings) }));

streamDeck.devices.onDeviceDidConnect((ev) => send({ type: "device", event: "connect", device: describeDevice(ev.device) }));
streamDeck.devices.onDeviceDidDisconnect((ev) =>
	send({ type: "device", event: "disconnect", device: { id: ev.device.id } })
);
streamDeck.system.onSystemDidWakeUp(() => {
	// Après une mise en veille, on renvoie tout l'état au cas où.
	if (state.client) sendHello();
});

/* ------------------------------------------------------------------ */
/*  Démarrage                                                          */
/* ------------------------------------------------------------------ */
await streamDeck.connect();
try {
	const g = await streamDeck.settings.getGlobalSettings();
	if (Number.isInteger(g?.port)) state.port = g.port;
	state.allowRemote = !!g?.allowRemote;
} catch (err) {
	log.warn("Réglages globaux illisibles", err);
}
await startServer();
