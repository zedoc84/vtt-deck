/* VTT Deck — inspecteur de propriétés (une seule page pour toutes les actions) */
"use strict";

let ws = null;
let piUUID = null;
let actionUUID = null;
let settings = {};
/** « Keypad » (touche) ou « Encoder » (molette du Stream Deck + / + XL) */
let controller = "Keypad";
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
	"Gratuit : le jeton sélectionné (image, nom, sélection, fiche). ★ Premium : personnages précis, PV et jauge (barre 1 du jeton, tous systèmes), états, ±PV, cibler, cacher.": "Free: the selected token (image, name, select, sheet). ★ Premium: specific characters, HP and gauge (token bar 1, any system), conditions, ±HP, target, hide.",
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
	"Pilotage du combat. ★ Premium : une touche « Combattant n° » par place construit une rangée d'initiative.": "Combat controls. ★ Premium: one \"Combatant #\" key per place builds an initiative row.",
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
	"Fonction de VTT Deck Premium : sans lui, la touche affichera 🔒.": "VTT Deck Premium feature: without it, the key shows 🔒.",
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
	"Pilotage du combat. ★ Premium : « Suivi d'initiative automatique » — copiez la même touche sur une rangée, elle se remplit toute seule dans l'ordre du combat.": "Combat controls. ★ Premium: \"Automatic initiative tracker\" — copy the same key along a row and it fills itself in combat order.",
	"Suivi d'initiative automatique": "Automatic initiative tracker",
	"Ordre": "Order",
	"Toutes les touches « Suivi automatique » de ce Stream Deck forment une rangée, lue ligne par ligne. S'il y a plus de combattants que de touches, la dernière affiche la suite.": "All \"automatic tracker\" keys on this Stream Deck form one row, read line by line. If there are more combatants than keys, the last key shows the rest.",
	"Combattant actif en premier": "Active combatant first",
	"Ordre d'initiative": "Initiative order",
	"Une touche par rôle : chiffres, montant, Dégâts, Soins… Dégâts et Soins modifient la barre 1 (PV) de tous les jetons sélectionnés, ou ciblés s'il n'y en a pas.": "One key per role: digits, amount, Damage, Healing… Damage and Healing change bar 1 (HP) of every selected token, or targeted tokens if none is selected.",
	"Rôle": "Role",
	"Montant (appui = remise à zéro)": "Amount (press = reset)",
	"Dégâts": "Damage",
	"Soins": "Healing",
	"Ajouter une valeur (+N)": "Add a value (+N)",
	"Effacer": "Clear",
	"Effacer le dernier chiffre": "Delete last digit",
	"Valeur": "Value",
	"ex. 1, 5, 10": "e.g. 1, 5, 10",
	"Jetons": "Tokens",
	"Sélectionnés, sinon ciblés": "Selected, otherwise targeted",
	"Jetons sélectionnés": "Selected tokens",
	"Jetons ciblés": "Targeted tokens",
	"confirmer dans Foundry": "confirm in Foundry",
	"Un appui (MJ) : coupe les autres playlists, affiche la scène, règle obscurité et météo, lance la playlist. Cadre vert = ambiance en place.": "One press (GM): stops other playlists, shows the scene, sets darkness and weather, starts the playlist. Green border = ambience in place.",
	"(aucune)": "(none)",
	"arrêter les autres playlists": "stop other playlists",
	"régler l'obscurité": "set darkness",
	"Niveau": "Level",
	"Météo": "Weather",
	"(inchangée)": "(unchanged)",
	"Aucune (temps clair)": "None (clear sky)",
	"exécutée en dernier (facultatif)": "run last (optional)",
	"Copiez la même touche « Élément » sur plusieurs emplacements : elles se remplissent toutes seules, ligne par ligne, avec le contenu du dossier. Une touche « Page suivante » réglée sur le même dossier fait défiler.": "Copy the same \"Item\" key to several places: they fill themselves, line by line, with the folder's content. A \"Next page\" key set to the same folder scrolls through it.",
	"Contenu": "Content",
	"Macros d'un dossier": "Macros from a folder",
	"Scènes d'un dossier": "Scenes from a folder",
	"Playlists d'un dossier": "Playlists from a folder",
	"Pistes d'une playlist": "Tracks from a playlist",
	"Dossier": "Folder",
	"(toutes les macros)": "(all macros)",
	"(toutes les scènes)": "(all scenes)",
	"(toutes les playlists)": "(all playlists)",
	"Élément (se remplit tout seul)": "Item (fills itself)",
	"Page suivante": "Next page",
	"Page précédente": "Previous page",
	"Action de VTT Deck Premium : sans lui, la touche affichera 🔒.": "VTT Deck Premium action: without it, the key shows 🔒.",
	"Profils prêts à l'emploi": "Ready-made profiles",
	"Ouvrir": "Open",
	"Affiche sur ce Stream Deck le profil « VTT Deck – Exploration » ou « VTT Deck – Combat » fourni avec le plugin. Vous pouvez ensuite le modifier comme n'importe quel profil.": "Shows the \"VTT Deck – Exploration\" or \"VTT Deck – Combat\" profile bundled with the plugin on this Stream Deck. You can then edit it like any other profile.",
	"Niveau supérieur (Foundry v14)": "Level up (Foundry v14)",
	"Niveau inférieur (Foundry v14)": "Level down (Foundry v14)",
	"Gratuit : le jeton sélectionné (image, nom, sélection, fiche). ★ Premium : personnages précis, vue du groupe, PV et jauge (barre 1 du jeton, tous systèmes), icônes des états, ±PV, cibler, cacher, déplacer, pivoter, altitude, niveaux.": "Free: the selected token (image, name, select, sheet). ★ Premium: specific characters, party view, HP and gauge (token bar 1, any system), condition icons, ±HP, target, hide, move, rotate, elevation, levels.",
	"États": "Conditions",
	"afficher les icônes des états actifs": "show active condition icons",
	"Déplacer d'une case": "Move one square",
	"Pivoter": "Rotate",
	"Changer l'altitude": "Change elevation",
	"Monter d'un niveau (Foundry v14)": "Go up a level (Foundry v14)",
	"Descendre d'un niveau (Foundry v14)": "Go down a level (Foundry v14)",
	"Direction": "Direction",
	"Déplace tous les jetons sélectionnés ; les murs bloquent les joueurs.": "Moves every selected token; walls block players.",
	"↑ Haut": "↑ Up",
	"↓ Bas": "↓ Down",
	"← Gauche": "← Left",
	"→ Droite": "→ Right",
	"↖ Haut-gauche": "↖ Up-left",
	"↗ Haut-droite": "↗ Up-right",
	"↙ Bas-gauche": "↙ Down-left",
	"↘ Bas-droite": "↘ Down-right",
	"Angle": "Angle",
	"degrés, ex. 45 ou -45": "degrees, e.g. 45 or -45",
	"ex. 5 ou -5": "e.g. 5 or -5",
	"Fondu": "Crossfade",
	"secondes de fondu enchaîné avec la musique en cours (0 = coupure sèche)": "seconds of crossfade with the music playing (0 = hard cut)",
	"Temps de jeu": "Game time",
	"Montrer une image aux joueurs": "Show an image to players",
	"Montrer un journal aux joueurs": "Show a journal to players",
	"Porte": "Door",
	"Lumière": "Light",
	"Alertes (20, 1, message privé)": "Alerts (20, 1, whisper)",
	"Effacer les cibles": "Clear targets",
	"Cibler l'ennemi suivant": "Target next enemy",
	"Un appui pose cette météo sur la scène ; un second appui l'enlève.": "One press sets this weather on the scene; a second press removes it.",
	"(aucune — temps clair)": "(none — clear sky)",
	"Temps": "Time",
	"Repos": "Rest",
	"Durée libre": "Custom duration",
	"Afficher l'heure du monde": "Show world time",
	"Heures": "Hours",
	"négatif pour reculer": "negative to go back",
	"chemin Foundry, ex. worlds/monde/carte.webp": "Foundry path, e.g. worlds/myworld/map.webp",
	"Légende": "Caption",
	"(facultatif)": "(optional)",
	"Journal": "Journal",
	"(tout le journal)": "(whole journal)",
	"Dans Foundry, sélectionnez la porte (outil Murs), puis cliquez sur « Utiliser la sélection ».": "In Foundry, select the door (Walls tool), then click \"Use selection\".",
	"Ouvrir / fermer": "Open / close",
	"Verrouiller / déverrouiller (MJ)": "Lock / unlock (GM)",
	"Dans Foundry, sélectionnez la lumière (outil Éclairage), puis cliquez sur « Utiliser la sélection ».": "In Foundry, select the light (Lighting tool), then click \"Use selection\".",
	"Alertes": "Alerts",
	"20 naturel": "natural 20",
	"1 naturel": "natural 1",
	"message privé reçu": "whisper received",
	"Origine": "From",
	"La touche clignote ; un appui l'éteint et ouvre le chat.": "The key blinks; a press clears it and opens the chat.",
	"seulement les jets des joueurs": "players' rolls only",
	"Cibles": "Targets",
	"inclure les jetons neutres": "include neutral tokens",
	"Vue": "View",
	"centrer sur la cible": "centre on the target",
	"secondes de fondu enchaîné (0 = coupure sèche)": "seconds of crossfade (0 = hard cut)",
	"Sons d'un dossier de fichiers (bruitages)": "Sounds from a file folder (soundboard)",
	"Objets d'un personnage (attaques, sorts…)": "Character items (attacks, spells…)",
	"ex. worlds/monde/sons ou sounds": "e.g. worlds/myworld/sounds or sounds",
	"Emplacement": "Location",
	"Données utilisateur": "User data",
	"Fichiers de Foundry (sounds/…)": "Foundry files (sounds/…)",
	"Mon personnage": "My character",
	"(tous)": "(all)",
	"Une touche, plusieurs actions dans l'ordre (6 étapes au plus), sans écrire de code. Une erreur arrête la séquence.": "One key, several actions in order (up to 6 steps), without code. An error stops the sequence.",
	"Titre": "Title",
	"ex. Embuscade": "e.g. Ambush",
	"Exécuter une macro": "Run a macro",
	"Afficher une scène": "View a scene",
	"Activer une scène (MJ)": "Activate a scene (GM)",
	"Lancer une playlist": "Play a playlist",
	"Arrêter une playlist": "Stop a playlist",
	"Arrêter toute la musique": "Stop all music",
	"Jouer un son (fichier)": "Play a sound (file)",
	"Régler l'obscurité": "Set darkness",
	"Attendre": "Wait",
	"Avancer le temps": "Advance time",
	"Script (MJ, avancé)": "Script (GM, advanced)",
	"Mettre en pause": "Pause",
	"Reprendre": "Resume",
	"Basculer": "Toggle",
	"Code": "Code",
	"JavaScript exécuté dans Foundry, uniquement pour le MJ. Variables : api, game, canvas, ui, foundry, CONFIG, ChatMessage.": "JavaScript run in Foundry, for the GM only. Variables: api, game, canvas, ui, foundry, CONFIG, ChatMessage.",
	"Volume de la musique": "Music volume",
	"Volume de l'ambiance": "Ambience volume",
	"Volume de l'interface": "Interface volume",
	"PV du jeton sélectionné": "Selected token HP",
	"Zoom de la carte": "Map zoom",
	"Pas": "Step",
	"par cran de molette : en % (volumes, obscurité) ou en PV": "per dial notch: in % (volumes, darkness) or in HP",
	"Couleurs selon la valeur ★ Premium": "Colours by value ★ Premium",
	"Sous (%)": "Below (%)",
	"ex. 50 : la touche change de couleur quand les PV passent sous la moitié": "e.g. 50: the key changes colour when HP drop below half",
	"Couleur": "Colour",
	"ex. 25 : seuil critique": "e.g. 25: critical threshold",
	"chemin Foundry (facultatif)": "Foundry path (optional)",
	"Étape": "Step",
	"aucune": "none",
	"Utiliser la sélection": "Use selection",
	"Rien n'est sélectionné dans Foundry.": "Nothing is selected in Foundry.",
	"ex. sounds/drums.wav": "e.g. sounds/drums.wav",
	"chemin de l'image": "image path",
	"secondes (60 au plus)": "seconds (60 at most)",
	"minutes": "minutes",
	"Minutes": "Minutes",
	"Page": "Page",
	"Molette (Stream Deck +, Stream Deck + XL) : tournez pour régler ou faire défiler, appuyez pour choisir. L'écran tactile affiche le titre, une image et la valeur.": "Dial (Stream Deck +, Stream Deck + XL): turn to adjust or browse, press to choose. The touch strip shows the title, a picture and the value.",
	"Lumière de la scène (obscurité, MJ)": "Scene lighting (darkness, GM)",
	"Tours de combat (suivant / précédent)": "Combat turns (next / previous)",
	"Groupe : passer d'un personnage à l'autre": "Party: go from one character to the next",
	"Scènes : faire défiler": "Scenes: browse",
	"Cibles : parcourir et cibler": "Targets: browse and target",
	"Musique : choisir une piste": "Music: pick a track",
	"Dés : préparer un lancer": "Dice: build a roll",
	"Macros : faire défiler": "Macros: browse",
	"Tourner : volume. Appuyer : couper / rétablir.": "Turn: volume. Press: mute / restore.",
	"Tourner : plus clair / plus sombre. Appuyer : jour ↔ nuit.": "Turn: lighter / darker. Press: day ↔ night.",
	"Tourner : PV du jeton sélectionné (appliqués après un court arrêt). Appuyer : appliquer tout de suite.": "Turn: selected token HP (applied after a short pause). Press: apply now.",
	"Tourner : tour suivant / précédent. Appuyer : centrer sur le combattant actif.": "Turn: next / previous turn. Press: centre on the active combatant.",
	"Tourner : zoom. Appuyer : zoom normal, centré sur le jeton sélectionné.": "Turn: zoom. Press: normal zoom, centred on the selected token.",
	"Tourner : sélectionne le jeton du personnage suivant et centre la vue.": "Turn: selects the next character's token and centres the view.",
	"Tourner : fait défiler les scènes. Appuyer : afficher ou activer la scène montrée.": "Turn: browse scenes. Press: view or activate the scene shown.",
	"Tourner : parcourt les cibles possibles, les plus proches d'abord. Appuyer : cibler. Toucher l'écran : effacer les cibles.": "Turn: go through possible targets, nearest first. Press: target. Touch the screen: clear targets.",
	"signal sur la carte en tournant (vu par toute la table)": "ping on the map while turning (seen by the whole table)",
	"Signal": "Ping",
	"Tourner : fait défiler les pistes. Appuyer : jouer la piste montrée, ou l'arrêter si elle joue (MJ).": "Turn: browse tracks. Press: play the track shown, or stop it if it is playing (GM).",
	"Tourner : type de dé. Appuyer : ajouter un dé. Tourner en appuyant : bonus ±1. Toucher l'écran : vider la réserve. Une touche Système « Lancer la réserve de dés » lance les dés.": "Turn: die type. Press: add a die. Turn while pressed: bonus ±1. Touch the screen: empty the pool. A System key set to \"Roll the dice pool\" rolls the dice.",
	"Tourner : fait défiler les macros. Appuyer : exécuter la macro montrée.": "Turn: browse macros. Press: run the macro shown.",
	"Groupe": "Party",
	"Automatique (groupe du système, sinon personnages des joueurs)": "Automatic (system party, otherwise player characters)",
	"Un acteur Groupe": "A Group actor",
	"Un dossier d'acteurs": "An actor folder",
	"Acteur Groupe": "Group actor",
	"Cibler / ne plus cibler": "Target / untarget",
	"ennemis": "enemies",
	"neutres": "neutral",
	"alliés": "allies",
	"Maj": "Shift",
	"ajouter aux cibles (comme Maj + clic)": "add to targets (like Shift + click)",
	"Sans cette option, l'appui remplace les cibles.": "Without this option, pressing replaces the targets.",
	"centrer sur la cible en tournant": "centre on the target while turning",
	"inclure mes jetons sélectionnés": "include my selected tokens",
	"Lancer la réserve de dés (molette Dés)": "Roll the dice pool (Dice dial)",
	"Réserve": "Pool",
	"garder la réserve après le lancer": "keep the pool after rolling",
	"Sur une molette : appuyer (ou toucher l'écran) fait comme la touche.": "On a dial: pressing (or touching the screen) does the same as the key.",
	"Tourner : tour suivant / précédent (MJ pour reculer).": "Turn: next / previous turn (GM to go back).",
	"Tourner : change le montant.": "Turn: changes the amount.",
	"Tourner : volume de la piste (type « Piste »), sinon volume de la musique.": "Turn: track volume (\"Track\" type), otherwise music volume.",
	"Tourner : sans effet pour cette action.": "Turn: no effect for this action.",
	"Les molettes demandent VTT Deck Premium : sans lui, l'écran affichera 🔒.": "Dials need VTT Deck Premium: without it, the strip will show 🔒.",
	"Groupe : copiez la touche sur plusieurs emplacements, chaque touche prend un personnage du groupe.": "Party: copy the key to several slots, each key takes one party character.",
	"Groupe (personnages du groupe)": "Party (party characters)",
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
			{ key: "sceneId", label: "Scène", type: "select", source: "scenes", show: (s) => !["levelUp", "levelDown"].includes(s.onPress) },
			{ key: "onPress", label: "Appui", type: "select", default: "view", options: opt(
				["view", "Afficher (pour moi)"], ["activate", "Activer (pour tous)"], ["config", "Ouvrir la configuration"], ["navToggle", "Afficher/masquer dans la navigation"],
				["levelUp", "Niveau supérieur (Foundry v14)", 1], ["levelDown", "Niveau inférieur (Foundry v14)", 1]) }
		]
	},
	token: {
		help: "Gratuit : le jeton sélectionné (image, nom, sélection, fiche). ★ Premium : personnages précis, vue du groupe, PV et jauge (barre 1 du jeton, tous systèmes), icônes des états, ±PV, cibler, cacher, déplacer, pivoter, altitude, niveaux.",
		fields: [
			{ key: "target", label: "Jeton", type: "select", default: "selected", options: opt(
				["selected", "Jeton sélectionné"], ["actor", "Personnage précis", 1], ["turn", "Combattant actif", 1], ["party", "Groupe (personnages du groupe)", 1]),
				note: "Groupe : copiez la touche sur plusieurs emplacements, chaque touche prend un personnage du groupe." },
			...partyFields((s) => s.target === "party"),
			{ key: "actorId", label: "Personnage", type: "select", source: "actors", pro: true, show: (s) => s.target === "actor" },
			{ key: "display", label: "Afficher", type: "select", default: "name", options: opt(
				["name", "Nom"], ["bar1", "Barre 1 (PV)", 1], ["bar2", "Barre 2", 1], ["path", "Attribut…", 1], ["none", "Rien"]) },
			{ key: "path", label: "Attribut", type: "text", placeholder: "ex. system.attributes.ac.value", pro: true, show: (s) => s.display === "path" },
			{ key: "showBar", label: "Jauge PV", type: "checkbox", default: true, pro: true, text: "dessiner la jauge de la barre 1" },
			{ key: "showStatuses", label: "États", type: "checkbox", default: true, pro: true, text: "afficher les icônes des états actifs" },
			{ key: "onPress", label: "Appui", type: "select", default: "select", options: opt(
				["select", "Sélectionner + centrer"], ["pan", "Centrer la vue"], ["sheet", "Ouvrir/fermer la fiche"], ["target", "Cibler", 1],
				["hide", "Cacher/montrer (MJ)", 1], ["status", "Basculer un état", 1], ["hp", "Modifier la barre 1", 1], ["combat", "Ajouter/retirer du combat", 1],
				["move", "Déplacer d'une case", 1], ["rotate", "Pivoter", 1], ["elevation", "Changer l'altitude", 1],
				["levelUp", "Monter d'un niveau (Foundry v14)", 1], ["levelDown", "Descendre d'un niveau (Foundry v14)", 1], ["none", "Rien"]) },
			{ key: "dir", label: "Direction", type: "select", default: "up", pro: true, show: (s) => s.onPress === "move", options: opt(
				["up", "↑ Haut"], ["down", "↓ Bas"], ["left", "← Gauche"], ["right", "→ Droite"],
				["upLeft", "↖ Haut-gauche"], ["upRight", "↗ Haut-droite"], ["downLeft", "↙ Bas-gauche"], ["downRight", "↘ Bas-droite"]),
				note: "Déplace tous les jetons sélectionnés ; les murs bloquent les joueurs." },
			{ key: "rotStep", label: "Angle", type: "number", default: 45, pro: true, show: (s) => s.onPress === "rotate", note: "degrés, ex. 45 ou -45" },
			{ key: "elevStep", label: "Variation", type: "number", default: 5, pro: true, show: (s) => s.onPress === "elevation", note: "ex. 5 ou -5" },
			{ key: "statusId", label: "État", type: "select", source: "statuses", pro: true, show: (s) => s.onPress === "status" },
			{ key: "delta", label: "Variation", type: "number", default: -1, pro: true, show: (s) => s.onPress === "hp", note: "ex. -1, -5, +2" }
		]
	},
	combat: {
		help: "Pilotage du combat. ★ Premium : « Suivi d'initiative automatique » — copiez la même touche sur une rangée, elle se remplit toute seule dans l'ordre du combat.",
		fields: [
			{ key: "fn", label: "Fonction", type: "select", default: "next", options: opt(
				["next", "Tour suivant"], ["prev", "Tour précédent"], ["nextRound", "Round suivant"], ["prevRound", "Round précédent"],
				["start", "Commencer le combat"], ["end", "Terminer le combat"], ["rollAll", "Initiative : tous"], ["rollNPC", "Initiative : PNJ"],
				["round", "Afficher round / tour"], ["auto", "Suivi d'initiative automatique", 1], ["turn", "Combattant actif", 1], ["slot", "Combattant n°…", 1],
				["toggleCombat", "Ajouter/retirer les jetons sélectionnés", 1]) },
			{ key: "order", label: "Ordre", type: "select", default: "active", pro: true, show: (s) => s.fn === "auto", options: opt(
				["active", "Combattant actif en premier"], ["init", "Ordre d'initiative"]),
				note: "Toutes les touches « Suivi automatique » de ce Stream Deck forment une rangée, lue ligne par ligne. S'il y a plus de combattants que de touches, la dernière affiche la suite." },
			{ key: "slot", label: "Place n°", type: "number", default: 1, min: 1, pro: true, show: (s) => s.fn === "slot" },
			{ key: "display", label: "Afficher", type: "select", default: "name", pro: true, show: (s) => ["slot", "turn", "auto"].includes(s.fn), options: opt(
				["name", "Nom"], ["bar1", "Barre 1 (PV)"], ["init", "Initiative"], ["none", "Rien"]) },
			{ key: "showBar", label: "Jauge PV", type: "checkbox", default: true, pro: true, text: "dessiner la jauge", show: (s) => ["slot", "turn", "auto"].includes(s.fn) },
			{ key: "showStatuses", label: "États", type: "checkbox", default: true, pro: true, text: "afficher les icônes des états actifs", show: (s) => ["slot", "turn", "auto"].includes(s.fn) },
			{ key: "slotPress", label: "Appui", type: "select", default: "select", pro: true, show: (s) => ["slot", "turn", "auto"].includes(s.fn), options: opt(
				["select", "Sélectionner + centrer"], ["pan", "Centrer la vue"], ["sheet", "Ouvrir la fiche"], ["none", "Rien"]) }
		]
	},
	playlist: {
		help: "Bordure verte = en cours de lecture.",
		fields: [
			{ key: "mode", label: "Type", type: "select", default: "playlist", options: opt(
				["playlist", "Playlist entière"], ["sound", "Piste d'une playlist"], ["file", "Fichier audio (effet)"], ["stopAll", "Tout arrêter"]) },
			{ key: "playlistId", label: "Playlist", type: "select", source: "playlists", show: (s) => ["playlist", "sound"].includes(s.mode ?? "playlist") },
			{ key: "crossfade", label: "Fondu", type: "number", default: 0, min: 0, max: 30, pro: true, show: (s) => (s.mode ?? "playlist") === "playlist",
				note: "secondes de fondu enchaîné avec la musique en cours (0 = coupure sèche)" },
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
				["table", "Tirer dans une table"], ["chat", "Message dans le chat"], ["darkness", "Obscurité de la scène"],
				["weather", "Météo", 1], ["time", "Temps de jeu", 1], ["showImage", "Montrer une image aux joueurs", 1], ["showJournal", "Montrer un journal aux joueurs", 1],
				["door", "Porte", 1], ["light", "Lumière", 1], ["alerts", "Alertes (20, 1, message privé)", 1],
				["clearTargets", "Effacer les cibles", 1], ["targetNext", "Cibler l'ennemi suivant", 1], ["rollPool", "Lancer la réserve de dés (molette Dés)", 1]) },
			{ key: "control", label: "Contrôle", type: "select", source: "controls", show: (s) => s.fn === "control" },
			{ key: "tool", label: "Outil", type: "select", source: "tools", show: (s) => s.fn === "control" },
			{ key: "tab", label: "Onglet", type: "select", default: "chat", options: TABS, show: (s) => s.fn === "sidebar" },
			{ key: "formula", label: "Formule", type: "text", placeholder: "ex. 1d20+5", show: (s) => s.fn === "roll" },
			{ key: "rollMode", label: "Visibilité", type: "select", default: "current", show: (s) => ["roll", "rollPool"].includes(s.fn), options: opt(
				["current", "Mode actuel du chat"], ["public", "Public"], ["gm", "Privé (MJ)"], ["self", "Pour moi seul"]) },
			{ key: "keepPool", label: "Réserve", type: "checkbox", default: false, pro: true, text: "garder la réserve après le lancer", show: (s) => s.fn === "rollPool" },
			{ key: "tableId", label: "Table", type: "select", source: "tables", show: (s) => s.fn === "table" },
			{ key: "message", label: "Message", type: "text", placeholder: "Texte à envoyer", show: (s) => s.fn === "chat" },
			{ key: "whisperGM", label: "Chuchoter", type: "checkbox", default: false, text: "au(x) MJ uniquement", show: (s) => s.fn === "chat" },
			{ key: "darkness", label: "Obscurité", type: "range", default: 100, min: 0, max: 100, show: (s) => s.fn === "darkness", note: "0 = plein jour, 100 = nuit noire" },
			{ key: "weather", label: "Météo", type: "select", source: "weather", emptyLabel: "(aucune — temps clair)", pro: true, show: (s) => s.fn === "weather",
				note: "Un appui pose cette météo sur la scène ; un second appui l'enlève." },
			{ key: "timeStep", label: "Temps", type: "select", default: "10m", pro: true, show: (s) => s.fn === "time", options: opt(
				["1m", "+1 min"], ["10m", "+10 min"], ["1h", "+1 h"], ["rest", "Repos"], ["custom", "Durée libre"], ["show", "Afficher l'heure du monde"]) },
			{ key: "restHours", label: "Heures", type: "number", default: 8, min: 1, pro: true, show: (s) => s.fn === "time" && s.timeStep === "rest" },
			{ key: "minutes", label: "Minutes", type: "number", default: 30, pro: true, show: (s) => s.fn === "time" && s.timeStep === "custom", note: "négatif pour reculer" },
			{ key: "imagePath", label: "Image", type: "text", placeholder: "chemin Foundry, ex. worlds/monde/carte.webp", pro: true, show: (s) => s.fn === "showImage" },
			{ key: "caption", label: "Légende", type: "text", placeholder: "(facultatif)", pro: true, show: (s) => s.fn === "showImage" },
			{ key: "journalId", label: "Journal", type: "select", source: "journals", pro: true, show: (s) => s.fn === "showJournal" },
			{ key: "pageId", label: "Page", type: "select", source: "pages", emptyLabel: "(tout le journal)", pro: true, show: (s) => s.fn === "showJournal" },
			{ key: "wallId", label: "Porte", type: "capture", source: "selectedDoor", sceneKey: "sceneId", pro: true, show: (s) => s.fn === "door",
				note: "Dans Foundry, sélectionnez la porte (outil Murs), puis cliquez sur « Utiliser la sélection »." },
			{ key: "doorAction", label: "Appui", type: "select", default: "toggle", pro: true, show: (s) => s.fn === "door", options: opt(
				["toggle", "Ouvrir / fermer"], ["lock", "Verrouiller / déverrouiller (MJ)"]) },
			{ key: "lightId", label: "Lumière", type: "capture", source: "selectedLight", sceneKey: "sceneId", pro: true, show: (s) => s.fn === "light",
				note: "Dans Foundry, sélectionnez la lumière (outil Éclairage), puis cliquez sur « Utiliser la sélection »." },
			{ key: "alertCrit", label: "Alertes", type: "checkbox", default: true, pro: true, text: "20 naturel", show: (s) => s.fn === "alerts" },
			{ key: "alertFumble", label: "", type: "checkbox", default: true, pro: true, text: "1 naturel", show: (s) => s.fn === "alerts" },
			{ key: "alertWhisper", label: "", type: "checkbox", default: true, pro: true, text: "message privé reçu", show: (s) => s.fn === "alerts" },
			{ key: "playersOnly", label: "Origine", type: "checkbox", default: true, pro: true, text: "seulement les jets des joueurs", show: (s) => s.fn === "alerts",
				note: "La touche clignote ; un appui l'éteint et ouvre le chat." },
			{ key: "includeNeutral", label: "Cibles", type: "checkbox", default: false, pro: true, text: "inclure les jetons neutres", show: (s) => s.fn === "targetNext" },
			{ key: "panToTarget", label: "Vue", type: "checkbox", default: true, pro: true, text: "centrer sur la cible", show: (s) => s.fn === "targetNext" }
		]
	},
	numpad: {
		pro: true,
		help: "Une touche par rôle : chiffres, montant, Dégâts, Soins… Dégâts et Soins modifient la barre 1 (PV) de tous les jetons sélectionnés, ou ciblés s'il n'y en a pas.",
		fields: [
			{ key: "key", label: "Rôle", type: "select", default: "1", options: opt(
				["display", "Montant (appui = remise à zéro)"], ["damage", "Dégâts"], ["heal", "Soins"],
				["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
				["inc", "Ajouter une valeur (+N)"], ["clear", "Effacer"], ["back", "Effacer le dernier chiffre"]) },
			{ key: "step", label: "Valeur", type: "number", default: 1, min: 1, show: (s) => s.key === "inc", note: "ex. 1, 5, 10" },
			{ key: "targets", label: "Jetons", type: "select", default: "auto", show: (s) => ["display", "damage", "heal"].includes(s.key), options: opt(
				["auto", "Sélectionnés, sinon ciblés"], ["selected", "Jetons sélectionnés"], ["targeted", "Jetons ciblés"]) },
			{ key: "notify", label: "Message", type: "checkbox", default: true, text: "confirmer dans Foundry", show: (s) => ["damage", "heal"].includes(s.key) }
		]
	},
	ambiance: {
		pro: true,
		help: "Un appui (MJ) : coupe les autres playlists, affiche la scène, règle obscurité et météo, lance la playlist. Cadre vert = ambiance en place.",
		fields: [
			{ key: "sceneId", label: "Scène", type: "select", source: "scenes", emptyLabel: "(aucune)" },
			{ key: "sceneMode", label: "Appui", type: "select", default: "activate", show: (s) => !!s.sceneId, options: opt(
				["activate", "Activer (pour tous)"], ["view", "Afficher (pour moi)"]) },
			{ key: "playlistId", label: "Playlist", type: "select", source: "playlists", emptyLabel: "(aucune)" },
			{ key: "stopOthers", label: "Musique", type: "checkbox", default: true, text: "arrêter les autres playlists", show: (s) => !!s.playlistId },
			{ key: "crossfade", label: "Fondu", type: "number", default: 0, min: 0, max: 30, show: (s) => !!s.playlistId, note: "secondes de fondu enchaîné (0 = coupure sèche)" },
			{ key: "setDarkness", label: "Obscurité", type: "checkbox", default: false, text: "régler l'obscurité" },
			{ key: "darkness", label: "Niveau", type: "range", default: 0, min: 0, max: 100, show: (s) => !!s.setDarkness, note: "0 = plein jour, 100 = nuit noire" },
			{ key: "weather", label: "Météo", type: "select", source: "weather", emptyLabel: "(inchangée)", extra: opt(["none", "Aucune (temps clair)"]) },
			{ key: "macroId", label: "Macro", type: "select", source: "macros", emptyLabel: "(aucune)", note: "exécutée en dernier (facultatif)" }
		]
	},
	page: {
		pro: true,
		help: "Copiez la même touche « Élément » sur plusieurs emplacements : elles se remplissent toutes seules, ligne par ligne, avec le contenu du dossier. Une touche « Page suivante » réglée sur le même dossier fait défiler.",
		fields: [
			{ key: "kind", label: "Contenu", type: "select", default: "macros", resets: ["folderId", "folderIdName", "playlistId", "playlistIdName"], options: opt(
				["macros", "Macros d'un dossier"], ["scenes", "Scènes d'un dossier"], ["playlists", "Playlists d'un dossier"], ["tracks", "Pistes d'une playlist"],
				["files", "Sons d'un dossier de fichiers (bruitages)"], ["items", "Objets d'un personnage (attaques, sorts…)"]) },
			{ key: "filePath", label: "Dossier", type: "text", placeholder: "ex. worlds/monde/sons ou sounds", show: (s) => s.kind === "files" },
			{ key: "fileSource", label: "Emplacement", type: "select", default: "data", show: (s) => s.kind === "files", options: opt(
				["data", "Données utilisateur"], ["public", "Fichiers de Foundry (sounds/…)"]) },
			{ key: "volume", label: "Volume", type: "range", default: 80, min: 0, max: 100, show: (s) => s.kind === "files" },
			{ key: "broadcast", label: "Diffusion", type: "checkbox", default: true, text: "jouer chez tous les joueurs", show: (s) => s.kind === "files" },
			{ key: "actorSource", label: "Personnage", type: "select", default: "mine", show: (s) => s.kind === "items", options: opt(
				["mine", "Mon personnage"], ["selected", "Jeton sélectionné"]) },
			{ key: "itemType", label: "Type", type: "select", source: "itemTypes", emptyLabel: "(tous)", show: (s) => s.kind === "items" },
			{ key: "folderId", label: "Dossier", type: "select", source: "macroFolders", emptyLabel: "(toutes les macros)", show: (s) => (s.kind ?? "macros") === "macros" },
			{ key: "folderId", label: "Dossier", type: "select", source: "sceneFolders", emptyLabel: "(toutes les scènes)", show: (s) => s.kind === "scenes" },
			{ key: "folderId", label: "Dossier", type: "select", source: "playlistFolders", emptyLabel: "(toutes les playlists)", show: (s) => s.kind === "playlists" },
			{ key: "playlistId", label: "Playlist", type: "select", source: "playlists", show: (s) => s.kind === "tracks" },
			{ key: "role", label: "Rôle", type: "select", default: "item", options: opt(
				["item", "Élément (se remplit tout seul)"], ["next", "Page suivante"], ["prev", "Page précédente"]) },
			{ key: "sceneMode", label: "Appui", type: "select", default: "view", show: (s) => s.kind === "scenes" && (s.role ?? "item") === "item", options: opt(
				["view", "Afficher (pour moi)"], ["activate", "Activer (pour tous)"]) }
		]
	}
};

/* Séquence : jusqu'à 6 étapes, chacune avec ses réglages */
const STEP_TYPES = opt(
	["macro", "Exécuter une macro"], ["sceneView", "Afficher une scène"], ["sceneActivate", "Activer une scène (MJ)"],
	["playlistPlay", "Lancer une playlist"], ["playlistStop", "Arrêter une playlist"], ["stopMusic", "Arrêter toute la musique"],
	["sound", "Jouer un son (fichier)"], ["darkness", "Régler l'obscurité"], ["weather", "Météo"], ["chat", "Message dans le chat"],
	["roll", "Lancer de dés"], ["wait", "Attendre"], ["pause", "Pause"], ["time", "Avancer le temps"], ["showImage", "Montrer une image aux joueurs"],
	["script", "Script (MJ, avancé)"]
);
const STEP_TEXT = { sound: "ex. sounds/drums.wav", chat: "Texte à envoyer", roll: "ex. 1d20+5", showImage: "chemin de l'image" };
const STEP_NUMBER = { darkness: "0 = plein jour, 100 = nuit noire", wait: "secondes (60 au plus)", time: "minutes" };
function sequenceFields() {
	const fields = [{ key: "title", label: "Titre", type: "text", placeholder: "ex. Embuscade" }];
	for (let i = 1; i <= 6; i++) {
		const tp = (s) => s[`s${i}Type`];
		const visible = (s) => i === 1 || !!s[`s${i - 1}Type`] || !!tp(s);
		fields.push(
			{ key: `s${i}Type`, label: () => `${tr("Étape")} ${i}`, type: "select", options: STEP_TYPES, show: visible },
			{ key: `s${i}Macro`, label: "Macro", type: "select", source: "macros", show: (s) => tp(s) === "macro" },
			{ key: `s${i}Scene`, label: "Scène", type: "select", source: "scenes", show: (s) => ["sceneView", "sceneActivate"].includes(tp(s)) },
			{ key: `s${i}Playlist`, label: "Playlist", type: "select", source: "playlists", show: (s) => ["playlistPlay", "playlistStop"].includes(tp(s)) },
			{ key: `s${i}Weather`, label: "Météo", type: "select", source: "weather", extra: opt(["none", "Aucune (temps clair)"]), show: (s) => tp(s) === "weather" },
			{ key: `s${i}Text`, label: "Valeur", type: "text", placeholder: (s) => STEP_TEXT[tp(s)] ?? "", show: (s) => tp(s) in STEP_TEXT },
			{ key: `s${i}Number`, label: "Valeur", type: "number", show: (s) => tp(s) in STEP_NUMBER, noteFn: (s) => STEP_NUMBER[tp(s)] },
			{ key: `s${i}Pause`, label: "Pause", type: "select", default: "toggle", show: (s) => tp(s) === "pause", options: opt(
				["on", "Mettre en pause"], ["off", "Reprendre"], ["toggle", "Basculer"]) },
			{ key: `s${i}Code`, label: "Code", type: "textarea", placeholder: "await game.togglePause(true);", show: (s) => tp(s) === "script",
				note: "JavaScript exécuté dans Foundry, uniquement pour le MJ. Variables : api, game, canvas, ui, foundry, CONFIG, ChatMessage." }
		);
	}
	return fields;
}
SCHEMAS.sequence = {
	pro: true,
	help: "Une touche, plusieurs actions dans l'ordre (6 étapes au plus), sans écrire de code. Une erreur arrête la séquence.",
	fields: sequenceFields()
};
/** Source du groupe (vue du groupe, molette Groupe) */
function partyFields(when) {
	return [
		{ key: "partySource", label: "Groupe", type: "select", default: "auto", pro: true, show: when, options: opt(
			["auto", "Automatique (groupe du système, sinon personnages des joueurs)"], ["group", "Un acteur Groupe"], ["folder", "Un dossier d'acteurs"]) },
		{ key: "groupId", label: "Acteur Groupe", type: "select", source: "groupActors", pro: true, show: (s) => when(s) && s.partySource === "group" },
		{ key: "actorFolderId", label: "Dossier", type: "select", source: "actorFolders", pro: true, show: (s) => when(s) && s.partySource === "folder" }
	];
}

const DIAL_NOTES = {
	musicVolume: "Tourner : volume. Appuyer : couper / rétablir.",
	ambientVolume: "Tourner : volume. Appuyer : couper / rétablir.",
	interfaceVolume: "Tourner : volume. Appuyer : couper / rétablir.",
	darkness: "Tourner : plus clair / plus sombre. Appuyer : jour ↔ nuit.",
	tokenHp: "Tourner : PV du jeton sélectionné (appliqués après un court arrêt). Appuyer : appliquer tout de suite.",
	initiative: "Tourner : tour suivant / précédent. Appuyer : centrer sur le combattant actif.",
	zoom: "Tourner : zoom. Appuyer : zoom normal, centré sur le jeton sélectionné.",
	party: "Tourner : sélectionne le jeton du personnage suivant et centre la vue.",
	scenes: "Tourner : fait défiler les scènes. Appuyer : afficher ou activer la scène montrée.",
	targets: "Tourner : parcourt les cibles possibles, les plus proches d'abord. Appuyer : cibler. Toucher l'écran : effacer les cibles.",
	tracks: "Tourner : fait défiler les pistes. Appuyer : jouer la piste montrée, ou l'arrêter si elle joue (MJ).",
	dice: "Tourner : type de dé. Appuyer : ajouter un dé. Tourner en appuyant : bonus ±1. Toucher l'écran : vider la réserve. Une touche Système « Lancer la réserve de dés » lance les dés.",
	macros: "Tourner : fait défiler les macros. Appuyer : exécuter la macro montrée."
};
const dialFn = (s) => s.fn ?? "musicVolume";
SCHEMAS.dial = {
	pro: true,
	noAppearance: true,
	help: "Molette (Stream Deck +, Stream Deck + XL) : tournez pour régler ou faire défiler, appuyez pour choisir. L'écran tactile affiche le titre, une image et la valeur.",
	fields: [
		{ key: "fn", label: "Fonction", type: "select", default: "musicVolume", resets: ["folderId", "folderIdName", "playlistId", "playlistIdName"], noteFn: (s) => DIAL_NOTES[dialFn(s)], options: opt(
			["musicVolume", "Volume de la musique"], ["ambientVolume", "Volume de l'ambiance"], ["interfaceVolume", "Volume de l'interface"],
			["darkness", "Lumière de la scène (obscurité, MJ)"], ["tokenHp", "PV du jeton sélectionné"], ["initiative", "Tours de combat (suivant / précédent)"], ["zoom", "Zoom de la carte"],
			["party", "Groupe : passer d'un personnage à l'autre"], ["scenes", "Scènes : faire défiler"], ["targets", "Cibles : parcourir et cibler"],
			["tracks", "Musique : choisir une piste"], ["dice", "Dés : préparer un lancer"], ["macros", "Macros : faire défiler"]) },
		{ key: "step", label: "Pas", type: "number", min: 1, show: (s) => ["musicVolume", "ambientVolume", "interfaceVolume", "darkness", "tokenHp"].includes(dialFn(s)),
			note: "par cran de molette : en % (volumes, obscurité) ou en PV" },
		...partyFields((s) => dialFn(s) === "party"),
		{ key: "partyPress", label: "Appui", type: "select", default: "sheet", show: (s) => dialFn(s) === "party", options: opt(
			["sheet", "Ouvrir/fermer la fiche"], ["target", "Cibler / ne plus cibler"], ["select", "Sélectionner + centrer"]) },
		{ key: "folderId", label: "Dossier", type: "select", source: "sceneFolders", emptyLabel: "(toutes les scènes)", show: (s) => dialFn(s) === "scenes" },
		{ key: "sceneMode", label: "Appui", type: "select", default: "view", show: (s) => dialFn(s) === "scenes", options: opt(
			["view", "Afficher (pour moi)"], ["activate", "Activer (pour tous)"]) },
		{ key: "playlistId", label: "Playlist", type: "select", source: "playlists", emptyLabel: "(toutes les playlists)", show: (s) => dialFn(s) === "tracks" },
		{ key: "tHostile", label: "Cibles", type: "checkbox", default: true, text: "ennemis", show: (s) => dialFn(s) === "targets" },
		{ key: "tNeutral", label: "", type: "checkbox", default: true, text: "neutres", show: (s) => dialFn(s) === "targets" },
		{ key: "tFriendly", label: "", type: "checkbox", default: true, text: "alliés", show: (s) => dialFn(s) === "targets" },
		{ key: "includeSelected", label: "", type: "checkbox", default: false, text: "inclure mes jetons sélectionnés", show: (s) => dialFn(s) === "targets" },
		{ key: "addTargets", label: "Maj", type: "checkbox", default: false, text: "ajouter aux cibles (comme Maj + clic)", show: (s) => dialFn(s) === "targets",
			note: "Sans cette option, l'appui remplace les cibles." },
		{ key: "panTo", label: "Vue", type: "checkbox", default: false, text: "centrer sur la cible en tournant", show: (s) => dialFn(s) === "targets" },
		{ key: "pingTarget", label: "Signal", type: "checkbox", default: false, text: "signal sur la carte en tournant (vu par toute la table)", show: (s) => dialFn(s) === "targets" },
		{ key: "folderId", label: "Dossier", type: "select", source: "macroFolders", emptyLabel: "(toutes les macros)", show: (s) => dialFn(s) === "macros" },
		{ key: "label", label: "Titre", type: "text", placeholder: "(automatique)" }
	]
};

/** Actions de touches posées sur une molette : ce que fait la rotation */
const ENCODER_ROTATE = {
	combat: "Tourner : tour suivant / précédent (MJ pour reculer).",
	numpad: "Tourner : change le montant.",
	playlist: "Tourner : volume de la piste (type « Piste »), sinon volume de la musique."
};

const COMMON = [
	{ sep: "Apparence" },
	{ key: "label", label: "Texte", type: "text", placeholder: "(automatique)", note: "| = retour à la ligne · {name} {value} {max} {round}" },
	{ key: "hideText", label: "Masquer", type: "checkbox", default: false, text: "ne pas écrire de texte" },
	{ key: "customImage", label: "Image", type: "text", placeholder: "chemin Foundry (optionnel)" },
	{ key: "bgColor", label: "Fond", type: "color" },
	{ sep: "Couleurs selon la valeur ★ Premium" },
	{ key: "thrLow", label: "Sous (%)", type: "number", min: 0, max: 100, pro: true, note: "ex. 50 : la touche change de couleur quand les PV passent sous la moitié" },
	{ key: "thrLowColor", label: "Couleur", type: "color", pro: true, show: (s) => Number(s.thrLow) > 0 },
	{ key: "thrCrit", label: "Sous (%)", type: "number", min: 0, max: 100, pro: true, note: "ex. 25 : seuil critique" },
	{ key: "thrCritColor", label: "Couleur", type: "color", pro: true, show: (s) => Number(s.thrCrit) > 0 },
	{ key: "thrCritImage", label: "Image", type: "text", placeholder: "chemin Foundry (facultatif)", pro: true, show: (s) => Number(s.thrCrit) > 0 }
];

/** VTT Deck Premium installé dans Foundry ? "yes" | "no" | "unknown" (Foundry non connecté) */
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
	if (source === "pages") {
		const j = (data.journals ?? []).find((x) => x.id === settings.journalId);
		return j?.pages ?? [];
	}
	return data[source] ?? [];
}
const realSource = (s) => (s === "sounds" ? "playlists" : s === "tools" ? "controls" : s === "pages" ? "journals" : s);
/** Capture en cours : { f } quand on attend la sélection de Foundry (porte, lumière) */
let pendingCapture = null;
let captureMessage = null;

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
	sel.append(el("option", { value: "", text: f.emptyLabel ? tr(f.emptyLabel) : f.options ? "—" : tr("— choisir —") }));
	let found = false;
	for (const o of f.extra ?? []) {
		const op = el("option", { value: o.value, text: tr(o.label) });
		if (o.value === value) (op.selected = true), (found = true);
		sel.append(op);
	}
	if (f.options) {
		for (const o of f.options) {
			const op = el("option", { value: o.value, text: tr(o.label) + (o.pro && proState() !== "yes" ? " ★ Premium" : "") });
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
		for (const k of f.resets ?? []) set(k, undefined);
		set(f.key, v === "" ? undefined : v);
		// mémorise aussi le nom pour l'affichage hors ligne
		if (f.source && !f.extra?.some((o) => o.value === v)) {
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
		case "textarea": {
			input = el("textarea", { id: f.key, rows: 6, placeholder: tr(f.placeholder ?? "") });
			input.value = value ?? "";
			input.addEventListener("change", () => (set(f.key, input.value.trim() ? input.value : undefined), save()));
			break;
		}
		case "capture": {
			const label = value ? settings[`${f.key}Name`] || value : tr("aucune");
			input = el("span", { class: "capture" }, [
				el("span", { class: "capture-label", text: label }),
				el("button", {
					type: "button",
					text: tr("Utiliser la sélection"),
					onclick: () => {
						pendingCapture = { f };
						captureMessage = null;
						request(f.source);
					}
				})
			]);
			break;
		}
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
			input = el("span", { class: "check" }, [cb, el("span", { text: tr(f.text ?? "") + (f.pro && proState() !== "yes" ? " (Premium)" : "") })]);
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
			const ph = typeof f.placeholder === "function" ? f.placeholder(settings) : f.placeholder;
			input = el("input", { id: f.key, type: "text", value: value ?? "", placeholder: tr(ph ?? "") });
			input.addEventListener("change", () => (set(f.key, input.value.trim() || undefined), save()));
		}
	}
	const labelText = (typeof f.label === "function" ? f.label() : tr(f.label)) + (f.pro && f.type !== "checkbox" && f.label && proState() !== "yes" ? " ★" : "");
	const row = el("div", { class: "row" }, [el("label", { for: f.key, text: labelText }), el("div", { class: "val" }, [input, ...extra])]);
	const frag = document.createDocumentFragment();
	frag.append(row);
	if (f.note) frag.append(el("div", { class: "note", text: tr(f.note) }));
	if (f.noteFn && f.noteFn(settings)) frag.append(el("div", { class: "note", text: tr(f.noteFn(settings)) }));
	if (f.type === "capture" && captureMessage && pendingCapture === null && captureMessage.key === f.key)
		frag.append(el("div", { class: "note pro", text: captureMessage.text }));
	if (f.options && proState() === "no" && f.options.find((o) => o.value === value)?.pro) {
		frag.append(el("div", { class: "note pro", text: tr("Fonction de VTT Deck Premium : sans lui, la touche affichera 🔒.") }));
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
	$("#help").textContent = (schema.pro ? "★ Premium — " : "") + tr(schema.help ?? "");
	if (schema.pro && proState() === "no") form.append(el("div", { class: "note pro", text: tr("Action de VTT Deck Premium : sans lui, la touche affichera 🔒.") }));
	if (controller === "Encoder" && actionKey() !== "dial") {
		const rot = ENCODER_ROTATE[actionKey()] ?? "Tourner : sans effet pour cette action.";
		form.append(el("div", { class: "note", text: `${tr("Sur une molette : appuyer (ou toucher l'écran) fait comme la touche.")} ${tr(rot)}` }));
		if (proState() !== "yes") form.append(el("div", { class: "note pro", text: tr("Les molettes demandent VTT Deck Premium : sans lui, l'écran affichera 🔒.") }));
	}
	for (const f of [...schema.fields, ...(schema.noAppearance ? [] : COMMON)]) {
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
	const sources = new Set(schema.fields.filter((f) => f.source && f.type !== "capture").map((f) => realSource(f.source)));
	sources.add("features");
	for (const s of sources) request(s);
}

function onPluginMessage(p) {
	if (!p) return;
	if (p.type === "status") {
		renderStatus(p);
		if (p.connected) requestSources();
	} else if (p.type === "data") {
		if (pendingCapture && pendingCapture.f.source === p.what && (p.live || p.offline)) {
			const f = pendingCapture.f;
			pendingCapture = null;
			const it = p.offline ? null : (p.items ?? [])[0];
			if (it) {
				set(f.key, it.id);
				set(`${f.key}Name`, it.name);
				if (f.sceneKey) set(f.sceneKey, it.sceneId);
				save();
				captureMessage = null;
			} else {
				captureMessage = { key: f.key, text: tr(p.offline ? "Foundry non connecté : liste indisponible." : "Rien n'est sélectionné dans Foundry.") };
			}
			render();
			return;
		}
		if (pendingCapture && pendingCapture.f.source === p.what) return;
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
		controller = ai.payload?.controller ?? "Keypad";
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
	$("#profExploration").addEventListener("click", () => toPlugin({ type: "switchProfile", profile: "exploration" }));
	$("#profCombat").addEventListener("click", () => toPlugin({ type: "switchProfile", profile: "combat" }));
});
