# Audit Complet du Projet CGI-242

**Date** : 9 mars 2026
**Mise a jour** : 9 mars 2026
**Portee** : Securite, cybersecurite, performance, duplication, bonnes pratiques, qualite de code, taille de fichiers

---

## CORRECTIONS REALISEES

| # | Correction | Date | Commit |
|---|-----------|------|--------|
| C1 | **Gestion des secrets migrée vers GitHub Secrets** — 15 secrets configures dans GitHub, workflow CI/CD genere les `.env` a la volee sur le VPS, plus aucun secret en clair dans le repo | 2026-03-09 | `a933edb` |
| M3 | **MFA_ENCRYPTION_KEY separee du JWT_SECRET** — Cle dediee obligatoire en production, fallback JWT_SECRET en dev uniquement | 2026-03-09 | `a933edb` |
| BP6 | **Pipeline CI/CD mis en place** — `.github/workflows/deploy.yml` deploie automatiquement sur push vers main via SSH + GitHub Secrets | 2026-03-09 | `a933edb` |
| - | **`.gitignore` renforce** — Pattern `.env.*` avec exception `!.env.example` | 2026-03-09 | `a933edb` |
| - | **Script `setup-github-secrets.sh`** — Configuration interactive des 15 secrets GitHub | 2026-03-09 | `a933edb` |
| - | **Cle SSH dediee au deploiement** — `cgi242-deploy` (ed25519) installee sur le VPS | 2026-03-09 | - |
| C2 | **CSP strict sans unsafe-inline/unsafe-eval** — Hash SHA-256 pour style Expo, Cloudflare autorise par domaine explicite | 2026-03-09 | `61762ae` |
| M4 | **X-Frame-Options: DENY ajoute** — Protection clickjacking via `security-headers.conf` partage | 2026-03-09 | voir ci-dessous |
| B7 | **Permissions-Policy ajoute** — `camera=(), microphone=(), geolocation=()` | 2026-03-09 | voir ci-dessous |
| - | **Security headers Nginx corriges** — `include security-headers.conf` dans chaque bloc `location` pour eviter l'ecrasement des headers | 2026-03-09 | voir ci-dessous |
| C3 | **Turnstile CAPTCHA fail-closed** — Bypass `X-Platform: mobile` supprime, fail-closed sauf dev, timeout 5s, logging | 2026-03-09 | voir ci-dessous |

---

## Vue d'ensemble

| Metrique | Valeur |
|----------|--------|
| **Lignes de code source** | ~49 200 (frontend 27 238 + backend 21 971) |
| **Fichiers source** | ~468 fichiers |
| **Taille projet** (hors node_modules) | 35 Mo |
| **Stack** | Expo (React Native) + Express/Node.js + PostgreSQL + Qdrant + Nginx |

---

## 1. SECURITE & CYBERSECURITE

### 1.1 CRITIQUE (Action immediate requise)

| # | Probleme | Localisation |
|---|----------|-------------|
| **C1** | ~~**Secrets exposes dans les fichiers .env**~~ **CORRIGE** — Secrets migres vers GitHub Secrets + workflow CI/CD genere les `.env` a la volee sur le VPS (chmod 600). Plus aucun secret en clair dans le repo. | `server/.env`, `server/.env.production` |
| **C2** | ~~**CSP trop permissive**~~ **CORRIGE** — `unsafe-inline` et `unsafe-eval` supprimes. Hash SHA-256 pour le style Expo. Headers de securite partages via `include` dans tous les blocs `location`. Ajout `X-Frame-Options: DENY` (M4) et `Permissions-Policy` (B7). | `nginx/conf.d/api.conf`, `nginx/conf.d/security-headers.conf`, `server/src/app.ts:47-59` |
| **C3** | ~~**Turnstile CAPTCHA fail-open**~~ **CORRIGE** — Bypass `X-Platform: mobile` supprime, fail-closed partout sauf `NODE_ENV=development`, timeout 5s, logging des echecs | `server/src/middleware/turnstile.middleware.ts` |

### 1.2 HAUTE SEVERITE

| # | Probleme | Localisation |
|---|----------|-------------|
| **H1** | **Containers Docker executes en root** — Pas de directive `USER` dans les Dockerfiles | `server/Dockerfile`, `nginx/Dockerfile` |
| **H2** | **Tokens dans sessionStorage** (web) — Vulnerable aux attaques XSS | `mobile/lib/store/auth.ts:37-62` |
| **H3** | **Lockout d'authentification faible** — Brute force possible via multiples IPs | `server/src/routes/auth.ts:256-285` |
| **H4** | **Elevation de privileges par email admin** — `ADMIN_EMAIL` en env auto-promeut en ADMIN | `server/src/middleware/requireAdmin.ts:36-47` |
| **H5** | **Endpoint `/clear-session` non authentifie** sans protection CSRF | `server/src/routes/auth.ts:799-806` |
| **H6** | **Configuration SSL/TLS faible** — Cipher suite `HIGH:!aNULL:!MD5` trop permissive | `nginx/conf.d/api.conf:26` |

### 1.3 MOYENNE SEVERITE

| # | Probleme | Localisation |
|---|----------|-------------|
| **M1** | Race condition sur le refresh token replay | `server/src/routes/auth.ts:691-700` |
| **M2** | Secret MFA retourne en clair avant verification | `server/src/services/mfa.service.ts:67-100` |
| **M3** | ~~MFA chiffre avec le meme secret que JWT~~ **CORRIGE** — `MFA_ENCRYPTION_KEY` dediee, obligatoire en production | `server/src/services/mfa.service.ts:12-20` |
| **M4** | ~~Header `X-Frame-Options` manquant (clickjacking)~~ **CORRIGE** — `X-Frame-Options: DENY` ajoute via `security-headers.conf` | `nginx/conf.d/security-headers.conf` |
| **M5** | Pas de timeout proxy dans Nginx (slowloris) | `nginx/conf.d/api.conf:39-61` |
| **M6** | Pas de limite de ressources Docker | `docker-compose.yml` |
| **M7** | Rate limiting trop permissif (30r/s burst 50) | `nginx/nginx.conf:31` |
| **M8** | Pagination sans max de page (DoS potentiel) | `server/src/schemas/common.schema.ts:20-23` |
| **M9** | Bcrypt rounds hardcode (12) sans config | `server/src/routes/auth.ts:105` |

### 1.4 BASSE SEVERITE

| # | Probleme | Localisation |
|---|----------|-------------|
| **B1** | Health check expose le statut des services sans authentification | `server/src/app.ts:123-154` |
| **B2** | Audit log fire-and-forget (erreurs silencieuses) | `server/src/services/audit.service.ts:23-40` |
| **B3** | Logging verbose pouvant exposer des infos sensibles | `server/src/middleware/auth.ts:43` |
| **B4** | Pas de logging Docker max-size (risque saturation disque) | `docker-compose.yml` |
| **B5** | Filesystem read-write dans les containers | `docker-compose.yml` |
| **B6** | HTTP logging peut exposer des query parameters | `server/src/app.ts:80-87` |
| **B7** | ~~Pas de `Permissions-Policy` header~~ **CORRIGE** — `Permissions-Policy: camera=(), microphone=(), geolocation=()` ajoute | `nginx/conf.d/security-headers.conf` |
| **B8** | Pas de healthcheck Nginx dans Docker | `docker-compose.yml:58-74` |
| **B9** | Graceful shutdown ne gere pas les requetes longues (streaming) | `server/src/server.ts:29-47` |
| **B10** | Trust proxy hardcode a 1 | `server/src/app.ts:34` |
| **B11** | Pas de timeout connexion DB dans Prisma | `server/src/utils/prisma.ts` |
| **B12** | Swagger desactive en production (OK) mais pas de protection staging | `server/src/app.ts:95-100` |
| **B13** | Deploy script utilise `curl | sudo sh` pour Docker | `deploy.sh:25` |

---

## 2. PERFORMANCE

| # | Probleme | Impact | Localisation |
|---|----------|--------|-------------|
| **P1** | **Missing React keys dans les listes** (7+ instances) | Bugs de state, re-renders inutiles | `EntityHistoryModal.tsx:83`, `PaywallScreen.tsx:68,117,135`, `MobileCGIBrowser.tsx:73,347`, `ArticleDetail.tsx:218`, `OptionButtonGroup.tsx:28`, `Sidebar.tsx:202` |
| **P2** | **Fonctions flechees inline** dans les renders (20+ instances) | Casse la memoisation, re-renders | `Sidebar.tsx`, `MobileCGIBrowser.tsx`, `OptionButtonGroup.tsx`, `CalculatorKeyboard.tsx`, `AuditLogItem.tsx` |
| **P3** | **Composants purs sans `React.memo`** | Re-renders inutiles | `EmailField.tsx`, `PasswordFields.tsx`, `SearchOverlay.tsx` (HighlightedText, RelevanceBadge) |
| **P4** | **Objets constants recrees a chaque render** | Allocations memoire inutiles | `_layout.tsx:27-82` (PAGE_TITLES, PAGE_PARENTS) |
| **P5** | **Pas d'AbortController** sur les appels API longs | Fuites memoire, requetes orphelines | `organisation/index.tsx:68-94` |
| **P6** | **Pas de timeout DB** configure dans Prisma | Risque de blocage | `server/src/utils/prisma.ts` |

---

## 3. DUPLICATION DE CODE

### 3.1 Resume

| Categorie | Fichiers | Lignes dupliquees | Priorite |
|-----------|----------|-------------------|----------|
| **Pages Simulateur** (layout, styles, state identiques) | 16 fichiers | ~2 400-3 200 lignes | **HAUTE** |
| **Article-Metadata** (structures similaires, interfaces inconsistantes) | 9 fichiers | ~5 641 lignes | **HAUTE** |
| **Keyword-Mappings** (meme structure, donnees differentes) | 9 fichiers | ~3 699 lignes | **HAUTE** |
| **Routes Backend** (try/catch, error handling identiques) | 15 fichiers | ~800-1 200 lignes | MOYENNE |
| **Clients API** (boilerplate get/post identique) | 13 fichiers | ~455-585 lignes | MOYENNE |
| **Pages Auth** (layout, styles, validation similaires) | 5 fichiers | ~300-400 lignes | MOYENNE |
| **Total estime** | | **~13 000-15 000 lignes** | |

### 3.2 Details par categorie

#### 3.2.1 Pages Simulateur (16 fichiers, ~2 400-3 200 lignes)

**Fichiers concernes** : `mobile/app/(app)/simulateur/tva.tsx`, `igf.tsx`, `is.tsx`, `patente.tsx`, `ircm.tsx`, `cession-parts.tsx`, `enregistrement.tsx`, `iba.tsx`, `is-parapetrolier.tsx`, `its.tsx`, `paie.tsx`, `contribution-fonciere.tsx`, `solde-liquidation.tsx`, `retenue-source.tsx`, `irf-loyers.tsx`, `index.tsx`

**Pattern duplique dans chaque fichier** :
- Imports identiques (15-20 lignes)
- Fonction `parse()` identique (4 lignes)
- Structure `useMemo` pour calculs
- Layout deux colonnes responsive identique (170+ lignes)
- Styles identiques (60-100 lignes) : container, rowContainer, scrollContent, title, subtitle, descriptionBox

**Solution** : Creer `SimulateurPageTemplate.tsx`

```typescript
interface SimulateurPageProps<T> {
  title: string;
  subtitle?: string;
  description: string;
  serviceFunction: (inputs: T) => Result | null;
  inputs: InputField[];
  resultSections: ResultSection[];
  legalRef?: string;
}
```

#### 3.2.2 Article-Metadata (9 fichiers, ~5 641 lignes)

**Fichiers** : `article-metadata.ts` (2 304 l.), `article-metadata-2026.ts` (384 l.), `article-metadata-is.ts` (644 l.), `article-metadata-il.ts` (738 l.), `article-metadata-dd.ts` (358 l.), `article-metadata-dc.ts` (223 l.), `article-metadata-td.ts` (374 l.), `article-metadata-iba-2026.ts` (503 l.), `article-metadata-pv.ts` (113 l.)

**Problemes** :
- Interfaces inconsistantes entre fichiers (`keywords` vs `themes`, `priority: 1|2|3` vs `priority: number`)
- Articles dupliques entre fichiers (ex: "Art. 1" dans metadata.ts et metadata-2026.ts)
- Memes mots-cles indexes plusieurs fois

**Solution** : Interface `ArticleMetadataUnified` unique avec champ `chapters[]`

#### 3.2.3 Keyword-Mappings (9 fichiers, ~3 699 lignes)

**Fichiers** : `keyword-mappings.ts` (408 l.), `keyword-mappings-2026.ts` (482 l.), `keyword-mappings-is.ts` (269 l.), `keyword-mappings-il.ts` (987 l.), `keyword-mappings-dd.ts` (736 l.), `keyword-mappings-dc.ts` (126 l.), `keyword-mappings-td.ts` (180 l.), `keyword-mappings-pv.ts` (300 l.), `keyword-mappings-iba-2026.ts` (211 l.)

**Problemes** :
- Types inconsistants : `Record<string, string[]>` vs `Record<string, Array<{ article: string; weight: number }>>`
- Pas d'interface partagee
- Chevauchement de mots-cles entre fichiers

**Solution** : Configuration unifiee avec interface `KeywordMapping`

#### 3.2.4 Routes Backend (15 fichiers, ~800-1 200 lignes)

**Pattern duplique ~50 fois** :

```typescript
router.get("/endpoint", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    // ... logique
    res.json({ ... });
  } catch (err) {
    logger.error("[method-name]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
```

**Solution** : Creer un `asyncHandler()` middleware factory

```typescript
export function asyncHandler(fn: (req: AuthRequest, res: Response) => Promise<void>) {
  return (req: AuthRequest, res: Response) => {
    Promise.resolve(fn(req, res)).catch((err) => {
      logger.error("[route]", err);
      res.status(500).json({ error: "Erreur serveur" });
    });
  };
}
```

#### 3.2.5 Clients API Frontend (13 fichiers, ~455-585 lignes)

**Pattern boilerplate identique** :

```typescript
methodName: async (params): Promise<ReturnType> => {
  const { data } = await api.get<ReturnType>("/endpoint");
  return data;
},
```

**Solution** : API client factory `createApiClient<T>(baseEndpoint)`

#### 3.2.6 Pages Auth (5 fichiers, ~300-400 lignes)

**Duplique** : Layout card centre, styles input, regex email, gestion erreurs, footer links

**Solution** : Composant `AuthFormCard.tsx`

---

## 4. QUALITE DE CODE

### 4.1 Fichiers trop volumineux (>300 lignes)

| Fichier | Lignes | Recommandation |
|---------|--------|----------------|
| `server/src/services/orchestrator/agents.ts` | **1 078** | Extraire chaque agent en module separe |
| `server/src/routes/auth.ts` | **1 066** | Extraire register, login, refresh en fichiers separes |
| `components/code/MobileCGIBrowser.tsx` | **600** | Extraire NodeListView, SearchPanel, ArticlePanel |
| `server/src/routes/organization.routes.ts` | **496** | Extraire CRUD en sous-modules |
| `server/src/services/chat.service.ts` | **456** | Extraire streaming et context building |
| `app/(app)/organisation/index.tsx` | **439** | Extraire OrgSettings, MemberSection |
| `app/(app)/simulateur/patente.tsx` | **434** | Utiliser template simulateur |
| `app/(app)/simulateur/paie.tsx` | **417** | Utiliser template simulateur |
| `server/src/services/rag/hybrid-search.service.ts` | **395** | Extraire scoring et filtering |
| `server/src/services/email.service.ts` | **394** | Extraire templates en fichiers separes |
| `components/mobile/SearchOverlay.tsx` | **382** | Extraire HighlightedText, SearchResults |
| `components/securite/MfaSetupFlow.tsx` | **369** | Extraire chaque etape en sous-composant |
| `server/src/routes/mfa.routes.ts` | **365** | Extraire setup/verify/disable |
| `app/(auth)/register.tsx` | **363** | Extraire validation, utiliser AuthFormCard |
| `app/(app)/_layout.tsx` | **360** | Extraire header et navigation |
| `app/(app)/chat/index.tsx` | **342** | Extraire ChatInput, ChatHistory |
| `server/src/services/reminder.service.ts` | **324** | Extraire templates et scheduling |
| `app/(app)/calendrier/index.tsx` | **318** | Extraire CalendarGrid, EventList |
| `components/landing/LandingCountries.tsx` | **305** | Extraire CountryCard |
| `components/paywall/PaywallScreen.tsx` | **302** | Extraire PlanCard, FeatureList |

### 4.2 Problemes de validation

| # | Probleme | Localisation |
|---|----------|-------------|
| **Q1** | Regex email trop simple (`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`) | `register.tsx:98`, `organisation/index.tsx:98` |
| **Q2** | Pas de validation max longueur mot de passe | `register.tsx:90-97` |
| **Q3** | `JSON.parse()` sans validation de structure | `mobile/lib/api/chat.ts:134,161,197` |
| **Q4** | Reponses API non validees cote client (pas de Zod runtime) | `organisation/index.tsx:76-83` |
| **Q5** | Erreurs reseau traitees comme "permission refusee" | `usePermission.ts:10-14` |
| **Q6** | Parsing cookies CSRF fragile (pas d'URL decoding) | `mobile/lib/api/client.ts:81-87` |
| **Q7** | Pas de check division par zero dans les services de calcul | Plusieurs `*.service.ts` |
| **Q8** | Catch blocks vides/silencieux | `useSpeechRecognition.ts:128`, `_layout.tsx:104` |

### 4.3 Bonnes pratiques manquantes

| # | Probleme | Localisation |
|---|----------|-------------|
| **BP1** | Pas de validation `Content-Type` sur les endpoints API | `server/src/app.ts` |
| **BP2** | Pas de tests pour la majorite des services backend | `server/src/__tests__/` (3 fichiers seulement) |
| **BP3** | Pas de tests frontend (0 test de composant) | `mobile/` |
| **BP4** | Organisation slug non valide contre les mots reserves | `server/src/routes/organization.routes.ts:148` |
| **BP5** | Pas de `SECURITY.md` pour la divulgation responsable | Racine du projet |

---

## 5. TAILLE DES FICHIERS

### 5.1 Plus gros fichiers source (hors data JSON)

| Fichier | Lignes |
|---------|--------|
| `server/src/config/article-metadata.ts` | 2 304 |
| `mobile/lib/i18n/locales/fr.json` | 1 245 |
| `mobile/lib/i18n/locales/en.json` | 1 209 |
| `server/src/services/orchestrator/agents.ts` | 1 078 |
| `server/src/routes/auth.ts` | 1 066 |
| `server/src/config/keyword-mappings-il.ts` | 987 |
| `server/src/config/article-metadata-il.ts` | 738 |
| `server/src/config/keyword-mappings-dd.ts` | 736 |
| `server/src/config/article-metadata-is.ts` | 644 |
| `components/code/MobileCGIBrowser.tsx` | 600 |

### 5.2 Plus gros fichiers data JSON

| Fichier | Lignes |
|---------|--------|
| `mobile/package-lock.json` | 18 833 |
| `server/data/articles-2026-tome1.json` | 11 501 |
| `server/data/articles-2026-tome2.json` | 10 212 |
| `server/data/articles-2026-tfnc.json` | 9 975 |
| `server/package-lock.json` | 7 925 |
| `server/data/cgi/2026/rag_chapitre1_is.json` | 3 593 |
| `server/data/cgi/2026/tome1-partie1-livre1-chapitre1.json` | 3 329 |

### 5.3 Repartition du code

| Categorie | Fichiers | Lignes |
|-----------|----------|--------|
| Mobile App Routes | 49 | 9 572 |
| Mobile Components | 89 | 11 384 |
| Mobile Libraries | 61 | 6 044 |
| Mobile Data Files | 152 | ~80 000+ |
| **Mobile Total** | **366** | **27 238** (hors data) |
| Server Routes | 15 | ~3 000 |
| Server Services | 30+ | ~6 000 |
| Server Config | 18 | ~8 000 |
| Server Middleware | 9 | ~900 |
| Server Schemas | 14 | ~1 500 |
| Server Tests | 3 | ~300 |
| Server Data Files | 160 | ~80 000+ |
| **Server Total** | **101** | **21 971** (hors data) |
| **Grand Total** | **468** | **49 209** |

---

## 6. POINTS POSITIFS

- HTTPS force avec redirection 301 et HSTS
- Multi-stage Docker build pour le backend
- Port API non expose publiquement (127.0.0.1 uniquement)
- Validation Zod sur toutes les routes backend (14 schemas)
- Rate limiting et CSRF middleware en place
- Audit logging implemente
- Gzip compression activee
- Healthcheck PostgreSQL configure
- `.env` correctement exclus de git (seuls `.env.example` trackes)
- ErrorBoundary React implemente
- i18n FR/EN complet
- Sentry integre pour le monitoring d'erreurs
- Token refresh avec queue de requetes et replay detection
- Bonne separation des concerns (store, api, services, hooks)
- Architecture multi-tenant avec gestion des organisations

---

## 7. PLAN D'ACTIONS PRIORITAIRES

### 7.1 Immediat (cette semaine)

1. ~~**Rotater tous les secrets** exposes dans les .env~~ **FAIT** — Secrets migres vers GitHub Secrets (15/15), CI/CD genere les `.env` a la volee
2. ~~**Supprimer `unsafe-inline`/`unsafe-eval`** du CSP~~ **FAIT** — Hash SHA-256 pour style Expo, plus aucun unsafe-*
3. **Ajouter `USER node`/`USER nginx`** dans les Dockerfiles
4. ~~**Ajouter `X-Frame-Options: DENY`** dans Nginx~~ **FAIT** — Via `security-headers.conf`
5. **Deplacer les tokens vers httpOnly cookies** (supprimer sessionStorage)

### 7.2 Court terme (1-2 semaines)

6. Mettre a jour la cipher suite SSL/TLS
7. Ajouter les `key` props manquants dans les listes React (7+ corrections)
8. Creer `asyncHandler()` pour les routes backend
9. Ajouter des timeouts proxy Nginx et des limites de ressources Docker
10. ~~Separer la cle de chiffrement MFA du JWT secret~~ **FAIT** — `MFA_ENCRYPTION_KEY` dediee, obligatoire en production
11. ~~Ajouter `Permissions-Policy` et renforcer Helmet~~ **FAIT** — `Permissions-Policy` + Helmet CSP strict

### 7.3 Moyen terme (1 mois)

12. Creer `SimulateurPageTemplate` (economise ~3 000 lignes)
13. Consolider les keyword-mappings et article-metadata
14. Refactorer `auth.ts` (1 066 lignes) et `agents.ts` (1 078 lignes)
15. Ajouter la validation runtime Zod sur les reponses API cote client
16. Implementer `React.memo` et `useCallback` sur les composants critiques
17. Ajouter des tests backend et frontend

### 7.4 Long terme (2-3 mois)

18. ~~Implementer un systeme de gestion de secrets~~ **FAIT** — GitHub Secrets + workflow CI/CD
19. Ajouter des tests d'integration et de penetration
20. ~~Mettre en place un pipeline CI/CD avec scan de securite automatique~~ **FAIT** — `.github/workflows/deploy.yml` (ajouter scan securite en complement)
21. Documenter l'architecture et creer `SECURITY.md`

---

## Resume des vulnerabilites

| Severite | Total | Corrigees | Restantes | Exemples cles |
|----------|-------|-----------|-----------|---------------|
| **CRITIQUE** | 3 | 3 (C1, C2, C3) | 0 | ~~Secrets en clair~~, ~~CSP unsafe-inline~~, ~~Turnstile bypass~~ |
| **HAUTE** | 6 | 0 | 6 | Docker root, sessionStorage tokens, brute force, admin email, SSL faible |
| **MOYENNE** | 9 | 2 (M3, M4) | 7 | Replay token, ~~MFA clair~~, ~~X-Frame-Options~~, rate limiting, pagination |
| **BASSE** | 13 | 1 (B7) | 12 | Health check, audit async, logging, Docker limits, ~~Permissions-Policy~~ |
| **TOTAL** | **31** | **5** | **26** | |

**Progres global : 6/31 vulnerabilites corrigees (19%) — 0 critique restante + CI/CD + cle SSH dediee**

| Categorie qualite | Nombre |
|--------------------|--------|
| Fichiers >300 lignes | 20 |
| Lignes de code dupliquees | ~13 000-15 000 |
| Missing React keys | 7+ |
| Inline functions dans renders | 20+ |
| Problemes de validation | 8 |
