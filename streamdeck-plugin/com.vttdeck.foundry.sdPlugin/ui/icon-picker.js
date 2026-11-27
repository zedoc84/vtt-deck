/**
 * VTT Deck — bibliothèque d'icônes game-icons.net dans l'inspecteur (réglage « Icône » de toutes les touches).
 * Recherche en français ou en anglais, catégories, aperçu ; l'icône choisie est enregistrée dans la touche
 * (nom + tracé SVG), et Foundry la dessine sur la touche. Les données (game-icons.js, ~6 Mo) ne sont chargées
 * qu'à l'ouverture du sélecteur.
 */
(function (root) {
	"use strict";

	/** Mots français → débuts de mots anglais des noms d'icônes */
	const DICT = {
		// combat
		"épée": ["sword", "broadsword", "saber", "katana"], "glaive": ["sword", "glaive"], "lame": ["blade", "sword"], "dague": ["dagger"],
		"poignard": ["dagger"], "couteau": ["knife"], "hache": ["axe", "hatchet"], "marteau": ["hammer"], "masse": ["mace"], "fléau": ["flail"],
		"lance": ["spear"], "hallebarde": ["halberd"], "arc": ["bow"], "flèche": ["arrow"], "arbalète": ["crossbow"],
		"bouclier": ["shield"], "armure": ["armor", "breastplate"], "casque": ["helm"], "gant": ["gauntlet", "glove"], "fronde": ["sling"],
		"fouet": ["whip"], "faux": ["scythe"], "trident": ["trident"], "bâton": ["staff"], "sceptre": ["scepter"], "pistolet": ["pistol", "revolver"],
		"fusil": ["rifle", "musket"], "canon": ["cannon"], "bombe": ["bomb"], "poing": ["fist", "punch"], "coup": ["punch", "kick", "slash"],
		"griffe": ["claw"], "morsure": ["bite", "fang"], "sang": ["blood"], "blessure": ["wound", "bleed"], "mort": ["death", "dead", "skull"],
		"crâne": ["skull"], "os": ["bone"], "squelette": ["skeleton"], "cible": ["target"], "bataille": ["battle"], "duel": ["duel"],
		"attaque": ["attack", "slash", "strike"], "défense": ["shield", "defense"], "dégâts": ["damage", "impact"], "explosion": ["explosion", "blast"],
		// magie
		"magie": ["magic", "spell", "sparkles"], "sort": ["spell", "magic"], "parchemin": ["scroll"], "livre": ["book"], "grimoire": ["book", "spell-book"],
		"baguette": ["wand"], "potion": ["potion", "flask"], "fiole": ["vial", "flask"], "flacon": ["flask"], "cristal": ["crystal"], "orbe": ["orb"],
		"rune": ["rune"], "feu": ["fire", "flame"], "flamme": ["flame", "fire"], "glace": ["ice", "frost"], "gel": ["frost", "frozen"],
		"froid": ["frost", "frozen", "cold"], "foudre": ["lightning", "thunder"], "éclair": ["lightning"], "tonnerre": ["thunder"], "poison": ["poison"],
		"acide": ["acid"], "lumière": ["light", "sun"], "soleil": ["sun"], "lune": ["moon"], "étoile": ["star"], "ombre": ["shadow"],
		"ténèbres": ["dark", "shadow"], "sacré": ["holy"], "divin": ["divine", "holy"], "ange": ["angel"], "démon": ["daemon", "imp", "devil"], "diable": ["devil"],
		"invocation": ["pentagram", "portal"], "portail": ["portal", "gate"], "téléportation": ["teleport", "portal"], "soin": ["heal", "health"],
		"guérison": ["heal", "health"], "aura": ["aura"], "malédiction": ["curse", "cursed"], "âme": ["soul"], "esprit": ["spirit", "ghost"],
		"fantôme": ["ghost"], "œil": ["eye"], "yeux": ["eye"], "cerveau": ["brain"], "totem": ["totem"], "autel": ["altar"], "pentacle": ["pentacle", "pentagram"],
		"chaudron": ["cauldron"], "énergie": ["energy"], "tourbillon": ["vortex", "whirl"], "nécromancie": ["skull", "death"],
		// créatures
		"dragon": ["dragon", "wyvern"], "loup": ["wolf"], "ours": ["bear"], "araignée": ["spider"], "serpent": ["snake", "serpent"], "rat": ["rat"],
		"chauve-souris": ["bat"], "gobelin": ["goblin"], "orc": ["orc"], "troll": ["troll"], "ogre": ["ogre"], "géant": ["giant"],
		"zombie": ["zombie"], "vampire": ["vampire"], "golem": ["golem"], "gelée": ["slime"], "tentacule": ["tentacle"], "kraken": ["kraken"],
		"griffon": ["griffin"], "cheval": ["horse"], "chien": ["dog", "hound"], "chat": ["cat"], "oiseau": ["bird"], "corbeau": ["raven", "crow"],
		"aigle": ["eagle"], "hibou": ["owl"], "chouette": ["owl"], "poisson": ["fish"], "requin": ["shark"], "insecte": ["insect", "beetle", "bug"],
		"scorpion": ["scorpion"], "minotaure": ["minotaur"], "centaure": ["centaur"], "sirène": ["mermaid", "siren"], "fée": ["fairy"],
		"elfe": ["elf"], "nain": ["dwarf"], "monstre": ["monster"], "bête": ["beast"], "hydre": ["hydra"], "licorne": ["unicorn"],
		"wyverne": ["wyvern"], "lion": ["lion"], "tigre": ["tiger"], "sanglier": ["boar"], "cerf": ["deer", "stag"],
		"abeille": ["bee"], "fourmi": ["ant"], "crapaud": ["toad", "frog"], "grenouille": ["frog"],
		// états et soins
		"cœur": ["heart"], "coeur": ["heart"], "vie": ["heart", "health", "life"], "sommeil": ["sleep", "sleepy", "night-sleep"], "dormir": ["sleep", "sleepy"],
		"peur": ["terror"], "charme": ["charm"], "aveugle": ["blind"], "sourd": ["ear"], "étourdi": ["knocked", "stun"],
		"fatigue": ["tired", "sleepy"], "malade": ["sick", "vomit"], "maladie": ["virus", "plague", "sick"], "saignement": ["bleed", "blood"],
		"brûlure": ["burn", "fire"], "gelé": ["frozen"], "invisible": ["invisible"], "prison": ["prison", "cage"], "chaîne": ["chain"],
		"bandage": ["bandage"], "pansement": ["bandage"], "médecine": ["medic", "pill", "medical"], "terre": ["earth", "ground"],
		// objets
		"coffre": ["chest"], "trésor": ["treasure", "chest"], "or": ["gold"], "pièce": ["coin"], "argent": ["coin", "silver", "money"],
		"gemme": ["gem"], "joyau": ["jewel", "gem"], "diamant": ["diamond"], "bague": ["ring"], "anneau": ["ring"], "amulette": ["pendant", "necklace"],
		"collier": ["necklace"], "couronne": ["crown"], "clé": ["key"], "clef": ["key"], "serrure": ["lock"], "cadenas": ["padlock"],
		"sac": ["bag", "knapsack"], "corde": ["rope"], "torche": ["torch"], "lanterne": ["lantern"], "bougie": ["candle"],
		"carte": ["map", "card"], "boussole": ["compass"], "sablier": ["hourglass"], "horloge": ["clock"], "cloche": ["bell"],
		"pain": ["bread"], "viande": ["meat", "ham"], "bière": ["beer"], "vin": ["wine"], "chope": ["beer", "mug"], "repas": ["meal", "food"],
		"outil": ["tool"], "échelle": ["ladder"], "piège": ["trap"], "tonneau": ["barrel"], "caisse": ["crate"], "lettre": ["letter", "envelope"],
		"plume": ["quill", "feather"], "papier": ["paper"], "miroir": ["mirror"], "lunette": ["spyglass", "telescope"], "loupe": ["magnifying"],
		"enclume": ["anvil"], "pioche": ["mining", "war-pick"], "tente": ["tent"],
		// lieux
		"château": ["castle"], "tour": ["tower"], "porte": ["door", "gate"], "mur": ["wall"], "pont": ["bridge"], "maison": ["house", "home"],
		"village": ["village"], "ville": ["city"], "taverne": ["tavern", "beer"], "auberge": ["inn", "tavern"], "église": ["church"],
		"temple": ["temple"], "donjon": ["dungeon", "castle"], "grotte": ["cave"], "caverne": ["cave"], "montagne": ["mountain"],
		"forêt": ["forest", "tree"], "arbre": ["tree"], "rivière": ["river"], "mer": ["sea", "wave"], "île": ["island"],
		"désert": ["desert"], "marais": ["swamp"], "ruine": ["ruin"], "tombe": ["tomb", "grave"], "tombeau": ["tomb"], "cimetière": ["graveyard", "tomb", "grave"],
		"escalier": ["stair"], "puits": ["well"], "camp": ["camp"], "feu de camp": ["campfire"], "bateau": ["boat", "ship"], "navire": ["ship"],
		"chariot": ["cart", "wagon"], "route": ["road", "path"], "chemin": ["path", "road"], "trône": ["throne"],
		// nature et météo
		"pluie": ["rain"], "neige": ["snow"], "nuage": ["cloud"], "vent": ["wind"], "tempête": ["storm"], "brouillard": ["fog"],
		"nuit": ["night", "moon"], "jour": ["sun", "sunrise"], "arc-en-ciel": ["rainbow"], "tornade": ["tornado"], "volcan": ["volcano"],
		"feuille": ["leaf"], "fleur": ["flower"], "plante": ["plant", "herb"], "herbe": ["herb", "grass"], "champignon": ["mushroom"],
		"pierre": ["stone"], "rocher": ["rock"], "eau": ["water", "drop"], "vague": ["wave"], "météo": ["cloud", "rain", "snow", "storm"],
		// musique et sons
		"musique": ["music", "musical"], "tambour": ["drum"], "harpe": ["harp"], "luth": ["lyre"], "flûte": ["flute"], "cor": ["horn"],
		"trompette": ["trumpet"], "violon": ["violin"], "guitare": ["guitar"], "haut-parleur": ["speaker"], "son": ["sound", "speaker"],
		"oreille": ["ear"], "chant": ["sing", "music"], "silence": ["silence", "mute"],
		// dés et jeu
		"dé": ["dice", "d4", "d10", "d12"], "dés": ["dice", "d4", "d10", "d12"], "jeton": ["token", "pawn"], "pion": ["pawn"],
		"échecs": ["chess"], "roi": ["king"], "reine": ["queen"], "trophée": ["trophy"], "médaille": ["medal"], "drapeau": ["flag"],
		"bannière": ["banner"], "lecture": ["play"], "coche": ["check"], "croix": ["cross"], "question": ["help", "uncertainty"], "engrenage": ["gear", "cog"],
		"réglage": ["cog", "gear", "settings"], "recherche": ["magnifying"], "appareil photo": ["camera"], "écran": ["screen"],
		"rang": ["rank"], "victoire": ["trophy", "laurel"], "défaite": ["broken", "skull"],
		// personnages
		"guerrier": ["knight", "barbarian", "swordman"], "chevalier": ["knight"], "mage": ["wizard"], "magicien": ["wizard"], "sorcier": ["wizard", "warlock"],
		"sorcière": ["witch"], "voleur": ["hood", "lockpicks", "robber"], "assassin": ["assassin", "hood"], "archer": ["archer", "bow"],
		"prêtre": ["priest", "monk"], "moine": ["monk"], "princesse": ["tiara"], "pirate": ["pirate"], "ninja": ["ninja"], "samouraï": ["samurai"],
		"viking": ["viking"], "paysan": ["farmer"], "forgeron": ["anvil", "blacksmith", "smith"], "visage": ["face"], "tête": ["head"],
		"homme": ["man"], "femme": ["woman"], "enfant": ["baby"], "foule": ["team", "meeple"], "groupe": ["team", "group", "meeple"],
		"masque": ["mask"], "capuche": ["hood"], "barbe": ["beard"], "personnage": ["character", "person", "silhouette"]
	};

	/** Catégories du sélecteur : débuts de mots anglais */
	const CATEGORIES = [
		{ id: "combat", label: "Combat", stems: ["sword", "broadsword", "axe", "bow", "arrow", "shield", "spear", "dagger", "mace", "hammer", "crossbow", "helm", "helmet", "bowman", "armor", "gauntlet", "flail", "halberd", "scythe", "punch", "fist", "battle", "duel", "blade", "katana", "saber", "slash", "pistol", "musket"] },
		{ id: "magic", label: "Magie", stems: ["magic", "spell", "scroll", "wand", "potion", "crystal", "orb", "rune", "fire", "flame", "ice", "frost", "lightning", "poison", "holy", "curse", "portal", "aura", "book", "staff", "cauldron", "pentacle", "pentagram", "sparkles", "vortex", "fireball", "firebolt", "icebolt"] },
		{ id: "creatures", label: "Créatures", stems: ["dragon", "wolf", "bear", "spider", "snake", "goblin", "orc", "troll", "ogre", "giant", "zombie", "vampire", "ghost", "skeleton", "golem", "slime", "tentacle", "kraken", "griffin", "horse", "bird", "monster", "beast", "devil", "daemon", "imp", "hydra", "unicorn", "wyvern", "minotaur", "rat", "bat", "raven", "owl", "boar", "lion"] },
		{ id: "states", label: "États et soins", stems: ["heart", "heal", "health", "blood", "bleed", "poison", "sleep", "sleepy", "sick", "vomit", "wound", "bandage", "skull", "death", "stun", "knocked", "frozen", "burn", "charm", "blind", "terror", "tired", "invisible", "chain", "prison", "cage", "pill", "medical"] },
		{ id: "items", label: "Objets", stems: ["chest", "treasure", "gold", "coin", "gem", "jewel", "ring", "pendant", "necklace", "crown", "key", "lock", "padlock", "bag", "knapsack", "rope", "torch", "lantern", "candle", "map", "compass", "hourglass", "beer", "wine", "bread", "meat", "barrel", "crate", "letter", "envelope", "quill", "mirror", "spyglass", "anvil", "mining"] },
		{ id: "places", label: "Lieux", stems: ["castle", "tower", "door", "gate", "bridge", "house", "village", "city", "church", "temple", "cave", "mountain", "forest", "tree", "treehouse", "tomb", "tombstone", "doorway", "grave", "graveyard", "stair", "tent", "campfire", "ship", "boat", "cart", "wagon", "dungeon", "tavern", "ruin", "well", "throne", "island"] },
		{ id: "nature", label: "Nature et météo", stems: ["rain", "snow", "cloud", "wind", "storm", "fog", "sun", "moon", "night", "rainbow", "tornado", "volcano", "leaf", "flower", "plant", "herb", "mushroom", "stone", "rock", "water", "wave", "earth", "lightning", "sunrise", "sunset", "sunflower", "sunbeams", "snowflake", "snowman"] },
		{ id: "music", label: "Musique et sons", stems: ["music", "musical", "drum", "harp", "lyre", "flute", "horn", "trumpet", "violin", "guitar", "speaker", "sound", "bell", "ear", "sing", "piano", "mute"] },
		{ id: "game", label: "Dés et jeu", stems: ["dice", "d4", "d10", "d12", "card", "chess", "pawn", "token", "trophy", "medal", "flag", "banner", "clock", "hourglass", "pause", "play", "check", "cross", "help", "cog", "gear", "magnifying", "rank", "laurel", "abacus"] },
		{ id: "people", label: "Personnages", stems: ["wizard", "witch", "knight", "assassin", "archer", "priest", "monk", "king", "queen", "tiara", "farmer", "pirate", "ninja", "samurai", "viking", "face", "head", "hood", "person", "man", "woman", "mask", "beard", "silhouette", "barbarian", "dwarf", "elf"] }
	];

	const MAX = 96;
	const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").toLowerCase().trim();
	const NDICT = Object.entries(DICT).map(([fr, en]) => [norm(fr).trim(), en]);
	/** Le nom contient un mot qui commence par ce terme (un terme à tiret doit apparaître tel quel) */
	const segMatch = (name, stem) => (stem.includes("-") ? name.includes(stem) : name.split("-").some((x) => x.startsWith(stem)));
	/** Catégories : un mot court (4 lettres au plus) doit être le mot entier, au pluriel près (« bat » ne prend pas « battery ») */
	const SHORT_SUFFIXES = ["", "s", "es", "ed", "ing", "y"];
	const catMatch = (name, stem) => (stem.length > 4 || stem.includes("-") ? segMatch(name, stem) : name.split("-").some((x) => SHORT_SUFFIXES.some((sf) => x === stem + sf)));

	/** Groupes de termes anglais pour une recherche : chaque groupe doit trouver un mot du nom */
	function groupsFor(query) {
		let q = ` ${norm(query).replace(/\s+/g, " ")} `;
		const groups = [];
		// expressions de plusieurs mots d'abord (« feu de camp », « chauve-souris »)
		for (const [fr, en] of [...NDICT].filter(([fr]) => /[\s-]/.test(fr)).sort((a, b) => b[0].length - a[0].length)) {
			if (q.includes(` ${fr} `)) {
				groups.push(en);
				q = q.replace(` ${fr} `, " ");
			}
		}
		for (const token of q.split(/[\s-]+/).filter(Boolean)) {
			const terms = new Set();
			for (const [fr, en] of NDICT) {
				if (fr === token || (token.length >= 3 && fr.startsWith(token))) for (const e of en) terms.add(e);
			}
			// le mot tapé compte aussi (anglais), sauf un mot court déjà traduit (« dé » ne doit pas trouver « coa-de-jima »)
			if (!terms.size || token.length >= 3) terms.add(token);
			groups.push([...terms]);
		}
		return groups;
	}

	/** Noms d'icônes correspondant à la recherche et à la catégorie, les plus proches d'abord */
	function search(names, query, category) {
		const cat = CATEGORIES.find((c) => c.id === category);
		let list = cat ? names.filter((n) => cat.stems.some((st) => catMatch(n, st))) : names;
		const groups = groupsFor(query);
		if (!groups.length) return list;
		let found = list.filter((n) => groups.every((g) => g.some((t) => segMatch(n, t))));
		if (!found.length) found = list.filter((n) => groups.every((g) => g.some((t) => n.includes(t))));
		// d'abord les noms qui contiennent le mot tapé lui-même, puis une de ses traductions
		const typed = norm(query).split(/[\s-]+/).filter(Boolean);
		const exact = (n) => {
			const parts = n.split("-");
			return typed.filter((t) => parts.includes(t)).length * 2 + groups.reduce((acc, g) => acc + (g.some((t) => parts.includes(t)) ? 1 : 0), 0);
		};
		return found.sort((a, b) => exact(b) - exact(a) || a.length - b.length || a.localeCompare(b));
	}

	/* ------------------------------------------------------------------ */
	/*  Données (chargées à la demande)                                    */
	/* ------------------------------------------------------------------ */
	let loading = null;
	let lib = null;
	function load() {
		if (lib) return Promise.resolve(lib);
		loading ??= new Promise((resolve, reject) => {
			const s = document.createElement("script");
			s.src = "game-icons.js";
			s.onload = () => {
				const raw = root.VTTDECK_GAME_ICONS;
				if (!raw) return reject(new Error("game-icons.js"));
				const byName = new Map(raw.icons.map(([n, a, d]) => [n, { author: raw.authors[a] ?? "", d }]));
				lib = { names: raw.icons.map((r) => r[0]), byName };
				resolve(lib);
			};
			s.onerror = () => reject(new Error("game-icons.js"));
			document.head.append(s);
		});
		return loading;
	}

	const SVGNS = "http://www.w3.org/2000/svg";
	function svg(d) {
		const s = document.createElementNS(SVGNS, "svg");
		s.setAttribute("viewBox", "0 0 512 512");
		const p = document.createElementNS(SVGNS, "path");
		p.setAttribute("d", d);
		s.append(p);
		return s;
	}

	/* ------------------------------------------------------------------ */
	/*  Champ de l'inspecteur                                              */
	/* ------------------------------------------------------------------ */
	const ui = { open: false, query: "", category: "" };

	/**
	 * @param f   champ ({ key })
	 * @param ctx { settings, set, save, render, tr, el }
	 * @returns { input, panel }
	 */
	function field(f, ctx) {
		const { settings, set, save, render, tr, el } = ctx;
		const name = settings[f.key];
		const d = settings[`${f.key}Path`];
		const prev = el("span", { class: "iconprev" }, d ? [svg(d)] : []);
		const input = el("span", { class: "iconpick" }, [
			prev,
			el("span", { class: "iconname", text: name || tr("aucune") }),
			el("button", { type: "button", text: ui.open ? tr("Fermer") : tr("Choisir…"), onclick: () => ((ui.open = !ui.open), render()) }),
			name ? el("button", { type: "button", class: "icon", title: tr("Retirer l'icône"), text: "×", onclick: () => (set(f.key, undefined), set(`${f.key}Path`, undefined), save(), render()) }) : null
		]);
		if (!ui.open) return { input, panel: null };

		const grid = el("div", { class: "icongrid" });
		const count = el("div", { class: "note", text: tr("Chargement des icônes…") });
		const searchBox = el("input", { type: "search", value: ui.query, placeholder: tr("Rechercher (ex. épée, dragon, potion, porte)") });
		const chips = el("div", { class: "iconcats" }, [
			...[{ id: "", label: "Toutes" }, ...CATEGORIES].map((c) =>
				el("button", { type: "button", class: c.id === ui.category ? "chip on" : "chip", text: tr(c.label), onclick: () => ((ui.category = c.id), render()) })
			)
		]);
		const credit = el("div", { class: "help small", text: tr("Icônes de game-icons.net (Lorc, Delapouite et d'autres auteurs), licence CC BY 3.0.") });
		const panel = el("div", { class: "iconpanel" }, [searchBox, chips, grid, count, credit]);

		const fill = () => {
			load()
				.then(({ names, byName }) => {
					const found = search(names, ui.query, ui.category);
					grid.replaceChildren(
						...found.slice(0, MAX).map((n) => {
							const it = byName.get(n);
							return el("button", {
								type: "button",
								class: n === name ? "iconcell on" : "iconcell",
								title: it.author ? `${n} — ${it.author}` : n,
								onclick: () => {
									set(f.key, n);
									set(`${f.key}Path`, it.d);
									save();
									ui.open = false;
									render();
								}
							}, [svg(it.d)]);
						})
					);
					count.textContent = !found.length
						? tr("Aucune icône : essayez un autre mot (français ou anglais).")
						: found.length > MAX
							? `${found.length} ${tr("icônes — affinez la recherche pour voir les autres.")}`
							: `${found.length} ${tr("icônes")}`;
				})
				.catch(() => (count.textContent = tr("Bibliothèque d'icônes introuvable dans le plugin.")));
		};
		let timer = null;
		searchBox.addEventListener("input", () => {
			ui.query = searchBox.value;
			clearTimeout(timer);
			timer = setTimeout(fill, 150);
		});
		fill();
		setTimeout(() => searchBox.focus(), 0);
		return { input, panel };
	}

	const api = { field, search, groupsFor, DICT, CATEGORIES, norm };
	root.IconPicker = api;
	if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
