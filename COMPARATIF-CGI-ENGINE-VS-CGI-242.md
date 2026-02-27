# Comparatif cgi-engine vs cgi-242

## Contexte

`cgi-engine` est la plateforme SaaS complete deployee sur VPS (`cgi242.normx-ai.com`).
`cgi-242` est la nouvelle app mobile/web Expo avec un serveur minimaliste.

Ce rapport identifie tout ce qui manque a cgi-242 avant de pouvoir remplacer cgi-engine.

---

## 1. IA / Chat (coeur du produit)

| Fonctionnalite                           | cgi-engine                                                                              | cgi-242                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Chat IA                                  | OpenAI + Claude + Qdrant (RAG)                                                          | Claude Haiku 4.5 + Qdrant (RAG)                    |
| Embeddings vectoriels                    | OpenAI text-embedding-3-small (1536 dims)                                               | Voyage AI voyage-multilingual-2 (1024 dims)        |
| Recherche hybride (keyword + semantique) | Qdrant + PostgreSQL + Redis                                                             | Qdrant + PostgreSQL + cache in-memory              |
| Pipeline hybride 5 etapes                | checkDirectMappings → routingRules → keywordMatches → vectorSearch → merge+priority | Identique (copie complete)                         |
| Mappings keyword directs                 | 80+ mappings                                                                            | 80+ mappings (copie)                               |
| Regles de routage contextuel             | 12 regles                                                                               | 12 regles (copie)                                  |
| Recherche par chapitre (factory)         | 8 factories (IRPP, IS, IBA, DC, TD, DD, PV, IL)                                         | 8 factories (copie)                                |
| Streaming SSE des reponses               | `chat.streaming.controller.ts`                                                        | `routes/chat.ts` + `chat.service.ts` (SSE)     |
| Event citations SSE                      | Oui                                                                                     | Oui                                                |
| Historique conversations                 | BDD (Conversation, Message)                                                             | BDD (Conversation, Message) via Prisma             |
| Citations dans les messages              | `citations Json?` dans Message                                                        | `citations Json?` dans Message                   |
| Multi-agent orchestration                | `orchestrator/`, `agents/`                                                          | Absent                                             |
| Prompts fiscaux specialises              | `chat.prompts.ts`                                                                     | `chat.prompts.ts` (statique + RAG avec contexte) |
| Detection salutations                    | Non                                                                                     | `isSimpleGreeting()` → prompt simplifie         |
| Routage intelligent par chapitre         | `hybrid-search.routing.ts`                                                            | `hybrid-search.routing.ts` (copie)               |
| Fallback si Qdrant down                  | Non                                                                                     | Oui (connaissances statiques dans le prompt)       |
| Ingestion articles                       | `ingest-articles.ts` + Redis                                                          | `ingest-articles.ts` + cache in-memory           |
| Logger                                   | Winston + rotation fichiers                                                             | Winston (console coloree dev, JSON prod)           |

### Fichiers cgi-242

- `server/src/services/chat.service.ts` — RAG hybride + Claude + gestion conversations
- `server/src/services/chat.prompts.ts` — Prompts fiscaux (statique + `buildContextPrompt()` RAG)
- `server/src/services/rag/` — Pipeline RAG complet (9 fichiers)
- `server/src/config/` — 18 fichiers keyword-mappings + article-metadata
- `server/src/scripts/ingest-articles.ts` — Ingestion 132+ JSON → PostgreSQL + Qdrant
- `server/src/utils/logger.ts` — Winston logger
- `server/src/utils/cache.ts` — Cache in-memory avec TTL
- `server/src/routes/chat.ts` — Routes SSE streaming + CRUD conversations
- `mobile/lib/api/chat.ts` — Client API SSE + axios + type Citation
- `mobile/app/(app)/chat/index.tsx` — Ecran chat

---

## 2. Entreprise / SaaS

| Fonctionnalite                | cgi-engine                            | cgi-242                                                                                                                                                                   |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Organisations multi-tenant    | CRUD complet, routes + services       | ✅ CRUD complet (15 endpoints) : creation, modification, soft/hard delete, restore, membres, invitations, transfert propriete. Middleware `resolveTenant` avec cache 5min |
| Abonnements / Plans           | FREE → ENTERPRISE, routes + services | ✅ 3 endpoints : status, upgrade (DB only, sans paiement), quota. Lazy reset mensuel automatique. 5 plans (FREE/STARTER/PROFESSIONAL/TEAM/ENTERPRISE)                    |
| Paiements Stripe/CinetPay    | Stripe + CinetPay                     | Exclu (pas de paiement). Upgrade de plan en DB uniquement                                                                                                                |
| Factures PDF                  | Generation automatique                | Schema BDD (Invoice). Aucune route API (exclu du scope)                                                                                                                  |
| Gestion membres / invitations | Invitation par email, gestion roles   | ✅ Invite, accept, cancel, remove, change role, transfer ownership. Verification quota membres par plan                                                                  |
| Permissions granulaires       | Par membre, par plan                  | ✅ 8 endpoints : 16 permissions, double couche (role defaults + JSON custom overrides), grant/revoke/reset par membre                                                    |
| Analytics / Dashboard         | Time-series, stats membres, export    | ✅ 4 endpoints : dashboard 30/60j avec tendances, timeseries, stats par membre, export CSV                                                                               |
| Audit logs (RGPD)             | 30+ actions tracees, cleanup          | ✅ 6 endpoints : logs org, actions user, historique entite, recherche avancee, stats, cleanup GDPR. Fire-and-forget non-bloquant                                         |
| Alertes fiscales              | Par type, categorie, echeances        | ✅ 4 endpoints : list, stats, by article, extract/seed. ~55 alertes predefinies (IS, IBA, ITS, IRCM, IRF, TVA, sanctions, etc.)                                          |
| Quotas par plan               | Nombre de questions/mois              | ✅ Middleware `checkQuestionQuota` (429 si limite atteinte). Lazy reset automatique chaque mois                                                                          |
| Middleware role organisation  | `orgRole.middleware.ts`             | ✅ `requireOwner`, `requireAdmin`, `requireMember`, `requirePermission`, `requireAnyPermission`, `requireAllPermissions`                                           |
| Middleware quota abonnement   | `subscription.middleware.ts`        | ✅ `requirePlan(min)`, `checkQuestionQuota`, `requirePremium`, `requireEnterprise`, `requirePaid`                                                                    |
| Middleware tenant             | Implicite via session                 | ✅ `resolveTenant` (header X-Organization-ID), `requireOrg`. Cache in-memory 5min                                                                                      |
| PrismaClient singleton        | Singleton                             | ✅ `utils/prisma.ts` partage par auth.ts, chat.service.ts et tous les nouveaux services                                                                                 |

### Etat cgi-242

Toute la couche SaaS/Enterprise est implementee : schema BDD + services + routes API + middleware. **40 endpoints** repartis sur 8 fichiers de routes. Le serveur compile sans erreur TypeScript et demarre correctement.

Les seuls elements exclus sont les paiements (Stripe/CinetPay) et les factures PDF — l'upgrade de plan se fait directement en base de donnees.

### Fichiers cgi-242 — SaaS/Enterprise (20 fichiers crees, 5 modifies)

**Foundation :**
- `server/src/utils/prisma.ts` — PrismaClient singleton partage
- `server/src/types/plans.ts` — Config 5 plans, quotas, helpers (`getPlanQuota`, `isUnlimited`, `isPlanAtLeast`)
- `server/src/types/permissions.ts` — 16 permissions enum, `ROLE_DEFAULTS` par role, hierarchie

**Middleware :**
- `server/src/middleware/tenant.middleware.ts` — Resolution tenant via X-Organization-ID, cache 5min
- `server/src/middleware/orgRole.middleware.ts` — Hierarchie OWNER>ADMIN>MEMBER>VIEWER, 7 exports
- `server/src/middleware/subscription.middleware.ts` — Verification plan/quota, lazy reset mensuel

**Services + Routes :**
- `server/src/services/organization.service.ts` — CRUD org, membres, invitations, transfert propriete
- `server/src/services/organization.admin.service.ts` — Soft/hard delete, restore, stats
- `server/src/routes/organization.routes.ts` — 15 endpoints organisations
- `server/src/services/subscription.service.ts` — getSubscription, upgradePlan, checkQuota, incrementQuota
- `server/src/routes/subscription.routes.ts` — 3 endpoints abonnement
- `server/src/services/permission.service.ts` — hasPermission, grant, revoke, reset, getEffective
- `server/src/routes/permission.routes.ts` — 8 endpoints permissions
- `server/src/services/audit.service.ts` — `AuditService.log()` fire-and-forget, search, stats, GDPR cleanup
- `server/src/routes/audit.routes.ts` — 6 endpoints audit
- `server/src/services/analytics.service.ts` — Dashboard 30/60j, timeseries, member stats, export CSV
- `server/src/routes/analytics.routes.ts` — 4 endpoints analytics
- `server/src/services/alertes-fiscales.service.ts` — ~55 alertes predefinies, extraction regex, seed
- `server/src/routes/alertes-fiscales.routes.ts` — 4 endpoints alertes fiscales

**Fichiers modifies :**
- `server/src/middleware/auth.ts` — AuthRequest etendu (orgId, orgRole, orgPermissions)
- `server/src/utils/cache.ts` — TTL TENANT/SUBSCRIPTION (5min) + prefixes
- `server/src/app.ts` — CORS X-Organization-ID + 6 nouveaux app.use()
- `server/src/routes/auth.ts` — PrismaClient singleton
- `server/src/services/chat.service.ts` — PrismaClient singleton

### Elements cgi-engine NON migres (hors scope)

- `server/src/routes/stripe.routes.ts` — Paiements Stripe
- `server/src/services/stripe.service.ts` — Integration Stripe
- `server/src/controllers/invoice.controller.ts` — Factures
- `server/src/services/invoice.pdf-generator.ts` — Generation PDF factures

---

## 3. Securite

| Fonctionnalite               | cgi-engine                                      | cgi-242                                                                                                                                  |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| MFA / 2FA (TOTP)             | Oui + codes backup                              | ✅ TOTP (otpauth) + QR code setup + 10 codes backup hashes bcrypt. Secret chiffre AES-256-GCM. 6 endpoints MFA                        |
| Cookies httpOnly (web)       | Non                                             | ✅ Double strategie : cookies `httpOnly`+`Secure`+`SameSite=Strict` pour web, Bearer token pour mobile. XSS-proof sur web            |
| CSP (Content Security Policy)| Non                                             | ✅ Helmet CSP renforcee : `defaultSrc 'self'`, `objectSrc 'none'`, `frameAncestors 'none'`                                           |
| Rate limiting                | 3 niveaux (auth 3r/m, api 20r/s, general 10r/s) | ✅ 3 niveaux : global (100/15min), auth (5/15min, 100 en dev), sensitive (10/h). `express-rate-limit`                                  |
| Email SMTP reel              | OVH `ssl0.ovh.net`                            | ✅ Nodemailer SMTP configurable via env. `sendOtp()`, `sendPasswordReset()`, `sendInvitation()`, `sendMfaEnabled()`. Fallback console |
| Helmet.js headers            | Oui                                             | ✅ Oui (`helmet` dans `app.ts`)                                                                                                       |
| Token blacklisting           | Oui                                             | ✅ Cache in-memory avec TTL = duree restante du token. `blacklistToken()`, `isBlacklisted()`, `blacklistAllUserTokens()`              |
| Session unique (1 seul poste)| Non                                             | ✅ `blacklistAllUserTokens()` appele dans verify-otp avant emission des nouveaux tokens. Toute session precedente est automatiquement invalidee (401 "Session revoquee") |
| Logout / Logout-all          | Oui                                             | ✅ `POST /api/auth/logout` (blacklist token) + `POST /api/auth/logout-all` (revoque toutes les sessions)                              |
| Audit sur auth               | Oui                                             | ✅ `AuditService.log()` sur register, login success/failed, password reset/change, logout, MFA enable/disable                          |
| Middleware role organisation | `orgRole.middleware.ts`                       | ✅ `orgRole.middleware.ts` (OWNER>ADMIN>MEMBER>VIEWER + permissions)                                                                   |
| Middleware quota abonnement  | `subscription.middleware.ts`                  | ✅ `subscription.middleware.ts` (plan minimum, quota 429, lazy reset)                                                                  |
| Middleware tenant multi-org  | Implicite via session                           | ✅ `tenant.middleware.ts` (X-Organization-ID, cache 5min)                                                                              |
| RBAC permissions granulaires | Par role + custom                               | ✅ 16 permissions, double couche (role defaults + JSON overrides par membre)                                                            |

### Etat cgi-242

Toute la couche securite est implementee. Le MFA est optionnel : l'utilisateur l'active quand il veut. Si MFA active, `verify-otp` retourne `requireMFA: true` + token temporaire, et il faut appeler `/api/mfa/verify` avec un code TOTP ou un code de secours.

Le rate limiting protege les endpoints sensibles (auth, MFA, changement mot de passe). Le token blacklisting utilise le cache in-memory existant avec TTL = duree restante du token. La **session unique** empeche la connexion multi-postes : a chaque login (verify-otp), tous les tokens precedents sont invalides via `blacklistAllUserTokens()`, seul le dernier appareil connecte reste actif. L'email SMTP est configurable via variables d'environnement ; sans SMTP, les emails sont affiches en console (mode dev).

**Double strategie d'authentification web/mobile :**
- **Web** : les tokens sont envoyes en cookies `httpOnly` + `Secure` + `SameSite=Strict`. Le JavaScript ne peut jamais lire le token → protection totale contre XSS. Le serveur detecte la plateforme via le header `X-Platform`.
- **Mobile** : les tokens sont retournes dans le body JSON (Bearer token dans Authorization header), stockes dans AsyncStorage (sandboxe par l'OS).
- Le middleware `requireAuth` verifie d'abord le header Authorization (mobile), puis le cookie (web).
- CSP (Content Security Policy) renforcee via Helmet : scripts et connexions limites a `'self'`, frames interdites.

### Fichiers cgi-242 — Securite (6 fichiers crees, 4 modifies)

**Middleware :**
- `server/src/middleware/rateLimit.middleware.ts` — 3 limiters (global, auth, sensitive) via `express-rate-limit`

**Services :**
- `server/src/services/tokenBlacklist.service.ts` — Blacklist token individuel + tous tokens user, via `cacheService` avec TTL
- `server/src/services/email.service.ts` — Nodemailer SMTP configurable, fallback console. 4 methodes (OTP, reset, invitation, MFA)
- `server/src/services/mfa.service.ts` — Setup TOTP (otpauth), enable/disable/verify, secret chiffre AES-256-GCM, validation window 1 step
- `server/src/services/mfa.backup.service.ts` — 10 codes XXXX-XXXX (crypto.randomBytes), hashes bcrypt, verification + consommation

**Routes :**
- `server/src/routes/mfa.routes.ts` — 6 endpoints MFA (status, setup, enable, disable, verify, backup-codes/regenerate)

**Fichiers modifies :**
- `server/src/middleware/auth.ts` — Verification blacklist token + blacklist user (logout-all) dans `requireAuth`
- `server/src/routes/auth.ts` — Logout/logout-all, `EmailService` pour OTP, `AuditService.log()` sur auth, flow MFA dans verify-otp, Winston logger
- `server/src/app.ts` — `globalLimiter` middleware global, `authLimiter` sur `/api/auth`, montage `/api/mfa`
- `server/src/utils/cache.ts` — `TOKEN_BLACKLIST` TTL (24h) + prefixe `BLACKLIST` + methode `keys()`

### Variables d'environnement email (nouvelles)

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=password
SMTP_FROM=CGI-242 <noreply@cgi242.com>
```

### Flow login avec MFA

```
1. POST /api/auth/login        → password OK → genere OTP → envoie email
2. POST /api/auth/verify-otp   → OTP OK → si mfaEnabled:
                                              → retourne { requireMFA: true, mfaToken }
                                            sinon:
                                              → retourne { token, refreshToken }
3. POST /api/mfa/verify         → code TOTP ou backup OK → retourne { token, refreshToken }
```

### Fichiers cgi-engine concernes

- `server/src/routes/mfa.routes.ts`
- `server/src/services/mfa.service.ts`
- `server/src/services/mfa.backup.service.ts`
- `server/src/middleware/auth.ts`
- `server/src/middleware/orgRole.middleware.ts`
- `server/src/middleware/subscription.middleware.ts`
- `server/src/middleware/metrics.middleware.ts`

---

## 4. Gestion de contenu

| Fonctionnalite                  | cgi-engine                  | cgi-242                                     |
| ------------------------------- | --------------------------- | ------------------------------------------- |
| Articles dynamiques (BDD)       | CRUD, ingestion, indexation | Ingestion batch → PostgreSQL + Qdrant      |
| Ingestion batch                 | `ingest-articles.ts`      | `ingest-articles.ts` (adapte, Voyage AI)  |
| References entre articles       | `ArticleReference` model  | Schema present, pas encore exploite         |
| Multi-versions CGI (2025, 2026) | Oui                         | 2026 par defaut (support 2025 dans le code) |
| Historique de recherche         | `SearchHistory` model     | Schema present, pas encore exploite         |
| Statistiques d'usage            | `UsageStats` model        | Absent                                      |

---

## 5. Schema BDD

### cgi-engine : 52 modeles/enums

- `User`, `Organization`, `OrganizationMember`, `Invitation`
- `Subscription`, `Payment`, `Invoice`
- `Conversation`, `ConversationAccess`, `Message`
- `Article`, `ArticleReference`
- `AlerteFiscale`
- `SearchHistory`, `UsageStats`
- `AuditLog` (30+ types d'actions)
- `SystemConfig`
- Enums: `Role`, `Plan`, `SubscriptionStatus`, `AuditAction`, etc.

### cgi-242 : meme schema, modeles exploites

- `User`, `Organization`, `OrganizationMember`, `Subscription` — Auth + gestion orga + abonnements
- `Invitation` — Invitations membres avec expiration
- `Conversation`, `Message` — Chat IA fiscal
- `AuditLog` — Journalisation complete (30+ actions)
- `UsageStats`, `SearchHistory` — Analytics et timeseries
- `AlerteFiscale` — ~55 alertes predefinies
- `Payment`, `Invoice` — Schema present, non exploite (paiements exclus du scope)

---

## 6. Endpoints API

### cgi-engine : 17 fichiers de routes

| Route                       | Description                                 |
| --------------------------- | ------------------------------------------- |
| `/api/auth/*`             | Auth (login, register, 2FA, password reset) |
| `/api/chat/*`             | Chat IA (message, stream, historique)       |
| `/api/articles/*`         | Articles (browse, search, structure)        |
| `/api/alertes-fiscales/*` | Alertes fiscales                            |
| `/api/organizations/*`    | CRUD organisations, membres                 |
| `/api/subscription/*`     | Gestion abonnements                         |
| `/api/permissions/*`      | Permissions granulaires                     |
| `/api/analytics/*`        | Dashboard, timeseries, export               |
| `/api/audit/*`            | Logs d'audit, historique actions            |
| `/api/mfa/*`              | Setup et verification MFA                   |
| `/api/stripe/*`           | Paiements Stripe                            |
| `/api/invoices/*`         | Factures                                    |
| `/api/stats/*`            | Statistiques d'usage                        |
| `/api/health`             | Health check                                |

### cgi-242 : 9 fichiers de routes, 49 endpoints

| Route                              | Endpoints | Description                                                          |
| ---------------------------------- | --------- | -------------------------------------------------------------------- |
| `/api/auth/*`                    | 9         | Inscription, connexion, OTP, reset password, logout, logout-all      |
| `/api/mfa/*`                     | 6         | Status, setup (QR), enable, disable, verify login, regenerate backup |
| `/api/chat/*`                    | 4         | Chat IA streaming SSE, CRUD conversations                            |
| `/api/organizations/*`           | 15        | CRUD org, membres, invitations, transfert, restore                   |
| `/api/subscription/*`            | 3         | Status, upgrade plan, quota                                          |
| `/api/permissions/*`             | 8         | Permissions granulaires, grant/revoke/reset                          |
| `/api/analytics/*`               | 4         | Dashboard, timeseries, stats membres, export CSV                     |
| `/api/audit/*`                   | 6         | Logs org, user, entite, recherche, stats, GDPR                      |
| `/api/alertes-fiscales/*`        | 4         | List, stats, by article, extract/seed                                |
| `/health`                        | 1         | Health check                                                         |

---

## 7. Client / Frontend

### cgi-engine (Angular) : 20+ services

- Chat UI avec historique de conversations
- Streaming temps reel des reponses IA
- Navigateur d'articles hierarchique
- Dashboard alertes fiscales
- Simulateurs fiscaux (IS, ITS, Patente)
- Gestion organisations et membres
- Invitation par email
- Checkout abonnement
- Dashboard analytics
- Profil utilisateur
- Configuration MFA
- Consultation audit logs
- Configuration permissions
- Recherche vocale
- Stockage offline
- Multi-versions CGI (2025, 2026)
- Pages legales (CGU, confidentialite)

### cgi-242 (Expo React Native) : app fonctionnelle

- Ecrans d'authentification (login, register, OTP, reset password)
- Chat IA fiscal avec streaming temps reel (bulles user/assistant)
- Navigateur Code CGI (sommaire + articles)
- Simulateurs fiscaux (IS, ITS, Patente, Solde de liquidation)
- Dashboard (stats, echeances fiscales, actions rapides)
- Recherche locale avec debounce
- Sidebar avec navigation complete

---

## 8. Ce que cgi-242 a en PLUS

| Fonctionnalite            | Details                                               |
| ------------------------- | ----------------------------------------------------- |
| App mobile native         | iOS + Android via Expo                                |
| Donnees CGI offline       | JSON embarque, pas besoin de connexion pour consulter |
| ErrorBoundary global      | Capture d'erreurs React avec fallback FR              |
| Sentry monitoring         | `@sentry/react-native` integre                      |
| Refresh token interceptor | File d'attente 401 + logout auto                      |
| Optimisation recherche    | Debounce 300ms + index `_searchText` pre-calcule    |
| Tests unitaires           | Jest (31 tests : ITS, IS, helpers)                    |
| CI/CD                     | EAS Build + GitHub Actions                            |

---

## 9. Infrastructure VPS actuelle (cgi-engine)

| Service            | Container               | Port    | Status                   |
| ------------------ | ----------------------- | ------- | ------------------------ |
| Nginx              | `cgi-242-nginx`       | 80, 443 | En ligne                 |
| Server 1           | `cgi-242-server1`     | 3000    | En ligne                 |
| Server 2           | `cgi-242-server2`     | 3000    | En ligne                 |
| PostgreSQL Master  | `cgi-242-db-master`   | 5432    | Connecte (2ms)           |
| PostgreSQL Replica | `cgi-242-db-replica1` | 5432    | Connecte                 |
| Redis              | `cgi-242-redis`       | 6379    | Connecte (1ms)           |
| Qdrant             | -                       | 6333    | Connecte (2 collections) |
| Certbot            | `cgi-242-certbot`     | -       | Auto-renew               |

### Domaines

- `cgi242.normx-ai.com` — App principale
- `api.normx-ai.com` — API backend (repond `normx-paie-api` actuellement)
- `normx-ai.com` — Site vitrine

### Ressources

- RAM serveur : 85% utilisee
- Uptime : ~13 jours
- Node.js limite a 384MB par instance

---

## 10. Plan de migration recommande

### Etape 1 : Chat IA fiscal ✅ (fait le 26/02/2026)

- Service chat avec Claude Haiku 4.5 (Anthropic SDK)
- RAG complet : Voyage AI embeddings + Qdrant + recherche hybride 5 etapes
- 80+ mappings keywords, 12 regles de routage, 8 factories par chapitre
- Prompts fiscaux CGI 2026 avec contexte dynamique (articles reels)
- Streaming SSE (reponse mot par mot + event citations)
- Ecran chat mobile (bulles, auto-scroll, indicateur streaming)
- CRUD conversations (Prisma)
- Ingestion 132+ fichiers JSON → PostgreSQL + Qdrant
- Winston logger (console coloree dev, JSON prod)
- Fallback si Qdrant down (connaissances statiques)
- Sidebar activee

### Etape 2 : Fonctionnalites SaaS/Enterprise ✅ (fait le 26/02/2026)

- Gestion organisation : CRUD complet, membres, invitations, transfert propriete (15 endpoints)
- Abonnements : status, upgrade plan (DB only, sans paiement), quota avec lazy reset (3 endpoints)
- Permissions granulaires : 16 permissions, double couche role+custom, grant/revoke/reset (8 endpoints)
- Analytics : dashboard 30/60j, timeseries, stats membres, export CSV (4 endpoints)
- Audit logs : fire-and-forget, recherche, stats, cleanup GDPR (6 endpoints)
- Alertes fiscales : ~55 alertes predefinies, extraction regex, seed (4 endpoints)
- Middleware : tenant (X-Organization-ID), orgRole (hierarchie), subscription (quota 429)
- PrismaClient singleton partage
- 0 erreur TypeScript, serveur demarre correctement

### Etape 3 : Securite ✅ (fait le 26/02/2026)

- Rate limiting 3 niveaux : global (100/15min), auth (5/15min, 100 en dev), sensitive (10/h) via `express-rate-limit`
- MFA/2FA TOTP : setup QR code, enable/disable, verify login, 10 codes backup hashes bcrypt. Secret chiffre AES-256-GCM. 6 endpoints
- Token blacklisting : cache in-memory avec TTL = duree restante du token. Blacklist individuel + tous tokens user
- Session unique (1 seul poste) : `blacklistAllUserTokens()` dans verify-otp invalide toutes les sessions precedentes a chaque connexion
- Email SMTP : Nodemailer configurable via env, fallback console. OTP, reset password, invitation, MFA notification
- Logout / Logout-all : blacklist token + revocation globale sessions
- Audit sur auth : `AuditService.log()` sur register, login, password, logout, MFA
- Flow MFA integre dans le login : verify-otp → requireMFA → mfa/verify → tokens
- Winston logger partout (plus de console.error)
- 0 erreur TypeScript, 49 endpoints API sur 9 fichiers de routes

### Etape 3b : Fonctionnalites restantes

- Paiements Stripe/CinetPay (si necessaire)
- Factures PDF
- Profil / parametres utilisateur

### Etape 4 : Nettoyer le VPS

- Arreter tous les containers cgi-engine
- Supprimer volumes, images, fichiers
- Redeployer cgi-242

### Etape 5 : Deployer cgi-242

- Build serveur Docker
- Build client Expo (web export)
- Configurer Nginx pour la nouvelle app
- Migrer les certificats SSL

---

## Conclusion

cgi-242 couvre desormais le coeur du produit, les fonctionnalites SaaS/Enterprise ET la securite :

- **IA/Chat** : RAG complet (recherche hybride 5 etapes, Voyage AI, Qdrant), streaming SSE, Claude Haiku 4.5
- **SaaS/Enterprise** : organisations multi-tenant, abonnements 5 plans, permissions RBAC (16 perms), analytics, audit RGPD, alertes fiscales (~55 predefinies), middleware tenant/role/quota
- **Securite** : MFA/2FA TOTP + backup codes, rate limiting 3 niveaux, token blacklisting, session unique (1 seul poste actif), email SMTP (Nodemailer), logout/logout-all, audit sur auth. CSRF non necessaire (Bearer tokens)
- **Mobile** : app Expo iOS/Android, simulateurs fiscaux, navigateur CGI offline

**49 endpoints API** sur 9 fichiers de routes. 0 erreur TypeScript.

Il reste : paiements (Stripe/CinetPay), factures PDF, profil/parametres utilisateur.
cgi-engine peut etre supprime une fois ces derniers elements migres.
Les donnees utilisateurs existantes (BDD PostgreSQL) doivent etre preservees.
