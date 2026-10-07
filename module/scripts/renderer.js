/**
 * Dessine les images des touches (144×144, PNG en data URL).
 *
 * Une « spec » de touche ressemble à :
 * {
 *   bg: "#222",               couleur de fond
 *   image: "path/to.webp",    image Foundry (jeton, scène, macro…)
 *   fit: "cover"|"contain",   remplissage de l'image
 *   icon: "⏭",               emoji affiché si pas d'image
 *   big: "R3",                gros texte central (si pas d'image ni d'icône)
 *   text: ["ligne 1", "…"],   bandeau de texte en bas (2 lignes max)
 *   bar: { value, max },      jauge (PV)
 *   border: "#ffcc33",        cadre coloré
 *   dim: true,                assombrit / grise la touche
 *   badge: "▶", badgeLeft: "12"
 * }
 */
const S = 144;
const FONT = `"Signika", "Roboto", "Helvetica Neue", Arial, sans-serif`;
const EMOJI_FONT = `"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif`;
const VIDEO_RE = /\.(webm|mp4|m4v|ogv)(\?.*)?$/i;

export class KeyRenderer {
	constructor() {
		this.cv = document.createElement("canvas");
		this.cv.width = this.cv.height = S;
		this.ctx = this.cv.getContext("2d");
		/** @type {Map<string, Promise<HTMLImageElement|null>>} */
		this.images = new Map();
	}

	/** Résout un chemin Foundry en URL utilisable par le navigateur */
	#url(src) {
		if (/^(https?:|data:|blob:)/i.test(src)) return src;
		try {
			return foundry.utils.getRoute(src);
		} catch {
			return src;
		}
	}

	loadImage(src) {
		if (!src) return Promise.resolve(null);
		if (this.images.has(src)) return this.images.get(src);
		const p = (async () => {
			let url;
			if (VIDEO_RE.test(src)) {
				// Jeton animé : on prend une vignette de la vidéo
				try {
					url = await game.video.createThumbnail(src, { width: S, height: S });
				} catch {
					return null;
				}
			} else url = this.#url(src);
			return new Promise((resolve) => {
				const img = new Image();
				img.crossOrigin = "anonymous";
				img.decoding = "async";
				img.onload = () => resolve(img);
				img.onerror = () => resolve(null);
				img.src = url;
			});
		})();
		this.images.set(src, p);
		if (this.images.size > 400) this.images.delete(this.images.keys().next().value);
		return p;
	}

	clearCache() {
		this.images.clear();
	}

	async draw(spec) {
		try {
			return await this.#draw(spec, true);
		} catch (err) {
			// Image « teintée » (CORS) ou illisible : on redessine sans l'image
			console.warn("VTT Deck | rendu sans image :", err?.message);
			return this.#draw({ ...spec, image: null }, false);
		}
	}

	async #draw(spec, withImage) {
		const img = withImage && spec.image ? await this.loadImage(spec.image) : null;
		const c = this.ctx;
		c.save();
		c.clearRect(0, 0, S, S);
		c.fillStyle = spec.bg || "#222";
		c.fillRect(0, 0, S, S);

		const lines = (spec.text ?? []).filter((l) => l !== undefined && l !== null && `${l}`.trim() !== "").map(String).slice(0, 2);
		// Quand la touche a un cadre, tout le contenu (jauge, texte) est dessiné à l'intérieur.
		const inset = spec.border ? 9 : 0;
		const bandH = lines.length === 0 ? 0 : lines.length === 1 ? 30 : 50;
		const bandY = S - inset - bandH;
		const contentH = bandY;
		const textW = S - 2 * inset - 10;

		// 1. image
		if (img) {
			const w = img.naturalWidth || S;
			const h = img.naturalHeight || S;
			if (spec.dim && "filter" in c) c.filter = "grayscale(1)";
			if (spec.fit === "contain") {
				const pad = 12 + inset;
				const boxW = S - pad * 2;
				const boxH = Math.max(20, contentH - pad - 6);
				const r = Math.min(boxW / w, boxH / h);
				c.drawImage(img, (S - w * r) / 2, pad + (boxH - h * r) / 2, w * r, h * r);
			} else {
				const r = Math.max(S / w, S / h);
				c.drawImage(img, (S - w * r) / 2, (S - h * r) / 2, w * r, h * r);
			}
			if ("filter" in c) c.filter = "none";
		} else if (spec.icon) {
			// 2. icône emoji
			c.font = `${spec.iconSize ?? (bandH > 30 ? 52 : 60)}px ${EMOJI_FONT}`;
			c.textAlign = "center";
			c.textBaseline = "middle";
			c.fillStyle = "#fff";
			c.fillText(spec.icon, S / 2, (contentH + inset) / 2 + 4);
		} else if (spec.big) {
			c.fillStyle = "#fff";
			c.textAlign = "center";
			c.textBaseline = "middle";
			c.font = `700 ${this.#fitSize(spec.big, 58, S - 16 - 2 * inset, 700)}px ${FONT}`;
			c.fillText(spec.big, S / 2, (contentH + inset) / 2 + 3);
		}

		// 3. voile
		if (spec.dim) {
			c.fillStyle = "rgba(0,0,0,0.5)";
			c.fillRect(0, 0, S, S);
		}

		// 4. jauge
		const max = Number(spec.bar?.max);
		if (spec.bar && Number.isFinite(max) && max > 0) {
			const pct = Math.max(0, Math.min(1, Number(spec.bar.value) / max));
			const x = 8 + inset;
			const w = S - 2 * x;
			const y = contentH - 13;
			c.fillStyle = "rgba(0,0,0,0.7)";
			c.fillRect(x, y, w, 10);
			c.fillStyle = pct > 0.5 ? "#4cc35a" : pct > 0.25 ? "#e3a21a" : "#d93b3b";
			c.fillRect(x + 1, y + 1, (w - 2) * pct, 8);
		}

		// 5. bandeau de texte
		if (bandH) {
			c.fillStyle = "rgba(0,0,0,0.62)";
			c.fillRect(inset, bandY, S - 2 * inset, bandH);
			c.fillStyle = "#fff";
			c.textAlign = "center";
			c.textBaseline = "middle";
			c.shadowColor = "rgba(0,0,0,0.9)";
			c.shadowBlur = 3;
			const start = lines.length === 1 ? 23 : 19;
			lines.forEach((line, i) => {
				const size = this.#fitSize(line, start, textW, 600);
				c.font = `600 ${size}px ${FONT}`;
				const txt = this.#ellipsis(line, textW);
				const y = lines.length === 1 ? bandY + bandH / 2 + 1 : bandY + 13 + i * 24;
				c.fillText(txt, S / 2, y);
			});
			c.shadowBlur = 0;
		}

		// 6. badges
		const by = 22 + inset / 2;
		if (spec.badge) this.#badge(String(spec.badge), S - 24 - inset / 2, by, spec.badgeColor ?? "rgba(0,0,0,0.72)");
		if (spec.badgeLeft !== undefined && spec.badgeLeft !== null && spec.badgeLeft !== "")
			this.#badge(String(spec.badgeLeft), 24 + inset / 2, by, "rgba(0,0,0,0.72)");

		// 7. cadre
		if (spec.border) {
			c.lineWidth = 9;
			c.strokeStyle = spec.border;
			c.strokeRect(4.5, 4.5, S - 9, S - 9);
		}

		c.restore();
		return this.cv.toDataURL("image/png");
	}

	#badge(text, x, y, bg) {
		const c = this.ctx;
		c.font = `700 18px ${FONT}, ${EMOJI_FONT}`;
		const w = Math.max(30, c.measureText(text).width + 14);
		c.fillStyle = bg;
		c.beginPath();
		if (c.roundRect) c.roundRect(x - w / 2, y - 15, w, 30, 15);
		else c.rect(x - w / 2, y - 15, w, 30);
		c.fill();
		c.fillStyle = "#fff";
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.fillText(text, x, y + 1);
	}

	#fitSize(text, start, maxW, weight = 600) {
		const c = this.ctx;
		let size = start;
		while (size > 12) {
			c.font = `${weight} ${size}px ${FONT}`;
			if (c.measureText(text).width <= maxW) break;
			size -= 1;
		}
		return size;
	}

	#ellipsis(text, maxW) {
		const c = this.ctx;
		if (c.measureText(text).width <= maxW) return text;
		let s = text;
		while (s.length > 1 && c.measureText(`${s}…`).width > maxW) s = s.slice(0, -1);
		return `${s}…`;
	}
}
