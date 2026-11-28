# Changelog

## 1.6.1 — lien vers VTT Deck Premium sur les touches verrouillées
Module Foundry seulement. Le plugin Stream Deck ne change pas (seul son numéro passe en 1.6.1) : le plugin 1.6.0 convient.
- **Touche ★ Premium sans VTT Deck Premium** : au premier appui de la séance, le MJ voit une petite fenêtre qui présente VTT Deck Premium, avec un bouton « Voir sur la boutique Foundry ». « Plus tard » la referme jusqu'à la prochaine séance, « Ne plus proposer » la coupe pour ce navigateur. Les appuis suivants affichent le message habituel.
- Joueurs : le message précise que c'est le MJ qui active VTT Deck Premium dans le monde (pas de fenêtre d'achat).
- VTT Deck Premium actif mais trop ancien pour l'action (par exemple Personnage, qui demande la 1.4) : le message invite à le mettre à jour au lieu de proposer l'achat.
- API : `api.helpers.ProError` (sous-classe de `UserError`), levée par `failPro()`.
- Fiche du module : cover et deux captures déclarées dans `module.json` (`media`), images dans le dossier `media/` (elles ne vont pas dans module.zip). Elles s'affichent dans les catalogues qui lisent ce champ, comme The Forge.

## 1.6.0 — Stream Deck Mobile, Virtual Stream Deck, bibliothèque d'icônes, touches « Personnage » D&D 5e et PF2e
Module Foundry et plugin Stream Deck 1.6.0. Le plugin passe par une nouvelle revue Elgato.
- **Stream Deck Mobile** : profils « VTT Deck – Exploration » et « VTT Deck – Combat » en 5 × 3 ; le coin 3 × 2 en haut à gauche reprend la disposition du Mini, pour l'app gratuite à 6 touches.
- **Virtual Stream Deck** (Stream Deck 7.0 et plus) : « écran du MJ » de 64 touches (8 × 8) en Exploration et en Combat, pour un second écran.
- La bascule automatique vers le profil Combat (VTT Deck Premium) fonctionne aussi sur ces deux appareils.
- Nouvelle action **Personnage (D&D 5e)** : utiliser les objets, sorts et aptitudes de la fiche, jets, emplacements de sorts, repos, inspiration, concentration, demandes de jet au groupe. Elle demande VTT Deck Premium 1.4 et le système dnd5e ; sans lui, la touche affiche un cadenas.
- Nouvelle action **Personnage (PF2e)** : frappes avec pénalité d'attaques multiples, objets et sorts, tests et sauvegardes, actions du tour et réaction, états à valeur, points d'héroïsme et de focalisation, récupération, repos pour la nuit, demandes de test au groupe. Elle demande VTT Deck Premium 1.4 et le système pf2e (7.x ou 8.x).
- **Outils de séance** (gratuits, action Système) : « Ramener la vue des joueurs sur la mienne » (MJ : centre et zoom de votre vue), « Minuteur / chronomètre » affiché sur la touche (compte à rebours avec jauge, son et message à la fin ; chronomètre ; pause ; touche « Remettre à zéro » liée par un nom), « Réinitialiser le brouillard » de la scène (MJ, après confirmation).
- Profil « écran du MJ » du Virtual Stream Deck : touches Vue des joueurs et Minuteur ; en Combat, touche Minuteur du tour (Premium).
- Inspecteur : réglages des outils de séance de VTT Deck Premium 1.4 (journal de séance, minuteur du tour de combat, zone de brouillard).
- **Bibliothèque d'icônes** (gratuite, toutes les actions) : plus de 4 000 icônes de game-icons.net (CC BY 3.0) à choisir dans la section Apparence de l'inspecteur, avec recherche en français ou en anglais et catégories ; teinte réglable ; sur une touche qui affiche un nombre, l'icône passe en filigrane.
- Fenêtre d'état : noms des Virtual Stream Deck, Galleon 100 SD et Stream Deck + XL.
- Fenêtre d'état : lien vers la fiche de VTT Deck Premium sur la boutique Foundry.
- Sécurité : les noms et réglages insérés dans les notifications de Foundry sont échappés ; le tracé d'une icône de la bibliothèque est vérifié (caractères autorisés, 30 000 au plus) avant d'être dessiné. Dépendance de développement `fast-uri` mise à jour.
- **Texte en haut des touches** (gratuit, toutes les actions) : réglage *Apparence → Position* ; le texte échappe aux reflets du bas des boutons quand le Stream Deck est incliné.
- Inspecteur : réglages du carrousel de combat (Jeton « Place dans l'initiative », suivi automatique en ordre carrousel, cadres de couleur, appui « Cibler ») et de la molette « Scène : changer l'image de fond », pour VTT Deck Premium 1.4.
- Inspecteur : molette « Jeton sélectionné : PV ou autre jauge » (PV, barre 2 du jeton, ou attribut de la fiche donné par son chemin, ex. `resources.legact`) ; page dynamique « Objets d'un personnage » avec un personnage précis (fixe, quel que soit le jeton sélectionné) ou le combattant actif — pour VTT Deck Premium 1.4.

## 1.5.2 — messages d'appairage
Correctifs du module Foundry. Le plugin Stream Deck ne change pas (seul son numéro passe en 1.5.2) : le plugin 1.5.1 de l'Elgato Marketplace convient.
- L'avertissement « code d'appairage à saisir » ou « code d'appairage incorrect » disparaît dès que l'appairage réussit, et aussi quand vous saisissez un nouveau code ou cliquez sur « Reconnecter ». Avant, il restait affiché même une fois le Stream Deck connecté.
- « Code d'appairage incorrect » ne s'affiche plus que si le plugin refuse vraiment le code. Les autres refus (appairage trop lent, trop d'essais refusés, trop de connexions en attente) sont passagers : Foundry réessaie tout seul, sans avertissement, et la fenêtre d'état dit ce qui se passe.

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
