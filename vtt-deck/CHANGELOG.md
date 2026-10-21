# Changelog

## 1.5.1 — sécurité
Module Foundry et plugin Stream Deck 1.5.1. Corrige les points de l'audit de sécurité du 21 octobre 2026.
- **Appairage** : le plugin affiche un code (réglages d'une touche → Connexion Foundry), à saisir une fois dans Foundry (paramètres du module → Code d'appairage). Défi et réponse HMAC-SHA-256 dans les deux sens : le code ne circule jamais, et Foundry ignore tout programme qui ne prouve pas être le plugin.
- Une page web ou un autre appareil ne peut plus se connecter au plugin, lire les réglages des touches, les réécrire ni éjecter Foundry. Les connexions refusées sont signalées dans l'inspecteur avec leur origine (l'inspecteur ne s'ouvre tout seul que pour votre Foundry habituel) ; 10 refus en une minute depuis la même origine la bloquent une minute, sans gêner votre Foundry.
- Plugin : contrôle de l'en-tête Host (protection contre le « DNS rebinding »), messages limités à 4 Mo (4 Ko avant l'appairage), 8 connexions en attente au plus.
- Module : une fois le code saisi, un programme qui ne demande pas le code est refusé (pas de repli « ancien plugin »), et Foundry réessaie plus tard ; délai maximal de 5 s pour l'appairage.
- Messages de chat de l'action Système affichés en texte brut (pas de HTML venu des réglages du Stream Deck).
- Publication GitHub : actions épinglées sur un commit, jeton Foundry réservé à l'étape d'annonce, `npm ci --ignore-scripts`, contrôle du format du tag.
- Le plugin ne traite plus le message `setSettings` (inutilisé, il permettait de réécrire les touches).
- La page `http://127.0.0.1:3006` n'est plus lisible par les autres sites (en-tête CORS retiré).
- Fenêtre d'état : état de l'appairage, avertissement quand le Stream Deck est sur une autre machine (liaison non chiffrée), valeurs venues du plugin échappées.
- Compatibilité : avec un plugin d'avant 1.5.1, le module se connecte encore (sans appairage) et le signale ; un module d'avant 1.5.1 est refusé par le plugin 1.5.1.

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
