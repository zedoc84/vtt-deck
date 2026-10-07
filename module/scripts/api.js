/**
 * API publique du module : game.modules.get("vtt-deck").api
 *
 * Permet à une extension (VTT Deck Pro, ou un module tiers) de :
 *  - remplacer ou ajouter une action :  api.registerAction("token", handler)
 *  - réutiliser les outils communs :      api.helpers
 *  - se déclarer comme VTT Deck Pro :     api.registerPro({ version })
 *
 * Les extensions s'enregistrent dans le hook « vttDeck.init », appelé pendant l'init de Foundry :
 *   Hooks.once("vttDeck.init", (api) => { ... });
 */
import * as helpers from "./helpers.js";
import { MODULE_ID } from "./constants.js";

export function createApi(builtins) {
	const actions = new Map(Object.entries(builtins));
	const api = {
		version: game.modules.get(MODULE_ID)?.version,
		helpers,
		/** @type {import("./deck.js").Deck|null} créé au hook « ready » */
		deck: null,
		/** Infos sur VTT Deck Pro s'il est actif */
		pro: null,

		get actions() {
			return actions;
		},
		getAction(key) {
			return actions.get(key);
		},
		registerAction(key, handler) {
			if (!handler || typeof handler.render !== "function" || typeof handler.press !== "function")
				throw new Error(`VTT Deck | action « ${key} » invalide : render() et press() sont obligatoires`);
			actions.set(key, handler);
			api.deck?.rebuildHooks();
		},
		registerPro(info = {}) {
			api.pro = { version: info.version ?? "?" };
			console.log(`VTT Deck | VTT Deck Pro ${api.pro.version} activé`);
		},
		get isPro() {
			return !!api.pro;
		},
		restart() {
			api.deck?.restart();
		}
	};
	return api;
}
