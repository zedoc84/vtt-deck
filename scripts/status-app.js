import { MODULE_ID, PRO_URL, t } from "./constants.js";

const { ApplicationV2 } = foundry.applications.api;
const esc = (s) => foundry.utils.escapeHTML?.(String(s ?? "")) ?? String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const DEVICE_TYPES = {
	0: "Stream Deck", 1: "Stream Deck Mini", 2: "Stream Deck XL", 3: "Stream Deck Mobile", 4: "Corsair G-Keys",
	5: "Stream Deck Pedal", 6: "Corsair Voyager", 7: "Stream Deck +", 8: "SCUF", 9: "Stream Deck Neo", 10: "Stream Deck Studio"
};

/** Fenêtre « État du Stream Deck » (bouton dans les paramètres du module) */
export class StatusApp extends ApplicationV2 {
	static DEFAULT_OPTIONS = {
		id: "vtt-deck-status",
		tag: "div",
		classes: ["vtt-deck-status"],
		window: { title: "VTTDECK.Status.Title", icon: "fa-solid fa-table-cells", resizable: false },
		position: { width: 460, height: "auto" },
		actions: {
			reconnect: StatusApp.#onReconnect,
			redraw: StatusApp.#onRedraw
		}
	};

	async _renderHTML() {
		const api = game.modules.get(MODULE_ID)?.api;
		const deck = api?.deck;
		if (!deck) return `<p>${t("Status.NotReady")}</p>`;
		const pro = api.pro
			? `<span class="ok">${t("Status.ProActive", { version: esc(api.pro.version) })}</span>`
			: `${t("Status.ProMissing")}${PRO_URL ? ` — <a href="${esc(PRO_URL)}" target="_blank" rel="noopener">${t("Status.ProGet")}</a>` : ""}`;
		const b = deck.bridge;
		const mode = game.settings.get(MODULE_ID, "enabled");
		let state;
		if (b.connected) state = `<span class="ok">● ${t("Status.Connected")}</span>`;
		else if (!deck.shouldConnect) state = `<span class="off">○ ${t("Status.Disabled")}</span>`;
		else if (b.kicked) state = `<span class="warn">● ${t("Status.Replaced")}</span>`;
		else state = `<span class="ko">● ${t("Status.Waiting")}</span>`;

		const devices = [...deck.devices.values()]
			.map((d) => `<li>${esc(d.name)} <small>(${esc(DEVICE_TYPES[d.type] ?? d.type)}, ${d.size?.columns ?? "?"}×${d.size?.rows ?? "?"})</small></li>`)
			.join("");
		const counts = {};
		for (const k of deck.keys.values()) counts[k.action] = (counts[k.action] ?? 0) + 1;
		const keys = Object.entries(counts)
			.map(([a, n]) => `${esc(t(`Actions.${a}`))} : ${n}`)
			.join(" · ");

		return `
		<section class="vtt-deck-status-body">
			<p class="state">${state}</p>
			<dl>
				<dt>${t("Status.Address")}</dt><dd><code>${esc(b.url)}</code></dd>
				<dt>${t("Status.Mode")}</dt><dd>${esc(t(`Settings.Enabled.${mode}`))}</dd>
				${deck.plugin ? `<dt>${t("Status.Plugin")}</dt><dd>${esc(deck.plugin.version)}</dd>` : ""}
				<dt>${t("Status.Pro")}</dt><dd>${pro}</dd>
				${devices ? `<dt>${t("Status.Devices")}</dt><dd><ul>${devices}</ul></dd>` : ""}
				${keys ? `<dt>${t("Status.Keys")}</dt><dd>${keys}</dd>` : ""}
			</dl>
			${!b.connected && deck.shouldConnect ? `<p class="hint">${t("Status.Help")}</p>` : ""}
			<footer class="form-footer">
				<button type="button" data-action="reconnect"><i class="fa-solid fa-plug"></i> ${t("Status.Reconnect")}</button>
				<button type="button" data-action="redraw" ${b.connected ? "" : "disabled"}><i class="fa-solid fa-rotate"></i> ${t("Status.Redraw")}</button>
			</footer>
		</section>`;
	}

	_replaceHTML(result, content) {
		content.innerHTML = result;
	}

	static #onReconnect() {
		game.modules.get(MODULE_ID)?.api?.deck?.restart();
		this.render();
	}

	static #onRedraw() {
		const deck = game.modules.get(MODULE_ID)?.api?.deck;
		if (!deck) return;
		deck.signatures.clear();
		deck.renderer.clearCache();
		deck.queueAll();
	}
}
