# NORMX Tax (CGI-242) — Rapport de mise en production

**Date** : 22 mars 2026
**URL** : https://tax.normx-ai.com
**Repo** : https://github.com/CGI-242/cgi

---

## 1. Infrastructure

| Element | Statut |
|---------|--------|
| Domaine `tax.normx-ai.com` | En production |
| SSL Let's Encrypt | Actif |
| Docker (API + Nginx + PostgreSQL + Qdrant) | Operationnel |
| CI/CD GitHub Actions | Fonctionnel (deploy auto a chaque push) |
| Nginx reverse proxy | Actif, headers securite, CSP |
| VPS | OVH `51.83.75.203` (Ubuntu) |
| Qdrant | v1.17.0 (mis a jour depuis v1.14.0 — match client SDK) |

---

## 2. Donnees CGI 2026

| Element | Statut |
|---------|--------|
| 154 fichiers JSON | Synchronises mobile / server / data |
| 2 181 articles en vigueur | Comptage verifie (54 abroges exclus du comptage affiche) |
| Tome 1 (IS, IBA, IRCM, IRF, ITS, Dispositions communes) | Complet — 691 articles |
| Tome 2 (Enregistrement, Timbre, Mutations, Foncier, Successions) | Complet — 632 articles |
| TFNC 2-5 (Textes non codifies) | Complet — 567 articles |
| TFNC 6 TVA (Chapitres 1-5 + Annexes) | Verifie page par page contre PDF — 46 articles |
| Conventions fiscales (CEMAC, France, Italie, Rwanda, Maurice, Chine) | Complet — 189 articles |
| Mots-cles | Enrichis (moyenne 5-7 mc/article), articles abroges nettoyes |

---

## 3. Fonctionnalites en production

### 3.1 Code numerique CGI
- Sommaire arborescent (Tome 1, Tome 2, TFNC, Conventions)
- Affichage mode livre (ChapterReader) pour tous les chapitres
- Recherche globale par mots-cles + recherche vocale
- Elements abroges grises dans le sommaire
- Noeuds doublons corriges (42 chapitres avec section unique)
- Anti-copie : `selectable={false}` sur tous les articles (natif)

### 3.2 Chat IA fiscal (RAG) — 36 agents specialises
- Modele : Claude Sonnet (Anthropic SDK)
- Recherche hybride : Qdrant (vectoriel) + mots-cles
- Streaming SSE des reponses
- Citations avec extraits des articles
- Historique des conversations
- Dictee vocale (Speech Recognition Chrome/Edge)
- **36 agents specialises** couvrant 100% du CGI :
  - Tome 1 : IS, ITS, IBA, IRCM/IRF, Prix de transfert, Entites etrangeres, Dispositions communes, Taxes diverses, Obligations diverses
  - Tome 2 : Enregistrement/Timbre
  - TFNC : TVA, Petrole/Mines, Code Hydrocarbures, TVA Petrole Amont, Taxes speciales, Douanes
  - Procedures : Sanctions, Contentieux, Recouvrement, Emission des roles
  - Impots locaux : Obligatoires, Facultatifs, Centimes additionnels
  - Transversal : Calendrier fiscal, Incitations/Exonerations, Immobilier, Conventions
  - Nouveaux (22 mars) : NIU, BVMAC, Retenue Tresor, Attestation fiscale, Zones speciales, Echange renseignements, Annexes/textes non codifies
  - Fallback : Agent General

### 3.3 Simulateurs fiscaux (16)
ITS, IS, TVA, Patente, IRCM, IRF, IBA, IGF, Enregistrement, Cession de parts, Contribution fonciere, Paie, Retenue a la source, Taxe immobiliere, Solde de liquidation, IS Parapetrolier

### 3.4 Audit Documents
- 5 types : Facture, Releve bancaire, Bon de commande/Contrat, DAS II, Note de frais
- Analyse par Claude (multimodal : PDF + images)
- Verification conformite linguistique (Art. 373 ter)
- Validation taux TVA (Art. 22, Annexes 3 et 5)
- Verification mentions obligatoires (Art. 32)
- Detection SFEC (QR code, NIM, signature DGID)
- Distinction assujetti TVA / forfait (Art. 5, 96)
- Sanctions conformes CGI : 2M FCFA langue, 10K FCFA NIU, 50M FCFA SFEC
- Formats Congo : NIU 16/17 chars, RCCM OHADA, UGE/UME/UPPTE
- Historique des audits en base de donnees

### 3.5 Calendrier fiscal
- Echeances mensuelles + annuelles (Art. 461 bis LF 2026)
- Notifications badge + panneau modal
- Jours restants avant chaque echeance
- Push notifications rappels (J-5, J-3, J-1, Jour J)

### 3.6 Push Notifications (NOUVEAU — 21 mars)
- Expo Push Notifications (Android + iOS)
- Canaux Android : "Echeances fiscales" (HIGH) + "General" (DEFAULT)
- Rappels automatiques :
  - Echeances fiscales : tous les 2 jours avant + jour J
  - Abonnement expirant : J-30, J-7, J-1, Jour J (email + push)
  - Demandes de sieges (admin)
- Navigation directe depuis notification vers ecran concerne
- Nettoyage auto tokens invalides (DeviceNotRegistered)
- Verification receipts Expo (15 min apres envoi)
- Nettoyage hebdomadaire tokens obsoletes (>90 jours)
- Routes : POST /register, DELETE /unregister, GET /devices, POST /test
- Migration Prisma `push_tokens` appliquee en prod
- Unregister au logout

### 3.7 Authentification et securite
- Login email + mot de passe
- OTP par email (verification)
- JWT (access + refresh tokens)
- MFA (authentification multi-facteurs TOTP + codes de secours)
- Sessions securisees (cookies HttpOnly, SameSite strict)
- Rate limiting (auth, chat, sensible, global)
- CORS configure
- Turnstile (CAPTCHA Cloudflare)
- Protection anti-replay refresh token
- Verrouillage compte apres 5 tentatives (15 min)

### 3.8 Securite anti-copie et anti multi-device (NOUVEAU — 22 mars)
- **Anti-copie web** : clic droit bloque, Ctrl+C/A/S/P bloque, F12 bloque, DevTools bloque, selection texte impossible (CSS), drag bloque, impression bloquee (@media print)
- **Anti-copie natif** : `selectable={false}` sur tous les `<Text>` des articles
- **Session unique par email** : login revoque tous les tokens precedents
- **Heartbeat session (60s)** : detection en temps reel si le token est revoque → deconnexion immediate avec modal "Connexion depuis un autre appareil"
- Route `GET /auth/heartbeat` pour verification session

### 3.9 Abonnement et tarifs (MIS A JOUR — 22 mars)
- 5 plans (prix par user/an) :
  - FREE : 7 jours essai, 5 questions, 3 audits, 16 simulateurs
  - STARTER : 69€/user/an, 15q/mois, 10 audits/mois, 5 simulateurs de base
  - PROFESSIONAL : 149€/user/an, 30q/mois, 30 audits/mois, 16 simulateurs
  - TEAM : 299€/user/an, 200q/mois, 100 audits/mois, organisation 5 membres, analytics
  - ENTERPRISE : 500€+/user/an, sur devis, membres illimites, API
- Packs add-on : Questions (9-69€ pour 10-150q) + Audits (9-69€ pour 10-150 docs)
- Remises volume sieges : -10% (3+), -15% (5+), -20% (10+)
- Paywall pour les utilisateurs expires
- Rappels expiration par email + push

### 3.10 Organisation / Multi-utilisateurs
- Invitations par email
- Roles : OWNER, ADMIN, MEMBER
- Permissions par module (fin)
- Jusqu'a 50 membres par organisation
- Demandes de sieges supplementaires + tarification
- Transfert de propriete
- Suppression douce (30j) + permanente
- Audit trail complet (qui, quoi, quand, IP)
- Analytics par membre + export CSV

### 3.11 Interface et branding (MIS A JOUR — 22 mars)
- Theme : Light (defaut blanc) / Dark (bleu #1A3A5C)
- Polices : Outfit (corps) + Playfair Display (titres) via Google Fonts
- Header bleu #1A3A5C uniforme (style Normx)
- Sidebar blanche, texte bleu, actif beige/gold (style Normx)
- Barre d'onglets en bas (style Normx)
- i18n : Francais + Anglais
- Responsive : Desktop + Tablette + Mobile
- Calculatrice flottante
- **Logo N dore** : favicon, icon, splash, adaptive-icon (NT Midjourney teste puis restaure au N)
- Palette : Bleu nuit #1A3A5C + Or #D4A843

---

## 4. Fonctionnalites en attente

### 4.1 Priorite haute

| Fonctionnalite | Detail |
|----------------|--------|
| Paiement en ligne | Pas de provider connecte (Stripe, PayDunya). Formulaire contact integre au paywall |
| SFEC validation avancee | Detection QR code/NIM basee sur l'absence visuelle, pas de decodage |

### 4.2 Priorite moyenne

| Fonctionnalite | Detail |
|----------------|--------|
| Export PDF audit | Generer un rapport PDF telechargeable du resultat d'audit |
| Code Social / Douanier / Hydrocarbures | Affiches comme "Bientot" — donnees non integrees |
| App mobile native | Build Expo sur Google Play existe mais pas a jour — necessaire apres changements tarifs/plans |

### 4.3 Fait (anciennement en attente)

| Fonctionnalite | Fait le |
|----------------|---------|
| ~~Push notifications~~ | 21 mars — Expo Push complet, channels, rappels fiscaux + abo |
| ~~Reindexation Qdrant~~ | 22 mars — 2371 points reindexes (Voyage AI), TVA corrigee |
| ~~Tableau de bord analytics~~ | 22 mars — temps reponse IA, usage par feature, recherches populaires |
| ~~Monitoring~~ | Sentry + health-check cron 5min (API, Nginx, containers, disque, RAM) + auto-restart |
| ~~Backup PostgreSQL~~ | 22 mars — cron quotidien 3h, retention 30 jours, compression gzip |

### 4.3 Priorite basse

| Fonctionnalite | Detail |
|----------------|--------|
| Annotations CGI | Permettre aux utilisateurs d'annoter les articles |
| Comparaison LF 2025 vs 2026 | Mettre en evidence les articles modifies |
| Mode examen/quiz | QCM sur le CGI pour la formation |
| Monitoring/alerting | Sentry configure mais pas d'uptime monitoring |

---

## 5. Points d'attention

- **Bundle web 6.3 Mo** : compresse a ~1 Mo via gzip niveau 6 (nginx). 154 JSON embarques, ratio compression ~85%
- **Certificat SSL** : permissions privkey corrigees (chmod 640), a surveiller au renouvellement
- **Nginx systeme** : desactive, seul Docker nginx tourne
- **node_modules VPS** : souvent corrompu, necessie `sudo rm -rf node_modules && npm install` avant build
- **Qdrant** : mis a jour v1.14 → v1.17 pour matcher le client SDK

---

## 6. Changelog 21-22 mars 2026

| Date | Changement |
|------|-----------|
| 21 mars | Push notifications complet (Expo Push, channels Android, listeners, unregister, receipts) |
| 21 mars | 9 agents specialises ajoutes (NIU, BVMAC, Retenue Tresor, Attestation, TVA Petrole, Zones speciales, Echange renseignements, Code Hydrocarbures, Annexes) — couverture CGI 100% |
| 21 mars | Migration Prisma `push_tokens` appliquee en prod |
| 21 mars | Upgrade Qdrant v1.14 → v1.17 |
| 22 mars | Nouveau logo NT (Midjourney) : favicon, icon, splash, adaptive-icon |
| 22 mars | Correction nombre articles : 2 263 → 2 181 (en vigueur uniquement) |
| 22 mars | Correction LandingStats : 14 → 16 simulateurs |
| 22 mars | Fix noeuds doublons arbre CGI (42 chapitres) |
| 22 mars | Nettoyage tarifs : suppression prix lancement expires, correction 65€ → XAF |
| 22 mars | 3 plans tarifs : FREE / BASIQUE 75 000 XAF / PRO 115 000 XAF |
| 22 mars | Anti-copie web (clic droit, Ctrl+C, selection, impression, DevTools) |
| 22 mars | Heartbeat session anti multi-device (detection 60s) |
| 22 mars | README YouTube avec palette Midjourney et 12 scenarios videos |
| 22 mars | Container Docker fantome nettoye (fix CI/CD) |

---

## 7. Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | Expo (React Native) + expo-router |
| Backend | Node.js / Express / TypeScript |
| Base de donnees | PostgreSQL + Prisma ORM |
| Base vectorielle | Qdrant v1.17.0 (RAG) |
| Embeddings | Voyage AI (1024 dims) |
| IA | Claude Sonnet (Anthropic SDK) |
| Reverse proxy | Nginx (Docker) |
| CI/CD | GitHub Actions |
| Hebergement | OVH VPS |
| DNS/CDN | Cloudflare |
| Email | OVH SMTP (ssl0.ovh.net:465) |
| CAPTCHA | Cloudflare Turnstile |
| Push | Expo Push Notifications |
| Monitoring | Sentry |
