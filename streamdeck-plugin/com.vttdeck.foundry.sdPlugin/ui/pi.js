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
	"Gratuit : le jeton sélectionné (image, nom, sélection, fiche). ★ Premium : personnages précis, vue du groupe, carrousel de combat, PV et jauge (barre 1 du jeton, tous systèmes), icônes des états, ±PV, cibler, cacher, déplacer, pivoter, altitude, niveaux.": "Free: the selected token (image, name, select, sheet). ★ Premium: specific characters, party view, combat carousel, HP and gauge (token bar 1, any system), condition icons, ±HP, target, hide, move, rotate, elevation, levels.",
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
	"Jeton sélectionné : PV ou autre jauge": "Selected token: HP or another gauge",
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
	"Tourner : PV ou autre jauge du jeton sélectionné (appliqués après un court arrêt). Appuyer : appliquer tout de suite.": "Turn: HP or another gauge of the selected token (applied after a short pause). Press: apply now.",
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
	"Nouveau code": "New code",
	"Confirmer ?": "Confirm?",
	"Foundry attend le code d'appairage ci-dessous.": "Foundry is waiting for the pairing code below.",
	"Créer un nouveau code ? Foundry devra être appairé à nouveau avec ce code.": "Create a new code? Foundry will have to be paired again with this code.",
	"Connexion refusée": "Connection refused",
	"code incorrect": "wrong code",
	"code manquant ou module Foundry trop ancien": "missing code or Foundry module too old",
	"délai dépassé": "timed out",
	"message invalide": "invalid message",
	"depuis": "from",
	"Une page": "A page",
	"demande le code d'appairage. Ne le donnez que si c'est votre Foundry.": "is asking for the pairing code. Only give it if this is your Foundry.",
	"Code d'appairage : saisissez-le une fois dans Foundry (Paramètres du module « VTT Deck » → Code d'appairage). Seul un Foundry qui le connaît peut piloter ce Stream Deck : les sites web et les autres appareils sont refusés.": "Pairing code: enter it once in Foundry (\"VTT Deck\" module settings → Pairing code). Only a Foundry that knows it can drive this Stream Deck: websites and other devices are refused.",
	"Les échanges avec une autre machine ne sont pas chiffrés : n'activez cette option que sur un réseau de confiance.": "Traffic with another computer is not encrypted: only enable this on a trusted network.",
	"Acrobaties": "Acrobatics",
	"Dressage": "Animal Handling",
	"Arcanes": "Arcana",
	"Athlétisme": "Athletics",
	"Tromperie": "Deception",
	"Histoire": "History",
	"Perspicacité": "Insight",
	"Médecine": "Medicine",
	"Représentation": "Performance",
	"Escamotage": "Sleight of Hand",
	"Discrétion": "Stealth",
	"Survie": "Survival",
	"Force": "Strength",
	"Dextérité": "Dexterity",
	"Sagesse": "Wisdom",
	"Charisme": "Charisma",
	"Système D&D 5e (dnd5e 5.3 ou plus). Objets, sorts et aptitudes de la fiche, jets, emplacements de sorts, repos, inspiration, concentration, jets contre la mort. « Groupe : demander… » envoie une carte de jet dans le chat : chaque joueur lance pour son personnage.": "D&D 5e system (dnd5e 5.3 or later). Items, spells and features from the sheet, rolls, spell slots, rests, inspiration, concentration, death saves. \"Party: request…\" posts a roll card in the chat: each player rolls for their own character.",
	"Utiliser un objet, un sort ou une aptitude": "Use an item, spell or feature",
	"Emplacements de sorts": "Spell slots",
	"Jet de compétence": "Skill check",
	"Test de caractéristique": "Ability check",
	"Jet de sauvegarde": "Saving throw",
	"Jet d'initiative": "Initiative roll",
	"Jet contre la mort": "Death saving throw",
	"Dé de vie": "Hit die",
	"Groupe : demander un jet de compétence (MJ)": "Party: request a skill check (GM)",
	"Groupe : demander un jet de sauvegarde (MJ)": "Party: request a saving throw (GM)",
	"Groupe : demander un repos (MJ)": "Party: request a rest (GM)",
	"Mon personnage (joueur)": "My character (player)",
	"Groupe : un personnage par touche": "Party: one character per key",
	"ex. Épée longue, Boule de feu": "e.g. Longsword, Fireball",
	"Nom de l'objet, du sort ou de l'aptitude tel qu'il est écrit sur la fiche (majuscules et accents indifférents).": "Name of the item, spell or feature as written on the sheet (case and accents ignored).",
	"Magie de pacte": "Pact magic",
	"Compétence": "Skill",
	"Caractéristique": "Ability",
	"DD": "DC",
	"facultatif : la carte indique alors les réussites et les échecs": "optional: the card then shows successes and failures",
	"Repos court": "Short rest",
	"Repos long": "Long rest",
	"Jet": "Roll",
	"Avec avantage": "With advantage",
	"Avec désavantage": "With disadvantage",
	"Rapide": "Fast",
	"sans fenêtre de réglage (lance directement)": "no configuration window (roll right away)",
	"écrire le nom du personnage sur la touche": "write the character's name on the key",
	"Ramener la vue des joueurs sur la mienne (MJ)": "Pull the players' view to mine (GM)",
	"Minuteur / chronomètre": "Timer / stopwatch",
	"Réinitialiser le brouillard (MJ)": "Reset fog of war (GM)",
	"Démarrer / mettre en pause": "Start / pause",
	"Remettre à zéro": "Reset",
	"Terminé : un appui remet le minuteur à zéro. Le minuteur tourne dans ce navigateur (il s'arrête si la page est rechargée).": "When it's done, a press resets the timer. The timer runs in this browser (it stops if the page is reloaded).",
	"Compte à rebours": "Countdown",
	"Chronomètre (temps écoulé)": "Stopwatch (elapsed time)",
	"Durée": "Duration",
	"minutes (ex. 0.5 = 30 s)": "minutes (e.g. 0.5 = 30 s)",
	"Fin": "End",
	"son et message à la fin": "sound and message at the end",
	"Deux touches avec le même nom pilotent le même minuteur (ex. une touche « Remettre à zéro »).": "Two keys with the same name control the same timer (e.g. a \"Reset\" key).",
	"Artisanat": "Crafting",
	"Duperie": "Deception",
	"Diplomatie": "Diplomacy",
	"Occultisme": "Occultism",
	"Société": "Society",
	"Vol": "Thievery",
	"Vigueur": "Fortitude",
	"Réflexes": "Reflex",
	"Volonté": "Will",
	"Sauvegarde": "Save",
	"Action": "Action",
	"Réaction": "Reaction",
	"Effrayé (valeur)": "Frightened (value)",
	"Nauséeux (valeur)": "Sickened (value)",
	"Maladroit (valeur)": "Clumsy (value)",
	"Affaibli (valeur)": "Enfeebled (value)",
	"Stupéfié (valeur)": "Stupefied (value)",
	"Drainé (valeur)": "Drained (value)",
	"Condamné (valeur)": "Doomed (value)",
	"Blessé (valeur)": "Wounded (value)",
	"Ralenti (valeur)": "Slowed (value)",
	"Étourdi (valeur)": "Stunned (value)",
	"Pris au dépourvu": "Off-guard",
	"À terre": "Prone",
	"Agrippé": "Grabbed",
	"Entravé": "Restrained",
	"Immobilisé": "Immobilized",
	"Accéléré": "Quickened",
	"Aveuglé": "Blinded",
	"Ébloui": "Dazzled",
	"Sourd": "Deafened",
	"Fatigué": "Fatigued",
	"Masqué": "Concealed",
	"Caché": "Hidden",
	"Confus": "Confused",
	"Fasciné": "Fascinated",
	"En fuite": "Fleeing",
	"Paralysé": "Paralyzed",
	"Inconscient": "Unconscious",
	"Surchargé": "Encumbered",
	"Système Pathfinder 2e (pf2e 7 ou plus, Foundry 13 et 14). Frappes avec pénalité d'attaques multiples, actions du tour, états à valeur, points d'héroïsme et de focalisation, tests et sauvegardes. « Groupe : demander… » envoie un bouton de test dans le chat : chaque joueur lance pour son personnage.": "Pathfinder 2e system (pf2e 7 or later, Foundry 13 and 14). Strikes with multiple attack penalty, turn actions, valued conditions, hero and focus points, checks and saves. \"Party: request…\" posts a check button in the chat: each player rolls for their own character.",
	"Frappe (arme ou attaque)": "Strike (weapon or attack)",
	"Objet, action, don ou sort": "Item, action, feat or spell",
	"Test de compétence ou de Perception": "Skill or Perception check",
	"Actions du tour (◆ et réaction)": "Turn actions (◆ and reaction)",
	"État (valeur + 1 / − 1)": "Condition (value + 1 / − 1)",
	"Points d'héroïsme": "Hero points",
	"Points de focalisation": "Focus points",
	"Test de récupération (mourant)": "Recovery check (dying)",
	"Repos pour la nuit": "Rest for the night",
	"Groupe : demander un test (MJ)": "Party: request a check (GM)",
	"Groupe : repos pour la nuit (MJ)": "Party: rest for the night (GM)",
	"ex. Épée longue, Mâchoires": "e.g. Longsword, Jaws",
	"Nom de l'arme ou de l'attaque tel qu'il est écrit sur la fiche (majuscules et accents indifférents).": "Name of the weapon or attack as written on the sheet (case and accents ignored).",
	"1re attaque": "1st attack",
	"2e attaque (pénalité)": "2nd attack (penalty)",
	"3e attaque (pénalité)": "3rd attack (penalty)",
	"Dégâts critiques": "Critical damage",
	"La pénalité d'attaques multiples (et celle des armes agiles) est calculée par le système.": "The multiple attack penalty (including agile weapons) is computed by the system.",
	"ex. Potion de soins, Projectile magique": "e.g. Healing Potion, Force Barrage",
	"Un consommable est utilisé (potion, parchemin…) ; sinon sa carte est postée dans le chat.": "A consumable is used (potion, scroll…); anything else posts its card in the chat.",
	"1re action": "1st action",
	"2e action": "2nd action",
	"3e action": "3rd action",
	"4e action (Accéléré)": "4th action (quickened)",
	"Une touche par action. Appuyer coche ou décoche ; tout redevient disponible au début du tour du personnage. Ralenti et Accéléré sont pris en compte.": "One key per action. Press to tick or untick; everything is available again at the start of the character's turn. Slowed and quickened are taken into account.",
	"Ajouter (+ 1)": "Add (+ 1)",
	"Retirer (− 1)": "Remove (− 1)",
	"Un état sans valeur (À terre…) est ajouté ou retiré.": "A condition without a value (prone…) is added or removed.",
	"Dépenser 1 point": "Spend 1 point",
	"Regagner 1 point": "Regain 1 point",
	"Journal de séance (note datée)": "Session log (timestamped note)",
	"Minuteur du tour de combat": "Combat turn timer",
	"Zone de brouillard (révéler / cacher)": "Fog area (reveal / hide)",
	"Ajouter la note tout de suite": "Add the note right away",
	"Écrire la note dans Foundry": "Write the note in Foundry",
	"Ouvrir le journal de séance": "Open the session log",
	"Chaque note porte l'heure ; une page par jour de jeu. Le MJ crée le journal au premier appui ; un joueur peut écrire s'il en est propriétaire.": "Each note carries the time; one page per game day. The GM creates the journal on the first press; a player can write in it if they own it.",
	"Note": "Note",
	"Moment marquant": "Memorable moment",
	"(Journal de séance, créé au besoin)": "(Session log, created when needed)",
	"Contexte": "Context",
	"ajouter la scène, le round et le combattant actif": "add the scene, the round and the active combatant",
	"secondes par tour ; le minuteur repart à chaque changement de tour": "seconds per turn; the timer restarts at every turn change",
	"Orange": "Orange",
	"la touche passe à l'orange quand il reste ce nombre de secondes": "the key turns orange when this many seconds are left",
	"son quand le temps est écoulé": "sound when time is up",
	"son chez tous les joueurs (MJ)": "sound for all players (GM)",
	"message privé au joueur du combattant": "private message to the combatant's player",
	"Appui : pause / reprise. Une fois le temps écoulé, la touche clignote en rouge ; un appui relance le minuteur.": "Press: pause / resume. Once time is up the key blinks red; a press restarts the timer.",
	"Placez une lumière qui couvre la zone, sélectionnez-la (outil Éclairage), puis cliquez sur « Utiliser la sélection ». La touche l'allume avec « Fournit la vision » (la zone devient visible pour les joueurs) ou l'éteint. Une zone déjà vue reste explorée : « Réinitialiser le brouillard » l'efface.": "Place a light that covers the area, select it (Lighting tool), then click \"Use selection\". The key switches it on with \"Provides vision\" (players can see the area) or off. An area already seen stays explored: \"Reset fog\" clears it.",
	"ex. Crypte": "e.g. Crypt",
	"Icône": "Icon",
	"Bibliothèque game-icons.net (plus de 4 000 icônes). L'icône remplace l'image ou l'emoji de la touche ; sur une touche qui affiche un nombre, elle passe derrière, en filigrane.": "game-icons.net library (over 4,000 icons). The icon replaces the key's picture or emoji; on a key that shows a number, it goes behind it as a watermark.",
	"Bibliothèque d'icônes introuvable dans le plugin.": "Icon library missing from the plugin.",
	"Fermer": "Close",
	"Choisir…": "Choose…",
	"Retirer l'icône": "Remove the icon",
	"Chargement des icônes…": "Loading icons…",
	"Rechercher (ex. épée, dragon, potion, porte)": "Search (e.g. sword, dragon, potion, door)",
	"Toutes": "All",
	"Magie": "Magic",
	"Créatures": "Creatures",
	"États et soins": "Conditions & healing",
	"Lieux": "Places",
	"Nature et météo": "Nature & weather",
	"Musique et sons": "Music & sounds",
	"Dés et jeu": "Dice & game",
	"Personnages": "Characters",
	"Icônes de game-icons.net (Lorc, Delapouite et d'autres auteurs), licence CC BY 3.0.": "Icons from game-icons.net (Lorc, Delapouite and other authors), CC BY 3.0 licence.",
	"Aucune icône : essayez un autre mot (français ou anglais).": "No icon: try another word (English or French).",
	"icônes — affinez la recherche pour voir les autres.": "icons — refine the search to see the others.",
	"icônes": "icons",
	"Teinte": "Tint",
	"couleur de l'icône (blanc par défaut)": "icon colour (white by default)",
	"Position": "Position",
	"Texte en bas": "Text at the bottom",
	"Texte en haut": "Text at the top",
	"En haut, le texte échappe aux reflets du bas des boutons quand le Stream Deck est incliné.": "At the top, the text avoids the reflections at the bottom of the buttons when the Stream Deck is tilted.",
	"Précédent": "Previous",
	"Actif": "Active",
	"Suivant": "Next",
	"Autres": "Others",
	"Place dans l'initiative (carrousel)": "Place in the initiative (carousel)",
	"Place": "Place",
	"0 = combattant actif, -1 = précédent, 1 = suivant, 2, 3… Copiez la touche et changez ce nombre pour faire une rangée : elle tourne à chaque tour.": "0 = active combatant, -1 = previous, 1 = next, 2, 3… Copy the key and change this number to build a row: it turns at every turn.",
	"Cadre": "Frame",
	"couleur selon le rôle : précédent, actif, suivant, autres": "colour by role: previous, active, next, others",
	"Carrousel : précédent, actif, suivants": "Carousel: previous, active, next",
	"Tourner : change l'image de fond de la scène affichée, pour tous les joueurs (appliquée après un court arrêt de la molette). Jetons, murs et lumières restent en place. Appuyer : revenir à l'image d'origine. MJ.": "Turn: changes the background image of the viewed scene, for every player (applied after the dial stops briefly). Tokens, walls and lights stay in place. Press: back to the original image. GM.",
	"Scène : changer l'image de fond": "Scene: change the background image",
	"ex. worlds/mon-monde/cartes/taverne": "e.g. worlds/my-world/maps/tavern",
	"Mettez dans ce dossier les déclinaisons du lieu (en flammes, en ruines, de nuit…), à la même taille que l'image d'origine. L'image d'origine de la scène est toujours la première. Foundry 14 : c'est le niveau affiché qui change.": "Put the variants of the place in this folder (on fire, in ruins, at night…), at the same size as the original image. The scene's original image always comes first. Foundry 14: the viewed level changes.",
	"La page montre toujours les objets de ce personnage, quel que soit le jeton sélectionné.": "The page always shows this character's items, whatever token is selected.",
	"Jauge": "Gauge",
	"PV (barre 1 du jeton)": "HP (token bar 1)",
	"Barre 2 du jeton": "Token bar 2",
	"Attribut de la fiche (chemin)": "Sheet attribute (path)",
	"Chemin": "Path",
	"ex. resources.legact, attributes.hd": "e.g. resources.legact, attributes.hd",
	"Chemin dans les données du personnage, avec ou sans « system. ». Une valeur avec maximum (PV, ressources) se règle comme les PV ; un nombre simple aussi.": "Path in the character's data, with or without \"system.\". A value with a maximum (HP, resources) is adjusted like HP; a plain number too.",
	"Objets de": "Items of",
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

/** Carrousel de combat : cadre de couleur selon le rôle du combattant (Premium) */
const roleFields = (show) => [
	{ key: "colorPrev", label: "Précédent", type: "color", colorDefault: "#3d8bfd", pro: true, show },
	{ key: "colorActive", label: "Actif", type: "color", colorDefault: "#d94f4f", pro: true, show },
	{ key: "colorNext", label: "Suivant", type: "color", colorDefault: "#ffcc33", pro: true, show },
	{ key: "colorOther", label: "Autres", type: "color", colorDefault: "#8a8a8a", pro: true, show }
];

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
		help: "Gratuit : le jeton sélectionné (image, nom, sélection, fiche). ★ Premium : personnages précis, vue du groupe, carrousel de combat, PV et jauge (barre 1 du jeton, tous systèmes), icônes des états, ±PV, cibler, cacher, déplacer, pivoter, altitude, niveaux.",
		fields: [
			{ key: "target", label: "Jeton", type: "select", default: "selected", options: opt(
				["selected", "Jeton sélectionné"], ["actor", "Personnage précis", 1], ["turn", "Combattant actif", 1], ["party", "Groupe (personnages du groupe)", 1],
				["initiative", "Place dans l'initiative (carrousel)", 1]),
				noteFn: (s) => (s.target === "party" ? "Groupe : copiez la touche sur plusieurs emplacements, chaque touche prend un personnage du groupe." : null) },
			...partyFields((s) => s.target === "party"),
			{ key: "initOffset", label: "Place", type: "number", default: 0, min: -20, max: 20, pro: true, show: (s) => s.target === "initiative",
				note: "0 = combattant actif, -1 = précédent, 1 = suivant, 2, 3… Copiez la touche et changez ce nombre pour faire une rangée : elle tourne à chaque tour." },
			{ key: "markRoles", label: "Cadre", type: "checkbox", default: true, pro: true, show: (s) => s.target === "initiative",
				text: "couleur selon le rôle : précédent, actif, suivant, autres" },
			...roleFields((s) => s.target === "initiative" && s.markRoles !== false),
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
				["active", "Combattant actif en premier"], ["init", "Ordre d'initiative"], ["carousel", "Carrousel : précédent, actif, suivants"]),
				note: "Toutes les touches « Suivi automatique » de ce Stream Deck forment une rangée, lue ligne par ligne. S'il y a plus de combattants que de touches, la dernière affiche la suite." },
			{ key: "markRoles", label: "Cadre", type: "checkbox", default: true, pro: true, show: (s) => s.fn === "auto" && s.order === "carousel",
				text: "couleur selon le rôle : précédent, actif, suivant, autres" },
			{ key: "markRoles", label: "Cadre", type: "checkbox", default: false, pro: true, show: (s) => s.fn === "auto" && s.order !== "carousel",
				text: "couleur selon le rôle : précédent, actif, suivant, autres" },
			...roleFields((s) => s.fn === "auto" && (s.markRoles ?? s.order === "carousel")),
			{ key: "slot", label: "Place n°", type: "number", default: 1, min: 1, pro: true, show: (s) => s.fn === "slot" },
			{ key: "display", label: "Afficher", type: "select", default: "name", pro: true, show: (s) => ["slot", "turn", "auto"].includes(s.fn), options: opt(
				["name", "Nom"], ["bar1", "Barre 1 (PV)"], ["init", "Initiative"], ["none", "Rien"]) },
			{ key: "showBar", label: "Jauge PV", type: "checkbox", default: true, pro: true, text: "dessiner la jauge", show: (s) => ["slot", "turn", "auto"].includes(s.fn) },
			{ key: "showStatuses", label: "États", type: "checkbox", default: true, pro: true, text: "afficher les icônes des états actifs", show: (s) => ["slot", "turn", "auto"].includes(s.fn) },
			{ key: "slotPress", label: "Appui", type: "select", default: "select", pro: true, show: (s) => ["slot", "turn", "auto"].includes(s.fn), options: opt(
				["select", "Sélectionner + centrer"], ["pan", "Centrer la vue"], ["sheet", "Ouvrir la fiche"], ["target", "Cibler"], ["none", "Rien"]) }
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
				["pullView", "Ramener la vue des joueurs sur la mienne (MJ)"], ["timer", "Minuteur / chronomètre"], ["resetFog", "Réinitialiser le brouillard (MJ)"],
				["weather", "Météo", 1], ["time", "Temps de jeu", 1], ["showImage", "Montrer une image aux joueurs", 1], ["showJournal", "Montrer un journal aux joueurs", 1],
				["door", "Porte", 1], ["light", "Lumière", 1], ["alerts", "Alertes (20, 1, message privé)", 1],
				["clearTargets", "Effacer les cibles", 1], ["targetNext", "Cibler l'ennemi suivant", 1], ["rollPool", "Lancer la réserve de dés (molette Dés)", 1],
				["sessionNote", "Journal de séance (note datée)", 1], ["turnTimer", "Minuteur du tour de combat", 1], ["fogZone", "Zone de brouillard (révéler / cacher)", 1]) },
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
			{ key: "timerPress", label: "Appui", type: "select", default: "toggle", show: (s) => s.fn === "timer", options: opt(
				["toggle", "Démarrer / mettre en pause"], ["reset", "Remettre à zéro"]),
				note: "Terminé : un appui remet le minuteur à zéro. Le minuteur tourne dans ce navigateur (il s'arrête si la page est rechargée)." },
			{ key: "timerType", label: "Type", type: "select", default: "countdown", show: (s) => s.fn === "timer" && (s.timerPress ?? "toggle") === "toggle", options: opt(
				["countdown", "Compte à rebours"], ["stopwatch", "Chronomètre (temps écoulé)"]) },
			{ key: "minutes", label: "Durée", type: "number", default: 5, min: 0.1, max: 1440, step: "any", show: (s) => s.fn === "timer" && (s.timerPress ?? "toggle") === "toggle" && s.timerType !== "stopwatch", note: "minutes (ex. 0.5 = 30 s)" },
			{ key: "timerSound", label: "Fin", type: "checkbox", default: true, show: (s) => s.fn === "timer" && (s.timerPress ?? "toggle") === "toggle" && s.timerType !== "stopwatch", text: "son et message à la fin" },
			{ key: "timerName", label: "Nom", type: "text", placeholder: "A", show: (s) => s.fn === "timer",
				note: "Deux touches avec le même nom pilotent le même minuteur (ex. une touche « Remettre à zéro »)." },
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
			{ key: "noteMode", label: "Appui", type: "select", default: "quick", pro: true, show: (s) => s.fn === "sessionNote", options: opt(
				["quick", "Ajouter la note tout de suite"], ["ask", "Écrire la note dans Foundry"], ["open", "Ouvrir le journal de séance"]),
				note: "Chaque note porte l'heure ; une page par jour de jeu. Le MJ crée le journal au premier appui ; un joueur peut écrire s'il en est propriétaire." },
			{ key: "noteText", label: "Note", type: "text", placeholder: "Moment marquant", pro: true, show: (s) => s.fn === "sessionNote" && s.noteMode !== "open" },
			{ key: "journalId", label: "Journal", type: "select", source: "journals", emptyLabel: "(Journal de séance, créé au besoin)", pro: true, show: (s) => s.fn === "sessionNote" },
			{ key: "noteContext", label: "Contexte", type: "checkbox", default: true, pro: true, text: "ajouter la scène, le round et le combattant actif", show: (s) => s.fn === "sessionNote" && s.noteMode !== "open" },
			{ key: "turnSeconds", label: "Durée", type: "number", default: 60, min: 5, pro: true, show: (s) => s.fn === "turnTimer", note: "secondes par tour ; le minuteur repart à chaque changement de tour" },
			{ key: "turnWarn", label: "Orange", type: "number", default: 15, min: 0, pro: true, show: (s) => s.fn === "turnTimer", note: "la touche passe à l'orange quand il reste ce nombre de secondes" },
			{ key: "turnSound", label: "Fin", type: "checkbox", default: true, pro: true, text: "son quand le temps est écoulé", show: (s) => s.fn === "turnTimer" },
			{ key: "turnBroadcast", label: "", type: "checkbox", default: false, pro: true, text: "son chez tous les joueurs (MJ)", show: (s) => s.fn === "turnTimer" && s.turnSound !== false },
			{ key: "turnChat", label: "", type: "checkbox", default: false, pro: true, text: "message privé au joueur du combattant", show: (s) => s.fn === "turnTimer",
				note: "Appui : pause / reprise. Une fois le temps écoulé, la touche clignote en rouge ; un appui relance le minuteur." },
			{ key: "lightId", label: "Lumière", type: "capture", source: "selectedLight", sceneKey: "sceneId", pro: true, show: (s) => s.fn === "fogZone",
				note: "Placez une lumière qui couvre la zone, sélectionnez-la (outil Éclairage), puis cliquez sur « Utiliser la sélection ». La touche l'allume avec « Fournit la vision » (la zone devient visible pour les joueurs) ou l'éteint. Une zone déjà vue reste explorée : « Réinitialiser le brouillard » l'efface." },
			{ key: "zoneName", label: "Nom", type: "text", placeholder: "ex. Crypte", pro: true, show: (s) => s.fn === "fogZone" },
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
			{ key: "actorSource", label: "Objets de", type: "select", default: "mine", show: (s) => s.kind === "items", options: opt(
				["mine", "Mon personnage"], ["selected", "Jeton sélectionné"], ["actor", "Personnage précis"], ["turn", "Combattant actif"]) },
			{ key: "actorId", label: "Personnage", type: "select", source: "actors", show: (s) => s.kind === "items" && s.actorSource === "actor",
				note: "La page montre toujours les objets de ce personnage, quel que soit le jeton sélectionné." },
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
	tokenHp: "Tourner : PV ou autre jauge du jeton sélectionné (appliqués après un court arrêt). Appuyer : appliquer tout de suite.",
	initiative: "Tourner : tour suivant / précédent. Appuyer : centrer sur le combattant actif.",
	zoom: "Tourner : zoom. Appuyer : zoom normal, centré sur le jeton sélectionné.",
	party: "Tourner : sélectionne le jeton du personnage suivant et centre la vue.",
	scenes: "Tourner : fait défiler les scènes. Appuyer : afficher ou activer la scène montrée.",
	targets: "Tourner : parcourt les cibles possibles, les plus proches d'abord. Appuyer : cibler. Toucher l'écran : effacer les cibles.",
	tracks: "Tourner : fait défiler les pistes. Appuyer : jouer la piste montrée, ou l'arrêter si elle joue (MJ).",
	dice: "Tourner : type de dé. Appuyer : ajouter un dé. Tourner en appuyant : bonus ±1. Toucher l'écran : vider la réserve. Une touche Système « Lancer la réserve de dés » lance les dés.",
	macros: "Tourner : fait défiler les macros. Appuyer : exécuter la macro montrée.",
	backgrounds: "Tourner : change l'image de fond de la scène affichée, pour tous les joueurs (appliquée après un court arrêt de la molette). Jetons, murs et lumières restent en place. Appuyer : revenir à l'image d'origine. MJ."
};
const dialFn = (s) => s.fn ?? "musicVolume";
SCHEMAS.dial = {
	pro: true,
	noAppearance: true,
	help: "Molette (Stream Deck +, Stream Deck + XL) : tournez pour régler ou faire défiler, appuyez pour choisir. L'écran tactile affiche le titre, une image et la valeur.",
	fields: [
		{ key: "fn", label: "Fonction", type: "select", default: "musicVolume", resets: ["folderId", "folderIdName", "playlistId", "playlistIdName"], noteFn: (s) => DIAL_NOTES[dialFn(s)], options: opt(
			["musicVolume", "Volume de la musique"], ["ambientVolume", "Volume de l'ambiance"], ["interfaceVolume", "Volume de l'interface"],
			["darkness", "Lumière de la scène (obscurité, MJ)"], ["tokenHp", "Jeton sélectionné : PV ou autre jauge"], ["initiative", "Tours de combat (suivant / précédent)"], ["zoom", "Zoom de la carte"],
			["party", "Groupe : passer d'un personnage à l'autre"], ["scenes", "Scènes : faire défiler"], ["targets", "Cibles : parcourir et cibler"],
			["tracks", "Musique : choisir une piste"], ["dice", "Dés : préparer un lancer"], ["macros", "Macros : faire défiler"],
			["backgrounds", "Scène : changer l'image de fond"]) },
		{ key: "gauge", label: "Jauge", type: "select", default: "bar1", show: (s) => dialFn(s) === "tokenHp", options: opt(
			["bar1", "PV (barre 1 du jeton)"], ["bar2", "Barre 2 du jeton"], ["attr", "Attribut de la fiche (chemin)"]) },
		{ key: "attrPath", label: "Chemin", type: "text", placeholder: "ex. resources.legact, attributes.hd", show: (s) => dialFn(s) === "tokenHp" && s.gauge === "attr",
			note: "Chemin dans les données du personnage, avec ou sans « system. ». Une valeur avec maximum (PV, ressources) se règle comme les PV ; un nombre simple aussi." },
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
		{ key: "bgFolder", label: "Dossier", type: "text", placeholder: "ex. worlds/mon-monde/cartes/taverne", show: (s) => dialFn(s) === "backgrounds",
			note: "Mettez dans ce dossier les déclinaisons du lieu (en flammes, en ruines, de nuit…), à la même taille que l'image d'origine. L'image d'origine de la scène est toujours la première. Foundry 14 : c'est le niveau affiché qui change." },
		{ key: "label", label: "Titre", type: "text", placeholder: "(automatique)" }
	]
};

/* Personnage D&D 5e (VTT Deck Premium, système dnd5e) */
const DND_SKILLS = opt(
	["acr", "Acrobaties"], ["ani", "Dressage"], ["arc", "Arcanes"], ["ath", "Athlétisme"], ["dec", "Tromperie"], ["his", "Histoire"],
	["ins", "Perspicacité"], ["itm", "Intimidation"], ["inv", "Investigation"], ["med", "Médecine"], ["nat", "Nature"], ["prc", "Perception"],
	["prf", "Représentation"], ["per", "Persuasion"], ["rel", "Religion"], ["slt", "Escamotage"], ["ste", "Discrétion"], ["sur", "Survie"]
);
const DND_ABILITIES = opt(
	["str", "Force"], ["dex", "Dextérité"], ["con", "Constitution"], ["int", "Intelligence"], ["wis", "Sagesse"], ["cha", "Charisme"]
);
const DND_GROUP = ["groupSkill", "groupSave", "groupRest"];
const dndFn = (s) => s.fn ?? "item";
const dndPersonal = (s) => !DND_GROUP.includes(dndFn(s));
SCHEMAS.character = {
	pro: true,
	help: "Système D&D 5e (dnd5e 5.3 ou plus). Objets, sorts et aptitudes de la fiche, jets, emplacements de sorts, repos, inspiration, concentration, jets contre la mort. « Groupe : demander… » envoie une carte de jet dans le chat : chaque joueur lance pour son personnage.",
	fields: [
		{ key: "fn", label: "Fonction", type: "select", default: "item", options: opt(
			["item", "Utiliser un objet, un sort ou une aptitude"], ["slots", "Emplacements de sorts"], ["skill", "Jet de compétence"],
			["ability", "Test de caractéristique"], ["save", "Jet de sauvegarde"], ["initiative", "Jet d'initiative"], ["deathSave", "Jet contre la mort"],
			["hitDie", "Dé de vie"], ["rest", "Repos"], ["inspiration", "Inspiration"], ["concentration", "Concentration"],
			["groupSkill", "Groupe : demander un jet de compétence (MJ)"], ["groupSave", "Groupe : demander un jet de sauvegarde (MJ)"],
			["groupRest", "Groupe : demander un repos (MJ)"]) },
		{ key: "target", label: "Personnage", type: "select", default: "selected", show: dndPersonal, options: opt(
			["selected", "Jeton sélectionné"], ["mine", "Mon personnage (joueur)"], ["actor", "Personnage précis"], ["turn", "Combattant actif"],
			["party", "Groupe : un personnage par touche"]),
			note: "Groupe : copiez la touche sur plusieurs emplacements, chaque touche prend un personnage du groupe." },
		...partyFields((s) => dndPersonal(s) && s.target === "party"),
		{ key: "actorId", label: "Personnage", type: "select", source: "actors", show: (s) => dndPersonal(s) && s.target === "actor" },
		{ key: "itemName", label: "Nom", type: "text", placeholder: "ex. Épée longue, Boule de feu", show: (s) => dndFn(s) === "item",
			note: "Nom de l'objet, du sort ou de l'aptitude tel qu'il est écrit sur la fiche (majuscules et accents indifférents)." },
		{ key: "slotLevel", label: "Niveau", type: "select", default: "1", show: (s) => dndFn(s) === "slots", options: opt(
			["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["pact", "Magie de pacte"]) },
		{ key: "skill", label: "Compétence", type: "select", default: "prc", show: (s) => ["skill", "groupSkill"].includes(dndFn(s)), options: DND_SKILLS },
		{ key: "ability", label: "Caractéristique", type: "select", default: "dex", show: (s) => ["ability", "save", "groupSave"].includes(dndFn(s)), options: DND_ABILITIES },
		{ key: "dc", label: "DD", type: "number", min: 0, show: (s) => ["groupSkill", "groupSave"].includes(dndFn(s)), note: "facultatif : la carte indique alors les réussites et les échecs" },
		{ key: "restType", label: "Repos", type: "select", default: "short", show: (s) => ["rest", "groupRest"].includes(dndFn(s)), options: opt(
			["short", "Repos court"], ["long", "Repos long"]) },
		{ key: "mode", label: "Jet", type: "select", default: "normal", show: (s) => ["skill", "ability", "save", "initiative", "deathSave"].includes(dndFn(s)), options: opt(
			["normal", "Normal"], ["advantage", "Avec avantage"], ["disadvantage", "Avec désavantage"]) },
		{ key: "fast", label: "Rapide", type: "checkbox", default: false, show: (s) => ["item", "skill", "ability", "save", "initiative", "deathSave", "hitDie", "rest"].includes(dndFn(s)),
			text: "sans fenêtre de réglage (lance directement)" },
		{ key: "showName", label: "Afficher", type: "checkbox", default: true, show: dndPersonal, text: "écrire le nom du personnage sur la touche" }
	]
};

/* Personnage Pathfinder 2e (VTT Deck Premium, système pf2e) */
const PF2E_SKILLS = opt(
	["perception", "Perception"], ["acrobatics", "Acrobaties"], ["arcana", "Arcanes"], ["athletics", "Athlétisme"], ["crafting", "Artisanat"],
	["deception", "Duperie"], ["diplomacy", "Diplomatie"], ["intimidation", "Intimidation"], ["medicine", "Médecine"], ["nature", "Nature"],
	["occultism", "Occultisme"], ["performance", "Représentation"], ["religion", "Religion"], ["society", "Société"], ["stealth", "Discrétion"],
	["survival", "Survie"], ["thievery", "Vol"]
);
const PF2E_SAVES = opt(["fortitude", "Vigueur"], ["reflex", "Réflexes"], ["will", "Volonté"]);
const PF2E_CONDITIONS = opt(
	["frightened", "Effrayé (valeur)"], ["sickened", "Nauséeux (valeur)"], ["clumsy", "Maladroit (valeur)"], ["enfeebled", "Affaibli (valeur)"],
	["stupefied", "Stupéfié (valeur)"], ["drained", "Drainé (valeur)"], ["doomed", "Condamné (valeur)"], ["wounded", "Blessé (valeur)"],
	["slowed", "Ralenti (valeur)"], ["stunned", "Étourdi (valeur)"], ["off-guard", "Pris au dépourvu"], ["prone", "À terre"],
	["grabbed", "Agrippé"], ["restrained", "Entravé"], ["immobilized", "Immobilisé"], ["quickened", "Accéléré"], ["blinded", "Aveuglé"],
	["dazzled", "Ébloui"], ["deafened", "Sourd"], ["fatigued", "Fatigué"], ["concealed", "Masqué"], ["hidden", "Caché"],
	["invisible", "Invisible"], ["confused", "Confus"], ["fascinated", "Fasciné"], ["fleeing", "En fuite"], ["paralyzed", "Paralysé"],
	["unconscious", "Inconscient"], ["encumbered", "Surchargé"]
);
const PF2E_GROUP = ["groupCheck", "groupSave", "groupRest"];
const pf2eFn = (s) => s.fn ?? "strike";
const pf2ePersonal = (s) => !PF2E_GROUP.includes(pf2eFn(s));
SCHEMAS.pf2e = {
	pro: true,
	help: "Système Pathfinder 2e (pf2e 7 ou plus, Foundry 13 et 14). Frappes avec pénalité d'attaques multiples, actions du tour, états à valeur, points d'héroïsme et de focalisation, tests et sauvegardes. « Groupe : demander… » envoie un bouton de test dans le chat : chaque joueur lance pour son personnage.",
	fields: [
		{ key: "fn", label: "Fonction", type: "select", default: "strike", options: opt(
			["strike", "Frappe (arme ou attaque)"], ["item", "Objet, action, don ou sort"], ["skill", "Test de compétence ou de Perception"],
			["save", "Jet de sauvegarde"], ["initiative", "Jet d'initiative"], ["actions", "Actions du tour (◆ et réaction)"],
			["condition", "État (valeur + 1 / − 1)"], ["heroPoints", "Points d'héroïsme"], ["focus", "Points de focalisation"],
			["recovery", "Test de récupération (mourant)"], ["rest", "Repos pour la nuit"],
			["groupCheck", "Groupe : demander un test (MJ)"], ["groupSave", "Groupe : demander un jet de sauvegarde (MJ)"],
			["groupRest", "Groupe : repos pour la nuit (MJ)"]) },
		{ key: "target", label: "Personnage", type: "select", default: "selected", show: pf2ePersonal, options: opt(
			["selected", "Jeton sélectionné"], ["mine", "Mon personnage (joueur)"], ["actor", "Personnage précis"], ["turn", "Combattant actif"],
			["party", "Groupe : un personnage par touche"]),
			note: "Groupe : copiez la touche sur plusieurs emplacements, chaque touche prend un personnage du groupe." },
		...partyFields((s) => pf2ePersonal(s) && s.target === "party"),
		{ key: "actorId", label: "Personnage", type: "select", source: "actors", show: (s) => pf2ePersonal(s) && s.target === "actor" },
		{ key: "itemName", label: "Nom", type: "text", placeholder: "ex. Épée longue, Mâchoires", show: (s) => pf2eFn(s) === "strike",
			note: "Nom de l'arme ou de l'attaque tel qu'il est écrit sur la fiche (majuscules et accents indifférents)." },
		{ key: "strikeMode", label: "Jet", type: "select", default: "attack0", show: (s) => pf2eFn(s) === "strike", options: opt(
			["attack0", "1re attaque"], ["attack1", "2e attaque (pénalité)"], ["attack2", "3e attaque (pénalité)"], ["damage", "Dégâts"], ["critical", "Dégâts critiques"]),
			note: "La pénalité d'attaques multiples (et celle des armes agiles) est calculée par le système." },
		{ key: "itemName", label: "Nom", type: "text", placeholder: "ex. Potion de soins, Projectile magique", show: (s) => pf2eFn(s) === "item",
			note: "Un consommable est utilisé (potion, parchemin…) ; sinon sa carte est postée dans le chat." },
		{ key: "skill", label: "Compétence", type: "select", default: "perception", show: (s) => ["skill", "groupCheck"].includes(pf2eFn(s)), options: PF2E_SKILLS },
		{ key: "save", label: "Sauvegarde", type: "select", default: "fortitude", show: (s) => ["save", "groupSave"].includes(pf2eFn(s)), options: PF2E_SAVES },
		{ key: "slot", label: "Action", type: "select", default: "1", show: (s) => pf2eFn(s) === "actions", options: opt(
			["1", "1re action"], ["2", "2e action"], ["3", "3e action"], ["4", "4e action (Accéléré)"], ["reaction", "Réaction"]),
			note: "Une touche par action. Appuyer coche ou décoche ; tout redevient disponible au début du tour du personnage. Ralenti et Accéléré sont pris en compte." },
		{ key: "condition", label: "État", type: "select", default: "frightened", show: (s) => pf2eFn(s) === "condition", options: PF2E_CONDITIONS },
		{ key: "step", label: "Appui", type: "select", default: "up", show: (s) => pf2eFn(s) === "condition", options: opt(
			["up", "Ajouter (+ 1)"], ["down", "Retirer (− 1)"]),
			note: "Un état sans valeur (À terre…) est ajouté ou retiré." },
		{ key: "resource", label: "Appui", type: "select", default: "spend", show: (s) => ["heroPoints", "focus"].includes(pf2eFn(s)), options: opt(
			["spend", "Dépenser 1 point"], ["gain", "Regagner 1 point"]) },
		{ key: "dc", label: "DD", type: "number", min: 0, show: (s) => ["groupCheck", "groupSave"].includes(pf2eFn(s)), note: "facultatif : la carte indique alors les réussites et les échecs" },
		{ key: "fast", label: "Rapide", type: "checkbox", default: false, show: (s) => ["strike", "skill", "save", "initiative", "rest"].includes(pf2eFn(s)),
			text: "sans fenêtre de réglage (lance directement)" },
		{ key: "showName", label: "Afficher", type: "checkbox", default: true, show: pf2ePersonal, text: "écrire le nom du personnage sur la touche" }
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
	{ key: "textPos", label: "Position", type: "select", default: "bottom", show: (s) => !s.hideText, options: opt(["bottom", "Texte en bas"], ["top", "Texte en haut"]),
		note: "En haut, le texte échappe aux reflets du bas des boutons quand le Stream Deck est incliné." },
	{ key: "customImage", label: "Image", type: "text", placeholder: "chemin Foundry (optionnel)" },
	{ key: "gameIcon", label: "Icône", type: "icon",
		note: "Bibliothèque game-icons.net (plus de 4 000 icônes). L'icône remplace l'image ou l'emoji de la touche ; sur une touche qui affiche un nombre, elle passe derrière, en filigrane." },
	{ key: "iconColor", label: "Teinte", type: "color", colorDefault: "#ffffff", show: (s) => !!s.gameIcon, note: "couleur de l'icône (blanc par défaut)" },
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
	/** éléments placés sous la ligne (sélecteur d'icônes) */
	const after = [];
	switch (f.type) {
		case "textarea": {
			input = el("textarea", { id: f.key, rows: 6, placeholder: tr(f.placeholder ?? "") });
			input.value = value ?? "";
			input.addEventListener("change", () => (set(f.key, input.value.trim() ? input.value : undefined), save()));
			break;
		}
		case "icon": {
			if (globalThis.IconPicker) {
				const ip = IconPicker.field(f, { settings, set, save, render, tr, el });
				input = ip.input;
				if (ip.panel) after.push(ip.panel);
			} else input = el("span", { class: "help small", text: tr("Bibliothèque d'icônes introuvable dans le plugin.") });
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
			const c = el("input", { id: f.key, type: "color", value: value || f.colorDefault || "#333333" });
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
	for (const node of after) frag.append(node);
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
	} else if (s.lastRejected && ["badCode", "noCode"].includes(s.lastRejected.reason) && Date.now() - s.lastRejected.at < 120000) {
		// Une page a essayé sans le bon code. On n'ouvre le code tout seul que pour le Foundry déjà appairé :
		// pour une autre origine, on la nomme, pour que l'utilisateur ne donne pas le code à un site inconnu.
		const o = s.lastRejected.origin;
		if (o && o === s.pairedOrigin) {
			txt.textContent = tr("Foundry attend le code d'appairage ci-dessous.");
			$("#connection").open = true;
		} else {
			txt.textContent = `${o || tr("Une page")} ${tr("demande le code d'appairage. Ne le donnez que si c'est votre Foundry.")}`;
		}
	} else {
		txt.textContent = `${tr("En attente de Foundry")} (port ${s.port})…`;
	}
	$("#port").value = s.port;
	$("#allowRemote").checked = !!s.allowRemote;
	if (s.pairCode) $("#pairCode").value = s.pairCode;
	// Dernière connexion refusée (site web, autre appareil, ancien module ou mauvais code)
	const rej = $("#rejected");
	const r = s.lastRejected;
	const REASONS = { badCode: "code incorrect", noCode: "code manquant ou module Foundry trop ancien", timeout: "délai dépassé", badMessage: "message invalide" };
	if (r && Date.now() - r.at < 10 * 60000) {
		rej.hidden = false;
		rej.textContent = `${tr("Connexion refusée")} (${tr(REASONS[r.reason] ?? r.reason)})${r.origin ? ` ${tr("depuis")} ${r.origin}` : ""}`;
	} else rej.hidden = true;
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
	$("#pairCode").addEventListener("focus", (e) => e.target.select());
	// Deux clics pour changer de code (Foundry devra être appairé à nouveau)
	let armed = null;
	$("#newPairCode").addEventListener("click", (e) => {
		const btn = e.currentTarget;
		if (armed) {
			clearTimeout(armed);
			armed = null;
			btn.textContent = tr("Nouveau code");
			toPlugin({ type: "newPairCode" });
			return;
		}
		btn.textContent = tr("Confirmer ?");
		btn.title = tr("Créer un nouveau code ? Foundry devra être appairé à nouveau avec ce code.");
		armed = setTimeout(() => ((armed = null), (btn.textContent = tr("Nouveau code"))), 4000);
	});
	$("#profExploration").addEventListener("click", () => toPlugin({ type: "switchProfile", profile: "exploration" }));
	$("#profCombat").addEventListener("click", () => toPlugin({ type: "switchProfile", profile: "combat" }));
});
