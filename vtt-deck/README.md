<a id="english"></a>

# VTT Deck for Foundry VTT (v13 / v14)

**English** · [Français](#francais)

Control Foundry Virtual Tabletop from an Elgato Stream Deck: macros, scenes, tokens, combat tracker, music and sound effects, pause, tools, dice and roll tables. Every key shows live information from your game (token image, HP, active scene, track playing…).

VTT Deck is free and open source (MIT). Some advanced features come from a paid add-on, **VTT Deck Premium** (see [Free and Premium](#free-and-premium)).

| Piece | Where to get it | Where to install it |
|---|---|---|
| Stream Deck plugin **VTT Deck** (`com.vttdeck.foundry`) | Elgato Marketplace, or `com.vttdeck.foundry.streamDeckPlugin` on the [Releases](https://github.com/zedoc84/vtt-deck/releases) page | on the computer the Stream Deck is plugged into |
| Foundry module **VTT Deck** (`vtt-deck`) | manifest URL below, or `module.zip` on the Releases page | in Foundry |

Current version: **1.5.1** (module and plugin share the same version number).

## How it works

The plugin opens a small server on your own computer (`127.0.0.1:3006`). The browser — or the Foundry desktop app — that displays your game connects to it, draws the keys and runs the key presses. All the game logic lives in the Foundry module; the plugin only relays.

Nothing is sent over the internet. By default the plugin only accepts connections from the same computer.

<a id="free-and-premium"></a>

## Free and Premium

| Stream Deck action | Free | ★ With VTT Deck Premium |
|---|---|---|
| Macro, Scene, Music & Sounds, System | everything | — |
| Token | selected token: image, name; select, centre, open the sheet | specific characters, active combatant, HP / bar 2 / any attribute + gauge, conditions, ±HP, target, hide, add to combat |
| Combat | next/previous turn and round, start/end, initiative, round display | **automatic initiative tracker**, combatant #N, active combatant, add/remove selected tokens |
| Damage & Healing Pad | — | ★ type an amount, apply damage or healing to every selected token |
| Ambience | — | ★ scene + music + darkness + weather (+ macro) in one press |
| Dynamic Page | — | ★ keys that fill themselves with the macros, scenes or music of a Foundry folder, a sound folder or a character's items |
| Sequence | — | ★ several actions in one key, without code (plus a GM-only script step) |
| Dial (Stream Deck +, + XL) | — | ★ volumes, lighting, combat turns, token HP, zoom; browse the party, scenes, targets (Shift-target), tracks, dice, macros |
| Any action on a dial (Stream Deck +, + XL) | — | ★ pressing the dial does what the key does |
| System extras | — | ★ weather, game time, show to players, doors, lights, alerts, quick targeting |
| Token extras | — | ★ party view, conditions on keys, movement, rotation, elevation, scene levels (v14) |
| Ready-made profiles | open them from the inspector | ★ automatic switch to the Combat profile when a combat starts |

In the Stream Deck inspector, Premium options are marked ★ Premium. Without VTT Deck Premium, a key set to one of them shows a padlock and "Premium"; pressing it shows a message in Foundry. Everything else keeps working.

## 1. Install the Stream Deck plugin

1. Install **VTT Deck** from the Elgato Marketplace, or double-click `com.vttdeck.foundry.streamDeckPlugin`.
2. A **VTT Deck** category appears in the action list with 11 actions: Macro, Scene, Token, Combat, Music & Sounds, System, Damage & Healing Pad, Ambience, Dynamic Page, Sequence and Dial (Stream Deck +, + XL).
3. Test: open <http://127.0.0.1:3006> in a browser. The plugin replies `VTT Deck bridge 1.5.1 — OK`.

Requirements: Stream Deck app 6.9 or later, macOS 12+ or Windows 10+. The inspector follows the language of the Stream Deck app (English or French).

If the old **Material Deck** plugin is installed, you can keep it: the two plugins don't use the same port.

## 2. Install the Foundry module

**With the manifest URL (recommended)**: in Foundry, *Add-on Modules* → *Install Module* → paste at the bottom
`https://github.com/zedoc84/vtt-deck/releases/latest/download/module.json` → *Install*.
Foundry then offers updates automatically.

**Manually**:

1. Shut down the world (no need to quit Foundry).
2. Unzip `module.zip` into a `vtt-deck` folder inside Foundry's `Data/modules/` folder
   (on Mac: `~/Library/Application Support/FoundryVTT/Data/modules/vtt-deck/`).
   The folder must contain `module.json` directly.
3. Restart the world and enable **VTT Deck** in *Manage Modules*.
4. **Pairing (once per browser)**: on the Stream Deck, open the settings of any VTT Deck key → **Foundry connection** → copy the **Code**. In Foundry: *Configure Settings* → *VTT Deck* → **Pairing code** → paste → *Save*.
5. *Configure Settings* → *VTT Deck* → **Show status**: the dot should be green and *Pairing* should read "paired".

Module settings (stored per browser):

| Setting | Default | Notes |
|---|---|---|
| Connect to the Stream Deck from this browser | Auto (GM only) | *Always* / *Never*. "Auto" spares players a browser network-permission prompt. |
| Plugin address | `127.0.0.1` | Keep it if the Stream Deck is plugged into this computer. |
| Pairing code | — | Code shown by the plugin (inspector → *Foundry connection*). Without it, the plugin refuses the connection (plugin 1.5.1 or later). |
| Plugin port | `3006` | Must match the plugin's port (inspector → *Foundry connection*). |
| Connection notifications | on | Message when the Stream Deck connects or disconnects. |

The **status window** shows the connection, the devices, the keys in use and whether VTT Deck Premium is active. Its **Reconnect** and **Redraw keys** buttons fix most hiccups.

## 3. Set up the keys

Drag an action onto a key, then set it in the inspector at the bottom of the Stream Deck app. The lists (macros, scenes, playlists, conditions, tables, tools, folders) come straight from your world, so Foundry must be open and connected. The ↻ button reloads a list.

**Leave the Stream Deck "Title" field empty**: Foundry writes the text into the key image. A title typed in Stream Deck would be drawn on top of it.

**Appearance** section, common to all actions:

- **Text**: replaces the automatic text. `|` = line break. Variables: `{name}`, `{value}`, `{max}`, `{round}`. Example: `HP {value}/{max}`.
- **Hide**: no text at all.
- **Image**: path to a Foundry image (e.g. `icons/svg/sun.svg`) that replaces the automatic image.
- **Background**: background colour (↺ = default colour).

## 4. The actions

**Macro** — runs the chosen macro. The macro's image and name appear on the key.

**Scene** — view it yourself, activate it for everyone (GM), open its configuration, or show/hide it in the navigation bar. Green border = active scene, blue = the scene you are viewing.

**Token** — the selected token: image and name; on press, select and centre, centre only, or open/close the sheet.
★ Premium: a specific character or the active combatant; bar 1 (HP), bar 2 or any attribute (e.g. `system.attributes.ac.value`) with a gauge; on press, target, hide/show (GM), toggle a condition, change bar 1 by ±N, add to/remove from combat. The gauge uses the token's **bar 1**, so it works with every game system, homebrew ones included.

**Combat** — next or previous turn and round, start the combat (created from the selected tokens if there is none), end it, roll initiative for everyone or for NPCs, show round and turn.
★ Premium: automatic initiative tracker, combatant #N, active combatant, add/remove the selected tokens. Yellow border = their turn, ☠ = defeated, initiative in the top-left corner.

**Music & Sounds** — start/stop a playlist or a single track (green border = playing), play an audio file as a sound effect (for all players or just for you, with its own volume), stop everything.

**System** — pause (red border while paused), scene tool (e.g. Tokens → Target), sidebar tab, dice roll (current chat mode, public, GM only, self), draw from a roll table, chat message (optionally whispered to the GMs), scene darkness level.

**Damage & Healing Pad**, **Ambience**, **Dynamic Page**, **Sequence**, **Dial** — ★ Premium actions, described in the VTT Deck Premium documentation.

## 5. Ready-made profiles

The plugin comes with two Stream Deck profiles for the Stream Deck (15 keys), XL, Stream Deck +, Stream Deck + XL, Neo and Mini:

- **VTT Deck – Exploration**: rows of scenes and macros (and playlists on the XL and + XL) that fill themselves from your world, with next-page keys;
- **VTT Deck – Combat**: automatic initiative row, turn controls and the damage & healing pad (in a folder on the smaller models).

Open them from any VTT Deck key: inspector → **Ready-made profiles** → *Exploration* or *Combat*. They are ordinary profiles: rearrange them as you like. Many of their keys use Premium features and show a padlock without VTT Deck Premium.

## 6. Troubleshooting

- **"Enter the pairing code" / "Wrong pairing code"**: copy the code shown in the plugin (settings of any VTT Deck key → *Foundry connection*) into *Configure Settings* → *VTT Deck* → **Pairing code**.
- **"Unprotected (old plugin)" in the status window**: your Stream Deck plugin is older than 1.5.1 and does not check who connects. Update it.
- **The dot stays red**: is the Stream Deck app running? Does <http://127.0.0.1:3006> answer? Is the port the same on both sides? Click **Reconnect** in the status window.
- **Chrome / Edge asks to "access devices on your local network"**: accept. That is the browser allowing the Foundry page to talk to the plugin on your computer.
- **Foundry over HTTPS in Safari**: Safari may block the local `ws://` connection. Use Chrome, Firefox or the Foundry desktop app.
- **"Another Foundry window controls the Stream Deck"**: only one window at a time drives the Stream Deck (the last one connected). Close the other tab, then click *Reconnect*.
- **A key shows ⚠**: the action failed; the reason appears in a Foundry notification (deleted macro, GM-only action…).
- **A key shows a padlock**: that option needs VTT Deck Premium.
- **Missing token images**: images hosted on another site without CORS permission. The key is then drawn without the image.
- **Foundry on another computer or a NAS**: the plugin talks to the *browser*, not to the Foundry server. Open the game in a browser on the computer the Stream Deck is plugged into.
- **Plugin logs**: Mac `~/Library/Application Support/com.elgato.StreamDeck/Plugins/com.vttdeck.foundry.sdPlugin/logs/`, Windows `%APPDATA%\Elgato\StreamDeck\Plugins\com.vttdeck.foundry.sdPlugin\logs\`.

Bugs and suggestions: [Issues](https://github.com/zedoc84/vtt-deck/issues).

## 7. For developers

### Repository layout

| Path | Contents |
|---|---|
| `module.json`, `scripts/`, `lang/`, `styles/` | Foundry module |
| `streamdeck-plugin/src/plugin.js` | plugin source (WebSocket relay) |
| `streamdeck-plugin/com.vttdeck.foundry.sdPlugin/` | plugin folder: manifest, inspector (`ui/`), icons, profiles, translations |
| `streamdeck-plugin/tools/` | `make-profiles.py` (bundled profiles), `make-icons.py` (action icons) |
| `.github/workflows/release.yml` | builds and attaches the module and the plugin to each GitHub release |

### Build the plugin (Node.js 20+)

```bash
cd streamdeck-plugin
npm install
npm run build      # bundles src/plugin.js into bin/plugin.js
npm run validate   # Elgato's checks
npm run pack       # creates dist/com.vttdeck.foundry.streamDeckPlugin
python3 tools/make-profiles.py   # regenerates the bundled profiles after a layout change
```

### Publish a version

Create a GitHub release with a tag such as `v1.3.1`. The workflow sets the version in `module.json`, builds `module.zip` and the `.streamDeckPlugin`, and attaches them to the release. If the `FOUNDRY_RELEASE_TOKEN` secret is set, the version is also announced on foundryvtt.com through the Package Release API.

### Extension API

`game.modules.get("vtt-deck").api`, available from the `vttDeck.init` hook:

```js
Hooks.once("vttDeck.init", (api) => {
  api.registerAction("token", myAction);   // replaces or adds an action type
  const h = api.helpers;                   // shared helpers (panTo, fail, lockedSpec, t…)
});
```

An action is an object `{ hooks, render(settings, key), press(settings, key), needsPro?(settings), layout?, renderDial?(settings, key), dial?(settings, key, { ticks }), dialPress?(settings, key) }`. `api.registerDecorator((spec, settings, key) => spec)` changes how keys are drawn; `api.registerGuard((key) => true | "message")` allows or refuses a press. After the `ready` hook, `api.deck` gives `rank(key, filter)` (position of a key among similar keys, in reading order), `queueType(type)` (redraw every key of a type) and `send(message)` (message to the plugin). The `vttDeck.connected` hook fires on every connection to the plugin.

Adding a feature usually doesn't require changing the plugin itself: add the option in `ui/pi.js` (inspector) and handle it in the module.

### Protocol (JSON over WebSocket)

- Pairing (protocol 2): plugin → `challenge {nonce}`; Foundry → `hello {auth: HMAC-SHA256(code, "client:"+nonce), cnonce}`; plugin → `hello {proof: HMAC-SHA256(code, "server:"+cnonce)}` or `authFailed` then close. Nothing else is exchanged before both sides are verified.
- Plugin → Foundry: `hello`, `willAppear`, `willDisappear`, `settings`, `keyDown`, `keyUp`, `dialRotate`, `dialDown`, `dialUp`, `touchTap`, `piRequest`, `device`, `replaced`.
- Foundry → plugin: `hello`, `renderBatch` (144×144 PNG images as data URLs), `render`, `dialFeedback` (touch strip of the Stream Deck + and + XL: title, value, indicator, icon), `feedback`, `piData`, `switchProfile`, `ping`.

## License

MIT — see [LICENSE](LICENSE).

Stream Deck and Elgato are trademarks of Corsair Memory, Inc. Foundry Virtual Tabletop is a trademark of Foundry Gaming LLC. VTT Deck is an independent project, not affiliated with either company.

---

<a id="francais"></a>

# VTT Deck pour Foundry VTT (v13 / v14)

[English](#english) · **Français**

Pilotez Foundry Virtual Tabletop depuis un Elgato Stream Deck : macros, scènes, jetons, suivi de combat, musique et effets sonores, pause, outils, dés et tables aléatoires. Chaque touche affiche en direct des informations de la partie (image du jeton, PV, scène active, piste en lecture…).

VTT Deck est gratuit et libre (licence MIT). Certaines fonctions avancées viennent d'une extension payante, **VTT Deck Premium** (voir [Gratuit et Premium](#gratuit-et-premium)).

| Pièce | Où la trouver | Où l'installer |
|---|---|---|
| Plugin Stream Deck **VTT Deck** (`com.vttdeck.foundry`) | Elgato Marketplace, ou `com.vttdeck.foundry.streamDeckPlugin` sur la page [Releases](https://github.com/zedoc84/vtt-deck/releases) | sur l'ordinateur où le Stream Deck est branché |
| Module Foundry **VTT Deck** (`vtt-deck`) | URL de manifeste ci-dessous, ou `module.zip` sur la page Releases | dans Foundry |

Version actuelle : **1.5.1** (le module et le plugin ont le même numéro).

## Fonctionnement

Le plugin ouvre un petit serveur sur votre propre ordinateur (`127.0.0.1:3006`). Le navigateur — ou l'application Foundry — qui affiche votre partie s'y connecte, dessine les touches et exécute les appuis. Toute la logique de jeu est dans le module Foundry ; le plugin ne fait que relayer.

Rien n'est envoyé sur Internet. Par défaut, le plugin n'accepte que les connexions venant du même ordinateur.

<a id="gratuit-et-premium"></a>

## Gratuit et Premium

| Action Stream Deck | Gratuit | ★ Avec VTT Deck Premium |
|---|---|---|
| Macro, Scène, Musique & sons, Système | tout | — |
| Jeton | jeton sélectionné : image, nom ; sélectionner, centrer, ouvrir la fiche | personnages précis, combattant actif, PV / barre 2 / attribut + jauge, états, ±PV, cibler, cacher, ajout au combat |
| Combat | tour et round suivant/précédent, début/fin, initiative, affichage du round | **suivi d'initiative automatique**, combattant n°X, combattant actif, ajout/retrait des jetons sélectionnés |
| Pavé dégâts & soins | — | ★ taper un montant, appliquer dégâts ou soins à tous les jetons sélectionnés |
| Ambiance | — | ★ scène + musique + obscurité + météo (+ macro) en un appui |
| Page dynamique | — | ★ des touches qui se remplissent avec les macros, scènes ou musiques d'un dossier Foundry, un dossier de sons ou les objets d'un personnage |
| Séquence | — | ★ plusieurs actions sur une touche, sans code (plus une étape « script » réservée au MJ) |
| Molette (Stream Deck +, + XL) | — | ★ volumes, lumière, tours de combat, PV d'un jeton, zoom ; parcourir le groupe, les scènes, les cibles (ciblage Maj), les pistes, les dés, les macros |
| Toutes les actions sur une molette (Stream Deck +, + XL) | — | ★ appuyer sur la molette fait comme la touche |
| Système, en plus | — | ★ météo, temps de jeu, montrer aux joueurs, portes, lumières, alertes, ciblage rapide |
| Jeton, en plus | — | ★ vue du groupe, états sur les touches, déplacement, rotation, altitude, niveaux de scène (v14) |
| Profils prêts à l'emploi | ouverture depuis l'inspecteur | ★ passage automatique au profil Combat quand un combat commence |

Dans l'inspecteur Stream Deck, les options Premium sont marquées ★ Premium. Sans VTT Deck Premium, une touche réglée sur l'une d'elles affiche un cadenas et « Premium » ; un appui affiche un message dans Foundry. Tout le reste fonctionne normalement.

## 1. Installer le plugin Stream Deck

1. Installez **VTT Deck** depuis l'Elgato Marketplace, ou double-cliquez sur `com.vttdeck.foundry.streamDeckPlugin`.
2. Une catégorie **VTT Deck** apparaît dans la liste des actions, avec 11 actions : Macro, Scène, Jeton, Combat, Musique & sons, Système, Pavé dégâts & soins, Ambiance, Page dynamique, Séquence et Molette (Stream Deck +, + XL).
3. Test : ouvrez <http://127.0.0.1:3006> dans un navigateur. Le plugin répond `VTT Deck bridge 1.5.1 — OK`.

Prérequis : application Stream Deck 6.9 ou plus récente, macOS 12+ ou Windows 10+. L'inspecteur suit la langue de l'application Stream Deck (français ou anglais).

Si l'ancien plugin **Material Deck** est installé, vous pouvez le garder : les deux plugins n'utilisent pas le même port.

## 2. Installer le module Foundry

**Par URL de manifeste (recommandé)** : dans Foundry, *Modules complémentaires* → *Installer un module* → collez en bas
`https://github.com/zedoc84/vtt-deck/releases/latest/download/module.json` → *Installer*.
Foundry proposera ensuite les mises à jour automatiquement.

**À la main** :

1. Arrêtez le monde (pas besoin de quitter Foundry).
2. Décompressez `module.zip` dans un dossier `vtt-deck` placé dans `Data/modules/` de Foundry
   (sur Mac : `~/Library/Application Support/FoundryVTT/Data/modules/vtt-deck/`).
   Le dossier doit contenir directement `module.json`.
3. Relancez le monde et activez **VTT Deck** dans *Gérer les modules*.
4. **Appairage (une fois par navigateur)** : sur le Stream Deck, ouvrez les réglages de n'importe quelle touche VTT Deck → **Connexion Foundry** → copiez le **Code**. Dans Foundry : *Paramètres* → *VTT Deck* → **Code d'appairage** → collez → *Enregistrer*.
5. *Paramètres* → *VTT Deck* → **Afficher l'état** : le point doit être vert et *Appairage* doit indiquer « appairé ».

Réglages du module (enregistrés par navigateur) :

| Réglage | Par défaut | Remarques |
|---|---|---|
| Connexion au Stream Deck sur ce navigateur | Auto (MJ uniquement) | *Toujours* / *Jamais*. « Auto » évite aux joueurs une demande d'autorisation réseau du navigateur. |
| Adresse du plugin | `127.0.0.1` | À garder si le Stream Deck est branché sur cet ordinateur. |
| Code d'appairage | — | Code affiché par le plugin (inspecteur → *Connexion Foundry*). Sans lui, le plugin refuse la connexion (plugin 1.5.1 ou plus récent). |
| Port du plugin | `3006` | Doit être identique à celui du plugin (inspecteur → *Connexion Foundry*). |
| Notifications de connexion | activées | Message quand le Stream Deck se connecte ou se déconnecte. |

La **fenêtre d'état** montre la connexion, les appareils, les touches utilisées et si VTT Deck Premium est actif. Ses boutons **Reconnecter** et **Redessiner les touches** règlent la plupart des petits soucis.

## 3. Régler les touches

Glissez une action sur une touche, puis réglez-la dans l'inspecteur en bas de l'application Stream Deck. Les listes (macros, scènes, playlists, états, tables, outils, dossiers) viennent directement de votre monde : Foundry doit être ouvert et connecté. Le bouton ↻ recharge une liste.

**Laissez vide le champ « Titre » de l'application Stream Deck** : c'est Foundry qui écrit le texte dans l'image de la touche. Un titre saisi dans Stream Deck s'afficherait par-dessus.

Section **Apparence**, commune à toutes les actions :

- **Texte** : remplace le texte automatique. `|` = retour à la ligne. Variables : `{name}`, `{value}`, `{max}`, `{round}`. Exemple : `PV {value}/{max}`.
- **Masquer** : aucune inscription.
- **Image** : chemin d'une image de Foundry (ex. `icons/svg/sun.svg`), qui remplace l'image automatique.
- **Fond** : couleur de fond (↺ = couleur par défaut).

## 4. Les actions

**Macro** — exécute la macro choisie. L'image et le nom de la macro s'affichent sur la touche.

**Scène** — l'afficher pour soi, l'activer pour tous (MJ), ouvrir sa configuration, ou l'afficher/masquer dans la barre de navigation. Cadre vert = scène active, bleu = scène que vous regardez.

**Jeton** — le jeton sélectionné : image et nom ; à l'appui, sélectionner et centrer, centrer seulement, ou ouvrir/fermer la fiche.
★ Premium : un personnage précis ou le combattant actif ; barre 1 (PV), barre 2 ou un attribut quelconque (ex. `system.attributes.ac.value`) avec jauge ; à l'appui, cibler, cacher/montrer (MJ), basculer un état, modifier la barre 1 de ±N, ajouter/retirer du combat. La jauge utilise la **barre 1 du jeton** : elle marche avec tous les systèmes de jeu, y compris les systèmes maison.

**Combat** — tour ou round suivant/précédent, commencer le combat (créé avec les jetons sélectionnés s'il n'y en a pas), le terminer, initiative de tous ou des PNJ, affichage du round et du tour.
★ Premium : suivi d'initiative automatique, combattant n°X, combattant actif, ajout/retrait des jetons sélectionnés. Cadre jaune = son tour, ☠ = vaincu, initiative en haut à gauche.

**Musique & sons** — lancer/arrêter une playlist ou une seule piste (cadre vert = en lecture), jouer un fichier audio comme effet sonore (chez tous les joueurs ou seulement chez vous, avec son propre volume), tout arrêter.

**Système** — pause (cadre rouge pendant la pause), outil de scène (ex. Jetons → Cibler), onglet de la barre latérale, lancer de dés (mode actuel du chat, public, MJ seulement, pour soi), tirage dans une table, message dans le chat (éventuellement chuchoté aux MJ), niveau d'obscurité de la scène.

**Pavé dégâts & soins**, **Ambiance**, **Page dynamique**, **Séquence**, **Molette** — actions ★ Premium, décrites dans la documentation de VTT Deck Premium.

## 5. Profils prêts à l'emploi

Le plugin est livré avec deux profils Stream Deck, pour le Stream Deck (15 touches), le XL, le Stream Deck +, le Stream Deck + XL, le Neo et le Mini :

- **VTT Deck – Exploration** : des rangées de scènes et de macros (et de playlists sur le XL et le + XL) qui se remplissent avec le contenu de votre monde, avec des touches « page suivante » ;
- **VTT Deck – Combat** : rangée d'initiative automatique, commandes de tour et pavé dégâts & soins (rangé dans un dossier sur les petits modèles).

Ouvrez-les depuis n'importe quelle touche VTT Deck : inspecteur → **Profils prêts à l'emploi** → *Exploration* ou *Combat*. Ce sont des profils ordinaires : réorganisez-les comme vous voulez. Beaucoup de leurs touches utilisent des fonctions Premium et affichent un cadenas sans VTT Deck Premium.

## 6. Dépannage

- **« Saisissez le code d'appairage » / « Code d'appairage incorrect »** : copiez le code affiché dans le plugin (réglages de n'importe quelle touche VTT Deck → *Connexion Foundry*) dans *Paramètres* → *VTT Deck* → **Code d'appairage**.
- **« Non protégé (plugin ancien) » dans la fenêtre d'état** : votre plugin Stream Deck est antérieur à la 1.5.1 et ne vérifie pas qui se connecte. Mettez-le à jour.
- **Le point reste rouge** : l'application Stream Deck est-elle lancée ? <http://127.0.0.1:3006> répond-il ? Le port est-il le même des deux côtés ? Cliquez sur **Reconnecter** dans la fenêtre d'état.
- **Chrome / Edge demande « accéder aux appareils du réseau local »** : acceptez. C'est le navigateur qui autorise la page Foundry à parler au plugin sur votre ordinateur.
- **Foundry en HTTPS avec Safari** : Safari peut bloquer la connexion `ws://` locale. Utilisez Chrome, Firefox ou l'application Foundry.
- **« Une autre fenêtre Foundry pilote le Stream Deck »** : une seule fenêtre à la fois pilote le Stream Deck (la dernière connectée). Fermez l'autre onglet puis cliquez sur *Reconnecter*.
- **Une touche affiche ⚠** : l'action a échoué ; la raison s'affiche dans une notification Foundry (macro supprimée, action réservée au MJ…).
- **Une touche affiche un cadenas** : cette option nécessite VTT Deck Premium.
- **Images de jetons absentes** : images hébergées sur un autre site sans autorisation CORS. La touche est alors dessinée sans l'image.
- **Foundry sur un autre ordinateur ou un NAS** : le plugin dialogue avec le *navigateur*, pas avec le serveur Foundry. Ouvrez la partie dans un navigateur de l'ordinateur où le Stream Deck est branché.
- **Journaux du plugin** : Mac `~/Library/Application Support/com.elgato.StreamDeck/Plugins/com.vttdeck.foundry.sdPlugin/logs/`, Windows `%APPDATA%\Elgato\StreamDeck\Plugins\com.vttdeck.foundry.sdPlugin\logs\`.

Bugs et suggestions : [Issues](https://github.com/zedoc84/vtt-deck/issues).

## 7. Pour les développeurs

### Organisation du dépôt

| Chemin | Contenu |
|---|---|
| `module.json`, `scripts/`, `lang/`, `styles/` | module Foundry |
| `streamdeck-plugin/src/plugin.js` | source du plugin (relais WebSocket) |
| `streamdeck-plugin/com.vttdeck.foundry.sdPlugin/` | dossier du plugin : manifeste, inspecteur (`ui/`), icônes, profils, traductions |
| `streamdeck-plugin/tools/` | `make-profiles.py` (profils fournis), `make-icons.py` (icônes des actions) |
| `.github/workflows/release.yml` | fabrique et joint le module et le plugin à chaque release GitHub |

### Compiler le plugin (Node.js 20 ou plus)

```bash
cd streamdeck-plugin
npm install
npm run build      # assemble src/plugin.js dans bin/plugin.js
npm run validate   # vérifications d'Elgato
npm run pack       # crée dist/com.vttdeck.foundry.streamDeckPlugin
python3 tools/make-profiles.py   # régénère les profils fournis après un changement de disposition
```

### Publier une version

Créez une release GitHub avec un tag du type `v1.3.1`. Le workflow met la version dans `module.json`, fabrique `module.zip` et le `.streamDeckPlugin`, et les joint à la release. Si le secret `FOUNDRY_RELEASE_TOKEN` est défini, la version est aussi annoncée sur foundryvtt.com via la Package Release API.

### API pour les extensions

`game.modules.get("vtt-deck").api`, disponible dès le hook `vttDeck.init` :

```js
Hooks.once("vttDeck.init", (api) => {
  api.registerAction("token", monAction);   // remplace ou ajoute un type d'action
  const h = api.helpers;                    // outils communs (panTo, fail, lockedSpec, t…)
});
```

Une action est un objet `{ hooks, render(settings, key), press(settings, key), needsPro?(settings), layout?, renderDial?(settings, key), dial?(settings, key, { ticks }), dialPress?(settings, key) }`. `api.registerDecorator((spec, settings, key) => spec)` modifie le dessin des touches ; `api.registerGuard((key) => true | "message")` autorise ou refuse un appui. Après le hook `ready`, `api.deck` fournit `rank(key, filtre)` (position d'une touche parmi ses semblables, dans l'ordre de lecture), `queueType(type)` (redessine toutes les touches d'un type) et `send(message)` (message au plugin). Le hook `vttDeck.connected` est appelé à chaque connexion au plugin.

Ajouter une fonction se fait en général sans modifier le plugin lui-même : ajoutez l'option dans `ui/pi.js` (inspecteur) et son traitement dans le module.

### Protocole (JSON sur WebSocket)

- Appairage (protocole 2) : plugin → `challenge {nonce}` ; Foundry → `hello {auth: HMAC-SHA256(code, "client:"+nonce), cnonce}` ; plugin → `hello {proof: HMAC-SHA256(code, "server:"+cnonce)}` ou `authFailed` puis fermeture. Rien d'autre n'est échangé avant que les deux côtés soient vérifiés.
- Plugin → Foundry : `hello`, `willAppear`, `willDisappear`, `settings`, `keyDown`, `keyUp`, `dialRotate`, `dialDown`, `dialUp`, `touchTap`, `piRequest`, `device`, `replaced`.
- Foundry → plugin : `hello`, `renderBatch` (images PNG 144×144 en data URL), `render`, `dialFeedback` (écran tactile du Stream Deck + et + XL : titre, valeur, jauge, image), `feedback`, `piData`, `switchProfile`, `ping`.

## Licence

MIT — voir [LICENSE](LICENSE).

Stream Deck et Elgato sont des marques de Corsair Memory, Inc. Foundry Virtual Tabletop est une marque de Foundry Gaming LLC. VTT Deck est un projet indépendant, sans lien avec ces sociétés.
