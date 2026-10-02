/**
 * VTT Deck — module Foundry VTT (v13 / v14)
 * Relie Foundry au plugin Stream Deck « VTT Deck » (com.vttdeck.foundry).
 */
import { MODULE_ID } from "./constants.js";
import { Deck } from "./deck.js";
import { StatusApp } from "./status-app.js";

Hooks.once("init", () => {
	const restart = () => game.modules.get(MODULE_ID)?.api?.restart();

	game.settings.registerMenu(MODULE_ID, "status", {
		name: "VTTDECK.Settings.Status.Name",
		label: "VTTDECK.Settings.Status.Label",
		hint: "VTTDECK.Settings.Status.Hint",
		icon: "fa-solid fa-table-cells",
		type: StatusApp,
		restricted: false
	});

	game.settings.register(MODULE_ID, "enabled", {
		name: "VTTDECK.Settings.Enabled.Name",
		hint: "VTTDECK.Settings.Enabled.Hint",
		scope: "client",
		config: true,
		type: String,
		choices: {
			auto: "VTTDECK.Settings.Enabled.auto",
			on: "VTTDECK.Settings.Enabled.on",
			off: "VTTDECK.Settings.Enabled.off"
		},
		default: "auto",
		onChange: restart
	});

	game.settings.register(MODULE_ID, "host", {
		name: "VTTDECK.Settings.Host.Name",
		hint: "VTTDECK.Settings.Host.Hint",
		scope: "client",
		config: true,
		type: String,
		default: "127.0.0.1",
		onChange: restart
	});

	game.settings.register(MODULE_ID, "port", {
		name: "VTTDECK.Settings.Port.Name",
		hint: "VTTDECK.Settings.Port.Hint",
		scope: "client",
		config: true,
		type: Number,
		default: 3006,
		onChange: restart
	});

	game.settings.register(MODULE_ID, "notify", {
		name: "VTTDECK.Settings.Notify.Name",
		hint: "VTTDECK.Settings.Notify.Hint",
		scope: "client",
		config: true,
		type: Boolean,
		default: true
	});
});

Hooks.once("ready", () => {
	const deck = new Deck();
	const mod = game.modules.get(MODULE_ID);
	mod.api = deck;
	deck.start();
	console.log(`VTT Deck | prêt (v${mod.version}) — connexion ${deck.shouldConnect ? "activée" : "désactivée"} sur ce navigateur`);
});
