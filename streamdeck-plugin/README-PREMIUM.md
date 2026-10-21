<a id="english"></a>

# VTT Deck Premium — Stream Deck

**English** · [Français](#francais)

**VTT Deck Premium** unlocks the advanced keys and dials of the **VTT Deck** Stream Deck plugin — everything marked ★ Premium. It is built for game masters who run their whole session from the Stream Deck: initiative, damage, the party at a glance, ambiences, doors, time, without touching the mouse.

Current version: **1.3.1** · works with the VTT Deck plugin **1.5.1** or later.

## What you get on your Stream Deck

| ★ Premium feature | On the Stream Deck |
|---|---|
| **Automatic initiative tracker** | a row of identical keys that fills itself in combat order, active combatant first |
| **Party view** | one key per player character, assigned automatically, with HP, gauge and conditions |
| **Damage & Healing Pad** | type an amount, apply it to every selected token in one press |
| **Conditions on keys** | small icons of the active conditions (prone, poisoned…) in a corner of token keys |
| **Quick targeting** | "Clear targets" and "Target next enemy" |
| **Token movement** | arrows to move the selected tokens one square, rotation and elevation keys |
| **Scene levels (Foundry v14)** | view the level above/below, move a token up or down a level |
| **Dials (Stream Deck +, Stream Deck + XL)** | volumes, scene lighting, combat turns, token HP, zoom — and dials to browse the party, scenes, targets (with Shift-target), tracks, dice and macros, with a picture and the value on the touch strip |
| **Any action on a dial** | put a Macro, Scene, Combat, Token… action on a dial: pressing does the same as the key |
| **Ambience** | one key sets scene, music (with crossfade), darkness and weather |
| **Soundboard** | a page of keys filled with the audio files of a Foundry folder |
| **Crossfade** | switch playlists with a fade instead of a hard cut |
| **Weather** | rain, snow, fog… on the scene with one key |
| **Game time** | +1 min, +10 min, +1 h, rest, and a key showing the world time |
| **Show to players** | show an image or a journal page to the whole table |
| **Doors and lights** | open, close or lock a specific door; switch a light on or off |
| **Alerts** | a key that lights up and blinks on a natural 20, a natural 1 or a whisper |
| **Dynamic Page** | keys filled with the macros, scenes, playlists or tracks of a folder, or a character's items |
| **Colour thresholds** | a key turns orange, then red, as HP drop — with an optional image |
| **Player mode** | the GM chooses which actions players may use on their own Stream Deck (sheet, attacks, spells…) |
| **Sequences** | several actions in one key, without code — plus a GM-only script step |
| **Automatic profile switching** | the Stream Deck shows the Combat profile when a combat starts, and switches back at the end |
| **Full Token and Combat keys** | specific characters, HP / bar 2 / any attribute, conditions, ±HP, hide, combatant #N… |

## Getting VTT Deck Premium

1. Install the free **VTT Deck** Stream Deck plugin (1.5.1 or later) from the Elgato Marketplace — it already contains every ★ Premium key and dial.
2. Buy VTT Deck Premium: **[purchase link to add]**.
3. Activate it as explained with your purchase. As soon as it is active, the padlocks disappear. Your key settings are kept.

You can set up ★ Premium keys before buying: they show a padlock until VTT Deck Premium is active.

## Combat and tokens

**Automatic initiative tracker** — *Combat* action → *Automatic initiative tracker*. Copy the key along a row: every such key on the same Stream Deck forms one row, read line by line. *Order*: active combatant first, or initiative order. When there are more combatants than keys, the last key becomes **More** (`1/3`…). Yellow border = their turn, ☠ = defeated, 🙈 = hidden, initiative in the top-left corner.

**Party view** — *Token* action → *Token: Party (party characters)*. Copy the key: each key takes one party character. *Party*: *Automatic* (the game system's party — PF2e active party, D&D 5e primary party — otherwise the characters assigned to your players), *A Group actor*, or *An actor folder*. It shows HP, the gauge and the active conditions; a yellow border marks the character whose turn it is.

**Damage & Healing Pad** — one *Damage & Healing Pad* key per role: digits `0`–`9`, *Add a value (+N)*, *Amount* (press = reset), *Clear*, *Delete last digit*, **Damage**, **Healing**. Tokens concerned: selected, otherwise targeted. Example: select three goblins, press `1`, `2`, **Damage** → each loses 12 HP.

**Conditions on keys** — Token and Combat keys show up to 4 icons of active conditions (option *Conditions*).

**Quick targeting** — *System* action → *Clear targets* or *Target next enemy* (hostile tokens, in combat order, otherwise from the nearest; option to include neutral tokens).

**Token movement** — *Token* action, *On press*: *Move one square* (8 directions), *Rotate* (e.g. 45°), *Change elevation* (e.g. +5). It moves every selected token; walls stop players, not the GM.

**Scene levels (Foundry v14)** — *Scene* action → *Level up / Level down* changes the level you are viewing. *Token* action → *Go up / Go down a level* moves the selected tokens to the adjacent level.

## Dials (Stream Deck + and Stream Deck + XL)

Drag the **Dial** action onto a dial and choose its function:

| Function | Turn | Press | Touch the strip |
|---|---|---|---|
| Music / Ambience / Interface volume | adjust the volume | mute / unmute | same as press |
| Scene lighting (darkness, GM) | darker / lighter | day ↔ night | same as press |
| Selected token HP | change HP (applied after a short pause, the change shows first) | apply now | same as press |
| Combat turns | next / previous turn | centre on the active combatant | same as press |
| Map zoom | zoom in / out | normal zoom, centred on the selected token | same as press |
| **Party** | select the next party character's token and centre on it | open/close sheet, target, or select (your choice) | same as press |
| **Scenes** | browse the scenes (all, or one folder) | view (for me) or activate (for everyone) | same as press |
| **Targets** | go through possible targets — enemies, neutral, allies (each can be turned off), nearest first; options: centre the view on it, ping it on the map (seen by everyone) | target it; with the **Shift** option, add it to the current targets (like Shift + click) | clear all targets |
| **Music** | browse the tracks of every playlist (or one playlist) | play the track shown, or stop it if it is playing (GM) | same as press |
| **Dice** | change die type (d4 … d100); turn while pressed: bonus ±1 | add one die of that type | empty the pool |
| **Macros** | browse the macros (all, or one folder) | run the macro shown | same as press |

The touch strip shows the title (with the position, e.g. `Targets 2/5`), a picture (portrait, scene thumbnail, macro image…), the value and a gauge. *Step* sets how much one notch changes.

**Rolling the dice pool** — add a *System* key → *Roll the dice pool (Dice dial)*. It shows the pool (`2d6 + 2`) and rolls it in the chat (visibility of your choice), then empties it — or keeps it with *keep the pool after rolling*.

**Any action on a dial** — you can also put the Macro, Scene, Token, Combat, Music & Sounds, System, Damage & Healing Pad, Ambience, Dynamic Page and Sequence actions on a dial. Pressing the dial (or touching the strip) does exactly what the key does, and the strip shows the key's picture and text. Turning: *Combat* = next / previous turn, *Damage & Healing Pad* = amount, *Music & Sounds* = volume (of the track, otherwise of the music); no effect for the other actions.

## Ambience and sound

**Ambience** — one key (GM) stops the other playlists (with an optional crossfade), activates or views the scene, sets darkness and weather, starts the playlist and runs a macro if you chose one. Green border = the ambience is in place.

**Soundboard** — *Dynamic Page* action → *Content: Sounds from a file folder*. Type the folder (e.g. `worlds/myworld/sounds`, or `sounds` with *Foundry files*), copy the key: the keys fill themselves with the folder's audio files. Add a *Next page* key with the same folder to scroll.

**Crossfade** — *Music & Sounds* action, *Whole playlist* → *Crossfade* (seconds). Starting the playlist fades out the music playing and fades in the new one, for every player.

**Weather** — *System* action → *Weather*: one press sets it on the scene, a second press removes it.

## Running the table

**Game time** — *System* action → *Game time*: +1 min, +10 min, +1 h, *Rest* (8 h by default), custom duration, or *Show world time* (a key showing `14:05 · Day 3`).

**Show to players** — *System* action → *Show an image to players* (image path, optional caption) or *Show a journal to players* (journal and page).

**Doors and lights** — *System* action → *Door* or *Light*. In Foundry, select the door (Walls tool) or the light (Lighting tool), then click **Use selection** in the key settings. Door: *Open / close* or *Lock / unlock* (GM); green border = open, red = locked. Light: on/off.

**Alerts** — *System* action → *Alerts*: the key blinks on a natural 20, a natural 1 or a whisper (each can be turned off; players' rolls only by default). A press clears it and opens the chat.

## Customisation

**Dynamic Page** — macros, scenes or playlists of a folder, tracks of a playlist, sounds of a file folder, or **a character's items** (*My character* or *Selected token*, filtered by type: weapons, spells…). Copy the *Item* key; add *Next page* / *Previous page* keys for the same content.

**Colour thresholds** — in every key's *Appearance*: *Below (%)* + colour (e.g. 50 → orange) and a critical threshold (e.g. 25 → red), with an optional image. Works on any key showing a value and a maximum (HP, bars).

**Player mode** — a convenience, not a security barrier: Foundry's own permissions still decide what each player may do. In Foundry, *Configure Settings* → *VTT Deck Premium* → **Player mode**: tick the actions players may use on their own Stream Deck. A forbidden key shows 🚫 on the player's deck. On the player's computer, set the VTT Deck module's connection to *Always*. Combined with *Dynamic Page → a character's items*, players get their attacks and spells on keys.

**Sequences** — the **Sequence** action chains up to 6 steps: run a macro, view/activate a scene, play/stop a playlist, stop the music, play a sound, set darkness, weather, chat message, dice roll, wait, pause, advance time, show an image. An error stops the sequence. The **Script** step (GM only) runs JavaScript for advanced users. The first time a script runs, Foundry shows you its code and asks for confirmation (a profile downloaded from the internet could contain one); once accepted, the same script is not asked again in that browser. All the scripts of a sequence are confirmed before its first step, so refusing one runs nothing. Hidden or text-direction characters are flagged in red: refuse a script that contains them unless you know why.

## Ready-made profiles and automatic switching

The VTT Deck plugin comes with **VTT Deck – Exploration** and **VTT Deck – Combat**. With VTT Deck Premium, the Stream Deck switches to **Combat** when a combat starts, then back to the profile you were using (or to **Exploration**, or stays — your choice in Foundry).

| Model | Exploration | Combat |
|---|---|---|
| Stream Deck (15 keys) | 4 scenes + next page · 4 macros + next page · selected token, 2 playlists + next page, pause | 5-key initiative row · previous turn, round, next turn, NPC initiative, pad folder · selected token (HP), start, end, add/remove tokens, pause |
| Stream Deck XL | 7 scenes, 7 macros, each with next page · 4-key party view, 3 playlists + next page · selected token, 4 ambiences to set, stop music, start combat, pause | 8-key initiative row · turn, round and initiative controls, add/remove tokens, end, pause · full pad and selected token (HP) |
| Stream Deck + | 3 scenes + next page · 3 macros + next page · dials: music, ambience, darkness, zoom | 4-key initiative row · next turn, round, selected token (HP), pad folder · dials: token HP, combat turns, targets, darkness |
| Stream Deck + XL | 8 scenes, 8 macros, each with next page · 4-key party view, 4 playlists + next page · selected token, 4 ambiences, stop music, start combat, clear targets, pause · dials: music, lighting, party, scenes, music tracks, macros | 9-key initiative row · turn, round and initiative controls, add/remove tokens, end, clear targets, pause · full pad, roll the dice pool, selected token (HP), party · dials: targets, combat turns, token HP, party, dice, zoom |
| Stream Deck Neo | 3 scenes + next page · 3 macros + next page | 4-key initiative row · next turn, round, selected token (HP), pad folder |
| Stream Deck Mini | 2 scenes + next page · 2 macros + next page | 3-key initiative row · next turn, round, pad folder |

## Troubleshooting

- **Padlocks are still shown**: VTT Deck Premium is not active yet. Once it is, the keys redraw by themselves.
- **A row (initiative, party, page) looks shuffled**: keys are read line by line, left to right. Check that they are on the same Stream Deck page and have exactly the same settings.
- **The profile doesn't switch**: update the plugin to 1.5.1 or later; the switch works with the Stream Deck (15 keys), XL, +, + XL, Neo and Mini.
- **A dial shows 🔒**: dials need VTT Deck Premium, including Macro, Scene… actions placed on a dial.
- **The Party dial or party view is empty**: choose the party source (*Automatic*, *A Group actor* or *An actor folder*) in the key settings.
- **Damage isn't applied to a token**: no bar 1 (HP) set up in Foundry, or you don't own the token.
- **"Use selection" finds nothing**: select the door with the Walls tool (or the light with the Lighting tool) in Foundry first.
- **The soundboard stays empty**: check the folder path and the location (*User data* or *Foundry files*); browsing files may require the GM.
- **Scene levels do nothing**: they need Foundry v14 and a scene with at least two levels.
- **A key shows ⚠**: the reason appears in a Foundry notification (GM-only action, locked door…).

Support: [Issues](https://github.com/zedoc84/vtt-deck/issues).

## License

VTT Deck Premium is proprietary software: personal, non-transferable licence; copying, reselling or redistributing it is not allowed. The VTT Deck plugin itself stays free and open source (MIT).

---

<a id="francais"></a>

# VTT Deck Premium — Stream Deck

[English](#english) · **Français**

**VTT Deck Premium** débloque les touches et molettes avancées du plugin Stream Deck **VTT Deck** — tout ce qui est marqué ★ Premium. Il s'adresse aux MJ qui mènent toute leur partie depuis le Stream Deck : initiative, dégâts, le groupe d'un coup d'œil, ambiances, portes, temps, sans toucher à la souris.

Version actuelle : **1.3.1** · fonctionne avec le plugin VTT Deck **1.5.1** ou plus récent.

## Ce que vous obtenez sur votre Stream Deck

| Fonction ★ Premium | Sur le Stream Deck |
|---|---|
| **Suivi d'initiative automatique** | une rangée de touches identiques qui se remplit dans l'ordre du combat, combattant actif en premier |
| **Vue du groupe** | une touche par personnage joueur, attribuée automatiquement, avec PV, jauge et états |
| **Pavé dégâts & soins** | taper un montant, l'appliquer à tous les jetons sélectionnés en un appui |
| **États sur les touches** | petites icônes des états actifs (à terre, empoisonné…) dans un coin des touches de jeton |
| **Ciblage rapide** | « Effacer les cibles » et « Cibler l'ennemi suivant » |
| **Déplacement des jetons** | des flèches pour déplacer les jetons sélectionnés case par case, des touches de rotation et d'altitude |
| **Niveaux de scène (Foundry v14)** | afficher le niveau au-dessus / en dessous, faire monter ou descendre un jeton d'un niveau |
| **Molettes (Stream Deck +, Stream Deck + XL)** | volumes, lumière de la scène, tours de combat, PV du jeton, zoom — et des molettes pour parcourir le groupe, les scènes, les cibles (avec ciblage Maj), les pistes, les dés et les macros, avec une image et la valeur sur l'écran tactile |
| **Toutes les actions sur une molette** | posez une action Macro, Scène, Combat, Jeton… sur une molette : l'appui fait comme la touche |
| **Ambiance** | une touche règle scène, musique (avec fondu), obscurité et météo |
| **Table de bruitages** | une page de touches remplie avec les fichiers audio d'un dossier Foundry |
| **Fondu entre musiques** | passer d'une playlist à l'autre en fondu plutôt qu'en coupure sèche |
| **Météo** | pluie, neige, brouillard… sur la scène en une touche |
| **Temps de jeu** | +1 min, +10 min, +1 h, repos, et une touche qui affiche l'heure du monde |
| **Montrer aux joueurs** | afficher une image ou une page de journal à toute la table |
| **Portes et lumières** | ouvrir, fermer ou verrouiller une porte précise ; allumer ou éteindre une lumière |
| **Alertes** | une touche qui s'allume et clignote sur un 20 naturel, un 1 naturel ou un message privé |
| **Page dynamique** | des touches remplies avec les macros, scènes, playlists ou pistes d'un dossier, ou les objets d'un personnage |
| **Couleurs selon des seuils** | une touche qui passe à l'orange puis au rouge quand les PV baissent — avec image facultative |
| **Mode joueur** | le MJ choisit les actions que les joueurs peuvent utiliser sur leur propre Stream Deck (fiche, attaques, sorts…) |
| **Séquences** | plusieurs actions sur une touche, sans code — plus une étape « script » réservée au MJ |
| **Changement automatique de profil** | le Stream Deck affiche le profil Combat quand un combat commence, et revient en arrière à la fin |
| **Touches Jeton et Combat complètes** | personnages précis, PV / barre 2 / attribut, états, ±PV, cacher, combattant n°X… |

## Obtenir VTT Deck Premium

1. Installez le plugin Stream Deck gratuit **VTT Deck** (1.5.1 ou plus récent) depuis l'Elgato Marketplace — il contient déjà toutes les touches et molettes ★ Premium.
2. Achetez VTT Deck Premium : **[lien d'achat à ajouter]**.
3. Activez-le comme indiqué avec votre achat. Dès qu'il est actif, les cadenas disparaissent. Les réglages de vos touches sont conservés.

Vous pouvez préparer vos touches ★ Premium avant l'achat : elles affichent un cadenas jusqu'à l'activation de VTT Deck Premium.

## Combat et jetons

**Suivi d'initiative automatique** — action *Combat* → *Suivi d'initiative automatique*. Copiez la touche le long d'une rangée : toutes ces touches d'un même Stream Deck forment une seule rangée, lue ligne par ligne. *Ordre* : combattant actif en premier, ou ordre d'initiative. Quand il y a plus de combattants que de touches, la dernière devient **Suite** (`1/3`…). Cadre jaune = son tour, ☠ = vaincu, 🙈 = caché, initiative en haut à gauche.

**Vue du groupe** — action *Jeton* → *Jeton : Groupe (personnages du groupe)*. Copiez la touche : chaque touche prend un personnage du groupe. *Groupe* : *Automatique* (le groupe du système de jeu — groupe actif de PF2e, groupe principal de D&D 5e — sinon les personnages attribués à vos joueurs), *Un acteur Groupe*, ou *Un dossier d'acteurs*. Elle affiche les PV, la jauge et les états actifs ; un cadre jaune signale le personnage dont c'est le tour.

**Pavé dégâts & soins** — une touche *Pavé dégâts & soins* par rôle : chiffres `0`–`9`, *Ajouter une valeur (+N)*, *Montant* (appui = remise à zéro), *Effacer*, *Effacer le dernier chiffre*, **Dégâts**, **Soins**. Jetons concernés : sélectionnés, sinon ciblés. Exemple : sélectionnez trois gobelins, appuyez sur `1`, `2`, **Dégâts** → chacun perd 12 PV.

**États sur les touches** — les touches Jeton et Combat affichent jusqu'à 4 icônes des états actifs (option *États*).

**Ciblage rapide** — action *Système* → *Effacer les cibles* ou *Cibler l'ennemi suivant* (jetons hostiles, dans l'ordre du combat, sinon du plus proche ; option pour inclure les neutres).

**Déplacement des jetons** — action *Jeton*, *Appui* : *Déplacer d'une case* (8 directions), *Pivoter* (ex. 45°), *Changer l'altitude* (ex. +5). Tous les jetons sélectionnés bougent ; les murs arrêtent les joueurs, pas le MJ.

**Niveaux de scène (Foundry v14)** — action *Scène* → *Niveau supérieur / inférieur* change le niveau affiché. Action *Jeton* → *Monter / Descendre d'un niveau* fait passer les jetons sélectionnés au niveau voisin.

## Molettes (Stream Deck + et Stream Deck + XL)

Glissez l'action **Molette** sur une molette et choisissez sa fonction :

| Fonction | Tourner | Appuyer | Toucher l'écran |
|---|---|---|---|
| Volume de la musique / de l'ambiance / de l'interface | régler le volume | couper / rétablir | comme l'appui |
| Lumière de la scène (obscurité, MJ) | plus sombre / plus clair | jour ↔ nuit | comme l'appui |
| PV du jeton sélectionné | modifier les PV (appliqués après un court arrêt, la variation s'affiche d'abord) | appliquer tout de suite | comme l'appui |
| Tours de combat | tour suivant / précédent | centrer sur le combattant actif | comme l'appui |
| Zoom de la carte | zoomer / dézoomer | zoom normal, centré sur le jeton sélectionné | comme l'appui |
| **Groupe** | sélectionner le jeton du personnage suivant du groupe et centrer la vue | ouvrir/fermer la fiche, cibler ou sélectionner (au choix) | comme l'appui |
| **Scènes** | faire défiler les scènes (toutes, ou celles d'un dossier) | afficher (pour moi) ou activer (pour tous) | comme l'appui |
| **Cibles** | parcourir les cibles possibles — ennemis, neutres, alliés (chacun désactivable), les plus proches d'abord ; options : centrer la vue dessus, la signaler sur la carte (vu par tous) | la cibler ; avec l'option **Maj**, l'ajouter aux cibles en cours (comme Maj + clic) | effacer toutes les cibles |
| **Musique** | faire défiler les pistes de toutes les playlists (ou d'une seule) | jouer la piste montrée, ou l'arrêter si elle joue (MJ) | comme l'appui |
| **Dés** | changer de dé (d4 … d100) ; tourner en appuyant : bonus ±1 | ajouter un dé de ce type | vider la réserve |
| **Macros** | faire défiler les macros (toutes, ou celles d'un dossier) | exécuter la macro montrée | comme l'appui |

L'écran tactile affiche le titre (avec la position, ex. `Cibles 2/5`), une image (portrait, vignette de la scène, image de la macro…), la valeur et une jauge. *Pas* règle l'effet d'un cran.

**Lancer la réserve de dés** — ajoutez une touche *Système* → *Lancer la réserve de dés (molette Dés)*. Elle affiche la réserve (`2d6 + 2`) et la lance dans le chat (visibilité au choix), puis la vide — ou la garde avec *garder la réserve après le lancer*.

**Toutes les actions sur une molette** — vous pouvez aussi poser les actions Macro, Scène, Jeton, Combat, Musique & sons, Système, Pavé dégâts & soins, Ambiance, Page dynamique et Séquence sur une molette. Appuyer sur la molette (ou toucher l'écran) fait exactement comme la touche, et l'écran affiche l'image et le texte de la touche. Tourner : *Combat* = tour suivant / précédent, *Pavé dégâts & soins* = montant, *Musique & sons* = volume (de la piste, sinon de la musique) ; sans effet pour les autres actions.

## Ambiance et son

**Ambiance** — une touche (MJ) arrête les autres playlists (avec fondu facultatif), active ou affiche la scène, règle obscurité et météo, lance la playlist et exécute une macro si vous en avez choisi une. Cadre vert = l'ambiance est en place.

**Table de bruitages** — action *Page dynamique* → *Contenu : Sons d'un dossier de fichiers*. Indiquez le dossier (ex. `worlds/monmonde/sons`, ou `sounds` avec *Fichiers de Foundry*), copiez la touche : les touches se remplissent avec les fichiers audio du dossier. Ajoutez une touche *Page suivante* avec le même dossier pour faire défiler.

**Fondu entre musiques** — action *Musique & sons*, *Playlist entière* → *Fondu* (secondes). Lancer la playlist fait disparaître en fondu la musique en cours et apparaître la nouvelle, chez tous les joueurs.

**Météo** — action *Système* → *Météo* : un appui la pose sur la scène, un second appui l'enlève.

## Gestion de table

**Temps de jeu** — action *Système* → *Temps de jeu* : +1 min, +10 min, +1 h, *Repos* (8 h par défaut), durée libre, ou *Afficher l'heure du monde* (une touche qui affiche `14:05 · Jour 3`).

**Montrer aux joueurs** — action *Système* → *Montrer une image aux joueurs* (chemin de l'image, légende facultative) ou *Montrer un journal aux joueurs* (journal et page).

**Portes et lumières** — action *Système* → *Porte* ou *Lumière*. Dans Foundry, sélectionnez la porte (outil Murs) ou la lumière (outil Éclairage), puis cliquez sur **Utiliser la sélection** dans les réglages de la touche. Porte : *Ouvrir / fermer* ou *Verrouiller / déverrouiller* (MJ) ; cadre vert = ouverte, rouge = verrouillée. Lumière : allumée / éteinte.

**Alertes** — action *Système* → *Alertes* : la touche clignote sur un 20 naturel, un 1 naturel ou un message privé (chacun désactivable ; seulement les jets des joueurs par défaut). Un appui l'éteint et ouvre le chat.

## Personnalisation

**Page dynamique** — macros, scènes ou playlists d'un dossier, pistes d'une playlist, sons d'un dossier de fichiers, ou **objets d'un personnage** (*Mon personnage* ou *Jeton sélectionné*, filtrés par type : armes, sorts…). Copiez la touche *Élément* ; ajoutez des touches *Page suivante* / *Page précédente* pour le même contenu.

**Couleurs selon des seuils** — dans l'*Apparence* de chaque touche : *Sous (%)* + couleur (ex. 50 → orange) et un seuil critique (ex. 25 → rouge), avec image facultative. Fonctionne sur toute touche qui affiche une valeur et un maximum (PV, barres).

**Mode joueur** — un confort, pas une barrière de sécurité : ce sont les permissions de Foundry qui décident de ce que chaque joueur peut faire. Dans Foundry, *Paramètres* → *VTT Deck Premium* → **Mode joueur** : cochez les actions que les joueurs peuvent utiliser sur leur propre Stream Deck. Une touche interdite affiche 🚫 chez le joueur. Sur l'ordinateur du joueur, réglez la connexion du module VTT Deck sur *Toujours*. Avec *Page dynamique → objets d'un personnage*, les joueurs ont leurs attaques et leurs sorts sur des touches.

**Séquences** — l'action **Séquence** enchaîne jusqu'à 6 étapes : exécuter une macro, afficher/activer une scène, lancer/arrêter une playlist, arrêter la musique, jouer un son, régler l'obscurité, la météo, message dans le chat, lancer de dés, attendre, pause, avancer le temps, montrer une image. Une erreur arrête la séquence. L'étape **Script** (MJ uniquement) exécute du JavaScript, pour les utilisateurs avancés. La première fois qu'un script s'exécute, Foundry vous montre son code et demande confirmation (un profil téléchargé sur internet pourrait en contenir un) ; une fois accepté, le même script n'est plus demandé sur ce navigateur. Tous les scripts d'une séquence sont confirmés avant la première étape : en refuser un ne lance rien. Les caractères invisibles ou qui inversent le sens d'écriture sont signalés en rouge : refusez un script qui en contient si vous ne savez pas pourquoi.

## Profils prêts à l'emploi et changement automatique

Le plugin VTT Deck est livré avec **VTT Deck – Exploration** et **VTT Deck – Combat**. Avec VTT Deck Premium, le Stream Deck passe sur **Combat** quand un combat commence, puis revient au profil que vous utilisiez (ou sur **Exploration**, ou ne change pas — au choix dans Foundry).

| Modèle | Exploration | Combat |
|---|---|---|
| Stream Deck (15 touches) | 4 scènes + page suivante · 4 macros + page suivante · jeton sélectionné, 2 playlists + page suivante, pause | rangée d'initiative de 5 touches · tour précédent, round, tour suivant, initiative PNJ, dossier pavé · jeton sélectionné (PV), début, fin, ajout/retrait de jetons, pause |
| Stream Deck XL | 7 scènes, 7 macros, chacune avec page suivante · vue du groupe sur 4 touches, 3 playlists + page suivante · jeton sélectionné, 4 ambiances à régler, arrêt de la musique, début du combat, pause | rangée d'initiative de 8 touches · commandes de tour, de round et d'initiative, ajout/retrait de jetons, fin, pause · pavé complet et jeton sélectionné (PV) |
| Stream Deck + | 3 scènes + page suivante · 3 macros + page suivante · molettes : musique, ambiance, obscurité, zoom | rangée d'initiative de 4 touches · tour suivant, round, jeton sélectionné (PV), dossier pavé · molettes : PV du jeton, tours de combat, cibles, obscurité |
| Stream Deck + XL | 8 scènes, 8 macros, chacune avec page suivante · vue du groupe sur 4 touches, 4 playlists + page suivante · jeton sélectionné, 4 ambiances, arrêt de la musique, début du combat, effacer les cibles, pause · molettes : musique, lumière, groupe, scènes, pistes, macros | rangée d'initiative de 9 touches · commandes de tour, de round et d'initiative, ajout/retrait de jetons, fin, effacer les cibles, pause · pavé complet, lancer la réserve de dés, jeton sélectionné (PV), groupe · molettes : cibles, tours de combat, PV du jeton, groupe, dés, zoom |
| Stream Deck Neo | 3 scènes + page suivante · 3 macros + page suivante | rangée d'initiative de 4 touches · tour suivant, round, jeton sélectionné (PV), dossier pavé |
| Stream Deck Mini | 2 scènes + page suivante · 2 macros + page suivante | rangée d'initiative de 3 touches · tour suivant, round, dossier pavé |

## Dépannage

- **Les cadenas restent affichés** : VTT Deck Premium n'est pas encore actif. Une fois actif, les touches se redessinent d'elles-mêmes.
- **Une rangée (initiative, groupe, page) semble mélangée** : les touches sont lues ligne par ligne, de gauche à droite. Vérifiez qu'elles sont sur la même page du Stream Deck et qu'elles ont exactement les mêmes réglages.
- **Le profil ne change pas** : mettez le plugin à jour (1.5.1 ou plus) ; le changement fonctionne avec le Stream Deck (15 touches), le XL, le +, le + XL, le Neo et le Mini.
- **Une molette affiche 🔒** : les molettes demandent VTT Deck Premium, y compris les actions Macro, Scène… posées sur une molette.
- **La molette Groupe ou la vue du groupe est vide** : choisissez la source du groupe (*Automatique*, *Un acteur Groupe* ou *Un dossier d'acteurs*) dans les réglages de la touche.
- **Les dégâts ne s'appliquent pas à un jeton** : pas de barre 1 (PV) configurée dans Foundry, ou vous n'en êtes pas propriétaire.
- **« Utiliser la sélection » ne trouve rien** : sélectionnez d'abord la porte avec l'outil Murs (ou la lumière avec l'outil Éclairage) dans Foundry.
- **La table de bruitages reste vide** : vérifiez le chemin du dossier et l'emplacement (*Données utilisateur* ou *Fichiers de Foundry*) ; parcourir les fichiers peut demander les droits du MJ.
- **Les niveaux de scène ne font rien** : ils demandent Foundry v14 et une scène d'au moins deux niveaux.
- **Une touche affiche ⚠** : la raison s'affiche dans une notification Foundry (action réservée au MJ, porte verrouillée…).

Support : [Issues](https://github.com/zedoc84/vtt-deck/issues).

## Licence

VTT Deck Premium est un logiciel propriétaire : licence personnelle et non transférable ; le copier, le revendre ou le redistribuer est interdit. Le plugin VTT Deck lui-même reste gratuit et libre (MIT).
