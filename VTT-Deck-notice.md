# VTT Deck — Stream Deck pour Foundry VTT (v13 / v14)

Deux pièces vont ensemble :

| Pièce | Fichier | Où l'installer |
|---|---|---|
| Module Foundry | `vtt-deck-1.0.0.zip` | dans Foundry (`Data/modules/vtt-deck`) |
| Plugin Stream Deck | `com.vttdeck.foundry.streamDeckPlugin` | sur l'ordinateur où le Stream Deck est branché |

Le plugin ouvre un petit serveur local (`127.0.0.1:3006`). Le navigateur (ou l'appli Foundry) qui affiche votre partie s'y connecte, dessine les touches et exécute les appuis.

## 1. Installer le plugin Stream Deck

1. Si l'ancien plugin **Material Deck** est installé, vous pouvez le garder ou le supprimer (ils n'utilisent pas le même port).
2. Double-cliquez sur `com.vttdeck.foundry.streamDeckPlugin` : l'application Stream Deck l'installe.
3. Une catégorie **VTT Deck** apparaît à droite avec 6 actions : Macro, Scène, Jeton, Combat, Musique & sons, Système.
4. Test : ouvrez <http://127.0.0.1:3006> dans le navigateur. Le plugin doit répondre `VTT Deck bridge 1.0.0 — OK`.

Prérequis : application Stream Deck 6.9 ou plus récente, macOS 12+ ou Windows 10+.

## 2. Installer le module Foundry

1. Arrêtez le monde (pas besoin de quitter Foundry).
2. Décompressez `vtt-deck-1.0.0.zip` dans le dossier `Data/modules/` de Foundry.
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

**Jeton** — cible : jeton sélectionné, personnage précis, ou combattant actif. Affiche le nom, la barre 1 (PV), la barre 2 ou un attribut quelconque (ex. `system.attributes.ac.value`). La jauge vient de la **barre 1 du jeton**, ce qui marche avec tous les systèmes, y compris un système maison. À l'appui : sélectionner + centrer, centrer, ouvrir la fiche, cibler, cacher (MJ), basculer un état, modifier la barre 1 de ±N, ajouter/retirer du combat.

**Combat** — tour / round suivant ou précédent, commencer (crée le combat avec les jetons sélectionnés s'il n'y en a pas), terminer, initiative de tous ou des PNJ, affichage du round, combattant actif, et **Combattant n°X**.
Astuce : mettez 6 à 8 touches « Combattant n° 1, 2, 3… » sur une rangée pour avoir le suivi d'initiative sous les doigts. Cadre jaune = son tour, ☠ = vaincu, initiative en haut à gauche.

**Musique & sons** — lancer/arrêter une playlist ou une piste (cadre vert = en lecture), jouer un fichier audio comme effet sonore (chez tous les joueurs ou seulement chez vous), tout arrêter.

**Système** — pause (cadre rouge quand le jeu est en pause), outil de scène (ex. Jetons → Cibler), onglet de la barre latérale, lancer de dés (mode du chat, public, MJ, privé), tirage dans une table, message dans le chat (éventuellement chuchoté aux MJ), niveau d'obscurité de la scène.

## 4. Dépannage

- **Le point reste rouge** : l'application Stream Deck est-elle lancée ? <http://127.0.0.1:3006> répond-il ? Le port est-il identique des deux côtés ? Bouton **Reconnecter** dans la fenêtre d'état.
- **Chrome / Edge demande « accéder aux appareils du réseau local »** : acceptez. C'est le navigateur qui autorise la page Foundry à parler au plugin sur votre ordinateur.
- **Foundry en HTTPS avec Safari** : Safari peut bloquer la connexion `ws://` locale. Utilisez Chrome, Firefox ou l'application Foundry.
- **« Une autre fenêtre Foundry pilote le Stream Deck »** : une seule fenêtre à la fois pilote le Stream Deck (la dernière connectée). Fermez l'autre onglet puis cliquez sur *Reconnecter*.
- **Une touche affiche ⚠** : l'action a échoué. La raison s'affiche dans une notification Foundry (macro supprimée, action réservée au MJ…).
- **Images de jetons absentes** : images hébergées sur un autre site sans autorisation CORS. La touche s'affiche alors sans image.
- **Journaux du plugin** : Mac `~/Library/Application Support/com.elgato.StreamDeck/Plugins/com.vttdeck.foundry.sdPlugin/logs/`.

## 5. Modifier le plugin

Les sources du plugin sont dans `vtt-deck-streamdeck-source.zip` (Node.js 20 ou plus) :

```bash
npm install
npm run build      # recompile bin/plugin.js
npm run pack       # recrée le .streamDeckPlugin dans dist/
```

Toute la logique de jeu est dans le module Foundry (`scripts/actions.js`). Ajouter une fonction se fait en général sans toucher au plugin : il suffit d'ajouter l'option dans `ui/pi.js` (inspecteur) et son traitement dans `actions.js`.

Protocole (JSON sur WebSocket) :

- Plugin → Foundry : `hello`, `willAppear`, `willDisappear`, `settings`, `keyDown`, `keyUp`, `piRequest`, `device`, `replaced`.
- Foundry → plugin : `hello`, `renderBatch` (images PNG 144×144 en data URL), `feedback`, `piData`.
