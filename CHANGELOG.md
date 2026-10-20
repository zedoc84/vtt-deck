# Changelog

## 1.5.0
Module Foundry et plugin Stream Deck 1.5.0.
- Plugin : toutes les actions peuvent être posées sur une molette du Stream Deck + ou du Stream Deck + XL (l'écran tactile affiche l'image et le texte de la touche) — fonction ★ Premium.
- Plugin : prise en charge du **Stream Deck + XL** (profils Exploration et Combat, changement automatique de profil).
- Inspecteur : nouvelles fonctions de l'action Molette (groupe, scènes, cibles avec option Maj, musique, dés, macros), fonction Système « Lancer la réserve de dés », source du groupe (automatique, acteur Groupe, dossier d'acteurs).
- Module : image sur l'écran tactile des molettes, appui sur l'écran distinct de l'appui sur la molette, rangées automatiques calculées séparément pour les touches et les molettes, nouvelles listes pour l'inspecteur (dossiers d'acteurs, acteurs Groupe).

## 1.4.0
Module Foundry et plugin Stream Deck 1.4.0.
- Plugin : nouvelles actions **Séquence** (touche) et **Molette** (Stream Deck +, avec affichage sur l'écran tactile).
- Plugin : profils du Stream Deck + avec molettes ; vue du groupe dans le profil Exploration du XL.
- Inspecteur : nouvelles options ★ Premium (vue du groupe, déplacement, niveaux v14, météo, temps de jeu, montrer aux joueurs, portes, lumières, alertes, ciblage, bruitages, objets, fondu, seuils de couleur), bouton « Utiliser la sélection » pour les portes et lumières, champ de code pour les scripts.
- Module : icônes des états sur les touches, voile coloré, molettes (`dialRotate`, `dialDown`, `touchTap`, `dialFeedback`).
- API : `api.registerDecorator()`, `api.registerGuard()`.
- Noms : le module gratuit s'appelle **VTT Deck** et le module payant **VTT Deck Premium** (identifiant `vtt-deck-premium`) ; les touches verrouillées affichent « Premium ».

## 1.3.0
Le module et le plugin Stream Deck passent tous deux en 1.3.0.
- Nouvelles actions Stream Deck : Pavé dégâts & soins, Ambiance, Page dynamique (fonctions de VTT Deck Premium 1.1 ; cadenas sans lui).
- Combat : option « Suivi d'initiative automatique » (VTT Deck Premium).
- Profils Stream Deck « VTT Deck – Exploration » et « VTT Deck – Combat » fournis avec le plugin, pour Stream Deck 15 touches, XL, +, Neo et Mini. Boutons « Profils prêts à l'emploi » dans l'inspecteur.
- Plugin : message `switchProfile` (changement de profil demandé par Foundry).
- API : `api.deck.rank()` (position d'une touche parmi ses semblables), `api.deck.send()`, `api.deck.queueType()` accepte un nom, hook `vttDeck.connected`.
- Inspecteur : listes des dossiers (macros, scènes, playlists) et des effets météo.

## 1.1.0
- Séparation version gratuite / VTT Deck Premium : les fonctions avancées des actions Jeton et Combat passent dans VTT Deck Premium (cadenas sur la touche sans lui).
- Nouvelle API d'extension : hook `vttDeck.init`, `api.registerAction()`, `api.helpers`.
- Fenêtre d'état : affiche si VTT Deck Premium est actif.
- Plugin Stream Deck 1.1.0 : options Premium signalées dans l'inspecteur.

## 1.0.0
- Première version : actions Macro, Scène, Jeton, Combat, Musique & sons, Système.
- Compatible Foundry VTT v13 et v14.
