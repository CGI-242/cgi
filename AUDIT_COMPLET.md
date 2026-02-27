# Audit complet CGI-242 — Rapport de sécurité, stabilité et qualité

**Date :** 27 février 2026
**Dernière mise à jour :** 27 février 2026 (post-corrections B3 + fix dotenv)
**Portée :** Serveur Express (`/server`) + App mobile React Native/Expo (`/mobile`)
**Fichiers analysés :** 80+ fichiers (routes, middlewares, services, composants, écrans, API clients)
**Total anomalies détectées : 59** — **57 corrigées ✅, 2 restantes (informationnelles)**

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

| Sévérité | Total | Corrigées ✅ | Restantes ❌ |
|----------|-------|-------------|-------------|
| Critique | **13** | **13** | **0** |
| Haute | **14** | **14** | **0** |
| Moyenne | **13** | **13** | **0** |
| Basse | **19** | **17** | **2** |
| **Total** | **59** | **57** | **2** |

**Progrès :** Les 59 anomalies sont traitées. 57 sont corrigées par des modifications de code. Les 2 restantes (B2, B5) sont documentaires/informationnelles et ne nécessitent aucune correction de code.

**Verdict :** L'application est désormais **entièrement auditée et corrigée**. Toutes les vulnérabilités et anomalies de qualité sont résolues : JWT sécurisé, MFA TOTP, OTP crypto, rate limiting, validation Zod intégrale, CORS renforcé, quota atomique, blacklist persistante, complexité mot de passe, cooldown OTP, speech recognition natif, cleanup des timers, protection anti-déconnexion, thème cohérent, imports nettoyés, performance render optimisée, validation formulaires complète, navigation sécurisée, et **17 endpoints serveur câblés dans l'app mobile** (B3).

---

## 2. Anomalies critiques

### C1 — ~~Fallback JWT `"dev-secret"` en dur dans le code~~ ✅ CORRIGÉ

- **Fichiers :** `server/src/utils/jwt.ts`, `server/src/routes/auth.ts`
- **Correction appliquée :** Le serveur crash au démarrage si `JWT_SECRET` ou `JWT_REFRESH_SECRET` ne sont pas définis. Les fallbacks `"dev-secret"` et `"dev-refresh"` ont été supprimés partout, y compris dans la vérification MFA (`auth.ts`).

### C2 — ~~Salt MFA statique `'salt'`~~ ✅ CORRIGÉ

- **Fichier :** `server/src/services/mfa.service.ts`
- **Correction appliquée :** Salt aléatoire de 16 octets généré par `crypto.randomBytes(16)` pour chaque chiffrement. Format de stockage mis à jour (`salt:iv:authTag:encrypted`). Rétro-compatibilité maintenue pour l'ancien format (3 parties). Clé de chiffrement dédiée via `MFA_ENCRYPTION_KEY` (fallback sur `JWT_SECRET`).

### C3 — ~~OTP généré avec `Math.random()`~~ ✅ CORRIGÉ

- **Fichier :** `server/src/utils/otp.ts`
- **Correction appliquée :** Remplacement par `crypto.randomInt(100000, 1000000)` — générateur cryptographiquement sûr.

### C4 — ~~OTP sans expiration vérifiée~~ ✅ CORRIGÉ

- **Fichier :** `server/src/routes/auth.ts`
- **Correction appliquée :** Stockage de `emailVerifyExpires` (10 minutes) lors de la génération d'OTP dans register, login et send-otp-email. Vérification `emailVerifyExpires > new Date()` dans le endpoint `verify-otp`. Un OTP expiré retourne `401 "Code OTP expiré"`.

### C5 — ~~Aucun schéma de validation sur aucun endpoint~~ ✅ CORRIGÉ

- **Fichiers :** `server/src/middleware/validate.middleware.ts`, `server/src/schemas/` (15 fichiers), tous les fichiers routes
- **Correction appliquée :** Installation de Zod. Middleware `validate()` générique créé pour valider body, query et params. 15 fichiers de schemas Zod couvrant tous les endpoints (auth, mfa, chat, organization, subscription, permission, notifications, user, ingestion, admin, audit, alertes-fiscales, analytics, search-history). Les checks manuels redondants (`if (!field)`, `parseInt(...) || default`, `typeof !== "string"`) ont été remplacés par la validation Zod avec coercion de types et valeurs par défaut. La logique métier (vérification en BDD, comparaison de mot de passe, etc.) reste inchangée.

### C6 — ~~Pas de limite sur `express.json()` body size~~ ✅ CORRIGÉ

- **Fichier :** `server/src/app.ts`
- **Correction appliquée :** `express.json({ limit: '1mb' })` ajouté.

### C7 — ~~Pas de rate limiter dédié sur `/api/chat`~~ ✅ CORRIGÉ

- **Fichiers :** `server/src/middleware/rateLimit.middleware.ts`, `server/src/app.ts`
- **Correction appliquée :** Nouveau `chatLimiter` créé (30 req/h en production, 200 en dev). Appliqué sur toutes les routes `/api/chat`.

### C8 — ~~Quota chat vérifié après l'appel Claude~~ ✅ CORRIGÉ

- **Fichier :** `server/src/routes/chat.ts`
- **Correction appliquée :** Middleware chain `requireAuth → resolveTenant → checkQuestionQuota` appliqué AVANT le handler du stream. Validation de longueur max (4000 caractères) ajoutée.

### C9 — ~~Le logout mobile n'invalide pas le token côté serveur~~ ✅ CORRIGÉ

- **Fichier :** `mobile/lib/store/auth.ts`
- **Correction appliquée :** La fonction `logout()` du store Zustand appelle désormais `api.post("/auth/logout")` avant de nettoyer le state local. Un `try/catch` silencieux garantit que le nettoyage local se fait même si l'appel échoue (offline).

### C10 — ~~12 écrans avec appels API au montage pouvant déconnecter~~ ✅ CORRIGÉ

- **Fichiers modifiés :** `mobile/lib/store/auth.ts`, `mobile/lib/api/client.ts`, `mobile/app/(app)/_layout.tsx`
- **Fichier créé :** `mobile/components/SessionExpiredModal.tsx`
- **Correction appliquée :** `forceLogout()` ne déclenche plus `logout()` directement. Il met `sessionExpired: true` dans le store (sans toucher `isAuthenticated`), ce qui affiche un modal `<SessionExpiredModal />` informant l'utilisateur que sa session a expiré. Le bouton "Se reconnecter" appelle `logout()` pour rediriger proprement vers l'écran de connexion. Les 11 écrans avec appels API au montage sont protégés sans modification individuelle.

### C11 — ~~9 écrans sans `useTheme()` — cassés en mode sombre~~ ✅ CORRIGÉ

- **Fichiers :** `abonnement/index.tsx`, `admin/index.tsx`, `analytics/index.tsx`, `audit/index.tsx`, `organisation/index.tsx`, `permissions/index.tsx`, `securite/index.tsx`, `legal/cgu.tsx`, `legal/confidentialite.tsx`
- **Correction appliquée :** Les 9 écrans + `code/index.tsx` ont été migrés vers `useTheme()` avec remplacement complet des couleurs hardcodées par des tokens `colors.*`. Les en-têtes noirs (`#1a1a1a`) ont été supprimés.

### C12 — ~~`devCode` OTP affiché sans condition `__DEV__`~~ ✅ CORRIGÉ

- **Fichier :** `mobile/app/(auth)/verify-otp.tsx`
- **Correction appliquée :** Remplacement de `{devCode ? (` par `{__DEV__ && devCode ? (` — le code OTP n'apparaît plus en production.

### C13 — ~~`user!` non-null assertion dangereux~~ ✅ CORRIGÉ

- **Fichier :** `mobile/app/(auth)/verify-otp.tsx`
- **Correction appliquée :** Vérification explicite `const loginUser = data.user || user; if (!loginUser) { setError(...); return; }` avant l'appel à `login()`.

---

## 3. Anomalies hautes

### H1 — ~~Admin global basé sur un email en env var~~ ✅ CORRIGÉ

- **Fichiers modifiés :** `server/prisma/schema.prisma`, `server/src/routes/admin.routes.ts`, `server/src/routes/ingestion.routes.ts`
- **Fichiers créés :** `server/src/middleware/requireAdmin.ts`, `server/prisma/migrations/20260227120000_add_user_role/migration.sql`
- **Correction appliquée :** Ajout d'un enum `UserRole` (`USER`, `ADMIN`) et d'un champ `role` au modèle `User` (défaut `USER`). Middleware `requireAdmin` partagé créé — vérifie `user.role === 'ADMIN'` en base. Rétro-compatibilité : si `ADMIN_EMAIL` match, l'utilisateur est automatiquement promu `ADMIN` en base lors de sa première requête admin. Les `requireAdmin` locaux dupliqués dans `admin.routes.ts` et `ingestion.routes.ts` sont supprimés. Plus de 503 si `ADMIN_EMAIL` n'est pas défini.

### H2 — ~~Pas de validation mot de passe à l'inscription (serveur)~~ ✅ CORRIGÉ

- **Fichier :** `server/src/routes/auth.ts`
- **Correction appliquée :** Validation `password.length < 8` ajoutée dans le endpoint `register` avec retour `400 "Le mot de passe doit contenir au moins 8 caractères"`.

### H3 — ~~`send-otp-email` et `forgot-password` sans `sensitiveLimiter`~~ ✅ CORRIGÉ

- **Fichier :** `server/src/routes/auth.ts`
- **Correction appliquée :** `sensitiveLimiter` ajouté sur les routes `POST /send-otp-email` et `POST /forgot-password`.

### H4 — ~~`check-email` permet l'énumération d'emails~~ ✅ CORRIGÉ

- **Fichier :** `server/src/routes/auth.ts`
- **Correction appliquée :** `sensitiveLimiter` ajouté sur la route `POST /check-email` pour limiter les tentatives d'énumération.

### H5 — ~~Vulnérabilités connues dans `qs` (via `voyageai`)~~ ✅ CORRIGÉ

- **Fichier modifié :** `server/src/services/rag/embeddings.service.ts`, `server/package.json`
- **Correction appliquée :** Remplacement du SDK `voyageai` (qui dépendait de `qs@6.11.2` vulnérable) par un appel direct à l'API REST Voyage AI via `fetch` natif. Le service d'embeddings conserve la même interface (`generateEmbedding`, `generateEmbeddings`), le même modèle (`voyage-multilingual-2`) et le même cache. 11 packages supprimés, `npm audit` retourne 0 vulnérabilités.

### H6 — ~~Pas de `.env.example`~~ ✅ CORRIGÉ

- **Fichier :** `server/.env.example` créé
- **Correction appliquée :** Fichier `.env.example` créé avec toutes les variables d'environnement documentées (sans secrets). Inclut JWT, MFA, Anthropic, Qdrant, Voyage AI, SMTP, CORS.

### H7 — ~~Swagger exposé sans auth en production~~ ✅ CORRIGÉ

- **Fichier :** `server/src/app.ts`
- **Correction appliquée :** Swagger UI et le JSON spec sont conditionnés à `process.env.NODE_ENV !== "production"`.

### H8 — ~~7 écrans auth utilisent `className` sans dark mode~~ ✅ CORRIGÉ

- **Fichiers :** `(auth)/index.tsx`, `(auth)/password.tsx`, `(auth)/register.tsx`, `(auth)/verify-otp.tsx`, `(auth)/mfa-verify.tsx`, `(auth)/forgot-password.tsx`, `(auth)/reset-password.tsx`
- **Correction appliquée :** Les 7 écrans auth ont été migrés de `className` (NativeWind) vers `useTheme()` + styles inline avec tokens `colors.*`. Toutes les couleurs hardcodées (`#888`, `bg-red-50`, `bg-green-50`) remplacées par des tokens du thème (`colors.textMuted`, `colors.danger + "15"`, `colors.success + "15"`). Le dark mode fonctionne désormais sur tous les écrans.

### H9 — ~~Couleurs hardcodées dans des composants thémés~~ ✅ CORRIGÉ

- **Fichiers :** `code/index.tsx`, `HistoryPanel.tsx`
- **Correction appliquée :** `code/index.tsx` entièrement migré vers `useTheme()`. `HistoryPanel.tsx` : remplacement de `"#2a2a2a"` par `colors.input`.

### H10 — ~~Pas de regex email à l'inscription (mobile)~~ ✅ CORRIGÉ

- **Fichier :** `mobile/app/(auth)/register.tsx`
- **Correction appliquée :** Regex email stricte `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` ajoutée avant soumission.

### H11 — ~~Regex email trop permissive au login~~ ✅ CORRIGÉ

- **Fichier :** `mobile/app/(auth)/index.tsx`
- **Correction appliquée :** Regex remplacée par `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` (exige 2+ caractères après le dernier point).

### H12 — ~~Aucune validation dans le profil~~ ✅ CORRIGÉ

- **Fichier :** `mobile/app/(app)/profil/index.tsx`
- **Correction appliquée :** Validation nom/prénom requis et format téléphone (`/^[+]?[\d\s()-]{6,20}$/`). Messages d'erreur ajoutés dans les fichiers i18n (fr.json et en.json).

### H13 — ~~Pas de `maxLength` sur le chat input~~ ✅ CORRIGÉ

- **Fichier :** `mobile/components/chat/ChatInput.tsx`
- **Correction appliquée :** `maxLength={4000}` ajouté sur le TextInput.

### H14 — ~~Mot de passe base de données faible~~ ✅ CORRIGÉ

- **Fichier :** `server/.env`
- **Correction appliquée :** Mot de passe PostgreSQL `cgi242pass` remplacé par un mot de passe fort de 29 caractères généré avec `openssl rand`. L'utilisateur PostgreSQL `cgi242` a été mis à jour avec `ALTER USER`.

---

## 4. Anomalies moyennes

### M1 — ~~`$queryRawUnsafe` dans le health check~~ ✅ CORRIGÉ

- **Fichier :** `server/src/app.ts` (l.97)
- **Correction appliquée :** `$queryRawUnsafe("SELECT 1")` remplacé par `$queryRaw\`SELECT 1\`` avec template literal taggé. Élimine le risque d'injection SQL même si la requête est statique — bonne pratique Prisma.

### M2 — ~~Token blacklist en mémoire (non persistante)~~ ✅ CORRIGÉ

- **Fichier :** `server/src/services/tokenBlacklist.service.ts`, `server/prisma/schema.prisma`, `server/src/middleware/auth.ts`
- **Correction appliquée :**
  - Ajout du champ `tokenRevokedAt DateTime?` au modèle User (migration SQL incluse)
  - `blacklistAllUserTokens()` persiste désormais le timestamp en base de données en plus du cache
  - Nouvelle méthode `isUserBlacklistedAsync()` avec fallback DB quand le cache est vide (après redémarrage)
  - Middleware `requireAuth` converti en `async` pour utiliser la vérification persistante
  - Le cache en mémoire sert toujours de fast-path (pas de requête DB à chaque appel)

### M3 — ~~Actions audit non déclarées dans l'enum Prisma~~ ✅ CORRIGÉ

- **Fichier :** `server/prisma/schema.prisma`, migration `20260227150000_m2_m3_fixes`
- **Correction appliquée :** Ajout de `REGISTER` et `PASSWORD_RESET_REQUESTED` dans l'enum `AuditAction`. `PASSWORD_CHANGED` existait déjà. Migration SQL avec `ALTER TYPE ... ADD VALUE IF NOT EXISTS`.

### M4 — ~~Aucune validation de format UUID sur les paramètres de route~~ ✅ CORRIGÉ

- **Fichiers :** Tous les endpoints avec `:id`, `:userId`, `:orgId`, `:invId`
- **Correction appliquée :** Validation UUID via Zod (`z.string().uuid()`) sur tous les params de route (C5). Les IDs invalides retournent 400 avant d'atteindre Prisma.

### M5 — ~~Pas de bornes max sur `days`/`limit` dans les query params~~ ✅ CORRIGÉ

- **Fichiers :** `analytics.routes.ts`, `audit.routes.ts`, `alertes-fiscales.routes.ts`, `search-history.routes.ts`
- **Correction appliquée :** Bornes via Zod : `limit` max 100 (audit/analytics), max 200 (alertes), max 50 (search-history). `days` min 1. Coercion automatique avec valeurs par défaut (C5).

### M6 — ~~`setTimeout` sans cleanup~~ ✅ CORRIGÉ

- **Fichiers :** `verify-otp.tsx`, `reset-password.tsx`
- **Correction appliquée :** Tous les `setTimeout`/`setInterval` stockés dans des `useRef`. Cleanup systématique via `useEffect` return. Les timers sont annulés au démontage du composant, éliminant les setState sur composant démonté.

### M7 — ~~Speech recognition non fonctionnelle sur mobile natif~~ ✅ CORRIGÉ

- **Fichier :** `mobile/lib/hooks/useSpeechRecognition.ts`
- **Correction appliquée :** Ajout des listeners natifs via `ExpoSpeechRecognitionModule.addListener()` pour les événements `result`, `end` et `error`. Les subscriptions sont stockées dans un ref et nettoyées au démontage et avant chaque nouveau démarrage.

### M8 — ~~Pas de complexité mot de passe~~ ✅ CORRIGÉ

- **Fichiers :** `register.tsx`, `reset-password.tsx`
- **Correction appliquée :** Validation ajoutée : au moins une majuscule (`[A-Z]`), une minuscule (`[a-z]`) et un chiffre (`[0-9]`), en plus de la longueur minimale de 12 caractères. Clé i18n `auth.passwordComplexity` ajoutée (FR/EN).

### M9 — ~~Pas de cooldown sur les boutons de renvoi OTP~~ ✅ CORRIGÉ

- **Fichiers :** `verify-otp.tsx`, `reset-password.tsx`
- **Correction appliquée :** Cooldown de 60 secondes après chaque renvoi. Compteur dégressif affiché sur le bouton via `setInterval`. Bouton désactivé et grisé pendant le cooldown. Timer nettoyé au démontage. Clé i18n `auth.resendCooldown` ajoutée (FR/EN).

### M10 — ~~Pas de validation email dans `forgot-password` et invitation~~ ✅ CORRIGÉ

- **Fichiers :** `forgot-password.tsx`, `organisation/index.tsx`
- **Correction appliquée :** Validation regex `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` avant l'envoi des requêtes. Même regex que `register.tsx` pour cohérence. Message d'erreur localisé via `auth.emailInvalid` (forgot) ou `Alert.alert` (invitation).

### M11 — ~~OTP exposé en réponse API hors production~~ ✅ CORRIGÉ

- **Fichier :** `server/src/routes/auth.ts` (4 occurrences)
- **Correction appliquée :** `NODE_ENV !== "production"` remplacé par `NODE_ENV === "development"` sur les 4 lignes qui exposent l'OTP (`otpCode` et `devCode`). Les environnements staging/test ne fuiteront plus l'OTP dans la réponse JSON.

### M12 — ~~Requêtes sans origin autorisées (CORS)~~ ✅ CORRIGÉ

- **Fichier :** `server/src/app.ts` (callback CORS)
- **Correction appliquée :** Les requêtes sans header `Origin` (mobile natif, curl, monitoring) reçoivent `callback(null, false)` au lieu de `callback(null, true)`. La requête passe toujours (nécessaire pour les clients non-navigateur) mais aucun en-tête CORS n'est renvoyé (`Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`). Seules les requêtes avec une origin autorisée reçoivent les en-têtes CORS.

### M13 — ~~Quota non vérifié atomiquement~~ ✅ CORRIGÉ

- **Fichier :** `server/src/middleware/subscription.middleware.ts`, `server/src/services/chat.service.ts`
- **Correction appliquée :** Le middleware `checkQuestionQuota` effectue désormais un `UPDATE ... SET questionsUsed = questionsUsed + 1 WHERE questionsUsed < limit` atomique via `$executeRaw`. Cela élimine la race condition entre la vérification et l'incrément. Le `recordSearchAndUsage` dans le chat service reçoit `skipQuotaIncrement=true` pour éviter le double incrément.

---

## 5. Anomalies basses

| # | Zone | Problème | Fichier | Statut |
|---|------|----------|---------|--------|
| B1 | Serveur | Rate limiter auth laxiste en dev (100 au lieu de 5) | `rateLimit.middleware.ts` l.22 | ✅ CORRIGÉ |
| B2 | Serveur | Risque XSS limité (réponses JSON, pas de HTML) | Global | ℹ️ INFO |
| B3 | Serveur | ~~18 endpoints serveur non utilisés par le mobile~~ | Voir §7 | ✅ CORRIGÉ |
| B4 | Serveur | Montage `user` / `user/stats` fragile | `app.ts` l.77, 81 | ✅ CORRIGÉ |
| B5 | Serveur | Durée tokens acceptable (15min / 7j) | `jwt.ts` | ℹ️ OK |
| B6 | Mobile | Imports inutilisés (`Share`) + couleurs hardcodées StyleSheet | `analytics`, `code` | ✅ CORRIGÉ |
| B7 | Mobile | `catch (err: any)` anti-TypeScript | `profil/index.tsx` l.94 | ✅ CORRIGÉ |
| B8 | Mobile | `useEffect` avec dep manquante (`onChangeText`) | `ChatInput.tsx` l.24-28 | ✅ CORRIGÉ |
| B9 | Mobile | Objets recréés à chaque render (ECHEANCES, QUICK_ACTIONS) | `index.tsx` l.56-95 | ✅ CORRIGÉ |
| B10 | Mobile | `color: "#fff"` dans avatar du layout | `_layout.tsx` l.137 | ✅ CORRIGÉ |
| B11 | Mobile | `backgroundColor="#00815d"` sur StatusBar | `_layout.tsx` l.41 | ✅ CORRIGÉ |
| B12 | Mobile | Couleurs hardcodées dans logout | `logout.tsx` l.24, 30 | ✅ CORRIGÉ |
| B13 | Validation | Pas de protection appuis multiples (login) | `index.tsx` | ✅ CORRIGÉ |
| B14 | Validation | Téléphone sans validation de format | `register.tsx` | ✅ CORRIGÉ |
| B15 | Validation | Pas de borne supérieure sur montants simulateurs | Tous les simulateurs | ✅ CORRIGÉ |
| B16 | Validation | Pas de sanitization du texte chat | `ChatInput.tsx` | ✅ CORRIGÉ |
| B17 | Validation | Code TOTP accepte des lettres | `securite/index.tsx` | ✅ CORRIGÉ |
| B18 | Validation | Navigation parametres → forgot-password sort de (app) | `parametres/index.tsx` l.86 | ✅ CORRIGÉ |
| B19 | Mobile | `setTimeout` mineur dans chat scrollToBottom | `chat/index.tsx` l.65 | ✅ CORRIGÉ |

### Détails des corrections basses

**B1** — Rate limiter auth en dev réduit de 100 à 20 requêtes/15min. Suffisant pour le développement sans être laxiste.

**B2** — ℹ️ Informationnelle. L'API ne retourne que du JSON, pas de HTML. Helmet est configuré. Aucune action requise.

**B3** — ✅ CORRIGÉ. Les 17 endpoints non appelés sont désormais câblés dans l'app mobile : 15 fonctions API ajoutées (`auth.checkEmail`, `auth.logout`, `auth.logoutAll`, `subscription.getSubscription/activate/renew/upgrade`, `organization.createOrganization/acceptInvitation/restoreOrganization/permanentDeleteOrganization`, `audit.getEntityHistory/cleanup`, `alertes.extractAlertes`, `permissions.checkPermission`), intégrées dans les écrans existants (register, securite, abonnement, organisation, audit, alertes) + 2 nouveaux fichiers (`invitations/index.tsx`, `usePermission.ts`). i18n FR/EN ajoutée. Voir §7.

**B4** — Ordre de montage corrigé : `/api/user/stats` est maintenant monté avant `/api/user` pour éviter que le préfixe `/api/user` ne capture les requêtes stats.

**B5** — ℹ️ OK. Access token 15min et refresh token 7j sont des valeurs standard OWASP.

**B6** — Import `Share` inutilisé retiré de `analytics/index.tsx`. Couleurs hardcodées `#e0e0e0` retirées du `StyleSheet.create` dans `code/index.tsx`, remplacées par `colors.border` inline.

**B7** — `catch (err: any)` remplacé par `catch (err: unknown)` avec type narrowing via `instanceof Error` dans `profil/index.tsx`.

**B8** — Dépendance manquante `onChangeText` ajoutée au tableau de dépendances du `useEffect` dans `ChatInput.tsx`.

**B9** — Tableaux `ECHEANCES` et `QUICK_ACTIONS` wrappés dans `useMemo` avec `[t]` comme dépendance dans le dashboard `(app)/index.tsx`.

**B10** — `color: "#fff"` remplacé par `color: colors.sidebarText` dans l'avatar du header `(app)/_layout.tsx`.

**B11** — StatusBar extraite dans un composant `ThemedStatusBar` qui utilise `useTheme()` pour `backgroundColor={colors.primary}`, rendant la couleur dynamique selon le thème.

**B12** — `logout.tsx` réécrit entièrement : `className` (NativeWind) remplacé par styles inline avec `useTheme()`. Couleurs `#00c17c` et `#fff` remplacées par `colors.success` et `colors.sidebarText`.

**B13** — État `navigating` ajouté au bouton Continuer du login. Le bouton est désactivé après le premier clic et réactivé au retour sur l'écran via `useFocusEffect`.

**B14** — Filtre regex `v.replace(/[^\d\s+()-]/g, "")` ajouté sur le champ téléphone de `register.tsx`. N'accepte que chiffres, espaces, `+`, `(`, `)`, `-`.

**B15** — Borne supérieure de 100 milliards FCFA ajoutée dans `formatInputNumber()` de `fiscal-common.ts`. Tous les 4 simulateurs (ITS, IS, patente, solde-liquidation) bénéficient du cap centralisé.

**B16** — Sanitization des espaces excessifs (10+ espaces consécutifs → 2 espaces) ajoutée dans `ChatInput.tsx` via `onChangeText`.

**B17** — Champ TOTP de `securite/index.tsx` filtré pour n'accepter que les chiffres : `text.replace(/[^0-9]/g, "")`.

**B18** — Navigation vers `/(auth)/forgot-password` depuis les paramètres précédée d'un `Alert.alert` de confirmation expliquant la redirection vers le flux de réinitialisation par email.

**B19** — `setTimeout` dans `scrollToBottom` de `chat/index.tsx` stocké dans `useRef` avec cleanup au démontage via `useEffect`.

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
| Fallback JWT secret | ✅ CORRIGÉ | Serveur crash si non défini |
| Salt MFA | ✅ CORRIGÉ | Salt aléatoire 16 octets + clé dédiée |
| Génération OTP | ✅ CORRIGÉ | `crypto.randomInt()` |
| Expiration OTP | ✅ CORRIGÉ | Vérifiée (10 min) |
| Logout mobile → serveur | ✅ CORRIGÉ | Appel `POST /api/auth/logout` |
| Password validation serveur | ✅ CORRIGÉ | Min 8 caractères à l'inscription |

### 6.2 Rate Limiting

| Endpoint | Rate Limiter | Statut |
|----------|-------------|--------|
| `/api/auth/*` | `authLimiter` (5 req/15min prod) | ✅ OK |
| `/api/auth/reset-password` | `sensitiveLimiter` | ✅ OK |
| `/api/mfa/*` | `sensitiveLimiter` | ✅ CORRIGÉ |
| `/api/chat/*` | `chatLimiter` (30 req/h) | ✅ CORRIGÉ |
| `/api/auth/send-otp-email` | `sensitiveLimiter` | ✅ CORRIGÉ |
| `/api/auth/forgot-password` | `sensitiveLimiter` | ✅ CORRIGÉ |
| `/api/auth/check-email` | `sensitiveLimiter` | ✅ CORRIGÉ |
| Toutes autres routes | Global (100 req/15min) | ⚠️ Acceptable |

### 6.3 Validation des entrées

**Serveur — Validation Zod sur tous les endpoints** (C5 corrigé).

| Endpoint | Validation actuelle | Statut |
|----------|-------------------|--------|
| `POST /auth/register` | Zod : email, password min 8, champs requis | ✅ CORRIGÉ (C5) |
| `POST /auth/login` | Zod : email, password requis | ✅ CORRIGÉ (C5) |
| `POST /auth/verify-otp` | Zod : email/OTP requis + expiration vérifiée | ✅ CORRIGÉ (C4+C5) |
| `POST /chat/message/stream` | Zod : content min 1/max 4000 + quota | ✅ CORRIGÉ (C5+C8) |
| `POST /organizations` | Zod : name requis, settings typé | ✅ CORRIGÉ (C5) |
| Routes avec `:id` | Zod : validation UUID sur tous les params | ✅ CORRIGÉ (C5) |
| Query params `days`, `limit` | Zod : coercion number + defaults | ✅ CORRIGÉ (C5) |

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
| Routes admin : vérification `user.role === ADMIN` en base | ✅ CORRIGÉ (H1) |
| Routes chat : `checkQuestionQuota` en amont | ✅ CORRIGÉ (C8) |
| Isolation des données chat par `creatorId` | ✅ OK |

### 6.6 Fichiers sensibles

| Élément | Statut |
|---------|--------|
| `.env` dans `.gitignore` | ✅ OK |
| `.env.example` existant | ✅ CORRIGÉ (H6) |
| Secrets réels dans `.env` | ⚠️ Normal mais à sécuriser |
| OTP dans réponses hors production | ⚠️ Risque si staging exposé |
| Mot de passe BDD | ✅ CORRIGÉ — mot de passe fort 29 caractères (H14) |
| Swagger en production | ✅ CORRIGÉ — caché si `NODE_ENV=production` (H7) |

### 6.7 Dépendances

| Package | Problème | Sévérité |
|---------|----------|----------|
| ~~`voyageai` → `qs`~~ | ~~2 vulnérabilités DoS~~ ✅ CORRIGÉ — SDK supprimé, appel API direct | ~~Haute~~ |
| `npm audit` | **0 vulnérabilités** | ✅ OK |

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
- ✅ Abonnement (`abonnement/index.tsx`) — **CORRIGÉ**
- ✅ Admin (`admin/index.tsx`) — **CORRIGÉ**
- ✅ Analytics (`analytics/index.tsx`) — **CORRIGÉ**
- ✅ Audit (`audit/index.tsx`) — **CORRIGÉ**
- ✅ Organisation (`organisation/index.tsx`) — **CORRIGÉ**
- ✅ Permissions (`permissions/index.tsx`) — **CORRIGÉ**
- ✅ Sécurité (`securite/index.tsx`) — **CORRIGÉ**
- ✅ CGU (`legal/cgu.tsx`) — **CORRIGÉ**
- ✅ Confidentialité (`legal/confidentialite.tsx`) — **CORRIGÉ**
- ✅ Code (`code/index.tsx`) — **CORRIGÉ**

**Écrans auth migrés (H8 corrigé) :**
- ✅ Login (`(auth)/index.tsx`) — **CORRIGÉ**
- ✅ Password (`(auth)/password.tsx`) — **CORRIGÉ**
- ✅ Register (`(auth)/register.tsx`) — **CORRIGÉ**
- ✅ Verify OTP (`(auth)/verify-otp.tsx`) — **CORRIGÉ**
- ✅ MFA Verify (`(auth)/mfa-verify.tsx`) — **CORRIGÉ**
- ✅ Forgot Password (`(auth)/forgot-password.tsx`) — **CORRIGÉ**
- ✅ Reset Password (`(auth)/reset-password.tsx`) — **CORRIGÉ**

### 6.9 Appels API au montage (mobile)

Tous ces écrans font des appels API via l'instance axios au montage. ~~Un token expiré + refresh échoué = déconnexion brutale~~ ✅ CORRIGÉ (C10) — `forceLogout()` affiche désormais un modal `SessionExpiredModal` au lieu de déconnecter brutalement.

| Écran | API appelée | Risque |
|-------|-----------|-------|
| `alertes/index.tsx` | `alertesApi.getStats()` + `getAlertes()` | ✅ Mitigé (C10) |
| `profil/index.tsx` | `userApi.getProfile()` | ✅ Mitigé (C10) |
| `parametres/index.tsx` | `userApi.getProfile()` + `getStats()` | ✅ Mitigé (C10) |
| `abonnement/index.tsx` | `subscriptionApi.getQuota()` | ✅ Mitigé (C10) |
| `admin/index.tsx` | `adminApi.getOrganizations()` | ✅ Mitigé (C10) |
| `analytics/index.tsx` | `analyticsApi.getDashboard()` + 2 autres | ✅ Mitigé (C10) |
| `audit/index.tsx` | `auditApi.getStats()` + `getOrganizationLogs()` | ✅ Mitigé (C10) |
| `organisation/index.tsx` | `organizationApi.getOrganization()` + 2 autres | ✅ Mitigé (C10) |
| `permissions/index.tsx` | `permissionsApi.getMyPermissions()` + 2 autres | ✅ Mitigé (C10) |
| `securite/index.tsx` | `mfaApi.getStatus()` | ✅ Mitigé (C10) |
| `chat/index.tsx` | `getConversations()`, `getConversation()` | ✅ Mitigé (C10) |

### 6.10 Formulaires & Validation client

| Formulaire | Email validé | Password validé | Champs requis | Loading state | Anti double-clic |
|-----------|-------------|----------------|---------------|--------------|-----------------|
| Login email | ✅ CORRIGÉ (H11) | — | ✅ | ❌ Absent | ❌ Absent |
| Password | — | ❌ Aucune validation | ✅ | ✅ | ✅ |
| Register | ✅ CORRIGÉ (H10) | ⚠️ Longueur seule | ✅ | ✅ | ✅ |
| Forgot password | ❌ Absent | — | ✅ | ✅ | ✅ |
| Reset password | — | ⚠️ Longueur seule | ✅ | ✅ | ✅ |
| Verify OTP | — | — | ✅ | ✅ | ✅ |
| MFA verify | — | — | ✅ | ✅ | ✅ |
| Profil | — | — | ✅ CORRIGÉ (H12) | ✅ | ✅ |
| Chat input | — | — | ✅ + maxLength (H13) | ✅ | ✅ |
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

**Total : 80 endpoints serveur, 75 appelés par le mobile** (était 58 avant B3)

### Endpoints câblés par la correction B3 (17)

| Endpoint | Intégration mobile |
|----------|--------------------|
| ~~`POST /api/auth/check-email`~~ | ✅ `register.tsx` — vérification email au blur |
| ~~`POST /api/auth/logout`~~ | ✅ `store/auth.ts` — appel serveur lors de la déconnexion (C9) |
| ~~`POST /api/auth/logout-all`~~ | ✅ `securite/index.tsx` — bouton "Déconnecter tous les appareils" |
| ~~`GET /api/subscription`~~ | ✅ `abonnement/index.tsx` — détails complets abonnement |
| ~~`POST /api/subscription/activate`~~ | ✅ `abonnement/index.tsx` — bouton activer (OWNER) |
| ~~`POST /api/subscription/renew`~~ | ✅ `abonnement/index.tsx` — bouton renouveler (OWNER) |
| ~~`POST /api/subscription/upgrade`~~ | ✅ `abonnement/index.tsx` — bouton changer plan (OWNER) |
| ~~`POST /api/organizations`~~ | ✅ `organisation/index.tsx` — créer org quand l'user n'en a pas |
| ~~`POST /api/organizations/accept-invitation`~~ | ✅ **NOUVEAU** `invitations/index.tsx` — accepter invitation |
| ~~`POST /api/organizations/:id/restore`~~ | ✅ `organisation/index.tsx` — restaurer org supprimée (OWNER) |
| ~~`DELETE /api/organizations/:id/permanent`~~ | ✅ `organisation/index.tsx` — suppression définitive (OWNER) |
| ~~`GET /api/audit/entity/:type/:id`~~ | ✅ `audit/index.tsx` — historique entité au clic |
| ~~`POST /api/audit/cleanup`~~ | ✅ `audit/index.tsx` — bouton nettoyage RGPD (OWNER) |
| ~~`POST /api/alertes-fiscales/extract`~~ | ✅ `alertes/index.tsx` — bouton extraction (ADMIN) |
| ~~`GET /api/permissions/check/:permission`~~ | ✅ **NOUVEAU** hook `usePermission()` réutilisable |
| ~~`organizationApi.updateOrganization`~~ | ✅ `organisation/index.tsx` — bouton modifier nom org |
| ~~`organizationApi.deleteOrganization`~~ | ✅ `organisation/index.tsx` — bouton supprimer org (OWNER) |

### Endpoints serveur restants non utilisés (5 — admin/ingestion uniquement)

| Endpoint | Raison |
|----------|--------|
| `POST /api/ingestion/articles` | Admin-only (ingestion de données) |
| `POST /api/ingestion/sources` | Admin-only (ingestion de données) |
| `GET /api/ingestion/stats` | Admin-only (statistiques ingestion) |
| `POST /api/admin/organizations/:id/activate` | Doublonne avec `/subscription/activate` côté OWNER |
| `POST /api/admin/organizations/:id/renew` | Doublonne avec `/subscription/renew` côté OWNER |

**Note :** Les 5 endpoints restants sont des routes d'administration serveur (ingestion CGI, activation admin). Ils ne nécessitent pas d'intégration mobile.

---

## 8. Plan de correction recommandé

### Phase 1 — Sécurité critique ✅ TERMINÉE

| # | Correction | Statut |
|---|-----------|--------|
| 1 | Supprimer les fallbacks JWT (C1) | ✅ Fait |
| 2 | OTP cryptographique + expiration (C3, C4) | ✅ Fait |
| 3 | Salt MFA aléatoire + clé dédiée (C2) | ✅ Fait |
| 4 | Body size limit (C6) | ✅ Fait |
| 5 | Rate limiter chat (C7) | ✅ Fait |
| 6 | Quota chat en amont (C8) | ✅ Fait |
| 7 | Logout mobile → API (C9) | ✅ Fait |

### Phase 2 — Stabilité haute ✅ MAJORITAIREMENT TERMINÉE

| # | Correction | Statut |
|---|-----------|--------|
| 8 | Migrer les 9+ écrans vers le thème sombre (C11) | ✅ Fait (10 écrans) |
| 9 | Corriger `devCode` sans `__DEV__` (C12) | ✅ Fait |
| 10 | Corriger `user!` dans verify-otp (C13) | ✅ Fait |
| 11 | `sensitiveLimiter` sur send-otp, forgot-pwd, check-email (H3, H4) | ✅ Fait |
| 12 | Validation email mobile (H10, H11) | ✅ Fait |
| 13 | Password validation serveur (H2) | ✅ Fait |
| 14 | `maxLength` sur chat input (H13) | ✅ Fait |
| 15 | Créer `.env.example` (H6) | ✅ Fait |
| 16 | Swagger caché en production (H7) | ✅ Fait |
| 17 | Validation profil (H12) | ✅ Fait |
| 18 | Couleurs hardcodées corrigées (H9) | ✅ Fait |

### Phase 3 — Critiques restantes ✅ TERMINÉE + Hautes restantes

| # | Correction | Sévérité |
|---|-----------|----------|
| 19 | ~~Validation zod/joi sur tous les endpoints (C5)~~ ✅ | Critique |
| 20 | ~~Protection anti-déconnexion au montage (C10)~~ ✅ | Critique |
| 21 | ~~Migrer les 7 écrans auth vers useTheme (H8)~~ ✅ | Haute |
| 22 | ~~Ajouter rôle ADMIN dans Prisma (H1)~~ ✅ | Haute |

### Phase 4 — Qualité moyenne ✅ TERMINÉE

| # | Correction | Sévérité |
|---|-----------|----------|
| 23 | ~~Validation UUID sur paramètres de route (M4)~~ ✅ | Moyenne |
| 24 | ~~Bornes max sur query params (M5)~~ ✅ | Moyenne |
| 25 | ~~Actions manquantes dans enum Prisma AuditAction (M3)~~ ✅ | Moyenne |
| 26 | ~~Cleanup des `setTimeout` (M6)~~ ✅ | Moyenne |
| 27 | ~~Cooldown boutons renvoi OTP (M9)~~ ✅ | Moyenne |
| 28 | ~~Token blacklist persistante (M2)~~ ✅ | Moyenne |
| 29 | ~~Corriger speech recognition mobile natif (M7)~~ ✅ | Moyenne |
| 30 | ~~Complexité mot de passe (M8)~~ ✅ | Moyenne |
| 31 | ~~Validation email forgot-password + invitation (M10)~~ ✅ | Moyenne |
| 32 | ~~`$queryRaw` au lieu de `$queryRawUnsafe` (M1)~~ ✅ | Moyenne |
| 33 | ~~OTP exposé en staging (M11)~~ ✅ | Moyenne |
| 34 | ~~CORS sans origin renforcé (M12)~~ ✅ | Moyenne |
| 35 | ~~Quota atomique (M13)~~ ✅ | Moyenne |

### Phase 5 — Nettoyage ✅ TERMINÉE

| # | Correction | Sévérité | Statut |
|---|-----------|----------|--------|
| 36 | ~~Rate limiter dev réduit (B1)~~ ✅ | Basse | FAIT |
| 37 | ~~Montage routes user/stats corrigé (B4)~~ ✅ | Basse | FAIT |
| 38 | ~~Imports inutilisés supprimés (B6)~~ ✅ | Basse | FAIT |
| 39 | ~~`catch (err: any)` → `err: unknown` (B7)~~ ✅ | Basse | FAIT |
| 40 | ~~useEffect deps manquantes corrigées (B8)~~ ✅ | Basse | FAIT |
| 41 | ~~useMemo pour tableaux dashboard (B9)~~ ✅ | Basse | FAIT |
| 42 | ~~Couleurs hardcodées → thème (B10, B11, B12)~~ ✅ | Basse | FAIT |
| 43 | ~~Protection double-tap login (B13)~~ ✅ | Basse | FAIT |
| 44 | ~~Validation téléphone (B14)~~ ✅ | Basse | FAIT |
| 45 | ~~Borne supérieure simulateurs (B15)~~ ✅ | Basse | FAIT |
| 46 | ~~Sanitization chat (B16)~~ ✅ | Basse | FAIT |
| 47 | ~~TOTP digits only (B17)~~ ✅ | Basse | FAIT |
| 48 | ~~Navigation parametres sécurisée (B18)~~ ✅ | Basse | FAIT |
| 49 | ~~setTimeout cleanup chat (B19)~~ ✅ | Basse | FAIT |
| 50 | ~~Renforcer mot de passe PostgreSQL (H14)~~ ✅ | Basse (config) | FAIT |

---

## Résumé des corrections appliquées

### Commit `98b6782` — Phase 1 & 2

**28 fichiers modifiés — 1019 insertions, 513 suppressions**

### Serveur (8 fichiers)
- `src/utils/jwt.ts` — Suppression fallbacks JWT
- `src/utils/otp.ts` — OTP cryptographique
- `src/services/mfa.service.ts` — Salt aléatoire + clé dédiée
- `src/routes/auth.ts` — Expiration OTP, validation password, sensitiveLimiter
- `src/routes/chat.ts` — Quota en amont, validation longueur
- `src/app.ts` — Body limit, Swagger conditionnel, rate limiters
- `src/middleware/rateLimit.middleware.ts` — chatLimiter
- `.env.example` — Nouveau fichier

### Correction C5 — Validation Zod (Phase 3)

**31 fichiers modifiés/créés**

#### Nouveaux fichiers (17)
- `src/middleware/validate.middleware.ts` — Middleware générique `validate({ body, query, params })`
- `src/schemas/common.schema.ts` — Primitives partagées (uuid, email, password, pagination, enums)
- `src/schemas/auth.schema.ts` — 8 schemas (register, login, verify-otp, send-otp, forgot-password, reset-password, refresh-token, check-email)
- `src/schemas/mfa.schema.ts` — 3 schemas (enable, disable, verify)
- `src/schemas/chat.schema.ts` — 2 schemas (messageStream, conversationId)
- `src/schemas/organization.schema.ts` — 6 schemas body + 3 params
- `src/schemas/subscription.schema.ts` — 2 schemas (activate, upgrade)
- `src/schemas/permission.schema.ts` — 2 schemas (grant, revoke)
- `src/schemas/notifications.schema.ts` — 2 schemas (register, unregister)
- `src/schemas/user.schema.ts` — 1 schema (updateProfile)
- `src/schemas/ingestion.schema.ts` — 2 schemas (articles, sources)
- `src/schemas/admin.schema.ts` — 1 schema (activateOrg)
- `src/schemas/audit.schema.ts` — 6 schemas (org, user, entity, search, stats, cleanup)
- `src/schemas/alertes-fiscales.schema.ts` — 1 schema (listAlertes)
- `src/schemas/analytics.schema.ts` — 1 schema (days)
- `src/schemas/search-history.schema.ts` — 1 schema (searchHistory)
- `src/schemas/index.ts` — Barrel re-export

#### Routes modifiées (14)
- `src/routes/auth.ts` — 8 endpoints validés, checks manuels supprimés
- `src/routes/mfa.routes.ts` — 3 endpoints validés
- `src/routes/chat.ts` — 3 endpoints validés (body + params)
- `src/routes/organization.routes.ts` — 14 endpoints validés (body + params UUID)
- `src/routes/subscription.routes.ts` — 2 endpoints validés (plan enum)
- `src/routes/permission.routes.ts` — 5 endpoints validés (params UUID + body)
- `src/routes/notifications.routes.ts` — 2 endpoints validés
- `src/routes/user.routes.ts` — 1 endpoint validé, checks typeof supprimés
- `src/routes/ingestion.routes.ts` — 2 endpoints validés, checks Array.isArray supprimés
- `src/routes/admin.routes.ts` — 2 endpoints validés (params UUID + plan enum)
- `src/routes/audit.routes.ts` — 6 endpoints validés (query coercion + params)
- `src/routes/alertes-fiscales.routes.ts` — 1 endpoint validé (query coercion)
- `src/routes/analytics.routes.ts` — 2 endpoints validés (query coercion)
- `src/routes/search-history.routes.ts` — 1 endpoint validé (query coercion)

### Mobile (20 fichiers)
- `lib/store/auth.ts` — Logout → API serveur
- `app/(auth)/verify-otp.tsx` — `__DEV__` guard, null check
- `app/(auth)/index.tsx` — Regex email stricte
- `app/(auth)/register.tsx` — Regex email
- `components/chat/ChatInput.tsx` — maxLength 4000
- `components/chat/HistoryPanel.tsx` — Couleur thémée
- `app/(app)/profil/index.tsx` — Validation nom/téléphone
- `lib/i18n/locales/fr.json` — Clés validation profil
- `lib/i18n/locales/en.json` — Clés validation profil
- 10 écrans migrés vers useTheme() (abonnement, admin, analytics, audit, code, organisation, permissions, securite, legal/cgu, legal/confidentialite)

### Correction C10 — Anti-déconnexion au montage

**4 fichiers modifiés, 1 fichier créé**

#### Fichiers modifiés
- `mobile/lib/store/auth.ts` — Ajout état `sessionExpired: boolean` + actions `setSessionExpired()` / `clearSessionExpired()`. `logout()` remet `sessionExpired: false`
- `mobile/lib/api/client.ts` — `forceLogout()` appelle `setSessionExpired(true)` au lieu de `logout()`. Les tokens sont nettoyés mais `isAuthenticated` reste `true`
- `mobile/app/(app)/_layout.tsx` — Rendu de `<SessionExpiredModal />` en overlay
- `mobile/lib/i18n/locales/fr.json` + `en.json` — Clés `auth.sessionExpired` et `auth.sessionExpiredMessage`

#### Fichier créé
- `mobile/components/SessionExpiredModal.tsx` — Modal plein écran avec icône horloge, message d'expiration et bouton "Se reconnecter"

#### Flux corrigé
```
Écran monte → API call → 401 → refresh échoue
→ forceLogout() → sessionExpired=true (isAuthenticated reste true)
→ _layout.tsx affiche <SessionExpiredModal /> en overlay
→ Clic "Se reconnecter" → logout() → isAuthenticated=false → redirection /(auth)
```

### Correction H1 — Rôle ADMIN en base de données

**2 fichiers modifiés, 2 fichiers créés**

#### Schéma Prisma
- `server/prisma/schema.prisma` — Ajout enum `UserRole` (`USER`, `ADMIN`) et champ `role` sur le modèle `User` (défaut `USER`)
- `server/prisma/migrations/20260227120000_add_user_role/migration.sql` — Migration SQL

#### Middleware partagé
- `server/src/middleware/requireAdmin.ts` — Middleware `requireAdmin` qui vérifie `user.role === 'ADMIN'` en base. Fallback rétro-compatible : si `ADMIN_EMAIL` env var match l'email de l'utilisateur, il est automatiquement promu `ADMIN` en base

#### Routes mises à jour
- `server/src/routes/admin.routes.ts` — Suppression du `requireAdmin` local, import du middleware partagé
- `server/src/routes/ingestion.routes.ts` — Suppression du `requireAdmin` local, import du middleware partagé

### Correction H5 — Vulnérabilités qs (via voyageai)

**2 fichiers modifiés**

- `server/src/services/rag/embeddings.service.ts` — Remplacement du SDK `voyageai` par un appel direct à l'API REST Voyage AI (`POST https://api.voyageai.com/v1/embeddings`) via `fetch` natif. Interface identique, même modèle `voyage-multilingual-2`, même cache
- `server/package.json` — Suppression de la dépendance `voyageai`. 11 packages retirés, `npm audit` retourne 0 vulnérabilités

---

### Corrections M1-M13 — Anomalies moyennes (Phase 4)

**11 fichiers modifiés, 1 migration créée**

#### Serveur (6 fichiers)
- `server/src/app.ts` — M1 : `$queryRawUnsafe` → `$queryRaw` template literal. M12 : CORS `callback(null, false)` pour requêtes sans origin
- `server/src/routes/auth.ts` — M11 : `NODE_ENV !== "production"` → `NODE_ENV === "development"` (4 occurrences)
- `server/prisma/schema.prisma` — M2 : ajout `tokenRevokedAt DateTime?` sur User. M3 : ajout `REGISTER`, `PASSWORD_RESET_REQUESTED` à `AuditAction`
- `server/prisma/migrations/20260227150000_m2_m3_fixes/migration.sql` — Migration SQL
- `server/src/services/tokenBlacklist.service.ts` — M2 : persistance DB dans `blacklistAllUserTokens()`, fallback async `isUserBlacklistedAsync()`
- `server/src/middleware/auth.ts` — M2 : `requireAuth` converti en `async` pour utiliser `isUserBlacklistedAsync()`
- `server/src/middleware/subscription.middleware.ts` — M13 : incrément atomique conditionnel `$executeRaw UPDATE ... WHERE questionsUsed < limit`
- `server/src/services/chat.service.ts` — M13 : `skipQuotaIncrement=true` dans `recordSearchAndUsage` pour le streaming

#### Mobile (5 fichiers)
- `mobile/app/(auth)/verify-otp.tsx` — M6 : cleanup `useRef` + `useEffect`. M9 : cooldown 60s avec compteur
- `mobile/app/(auth)/reset-password.tsx` — M6 : cleanup timers. M8 : complexité mot de passe. M9 : cooldown 60s
- `mobile/app/(auth)/register.tsx` — M8 : validation majuscule + minuscule + chiffre
- `mobile/app/(auth)/forgot-password.tsx` — M10 : regex email avant envoi
- `mobile/app/(app)/organisation/index.tsx` — M10 : regex email sur invitation
- `mobile/lib/hooks/useSpeechRecognition.ts` — M7 : listeners natifs `result`/`end`/`error` sur `ExpoSpeechRecognitionModule`
- `mobile/lib/i18n/locales/fr.json` — Clés `auth.passwordComplexity`, `auth.resendCooldown`
- `mobile/lib/i18n/locales/en.json` — Idem en anglais

---

### Commit `3bf11aa` — B3 : Câblage des 17 endpoints serveur non appelés

**16 fichiers modifiés, 2 fichiers créés — 956 insertions, 20 suppressions**

#### API clients (6 fichiers modifiés)
- `mobile/lib/api/auth.ts` — +3 fonctions (`checkEmail`, `logout`, `logoutAll`)
- `mobile/lib/api/subscription.ts` — +4 fonctions (`getSubscription`, `activate`, `renew`, `upgrade`) + type `SubscriptionDetail`
- `mobile/lib/api/organization.ts` — +4 fonctions (`createOrganization`, `acceptInvitation`, `restoreOrganization`, `permanentDeleteOrganization`)
- `mobile/lib/api/audit.ts` — +2 fonctions (`getEntityHistory`, `cleanup`)
- `mobile/lib/api/alertes.ts` — +1 fonction (`extractAlertes`)
- `mobile/lib/api/permissions.ts` — +1 fonction (`checkPermission`)

#### Écrans modifiés (7 fichiers)
- `mobile/app/(auth)/register.tsx` — Vérification email au `onBlur` via `authApi.checkEmail()`, message erreur + blocage soumission
- `mobile/app/(app)/securite/index.tsx` — Bouton "Déconnecter tous les appareils" avec confirmation
- `mobile/app/(app)/abonnement/index.tsx` — Boutons Activer Basique/Pro, Renouveler, Passer au Pro (visibles OWNER)
- `mobile/app/(app)/organisation/index.tsx` — Formulaire création org, modifier nom (icône crayon inline), supprimer/restaurer/suppression définitive (OWNER), lien invitations
- `mobile/app/(app)/audit/index.tsx` — Bouton "Historique complet de cette entité" (modal), formulaire nettoyage RGPD (OWNER)
- `mobile/app/(app)/alertes/index.tsx` — Bouton "Extraire les alertes" (visible ADMIN)
- `mobile/lib/i18n/locales/fr.json` + `en.json` — +25 clés i18n (auth, subscription, organization, audit, alertes)

#### Nouveaux fichiers (2)
- `mobile/app/(app)/invitations/index.tsx` — Écran pour accepter une invitation par token
- `mobile/lib/hooks/usePermission.ts` — Hook réutilisable `usePermission(permission)` → `{ hasPermission, loading }`

### Commit `ae52e7e` — Fix dotenv : chargement avant les imports

**1 fichier modifié — 1 insertion, 2 suppressions**

- `server/src/server.ts` — `import dotenv; dotenv.config()` remplacé par `import "dotenv/config"`. Les imports ES sont hoistés : `jwt.ts` s'exécutait avant `dotenv.config()`, causant un crash `FATAL: JWT_SECRET is not defined`. Le side-effect import `"dotenv/config"` charge le `.env` dans le bon ordre.

---

*Rapport généré le 27 février 2026 — Mis à jour après corrections (C1-C13, H1-H14, M1-M13, B1-B19, B3 câblage endpoints, fix dotenv) — CGI-242 v1.0.0*
