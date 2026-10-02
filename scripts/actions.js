/**
 * Logique des 6 actions du Stream Deck.
 * Chaque action expose :
 *   render(settings, key) -> spec (voir renderer.js)
 *   press(settings, key)  -> exécute l'action dans Foundry
 *   hooks: noms de hooks Foundry qui doivent rafraîchir ce type de touche
 */
import { COLORS, BORDER, t } from "./constants.js";

const getProperty = (o, p) => foundry.utils.getProperty(o, p);
const loc = (s) => (s ? game.i18n.localize(s) : "");
const list = (x) => (Array.isArray(x) ? x : Object.values(x ?? {}));

class UserError extends Error {}
const fail = (key, data) => {
	throw new UserError(t(key, data));
};
const requireGM = () => {
	if (!game.user.isGM) fail("Errors.GMOnly");
};
const canvasReady = () => !!globalThis.canvas?.ready;

/* ------------------------------------------------------------------ */
/*  Outils jetons / acteurs                                            */
/* ------------------------------------------------------------------ */
function canObserve(actor) {
	if (game.user.isGM) return true;
	return actor?.testUserPermission?.(game.user, "OBSERVER") ?? false;
}

/** Infos de barre (bar1/bar2) quel que soit le système */
function barInfo(tokenDoc, actor, bar = "bar1") {
	try {
		const b = tokenDoc?.getBarAttribute?.(bar);
		if (b) return b;
	} catch {
		/* jeton sans barre */
	}
	const attr = actor?.prototypeToken?.[bar]?.attribute;
	if (!attr) return null;
	const v = getProperty(actor.system, attr);
	if (v && typeof v === "object" && "value" in v)
		return { type: "bar", attribute: attr, value: Number(v.value), max: Number(v.max) };
	if (v !== undefined) return { type: "value", attribute: attr, value: v };
	return null;
}

function barText(b) {
	if (!b) return null;
	if (b.type === "bar" && Number.isFinite(Number(b.max))) return `${b.value ?? "?"}/${b.max}`;
	return `${b.value ?? "?"}`;
}

function attrValue(actor, path) {
	if (!actor || !path) return null;
	let v = getProperty(actor, path);
	if (v === undefined) v = getProperty(actor.system ?? {}, path);
	if (v && typeof v === "object") v = "value" in v ? v.value : "total" in v ? v.total : JSON.stringify(v);
	return v ?? null;
}

function resolveToken(s) {
	const target = s.target ?? "selected";
	if (target === "turn") {
		const c = game.combat?.combatant;
		return { token: c?.token?.object ?? null, doc: c?.token ?? null, actor: c?.actor ?? null };
	}
	if (target === "actor") {
		const base = game.actors.get(s.actorId) ?? (s.actorIdName ? game.actors.getName(s.actorIdName) : null);
		let token = null;
		if (canvasReady() && base) {
			const all = canvas.tokens.placeables.filter((tk) => tk.actor?.id === base.id);
			token = all.find((tk) => tk.controlled) ?? all[0] ?? null;
		}
		return { token, doc: token?.document ?? null, actor: token?.actor ?? base };
	}
	const token = canvasReady() ? canvas.tokens.controlled[0] ?? null : null;
	return { token, doc: token?.document ?? null, actor: token?.actor ?? null };
}

function tokenImage(doc, actor) {
	return doc?.texture?.src || actor?.img || null;
}

function panTo(token) {
	if (!token || !canvasReady()) return;
	const { x, y } = token.center;
	canvas.animatePan({ x, y, duration: 250 });
}

function selectAndPan(token) {
	if (!token) fail("Errors.NoTokenOnScene");
	token.control({ releaseOthers: true });
	panTo(token);
}

function toggleSheet(actor) {
	const sheet = actor?.sheet;
	if (!sheet) return;
	if (sheet.rendered) sheet.close();
	else sheet.render(true);
}

/** Spec d'un combattant / jeton (image, nom ou PV, jauge) */
function figureSpec({ doc, actor, name, img, display, showBar }) {
	const visible = canObserve(actor);
	const b1 = barInfo(doc, actor, "bar1");
	let line;
	switch (display) {
		case "bar1":
			line = visible ? barText(b1) ?? name : name;
			break;
		case "bar2":
			line = visible ? barText(barInfo(doc, actor, "bar2")) ?? name : name;
			break;
		case "none":
			line = null;
			break;
		default:
			line = name;
	}
	return {
		image: img,
		fit: "cover",
		text: [line],
		bar: showBar !== false && visible && b1?.type === "bar" ? { value: b1.value, max: b1.max } : null,
		vars: { name, value: b1?.value, max: b1?.max }
	};
}

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
/*  JETON                                                              */
/* ------------------------------------------------------------------ */
const TOKEN_HOOKS = [
	"controlToken", "updateToken", "createToken", "deleteToken", "updateActor", "targetToken", "canvasReady",
	"createActiveEffect", "updateActiveEffect", "deleteActiveEffect",
	"updateCombat", "deleteCombat", "createCombatant", "updateCombatant", "deleteCombatant"
];

const tokenAction = {
	hooks: TOKEN_HOOKS,
	render(s) {
		const { token, doc, actor } = resolveToken(s);
		if (!token && !actor) {
			const label = (s.target ?? "selected") === "turn" ? t("Keys.NoCombatant") : t("Keys.NoToken");
			return { icon: "👤", text: [label], dim: true };
		}
		const name = doc?.name ?? actor?.name ?? "?";
		const display = s.display ?? "name";
		const spec = figureSpec({
			doc,
			actor,
			name,
			img: tokenImage(doc, actor),
			display: display === "path" ? "none" : display,
			showBar: s.showBar
		});
		if (display === "path") {
			const v = canObserve(actor) ? attrValue(actor, s.path) : null;
			spec.text = [v === null ? name : `${v}`];
			spec.vars.value = v;
		}
		if (doc?.hidden) spec.dim = true;
		if (token?.controlled && (s.target ?? "selected") !== "selected") spec.border = BORDER.selected;

		switch (s.onPress ?? "select") {
			case "status": {
				const eff = CONFIG.statusEffects.find((e) => e.id === s.statusId);
				const active = !!actor?.statuses?.has(s.statusId);
				if (eff) {
					spec.image = eff.img ?? eff.icon;
					spec.fit = "contain";
					spec.text = [loc(eff.name ?? eff.label), display === "none" ? null : name];
				}
				spec.dim = !active;
				spec.border = active ? BORDER.selected : null;
				spec.bar = null;
				break;
			}
			case "target":
				if (token?.isTargeted) spec.border = BORDER.alert;
				spec.badge = "🎯";
				break;
			case "hp": {
				const d = Number(s.delta ?? -1);
				spec.badge = d > 0 ? `+${d}` : `${d}`;
				spec.badgeColor = d > 0 ? "rgba(40,140,60,.9)" : "rgba(170,40,40,.9)";
				break;
			}
			case "combat":
				if (doc?.inCombat) spec.border = BORDER.current;
				spec.badge = "⚔";
				break;
			case "hide":
				spec.badge = doc?.hidden ? "🙈" : "👁";
				break;
		}
		return spec;
	},
	async press(s) {
		const { token, doc, actor } = resolveToken(s);
		switch (s.onPress ?? "select") {
			case "select":
				return selectAndPan(token);
			case "pan":
				if (!token) fail("Errors.NoTokenOnScene");
				return panTo(token);
			case "sheet":
				if (!actor) fail("Errors.NoToken");
				return toggleSheet(actor);
			case "target":
				if (!token) fail("Errors.NoTokenOnScene");
				return token.setTarget(!token.isTargeted, { releaseOthers: false });
			case "hide":
				requireGM();
				if (!doc) fail("Errors.NoTokenOnScene");
				return doc.update({ hidden: !doc.hidden });
			case "status":
				if (!actor) fail("Errors.NoToken");
				if (!s.statusId) fail("Errors.ChooseStatus");
				return actor.toggleStatusEffect(s.statusId);
			case "hp": {
				if (!actor) fail("Errors.NoToken");
				const b = barInfo(doc, actor, "bar1");
				if (!b?.attribute) fail("Errors.NoBar");
				return actor.modifyTokenAttribute(b.attribute, Number(s.delta ?? -1), true, true);
			}
			case "combat":
				if (!doc) fail("Errors.NoTokenOnScene");
				return toggleCombat([doc]);
		}
	}
};

async function toggleCombat(docs) {
	const cls = docs[0]?.constructor;
	const inCombat = docs.filter((d) => d.inCombat);
	const out = docs.filter((d) => !d.inCombat);
	if (inCombat.length) {
		if (cls?.deleteCombatants) await cls.deleteCombatants(inCombat);
		else for (const d of inCombat) await d.toggleCombatant?.();
	}
	if (out.length) {
		if (cls?.createCombatants) await cls.createCombatants(out);
		else for (const d of out) await d.toggleCombatant?.();
	}
}

/* ------------------------------------------------------------------ */
/*  COMBAT                                                             */
/* ------------------------------------------------------------------ */
const COMBAT_FN = {
	next: { icon: "⏭️", key: "Keys.NextTurn", gm: false },
	prev: { icon: "⏮️", key: "Keys.PrevTurn", gm: true },
	nextRound: { icon: "⏩", key: "Keys.NextRound", gm: true },
	prevRound: { icon: "⏪", key: "Keys.PrevRound", gm: true },
	start: { icon: "⚔️", key: "Keys.StartCombat", gm: true },
	end: { icon: "🏁", key: "Keys.EndCombat", gm: true },
	rollAll: { icon: "🎲", key: "Keys.RollAll", gm: true },
	rollNPC: { icon: "🎲", key: "Keys.RollNPC", gm: true },
	toggleCombat: { icon: "⚔️", key: "Keys.ToggleCombat", gm: false }
};

function visibleTurns(combat) {
	return (combat?.turns ?? []).filter((c) => game.user.isGM || c.visible);
}

function combatantSpec(c, s, combat) {
	const spec = figureSpec({
		doc: c.token,
		actor: c.actor,
		name: c.name,
		img: c.img || c.token?.texture?.src || c.actor?.img,
		display: s.display === "init" ? "none" : s.display ?? "name",
		showBar: s.showBar
	});
	if (s.display === "init") spec.text = [c.initiative ?? "—"];
	else spec.badgeLeft = c.initiative ?? "";
	if (combat?.combatant?.id === c.id && combat.started) spec.border = BORDER.current;
	if (c.isDefeated ?? c.defeated) (spec.dim = true), (spec.badge = "☠");
	else if (c.hidden) spec.badge = "🙈";
	spec.vars.round = combat?.round;
	return spec;
}

function combatantPress(c, s) {
	const token = c?.token?.object;
	switch (s.slotPress ?? "select") {
		case "pan":
			return panTo(token);
		case "sheet":
			return toggleSheet(c?.actor);
		case "none":
			return;
		default:
			if (!token) fail("Errors.NoTokenOnScene");
			return selectAndPan(token);
	}
}

const combatAction = {
	hooks: [
		"createCombat", "updateCombat", "deleteCombat", "combatStart", "combatTurnChange",
		"createCombatant", "updateCombatant", "deleteCombatant", "updateToken", "updateActor", "canvasReady", "controlToken"
	],
	render(s) {
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
		if (fn === "turn") {
			const c = combat?.started ? combat.combatant : null;
			if (!c) return { icon: "⌛", text: [t("Keys.NoCombatant")], dim: true };
			if (!game.user.isGM && !c.visible) return { icon: "❔", text: ["???"] };
			return combatantSpec(c, s, combat);
		}
		if (fn === "slot") {
			const n = Math.max(1, Number(s.slot ?? 1));
			const c = visibleTurns(combat)[n - 1];
			if (!c) return { big: `${n}`, text: [], dim: true };
			return combatantSpec(c, s, combat);
		}
		const def = COMBAT_FN[fn] ?? COMBAT_FN.next;
		let dim = false;
		if (["next", "prev", "nextRound", "prevRound", "end"].includes(fn)) dim = !combat?.started;
		if (fn === "start") dim = !!combat?.started;
		if (fn === "rollAll" || fn === "rollNPC") dim = !combat;
		return { icon: def.icon, text: [t(def.key)], dim, vars: { round: combat?.round } };
	},
	async press(s) {
		const fn = s.fn ?? "next";
		let combat = game.combat;
		if (fn === "slot") {
			const c = visibleTurns(combat)[Math.max(1, Number(s.slot ?? 1)) - 1];
			if (c) return combatantPress(c, s);
			return;
		}
		if (fn === "turn") return combatantPress(combat?.combatant, s);
		if (fn === "round") {
			ui.sidebar?.expand?.();
			return ui.sidebar?.changeTab?.("combat", "primary");
		}
		if (fn === "toggleCombat") {
			const docs = canvasReady() ? canvas.tokens.controlled.map((tk) => tk.document) : [];
			if (!docs.length) fail("Errors.NoSelection");
			return toggleCombat(docs);
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
export const ACTIONS = {
	macro: macroAction,
	scene: sceneAction,
	token: tokenAction,
	combat: combatAction,
	playlist: playlistAction,
	system: systemAction
};

export { UserError };

/** Données pour les listes déroulantes de l'inspecteur Stream Deck */
export function piData(what) {
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
		case "tables":
			return game.tables.contents.map((x) => ({ id: x.id, name: x.name, group: x.folder?.name })).sort(byName);
	}
	return [];
}

export function defaultColor(action) {
	return COLORS[action] ?? "#222";
}
