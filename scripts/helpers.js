/**
 * Outils partagés, exposés aux extensions (dont VTT Deck Pro) via
 * game.modules.get("vtt-deck").api.helpers
 */
import { BORDER, COLORS, t } from "./constants.js";

export { BORDER, COLORS, t };

export const getProperty = (o, p) => foundry.utils.getProperty(o, p);
export const loc = (s) => (s ? game.i18n.localize(s) : "");
export const list = (x) => (Array.isArray(x) ? x : Object.values(x ?? {}));

/** Erreur « normale » : affichée en avertissement, pas en erreur rouge */
export class UserError extends Error {}

export function fail(key, data) {
	throw new UserError(t(key, data));
}

export function requireGM() {
	if (!game.user.isGM) fail("Errors.GMOnly");
}

export const canvasReady = () => !!globalThis.canvas?.ready;

export function tokenImage(doc, actor) {
	return doc?.texture?.src || actor?.img || null;
}

export function panTo(token) {
	if (!token || !canvasReady()) return;
	const { x, y } = token.center;
	canvas.animatePan({ x, y, duration: 250 });
}

export function selectAndPan(token) {
	if (!token) fail("Errors.NoTokenOnScene");
	token.control({ releaseOthers: true });
	panTo(token);
}

export function toggleSheet(actor) {
	const sheet = actor?.sheet;
	if (!sheet) return;
	if (sheet.rendered) sheet.close();
	else sheet.render(true);
}

/** Ajoute ou retire des jetons du combat (crée le combat si besoin) */
export async function toggleCombat(docs) {
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

/** Combattants visibles par l'utilisateur, dans l'ordre d'initiative */
export function visibleTurns(combat) {
	return (combat?.turns ?? []).filter((c) => game.user.isGM || c.visible);
}

/** Touche verrouillée : la fonction demandée fait partie de VTT Deck Pro */
export function lockedSpec() {
	return { locked: true, icon: "🔒", text: [t("Pro.Locked")], bg: "#3b2f12", badge: "PRO", badgeColor: "rgba(200,140,20,.95)" };
}

export function failPro() {
	throw new UserError(t("Pro.Required"));
}
