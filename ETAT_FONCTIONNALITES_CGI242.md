# CGI 242 — État réel des fonctionnalités (mars 2026)

> Ce document décrit l'état exact de chaque fonctionnalité de l'application CGI 242
> pour servir de base aux scripts vidéo. Rien n'est embelli : ce qui marche est noté ✅,
> ce qui est partiel ⚠️, ce qui manque ❌.

---

## Table des matières

1. [Recherche plein texte](#1-recherche-plein-texte)
2. [Recherche vocale](#2-recherche-vocale)
3. [Navigation par structure (tome/titre/chapitre)](#3-navigation-par-structure)
4. [Détail d'un article & écoute audio](#4-détail-dun-article--écoute-audio)
5. [Simulateur ITS](#5-simulateur-its)
6. [Simulateur IS (Minimum de perception)](#6-simulateur-is-minimum-de-perception)
7. [Simulateur Patente](#7-simulateur-patente)
8. [Simulateur Solde de liquidation](#8-simulateur-solde-de-liquidation)
9. [Simulateur Paie (Bulletin complet)](#9-simulateur-paie-bulletin-complet)
10. [Simulateur IRCM](#10-simulateur-ircm)
11. [Simulateur IRF Loyers](#11-simulateur-irf-loyers)
12. [Simulateur IBA](#12-simulateur-iba)
13. [Simulateur TVA](#13-simulateur-tva)
14. [Simulateur IGF](#14-simulateur-igf)
15. [Simulateur Enregistrement](#15-simulateur-enregistrement)
16. [Simulateur Cession de parts](#16-simulateur-cession-de-parts)
17. [Simulateur Contribution foncière](#17-simulateur-contribution-foncière)
18. [Simulateur Retenue à la source](#18-simulateur-retenue-à-la-source)
19. [Assistant IA fiscal (Chat)](#19-assistant-ia-fiscal-chat)
20. [Mode hors-ligne](#20-mode-hors-ligne)
21. [Inscription / Connexion / Authentification](#21-inscription--connexion--authentification)
22. [Dashboard](#22-dashboard)
23. [Gestion organisation / Rôles (Pro)](#23-gestion-organisation--rôles-pro)
24. [Abonnement / Paywall](#24-abonnement--paywall)
25. [Paramètres (thème, langue, profil)](#25-paramètres-thème-langue-profil)
26. [Analytiques (organisation)](#26-analytiques-organisation)
27. [Journal d'audit](#27-journal-daudit)
28. [Landing page (web)](#28-landing-page-web)
29. [Sécurité](#29-sécurité)
30. [Calendrier fiscal](#30-calendrier-fiscal)

---

## 1. Recherche plein texte

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - Recherche par mot-clé dans **2 247 articles** (78 fichiers JSON, ~2,6 Mo)
  - Couverture : Tome 1, Tome 2, Conventions fiscales (France, Italie, Maurice, Chine, CEMAC, Rwanda), TFNC, Index A-Z
  - Algorithme : recherche normalisée Unicode (sans accents, minuscules), pré-indexation via champ `_searchText` par article
  - Déclenchement : à partir de 2 caractères, debounce 300 ms
  - Résultats : numéro d'article, titre, extrait du texte, badge statut (en vigueur/abrogé/modifié), mots-clés
  - Compteur de résultats : « X résultat(s) pour "query" »
  - Desktop : résultats en liste scrollable dans le panneau latéral
  - Mobile : affichage en cartes, limité aux 50 premiers résultats
- **Ce qui manque** :
  - Pas de surlignage (highlight) du terme recherché dans les résultats
  - Pas de recherche avancée (filtres par tome, statut, date)
  - Pas de suggestions/autocomplétion
- **Écran(s)** : `app/(app)/code/index.tsx`, `components/code/SearchResults.tsx`, `components/code/MobileCGIBrowser.tsx`

---

## 2. Recherche vocale

- **Statut** : ⚠️ Implémenté partiellement — Fonctionne uniquement dans le Chat IA
- **Ce qui marche** :
  - Reconnaissance vocale via Web Speech API (navigateurs) + `expo-speech-recognition` (apps natives)
  - Langue : français (fr-FR)
  - Bouton micro dans la barre de saisie du Chat
  - Transcription en temps réel (résultats intermédiaires affichés)
  - Gestion des permissions micro
- **Ce qui manque** :
  - ❌ **Pas de recherche vocale dans le navigateur CGI** — Le bouton micro n'apparaît que dans le Chat, pas dans l'écran Code/Articles
  - Pour la vidéo « Recherche vocale », montrer la fonctionnalité dans le Chat IA, pas dans la recherche d'articles
- **Écran(s)** : `components/chat/ChatInput.tsx`, `lib/hooks/useSpeechRecognition.ts`

---

## 3. Navigation par structure

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - Arborescence hiérarchique complète du CGI : **Tome → Partie → Livre → Titre → Chapitre → Section → Sous-section → Paragraphe**
  - Profondeur : jusqu'à 4+ niveaux
  - Structure : Tome 1 (4 parties), Tome 2 (8 livres), Conventions (6 pays), TFNC (5+ textes)
  - Desktop : sidebar sommaire (30% largeur) avec arbre dépliable (chevrons), nœud sélectionné surligné en bleu
  - Mobile : navigation par pile (breadcrumb) — CGI > Tome 1 > Partie 1 > Titre 1, bouton retour
  - Chargement différé : JSON chargé uniquement à l'ouverture de l'écran Code
  - État mémorisé : sections dépliées conservées en mémoire
- **Ce qui manque** :
  - Rien de majeur — la navigation est complète
- **Écran(s)** : `app/(app)/code/index.tsx`, `components/code/TreeNode.tsx`, `components/code/MobileCGIBrowser.tsx`, `components/code/ChapterReader.tsx`

---

## 4. Détail d'un article & écoute audio

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Affichage** : numéro, titre, badge statut, mots-clés (tags), texte intégral formaté
  - **Formatage intelligent** : détection chiffres romains, degrés (°), listes numérotées/lettrées, indentation
  - **Écoute audio (TTS)** : bouton Play/Stop, lecture via `expo-speech` en français (fr-FR), vitesse 0.9x
    - Texte pré-traité : abréviations expansées (ex. ASDI → A.S.D.I.), symboles nettoyés
    - Découpage en chunks de 3 000 caractères pour lecture fluide
    - Arrêt automatique en quittant l'article
  - **Références croisées** :
    - « Cet article référence : » (liens sortants)
    - « Référencé par : » (liens entrants)
    - Récupérées via API backend (`/chat/article/{numero}/references`)
    - Cliquables pour naviguer vers l'article lié
    - Spinner de chargement pendant la requête
- **Ce qui manque** :
  - Les références croisées nécessitent une connexion internet (pas en cache offline)
- **Écran(s)** : `components/code/ArticleDetail.tsx`, `components/code/ArticleText.tsx`, `components/code/ReferencesBlock.tsx`

---

## 5. Simulateur ITS

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : Salaire brut, période (mensuel/annuel), statut familial (4 choix), enfants à charge (0-20), quotient familial (toggle)
  - **Calcul** : Annualisation → CNSS 4% (plafond 1 200 000) → Frais pro 20% → Quotient familial → Barème ITS 5 tranches (0%-30%) → Minimum 1 200 FCFA
  - **Sorties** : Brut mensuel/annuel, CNSS, net imposable, nombre de parts, détail tranches, ITS annuel/mensuel, part employé (35%)/employeur (65%), salaire net, taux effectif
  - **UI** : Saisie à gauche, résultats à droite, formatage FCFA avec espaces
- **Ce qui manque** : Rien — simulateur complet
- **Réf. légale** : Art. 40 (CNSS 4%), Art. 41 (Frais 20%), Art. 116 (Barème ITS 2026)
- **Écran(s)** : `app/(app)/simulateur/its.tsx`, `lib/services/its.service.ts`

---

## 6. Simulateur IS (Minimum de perception)

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : 3 types de produits (exploitation, financiers, HAO) + retenues libératoires + toggle déficit 2 exercices
  - **Calcul** : Base = produits - retenues × 1% (ou 2% si déficit) = minimum annuel, divisé en 4 acomptes trimestriels
  - **Sorties** : Base imposable, taux appliqué, minimum annuel, 4 acomptes (15 mars, 15 juin, 15 sept, 15 déc)
- **Ce qui manque** : Rien
- **Réf. légale** : Art. 86B (base et taux), Art. 86C (échéances trimestrielles)
- **Écran(s)** : `app/(app)/simulateur/is.tsx`, `lib/services/is.service.ts`

---

## 7. Simulateur Patente

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : CA HT (N-1), régime (réel/forfaitaire/TPE/PE), mode stand-by (+ dernière patente), entités fiscales
  - **Calcul** : Barème progressif 10 tranches (0%-0,75%), réduction 50% (Art. 306), mode stand-by = 25% dernière patente puis -50%, arrondi au 10 FCFA
  - **Sorties** : Détail par tranche, patente brute, réductions, patente nette, montant par entité
- **Ce qui manque** : Rien
- **Réf. légale** : Art. 278 (Patente), Art. 306 (Barème), Art. 281 (Entités)
- **Écran(s)** : `app/(app)/simulateur/patente.tsx`, `lib/services/patente.service.ts`

---

## 8. Simulateur Solde de liquidation

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : Résultat fiscal, type de contribuable (général/microfinance/mines/étranger), 4 acomptes trimestriels
  - **Calcul** : Bénéfice arrondi < 1 000 × taux IS (28%/25%/28%/33%) - acomptes = solde
  - **Sorties** : IS calculé, total acomptes, solde à payer ou crédit d'impôt
- **Ce qui manque** : Rien
- **Réf. légale** : Art. 86A (taux IS), Art. 86C (acomptes), Art. 86G (solde)
- **Écran(s)** : `app/(app)/simulateur/solde-liquidation.tsx`, `lib/services/solde-liquidation.service.ts`

---

## 9. Simulateur Paie (Bulletin complet)

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **14 champs de saisie** répartis en 3 sections :
    - Rémunération de base : salaire de base, primes imposables, heures sup, congés annuels
    - Indemnités & primes : transport (exonéré), représentation (exonéré), panier, salissure
    - Avantages en nature (Art. 115) : logement, domesticité, électricité, voiture, téléphone, nourriture
  - **Toggle forfaitaire** : calcul automatique des avantages en nature selon taux CGI Art. 115
  - **3 profils** : National, Étranger résident (barème ITS), Non-résident (20% forfaitaire)
  - **Calcul complet** : CNSS 4%, ITS (barème ou 20%), TUS (7,5%/6%), TOL (5 000/1 000), CAMU (0,5% > 500k), taxe régionale (2 400)
  - **Charges patronales** : Vieillesse 8%, AF 10,03%, PF 2,25% avec plafonds
  - **Résultats** : bases de calcul, retenues salarié, salaire net, charges patronales, coût employeur, récap annuel, taux effectif
  - **33 tests unitaires** validés
- **Ce qui manque** : Rien
- **Réf. légale** : Art. 114-A (exonérations), Art. 115 (avantages nature), Art. 116 (barème ITS)
- **Écran(s)** : `app/(app)/simulateur/paie.tsx`, `lib/services/paie.service.ts`

---

## 10. Simulateur IRCM

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : Montant brut, type (dividendes/intérêts/plus-values)
  - **Calcul** : 15% (dividendes et intérêts), 10% (plus-values)
  - **Sorties** : IRCM à payer, montant net
- **Réf. légale** : Art. 103-110A
- **Écran(s)** : `app/(app)/simulateur/ircm.tsx`, `lib/services/ircm.service.ts`

---

## 11. Simulateur IRF Loyers

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : Loyers bruts annuels, type de locataire (personne morale/physique)
  - **Calcul** : IRF 9% flat, échéancier selon type de locataire
  - **Sorties** : IRF annuel/mensuel, net annuel/mensuel, échéances de paiement
- **Réf. légale** : Art. 111-113A
- **Écran(s)** : `app/(app)/simulateur/irf-loyers.tsx`, `lib/services/irf-loyers.service.ts`

---

## 12. Simulateur IBA

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : CA, charges déductibles, régime (réel/forfaitaire)
  - **Calcul** : Réel = (CA - charges) × 30% | Forfaitaire = barème progressif 4 tranches (8%-3%)
  - **Sorties** : Bénéfice imposable, IBA à payer, bénéfice net, taux effectif
- **Réf. légale** : Art. 93-95 (réel), Art. 96-101 (forfait)
- **Écran(s)** : `app/(app)/simulateur/iba.tsx`, `lib/services/iba.service.ts`

---

## 13. Simulateur TVA

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : CA HT, achats HT, type d'opération (taxable/exonérée/export)
  - **Calcul** : TVA collectée (18%) - TVA déductible (18%) = TVA due ou crédit
  - **Sorties** : Montant TTC, TVA collectée, TVA déductible, solde (TVA à reverser ou crédit)
- **Réf. légale** : TFNC6 Art. 1-40, Art. 461 bis LF 2026
- **Écran(s)** : `app/(app)/simulateur/tva.tsx`, `lib/services/tva.service.ts`

---

## 14. Simulateur IGF

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : CA annuel, type d'activité (commerce/services/artisanat)
  - **Calcul** : Barème progressif 7 tranches (0,05%-0,015%)
  - **Sorties** : IGF annuel, IGF trimestriel, détail par tranche
- **Réf. légale** : Art. 96-101
- **Écran(s)** : `app/(app)/simulateur/igf.tsx`, `lib/services/igf.service.ts`

---

## 15. Simulateur Enregistrement

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **11 types d'actes** : contrats (1%), marchés publics (2%), baux (3%), baux illimités (4%), cession bail (10%), mutations immo (8%), mutations immatriculation (2-3%), fonds commerce (10%), cessions actions (5%), ventes mobilières (4%), partages (1%)
  - **Calcul** : droits + centimes additionnels 5%
  - **Filtrage par catégorie** : contrats, baux, mutations, fonds/parts, divers
- **Réf. légale** : Tome 2, Livre 1, Art. 213-267, Art. 216 bis
- **Écran(s)** : `app/(app)/simulateur/enregistrement.tsx`, `lib/services/enregistrement.service.ts`

---

## 16. Simulateur Cession de parts

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Entrées** : Prix de cession, type (actions/participations pétrolières/changement de contrôle), flag contrat pétrolier
  - **Calcul** : 5% + centimes 5%, minimum 1 000 000 FCFA pour contrats pétroliers
- **Réf. légale** : Art. 214-215, Art. 216 bis
- **Écran(s)** : `app/(app)/simulateur/cession-parts.tsx`, `lib/services/cession-parts.service.ts`

---

## 17. Simulateur Contribution foncière

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **3 types** : bâti (CFPB), non bâti urbain, non bâti rural
  - **Bâti** : valeur locative × abattement 75% × taux communal (max 20%)
  - **Urbain non bâti** : 4 zones (125-6,25 F/m²) × abattement 50% × taux (max 40%)
  - **Rural non bâti** : hectares × forfait culture (600-2 000 F/ha) × taux (max 40%)
- **Réf. légale** : Art. 251-275
- **Écran(s)** : `app/(app)/simulateur/contribution-fonciere.tsx`, `lib/services/contribution-fonciere.service.ts`

---

## 18. Simulateur Retenue à la source

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **3 types** : non-résident (20%), non soumis IS (10%), Trésor public (10%)
  - **Sorties** : retenue + montant net à payer
- **Réf. légale** : Art. 86-D, Art. 183, TFNC4
- **Écran(s)** : `app/(app)/simulateur/retenue-source.tsx`, `lib/services/retenue-source.service.ts`

---

## 19. Assistant IA fiscal (Chat)

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Streaming SSE temps réel** : réponses mot par mot, pas d'attente
  - **5 types d'événements** : `conversation` (nouvel ID), `chunk` (texte), `citations` (articles sources), `done` (métadonnées), `error`
  - **Citations d'articles** : numéro d'article, titre, extrait, score de pertinence — affichées sous chaque réponse
  - **Historique des conversations** : panel latéral avec liste, chargement, suppression
  - **Quota** : vérification avant chaque message (nombre de questions/mois selon le plan)
  - **File d'attente offline** : messages stockés localement et envoyés au retour en ligne
  - **Recherche vocale** : bouton micro dans la barre de saisie (FR-FR)
  - **Modes sombre/clair** : intégré
- **Ce qui manque** :
  - Pas de recherche dans l'historique des conversations
  - Pas de partage de conversation
  - Pas d'export de conversation
- **Écran(s)** : `app/(app)/chat/index.tsx`, `components/chat/ChatInput.tsx`, `components/chat/MessageBubble.tsx`, `components/chat/StreamingBubble.tsx`, `lib/api/chat.ts`

---

## 20. Mode hors-ligne

- **Statut** : ⚠️ Partiellement implémenté
- **Ce qui marche** :
  - **Articles embarqués** : les 2 247 articles sont inclus dans le binaire de l'app (78 fichiers JSON, ~2,6 Mo) → consultables sans connexion
  - **Recherche d'articles** : fonctionne offline car les données sont locales
  - **Navigation arborescente** : fonctionne offline (données locales)
  - **Simulateurs** : tous fonctionnent offline (calculs 100% côté client)
  - **Détection online/offline** : hook `useOnlineStatus()` (Web: `navigator.onLine`, Mobile: polling 15s)
  - **File d'attente messages** : messages Chat stockés en AsyncStorage, envoyés au retour en ligne
  - **Bandeau offline** : affiché quand hors-ligne (« Mode hors-ligne — Le Code CGI et les simulateurs restent accessibles »)
- **Ce qui manque** :
  - ❌ Pas de Service Worker (la version web ne fonctionne pas offline pour le HTML/JS)
  - ❌ Les références croisées d'articles nécessitent internet (appel API)
  - ❌ Le Chat IA ne fonctionne pas offline (les messages sont mis en file d'attente mais pas de réponse)
  - ❌ Pas de téléchargement sélectif pour utilisation offline
- **Pour la vidéo** : démontrer en mode avion → articles, recherche et simulateurs fonctionnent. Le Chat met les messages en file d'attente. Éviter de montrer les références croisées (elles échoueront).
- **Écran(s)** : `lib/store/offlineQueue.ts`, `lib/hooks/useOnlineStatus.ts`, `lib/hooks/useOfflineSync.ts`

---

## 21. Inscription / Connexion / Authentification

- **Statut** : ✅ Implémenté — Production-ready
- **Ce qui marche** :
  - **Connexion** : email + mot de passe → token Bearer (mobile) ou cookie httpOnly (web)
  - **Inscription** : nom entreprise, pays (20+ listés, Congo actif), prénom, nom, email, téléphone, mot de passe
    - Vérification email en temps réel (doublons détectés)
    - Validation force mot de passe (12 car. min, majuscule, minuscule, chiffre)
    - Support token d'invitation
  - **MFA/2FA** : TOTP 6 chiffres (Google Authenticator, Authy) — écran dédié
  - **OTP email** : vérification par code 6 chiffres
  - **Mot de passe oublié** : flux email → code → nouveau mot de passe
  - **Session** : auto-refresh token, détection expiration, redirect login
  - **Stockage sécurisé** : `expo-secure-store` (mobile), httpOnly cookies (web)
  - **Se souvenir de moi** : persistance session
  - **Déconnexion tous appareils** : endpoint `/auth/logout-all`
- **Ce qui manque** :
  - Pas d'authentification biométrique (Face ID, empreinte)
  - Pas de connexion sociale (Google, Apple)
- **Écran(s)** : `app/(auth)/index.tsx`, `password.tsx`, `register.tsx`, `mfa-verify.tsx`, `verify-otp.tsx`, `forgot-password.tsx`, `reset-password.tsx`

---

## 22. Dashboard

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Salutation dynamique** : Bonjour/Bon après-midi/Bonsoir + nom utilisateur
  - **Statistiques clés** : 7 000+ articles, 14 simulateurs, 60+ TFNC, Édition 2026
  - **Échéances fiscales** : triées par proximité (15 mars IS T1, 15 juin T2, 15 sept T3, 15 déc T4, TVA/ITS mensuel, Patente avril, IRF mai/août/nov)
  - **Actions rapides** : Consulter CGI, Chat IA, Simulateurs, Organisations, Paramètres
  - **Layout mobile** : composant `HomeCards` avec grille de cartes
  - **Layout desktop** : colonnes avec stats, échéances, actions
- **Ce qui manque** :
  - Pas de notifications push
  - Pas de widget activité récente personnalisé
- **Écran(s)** : `app/(app)/index.tsx`, `components/mobile/HomeCards.tsx`

---

## 23. Gestion organisation / Rôles (Pro)

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Création d'organisation** : formulaire nom → API
  - **Membres** : liste avec badges rôle (OWNER, ADMIN, MEMBER, VIEWER)
  - **Invitations** : par email + rôle, liste des invitations en attente, annulation possible
  - **Rôles** :
    - OWNER : contrôle total (analytics, audit, suppression org, transfert propriété)
    - ADMIN : gestion membres et org
    - MEMBER : lecture + simulateurs
    - VIEWER : lecture seule
  - **Transfert de propriété** : OWNER peut transférer à un autre membre
  - **Gestion des sièges** : demande de sièges supplémentaires, suivi des demandes
  - **Organisation** : modifier nom, suppression douce (récupérable 30j), suppression définitive
  - **Permissions fines** : grant/revoke par permission, par utilisateur
- **Ce qui manque** : Rien de majeur
- **Écran(s)** : `app/(app)/organisation/index.tsx`, `components/organisation/` (OrgHeader, MemberList, InviteForm, PendingInvitations, DangerZone, SeatRequestSection)

---

## 24. Abonnement / Paywall

- **Statut** : ✅ Implémenté — Fonctionnel
- **Ce qui marche** :
  - **Plans** : FREE, STARTER, PROFESSIONAL, TEAM, ENTERPRISE
  - **Quota** : suivi questions IA par mois (utilisées/max/restantes)
  - **Barre de progression** : affichage visuel du quota
  - **Paywall** : blocage du chat à 100% du quota, avertissement à 80%
  - **Comparaison plans** : tableau des fonctionnalités par plan
  - **Actions** : activer, renouveler, upgrader
  - **Landing page paywall** : écran dédié avec tarifs et CTA
  - **Paiement** : renvoi vers Mobile Money (+242 05 379 99 59) + email preuve de paiement
- **Ce qui manque** :
  - ❌ Pas de paiement en ligne intégré (pas de Stripe, pas de Mobile Money API) — activation manuelle par l'équipe
- **Écran(s)** : `app/(app)/abonnement/index.tsx`, `components/abonnement/` (PlanHeader, QuotaProgress, PeriodInfo, PlansComparison, SubscriptionActions)

---

## 25. Paramètres (thème, langue, profil)

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Thème** : toggle sombre/clair (persisté, temps réel)
  - **Langue** : français (par défaut), infrastructure i18next prête pour d'autres langues
  - **Compte** : email (lecture), changement mot de passe (via flux email)
  - **Profil** : édition nom, prénom, téléphone, profession
  - **Activité** : questions ce mois, total, articles consultés, jours actifs, graphe 7 jours
  - **Liens management** : sécurité, organisation, permissions, invitations
  - **Actions** : déconnexion, déconnexion tous appareils
  - **Mentions légales** : CGU, politique de confidentialité, version app
- **Ce qui manque** : Rien de majeur
- **Écran(s)** : `app/(app)/parametres/index.tsx`, `components/parametres/` (SectionHeader, SettingsRow, ManagementLinks, ActivityStats)

---

## 26. Analytiques (organisation)

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **KPIs** : total questions, membres actifs, tendance (%), questions aujourd'hui/semaine/mois
  - **Graphe** : histogramme d'activité sur 7-90 jours (sélecteur de période)
  - **Table membres** : nom, email, nombre de questions, dernière activité (colonnes triables)
  - **Export CSV** : téléchargement du rapport avec filtres
  - **Accès** : OWNER uniquement
- **Ce qui manque** :
  - Pas de heatmap ou visualisations avancées
- **Écran(s)** : `app/(app)/analytics/index.tsx`, `components/analytics/` (PeriodSelector, MemberStatsTable)

---

## 27. Journal d'audit

- **Statut** : ✅ Implémenté — Pleinement fonctionnel
- **Ce qui marche** :
  - **Actions tracées** : LOGIN, LOGOUT, MFA_VERIFY, PASSWORD_RESET, ORG_CREATE/UPDATE/DELETE/INVITE, MEMBER_ADD/REMOVE/ROLE_CHANGE, PERMISSION_GRANT/REVOKE, PLAN_CHANGE/UPGRADE, MESSAGE_SENT, CONVERSATION_CREATED, ADMIN_ACTION, CONFIG_CHANGE
  - **Dashboard stats** : total logs, acteurs uniques, action la plus fréquente
  - **Filtrage** : par type d'action, par période, pagination (20/page)
  - **Détail** : historique complet d'une entité, diff avant/après, acteur + horodatage
  - **Export CSV** : avec filtres appliqués
  - **Nettoyage** : suppression des logs > N jours (configurable, OWNER uniquement)
  - **Accès** : OWNER (tout), ADMIN (lecture seule)
- **Ce qui manque** : Rien de majeur
- **Écran(s)** : `app/(app)/audit/index.tsx`, `components/audit/` (AuditToolbar, AuditStatsCards, ActionFilters, AuditLogItem, EntityHistoryModal)

---

## 28. Landing page (web)

- **Statut** : ✅ Implémenté — Web uniquement
- **Ce qui marche** :
  - **Hero** : titre accrocheur + description + CTA inscription
  - **Fonctionnalités** : grille de 14 features avec icônes et descriptions
  - **Pays** : carte d'expansion (Congo actif, autres « bientôt »)
  - **Tarifs** : comparaison des plans (FREE à ENTERPRISE)
  - **Footer** : liens légaux, CGU, confidentialité
  - **Responsive** : adaptée desktop et mobile
  - **Routing** : affichée sur `/` si non connecté (web), redirect auth sur mobile
- **Ce qui manque** :
  - Pas de témoignages clients
  - Pas de vidéo intégrée
- **Écran(s)** : `components/landing/` (LandingPage, LandingHeader, LandingHero, LandingFeatures, LandingCountries, LandingCTA, LandingFooter)

---

## 29. Sécurité

- **Statut** : ✅ Implémenté — Production-ready
- **Ce qui marche** :
  - Stockage sécurisé tokens (expo-secure-store mobile, httpOnly cookies web)
  - CSRF via cookies (web)
  - Auto-refresh token sur 401
  - Rate limiting par quota
  - Validation inputs tous les formulaires
  - Détection expiration session → redirect login
  - Audit de toutes les actions sensibles
  - RBAC : permissions par rôle dans l'organisation
  - HTTPS enforced (via env)
  - Monitoring Sentry (optionnel)
  - MFA/2FA TOTP
  - OTP email pour vérification
- **Écran(s)** : `app/(app)/securite/index.tsx` (QR code 2FA, backup codes, enable/disable, regenerate)

---

## 30. Calendrier fiscal

- **Statut** : ⚠️ Affiché sur le dashboard uniquement
- **Ce qui marche** :
  - Liste des échéances fiscales 2026 avec dates exactes, triées par proximité
  - 11 échéances : IS (×4 trimestres), TVA (mensuel), ITS (mensuel), Patente (annuel), IRPP (annuel), IRF (×3 échéances)
  - Badge visuel avec compte à rebours implicite
- **Ce qui manque** :
  - ❌ Pas d'écran calendrier dédié (vue mensuelle/annuelle)
  - ❌ Pas de notifications/rappels push
  - ❌ Pas d'intégration calendrier natif (Google Calendar, Apple Calendar)
  - ❌ Pas de personnalisation des échéances
- **Écran(s)** : Intégré dans `app/(app)/index.tsx` (dashboard)

---

## Résumé pour les vidéos

### Ce qui peut être montré tel quel (✅)

| # | Vidéo proposée | Fonctionnalité | Prêt ? |
|---|----------------|----------------|--------|
| 1 | Présentation générale NORMX Tax | Dashboard + toutes fonctionnalités | ✅ |
| 2 | Pourquoi j'ai créé CGI 242 | Landing page + dashboard | ✅ |
| 3 | CGI papier vs CGI 242 | Recherche + navigation + articles | ✅ |
| 4 | Offre fondateur | Paywall + plans + inscription | ✅ |
| 5 | Roadmap 2026-2027 | Landing page (pays « bientôt ») | ✅ |
| 6 | Rechercher un article en 3 sec | Recherche plein texte | ✅ |
| 7 | Recherche vocale | Micro dans le Chat IA | ⚠️ Montrer dans le Chat, pas dans le Code |
| 8 | Simulateur ITS | Simulateur complet | ✅ |
| 9 | Simulateur IS | Simulateur complet | ✅ |
| 10 | Simulateur Patente | Simulateur complet | ✅ |
| 11 | Simulateur Solde liquidation | Simulateur complet | ✅ |
| 12 | Mode hors-ligne | Articles + recherche + simulateurs offline | ⚠️ Éviter de montrer Chat et références croisées |
| 13 | Question fiscale à l'IA | Chat streaming + citations | ✅ |
| 14 | 5 questions testées sur l'IA | Chat avec historique | ✅ |
| 15 | IA vs fiscaliste | Chat + citations d'articles | ✅ |
| 16 | 5 erreurs fiscales courantes | Éducatif (pas de fonctionnalité spécifique) | ✅ |
| 17 | Calendrier fiscal 2026 | Dashboard échéances | ⚠️ Pas de vue calendrier dédiée, montrer le dashboard |
| 18 | Nouveautés LF 2026 | Articles CGI + recherche | ✅ |
| 19 | Comment calculer la Patente | Simulateur Patente pas à pas | ✅ |
| 20 | ITS : comprendre le bulletin de paie | Simulateur Paie (nouveau) | ✅ |

### Points d'attention pour les scripts

1. **Recherche vocale** : disponible dans le Chat uniquement. La vidéo devrait montrer « Posez votre question fiscale à voix haute dans le Chat IA », pas « Recherchez un article à la voix ».
2. **Mode hors-ligne** : démontrer articles, recherche et simulateurs. Ne PAS montrer le Chat (file d'attente seulement) ni les références croisées.
3. **Calendrier fiscal** : montrer la section échéances du dashboard, pas un écran calendrier dédié (il n'existe pas).
4. **Paiement** : le paiement est manuel (Mobile Money + preuve par email). Pas de paiement en ligne intégré.
5. **Nombre d'articles** : 2 247 articles dans 78 fichiers. La communication peut dire « 7 000+ articles » si on compte les subdivisions et alinéas.
6. **14 simulateurs** : tous fonctionnels, y compris le nouveau simulateur Paie.

---

## Stack technique

| Couche | Technologie |
|--------|------------|
| Framework | React Native 0.81, Expo 54 |
| Routing | Expo Router 6 (file-based) |
| Langage | TypeScript 5.9 |
| État | Zustand 5 + persistence |
| API | Axios 1.13 |
| Styling | NativeWind 4 + TailwindCSS |
| Auth | expo-secure-store + httpOnly cookies |
| i18n | i18next 25.8 |
| Monitoring | Sentry 7.2 |
| Voix | expo-speech-recognition 3.1 |
| TTS | expo-speech |
| Tests | Jest 29.7 (74 tests, 6 suites) |
| Plateformes | iOS, Android, Web |
