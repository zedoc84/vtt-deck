/* VTT Deck — inspecteur de propriétés (une seule page pour toutes les actions) */
"use strict";

let ws = null;
let piUUID = null;
let actionUUID = null;
let settings = {};
const data = {}; // what -> items
const offline = {}; // what -> bool

/* ------------------------------------------------------------------ */
/*  Langue : anglais par défaut, français si Stream Deck est en français */
/* ------------------------------------------------------------------ */
let LANG = "en";
/** Textes anglais, indexés par le texte français d'origine */
const EN = {
	"Messages": "Chat",
	"Scènes": "Scenes",
	"Acteurs": "Actors",
	"Objets": "Items",
	"Journaux": "Journal",
	"Cartes": "Cards",
	"Musique": "Music",
	"Paramètres": "Settings",
	"Exécute la macro choisie. L'image et le nom de la macro s'affichent sur la touche.": "Runs the chosen macro. The macro's image and name are shown on the key.",
	"Bordure verte = scène active pour les joueurs, bleue = scène que vous regardez.": "Green border = scene active for the players, blue = the scene you are viewing.",
	"Scène": "Scene",
	"Appui": "On press",
	"Afficher (pour moi)": "View (for me)",
	"Activer (pour tous)": "Activate (for everyone)",
	"Ouvrir la configuration": "Open configuration",
	"Afficher/masquer dans la navigation": "Show/hide in navigation",
	"Gratuit : le jeton sélectionné (image, nom, sélection, fiche). ★ Pro : personnages précis, PV et jauge (barre 1 du jeton, tous systèmes), états, ±PV, cibler, cacher.": "Free: the selected token (image, name, select, sheet). ★ Pro: specific characters, HP and gauge (token bar 1, any system), conditions, ±HP, target, hide.",
	"Jeton": "Token",
	"Jeton sélectionné": "Selected token",
	"Personnage précis": "Specific character",
	"Combattant actif": "Active combatant",
	"Personnage": "Character",
	"Afficher": "Display",
	"Nom": "Name",
	"Barre 1 (PV)": "Bar 1 (HP)",
	"Barre 2": "Bar 2",
	"Attribut…": "Attribute…",
	"Rien": "Nothing",
	"Attribut": "Attribute",
	"ex. system.attributes.ac.value": "e.g. system.attributes.ac.value",
	"Jauge PV": "HP gauge",
	"dessiner la jauge de la barre 1": "draw the bar 1 gauge",
	"Sélectionner + centrer": "Select + centre",
	"Centrer la vue": "Centre the view",
	"Ouvrir/fermer la fiche": "Open/close sheet",
	"Cibler": "Target",
	"Cacher/montrer (MJ)": "Hide/show (GM)",
	"Basculer un état": "Toggle a condition",
	"Modifier la barre 1": "Change bar 1",
	"Ajouter/retirer du combat": "Add to/remove from combat",
	"État": "Condition",
	"Variation": "Change by",
	"ex. -1, -5, +2": "e.g. -1, -5, +2",
	"Pilotage du combat. ★ Pro : une touche « Combattant n° » par place construit une rangée d'initiative.": "Combat controls. ★ Pro: one \"Combatant #\" key per place builds an initiative row.",
	"Fonction": "Function",
	"Tour suivant": "Next turn",
	"Tour précédent": "Previous turn",
	"Round suivant": "Next round",
	"Round précédent": "Previous round",
	"Commencer le combat": "Start combat",
	"Terminer le combat": "End combat",
	"Initiative : tous": "Initiative: everyone",
	"Initiative : PNJ": "Initiative: NPCs",
	"Afficher round / tour": "Show round / turn",
	"Combattant n°…": "Combatant #…",
	"Ajouter/retirer les jetons sélectionnés": "Add/remove selected tokens",
	"Place n°": "Place #",
	"dessiner la jauge": "draw the gauge",
	"Ouvrir la fiche": "Open sheet",
	"Bordure verte = en cours de lecture.": "Green border = playing.",
	"Playlist entière": "Whole playlist",
	"Piste d'une playlist": "Playlist track",
	"Fichier audio (effet)": "Audio file (effect)",
	"Tout arrêter": "Stop all",
	"Piste": "Track",
	"Fichier": "File",
	"ex. sounds/doors/wood/open.ogg": "e.g. sounds/doors/wood/open.ogg",
	"Diffusion": "Broadcast",
	"jouer chez tous les joueurs": "play for all players",
	"Fonctions générales de Foundry.": "General Foundry functions.",
	"Outil de la scène": "Scene tool",
	"Onglet de la barre latérale": "Sidebar tab",
	"Lancer de dés": "Dice roll",
	"Tirer dans une table": "Draw from a table",
	"Message dans le chat": "Chat message",
	"Obscurité de la scène": "Scene darkness",
	"Contrôle": "Control",
	"Outil": "Tool",
	"Onglet": "Tab",
	"Formule": "Formula",
	"ex. 1d20+5": "e.g. 1d20+5",
	"Visibilité": "Visibility",
	"Mode actuel du chat": "Current chat mode",
	"Privé (MJ)": "Private (GM)",
	"Pour moi seul": "Only me",
	"Texte à envoyer": "Text to send",
	"Chuchoter": "Whisper",
	"au(x) MJ uniquement": "to the GM(s) only",
	"Obscurité": "Darkness",
	"0 = plein jour, 100 = nuit noire": "0 = daylight, 100 = pitch black",
	"Apparence": "Appearance",
	"Texte": "Text",
	"(automatique)": "(automatic)",
	"| = retour à la ligne · {name} {value} {max} {round}": "| = line break · {name} {value} {max} {round}",
	"Masquer": "Hide",
	"ne pas écrire de texte": "don't write any text",
	"chemin Foundry (optionnel)": "Foundry path (optional)",
	"Fond": "Background",
	"— choisir —": "— choose —",
	"Recharger depuis Foundry": "Reload from Foundry",
	"Couleur par défaut": "Default colour",
	"défaut": "default",
	"Fonction de VTT Deck Pro : sans lui, la touche affichera 🔒.": "VTT Deck Pro feature: without it, the key shows 🔒.",
	"Foundry non connecté : liste indisponible.": "Foundry not connected: list unavailable.",
	"hors ligne": "offline",
	"inconnu": "unknown",
	"Action inconnue": "Unknown action",
	"Connecté à Foundry": "Connected to Foundry",
	"Connexion au plugin…": "Connecting to the plugin…",
	"indisponible : changez-le ci-dessous.": "unavailable: change it below.",
	"En attente de Foundry": "Waiting for Foundry",
	"Connexion Foundry": "Foundry connection",
	"Réseau": "Network",
	"accepter les connexions d'autres machines": "accept connections from other computers",
	"Appliquer": "Apply",
	"Le port doit être identique à celui réglé dans Foundry (Paramètres du module « VTT Deck »). Le réglage s'applique à tout le plugin.": "The port must match the one set in Foundry (\"VTT Deck\" module settings). This setting applies to the whole plugin."
};
const tr = (s) => (s == null || LANG === "fr" ? s : EN[s] ?? s);

/** Traduit les éléments statiques de pi.html marqués data-t */
function translateStatic() {
	document.documentElement.lang = LANG;
	document.querySelectorAll("[data-t]").forEach((e) => (e.textContent = tr(e.dataset.t)));
}

/* ------------------------------------------------------------------ */
/*  Schémas des réglages par action                                    */
/* ------------------------------------------------------------------ */
/** Options : [valeur, libellé, estPro] */
const opt = (...pairs) => pairs.map(([v, l, pro]) => ({ value: v, label: l, pro: !!pro }));

const TABS = opt(
	["chat", "Messages"], ["combat", "Combat"], ["scenes", "Scènes"], ["actors", "Acteurs"], ["items", "Objets"],
	["journal", "Journaux"], ["tables", "Tables"], ["cards", "Cartes"], ["macros", "Macros"], ["playlists", "Musique"],
	["compendium", "Compendiums"], ["settings", "Paramètres"]
);

const SCHEMAS = {
	macro: {
		help: "Exécute la macro choisie. L'image et le nom de la macro s'affichent sur la touche.",
		fields: [{ key: "macroId", label: "Macro", type: "select", source: "macros" }]
	},
	scene: {
		help: "Bordure verte = scène active pour les joueurs, bleue = scène que vous regardez.",
		fields: [
			{ key: "sceneId", label: "Scène", type: "select", source: "scenes" },
			{ key: "onPress", label: "Appui", type: "select", default: "view", options: opt(
				["view", "Afficher (pour moi)"], ["activate", "Activer (pour tous)"], ["config", "Ouvrir la configuration"], ["navToggle", "Afficher/masquer dans la navigation"]) }
		]
	},
	token: {
		help: "Gratuit : le jeton sélectionné (image, nom, sélection, fiche). ★ Pro : personnages précis, PV et jauge (barre 1 du jeton, tous systèmes), états, ±PV, cibler, cacher.",
		fields: [
			{ key: "target", label: "Jeton", type: "select", default: "selected", options: opt(
				["selected", "Jeton sélectionné"], ["actor", "Personnage précis", 1], ["turn", "Combattant actif", 1]) },
			{ key: "actorId", label: "Personnage", type: "select", source: "actors", pro: true, show: (s) => s.target === "actor" },
			{ key: "display", label: "Afficher", type: "select", default: "name", options: opt(
				["name", "Nom"], ["bar1", "Barre 1 (PV)", 1], ["bar2", "Barre 2", 1], ["path", "Attribut…", 1], ["none", "Rien"]) },
			{ key: "path", label: "Attribut", type: "text", placeholder: "ex. system.attributes.ac.value", pro: true, show: (s) => s.display === "path" },
			{ key: "showBar", label: "Jauge PV", type: "checkbox", default: true, pro: true, text: "dessiner la jauge de la barre 1" },
			{ key: "onPress", label: "Appui", type: "select", default: "select", options: opt(
				["select", "Sélectionner + centrer"], ["pan", "Centrer la vue"], ["sheet", "Ouvrir/fermer la fiche"], ["target", "Cibler", 1],
				["hide", "Cacher/montrer (MJ)", 1], ["status", "Basculer un état", 1], ["hp", "Modifier la barre 1", 1], ["combat", "Ajouter/retirer du combat", 1], ["none", "Rien"]) },
			{ key: "statusId", label: "État", type: "select", source: "statuses", pro: true, show: (s) => s.onPress === "status" },
			{ key: "delta", label: "Variation", type: "number", default: -1, pro: true, show: (s) => s.onPress === "hp", note: "ex. -1, -5, +2" }
		]
	},
	combat: {
		help: "Pilotage du combat. ★ Pro : une touche « Combattant n° » par place construit une rangée d'initiative.",
		fields: [
			{ key: "fn", label: "Fonction", type: "select", default: "next", options: opt(
				["next", "Tour suivant"], ["prev", "Tour précédent"], ["nextRound", "Round suivant"], ["prevRound", "Round précédent"],
				["start", "Commencer le combat"], ["end", "Terminer le combat"], ["rollAll", "Initiative : tous"], ["rollNPC", "Initiative : PNJ"],
				["round", "Afficher round / tour"], ["turn", "Combattant actif", 1], ["slot", "Combattant n°…", 1], ["toggleCombat", "Ajouter/retirer les jetons sélectionnés", 1]) },
			{ key: "slot", label: "Place n°", type: "number", default: 1, min: 1, pro: true, show: (s) => s.fn === "slot" },
			{ key: "display", label: "Afficher", type: "select", default: "name", pro: true, show: (s) => ["slot", "turn"].includes(s.fn), options: opt(
				["name", "Nom"], ["bar1", "Barre 1 (PV)"], ["init", "Initiative"], ["none", "Rien"]) },
			{ key: "showBar", label: "Jauge PV", type: "checkbox", default: true, pro: true, text: "dessiner la jauge", show: (s) => ["slot", "turn"].includes(s.fn) },
			{ key: "slotPress", label: "Appui", type: "select", default: "select", pro: true, show: (s) => ["slot", "turn"].includes(s.fn), options: opt(
				["select", "Sélectionner + centrer"], ["pan", "Centrer la vue"], ["sheet", "Ouvrir la fiche"], ["none", "Rien"]) }
		]
	},
	playlist: {
		help: "Bordure verte = en cours de lecture.",
		fields: [
			{ key: "mode", label: "Type", type: "select", default: "playlist", options: opt(
				["playlist", "Playlist entière"], ["sound", "Piste d'une playlist"], ["file", "Fichier audio (effet)"], ["stopAll", "Tout arrêter"]) },
			{ key: "playlistId", label: "Playlist", type: "select", source: "playlists", show: (s) => ["playlist", "sound"].includes(s.mode ?? "playlist") },
			{ key: "soundId", label: "Piste", type: "select", source: "sounds", show: (s) => s.mode === "sound" },
			{ key: "src", label: "Fichier", type: "text", placeholder: "ex. sounds/doors/wood/open.ogg", show: (s) => s.mode === "file" },
			{ key: "volume", label: "Volume", type: "range", default: 80, min: 0, max: 100, show: (s) => s.mode === "file" },
			{ key: "broadcast", label: "Diffusion", type: "checkbox", default: true, text: "jouer chez tous les joueurs", show: (s) => s.mode === "file" }
		]
	},
	system: {
		help: "Fonctions générales de Foundry.",
		fields: [
			{ key: "fn", label: "Fonction", type: "select", default: "pause", options: opt(
				["pause", "Pause"], ["control", "Outil de la scène"], ["sidebar", "Onglet de la barre latérale"], ["roll", "Lancer de dés"],
				["table", "Tirer dans une table"], ["chat", "Message dans le chat"], ["darkness", "Obscurité de la scène"]) },
			{ key: "control", label: "Contrôle", type: "select", source: "controls", show: (s) => s.fn === "control" },
			{ key: "tool", label: "Outil", type: "select", source: "tools", show: (s) => s.fn === "control" },
			{ key: "tab", label: "Onglet", type: "select", default: "chat", options: TABS, show: (s) => s.fn === "sidebar" },
			{ key: "formula", label: "Formule", type: "text", placeholder: "ex. 1d20+5", show: (s) => s.fn === "roll" },
			{ key: "rollMode", label: "Visibilité", type: "select", default: "current", show: (s) => s.fn === "roll", options: opt(
				["current", "Mode actuel du chat"], ["public", "Public"], ["gm", "Privé (MJ)"], ["self", "Pour moi seul"]) },
			{ key: "tableId", label: "Table", type: "select", source: "tables", show: (s) => s.fn === "table" },
			{ key: "message", label: "Message", type: "text", placeholder: "Texte à envoyer", show: (s) => s.fn === "chat" },
			{ key: "whisperGM", label: "Chuchoter", type: "checkbox", default: false, text: "au(x) MJ uniquement", show: (s) => s.fn === "chat" },
			{ key: "darkness", label: "Obscurité", type: "range", default: 100, min: 0, max: 100, show: (s) => s.fn === "darkness", note: "0 = plein jour, 100 = nuit noire" }
		]
	}
};

const COMMON = [
	{ sep: "Apparence" },
	{ key: "label", label: "Texte", type: "text", placeholder: "(automatique)", note: "| = retour à la ligne · {name} {value} {max} {round}" },
	{ key: "hideText", label: "Masquer", type: "checkbox", default: false, text: "ne pas écrire de texte" },
	{ key: "customImage", label: "Image", type: "text", placeholder: "chemin Foundry (optionnel)" },
	{ key: "bgColor", label: "Fond", type: "color" }
];

/** VTT Deck Pro installé dans Foundry ? "yes" | "no" | "unknown" (Foundry non connecté) */
function proState() {
	const f = data.features;
	if (!f || Array.isArray(f)) return "unknown";
	return f.pro ? "yes" : "no";
}

/* Sources dérivées d'autres listes */
function itemsFor(source) {
	if (source === "sounds") {
		const pl = (data.playlists ?? []).find((p) => p.id === settings.playlistId);
		return pl?.sounds ?? [];
	}
	if (source === "tools") {
		const c = (data.controls ?? []).find((x) => x.id === settings.control);
		return c?.tools ?? [];
	}
	return data[source] ?? [];
}
const realSource = (s) => (s === "sounds" ? "playlists" : s === "tools" ? "controls" : s);

/* ------------------------------------------------------------------ */
/*  Rendu du formulaire                                                */
/* ------------------------------------------------------------------ */
const $ = (sel) => document.querySelector(sel);
const actionKey = () => (actionUUID ?? "").split(".").pop();
const valueOf = (f) => (settings[f.key] !== undefined ? settings[f.key] : f.default);

function el(tag, attrs = {}, children = []) {
	const e = document.createElement(tag);
	for (const [k, v] of Object.entries(attrs)) {
		if (v === undefined || v === null) continue;
		if (k === "text") e.textContent = v;
		else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
		else if (k in e && typeof v !== "string") e[k] = v;
		else e.setAttribute(k, v);
	}
	for (const c of [].concat(children)) if (c) e.append(c);
	return e;
}

function buildSelect(f, value) {
	const sel = el("select", { id: f.key });
	sel.append(el("option", { value: "", text: f.options ? "—" : tr("— choisir —") }));
	let found = false;
	if (f.options) {
		for (const o of f.options) {
			const op = el("option", { value: o.value, text: tr(o.label) + (o.pro && proState() !== "yes" ? " ★ Pro" : "") });
			if (o.value === value) (op.selected = true), (found = true);
			sel.append(op);
		}
	} else {
		const items = itemsFor(f.source);
		const groups = new Map();
		for (const it of items) {
			const g = it.group ?? "";
			if (!groups.has(g)) groups.set(g, []);
			groups.get(g).push(it);
		}
		for (const [g, list] of groups) {
			const parent = g ? el("optgroup", { label: g }) : sel;
			for (const it of list) {
				const op = el("option", { value: it.id, text: it.name });
				if (it.id === value) (op.selected = true), (found = true);
				parent.append(op);
			}
			if (g) sel.append(parent);
		}
	}
	if (value && !found) {
		const label = settings[`${f.key}Name`] ? `${settings[`${f.key}Name`]} (${tr("hors ligne")})` : `${value} (${tr("inconnu")})`;
		sel.append(el("option", { value, text: label, selected: true }));
	}
	sel.addEventListener("change", () => {
		const v = sel.value;
		set(f.key, v === "" ? undefined : v);
		// mémorise aussi le nom pour l'affichage hors ligne
		if (f.source) {
			const it = itemsFor(f.source).find((x) => x.id === v);
			set(`${f.key}Name`, it?.name, false);
		}
		save();
		render();
	});
	return sel;
}

function buildField(f) {
	if (f.sep) return el("div", { class: "sep", text: tr(f.sep) });
	if (f.show && !f.show(settings)) return null;
	const value = valueOf(f);
	let input;
	const extra = [];
	switch (f.type) {
		case "select":
			input = buildSelect(f, value);
			if (f.source) {
				extra.push(el("button", { type: "button", class: "icon", title: tr("Recharger depuis Foundry"), text: "↻", onclick: () => request(realSource(f.source)) }));
			}
			break;
		case "checkbox": {
			const cb = el("input", { id: f.key, type: "checkbox" });
			cb.checked = !!value;
			cb.addEventListener("change", () => (set(f.key, cb.checked), save(), render()));
			input = el("span", { class: "check" }, [cb, el("span", { text: tr(f.text ?? "") + (f.pro && proState() !== "yes" ? " (Pro)" : "") })]);
			break;
		}
		case "number": {
			input = el("input", { id: f.key, type: "number", value: value ?? "", min: f.min, max: f.max, step: f.step ?? 1 });
			input.addEventListener("change", () => {
				const n = Number(input.value);
				set(f.key, input.value === "" || Number.isNaN(n) ? undefined : n);
				save();
			});
			break;
		}
		case "range": {
			const out = el("span", { text: String(value ?? "") , style: "min-width:28px;text-align:right" });
			const r = el("input", { id: f.key, type: "range", min: f.min ?? 0, max: f.max ?? 100, value: value ?? 0 });
			r.addEventListener("input", () => (out.textContent = r.value));
			r.addEventListener("change", () => (set(f.key, Number(r.value)), save()));
			input = r;
			extra.push(out);
			break;
		}
		case "color": {
			const c = el("input", { id: f.key, type: "color", value: value || "#333333" });
			c.addEventListener("change", () => (set(f.key, c.value), save()));
			input = c;
			extra.push(el("button", { type: "button", class: "icon", title: tr("Couleur par défaut"), text: "↺", onclick: () => (set(f.key, undefined), save(), render()) }));
			if (!value) extra.push(el("span", { class: "help small", text: tr("défaut") }));
			break;
		}
		default: {
			input = el("input", { id: f.key, type: "text", value: value ?? "", placeholder: tr(f.placeholder ?? "") });
			input.addEventListener("change", () => (set(f.key, input.value.trim() || undefined), save()));
		}
	}
	const row = el("div", { class: "row" }, [el("label", { for: f.key, text: tr(f.label) }), el("div", { class: "val" }, [input, ...extra])]);
	const frag = document.createDocumentFragment();
	frag.append(row);
	if (f.note) frag.append(el("div", { class: "note", text: tr(f.note) }));
	if (f.options && proState() === "no" && f.options.find((o) => o.value === value)?.pro) {
		frag.append(el("div", { class: "note pro", text: tr("Fonction de VTT Deck Pro : sans lui, la touche affichera 🔒.") }));
	}
	if (f.source && offline[realSource(f.source)] && !itemsFor(f.source).length) {
		frag.append(el("div", { class: "note", text: tr("Foundry non connecté : liste indisponible.") }));
	}
	return frag;
}

function render() {
	const schema = SCHEMAS[actionKey()];
	const form = $("#form");
	form.replaceChildren();
	if (!schema) {
		form.append(el("p", { class: "help", text: `${tr("Action inconnue")}: ${actionUUID}` }));
		return;
	}
	$("#help").textContent = tr(schema.help ?? "");
	for (const f of [...schema.fields, ...COMMON]) {
		const node = buildField(f);
		if (node) form.append(node);
	}
}

function renderStatus(s) {
	const box = $("#status");
	box.classList.toggle("on", !!s.connected);
	const txt = box.querySelector(".txt");
	if (s.connected) {
		const f = s.foundry ?? {};
		txt.textContent = `${tr("Connecté à Foundry")}${f.world ? ` — ${f.world}` : ""}${f.user ? ` (${f.user})` : ""}`;
	} else if (!s.listening) {
		txt.textContent = `Port ${s.port} ${tr("indisponible : changez-le ci-dessous.")}`;
	} else {
		txt.textContent = `${tr("En attente de Foundry")} (port ${s.port})…`;
	}
	$("#port").value = s.port;
	$("#allowRemote").checked = !!s.allowRemote;
}

/* ------------------------------------------------------------------ */
/*  Communication                                                      */
/* ------------------------------------------------------------------ */
function set(key, value, rerender) {
	if (value === undefined || value === null) delete settings[key];
	else settings[key] = value;
}
function save() {
	ws?.send(JSON.stringify({ event: "setSettings", context: piUUID, payload: settings }));
}
function toPlugin(payload) {
	ws?.send(JSON.stringify({ event: "sendToPlugin", action: actionUUID, context: piUUID, payload }));
}
function request(what) {
	toPlugin({ type: "getData", what });
}
function requestSources() {
	const schema = SCHEMAS[actionKey()];
	if (!schema) return;
	const sources = new Set(schema.fields.filter((f) => f.source).map((f) => realSource(f.source)));
	sources.add("features");
	for (const s of sources) request(s);
}

function onPluginMessage(p) {
	if (!p) return;
	if (p.type === "status") {
		renderStatus(p);
		if (p.connected) requestSources();
	} else if (p.type === "data") {
		data[p.what] = p.items ?? [];
		offline[p.what] = !!p.offline;
		render();
	}
}

// Point d'entrée appelé par l'application Stream Deck
window.connectElgatoStreamDeckSocket = function (port, uuid, registerEvent, info, actionInfo) {
	piUUID = uuid;
	try {
		const lang = JSON.parse(info)?.application?.language ?? "en";
		LANG = String(lang).toLowerCase().startsWith("fr") ? "fr" : "en";
	} catch {
		LANG = "en";
	}
	translateStatic();
	try {
		const ai = JSON.parse(actionInfo);
		actionUUID = ai.action;
		settings = ai.payload?.settings ?? {};
	} catch {
		settings = {};
	}
	render();
	ws = new WebSocket(`ws://127.0.0.1:${port}`);
	ws.onopen = () => {
		ws.send(JSON.stringify({ event: registerEvent, uuid }));
		toPlugin({ type: "getStatus" });
		requestSources();
	};
	ws.onmessage = (e) => {
		let m;
		try {
			m = JSON.parse(e.data);
		} catch {
			return;
		}
		if (m.event === "sendToPropertyInspector") onPluginMessage(m.payload);
		else if (m.event === "didReceiveSettings") {
			settings = m.payload?.settings ?? {};
			render();
		}
	};
};

document.addEventListener("DOMContentLoaded", () => {
	$("#applyConn").addEventListener("click", () => {
		toPlugin({ type: "setConnection", port: Number($("#port").value), allowRemote: $("#allowRemote").checked });
	});
});
