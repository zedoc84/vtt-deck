/**
 * VTT Deck — plugin Stream Deck
 * ------------------------------------------------------------
 * Le plugin est volontairement « bête » : il ne connaît rien à Foundry.
 * Il héberge un serveur WebSocket local (127.0.0.1 / ::1) auquel le module
 * Foundry « vtt-deck » se connecte. Il relaie :
 *   Stream Deck  -> Foundry : apparition/disparition des touches, réglages, appuis
 *   Foundry -> Stream Deck  : images/titres des touches, données pour l'inspecteur
 * Toute la logique de jeu vit dans le module Foundry (facile à faire évoluer).
 *
 * Sécurité (1.5.1) : n'importe quelle page web ouverte sur l'ordinateur peut ouvrir un WebSocket vers 127.0.0.1.
 * Le plugin n'accepte donc que le client qui prouve connaître le code d'appairage (affiché dans l'inspecteur,
 * saisi une fois dans Foundry), par défi / réponse HMAC-SHA-256 ; il prouve à son tour qu'il le connaît.
 * Une connexion non appairée ne reçoit rien, ne peut rien envoyer et n'éjecte pas Foundry.
 */
import streamDeck from "@elgato/streamdeck";
import { WebSocketServer, WebSocket } from "ws";
import http from "node:http";
import crypto from "node:crypto";

const PROTOCOL = 2;
const PLUGIN_VERSION = "1.5.1";
/** Délai pour s'authentifier après l'ouverture de la connexion */
const AUTH_TIMEOUT = 5000;
/** Après 10 refus en une minute depuis une même origine, cette origine est bloquée une minute
 *  (jamais l'origine du dernier Foundry appairé : une page piégée ne peut bloquer qu'elle-même) */
const MAX_FAILURES = 10;
const LOCK_MS = 60000;
/** Avant l'appairage : 8 connexions en attente au plus, messages de 4 Ko au plus */
const MAX_PENDING = 8;
const MAX_PREAUTH_BYTES = 4096;
const DEFAULT_PORT = 3006;
const PREFIX = "com.vttdeck.foundry.";

/**
 * Profils fournis avec le plugin (déclarés dans manifest.json → « Profiles »), par type d'appareil.
 * Un plugin ne peut basculer que vers ses propres profils.
 */
const PROFILES = {
	0: { exploration: "profiles/vtt-deck-exploration-15", combat: "profiles/vtt-deck-combat-15" }, // Stream Deck 15 touches
	1: { exploration: "profiles/vtt-deck-exploration-mini", combat: "profiles/vtt-deck-combat-mini" }, // Mini
	2: { exploration: "profiles/vtt-deck-exploration-xl", combat: "profiles/vtt-deck-combat-xl" }, // XL
	7: { exploration: "profiles/vtt-deck-exploration-plus", combat: "profiles/vtt-deck-combat-plus" }, // Stream Deck +
	9: { exploration: "profiles/vtt-deck-exploration-neo", combat: "profiles/vtt-deck-combat-neo" }, // Neo
	13: { exploration: "profiles/vtt-deck-exploration-plusxl", combat: "profiles/vtt-deck-combat-plusxl" } // Stream Deck + XL
};

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
	piCache: new Map(), // what -> items (pour que l'inspecteur reste utilisable hors ligne)
	pairCode: null, // code d'appairage (réglages globaux du plugin)
	failures: new Map(), // origine (ou adresse) → horodatages des refus
	locked: new Map(), // origine (ou adresse) → fin du blocage
	pending: 0, // connexions ouvertes pas encore appairées
	pairedOrigin: null, // origine du dernier Foundry appairé (jamais bloquée)
	lastRejected: null // { origin, reason, at } : dernière connexion refusée, montrée dans l'inspecteur
};

/* ------------------------------------------------------------------ */
/*  Code d'appairage                                                   */
/* ------------------------------------------------------------------ */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 signes, sans I, O, 0, 1
const normalizeCode = (c) => String(c ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Nouveau code de 10 signes (50 bits), affiché « ABCDE-FGHJK » */
function newPairCode() {
	let out = "";
	for (const b of crypto.randomBytes(10)) out += CODE_ALPHABET[b % 32];
	return `${out.slice(0, 5)}-${out.slice(5)}`;
}

const hmac = (msg) => crypto.createHmac("sha256", normalizeCode(state.pairCode)).update(String(msg)).digest("hex");

function sameString(a, b) {
	const x = Buffer.from(String(a ?? ""));
	const y = Buffer.from(String(b ?? ""));
	return x.length === y.length && crypto.timingSafeEqual(x, y);
}

async function saveGlobalSettings() {
	await streamDeck.settings.setGlobalSettings({
		port: state.port,
		allowRemote: state.allowRemote,
		pairCode: state.pairCode,
		pairedOrigin: state.pairedOrigin
	});
}

const shortId = (uuid) => (uuid?.startsWith(PREFIX) ? uuid.slice(PREFIX.length) : uuid);

function describeKey(action, settings) {
	return {
		context: action.id,
		action: shortId(action.manifestId),
		device: action.device?.id,
		controller: action.controllerType,
		coordinates: action.coordinates ?? null,
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

/** Présentation à Foundry ; ws = la connexion visée (la preuve d'appairage ne doit aller qu'à elle) */
async function sendHello(proof, ws = state.client) {
	const keys = [];
	for (const action of streamDeck.actions) {
		try {
			keys.push(describeKey(action, await action.getSettings()));
		} catch (err) {
			log.warn("Réglages illisibles pour", action.id, err);
		}
	}
	const devices = [...streamDeck.devices].map(describeDevice);
	// entre-temps, une autre session a pu prendre la main : on n'envoie rien à une connexion remplacée
	if (!ws || state.client !== ws || ws.readyState !== WebSocket.OPEN) return;
	try {
		ws.send(JSON.stringify({ type: "hello", protocol: PROTOCOL, version: PLUGIN_VERSION, devices, keys, ...(proof ? { proof } : {}) }));
	} catch (err) {
		log.warn("Envoi impossible", err);
	}
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

/** Écran tactile d'une molette (Stream Deck +, + XL) : { title, value, indicator, icon } */
async function applyFeedback(msg) {
	const action = streamDeck.actions.getActionById(msg.context);
	if (!action?.isDial?.()) return;
	try {
		await action.setFeedback(msg.feedback ?? {});
	} catch (err) {
		log.warn("Affichage de molette impossible pour", msg.context, err?.message);
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
		case "hello": // déjà appairé : simple rafraîchissement
			await sendHello();
			break;

		case "render":
			await applyRender(msg);
			break;

		case "renderBatch":
			for (const r of msg.items ?? []) await applyRender(r);
			break;

		case "dialFeedback":
			for (const d of msg.items ?? []) await applyFeedback(d);
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

		// (1.5.1) plus de « setSettings » : Foundry n'a pas à réécrire les réglages des touches

		case "ping":
			send({ type: "pong", t: msg.t });
			break;

		case "switchProfile":
			await switchProfile(msg.profile ?? null, msg.device);
			break;

		default:
			log.debug("Message Foundry inconnu", msg.type);
	}
}

/**
 * Affiche un profil VTT Deck (« exploration » ou « combat ») sur un appareil, ou sur tous.
 * profile = null : retour au profil affiché avant le dernier changement.
 */
async function switchProfile(profile, deviceId) {
	const devices = deviceId ? [streamDeck.devices.getDeviceById(deviceId)] : [...streamDeck.devices];
	for (const d of devices) {
		if (!d || d.isConnected === false) continue;
		try {
			if (profile === null) await streamDeck.profiles.switchToProfile(d.id);
			else {
				const name = PROFILES[d.type]?.[profile];
				if (name) await streamDeck.profiles.switchToProfile(d.id, name);
				else log.info(`Pas de profil « ${profile} » pour l'appareil ${d.name} (type ${d.type})`);
			}
		} catch (err) {
			log.warn("Changement de profil impossible", err?.message);
		}
	}
}

/* ------------------------------------------------------------------ */
/*  Serveur WebSocket                                                  */
/* ------------------------------------------------------------------ */
/** En-tête Host d'une requête adressée à cet ordinateur (127.x, localhost, ::1) */
function isLocalHost(host = "") {
	const h = String(host).replace(/:\d+$/, "").replace(/^\[|\]$/g, "").toLowerCase();
	return h === "localhost" || h === "::1" || /^127(\.\d{1,3}){3}$/.test(h);
}

function isLoopback(addr = "") {
	return addr === "::1" || addr.startsWith("127.") || addr.startsWith("::ffff:127.");
}

async function resetKeysToDefault() {
	for (const action of streamDeck.actions) {
		if (action.isDial?.()) {
			try {
				// Molette « Molette » (disposition $B1) ou action de touche posée sur une molette ($A1)
				const name = shortId(action.manifestId);
				await action.setFeedback(
					name === "dial"
						? { title: "VTT Deck", value: "…", indicator: { value: 0 }, icon: "imgs/actions/dial-encoder.png" }
						: { title: "VTT Deck", value: "…", icon: `imgs/keys/${name}.png` }
				);
			} catch {
				/* molette disparue */
			}
			continue;
		}
		if (!action.isKey() || action.isInMultiAction()) continue;
		try {
			await action.setImage(undefined);
			await action.setTitle("");
		} catch {
			/* touche disparue */
		}
	}
}

/** Clé de comptage des refus : l'origine (qu'une page web ne peut pas falsifier), sinon l'adresse */
const sourceKey = (origin, req) => origin || `addr:${req.socket.remoteAddress ?? "?"}`;

/** Connexion entrante : défi d'appairage, rien d'autre tant que le client ne s'est pas authentifié */
function onConnection(ws, req) {
	const origin = String(req.headers.origin ?? "");
	const key = sourceKey(origin, req);
	const drop = (code, reason) => {
		try {
			ws.close(code, reason);
		} catch {
			/* ignore */
		}
	};
	if ((state.locked.get(key) ?? 0) > Date.now() && origin !== state.pairedOrigin) return drop(4029, "locked");
	if (state.pending >= MAX_PENDING) return drop(4029, "busy");
	state.pending++;
	ws.pendingCounted = true;
	ws.isAlive = true;
	ws.authed = false;
	ws.refused = false;
	ws.nonce = crypto.randomBytes(16).toString("hex");
	const unpend = () => {
		if (ws.pendingCounted) state.pending--;
		ws.pendingCounted = false;
	};
	ws.on("pong", () => (ws.isAlive = true));
	ws.on("error", (err) => log.warn("Erreur WebSocket", err.message));
	ws.on("message", (data) => {
		if (ws.refused) return; // une connexion refusée n'est plus écoutée
		if (ws.authed) return handleFoundryMessage(data).catch((err) => log.error("Erreur traitement message", err));
		if (data.length > MAX_PREAUTH_BYTES) return refuse(ws, origin, key, "badMessage");
		if (authenticate(ws, data, origin, key)) unpend();
	});
	ws.on("close", () => {
		clearTimeout(ws.authTimer);
		unpend();
		if (state.client !== ws) return;
		state.client = null;
		state.foundry = null;
		log.info("Foundry déconnecté");
		resetKeysToDefault();
		pushStatusToPI();
	});
	ws.authTimer = setTimeout(() => !ws.authed && refuse(ws, origin, key, "timeout"), AUTH_TIMEOUT);
	try {
		ws.send(JSON.stringify({ type: "challenge", nonce: ws.nonce, protocol: PROTOCOL, version: PLUGIN_VERSION }));
	} catch {
		/* ignore */
	}
}

/** @returns {boolean} true si le client est appairé */
function authenticate(ws, data, origin, key) {
	let msg;
	try {
		msg = JSON.parse(data.toString());
	} catch {
		refuse(ws, origin, key, "badMessage");
		return false;
	}
	if (msg?.type !== "hello") return refuse(ws, origin, key, "badMessage"), false;
	if (!msg.auth) return refuse(ws, origin, key, "noCode"), false; // module d'avant 1.5.1, ou code non saisi
	if (!sameString(msg.auth, hmac(`client:${ws.nonce}`))) return refuse(ws, origin, key, "badCode"), false;
	ws.authed = true;
	clearTimeout(ws.authTimer);
	attachClient(ws, origin);
	state.foundry = msg.foundry ?? {};
	if (origin && origin !== state.pairedOrigin) {
		state.pairedOrigin = origin;
		saveGlobalSettings().catch(() => {});
	}
	state.failures.delete(key);
	state.locked.delete(key);
	log.info(`Foundry connecté : ${state.foundry.world ?? "?"} (${state.foundry.user ?? "?"})`);
	sendHello(hmac(`server:${String(msg.cnonce ?? "")}`), ws).catch((err) => log.warn("hello", err));
	pushStatusToPI();
	return true;
}

function refuse(ws, origin, key, reason) {
	if (ws.refused) return;
	ws.refused = true;
	clearTimeout(ws.authTimer);
	state.lastRejected = { origin, reason, at: Date.now() };
	if (reason !== "timeout" && origin !== state.pairedOrigin) {
		const now = Date.now();
		const list = (state.failures.get(key) ?? []).filter((t) => now - t < 60000);
		list.push(now);
		state.failures.set(key, list);
		if (list.length >= MAX_FAILURES) {
			state.locked.set(key, now + LOCK_MS);
			state.failures.delete(key);
			log.warn(`Trop de connexions refusées depuis ${origin || key} : bloquée une minute`);
		}
		// ménage : pas de croissance sans fin des tables
		if (state.failures.size > 200) state.failures.clear();
		for (const [k, until] of state.locked) if (until < now) state.locked.delete(k);
	}
	try {
		ws.send(JSON.stringify({ type: "authFailed", reason }));
	} catch {
		/* ignore */
	}
	// fermeture immédiate (les messages suivants sont déjà ignorés : ws.refused) ; coupure franche si l'autre côté traîne
	try {
		ws.close(4003, reason);
	} catch {
		/* ignore */
	}
	setTimeout(() => {
		try {
			ws.terminate();
		} catch {
			/* ignore */
		}
	}, 1000);
	log.warn(`Connexion refusée (${reason}) depuis ${origin || "origine inconnue"}`);
	pushStatusToPI();
}

/** Client authentifié : il devient la session Foundry qui pilote le Stream Deck */
function attachClient(ws, origin) {
	if (state.client && state.client !== ws) {
		// Une seule session Foundry pilote le Stream Deck : la plus récente (appairée) gagne.
		try {
			state.client.send(JSON.stringify({ type: "replaced" }));
			state.client.close(4001, "replaced");
		} catch {
			/* ignore */
		}
	}
	state.client = ws;
	state.foundry = null;
	log.info("Connexion appairée depuis", origin || "origine inconnue");
}

function listen(host) {
	return new Promise((resolve) => {
		const srv = http.createServer((req, res) => {
			// Réponse simple pour tester dans un navigateur : http://127.0.0.1:3006
			// Pas d'en-tête CORS : une page web ne peut pas lire cette réponse.
			// En-tête Host vérifié : une page « DNS rebinding » (nom de domaine qui pointe vers 127.0.0.1) est refusée.
			if (!state.allowRemote && !isLocalHost(req.headers.host)) {
				res.writeHead(421, { "Content-Type": "text/plain; charset=utf-8" });
				res.end("Misdirected request\n");
				return;
			}
			res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" });
			res.end(`VTT Deck bridge ${PLUGIN_VERSION} — OK. Foundry ${state.client ? "connected" : "not connected"}.\n`);
		});
		srv.on("upgrade", (req, socket, head) => {
			// connexions locales seulement (sauf option Réseau), adressées à 127.0.0.1 / localhost / ::1
			if (!state.allowRemote && (!isLoopback(req.socket.remoteAddress) || !isLocalHost(req.headers.host))) {
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
	state.wss = new WebSocketServer({ noServer: true, maxPayload: 4 * 1024 * 1024 });
	state.wss.on("connection", onConnection);
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
		version: PLUGIN_VERSION,
		pairCode: state.pairCode,
		lastRejected: state.lastRejected,
		pairedOrigin: state.pairedOrigin
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
			await saveGlobalSettings();
			await startServer();
			pushStatusToPI();
			break;
		}
		case "newPairCode": {
			// Nouveau code : la session Foundry en cours est coupée et devra être appairée à nouveau
			state.pairCode = newPairCode();
			state.lastRejected = null;
			await saveGlobalSettings();
			if (state.client) {
				try {
					state.client.close(4003, "newCode");
				} catch {
					/* ignore */
				}
			}
			pushStatusToPI();
			break;
		}
		case "switchProfile":
			if (p.profile === "exploration" || p.profile === "combat") await switchProfile(p.profile, ev.action.device?.id);
			break;
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

// Molettes et écran tactile du Stream Deck +
streamDeck.actions.onDialRotate((ev) =>
	send({ type: "dialRotate", ...describeKey(ev.action, ev.payload.settings), ticks: ev.payload.ticks, pressed: !!ev.payload.pressed })
);
streamDeck.actions.onDialDown((ev) => send({ type: "dialDown", ...describeKey(ev.action, ev.payload.settings) }));
streamDeck.actions.onDialUp((ev) => send({ type: "dialUp", ...describeKey(ev.action, ev.payload.settings) }));
streamDeck.actions.onTouchTap((ev) => send({ type: "touchTap", ...describeKey(ev.action, ev.payload.settings), hold: !!ev.payload.hold }));

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
	if (normalizeCode(g?.pairCode).length === 10) state.pairCode = g.pairCode;
	if (typeof g?.pairedOrigin === "string") state.pairedOrigin = g.pairedOrigin;
} catch (err) {
	log.warn("Réglages globaux illisibles", err);
}
if (!state.pairCode) {
	state.pairCode = newPairCode();
	await saveGlobalSettings().catch((err) => log.warn("Enregistrement du code d'appairage impossible", err));
}
await startServer();
