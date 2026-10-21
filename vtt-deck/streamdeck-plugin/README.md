<a id="english"></a>

# VTT Deck plugin for Foundry VTT

**English** · [Français](#francais)

**VTT Deck** is a free Stream Deck plugin that turns your Stream Deck into a control panel for Foundry Virtual Tabletop: macros, scenes, tokens, combat tracker, music and sound effects, pause, tools, dice and roll tables. Each key shows live information from your game — token portrait and HP, active scene, track playing, whose turn it is.

- Plugin ID: `com.vttdeck.foundry` · version **1.5.1**
- Available on the **Elgato Marketplace**
- Free and open source (MIT)

The plugin talks to Foundry through the free Foundry module **VTT Deck** ([installation](https://github.com/zedoc84/vtt-deck#english)). Keys marked ★ Premium are unlocked by **VTT Deck Premium**.

## Requirements

- Stream Deck app 6.9 or later
- macOS 12+ or Windows 10+
- Any Stream Deck with keys (Stream Deck, MK.2, XL, +, + XL, Neo, Mini…). On a Stream Deck + or + XL, the dials and the touch strip work with VTT Deck Premium (★).
- Foundry VTT v13 or v14 with the VTT Deck module enabled

## Installation

1. Install **VTT Deck** from the Elgato Marketplace (or double-click `com.vttdeck.foundry.streamDeckPlugin`).
2. A **VTT Deck** category appears in the action list.
3. Open your Foundry game in a browser (or the Foundry app) on the computer the Stream Deck is plugged into, with the VTT Deck module enabled.
4. **Pair Foundry with the plugin (once per browser)**: put any VTT Deck action on a key, open its settings, then **Foundry connection** → copy the **Code** (e.g. `K7QDM-2ZP4X`). In Foundry: *Configure Settings* → *VTT Deck* → **Pairing code** → paste → *Save*. The keys come alive.
5. Test: open <http://127.0.0.1:3006> in a browser. The plugin replies `VTT Deck bridge 1.5.1 — OK. Foundry connected.`

## The actions

| Action | What the key does | |
|---|---|---|
| **Macro** | runs a macro; shows its image and name | free |
| **Scene** | views or activates a scene, opens its configuration, shows/hides it in the navigation; green border = active, blue = viewed | free |
| **Token** | the selected token: portrait, name; select and centre, or open the sheet | free · ★ more with Premium |
| **Combat** | next/previous turn and round, start/end combat, roll initiative, round display | free · ★ more with Premium |
| **Music & Sounds** | starts/stops a playlist or a track, plays a sound effect, stops everything; green border = playing | free |
| **System** | pause, scene tool, sidebar tab, dice roll, roll table, chat message, scene darkness | free · ★ more with Premium |
| **Damage & Healing Pad** | type an amount, apply damage or healing to the selected tokens | ★ Premium |
| **Ambience** | scene + music + darkness + weather in one press | ★ Premium |
| **Dynamic Page** | keys that fill themselves with the contents of a Foundry folder, a sound folder or a character's items | ★ Premium |
| **Sequence** | several actions in one key, without code | ★ Premium |
| **Dial** (Stream Deck +, + XL) | volumes, scene lighting, combat turns, token HP, zoom; browse the party, scenes, targets (Shift-target), tracks, dice or macros — picture and value on the touch strip | ★ Premium |

On a Stream Deck + or + XL, every action above can also go on a dial: pressing it does what the key does (★ Premium).

Without VTT Deck Premium, a ★ Premium key shows a padlock and "Premium"; everything else works normally.

## Setting up a key

1. Drag an action onto a key.
2. Set it in the inspector at the bottom of the Stream Deck app. The lists (macros, scenes, playlists, conditions, tables, tools, folders) come straight from your Foundry world, so Foundry must be open and connected. The ↻ button reloads a list.
3. **Leave the Stream Deck "Title" field empty**: the text is drawn into the key image. A title typed in Stream Deck would appear on top of it.

**Appearance** section, common to every action:

- **Text**: replaces the automatic text. `|` = line break. Variables: `{name}`, `{value}`, `{max}`, `{round}`. Example: `HP {value}/{max}`.
- **Hide**: no text at all.
- **Image**: a Foundry image path (e.g. `icons/svg/sun.svg`) instead of the automatic image.
- **Background**: background colour (↺ = default).

The inspector follows the language of the Stream Deck app (English or French). The actions also work inside Multi Actions, without live images.

## What the keys tell you

| On the key | Meaning |
|---|---|
| green border | active scene, playlist or track playing, ambience in place |
| blue border | the scene you are viewing |
| yellow border | the combatant whose turn it is |
| orange border | the active tool or sidebar tab, a selected token |
| red border | game paused, targeted token |
| ⚠ (briefly) | the action failed; the reason appears in Foundry |
| 🔒 Premium | this option needs VTT Deck Premium |
| plain VTT Deck icon | Foundry is not connected |
| 🚫 GM only | in player mode, the GM hasn't allowed this action |

## Ready-made profiles

The plugin comes with two profiles for the Stream Deck (15 keys), XL, Stream Deck +, Stream Deck + XL, Neo and Mini:

- **VTT Deck – Exploration**: rows of scenes and macros (and playlists on the XL and + XL) filled from your world, with next-page keys;
- **VTT Deck – Combat**: automatic initiative row, turn controls, damage & healing pad.

On the Stream Deck + and + XL, the profiles also set the dials (volumes, lighting, scenes, tracks, macros; targets, combat turns, token HP, party and dice in combat).

To open them: select any VTT Deck key → inspector → **Ready-made profiles** → *Exploration* or *Combat*. They are ordinary profiles that you can rearrange. Many of their keys use ★ Premium features.

## Plugin settings

At the bottom of any VTT Deck key's inspector, **Foundry connection** (applies to the whole plugin):

- **Code**: the pairing code to enter once in Foundry (*VTT Deck* module settings → *Pairing code*). Only a Foundry window that knows it can drive your Stream Deck: websites and other devices are refused. **New code** (click twice) creates another one; Foundry then has to be paired again.
- **Port**: `3006` by default. It must be the same as the *Plugin port* setting of the VTT Deck module in Foundry.
- **Network** — *accept connections from other computers*: off by default. Leave it off unless Foundry is displayed on another computer than the one the Stream Deck is plugged into. Traffic with another computer is not encrypted: only use it on a trusted network.

Click **Apply** after a change.

## Privacy

The plugin only listens on your own computer (`127.0.0.1`) unless you allow other computers. It sends nothing over the internet and collects no data.

Security: since 1.5.1, the plugin only talks to a Foundry window that proves it knows the pairing code (challenge and response, the code itself never travels), and it proves in return that it is the real plugin. A website opened in your browser can no longer read or change your keys. The last refused connection is shown under **Foundry connection**.

## Troubleshooting

- **Foundry says "enter the pairing code" or "wrong pairing code"**: copy the code shown under **Foundry connection** into Foundry (*VTT Deck* module settings → *Pairing code*). Each browser needs it once.
- **"Connection refused" under Foundry connection**: something without the right code tried to connect — an old VTT Deck module (update it to 1.5.1), a wrong code, or a website. Nothing was accepted.
- **Keys stay on the plain VTT Deck icon**: Foundry is not connected. Is the game open with the VTT Deck module enabled? Does <http://127.0.0.1:3006> answer? Is the port the same on both sides? In Foundry, use **Reconnect** in the VTT Deck status window.
- **The page <http://127.0.0.1:3006> doesn't load**: the Stream Deck app isn't running, or another program uses port 3006 — choose another port in **Foundry connection**, and set the same in Foundry.
- **Chrome / Edge asks to "access devices on your local network"**: accept; that is the browser allowing the Foundry page to reach the plugin.
- **Foundry over HTTPS in Safari**: Safari may block the local connection. Use Chrome, Firefox or the Foundry app.
- **Empty lists in the inspector**: Foundry is not connected; press ↻ once it is.
- **Text drawn twice on a key**: empty the Stream Deck "Title" field.
- **Plugin logs**: Mac `~/Library/Application Support/com.elgato.StreamDeck/Plugins/com.vttdeck.foundry.sdPlugin/logs/`, Windows `%APPDATA%\Elgato\StreamDeck\Plugins\com.vttdeck.foundry.sdPlugin\logs\`.

Bugs and suggestions: [Issues](https://github.com/zedoc84/vtt-deck/issues).

## Building from source

Node.js 20 or later:

```bash
npm install
npm run build      # bundles src/plugin.js into com.vttdeck.foundry.sdPlugin/bin/plugin.js
npm run validate   # Elgato's checks
npm run pack       # creates dist/com.vttdeck.foundry.streamDeckPlugin
python3 tools/make-profiles.py   # regenerates the bundled profiles
python3 tools/make-icons.py      # regenerates the icons of the actions added since 1.3.0
```

| Path | Contents |
|---|---|
| `src/plugin.js` | the plugin: a local WebSocket server that relays keys, presses and images between Stream Deck and Foundry |
| `com.vttdeck.foundry.sdPlugin/manifest.json` | actions, profiles, requirements |
| `com.vttdeck.foundry.sdPlugin/ui/` | key inspector (`pi.html`, `pi.js`, `pi.css`) |
| `com.vttdeck.foundry.sdPlugin/profiles/` | the bundled profiles |
| `com.vttdeck.foundry.sdPlugin/en.json`, `fr.json` | action names and tooltips |

The plugin itself knows nothing about the game: the key images are drawn by the Foundry module, which also runs the presses. New options are added in `ui/pi.js` and handled in the module.

## License

MIT.

Stream Deck and Elgato are trademarks of Corsair Memory, Inc. Foundry Virtual Tabletop is a trademark of Foundry Gaming LLC. VTT Deck is an independent project, not affiliated with either company.

---

<a id="francais"></a>

# VTT Deck — plugin Stream Deck pour Foundry VTT

[English](#english) · **Français**

**VTT Deck** est un plugin Stream Deck gratuit qui transforme votre Stream Deck en tableau de commande pour Foundry Virtual Tabletop : macros, scènes, jetons, suivi de combat, musique et effets sonores, pause, outils, dés et tables aléatoires. Chaque touche affiche en direct des informations de la partie : portrait et PV d'un jeton, scène active, piste en lecture, combattant dont c'est le tour.

- Identifiant du plugin : `com.vttdeck.foundry` · version **1.5.1**
- Disponible sur l'**Elgato Marketplace**
- Gratuit et libre (licence MIT)

Le plugin dialogue avec Foundry grâce au module Foundry gratuit **VTT Deck** ([installation](https://github.com/zedoc84/vtt-deck#francais)). Les touches marquées ★ Premium sont débloquées par **VTT Deck Premium**.

## Prérequis

- Application Stream Deck 6.9 ou plus récente
- macOS 12+ ou Windows 10+
- Tout Stream Deck à touches (Stream Deck, MK.2, XL, +, + XL, Neo, Mini…). Sur un Stream Deck + ou + XL, les molettes et l'écran tactile fonctionnent avec VTT Deck Premium (★).
- Foundry VTT v13 ou v14 avec le module VTT Deck activé

## Installation

1. Installez **VTT Deck** depuis l'Elgato Marketplace (ou double-cliquez sur `com.vttdeck.foundry.streamDeckPlugin`).
2. Une catégorie **VTT Deck** apparaît dans la liste des actions.
3. Ouvrez votre partie Foundry dans un navigateur (ou l'application Foundry) sur l'ordinateur où le Stream Deck est branché, avec le module VTT Deck activé.
4. **Appairez Foundry et le plugin (une fois par navigateur)** : posez une action VTT Deck sur une touche, ouvrez ses réglages, puis **Connexion Foundry** → copiez le **Code** (ex. `K7QDM-2ZP4X`). Dans Foundry : *Paramètres* → *VTT Deck* → **Code d'appairage** → collez → *Enregistrer*. Les touches s'animent.
5. Test : ouvrez <http://127.0.0.1:3006> dans un navigateur. Le plugin répond `VTT Deck bridge 1.5.1 — OK. Foundry connected.`

## Les actions

| Action | Ce que fait la touche | |
|---|---|---|
| **Macro** | exécute une macro ; affiche son image et son nom | gratuit |
| **Scène** | affiche ou active une scène, ouvre sa configuration, l'affiche/la masque dans la navigation ; cadre vert = active, bleu = affichée | gratuit |
| **Jeton** | le jeton sélectionné : portrait, nom ; sélectionner et centrer, ou ouvrir la fiche | gratuit · ★ plus avec Premium |
| **Combat** | tour et round suivant/précédent, début/fin du combat, initiative, affichage du round | gratuit · ★ plus avec Premium |
| **Musique & sons** | lance/arrête une playlist ou une piste, joue un effet sonore, arrête tout ; cadre vert = en lecture | gratuit |
| **Système** | pause, outil de scène, onglet de la barre latérale, lancer de dés, table aléatoire, message dans le chat, obscurité de la scène | gratuit · ★ plus avec Premium |
| **Pavé dégâts & soins** | taper un montant, appliquer dégâts ou soins aux jetons sélectionnés | ★ Premium |
| **Ambiance** | scène + musique + obscurité + météo en un appui | ★ Premium |
| **Page dynamique** | des touches qui se remplissent avec le contenu d'un dossier Foundry, d'un dossier de sons ou les objets d'un personnage | ★ Premium |
| **Séquence** | plusieurs actions sur une touche, sans code | ★ Premium |
| **Molette** (Stream Deck +, + XL) | volumes, lumière de la scène, tours de combat, PV d'un jeton, zoom ; parcourir le groupe, les scènes, les cibles (ciblage Maj), les pistes, les dés ou les macros — image et valeur sur l'écran tactile | ★ Premium |

Sur un Stream Deck + ou + XL, toutes les actions ci-dessus peuvent aussi aller sur une molette : l'appui fait comme la touche (★ Premium).

Sans VTT Deck Premium, une touche ★ Premium affiche un cadenas et « Premium » ; tout le reste fonctionne normalement.

## Régler une touche

1. Glissez une action sur une touche.
2. Réglez-la dans l'inspecteur en bas de l'application Stream Deck. Les listes (macros, scènes, playlists, états, tables, outils, dossiers) viennent directement de votre monde Foundry : Foundry doit être ouvert et connecté. Le bouton ↻ recharge une liste.
3. **Laissez vide le champ « Titre » de l'application Stream Deck** : le texte est dessiné dans l'image de la touche. Un titre saisi dans Stream Deck s'afficherait par-dessus.

Section **Apparence**, commune à toutes les actions :

- **Texte** : remplace le texte automatique. `|` = retour à la ligne. Variables : `{name}`, `{value}`, `{max}`, `{round}`. Exemple : `PV {value}/{max}`.
- **Masquer** : aucune inscription.
- **Image** : un chemin d'image Foundry (ex. `icons/svg/sun.svg`) à la place de l'image automatique.
- **Fond** : couleur de fond (↺ = par défaut).

L'inspecteur suit la langue de l'application Stream Deck (français ou anglais). Les actions fonctionnent aussi dans les multi-actions, sans image dynamique.

## Ce que disent les touches

| Sur la touche | Signification |
|---|---|
| cadre vert | scène active, playlist ou piste en lecture, ambiance en place |
| cadre bleu | la scène que vous regardez |
| cadre jaune | le combattant dont c'est le tour |
| cadre orange | l'outil ou l'onglet actif, un jeton sélectionné |
| cadre rouge | jeu en pause, jeton ciblé |
| ⚠ (bref) | l'action a échoué ; la raison s'affiche dans Foundry |
| 🔒 Premium | cette option nécessite VTT Deck Premium |
| icône VTT Deck simple | Foundry n'est pas connecté |
| 🚫 Réservé MJ | en mode joueur, le MJ n'a pas autorisé cette action |

## Profils prêts à l'emploi

Le plugin est livré avec deux profils pour le Stream Deck (15 touches), le XL, le Stream Deck +, le Stream Deck + XL, le Neo et le Mini :

- **VTT Deck – Exploration** : des rangées de scènes et de macros (et de playlists sur le XL et le + XL) remplies depuis votre monde, avec des touches « page suivante » ;
- **VTT Deck – Combat** : rangée d'initiative automatique, commandes de tour, pavé dégâts & soins.

Sur le Stream Deck + et le + XL, les profils règlent aussi les molettes (volumes, lumière, scènes, pistes, macros ; cibles, tours de combat, PV du jeton, groupe et dés en combat).

Pour les ouvrir : sélectionnez n'importe quelle touche VTT Deck → inspecteur → **Profils prêts à l'emploi** → *Exploration* ou *Combat*. Ce sont des profils ordinaires, que vous pouvez réorganiser. Beaucoup de leurs touches utilisent des fonctions ★ Premium.

## Réglages du plugin

En bas de l'inspecteur de n'importe quelle touche VTT Deck, **Connexion Foundry** (s'applique à tout le plugin) :

- **Code** : le code d'appairage à saisir une fois dans Foundry (paramètres du module *VTT Deck* → *Code d'appairage*). Seule une fenêtre Foundry qui le connaît peut piloter votre Stream Deck : les sites web et les autres appareils sont refusés. **Nouveau code** (deux clics) en crée un autre ; Foundry doit alors être appairé à nouveau.
- **Port** : `3006` par défaut. Il doit être identique au réglage *Port du plugin* du module VTT Deck dans Foundry.
- **Réseau** — *accepter les connexions d'autres machines* : désactivé par défaut. Laissez-le désactivé, sauf si Foundry est affiché sur un autre ordinateur que celui où le Stream Deck est branché. Les échanges avec une autre machine ne sont pas chiffrés : à réserver à un réseau de confiance.

Cliquez sur **Appliquer** après un changement.

## Confidentialité

Le plugin n'écoute que sur votre propre ordinateur (`127.0.0.1`), sauf si vous autorisez d'autres machines. Il n'envoie rien sur Internet et ne collecte aucune donnée.

Sécurité : depuis la 1.5.1, le plugin ne dialogue qu'avec une fenêtre Foundry qui prouve connaître le code d'appairage (défi et réponse, le code lui-même ne circule jamais), et il prouve à son tour qu'il est bien le plugin. Un site web ouvert dans votre navigateur ne peut plus lire ni modifier vos touches. La dernière connexion refusée s'affiche sous **Connexion Foundry**.

## Dépannage

- **Foundry demande « saisissez le code d'appairage » ou « code d'appairage incorrect »** : copiez le code affiché sous **Connexion Foundry** dans Foundry (paramètres du module *VTT Deck* → *Code d'appairage*). Chaque navigateur en a besoin une fois.
- **« Connexion refusée » sous Connexion Foundry** : quelque chose sans le bon code a tenté de se connecter — un ancien module VTT Deck (mettez-le à jour en 1.5.1), un mauvais code ou un site web. Rien n'a été accepté.
- **Les touches restent sur l'icône VTT Deck simple** : Foundry n'est pas connecté. La partie est-elle ouverte avec le module VTT Deck activé ? <http://127.0.0.1:3006> répond-il ? Le port est-il le même des deux côtés ? Dans Foundry, utilisez **Reconnecter** dans la fenêtre d'état de VTT Deck.
- **La page <http://127.0.0.1:3006> ne s'ouvre pas** : l'application Stream Deck n'est pas lancée, ou un autre programme utilise le port 3006 — choisissez un autre port dans **Connexion Foundry**, et le même dans Foundry.
- **Chrome / Edge demande « accéder aux appareils du réseau local »** : acceptez ; c'est le navigateur qui autorise la page Foundry à joindre le plugin.
- **Foundry en HTTPS avec Safari** : Safari peut bloquer la connexion locale. Utilisez Chrome, Firefox ou l'application Foundry.
- **Listes vides dans l'inspecteur** : Foundry n'est pas connecté ; appuyez sur ↻ une fois qu'il l'est.
- **Texte écrit deux fois sur une touche** : videz le champ « Titre » de l'application Stream Deck.
- **Journaux du plugin** : Mac `~/Library/Application Support/com.elgato.StreamDeck/Plugins/com.vttdeck.foundry.sdPlugin/logs/`, Windows `%APPDATA%\Elgato\StreamDeck\Plugins\com.vttdeck.foundry.sdPlugin\logs\`.

Bugs et suggestions : [Issues](https://github.com/zedoc84/vtt-deck/issues).

## Compiler depuis les sources

Node.js 20 ou plus :

```bash
npm install
npm run build      # assemble src/plugin.js dans com.vttdeck.foundry.sdPlugin/bin/plugin.js
npm run validate   # vérifications d'Elgato
npm run pack       # crée dist/com.vttdeck.foundry.streamDeckPlugin
python3 tools/make-profiles.py   # régénère les profils fournis
python3 tools/make-icons.py      # régénère les icônes des actions ajoutées depuis la 1.3.0
```

| Chemin | Contenu |
|---|---|
| `src/plugin.js` | le plugin : un serveur WebSocket local qui relaie touches, appuis et images entre le Stream Deck et Foundry |
| `com.vttdeck.foundry.sdPlugin/manifest.json` | actions, profils, prérequis |
| `com.vttdeck.foundry.sdPlugin/ui/` | inspecteur des touches (`pi.html`, `pi.js`, `pi.css`) |
| `com.vttdeck.foundry.sdPlugin/profiles/` | les profils fournis |
| `com.vttdeck.foundry.sdPlugin/en.json`, `fr.json` | noms et infobulles des actions |

Le plugin lui-même ne connaît rien au jeu : les images des touches sont dessinées par le module Foundry, qui exécute aussi les appuis. Une nouvelle option s'ajoute dans `ui/pi.js` et se traite dans le module.

## Licence

MIT.

Stream Deck et Elgato sont des marques de Corsair Memory, Inc. Foundry Virtual Tabletop est une marque de Foundry Gaming LLC. VTT Deck est un projet indépendant, sans lien avec ces sociétés.
