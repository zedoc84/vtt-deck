# Moving from Material Deck to VTT Deck

[Français plus bas](#francais)

This guide is for Foundry VTT game masters and players who use **Material Deck** and want to switch to **VTT Deck**, for example because their old setup stopped working after a Foundry update, or because they prefer a free core with an optional one-time purchase.

VTT Deck is an independent project. It is not affiliated with Material Foundry, and this page does not judge Material Deck: Material Deck is still maintained (version 2 is available to Material Foundry Patreon members at the [Material Apprentice tier or higher](https://materialfoundry.github.io/MaterialDeck/)). Nothing is converted automatically: you rebuild your keys with VTT Deck actions, using the table below.

## At a glance

| | VTT Deck |
|---|---|
| Price | Foundry module and Stream Deck plugin: **free**. **VTT Deck Premium** (initiative tracker, dials, D&D 5e and Pathfinder 2e character keys, damage pad…): **one-time purchase** of $14.99 on the [Foundry store](https://www.foundryvtt.store/products/vtt-deck-premium). |
| Foundry | v13 and v14 |
| What to install | the **VTT Deck** Foundry module and the **VTT Deck** Stream Deck plugin. The plugin itself relays between Foundry and the Stream Deck: there is no other program to install. |
| Devices | Stream Deck (15 keys), XL, Mini, Neo, Stream Deck +, Stream Deck + XL, **Stream Deck Mobile**, **Virtual Stream Deck** (Stream Deck 7.0 or later) |
| Connection | your Foundry browser (or the Foundry desktop app) connects to the plugin on your own computer (port 3006), after a one-time **pairing code**. Nothing goes over the internet. |
| Languages | English and French (Foundry module and Stream Deck inspector) |

## Step by step

1. **Install the Stream Deck plugin**: search for *VTT Deck* in the Elgato Marketplace, or download `com.vttdeck.foundry.streamDeckPlugin` from the [Releases](https://github.com/zedoc84/vtt-deck/releases) page and double-click it. You can keep the Material Deck plugin installed: the two plugins don't use the same port.
2. **Install the Foundry module**: in Foundry, *Add-on Modules → Install Module*, search for *VTT Deck* (or paste `https://github.com/zedoc84/vtt-deck/releases/latest/download/module.json`), then enable it in your world.
3. **Pair them once**: drag any VTT Deck action onto a key, open **Foundry connection** at the bottom of its settings and copy the code. In Foundry: *Game Settings → Configure Settings → VTT Deck → Pairing code*. The dot at the top of the key settings turns green.
4. **Start from a ready-made profile**: in the settings of any VTT Deck key, **Ready-made profiles → Exploration** or **Combat**. They exist for every device listed above and are ordinary profiles that you can rearrange.
5. **Rebuild your own keys** with the table below. Keep the Stream Deck *Title* field empty: Foundry writes the text into the key image.
6. **When you are done**, disable the Material Deck module in your world, so two modules don't drive the Stream Deck at the same time. You can uninstall its plugin later.

## Action by action

★ = needs VTT Deck Premium. Without it, a key using a Premium option shows a padlock; everything else keeps working.

| Material Deck | VTT Deck |
|---|---|
| **Macro** | **Macro**: runs the macro; its image and name appear on the key. |
| **Scene**: view, activate | **Scene**: view it yourself, activate it for everyone, open its configuration, show or hide it in the navigation bar. |
| **Scene**: darkness | **System → Scene darkness**. ★ **Dial → Scene lighting** on Stream Deck + and + XL. |
| **Playlist Control** | **Music & Sounds**: start/stop a playlist or a track, stop everything. ★ crossfade between playlists. |
| **Soundboard** | **Music & Sounds → Audio file**, one sound per key, for everyone or just for you. ★ **Dynamic Page → sound folder** fills a page of keys with the files of a folder. |
| **Combat Tracker → Combatants** | ★ **Combat → Automatic initiative tracker**: a row of identical keys that fills itself in turn order, with HP, conditions and initiative. |
| **Combat Tracker → Current combatant** | ★ **Combat → Active combatant**, or **Combatant #N**. |
| **Combat Tracker → Control** (start/stop, next/previous turn and round, roll initiative, turn display) | **Combat**: the same functions are free. ★ add/remove the selected tokens. |
| **Token**: selected token; select, centre, open the sheet | **Token**: the same functions are free. |
| **Token**: by name or actor, user character | ★ **Token → Specific character**, **Active combatant**, **Party** (one key per player character). Players: ★ **Character (D&D 5e / PF2e) → My character**. |
| **Token**: stats (HP, AC…) | ★ **Token**: bar 1 (HP), bar 2 or any attribute (e.g. `system.attributes.ac.value`) with a gauge, for every game system. |
| **Token**: target, toggle visibility, toggle combat state, move, rotate | ★ **Token**: target, hide/show, add to/remove from combat, move one square, rotate, elevation, scene levels (Foundry v14), toggle a condition, ±HP. |
| **Other Actions**: pause, control buttons, sidebar tab, roll dice, roll tables, chat message | **System**: pause, scene tool, sidebar tab, dice roll (with chat visibility), draw from a roll table, chat message. |
| **Other Actions**: dice pool | ★ **Dial → Dice** to build the pool, **System → Roll the dice pool**. |
| **Other Actions**: journal entry | ★ **System → Show a journal to players**. |
| **Other Actions**: cycle through tokens | ★ **Dial → Party** and **Dial → Targets** on Stream Deck + and + XL. |
| **Custom actions** | ★ **Sequence**: several actions in one key, without code (and a GM-only script step). For code, a **Macro** key. |
| Gaming system modules | ★ **Character (D&D 5e)** and ★ **Character (PF2e)**: items, spells and strikes, rolls, spell slots, turn actions, conditions, rests, party roll requests. Token attributes work with every system. |
| Stream Deck + dials | ★ **Dial**: volumes, lighting, turns, token HP, zoom, party, scenes, targets, tracks, dice, macros. ★ Any action placed on a dial: pressing it does what the key does. |
| Virtual Deck | Elgato's **Virtual Stream Deck** (Stream Deck 7.0 or later): ready-made 64-key "GM screen" profiles (8 × 8). |

VTT Deck also has things to look at once you have moved: free session tools (pull the players' view to yours, timer on a key, reset the fog of war), the free **icon library** (over 4,000 game-icons.net icons for any key), and ★ ambiences in one key, weather, game time, doors and lights, alerts on natural 20s, session log, combat turn timer, and automatic switching to the Combat profile.

**No direct equivalent today**: opening a compendium pack, switching the chat roll mode for all rolls, token wildcard images, token vision and light settings. A **Macro** key can do most of these.

## If something does not work

- **The keys don't update and the dot at the top of the key settings stays red**: Foundry is not connected. Check that the VTT Deck module is enabled, that the pairing code was copied, and that <http://127.0.0.1:3006> answers in the browser that runs Foundry.
- **Chrome or Edge asks to "access devices on your local network"**: accept; it lets the Foundry page talk to the plugin on your computer.
- **A key shows a padlock**: it uses a ★ Premium option.
- **The text appears twice**: empty the *Title* field of the key in the Stream Deck app.

More help: the [VTT Deck documentation](https://github.com/zedoc84/vtt-deck#readme) and the [issues page](https://github.com/zedoc84/vtt-deck/issues).

*Material Deck and Material Foundry are names of their respective owners. Stream Deck and Elgato are trademarks of Corsair Memory, Inc. Foundry Virtual Tabletop is a trademark of Foundry Gaming LLC.*

---

<a id="francais"></a>

# Passer de Material Deck à VTT Deck

Ce guide s'adresse aux MJ et aux joueurs de Foundry VTT qui utilisent **Material Deck** et veulent passer à **VTT Deck**, par exemple parce que leur ancienne installation ne marche plus après une mise à jour de Foundry, ou parce qu'ils préfèrent une base gratuite avec un achat unique facultatif.

VTT Deck est un projet indépendant, sans lien avec Material Foundry, et cette page ne juge pas Material Deck : Material Deck est toujours suivi (la version 2 est réservée aux membres Patreon de Material Foundry, [palier Material Apprentice ou plus](https://materialfoundry.github.io/MaterialDeck/)). Rien n'est converti automatiquement : vous refaites vos touches avec les actions de VTT Deck, à l'aide du tableau ci-dessous.

## En bref

| | VTT Deck |
|---|---|
| Prix | Module Foundry et plugin Stream Deck : **gratuits**. **VTT Deck Premium** (suivi d'initiative, molettes, touches Personnage D&D 5e et Pathfinder 2e, pavé de dégâts…) : **achat unique** de 14,99 $ sur la [boutique Foundry](https://www.foundryvtt.store/products/vtt-deck-premium). |
| Foundry | v13 et v14 |
| À installer | le module Foundry **VTT Deck** et le plugin Stream Deck **VTT Deck**. Le plugin fait lui-même le lien entre Foundry et le Stream Deck : aucun autre programme à installer. |
| Appareils | Stream Deck (15 touches), XL, Mini, Neo, Stream Deck +, Stream Deck + XL, **Stream Deck Mobile**, **Virtual Stream Deck** (Stream Deck 7.0 ou plus) |
| Connexion | votre navigateur Foundry (ou l'application Foundry) se connecte au plugin sur votre propre ordinateur (port 3006), après un **code d'appairage** saisi une fois. Rien ne passe par internet. |
| Langues | français et anglais (module Foundry et inspecteur Stream Deck) |

## Pas à pas

1. **Installez le plugin Stream Deck** : cherchez *VTT Deck* dans l'Elgato Marketplace, ou téléchargez `com.vttdeck.foundry.streamDeckPlugin` sur la page [Releases](https://github.com/zedoc84/vtt-deck/releases) et double-cliquez dessus. Vous pouvez garder le plugin Material Deck : les deux plugins n'utilisent pas le même port.
2. **Installez le module Foundry** : dans Foundry, *Modules complémentaires → Installer un module*, cherchez *VTT Deck* (ou collez `https://github.com/zedoc84/vtt-deck/releases/latest/download/module.json`), puis activez-le dans votre monde.
3. **Appairez-les une fois** : glissez une action VTT Deck sur une touche, ouvrez **Connexion Foundry** en bas de ses réglages et copiez le code. Dans Foundry : *Paramètres → Configurer les paramètres → VTT Deck → Code d'appairage*. Le point en haut des réglages de la touche passe au vert.
4. **Partez d'un profil prêt à l'emploi** : dans les réglages de n'importe quelle touche VTT Deck, **Profils prêts à l'emploi → Exploration** ou **Combat**. Ils existent pour tous les appareils ci-dessus et sont des profils ordinaires, à réarranger comme vous voulez.
5. **Refaites vos propres touches** avec le tableau ci-dessous. Laissez vide le champ *Titre* du Stream Deck : c'est Foundry qui écrit le texte dans l'image de la touche.
6. **Une fois terminé**, désactivez le module Material Deck dans votre monde, pour que deux modules ne pilotent pas le Stream Deck en même temps. Vous pourrez désinstaller son plugin plus tard.

## Action par action

★ = demande VTT Deck Premium. Sans lui, une touche qui utilise une option Premium affiche un cadenas ; tout le reste fonctionne.

| Material Deck | VTT Deck |
|---|---|
| **Macro** | **Macro** : lance la macro ; son image et son nom s'affichent sur la touche. |
| **Scene** : afficher, activer | **Scène** : l'afficher pour vous, l'activer pour tous, ouvrir sa configuration, l'afficher ou la cacher dans la barre de navigation. |
| **Scene** : obscurité | **Système → Obscurité de la scène**. ★ **Molette → Lumière de la scène** sur Stream Deck + et + XL. |
| **Playlist Control** | **Musique & sons** : lancer/arrêter une playlist ou une piste, tout arrêter. ★ fondu enchaîné entre playlists. |
| **Soundboard** | **Musique & sons → Fichier audio**, un son par touche, pour tous ou pour vous seul. ★ **Page dynamique → dossier de sons** remplit une page de touches avec les fichiers d'un dossier. |
| **Combat Tracker → Combatants** | ★ **Combat → Suivi d'initiative automatique** : une rangée de touches identiques qui se remplit dans l'ordre des tours, avec PV, états et initiative. |
| **Combat Tracker → Current combatant** | ★ **Combat → Combattant actif**, ou **Combattant n°…**. |
| **Combat Tracker → Control** (commencer/terminer, tour et round suivant/précédent, initiative, affichage du tour) | **Combat** : les mêmes fonctions sont gratuites. ★ ajouter/retirer les jetons sélectionnés. |
| **Token** : jeton sélectionné ; sélectionner, centrer, ouvrir la fiche | **Jeton** : les mêmes fonctions sont gratuites. |
| **Token** : par nom ou par acteur, personnage du joueur | ★ **Jeton → Personnage précis**, **Combattant actif**, **Groupe** (une touche par personnage joueur). Joueurs : ★ **Personnage (D&D 5e / PF2e) → Mon personnage**. |
| **Token** : statistiques (PV, CA…) | ★ **Jeton** : barre 1 (PV), barre 2 ou n'importe quel attribut (ex. `system.attributes.ac.value`) avec une jauge, pour tous les systèmes de jeu. |
| **Token** : cibler, visibilité, état de combat, déplacer, pivoter | ★ **Jeton** : cibler, cacher/montrer, ajouter/retirer du combat, déplacer d'une case, pivoter, altitude, niveaux de scène (Foundry v14), basculer un état, ±PV. |
| **Other Actions** : pause, boutons de contrôle, onglet de la barre latérale, lancer de dés, tables aléatoires, message dans le chat | **Système** : pause, outil de la scène, onglet de la barre latérale, lancer de dés (avec la visibilité dans le chat), tirer dans une table, message dans le chat. |
| **Other Actions** : réserve de dés | ★ **Molette → Dés** pour préparer la réserve, **Système → Lancer la réserve de dés**. |
| **Other Actions** : journal | ★ **Système → Montrer un journal aux joueurs**. |
| **Other Actions** : parcourir les jetons | ★ **Molette → Groupe** et **Molette → Cibles** sur Stream Deck + et + XL. |
| **Custom actions** | ★ **Séquence** : plusieurs actions sur une touche, sans code (et une étape de script réservée au MJ). Pour du code, une touche **Macro**. |
| Modules de système de jeu | ★ **Personnage (D&D 5e)** et ★ **Personnage (PF2e)** : objets, sorts et frappes, jets, emplacements de sorts, actions du tour, états, repos, demandes de jet au groupe. Les attributs de jeton fonctionnent avec tous les systèmes. |
| Molettes du Stream Deck + | ★ **Molette** : volumes, lumière, tours, PV du jeton, zoom, groupe, scènes, cibles, pistes, dés, macros. ★ Toute action posée sur une molette : l'appui fait comme la touche. |
| Virtual Deck | le **Virtual Stream Deck** d'Elgato (Stream Deck 7.0 ou plus) : profils « écran du MJ » de 64 touches (8 × 8) prêts à l'emploi. |

À découvrir aussi une fois installé : les outils de séance gratuits (ramener la vue des joueurs sur la vôtre, minuteur sur une touche, réinitialiser le brouillard), la **bibliothèque d'icônes** gratuite (plus de 4 000 icônes game-icons.net pour n'importe quelle touche), et ★ les ambiances en une touche, la météo, le temps de jeu, les portes et lumières, les alertes sur 20 naturel, le journal de séance, le minuteur du tour de combat et le passage automatique au profil Combat.

**Pas d'équivalent direct aujourd'hui** : ouvrir un compendium, changer le mode de jet du chat pour tous les jets, images « joker » des jetons, réglages de vision et de lumière d'un jeton. Une touche **Macro** peut faire la plupart de ces choses.

## Si quelque chose ne marche pas

- **Les touches ne se mettent pas à jour et le point en haut des réglages de la touche reste rouge** : Foundry n'est pas connecté. Vérifiez que le module VTT Deck est activé, que le code d'appairage a été recopié, et que <http://127.0.0.1:3006> répond dans le navigateur qui affiche Foundry.
- **Chrome ou Edge demande l'accès « aux appareils de votre réseau local »** : acceptez ; c'est ce qui permet à la page Foundry de parler au plugin sur votre ordinateur.
- **Une touche affiche un cadenas** : elle utilise une option ★ Premium.
- **Le texte apparaît en double** : videz le champ *Titre* de la touche dans l'application Stream Deck.

Plus d'aide : la [documentation de VTT Deck](https://github.com/zedoc84/vtt-deck#readme) et la [page des problèmes](https://github.com/zedoc84/vtt-deck/issues).

*Material Deck et Material Foundry appartiennent à leurs propriétaires. Stream Deck et Elgato sont des marques de Corsair Memory, Inc. Foundry Virtual Tabletop est une marque de Foundry Gaming LLC.*
