# Audit complet CGI-242 — Rapport de sécurité, stabilité et qualité

**Date :** 27 février 2026
**Portée :** Serveur Express (`/server`) + App mobile React Native/Expo (`/mobile`)
**Fichiers analysés :** 80+ fichiers (routes, middlewares, services, composants, écrans, API clients)
**Total anomalies détectées : 59**

---

## Table des matières

1. [Résumé exécutif](#1-résumé-exécutif)
2. [Anomalies critiques](#2-anomalies-critiques)
3. [Anomalies hautes](#3-anomalies-hautes)
4. [Anomalies moyennes](#4-anomalies-moyennes)
5. [Anomalies basses](#5-anomalies-basses)
6. [Détail par domaine](#6-détail-par-domaine)
   - [6.1 Authentification & JWT](#61-authentification--jwt)
   - [6.2 Rate Limiting](#62-rate-limiting)
   - [6.3 Validation des entrées](#63-validation-des-entrées)
   - [6.4 CORS & Cookies](#64-cors--cookies)
   - [6.5 Permissions & Autorisation](#65-permissions--autorisation)
   - [6.6 Fichiers sensibles](#66-fichiers-sensibles)
   - [6.7 Dépendances](#67-dépendances)
   - [6.8 Thème sombre (mobile)](#68-thème-sombre-mobile)
   - [6.9 Appels API au montage (mobile)](#69-appels-api-au-montage-mobile)
   - [6.10 Formulaires & Validation client](#610-formulaires--validation-client)
   - [6.11 Navigation & Routes](#611-navigation--routes)
   - [6.12 Performance](#612-performance)
7. [Inventaire des endpoints](#7-inventaire-des-endpoints)
8. [Plan de correction recommandé](#8-plan-de-correction-recommandé)

---

## 1. Résumé exécutif

| Sévérité | Serveur | Mobile | Validation | Total |
|----------|---------|--------|------------|-------|
| Critique | 8 | 5 | — | **13** |
| Haute | 7 | 3 | 4 | **14** |
| Moyenne | 5 | 3 | 5 | **13** |
| Basse | 5 | 7 | 7 | **19** |
| **Total** | **25** | **18** | **16** | **59** |

**Verdict :** L'application n'est **pas prête pour un déploiement en production** en l'état. Les 13 anomalies critiques doivent impérativement être corrigées, notamment les fallbacks JWT, l'absence de validation serveur, et le logout mobile qui n'invalide pas les tokens.

---

## 2. Anomalies critiques

### C1 — Fallback JWT `"dev-secret"` en dur dans le code

- **Fichiers :** `server/src/utils/jwt.ts` (l.3-4), `server/src/routes/auth.ts` (l.308), `server/src/routes/mfa.routes.ts` (l.242)
- **Risque :** Si `JWT_SECRET` n'est pas défini en env, n'importe qui peut forger des tokens valides avec le secret `"dev-secret"`
- **Correction :** Le serveur doit refuser de démarrer si `JWT_SECRET` n'est pas défini

### C2 — Salt MFA statique `'salt'`

- **Fichier :** `server/src/services/mfa.service.ts` (l.11, 17, 27)
- **Risque :** Le salt de dérivation est le littéral `'salt'` — affaiblit considérablement le chiffrement AES. De plus, `JWT_SECRET` est réutilisé comme clé de chiffrement
- **Correction :** Utiliser un salt aléatoire unique par secret chiffré et une clé de chiffrement dédiée

### C3 — OTP généré avec `Math.random()`

- **Fichier :** `server/src/utils/otp.ts` (l.2)
- **Risque :** `Math.random()` n'est pas cryptographiquement sûr. Un OTP prédictible permet le contournement de l'authentification
- **Correction :** Utiliser `crypto.randomInt(100000, 999999)`

### C4 — OTP sans expiration vérifiée

- **Fichier :** `server/src/routes/auth.ts` (l.288-361)
- **Risque :** Le champ `emailVerifyExpires` existe dans le schéma Prisma mais n'est jamais vérifié lors de `verify-otp`. Un OTP intercepté reste valide indéfiniment
- **Correction :** Vérifier `emailVerifyExpires > new Date()` avant de valider l'OTP

### C5 — Aucun schéma de validation sur aucun endpoint

- **Fichiers :** Tous les fichiers dans `server/src/routes/`
- **Risque :** Aucune librairie de validation (zod, joi). Toutes les validations sont manuelles et incomplètes. Injection de types inattendus, champs supplémentaires, dépassements de longueur
- **Correction :** Ajouter zod ou joi sur tous les endpoints

### C6 — Pas de limite sur `express.json()` body size

- **Fichier :** `server/src/app.ts` (l.57)
- **Risque :** Un payload JSON de plusieurs Go peut provoquer un OOM (déni de service)
- **Correction :** `express.json({ limit: '1mb' })`

### C7 — Pas de rate limiter dédié sur `/api/chat`

- **Fichier :** `server/src/app.ts` (l.70)
- **Risque :** Le chat appelle l'API Claude (coûteuse). Le rate limiter global (100 req/15min) est insuffisant. Un utilisateur peut générer des coûts importants
- **Correction :** Ajouter un rate limiter dédié (ex: 20 req/heure par utilisateur)

### C8 — Quota chat vérifié après l'appel Claude

- **Fichier :** `server/src/services/chat.service.ts` (l.322, 439-446)
- **Risque :** `incrementQuota` est appelé en fire-and-forget après la réponse. Le middleware `checkQuestionQuota` existe mais n'est pas utilisé dans les routes chat
- **Correction :** Appliquer `checkQuestionQuota` AVANT l'appel Claude

### C9 — Le logout mobile n'invalide pas le token côté serveur

- **Fichier :** `mobile/lib/store/auth.ts` (l.93-108)
- **Risque :** Le logout ne fait que nettoyer le state local. Le JWT reste valide côté serveur jusqu'à expiration. Un token volé reste exploitable
- **Correction :** Appeler `POST /api/auth/logout` avant de nettoyer le state local

### C10 — 12 écrans avec appels API au montage pouvant déconnecter

- **Fichiers :** `alertes/index.tsx`, `profil/index.tsx`, `parametres/index.tsx`, `abonnement/index.tsx`, `admin/index.tsx`, `analytics/index.tsx`, `audit/index.tsx`, `organisation/index.tsx`, `permissions/index.tsx`, `securite/index.tsx`, `chat/index.tsx` (x2)
- **Risque :** Un 401 au montage → l'intercepteur axios tente un refresh → si le refresh échoue → `forceLogout()` → déconnexion brutale sans explication
- **Correction :** Pattern de protection : afficher un message d'erreur avec bouton de reconnexion au lieu de forceLogout immédiat

### C11 — 9 écrans sans `useTheme()` — cassés en mode sombre

- **Fichiers :** `abonnement/index.tsx`, `admin/index.tsx`, `analytics/index.tsx`, `audit/index.tsx`, `organisation/index.tsx`, `permissions/index.tsx`, `securite/index.tsx`, `legal/cgu.tsx`, `legal/confidentialite.tsx`
- **Risque :** Texte noir sur fond noir en mode sombre — écrans illisibles
- **Correction :** Migrer vers `useTheme()` + `colors.*`

### C12 — `devCode` OTP affiché sans condition `__DEV__`

- **Fichier :** `mobile/app/(auth)/verify-otp.tsx` (l.93)
- **Risque :** Si le backend renvoie accidentellement `devCode` en production, le code OTP sera visible à l'écran
- **Correction :** Remplacer `{devCode ? (` par `{__DEV__ && devCode ? (`

### C13 — `user!` non-null assertion dangereux

- **Fichier :** `mobile/app/(auth)/verify-otp.tsx` (l.49)
- **Risque :** Si `data.user` et `user` sont tous deux null, `null` est passé à `login()` ce qui corrompt l'état d'authentification
- **Correction :** Ajouter une vérification explicite

---

## 3. Anomalies hautes

### H1 — Admin global basé sur un email en env var

- **Fichiers :** `server/src/routes/admin.routes.ts` (l.17-33), `server/src/routes/ingestion.routes.ts` (l.15-27)
- **Risque :** Pas de rôle `ADMIN` dans le schéma Prisma. Si `ADMIN_EMAIL` n'est pas défini → erreur 503

### H2 — Pas de validation mot de passe à l'inscription (serveur)

- **Fichier :** `server/src/routes/auth.ts` (l.71-78)
- **Risque :** Seul `reset-password` vérifie `length < 8`. L'inscription accepte un mot de passe d'1 caractère

### H3 — `send-otp-email` et `forgot-password` sans `sensitiveLimiter`

- **Fichier :** `server/src/routes/auth.ts` (l.387, 442)
- **Risque :** Permet l'envoi massif d'emails (spam, coûts)

### H4 — `check-email` permet l'énumération d'emails

- **Fichier :** `server/src/routes/auth.ts` (l.668)
- **Risque :** Renvoie `{ exists: true/false }` sans rate limiter spécifique

### H5 — Vulnérabilités connues dans `qs` (via `voyageai`)

- **Risque :** 2 vulnérabilités de sévérité haute (DoS par épuisement mémoire). Pas de correctif disponible

### H6 — Pas de `.env.example`

- **Risque :** Force les développeurs à copier le `.env` réel avec les secrets

### H7 — Swagger exposé sans auth en production

- **Fichier :** `server/src/app.ts` (l.64-65)
- **Risque :** Expose la surface d'attaque complète de l'API

### H8 — 7 écrans auth utilisent `className` sans dark mode

- **Fichiers :** `index.tsx`, `password.tsx`, `register.tsx`, `verify-otp.tsx`, `mfa-verify.tsx`, `forgot-password.tsx`, `reset-password.tsx`
- **Risque :** Deux systèmes de couleurs incohérents (NativeWind vs ThemeContext)

### H9 — Couleurs hardcodées dans des composants thémés

- **Fichiers :** `code/index.tsx`, `HistoryPanel.tsx`, `ActivityStats.tsx`, dashboard `index.tsx`
- **Risque :** Éléments non thémés visibles en mode sombre

### H10 — Pas de regex email à l'inscription (mobile)

- **Fichier :** `mobile/app/(auth)/register.tsx` (l.37)
- **Risque :** L'utilisateur peut soumettre `"not-an-email"` sans erreur client

### H11 — Regex email trop permissive au login

- **Fichier :** `mobile/app/(auth)/index.tsx` (l.24)
- **Risque :** `/\S+@\S+\.\S+/` accepte `a@b.c`, `@@@.@`

### H12 — Aucune validation dans le profil

- **Fichier :** `mobile/app/(app)/profil/index.tsx` (l.72)
- **Risque :** Nom/prénom vides acceptés, téléphone sans format

### H13 — Pas de `maxLength` sur le chat input

- **Fichier :** `mobile/components/chat/ChatInput.tsx`
- **Risque :** Un texte de plusieurs Mo peut être envoyé, surchargeant le serveur et l'API Claude

### H14 — Mot de passe base de données faible

- **Fichier :** `server/.env` (l.5)
- **Risque :** `cgi242pass` est un mot de passe trivial pour PostgreSQL

---

## 4. Anomalies moyennes

### M1 — `$queryRawUnsafe` dans le health check

- **Fichier :** `server/src/app.ts` (l.95)
- **Correction :** Utiliser `$queryRaw` avec template literal

### M2 — Token blacklist en mémoire (non persistante)

- **Fichier :** `server/src/utils/cache.ts`
- **Risque :** Au redémarrage du serveur, tous les tokens blacklistés redeviennent valides

### M3 — Actions audit non déclarées dans l'enum Prisma

- **Fichier :** `server/src/routes/auth.ts` (l.134, 460, 547)
- **Risque :** `REGISTER`, `PASSWORD_RESET_REQUESTED`, `PASSWORD_CHANGED` provoqueront des erreurs Prisma

### M4 — Aucune validation de format UUID sur les paramètres de route

- **Fichiers :** Tous les endpoints avec `:id`, `:userId`, `:orgId`, `:invId`
- **Risque :** Erreurs Prisma non gérées exposées au client

### M5 — Pas de bornes max sur `days`/`limit` dans les query params

- **Fichiers :** `analytics.routes.ts`, `audit.routes.ts`
- **Risque :** Requêtes de base de données coûteuses (`days=999999`)

### M6 — `setTimeout` sans cleanup

- **Fichiers :** `verify-otp.tsx` (l.64), `reset-password.tsx` (l.46-48, 61)
- **Risque :** Callbacks exécutés sur composant démonté

### M7 — Speech recognition non fonctionnelle sur mobile natif

- **Fichier :** `mobile/lib/hooks/useSpeechRecognition.ts` (l.62-79)
- **Risque :** Aucun listener natif enregistré, le transcript ne sera jamais mis à jour sur mobile

### M8 — Pas de complexité mot de passe

- **Fichiers :** `register.tsx`, `reset-password.tsx`
- **Risque :** Seule la longueur (12 caractères) est vérifiée, pas la complexité

### M9 — Pas de cooldown sur les boutons de renvoi OTP

- **Fichiers :** `verify-otp.tsx`, `reset-password.tsx`
- **Risque :** Spam d'emails côté client

### M10 — Pas de validation email dans `forgot-password` et invitation

- **Fichiers :** `forgot-password.tsx`, `organisation/index.tsx`
- **Risque :** Envoi de requêtes avec des emails invalides

### M11 — OTP exposé en réponse API hors production

- **Fichier :** `server/src/routes/auth.ts` (l.157, 252, 410, 471)
- **Risque :** Si un environnement de staging est exposé sur internet, l'OTP est dans la réponse JSON

### M12 — Requêtes sans origin autorisées (CORS)

- **Fichier :** `server/src/app.ts` (l.47)
- **Risque :** Les requêtes curl/mobile sans header `Origin` contournent la protection CORS

### M13 — Quota non vérifié en amont pour le chat

- **Fichier :** `server/src/services/chat.service.ts`
- **Risque :** Un utilisateur rapide peut dépasser son quota

---

## 5. Anomalies basses

| # | Zone | Problème | Fichier |
|---|------|----------|---------|
| B1 | Serveur | Rate limiter auth laxiste en dev (100 au lieu de 5) | `rateLimit.middleware.ts` l.22 |
| B2 | Serveur | Risque XSS limité (réponses JSON, pas de HTML) | Global |
| B3 | Serveur | 18 endpoints serveur non utilisés par le mobile | Voir §7 |
| B4 | Serveur | Montage `user` / `user/stats` fragile | `app.ts` l.77, 81 |
| B5 | Serveur | Durée tokens acceptable (15min / 7j) | `jwt.ts` |
| B6 | Mobile | Imports inutilisés (`Share`, `ActivityIndicator`, `router`) | `analytics`, `code`, `abonnement` |
| B7 | Mobile | `catch (err: any)` anti-TypeScript | `profil/index.tsx` l.94 |
| B8 | Mobile | `useEffect` avec dep manquante (`onChangeText`) | `ChatInput.tsx` l.24-28 |
| B9 | Mobile | Objets recréés à chaque render (ECHEANCES, QUICK_ACTIONS) | `index.tsx` l.56-95 |
| B10 | Mobile | `color: "#fff"` dans avatar du layout | `_layout.tsx` l.137 |
| B11 | Mobile | `backgroundColor="#00815d"` sur StatusBar | `_layout.tsx` l.41 |
| B12 | Mobile | Couleurs hardcodées dans logout | `logout.tsx` l.24, 30 |
| B13 | Validation | Pas de protection appuis multiples (login) | `index.tsx` |
| B14 | Validation | Téléphone sans validation de format | `register.tsx` |
| B15 | Validation | Pas de borne supérieure sur montants simulateurs | Tous les simulateurs |
| B16 | Validation | Pas de sanitization du texte chat | `ChatInput.tsx` |
| B17 | Validation | Code TOTP accepte des lettres | `securite/index.tsx` |
| B18 | Validation | Navigation parametres → forgot-password sort de (app) | `parametres/index.tsx` l.86 |
| B19 | Mobile | `setTimeout` mineur dans chat scrollToBottom | `chat/index.tsx` l.65 |

---

## 6. Détail par domaine

### 6.1 Authentification & JWT

| Élément | Statut | Détail |
|---------|--------|--------|
| Durée access token | ✅ OK | 15 minutes |
| Durée refresh token | ✅ OK | 7 jours |
| Rotation refresh token | ✅ OK | Implémentée avec blacklist |
| Cookies httpOnly | ✅ OK | `httpOnly: true` |
| Cookies secure | ✅ OK | `secure: isProduction` |
| Cookies sameSite | ✅ OK | `strict` en prod, `lax` en dev |
| Fallback JWT secret | ❌ CRITIQUE | `"dev-secret"` en dur |
| Salt MFA | ❌ CRITIQUE | Littéral `'salt'` |
| Génération OTP | ❌ CRITIQUE | `Math.random()` |
| Expiration OTP | ❌ CRITIQUE | Non vérifiée |
| Logout mobile → serveur | ❌ CRITIQUE | Non implémenté |

### 6.2 Rate Limiting

| Endpoint | Rate Limiter | Statut |
|----------|-------------|--------|
| `/api/auth/*` | `authLimiter` (5 req/15min prod) | ✅ OK |
| `/api/auth/reset-password` | `sensitiveLimiter` | ✅ OK |
| `/api/mfa/enable,disable` | `sensitiveLimiter` | ✅ OK |
| `/api/chat/*` | Global seulement (100 req/15min) | ❌ Insuffisant |
| `/api/auth/send-otp-email` | Global seulement | ❌ Manque `sensitiveLimiter` |
| `/api/auth/forgot-password` | Global seulement | ❌ Manque `sensitiveLimiter` |
| `/api/auth/check-email` | Global seulement | ❌ Permet énumération |
| Toutes autres routes | Global (100 req/15min) | ⚠️ Acceptable |

### 6.3 Validation des entrées

**Serveur — Aucune librairie de validation utilisée.**

| Endpoint | Validation actuelle | Manque |
|----------|-------------------|-------|
| `POST /auth/register` | `if (!email \|\| !password)` | Format email, longueur/complexité password |
| `POST /auth/login` | `if (!email \|\| !password)` | Format email |
| `POST /auth/verify-otp` | `if (!email \|\| !otp)` | Format/longueur OTP, expiration |
| `POST /chat/message/stream` | `if (!content)` | Longueur max, quota en amont |
| `POST /organizations` | Minimal | Validation complète du body |
| Routes avec `:id` | Aucune | Format UUID |
| Query params `days`, `limit` | Aucune | Bornes min/max |

### 6.4 CORS & Cookies

| Élément | Statut |
|---------|--------|
| Pas de `origin: "*"` | ✅ OK |
| Whitelist dynamique via `CORS_ORIGIN` | ✅ OK |
| `credentials: true` avec origins spécifiques | ✅ OK |
| Requêtes sans Origin autorisées (mobile) | ⚠️ Nécessaire mais contourne CORS |

### 6.5 Permissions & Autorisation

| Élément | Statut |
|---------|--------|
| Routes organisation : `requireAuth → resolveTenant → requireOrg → requireMember/Admin/Owner` | ✅ OK |
| Routes analytics/audit : `requireAdmin` | ✅ OK |
| Routes admin : vérification `ADMIN_EMAIL` | ⚠️ Fragile |
| Routes chat : pas de `checkQuestionQuota` | ❌ Quota non vérifié |
| Isolation des données chat par `creatorId` | ✅ OK |

### 6.6 Fichiers sensibles

| Élément | Statut |
|---------|--------|
| `.env` dans `.gitignore` | ✅ OK |
| `.env.example` existant | ❌ Absent |
| Secrets réels dans `.env` | ⚠️ Normal mais à sécuriser |
| OTP dans réponses hors production | ⚠️ Risque si staging exposé |
| Mot de passe BDD faible (`cgi242pass`) | ❌ À renforcer |

### 6.7 Dépendances

| Package | Problème | Sévérité |
|---------|----------|----------|
| `voyageai` → `qs` | 2 vulnérabilités DoS (GHSA-6rw7, GHSA-w7fw) | Haute |
| Pas de correctif disponible | Surveiller les mises à jour | — |

### 6.8 Thème sombre (mobile)

**Écrans migrés (utilisent `useTheme()`) :**
- ✅ Dashboard (`index.tsx`)
- ✅ Paramètres (`parametres/index.tsx`)
- ✅ Profil (`profil/index.tsx`)
- ✅ Alertes (`alertes/index.tsx`)
- ✅ Chat (`chat/index.tsx`)
- ✅ Simulateurs (5 fichiers)
- ✅ Sidebar (`Sidebar.tsx`)
- ✅ Layout (`_layout.tsx`)

**Écrans NON migrés (couleurs hardcodées, cassés en dark mode) :**
- ❌ Abonnement (`abonnement/index.tsx`)
- ❌ Admin (`admin/index.tsx`)
- ❌ Analytics (`analytics/index.tsx`)
- ❌ Audit (`audit/index.tsx`)
- ❌ Organisation (`organisation/index.tsx`)
- ❌ Permissions (`permissions/index.tsx`)
- ❌ Sécurité (`securite/index.tsx`)
- ❌ CGU (`legal/cgu.tsx`)
- ❌ Confidentialité (`legal/confidentialite.tsx`)
- ❌ Écrans auth (7 fichiers — utilisent `className` NativeWind)
- ❌ Code (`code/index.tsx` — partiellement migré)

### 6.9 Appels API au montage (mobile)

Tous ces écrans font des appels API via l'instance axios au montage. Un token expiré + refresh échoué = déconnexion brutale.

| Écran | API appelée | Risque |
|-------|-----------|-------|
| `alertes/index.tsx` | `alertesApi.getStats()` + `getAlertes()` | Haute |
| `profil/index.tsx` | `userApi.getProfile()` | Haute |
| `parametres/index.tsx` | `userApi.getProfile()` + `getStats()` | Haute |
| `abonnement/index.tsx` | `subscriptionApi.getQuota()` | Haute |
| `admin/index.tsx` | `adminApi.getOrganizations()` | Haute |
| `analytics/index.tsx` | `analyticsApi.getDashboard()` + 2 autres | Haute |
| `audit/index.tsx` | `auditApi.getStats()` + `getOrganizationLogs()` | Haute |
| `organisation/index.tsx` | `organizationApi.getOrganization()` + 2 autres | Haute |
| `permissions/index.tsx` | `permissionsApi.getMyPermissions()` + 2 autres | Haute |
| `securite/index.tsx` | `mfaApi.getStatus()` | Haute |
| `chat/index.tsx` | `getConversations()`, `getConversation()` | Moyenne |

### 6.10 Formulaires & Validation client

| Formulaire | Email validé | Password validé | Champs requis | Loading state | Anti double-clic |
|-----------|-------------|----------------|---------------|--------------|-----------------|
| Login email | ⚠️ Regex faible | — | ✅ | ❌ Absent | ❌ Absent |
| Password | — | ❌ Aucune validation | ✅ | ✅ | ✅ |
| Register | ❌ Absent | ⚠️ Longueur seule | ✅ | ✅ | ✅ |
| Forgot password | ❌ Absent | — | ✅ | ✅ | ✅ |
| Reset password | — | ⚠️ Longueur seule | ✅ | ✅ | ✅ |
| Verify OTP | — | — | ✅ | ✅ | ✅ |
| MFA verify | — | — | ✅ | ✅ | ✅ |
| Profil | — | — | ❌ Absent | ✅ | ✅ |
| Chat input | — | — | ✅ | ✅ | ✅ |
| Organisation invite | ❌ Absent | — | ✅ | ✅ | ✅ |

### 6.11 Navigation & Routes

| Vérification | Statut |
|-------------|--------|
| Toutes les Stack.Screen ont un fichier correspondant | ✅ OK |
| Tous les fichiers pages sont déclarés dans Stack.Screen | ✅ OK |
| Tous les `router.push()` pointent vers des routes existantes | ✅ OK |
| Aucun lien mort détecté | ✅ OK |
| Toutes les routes serveur sont montées dans `app.ts` | ✅ OK |
| Aucun fichier route orphelin | ✅ OK |

### 6.12 Performance

| Problème | Fichier | Sévérité |
|----------|---------|----------|
| `setTimeout` sans cleanup | `verify-otp.tsx`, `reset-password.tsx` | Moyenne |
| Speech recognition non fonctionnelle sur mobile natif | `useSpeechRecognition.ts` | Moyenne |
| `useEffect` dep manquante (`onChangeText`) | `ChatInput.tsx` | Basse |
| Objets recréés à chaque render | `index.tsx` (dashboard) | Basse |
| `setTimeout` scroll sans cleanup | `chat/index.tsx` | Basse |

---

## 7. Inventaire des endpoints

**Total : 80 endpoints serveur, 58 appelés par le mobile**

### Endpoints serveur non utilisés par le mobile (18)

| Endpoint | Raison probable |
|----------|----------------|
| `POST /api/auth/check-email` | Non implémenté côté mobile |
| `POST /api/auth/logout` | Logout local seulement (BUG) |
| `POST /api/auth/logout-all` | Non exposé |
| `POST /api/organizations` | Création via inscription |
| `POST /api/organizations/accept-invitation` | Non implémenté |
| `POST /api/organizations/:id/restore` | Non exposé |
| `DELETE /api/organizations/:id/permanent` | Non exposé |
| `GET /api/subscription` | Seul `/quota` est utilisé |
| `POST /api/subscription/activate` | Via admin seulement |
| `POST /api/subscription/renew` | Via admin seulement |
| `POST /api/subscription/upgrade` | Non implémenté |
| `GET /api/permissions/check/:permission` | Non utilisé |
| `GET /api/audit/entity/:type/:id` | Non utilisé |
| `POST /api/audit/cleanup` | Non exposé |
| `POST /api/alertes-fiscales/extract` | Admin-only |
| `POST /api/ingestion/articles` | Admin-only |
| `POST /api/ingestion/sources` | Admin-only |
| `GET /api/ingestion/stats` | Admin-only |

---

## 8. Plan de correction recommandé

### Phase 1 — Sécurité critique (priorité immédiate)

1. **Supprimer les fallbacks JWT** — Le serveur doit crasher au démarrage si `JWT_SECRET` n'est pas défini
2. **OTP cryptographique** — `crypto.randomInt(100000, 999999)` + vérification expiration
3. **Salt MFA aléatoire** — Clé de chiffrement dédiée, salt unique par secret
4. **Validation serveur** — Ajouter zod sur register, login, chat, organisation
5. **Body size limit** — `express.json({ limit: '1mb' })`
6. **Rate limiter chat** — 20 req/heure par utilisateur
7. **Quota chat en amont** — Appliquer `checkQuestionQuota` avant l'appel Claude
8. **Logout mobile → API** — Appeler `POST /api/auth/logout` avant nettoyage local

### Phase 2 — Stabilité haute (1-2 jours)

9. **Protéger les appels API au montage** — Pattern anti-déconnexion sur les 12 écrans
10. **Migrer les 9 écrans restants vers le thème sombre**
11. **Corriger `devCode`** sans `__DEV__` dans verify-otp
12. **Corriger `user!`** dans verify-otp
13. **Ajouter `sensitiveLimiter`** sur `send-otp-email` et `forgot-password`
14. **Validation email** côté mobile (regex correcte sur tous les formulaires)
15. **Validation mot de passe** — Complexité (majuscule, chiffre, spécial)
16. **`maxLength` sur chat input** — 4000 caractères
17. **Créer `.env.example`**

### Phase 3 — Qualité moyenne (3-5 jours)

18. Validation UUID sur les paramètres de route
19. Bornes max sur query params (`days`, `limit`)
20. Ajouter les actions manquantes dans l'enum Prisma `AuditAction`
21. Cleanup des `setTimeout`
22. Cooldown sur les boutons de renvoi OTP
23. Conditionner Swagger à `NODE_ENV !== 'production'`
24. Migrer token blacklist vers Redis/PostgreSQL
25. Corriger speech recognition mobile natif
26. Validation profil (champs requis, format téléphone)

### Phase 4 — Nettoyage (optionnel)

27. Unifier le système de style (supprimer NativeWind ou migrer tout vers)
28. Supprimer imports inutilisés
29. Renforcer mot de passe PostgreSQL
30. Supprimer les endpoints serveur non utilisés ou les documenter

---

*Rapport généré le 27 février 2026 — CGI-242 v1.0.0*
