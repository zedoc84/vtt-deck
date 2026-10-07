/**
 * Actions de la version gratuite.
 * Chaque action expose :
 *   render(settings, key) -> spec (voir renderer.js)
 *   press(settings, key)  -> exécute l'action dans Foundry
 *   needsPro(settings)    -> true si les réglages demandent une fonction de VTT Deck Pro
 *   hooks: noms de hooks Foundry qui doivent rafraîchir ce type de touche
 *
 * VTT Deck Pro remplace les actions « token » et « combat » par des versions complètes
 * (voir api.js → registerAction).
 */
import {
	BORDER, COLORS, t, loc, list, fail, requireGM, canvasReady, tokenImage, panTo, selectAndPan,
	toggleSheet, toggleCombat, visibleTurns, lockedSpec, failPro
} from "./helpers.js";

/* ------------------------------------------------------------------ */
/*  MACRO                                                              */
/* ------------------------------------------------------------------ */
const macroAction = {
	hooks: ["createMacro", "updateMacro", "deleteMacro"],
	find(s) {
		return game.macros.get(s.macroId) ?? (s.macroIdName ? game.macros.getName(s.macroIdName) : null);
	},
	render(s) {
		const macro = this.find(s);
		if (!macro) return { icon: "❓", text: [s.macroId ? t("Keys.MacroMissing") : t("Keys.ChooseMacro")], dim: true };
		return { image: macro.img, fit: "contain", text: [macro.name], vars: { name: macro.name } };
	},
	async press(s) {
		const macro = this.find(s);
		if (!macro) fail("Errors.MacroMissing");
		if (macro.canExecute === false) fail("Errors.MacroNoPermission", { name: macro.name });
		await macro.execute();
	}
};

/* ------------------------------------------------------------------ */
/*  SCÈNE                                                              */
/* ------------------------------------------------------------------ */
const sceneAction = {
	hooks: ["createScene", "updateScene", "deleteScene", "canvasReady"],
	find(s) {
		return game.scenes.get(s.sceneId) ?? (s.sceneIdName ? game.scenes.getName(s.sceneIdName) : null);
	},
	render(s) {
		const scene = this.find(s);
		if (!scene) return { icon: "🗺️", text: [t("Keys.ChooseScene")], dim: true };
		const name = scene.navName || scene.name;
		return {
			image: scene.thumb || scene.background?.src || null,
			fit: "cover",
			icon: "🗺️",
			text: [name],
			border: scene.active ? BORDER.active : scene.isView ? BORDER.viewed : null,
			dim: (s.onPress ?? "view") === "navToggle" && !scene.navigation,
			vars: { name }
		};
	},
	async press(s) {
		const scene = this.find(s);
		if (!scene) fail("Errors.SceneMissing");
		switch (s.onPress ?? "view") {
			case "activate":
				requireGM();
				return scene.activate();
			case "config":
				return scene.sheet.render(true);
			case "navToggle":
				requireGM();
				return scene.update({ navigation: !scene.navigation });
			default:
				return scene.view();
		}
	}
};


/* ------------------------------------------------------------------ */
/*  JETON (version gratuite : jeton sélectionné, nom, sélection/fiche)  */
/* ------------------------------------------------------------------ */
const FREE_TOKEN = {
	target: ["selected"],
	display: ["name", "none"],
	onPress: ["select", "pan", "sheet", "none"]
};

const tokenAction = {
	hooks: ["controlToken", "updateToken", "createToken", "deleteToken", "updateActor", "canvasReady"],
	needsPro(s) {
		return Object.entries(FREE_TOKEN).some(([k, ok]) => s[k] !== undefined && s[k] !== "" && !ok.includes(s[k]));
	},
	render(s) {
		if (this.needsPro(s)) return lockedSpec();
		const token = canvasReady() ? canvas.tokens.controlled[0] ?? null : null;
		if (!token) return { icon: "👤", text: [t("Keys.NoToken")], dim: true };
		const doc = token.document;
		const name = doc.name ?? token.actor?.name ?? "?";
		return {
			image: tokenImage(doc, token.actor),
			fit: "cover",
			text: [(s.display ?? "name") === "none" ? null : name],
			dim: !!doc.hidden,
			vars: { name }
		};
	},
	async press(s) {
		if (this.needsPro(s)) failPro();
		const token = canvasReady() ? canvas.tokens.controlled[0] ?? null : null;
		switch (s.onPress ?? "select") {
			case "select":
				return selectAndPan(token);
			case "pan":
				if (!token) fail("Errors.NoTokenOnScene");
				return panTo(token);
			case "sheet":
				if (!token?.actor) fail("Errors.NoToken");
				return toggleSheet(token.actor);
		}
	}
};

/* ------------------------------------------------------------------ */
/*  COMBAT (version gratuite : pilotage du suivi de combat)            */
/* ------------------------------------------------------------------ */
const COMBAT_FN = {
	next: { icon: "⏭️", key: "Keys.NextTurn", gm: false },
	prev: { icon: "⏮️", key: "Keys.PrevTurn", gm: true },
	nextRound: { icon: "⏩", key: "Keys.NextRound", gm: true },
	prevRound: { icon: "⏪", key: "Keys.PrevRound", gm: true },
	start: { icon: "⚔️", key: "Keys.StartCombat", gm: true },
	end: { icon: "🏁", key: "Keys.EndCombat", gm: true },
	rollAll: { icon: "🎲", key: "Keys.RollAll", gm: true },
	rollNPC: { icon: "🎲", key: "Keys.RollNPC", gm: true }
};

const combatAction = {
	hooks: ["createCombat", "updateCombat", "deleteCombat", "combatStart", "combatTurnChange", "createCombatant", "deleteCombatant"],
	/** Fonctions de base, réutilisables par VTT Deck Pro */
	FUNCTIONS: COMBAT_FN,
	needsPro(s) {
		const fn = s.fn ?? "next";
		return fn !== "round" && !(fn in COMBAT_FN);
	},
	render(s) {
		if (this.needsPro(s)) return lockedSpec();
		const combat = game.combat;
		const fn = s.fn ?? "next";
		if (fn === "round") {
			if (!combat) return { big: "—", text: [t("Keys.NoCombat")], dim: true };
			const turns = visibleTurns(combat);
			const idx = combat.combatant ? turns.findIndex((c) => c.id === combat.combatant.id) + 1 : 0;
			return {
				big: combat.started ? `R${combat.round}` : "R0",
				text: [combat.started ? t("Keys.TurnOf", { n: idx || "?", total: turns.length }) : t("Keys.NotStarted")],
				vars: { round: combat.round, turn: idx }
			};
		}
		const def = COMBAT_FN[fn];
		let dim = false;
		if (["next", "prev", "nextRound", "prevRound", "end"].includes(fn)) dim = !combat?.started;
		if (fn === "start") dim = !!combat?.started;
		if (fn === "rollAll" || fn === "rollNPC") dim = !combat;
		return { icon: def.icon, text: [t(def.key)], dim, vars: { round: combat?.round } };
	},
	async press(s) {
		if (this.needsPro(s)) failPro();
		const fn = s.fn ?? "next";
		let combat = game.combat;
		if (fn === "round") {
			ui.sidebar?.expand?.();
			return ui.sidebar?.changeTab?.("combat", "primary");
		}
		if (COMBAT_FN[fn]?.gm) requireGM();
		if (fn === "start") {
			if (!combat) {
				// Pas de rencontre : on la crée à partir des jetons sélectionnés
				const docs = canvasReady() ? canvas.tokens.controlled.map((tk) => tk.document) : [];
				if (!docs.length) fail("Errors.NoCombatNoSelection");
				await toggleCombat(docs);
				combat = game.combat;
			}
			return combat?.startCombat();
		}
		if (!combat) fail("Errors.NoCombat");
		switch (fn) {
			case "next":
				return combat.nextTurn();
			case "prev":
				return combat.previousTurn();
			case "nextRound":
				return combat.nextRound();
			case "prevRound":
				return combat.previousRound();
			case "end":
				return combat.endCombat();
			case "rollAll":
				return combat.rollAll();
			case "rollNPC":
				return combat.rollNPC();
		}
	}
};

/* ------------------------------------------------------------------ */
/*  PLAYLISTS / SONS                                                   */
/* ------------------------------------------------------------------ */
const basename = (p = "") => decodeURIComponent(p.split("/").pop() ?? "").replace(/\.[^.]+$/, "");

const playlistAction = {
	hooks: ["createPlaylist", "updatePlaylist", "deletePlaylist", "createPlaylistSound", "updatePlaylistSound", "deletePlaylistSound"],
	find(s) {
		return game.playlists.get(s.playlistId) ?? (s.playlistIdName ? game.playlists.getName(s.playlistIdName) : null);
	},
	render(s) {
		const mode = s.mode ?? "playlist";
		if (mode === "stopAll") {
			const any = game.playlists.playing?.length > 0;
			return { icon: "⏹️", text: [t("Keys.StopAll")], dim: !any };
		}
		if (mode === "file") {
			return { icon: "🔔", text: [s.src ? basename(s.src) : t("Keys.ChooseFile")], dim: !s.src, badge: s.broadcast === false ? "🎧" : null };
		}
		const pl = this.find(s);
		if (!pl) return { icon: "🎵", text: [t("Keys.ChoosePlaylist")], dim: true };
		if (mode === "sound") {
			const sound = pl.sounds.get(s.soundId) ?? (s.soundIdName ? pl.sounds.getName(s.soundIdName) : null);
			if (!sound) return { icon: "🎵", text: [t("Keys.ChooseSound")], dim: true };
			return {
				icon: sound.playing ? "🔊" : "🔈",
				text: [sound.name],
				border: sound.playing ? BORDER.active : null,
				vars: { name: sound.name }
			};
		}
		return {
			icon: pl.playing ? "🎶" : "🎵",
			text: [pl.name],
			border: pl.playing ? BORDER.active : null,
			badge: pl.playing ? "▶" : null,
			vars: { name: pl.name }
		};
	},
	async press(s) {
		const mode = s.mode ?? "playlist";
		if (mode === "file") {
			if (!s.src) fail("Errors.ChooseFile");
			const volume = Math.max(0, Math.min(100, Number(s.volume ?? 80))) / 100;
			return foundry.audio.AudioHelper.play({ src: s.src, volume, autoplay: true, loop: false }, s.broadcast !== false);
		}
		if (mode === "stopAll") {
			for (const p of game.playlists.playing ?? []) await p.stopAll();
			return;
		}
		const pl = this.find(s);
		if (!pl) fail("Errors.PlaylistMissing");
		if (mode === "sound") {
			const sound = pl.sounds.get(s.soundId) ?? (s.soundIdName ? pl.sounds.getName(s.soundIdName) : null);
			if (!sound) fail("Errors.SoundMissing");
			return sound.playing ? pl.stopSound(sound) : pl.playSound(sound);
		}
		return pl.playing ? pl.stopAll() : pl.playAll();
	}
};

/* ------------------------------------------------------------------ */
/*  SYSTÈME                                                            */
/* ------------------------------------------------------------------ */
const CONTROL_ICONS = {
	tokens: "🧍", token: "🧍", templates: "📐", measure: "📐", tiles: "🖼️", drawings: "✏️", walls: "🧱",
	lighting: "💡", sounds: "🔊", regions: "⬡", notes: "📌"
};
const TAB_ICONS = {
	chat: "💬", combat: "⚔️", scenes: "🗺️", actors: "👥", items: "🎒", journal: "📖", tables: "🎲",
	cards: "🃏", macros: "⚡", playlists: "🎵", compendium: "📚", settings: "⚙️"
};

function activeSidebarTab() {
	return ui.sidebar?.tabGroups?.primary ?? ui.sidebar?.activeTab ?? null;
}

function findControl(name) {
	return list(ui.controls?.controls).find((c) => c.name === name) ?? null;
}

function rollWhisper(mode) {
	if (mode === "gm") return ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
	if (mode === "self") return [game.user.id];
	return [];
}

const systemAction = {
	hooks: ["pauseGame", "renderSceneControls", "activateCanvasLayer", "changeSidebarTab", "collapseSidebar", "updateScene", "canvasReady", "createRollTable", "updateRollTable", "deleteRollTable"],
	render(s) {
		const fn = s.fn ?? "pause";
		switch (fn) {
			case "pause":
				return {
					icon: game.paused ? "▶️" : "⏸️",
					text: [game.paused ? t("Keys.Resume") : t("Keys.Pause")],
					border: game.paused ? BORDER.alert : null
				};
			case "control": {
				const ctrl = findControl(s.control);
				if (!ctrl) return { icon: "🛠️", text: [t("Keys.ChooseControl")], dim: true };
				const tool = s.tool ? list(ctrl.tools).find((x) => x.name === s.tool) : null;
				const activeCtrl = ui.controls?.control?.name;
				const activeTool = ui.controls?.tool?.name ?? ui.controls?.activeTool;
				const on = activeCtrl === s.control && (!s.tool || activeTool === s.tool);
				return {
					icon: CONTROL_ICONS[s.control] ?? "🛠️",
					text: [loc(ctrl.title), tool ? loc(tool.title) : null],
					border: on ? BORDER.selected : null
				};
			}
			case "sidebar": {
				const tab = s.tab ?? "chat";
				return {
					icon: TAB_ICONS[tab] ?? "📑",
					text: [t(`Tabs.${tab}`)],
					border: activeSidebarTab() === tab ? BORDER.selected : null
				};
			}
			case "roll":
				return { icon: "🎲", text: [s.formula || t("Keys.ChooseFormula")], dim: !s.formula, badge: s.rollMode === "gm" ? "MJ" : s.rollMode === "self" ? "🔒" : null };
			case "table": {
				const tbl = game.tables.get(s.tableId) ?? (s.tableIdName ? game.tables.getName(s.tableIdName) : null);
				if (!tbl) return { icon: "📜", text: [t("Keys.ChooseTable")], dim: true };
				return { image: tbl.img, fit: "contain", icon: "📜", text: [tbl.name], vars: { name: tbl.name } };
			}
			case "chat":
				return { icon: "💬", text: [s.message || t("Keys.ChooseMessage")], dim: !s.message, badge: s.whisperGM ? "MJ" : null };
			case "darkness": {
				const target = Math.max(0, Math.min(100, Number(s.darkness ?? 100))) / 100;
				const scene = canvasReady() ? canvas.scene : game.scenes.viewed;
				const cur = scene?.environment?.darknessLevel ?? scene?.darkness;
				return {
					icon: target >= 0.5 ? "🌙" : target > 0.1 ? "🌗" : "☀️",
					text: [`${Math.round(target * 100)} %`],
					border: cur !== undefined && Math.abs(cur - target) < 0.01 ? BORDER.current : null,
					vars: { value: Math.round(target * 100) }
				};
			}
		}
		return { icon: "❓" };
	},
	async press(s) {
		const fn = s.fn ?? "pause";
		switch (fn) {
			case "pause":
				requireGM();
				return game.togglePause(!game.paused, { broadcast: true });
			case "control": {
				if (!s.control) fail("Errors.ChooseControl");
				if (!canvasReady()) return;
				return ui.controls.activate({ control: s.control, tool: s.tool || undefined });
			}
			case "sidebar": {
				const tab = s.tab ?? "chat";
				ui.sidebar?.expand?.();
				if (ui.sidebar?.changeTab) return ui.sidebar.changeTab(tab, "primary");
				return ui.sidebar?.activateTab?.(tab);
			}
			case "roll": {
				if (!s.formula) fail("Keys.ChooseFormula");
				const roll = await new Roll(s.formula).evaluate();
				const speaker = ChatMessage.getSpeaker();
				const mode = s.rollMode ?? "current";
				if (mode === "current") return roll.toMessage({ speaker, flavor: s.label || undefined });
				return ChatMessage.implementation.create({
					speaker,
					flavor: s.label || undefined,
					rolls: [roll],
					content: String(roll.total),
					sound: CONFIG.sounds.dice,
					whisper: rollWhisper(mode)
				});
			}
			case "table": {
				const tbl = game.tables.get(s.tableId) ?? (s.tableIdName ? game.tables.getName(s.tableIdName) : null);
				if (!tbl) fail("Errors.TableMissing");
				return tbl.draw();
			}
			case "chat":
				if (!s.message) fail("Keys.ChooseMessage");
				return ChatMessage.implementation.create({
					speaker: ChatMessage.getSpeaker(),
					content: s.message,
					whisper: s.whisperGM ? ChatMessage.getWhisperRecipients("GM").map((u) => u.id) : []
				});
			case "darkness": {
				requireGM();
				const scene = canvasReady() ? canvas.scene : game.scenes.viewed;
				if (!scene) fail("Errors.SceneMissing");
				const target = Math.max(0, Math.min(100, Number(s.darkness ?? 100))) / 100;
				return scene.update({ "environment.darknessLevel": target }, { animateDarkness: 2500 });
			}
		}
	}
};


/* ------------------------------------------------------------------ */
/** Actions intégrées (VTT Deck Pro peut en remplacer certaines) */
export const BUILTIN_ACTIONS = {
	macro: macroAction,
	scene: sceneAction,
	token: tokenAction,
	combat: combatAction,
	playlist: playlistAction,
	system: systemAction
};

export function piData(what, api) {
	const byName = (a, b) => a.name.localeCompare(b.name, game.i18n.lang);
	switch (what) {
		case "macros":
			return game.macros.contents
				.filter((m) => m.visible ?? true)
				.map((m) => ({ id: m.id, name: m.name, group: m.folder?.name }))
				.sort(byName);
		case "scenes":
			return game.scenes.contents.map((s) => ({ id: s.id, name: s.navName || s.name, group: s.folder?.name })).sort(byName);
		case "actors":
			return game.actors.contents
				.filter((a) => game.user.isGM || a.isOwner)
				.map((a) => ({ id: a.id, name: a.name, group: loc(CONFIG.Actor.typeLabels?.[a.type]) || a.type }))
				.sort(byName);
		case "playlists":
			return game.playlists.contents
				.map((p) => ({
					id: p.id,
					name: p.name,
					group: p.folder?.name,
					sounds: p.sounds.contents.map((x) => ({ id: x.id, name: x.name })).sort(byName)
				}))
				.sort(byName);
		case "statuses":
			return CONFIG.statusEffects.map((e) => ({ id: e.id, name: loc(e.name ?? e.label) || e.id })).sort(byName);
		case "controls":
			return list(ui.controls?.controls).map((c) => ({
				id: c.name,
				name: loc(c.title) || c.name,
				tools: list(c.tools).map((x) => ({ id: x.name, name: loc(x.title) || x.name }))
			}));
		case "features":
			return { pro: !!api?.pro, proVersion: api?.pro?.version ?? null, version: api?.version };
		case "tables":
			return game.tables.contents.map((x) => ({ id: x.id, name: x.name, group: x.folder?.name })).sort(byName);
	}
	return [];
}

export function defaultColor(action) {
	return COLORS[action] ?? "#222";
}
