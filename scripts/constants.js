export const MODULE_ID = "vtt-deck";
export const PROTOCOL = 1;
export const PRO_ID = "vtt-deck-pro";
/** Page de vente de VTT Deck Pro (à remplir : itch.io, Patreon…). Vide = pas de lien. */
export const PRO_URL = "";

/** Couleurs de fond par défaut (identiques aux icônes du plugin) */
export const COLORS = {
	macro: "#4b2d73",
	scene: "#1f5a41",
	token: "#2a2420",
	combat: "#7a2424",
	playlist: "#174e78",
	system: "#3a414c"
};

export const BORDER = {
	active: "#3fbf5f",
	viewed: "#4a8fe0",
	current: "#ffcc33",
	selected: "#ff8c1a",
	alert: "#d94f4f"
};

/** Raccourci de localisation */
export const t = (key, data) =>
	data ? game.i18n.format(`VTTDECK.${key}`, data) : game.i18n.localize(`VTTDECK.${key}`);
