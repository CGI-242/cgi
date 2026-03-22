# NORMX Tax (CGI-242) — Rapport de mise en production

**Date** : 22 mars 2026
**URL** : https://tax.normx-ai.com
**Landing** : https://normx-ai.com
**Repo** : https://github.com/CGI-242/cgi

---

## 1. Infrastructure

| Element | Statut |
|---------|--------|
| Domaine `tax.normx-ai.com` | En production |
| Domaine `normx-ai.com` | Landing page en production |
| SSL Let's Encrypt | Actif (2 domaines) |
| Docker (API + Nginx + PostgreSQL + Qdrant) | Operationnel, tous containers healthy |
| CI/CD GitHub Actions | Deploy auto a chaque push sur main |
| Nginx reverse proxy | Docker, gzip level 6, headers securite, CSP |
| Nginx healthcheck | curl (corrige depuis wget) |
| VPS | OVH `51.83.75.203` (Ubuntu) |
| Qdrant | v1.17.0 (upgrade depuis v1.14.0 — match client SDK) |
| Backup PostgreSQL | Cron quotidien 3h, retention 30 jours, gzip (~236 Ko) |
| Monitoring uptime | Health-check cron 5min (API, Nginx, containers, disque, RAM) + auto-restart |
| Monitoring erreurs | Sentry |
| Cloudflare | DNS, CDN, cache, Turnstile CAPTCHA |

---

## 2. Donnees CGI 2026

| Element | Statut |
|---------|--------|
| 154 fichiers JSON | Synchronises mobile / server / data |
| 2 181 articles en vigueur | Comptage verifie (54 abroges exclus) |
| 2 371 articles indexes | Qdrant reindexe le 22 mars (Voyage AI 1024d) |
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
- Recherche se vide automatiquement au clic sommaire (desktop + mobile)
- Elements abroges grises dans le sommaire
- Noeuds doublons corriges (42 chapitres avec section unique)
- Anti-copie natif : `selectable={false}` sur tous les articles

### 3.2 Chat IA fiscal (RAG) — 36 agents specialises
- Modele : Claude Sonnet (Anthropic SDK)
- Recherche hybride : Qdrant 2 371 points (vectoriel Voyage AI 1024d) + mots-cles
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
  - Nouveaux : NIU, BVMAC, Retenue Tresor, Attestation fiscale, Zones speciales, Echange renseignements, Annexes
  - Fallback : Agent General

### 3.3 Simulateurs fiscaux (16)
- ITS, IS, TVA, Patente, IRCM, IRF, IBA, IGF, Enregistrement, Cession de parts, Contribution fonciere, Paie, Retenue a la source, Taxe immobiliere, Solde de liquidation, IS Parapetrolier
- Gating par plan : STARTER = 5 simulateurs de base (ITS, TVA, IS, Paie, Patente), PROFESSIONAL+ = 16
- Cadenas visuel + toast sur les simulateurs non inclus

### 3.4 Audit Documents
- 5 types : Facture, Releve bancaire, Bon de commande/Contrat, DAS II, Note de frais
- Analyse par Claude (multimodal : PDF + images)
- Verification conformite linguistique (Art. 373 ter)
- Validation taux TVA (Art. 22, Annexes 3 et 5)
- Verification mentions obligatoires (Art. 32)
- Detection SFEC (QR code, NIM, signature DGID)
- Distinction assujetti TVA / forfait (Art. 5, 96)
- Sanctions conformes CGI : 2M FCFA langue, 10K FCFA NIU, 50M FCFA SFEC
- Historique des audits en base de donnees
- Quota audits par plan (FREE: 3 total, STARTER: 10/mois, etc.) avec middleware checkAuditQuota

### 3.5 Calendrier fiscal
- Echeances mensuelles + annuelles (Art. 461 bis LF 2026)
- Notifications badge + panneau modal
- Jours restants avant chaque echeance

### 3.6 Push Notifications
- Expo Push Notifications (Android + iOS)
- Canaux Android : "Echeances fiscales" (HIGH) + "General" (DEFAULT)
- Rappels automatiques :
  - Echeances fiscales : tous les 2 jours avant + jour J
  - Abonnement expirant : J-30, J-7, J-1, Jour J (email + push)
  - Demandes de sieges (admin)
- Navigation directe depuis notification vers ecran concerne
- Nettoyage auto tokens invalides (DeviceNotRegistered) + receipts Expo
- Nettoyage hebdomadaire tokens obsoletes (>90 jours)
- Unregister au logout
- Routes : POST /register, DELETE /unregister, GET /devices, POST /test

### 3.7 Authentification et securite
- Login email + mot de passe
- OTP par email (verification)
- JWT (access + refresh tokens)
- MFA (TOTP + codes de secours)
- Sessions securisees (cookies HttpOnly, SameSite strict)
- Rate limiting (auth, chat, sensible, global)
- CORS configure
- Turnstile (CAPTCHA Cloudflare)
- Protection anti-replay refresh token
- Verrouillage compte apres 5 tentatives (15 min)

### 3.8 Securite anti-copie et anti multi-device
- **Anti-copie web** : clic droit bloque, Ctrl+C/A/S/P bloque, F12 bloque, DevTools bloque, selection texte impossible (CSS), drag bloque, impression bloquee (@media print)
- **Anti-copie natif** : `selectable={false}` sur tous les `<Text>` des articles
- **Session unique par email** : login revoque tous les tokens precedents
- **Heartbeat session (60s)** : detection en temps reel si le token est revoque → deconnexion immediate avec modal "Connexion depuis un autre appareil"

### 3.9 Abonnement et tarifs
- 5 plans (prix par user/an) :
  - FREE : 7 jours essai, 5 questions, 3 audits, 16 simulateurs
  - STARTER : 69€/user/an, 15q/mois, 10 audits/mois, 5 simulateurs de base
  - PROFESSIONAL : 149€/user/an, 30q/mois, 30 audits/mois, 16 simulateurs
  - TEAM : 299€/user/an, 200q/mois, 100 audits/mois, organisation 5 membres, analytics
  - ENTERPRISE : 500€+/user/an, sur devis, membres illimites, API
- Packs add-on : Questions (9-69€ pour 10-150q) + Audits (9-69€ pour 10-150 docs)
- Routes admin : credit-questions, credit-audits (apres paiement Mobile Money)
- Remises volume sieges : -10% (3+), -15% (5+), -20% (10+)
- Paywall avec formulaire de contact integre (objet + message → facturation@normx-ai.com via SMTP)
- Rappels expiration par email + push

### 3.10 Organisation / Multi-utilisateurs
- Invitations par email
- Roles : OWNER, ADMIN, MEMBER
- Permissions par module
- Jusqu'a 50 membres par organisation
- Demandes de sieges supplementaires + tarification en euros
- Transfert de propriete
- Suppression douce (30j) + permanente
- Audit trail complet (qui, quoi, quand, IP)
- Middleware requireOrganizationFeature (TEAM+ requis)

### 3.11 Analytics
- Tableau de bord : questions totales, tendance, membres actifs, ce mois
- Temps de reponse IA (moyen, min, tokens/reponse)
- Usage par fonctionnalite (chat / recherche / audit) avec barre de repartition
- Recherches populaires top 10
- Activite par jour (graphique barres 14 jours)
- Stats par membre (messages, recherches, dernier login)
- Export CSV
- Middleware requireAnalyticsFeature (TEAM+ requis)

### 3.12 Interface et branding
- Theme : Light (defaut blanc) / Dark (bleu #1A3A5C) — fonctionne sur login, register, app
- Polices : Outfit (corps) + Playfair Display (titres) via Google Fonts
- Header bleu #1A3A5C uniforme (style Normx)
- Sidebar blanche, texte bleu, actif beige/gold (style Normx)
- Barre d'onglets en bas (style Normx)
- i18n : Francais + Anglais
- Responsive : Desktop + Tablette + Mobile
- Calculatrice flottante
- **Logo N dore** : favicon (no-cache nginx + Cloudflare), icon, splash, adaptive-icon
- Palette : Bleu nuit #1A3A5C + Or #D4A843
- Bundle web 6.3 Mo compresse a ~1 Mo via gzip level 6

---

## 4. Fonctionnalites en attente

### 4.1 Priorite haute

| Fonctionnalite | Detail |
|----------------|--------|
| Paiement en ligne | Pas de provider (Stripe, PayDunya). Formulaire contact + Mobile Money en attendant |
| SFEC validation avancee | Detection QR code/NIM basee sur l'absence visuelle, pas de decodage |

### 4.2 Priorite moyenne

| Fonctionnalite | Detail |
|----------------|--------|
| Export PDF audit | Generer un rapport PDF telechargeable du resultat d'audit |
| Code Social / Douanier / Hydrocarbures | Affiches comme "Bientot" — donnees non integrees |
| App mobile native | Build EAS Android v1.0.0 (versionCode 5) pret — a publier sur Google Play |

### 4.3 Priorite basse

| Fonctionnalite | Detail |
|----------------|--------|
| Annotations CGI | Permettre aux utilisateurs d'annoter les articles |
| Comparaison LF 2025 vs 2026 | Mettre en evidence les articles modifies |
| Mode examen/quiz | QCM sur le CGI pour la formation |

### 4.4 Fait (anciennement en attente)

| Fonctionnalite | Fait le |
|----------------|---------|
| ~~Push notifications~~ | 21 mars — Expo Push complet, channels, rappels fiscaux + abo |
| ~~Reindexation Qdrant~~ | 22 mars — 2 371 points (Voyage AI), tome1 regenere |
| ~~Tableau de bord analytics~~ | 22 mars — temps reponse, usage features, recherches populaires |
| ~~Monitoring uptime~~ | 22 mars — health-check cron 5min + auto-restart containers |
| ~~Backup PostgreSQL~~ | 22 mars — cron quotidien 3h, retention 30 jours, gzip |
| ~~Grille tarifaire 5 plans~~ | 22 mars — FREE/STARTER/PROFESSIONAL/TEAM/ENTERPRISE |
| ~~Quota audits~~ | 22 mars — middleware checkAuditQuota par plan |
| ~~Gating simulateurs~~ | 22 mars — STARTER limite a 5 simulateurs de base |
| ~~Gating analytics~~ | 22 mars — TEAM+ requis |
| ~~Fix theme dark/light auth~~ | 22 mars — login + register utilisent colors du theme |
| ~~Fix recherche sommaire~~ | 22 mars — recherche se vide au clic sommaire (desktop + mobile) |
| ~~Formulaire contact paywall~~ | 22 mars — objet + message → facturation@normx-ai.com |
| ~~Anti-copie + heartbeat~~ | 22 mars — web + natif + session 60s |
| ~~Favicon no-cache~~ | 22 mars — nginx + Cloudflare purge |
| ~~Gzip optimise~~ | 22 mars — level 6, bundle 6.3 Mo → ~1 Mo |

---

## 5. Points d'attention

- **Certificat SSL** : permissions privkey corrigees (chmod 640), a surveiller au renouvellement
- **Nginx systeme** : desactive, seul Docker nginx tourne
- **node_modules VPS** : souvent corrompu, necessite `sudo rm -rf node_modules && npm install` avant build
- **Google Play** : AAB v1.0.0 (versionCode 5) pret mais non publie. Necessite service account JSON pour `eas submit`

---

## 6. Changelog 21-22 mars 2026

| Date | Changement |
|------|-----------|
| 21 mars | Push notifications complet (Expo Push, channels Android, listeners, unregister, receipts) |
| 21 mars | 9 agents specialises ajoutes — couverture CGI 100% (27 → 36 agents) |
| 21 mars | Migration Prisma `push_tokens` appliquee en prod |
| 21 mars | Upgrade Qdrant v1.14 → v1.17 |
| 22 mars | Logo NT Midjourney teste puis restaure au N dore (favicon, icon, splash) |
| 22 mars | Correction nombre articles : 2 263 → 2 181 (en vigueur uniquement) |
| 22 mars | Correction LandingStats : 14 → 16 simulateurs |
| 22 mars | Fix noeuds doublons arbre CGI (42 chapitres) |
| 22 mars | Grille tarifaire 5 plans : FREE/STARTER/PROFESSIONAL/TEAM/ENTERPRISE (en euros/user/an) |
| 22 mars | Packs add-on questions + audits avec routes admin credit |
| 22 mars | Anti-copie web (clic droit, Ctrl+C, selection, impression, DevTools) |
| 22 mars | Heartbeat session anti multi-device (detection 60s) |
| 22 mars | README YouTube avec palette Midjourney et 12 scenarios videos |
| 22 mars | Reindexation Qdrant complete : 2 371 points (tome1.json regenere) |
| 22 mars | Analytics enrichi : temps reponse IA, usage par feature, recherches populaires |
| 22 mars | Middleware checkAuditQuota, requireAnalyticsFeature, requireOrganizationFeature |
| 22 mars | Gating simulateurs STARTER (cadenas + toast) |
| 22 mars | Formulaire contact integre au paywall (objet + message → SMTP) |
| 22 mars | Fix theme dark/light pages login + register (couleurs hardcodees → useTheme) |
| 22 mars | Fix recherche sommaire (desktop + mobile — debounce + handleSelect) |
| 22 mars | Favicon no-cache nginx + Cloudflare purge + favicon.png normx-ai.com |
| 22 mars | Nginx gzip level 6 : bundle 6.3 Mo → ~1 Mo compresse |
| 22 mars | Fix healthcheck nginx : wget → curl |
| 22 mars | Backup PostgreSQL : cron quotidien 3h, retention 30 jours |
| 22 mars | Monitoring uptime : health-check cron 5min, auto-restart containers |
| 22 mars | Build EAS Android v1.0.0 (versionCode 5) — AAB pret |

---

## 7. Crons en production

| Cron | Frequence | Script | Action |
|------|-----------|--------|--------|
| Health check | 5 min | `/opt/cgi242/scripts/health-check.sh` | API, Nginx, containers, disque, RAM + auto-restart |
| Backup PostgreSQL | 3h/jour | `/opt/cgi242/scripts/backup-postgres.sh` | pg_dump gzip → `/opt/cgi242/backups/`, retention 30j |
| Docker cleanup | Dimanche 3h | inline cron | `docker system prune -af --filter until=168h` |
| Rappels fiscaux | 8h/jour | `reminder.service.ts` (in-app) | Email + push echeances + abonnements |
| Nettoyage tokens push | Dimanche | `push.service.ts` (in-app) | Suppression tokens > 90 jours |

---

## 8. Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | Expo (React Native) + expo-router |
| Backend | Node.js / Express / TypeScript |
| Base de donnees | PostgreSQL + Prisma ORM |
| Base vectorielle | Qdrant v1.17.0 (2 371 points, Voyage AI 1024d) |
| Embeddings | Voyage AI `voyage-multilingual-2` |
| IA Chat | Claude Sonnet (Anthropic SDK) |
| IA Audit | Claude (multimodal PDF/images) |
| Reverse proxy | Nginx (Docker, gzip level 6) |
| CI/CD | GitHub Actions (deploy SSH) |
| Hebergement | OVH VPS |
| DNS/CDN | Cloudflare |
| Email | OVH SMTP (ssl0.ovh.net:465) |
| CAPTCHA | Cloudflare Turnstile |
| Push | Expo Push Notifications |
| Monitoring | Sentry + health-check cron |
| Backup | pg_dump cron + gzip |

---

## 9. Utilisateurs en base (22 mars 2026)

| Email | Plan | Statut | Expire |
|-------|------|--------|--------|
| contact@normx-ai.com | FREE | ACTIVE | 31/12/2099 |
| mecene04@gmail.com | FREE | ACTIVE | 22/04/2026 |
| sanahygieneservices@gmail.com | FREE | ACTIVE | 19/04/2026 |

*3 utilisateurs, 0 abonnements payants*
