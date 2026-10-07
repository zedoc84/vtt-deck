<a id="english"></a>

# VTT Deck — Stream Deck for Foundry VTT (v13 / v14)

**English** · [Français](#francais)

Two pieces work together:

| Piece | File | Where to install it |
|---|---|---|
| Foundry module | `vtt-deck-1.1.0.zip` | in Foundry (`Data/modules/vtt-deck`) |
| Stream Deck plugin | `com.vttdeck.foundry.streamDeckPlugin` (*Releases* page of the GitHub repository) | on the computer the Stream Deck is plugged into |

The plugin opens a small local server (`127.0.0.1:3006`). The browser (or the Foundry app) displaying your game connects to it, draws the keys and runs the key presses.

## Free version and VTT Deck Pro

| Action | Free | ★ With VTT Deck Pro |
|---|---|---|
| Macro, Scene, Music & sounds, System | everything | — |
| Token | selected token: image, name; select, centre, sheet | specific characters, active combatant, HP / bar 2 / attribute + gauge, conditions, ±HP, target, hide, add to combat |
| Combat | next/previous turn and round, start/end, initiative, round display | Combatant #X (initiative row), active combatant, add/remove selected tokens |

In the Stream Deck inspector, Pro options are marked ★ Pro. Without VTT Deck Pro, a key set to one of these options shows a padlock.

## 1. Install the Stream Deck plugin

1. If the old **Material Deck** plugin is installed, you can keep it or remove it (they don't use the same port).
2. Double-click `com.vttdeck.foundry.streamDeckPlugin`: the Stream Deck app installs it.
3. A **VTT Deck** category appears on the right with 6 actions: Macro, Scene (*Scène*), Token (*Jeton*), Combat, Music & sounds (*Musique & sons*), System (*Système*).
4. Test: open <http://127.0.0.1:3006> in your browser. The plugin should reply `VTT Deck bridge 1.1.0 — OK`.

Requirements: Stream Deck app 6.9 or later, macOS 12+ or Windows 10+.

The Stream Deck inspector is currently in French; the labels in *italics* below are the ones you will see there.

## 2. Install the Foundry module

**With the manifest URL (recommended)**: in Foundry, *Add-on Modules* → *Install Module* → paste at the bottom
`https://github.com/zedoc84/vtt-deck/releases/latest/download/module.json` → *Install*.
Foundry will then offer updates automatically.

**Manually**:

1. Shut down the world (no need to quit Foundry).
2. Unzip `vtt-deck-1.1.0.zip` into Foundry's `Data/modules/` folder.
   On Mac: `~/Library/Application Support/FoundryVTT/Data/modules/vtt-deck/`
   (the folder must contain `module.json` directly).
   If Foundry runs on another computer or a NAS, copy the folder to the same location there.
3. Restart the world and enable **VTT Deck — Stream Deck** in *Manage Modules*.
4. *Settings* → *Module Settings* → **Show status**: the dot should be green.

Foundry-side settings (per browser):

- **Connection**: *Auto* = only the GM connects (recommended); *Always*; *Never*.
- **Address / port**: `127.0.0.1` and `3006` by default. The port must match the plugin's port, which you can set at the bottom of any key's inspector, in the *Connexion Foundry* section.

## 3. Configure the keys

Drag an action onto a key, then configure it in the inspector at the bottom. The lists (macros, scenes, playlists, conditions, tables, tools) come straight from your world, so Foundry must be open and connected. The ↻ button reloads a list.

**Leave the Stream Deck app's "Title" field empty**: Foundry writes the text into the image. A title typed in Stream Deck would be displayed on top of it.

**Appearance** section (*Apparence*), common to all actions:

- **Text** (*Texte*): replaces the automatic text. `|` = line break. Variables: `{name}`, `{value}`, `{max}`, `{round}`. Example: `HP {value}/{max}`.
- **Hide** (*Masquer*): no text at all.
- **Image**: path to a Foundry image (e.g. `icons/svg/sun.svg`) that replaces the automatic image.
- **Background** (*Fond*): background colour (↺ = default colour).

### The 6 actions

**Macro** — runs the chosen macro (the macro's image and name appear on the key).

**Scene** — view it yourself, activate it for everyone (GM), open its configuration, or show/hide it in the navigation bar. Green border = active scene, blue = the scene you are viewing.

**Token** — free version: the selected token (image and name; on press: select + centre, centre, open the sheet).
★ Pro: target a specific character or the active combatant; show bar 1 (HP), bar 2 or any attribute (e.g. `system.attributes.ac.value`). The gauge comes from the token's **bar 1**, which works with every system, including homebrew ones. On press: target, hide (GM), toggle a condition, change bar 1 by ±N, add to/remove from combat.

**Combat** — free version: next or previous turn / round, start (creates the combat from the selected tokens if there isn't one), end, roll initiative for everyone or for NPCs, round display.
★ Pro: active combatant, add/remove the selected tokens, and **Combatant #X**. Tip: put 6 to 8 "Combatant #1, 2, 3…" keys in a row to have the initiative tracker at your fingertips. Yellow border = their turn, ☠ = defeated, initiative in the top-left corner.

**Music & sounds** — start/stop a playlist or a track (green border = playing), play an audio file as a sound effect (for all players or just for you), stop everything.

**System** — pause (red border while the game is paused), scene tool (e.g. Tokens → Target), sidebar tab, dice roll (chat mode, public, GM, private), roll on a table, chat message (optionally whispered to the GMs), scene darkness level.

## 4. Troubleshooting

- **The dot stays red**: is the Stream Deck app running? Does <http://127.0.0.1:3006> respond? Is the port the same on both sides? Use the **Reconnect** button in the status window.
- **Chrome / Edge asks to "access devices on your local network"**: accept. This is the browser allowing the Foundry page to talk to the plugin on your computer.
- **Foundry over HTTPS in Safari**: Safari may block the local `ws://` connection. Use Chrome, Firefox or the Foundry app.
- **"Another Foundry window controls the Stream Deck"**: only one window at a time controls the Stream Deck (the most recently connected one). Close the other tab, then click *Reconnect*.
- **A key shows ⚠**: the action failed. The reason appears in a Foundry notification (deleted macro, GM-only action…).
- **A key shows a padlock**: that option requires VTT Deck Pro.
- **Missing token images**: images hosted on another site without CORS permission. The key is then shown without an image.
- **Plugin logs**: on Mac, `~/Library/Application Support/com.elgato.StreamDeck/Plugins/com.vttdeck.foundry.sdPlugin/logs/`.

## 5. Modifying the plugin

The plugin sources are in the `streamdeck-plugin/` folder (Node.js 20 or later):

```bash
npm install
npm run build      # rebuilds bin/plugin.js
npm run pack       # recreates the .streamDeckPlugin in dist/
```

All the game logic lives in the Foundry module (`scripts/actions.js`).

**Extension API** (`game.modules.get("vtt-deck").api`):

```js
Hooks.once("vttDeck.init", (api) => {
  api.registerAction("token", myAction);   // replaces or adds an action
  const h = api.helpers;                   // shared helpers (panTo, fail, t…)
});
```

An action is an object `{ hooks, render(settings, key), press(settings, key), needsPro?(settings) }`. Adding a feature usually doesn't require touching the plugin: just add the option in `ui/pi.js` (inspector) and its handling in `actions.js`.

Protocol (JSON over WebSocket):

- Plugin → Foundry: `hello`, `willAppear`, `willDisappear`, `settings`, `keyDown`, `keyUp`, `piRequest`, `device`, `replaced`.
- Foundry → plugin: `hello`, `renderBatch` (144×144 PNG images as data URLs), `feedback`, `piData`.

---

<a id="francais"></a>

# VTT Deck — Stream Deck pour Foundry VTT (v13 / v14)

[English](#english) · **Français**

Deux pièces vont ensemble :

| Pièce | Fichier | Où l'installer |
|---|---|---|
| Module Foundry | `vtt-deck-1.1.0.zip` | dans Foundry (`Data/modules/vtt-deck`) |
| Plugin Stream Deck | `com.vttdeck.foundry.streamDeckPlugin` (page *Releases* du dépôt GitHub) | sur l'ordinateur où le Stream Deck est branché |

Le plugin ouvre un petit serveur local (`127.0.0.1:3006`). Le navigateur (ou l'appli Foundry) qui affiche votre partie s'y connecte, dessine les touches et exécute les appuis.

## Version gratuite et VTT Deck Pro

| Action | Gratuit | ★ Avec VTT Deck Pro |
|---|---|---|
| Macro, Scène, Musique & sons, Système | tout | — |
| Jeton | jeton sélectionné : image, nom ; sélectionner, centrer, fiche | personnages précis, combattant actif, PV / barre 2 / attribut + jauge, états, ±PV, cibler, cacher, ajout au combat |
| Combat | tour et round suivant/précédent, début/fin, initiative, affichage du round | Combattant n°X (rangée d'initiative), combattant actif, ajout/retrait des jetons sélectionnés |

Dans l'inspecteur Stream Deck, les options Pro sont marquées ★ Pro. Sans VTT Deck Pro, une touche réglée sur une de ces options affiche un cadenas.

## 1. Installer le plugin Stream Deck

1. Si l'ancien plugin **Material Deck** est installé, vous pouvez le garder ou le supprimer (ils n'utilisent pas le même port).
2. Double-cliquez sur `com.vttdeck.foundry.streamDeckPlugin` : l'application Stream Deck l'installe.
3. Une catégorie **VTT Deck** apparaît à droite avec 6 actions : Macro, Scène, Jeton, Combat, Musique & sons, Système.
4. Test : ouvrez <http://127.0.0.1:3006> dans le navigateur. Le plugin doit répondre `VTT Deck bridge 1.1.0 — OK`.

Prérequis : application Stream Deck 6.9 ou plus récente, macOS 12+ ou Windows 10+.

## 2. Installer le module Foundry

**Par URL de manifeste (recommandé)** : dans Foundry, *Modules complémentaires* → *Installer un module* → collez en bas
`https://github.com/zedoc84/vtt-deck/releases/latest/download/module.json` → *Installer*.
Foundry proposera ensuite les mises à jour automatiquement.

**À la main** :

1. Arrêtez le monde (pas besoin de quitter Foundry).
2. Décompressez `vtt-deck-1.1.0.zip` dans le dossier `Data/modules/` de Foundry.
   Sur Mac : `~/Library/Application Support/FoundryVTT/Data/modules/vtt-deck/`
   (le dossier doit contenir directement `module.json`).
   Si Foundry tourne sur un autre ordinateur ou un NAS, copiez-y le dossier au même endroit.
3. Relancez le monde, activez **VTT Deck — Stream Deck** dans *Gérer les modules*.
4. *Paramètres* → *Paramètres du module* → **Afficher l'état** : le point doit être vert.

Réglages côté Foundry (par navigateur) :

- **Connexion** : *Auto* = seul le MJ se connecte (recommandé) ; *Toujours* ; *Jamais*.
- **Adresse / port** : `127.0.0.1` et `3006` par défaut. Le port doit être identique à celui du plugin (réglable en bas de l'inspecteur de n'importe quelle touche, section « Connexion Foundry »).

## 3. Configurer les touches

Glissez une action sur une touche, puis réglez-la dans l'inspecteur du bas. Les listes (macros, scènes, playlists, états, tables, outils) viennent directement de votre monde : Foundry doit être ouvert et connecté. Le bouton ↻ recharge une liste.

**Laissez le champ « Titre » de l'application Stream Deck vide** : c'est Foundry qui écrit le texte dans l'image. Un titre saisi dans Stream Deck s'afficherait par-dessus.

Section **Apparence**, commune à toutes les actions :

- **Texte** : remplace le texte automatique. `|` = retour à la ligne. Variables : `{name}`, `{value}`, `{max}`, `{round}`. Exemple : `PV {value}/{max}`.
- **Masquer** : aucune inscription.
- **Image** : chemin d'une image de Foundry (ex. `icons/svg/sun.svg`), qui remplace l'image automatique.
- **Fond** : couleur de fond (↺ = couleur par défaut).

### Les 6 actions

**Macro** — exécute la macro choisie (image + nom de la macro sur la touche).

**Scène** — afficher pour soi, activer pour tous (MJ), ouvrir la configuration, ou afficher/masquer dans la navigation. Cadre vert = scène active, bleu = scène que vous regardez.

**Jeton** — version gratuite : le jeton sélectionné (image et nom ; à l'appui : sélectionner + centrer, centrer, ouvrir la fiche).
★ Pro : viser un personnage précis ou le combattant actif ; afficher la barre 1 (PV), la barre 2 ou un attribut quelconque (ex. `system.attributes.ac.value`). La jauge vient de la **barre 1 du jeton**, ce qui marche avec tous les systèmes, y compris un système maison. À l'appui : cibler, cacher (MJ), basculer un état, modifier la barre 1 de ±N, ajouter/retirer du combat.

**Combat** — version gratuite : tour / round suivant ou précédent, commencer (crée le combat avec les jetons sélectionnés s'il n'y en a pas), terminer, initiative de tous ou des PNJ, affichage du round.
★ Pro : combattant actif, ajout/retrait des jetons sélectionnés, et **Combattant n°X**. Astuce : mettez 6 à 8 touches « Combattant n° 1, 2, 3… » sur une rangée pour avoir le suivi d'initiative sous les doigts. Cadre jaune = son tour, ☠ = vaincu, initiative en haut à gauche.

**Musique & sons** — lancer/arrêter une playlist ou une piste (cadre vert = en lecture), jouer un fichier audio comme effet sonore (chez tous les joueurs ou seulement chez vous), tout arrêter.

**Système** — pause (cadre rouge quand le jeu est en pause), outil de scène (ex. Jetons → Cibler), onglet de la barre latérale, lancer de dés (mode du chat, public, MJ, privé), tirage dans une table, message dans le chat (éventuellement chuchoté aux MJ), niveau d'obscurité de la scène.

## 4. Dépannage

- **Le point reste rouge** : l'application Stream Deck est-elle lancée ? <http://127.0.0.1:3006> répond-il ? Le port est-il identique des deux côtés ? Bouton **Reconnecter** dans la fenêtre d'état.
- **Chrome / Edge demande « accéder aux appareils du réseau local »** : acceptez. C'est le navigateur qui autorise la page Foundry à parler au plugin sur votre ordinateur.
- **Foundry en HTTPS avec Safari** : Safari peut bloquer la connexion `ws://` locale. Utilisez Chrome, Firefox ou l'application Foundry.
- **« Une autre fenêtre Foundry pilote le Stream Deck »** : une seule fenêtre à la fois pilote le Stream Deck (la dernière connectée). Fermez l'autre onglet puis cliquez sur *Reconnecter*.
- **Une touche affiche ⚠** : l'action a échoué. La raison s'affiche dans une notification Foundry (macro supprimée, action réservée au MJ…).
- **Une touche affiche un cadenas** : cette option nécessite VTT Deck Pro.
- **Images de jetons absentes** : images hébergées sur un autre site sans autorisation CORS. La touche s'affiche alors sans image.
- **Journaux du plugin** : Mac `~/Library/Application Support/com.elgato.StreamDeck/Plugins/com.vttdeck.foundry.sdPlugin/logs/`.

## 5. Modifier le plugin

Les sources du plugin sont dans le dossier `streamdeck-plugin/` (Node.js 20 ou plus) :

```bash
npm install
npm run build      # recompile bin/plugin.js
npm run pack       # recrée le .streamDeckPlugin dans dist/
```

Toute la logique de jeu est dans le module Foundry (`scripts/actions.js`).

**API pour les extensions** (`game.modules.get("vtt-deck").api`) :

```js
Hooks.once("vttDeck.init", (api) => {
  api.registerAction("token", monAction);   // remplace ou ajoute une action
  const h = api.helpers;                    // outils communs (panTo, fail, t…)
});
```

Une action est un objet `{ hooks, render(settings, key), press(settings, key), needsPro?(settings) }`. Ajouter une fonction se fait en général sans toucher au plugin : il suffit d'ajouter l'option dans `ui/pi.js` (inspecteur) et son traitement dans `actions.js`.

Protocole (JSON sur WebSocket) :

- Plugin → Foundry : `hello`, `willAppear`, `willDisappear`, `settings`, `keyDown`, `keyUp`, `piRequest`, `device`, `replaced`.
- Foundry → plugin : `hello`, `renderBatch` (images PNG 144×144 en data URL), `feedback`, `piData`.
