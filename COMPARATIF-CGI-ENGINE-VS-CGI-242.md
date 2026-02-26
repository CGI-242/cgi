# Comparatif cgi-engine vs cgi-242

## Contexte

`cgi-engine` est la plateforme SaaS complete deployee sur VPS (`cgi242.normx-ai.com`).
`cgi-242` est la nouvelle app mobile/web Expo avec un serveur minimaliste.

Ce rapport identifie tout ce qui manque a cgi-242 avant de pouvoir remplacer cgi-engine.

---

## 1. IA / Chat (coeur du produit)

| Fonctionnalite | cgi-engine | cgi-242 |
|---|---|---|
| Chat IA | OpenAI + Claude + Qdrant (RAG) | Claude Haiku 4.5 + Qdrant (RAG) |
| Embeddings vectoriels | OpenAI text-embedding-3-small (1536 dims) | Voyage AI voyage-multilingual-2 (1024 dims) |
| Recherche hybride (keyword + semantique) | Qdrant + PostgreSQL + Redis | Qdrant + PostgreSQL + cache in-memory |
| Pipeline hybride 5 etapes | checkDirectMappings → routingRules → keywordMatches → vectorSearch → merge+priority | Identique (copie complete) |
| Mappings keyword directs | 80+ mappings | 80+ mappings (copie) |
| Regles de routage contextuel | 12 regles | 12 regles (copie) |
| Recherche par chapitre (factory) | 8 factories (IRPP, IS, IBA, DC, TD, DD, PV, IL) | 8 factories (copie) |
| Streaming SSE des reponses | `chat.streaming.controller.ts` | `routes/chat.ts` + `chat.service.ts` (SSE) |
| Event citations SSE | Oui | Oui |
| Historique conversations | BDD (Conversation, Message) | BDD (Conversation, Message) via Prisma |
| Citations dans les messages | `citations Json?` dans Message | `citations Json?` dans Message |
| Multi-agent orchestration | `orchestrator/`, `agents/` | Absent |
| Prompts fiscaux specialises | `chat.prompts.ts` | `chat.prompts.ts` (statique + RAG avec contexte) |
| Detection salutations | Non | `isSimpleGreeting()` → prompt simplifie |
| Routage intelligent par chapitre | `hybrid-search.routing.ts` | `hybrid-search.routing.ts` (copie) |
| Fallback si Qdrant down | Non | Oui (connaissances statiques dans le prompt) |
| Ingestion articles | `ingest-articles.ts` + Redis | `ingest-articles.ts` + cache in-memory |
| Logger | Winston + rotation fichiers | Winston (console coloree dev, JSON prod) |

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

| Fonctionnalite | cgi-engine | cgi-242 |
|---|---|---|
| Organisations multi-tenant | CRUD complet, routes + services | Schema BDD complet (Organization, OrganizationMember, roles OWNER/ADMIN/MEMBER/VIEWER), creation auto a l'inscription. Aucune route API de gestion |
| Abonnements / Plans | FREE → ENTERPRISE, routes + services | Schema BDD (Subscription, 5 plans), abo FREE cree auto a l'inscription. Aucune route API |
| Paiements Stripe | Webhooks, checkout, historique | Schema BDD (Payment avec champs Stripe + CinetPay). Aucune route API |
| Factures PDF | Generation automatique | Schema BDD (Invoice). Aucune route API |
| Gestion membres / invitations | Invitation par email, gestion roles | Schema BDD (Invitation avec statuts PENDING/ACCEPTED/EXPIRED/CANCELLED). Aucune route API |
| Permissions granulaires | Par membre, par plan | Schema BDD (permissions JSON sur OrganizationMember, ConversationAccess). Aucune route API |
| Analytics / Dashboard | Time-series, stats membres, export | Schema BDD (SearchHistory, UsageStats). Dashboard mobile basique (stats hardcodees, echeances hardcodees). Aucune route API |
| Audit logs (RGPD) | 30+ actions tracees, cleanup | Schema BDD (AuditLog, 30+ AuditAction). Aucune route API |
| Alertes fiscales | Par type, categorie, echeances | Schema BDD (AlerteFiscale, 5 types, 10+ categories). Bouton "BIENTOT" dans la sidebar mobile. Aucune route API |
| Quotas par plan | Nombre de questions/mois | Absent |

### Etat cgi-242
Toute l'architecture BDD est en place (modeles Prisma complets, enums, relations). Ce qui manque : les routes API et services pour exposer ces fonctionnalites. La couche donnees est prete, la couche metier/API reste a implementer.

### Fichiers cgi-242 existants
- `server/prisma/schema.prisma` — Tous les modeles SaaS definis (Organization, Subscription, Payment, Invoice, Invitation, AuditLog, AlerteFiscale, etc.)
- `server/src/routes/auth.ts` — Creation org + abo FREE a l'inscription (lignes 29-64)
- `mobile/components/Sidebar.tsx` — Navigation avec alertes "BIENTOT", profil "Coming soon"
- `mobile/app/(app)/index.tsx` — Dashboard basique (stats hardcodees, echeances, actions rapides)

### Fichiers cgi-engine concernes (a migrer)
- `server/src/routes/organization.routes.ts`
- `server/src/services/organization.service.ts`
- `server/src/services/organization.admin.service.ts`
- `server/src/routes/subscription.routes.ts`
- `server/src/controllers/subscription.controller.ts`
- `server/src/routes/stripe.routes.ts`
- `server/src/services/stripe.service.ts`
- `server/src/controllers/invoice.controller.ts`
- `server/src/services/invoice.pdf-generator.ts`
- `server/src/routes/permission.routes.ts`
- `server/src/services/permission.service.ts`
- `server/src/services/permission.plan.service.ts`
- `server/src/routes/analytics.routes.ts`
- `server/src/services/analytics.service.ts`
- `server/src/routes/audit.routes.ts`
- `server/src/services/audit.service.ts`
- `server/src/routes/alertes-fiscales.routes.ts`
- `server/src/services/alertes-fiscales.service.ts`

---

## 3. Securite

| Fonctionnalite | cgi-engine | cgi-242 |
|---|---|---|
| MFA / 2FA (TOTP) | Oui + codes backup | Absent |
| CSRF protection | Token + middleware | Absent |
| Rate limiting | 3 niveaux (auth 3r/m, api 20r/s, general 10r/s) | Absent |
| Email SMTP reel | OVH `ssl0.ovh.net` | Absent (OTP non envoye) |
| Helmet.js headers | Oui | Absent |
| Token blacklisting | Oui | Absent |
| Middleware role organisation | `orgRole.middleware.ts` | Absent |
| Middleware quota abonnement | `subscription.middleware.ts` | Absent |

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

| Fonctionnalite | cgi-engine | cgi-242 |
|---|---|---|
| Articles dynamiques (BDD) | CRUD, ingestion, indexation | Ingestion batch → PostgreSQL + Qdrant |
| Ingestion batch | `ingest-articles.ts` | `ingest-articles.ts` (adapte, Voyage AI) |
| References entre articles | `ArticleReference` model | Schema present, pas encore exploite |
| Multi-versions CGI (2025, 2026) | Oui | 2026 par defaut (support 2025 dans le code) |
| Historique de recherche | `SearchHistory` model | Schema present, pas encore exploite |
| Statistiques d'usage | `UsageStats` model | Absent |

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

### cgi-242 : meme schema, modeles utilises
- `User`, `Organization`, `OrganizationMember`, `Subscription`
- `Conversation`, `Message` (Chat IA fiscal)
- Le reste est dans le schema mais pas encore exploite

---

## 6. Endpoints API

### cgi-engine : 17 fichiers de routes
| Route | Description |
|---|---|
| `/api/auth/*` | Auth (login, register, 2FA, password reset) |
| `/api/chat/*` | Chat IA (message, stream, historique) |
| `/api/articles/*` | Articles (browse, search, structure) |
| `/api/alertes-fiscales/*` | Alertes fiscales |
| `/api/organizations/*` | CRUD organisations, membres |
| `/api/subscription/*` | Gestion abonnements |
| `/api/permissions/*` | Permissions granulaires |
| `/api/analytics/*` | Dashboard, timeseries, export |
| `/api/audit/*` | Logs d'audit, historique actions |
| `/api/mfa/*` | Setup et verification MFA |
| `/api/stripe/*` | Paiements Stripe |
| `/api/invoices/*` | Factures |
| `/api/stats/*` | Statistiques d'usage |
| `/api/health` | Health check |

### cgi-242 : 2 fichiers de routes
| Route | Description |
|---|---|
| `/api/auth/register` | Inscription |
| `/api/auth/login` | Connexion |
| `/api/auth/verify-otp` | Verification OTP |
| `/api/auth/send-otp-email` | Envoi OTP |
| `/api/auth/forgot-password` | Demande reset mot de passe |
| `/api/auth/reset-password` | Reset mot de passe |
| `/api/auth/check-email` | Verification email |
| `/api/chat/message/stream` | Envoyer message + streaming SSE |
| `/api/chat/conversations` | Lister les conversations |
| `/api/chat/conversations/:id` | Voir / Supprimer une conversation |
| `/health` | Health check |

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

| Fonctionnalite | Details |
|---|---|
| App mobile native | iOS + Android via Expo |
| Donnees CGI offline | JSON embarque, pas besoin de connexion pour consulter |
| ErrorBoundary global | Capture d'erreurs React avec fallback FR |
| Sentry monitoring | `@sentry/react-native` integre |
| Refresh token interceptor | File d'attente 401 + logout auto |
| Optimisation recherche | Debounce 300ms + index `_searchText` pre-calcule |
| Tests unitaires | Jest (31 tests : ITS, IS, helpers) |
| CI/CD | EAS Build + GitHub Actions |

---

## 9. Infrastructure VPS actuelle (cgi-engine)

| Service | Container | Port | Status |
|---|---|---|---|
| Nginx | `cgi-242-nginx` | 80, 443 | En ligne |
| Server 1 | `cgi-242-server1` | 3000 | En ligne |
| Server 2 | `cgi-242-server2` | 3000 | En ligne |
| PostgreSQL Master | `cgi-242-db-master` | 5432 | Connecte (2ms) |
| PostgreSQL Replica | `cgi-242-db-replica1` | 5432 | Connecte |
| Redis | `cgi-242-redis` | 6379 | Connecte (1ms) |
| Qdrant | - | 6333 | Connecte (2 collections) |
| Certbot | `cgi-242-certbot` | - | Auto-renew |

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

### Etape 2 : Ajouter les fonctionnalites manquantes
- Gestion organisation / membres
- Abonnements / Stripe
- Profil / parametres
- Rate limiting, CSRF
- Email SMTP reel (OTP)

### Etape 3 : Nettoyer le VPS
- Arreter tous les containers cgi-engine
- Supprimer volumes, images, fichiers
- Redeployer cgi-242

### Etape 4 : Deployer cgi-242
- Build serveur Docker
- Build client Expo (web export)
- Configurer Nginx pour la nouvelle app
- Migrer les certificats SSL

---

## Conclusion

cgi-242 couvre le coeur du produit : auth, chat IA fiscal avec RAG complet, code CGI, simulateurs, dashboard.
Le pipeline RAG (recherche hybride, embeddings Voyage AI, Qdrant) est au meme niveau que cgi-engine, avec en plus un fallback gracieux et des embeddings multilingues optimises francais.
Il reste les fonctionnalites SaaS/entreprise (organisations, abonnements, paiements, audit) et la securite avancee (MFA, rate limiting, CSRF).
cgi-engine peut etre supprime une fois ces elements migres.
Les donnees utilisateurs existantes (BDD PostgreSQL) doivent etre preservees.
