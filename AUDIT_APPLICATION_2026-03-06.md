# AUDIT COMPLET — Application CGI-242
**Date** : 6 mars 2026
**Scope** : Backend (server) + Frontend mobile/web
**Total** : **78 problèmes identifiés** (5 critiques, 14 hauts, 29 moyens, 25 bas, 5 fonctionnalités manquantes)

---

## TABLE DES MATIÈRES

1. [Résumé exécutif](#1-résumé-exécutif)
2. [CRITIQUE — À corriger immédiatement](#2-critique)
3. [HAUT — À corriger rapidement](#3-haut)
4. [MOYEN — À planifier](#4-moyen)
5. [BAS — Améliorations](#5-bas)
6. [Fonctionnalités manquantes](#6-fonctionnalités-manquantes)
7. [Inventaire des routes et couverture auth](#7-inventaire-routes)

---

## 1. Résumé exécutif

| Sévérité | Backend | Frontend | Total |
|----------|---------|----------|-------|
| CRITIQUE | 4 | 1 | **5** |
| HAUT | 7 | 7 | **14** |
| MOYEN | 13 | 16 | **29** |
| BAS | 13 | 12 | **25** |
| Manquant | 5 | 0 | **5** |
| **Total** | **42** | **36** | **78** |

### Problèmes les plus urgents (déjà corrigés dans ce cycle) :
- Split ITS employé 35% / employeur 65% — **supprimé** (aucune base légale CGI)
- Barème ITS serveur — **corrigé** (7 tranches fausses → 5 tranches Art. 116-G)
- `verifyToken()` déconnexion — **corrigé** (`_skipAuthRetry` retiré)
- `/subscription/quota` déconnexion — **corrigé** (`_skipAuthRetry` retiré)
- `rememberMe` perdu après refresh — **corrigé** (flag préservé)

---

## 2. CRITIQUE

### CRIT-01 : `check-email` permet l'énumération d'utilisateurs — CORRIGÉ
- **Fichier** : `server/src/routes/auth.ts`, lignes 723-731
- **Problème** : `POST /api/auth/check-email` retournait `{ exists: true/false }`. Permettait aux attaquants d'identifier les comptes existants.
- **Fix appliqué** : Réponse constante `{ message: "Vérification effectuée" }` sans révéler l'existence du compte. Frontend adapté (pré-vérification email supprimée, validation côté serveur au register).

### CRIT-02 : MFA verify utilise un secret de fallback `'dev-secret'` — CORRIGÉ
- **Fichier** : `server/src/routes/mfa.routes.ts`, ligne 234
- **Problème** : `process.env.JWT_SECRET || 'dev-secret'` — si JWT_SECRET n'est pas défini, n'importe qui pouvait forger un token MFA.
- **Fix appliqué** : Supprimé le fallback. Si `JWT_SECRET` est absent, retourne une erreur 500 avec log.

### CRIT-03 : Turnstile CAPTCHA en mode fail-open — CORRIGÉ
- **Fichier** : `server/src/middleware/turnstile.middleware.ts`, lignes 47-50
- **Problème** : Si Cloudflare était injoignable, le middleware laissait passer la requête.
- **Fix appliqué** : Fail-closed en production (retourne 503). Fail-open uniquement en dev/test.

### CRIT-04 : Code OTP exposé en mode développement — CORRIGÉ
- **Fichier** : `server/src/routes/auth.ts`, lignes 204, 300, 469, 532
- **Problème** : `otpCode`/`devCode` exposés dans les réponses en mode développement.
- **Fix appliqué** : Supprimé tous les `otpCode`/`devCode` des réponses API (register, login, send-otp-email, forgot-password). Frontend nettoyé.

### CRIT-05 : Logique ITS minimum inversée — CORRIGÉ
- **Fichier** : `mobile/lib/services/its.service.ts`, lignes 115-121
- **Problème** : Le minimum annuel 1.200 FCFA était appliqué sur la base du SMIG, mais le forfait de la 1ère tranche (0-615.000) est déjà géré dans `applyBaremeIts()`. Risque de double-comptage.
- **Fix appliqué** : Bloc de minimum SMIG supprimé. Le forfait est géré par le barème (Art. 116-G).

---

## 3. HAUT

### HIGH-01 : Pas de gestionnaire d'erreurs global Express
- **Fichier** : `server/src/app.ts` (manquant en fin de fichier)
- **Problème** : Aucun middleware `app.use((err, req, res, next) => ...)`. Les erreurs non gérées exposent des stack traces HTML.
- **Fix** : Ajouter un error handler global.

### HIGH-02 : Token blacklist en mémoire uniquement
- **Fichier** : `server/src/services/tokenBlacklist.service.ts`, lignes 11-31
- **Problème** : Les tokens blacklistés sont perdus au redémarrage du serveur. Un token déconnecté redevient valide.
- **Fix** : Stocker les blacklists dans PostgreSQL ou Redis.

### HIGH-03 : `clear-session` sans authentification
- **Fichier** : `server/src/routes/auth.ts`, lignes 750-753
- **Problème** : N'importe qui peut appeler `POST /api/auth/clear-session` pour effacer les cookies d'un utilisateur.
- **Fix** : Ajouter une protection CSRF ou documenter le comportement.

### HIGH-04 : `search-history/popular` expose les recherches de tous les utilisateurs
- **Fichier** : `server/src/routes/search-history.routes.ts`, lignes 77-96
- **Problème** : Les recherches populaires sont globales, pas scopées par organisation. Fuite de données privées.
- **Fix** : Filtrer par organisation.

### HIGH-05 : Rate limiter global trop bas (100 req/15min)
- **Fichier** : `server/src/middleware/rateLimit.middleware.ts`, lignes 8-14
- **Problème** : Un utilisateur normal peut atteindre la limite en quelques minutes de navigation.
- **Fix** : Augmenter à 300-500 ou passer en rate limiting par utilisateur.

### HIGH-06 : Schéma organisation incompatible avec le service
- **Fichier** : `server/src/schemas/organization.schema.ts` vs `server/src/services/organization.service.ts`
- **Problème** : Le schéma valide `name` mais le service lit `entrepriseNom`. La création d'organisation échoue silencieusement.
- **Fix** : Aligner les noms de champs.

### HIGH-07 : Pas de rate limiting sur routes sensibles
- **Fichier** : `server/src/app.ts`, lignes 80-91
- **Problème** : `/api/admin`, `/api/subscription`, `/api/ingestion` n'ont que le rate limiter global.
- **Fix** : Appliquer `sensitiveLimiter` sur les routes admin et subscription.

### HIGH-08 : Paie service contourne `calculateFraisPro()`
- **Fichier** : `mobile/lib/services/paie.service.ts`, lignes 143-154
- **Problème** : Calcul en dur `* 0.80` au lieu d'utiliser la fonction partagée. Risque de divergence si le taux change.
- **Fix** : Utiliser `calculateFraisPro()` de `fiscal-common.ts`.

### HIGH-09 : IS Service sans taux déficit 2%
- **Fichier** : `mobile/lib/services/is.service.ts`, lignes 26-53
- **Problème** : Art. 86-C prévoit 2% si déficit 2 exercices consécutifs. Le service ne gère que 1%.
- **Fix** : Ajouter paramètre `isDeficitDeuxAns` et appliquer 2%.

### HIGH-10 : ErrorBoundary texte en dur français
- **Fichier** : `mobile/components/ErrorBoundary.tsx`, lignes 34-53
- **Problème** : "Une erreur est survenue", "Réessayer" non traduits.
- **Fix** : Utiliser `i18n.t()`.

### HIGH-11 : Login screen "Mentions légales" en dur
- **Fichier** : `mobile/app/(auth)/index.tsx`, ligne 127
- **Fix** : Remplacer par `t("settings.legalNotices")`.

### HIGH-12 : Landing page entièrement en dur français
- **Fichiers** : `mobile/components/landing/LandingFeatures.tsx`, `LandingPricing.tsx`, `LandingFooter.tsx`
- **Fix** : Migrer vers i18n.

### HIGH-13 : Permissions labels en dur français
- **Fichier** : `mobile/components/permissions/MyPermissionsCard.tsx`, lignes 10-21
- **Fix** : Migrer vers i18n.

### HIGH-14 : Violation des règles React Hooks dans Dashboard
- **Fichier** : `mobile/app/(app)/index.tsx`, lignes 60-102
- **Problème** : `useMemo` appelé après un `return` conditionnel. Crash possible si `isMobile` change.
- **Fix** : Déplacer tous les hooks avant le return conditionnel.

---

## 4. MOYEN

| # | Fichier | Problème |
|---|---------|----------|
| MED-01 | `server/src/routes/auth.ts:453-462` | OTP réutilisé au lieu de regénéré lors du renvoi |
| MED-02 | `server/src/routes/auth.ts:638-690` | Pas de détection de replay pour le refresh token rotation |
| MED-03 | `server/src/app.ts:136-141` | SPA fallback sert HTML pour routes `/api/` inexistantes au lieu de 404 JSON |
| MED-04 | `server/src/utils/cache.ts` | Cache en mémoire sans limite de taille (risque mémoire) |
| MED-05 | `server/src/services/chat.service.ts:100-106` | Conversation non liée à l'organisation |
| MED-06 | `server/src/schemas/common.schema.ts:6` | Mot de passe : uniquement longueur min 8, pas de complexité |
| MED-07 | `server/src/schemas/organization.schema.ts:4-11` | Slug accepté du client mais auto-généré côté service |
| MED-08 | `server/src/routes/auth.ts` (bcrypt) | Coût bcrypt à 10, OWASP recommande 12 en 2026 |
| MED-09 | `server/src/routes/chat.ts` (multiple) | `console.error` au lieu du logger Winston |
| MED-10 | `server/src/routes/organization.routes.ts:486-492` | Hard delete sans log d'audit |
| MED-11 | `server/src/services/organization.service.ts:177` | Token d'invitation loggé en clair |
| MED-12 | `server/src/services/mfa.service.ts:15` | `MFA_ENCRYPTION_KEY` fallback sur `JWT_SECRET` |
| MED-13 | `server/src/routes/auth.ts:443` | Renvoi OTP sans Turnstile (spam possible) |
| MED-14 | `mobile/lib/services/solde-liquidation.service.ts:46` | Taux IS étranger 33% vs 35% dans fiscal-common.ts |
| MED-15 | `mobile/lib/services/*.ts` (tous) | Aucune validation des entrées négatives |
| MED-16 | `mobile/components/abonnement/*.tsx` | Textes abonnement en dur français |
| MED-17 | `mobile/components/organisation/InviteForm.tsx:70` | Placeholder en dur français |
| MED-18 | `mobile/components/code/MobileCGIBrowser.tsx:282` | "En pause" en dur |
| MED-19 | `mobile/app/(app)/audit/index.tsx:66,96` | "Erreur" en dur |
| MED-20 | `mobile/app/(app)/_layout.tsx:96-103` | Pas de loading pendant vérification subscription |
| MED-21 | `mobile/lib/api/chat.ts:60-166` | SSE sans timeout ni AbortController |
| MED-22 | `mobile/lib/api/chat.ts:80-101` | 401 mobile SSE non géré (pas de refresh token) |
| MED-23 | `mobile/lib/api/chat.ts:133-163` | Bug reset event SSE multi-lignes |
| MED-24 | `mobile/app.json:34-39` | Permissions Android dupliquées |
| MED-25 | `mobile/app/(app)/simulateur/*.tsx` | Titres simulateurs en dur |
| MED-26 | `mobile/app/(app)/simulateur/its.tsx:70-76` | Boutons +/- sans accessibilityLabel |
| MED-27 | `mobile/app/(app)/simulateur/paie.tsx:172-179` | Idem boutons +/- paie |
| MED-28 | `mobile/lib/services/patente.service.ts:109-132` | Logique 1ère tranche confuse |
| MED-29 | `mobile/app/(app)/_layout.tsx:25-53` | retenue-source manquant dans PAGE_TITLES |

---

## 5. BAS

| # | Fichier | Problème |
|---|---------|----------|
| LOW-01 | `server/src/app.ts:102-104` | Health check import dynamique inutile |
| LOW-02 | `server/src/services/tokenBlacklist.service.ts:51,88` | `require()` au lieu de import |
| LOW-03 | `server/src/app.ts:71` | Swagger exposé si NODE_ENV != "production" |
| LOW-04 | `server/src/services/organization.service.ts:35` | Naming incohérent entrepriseNom/name |
| LOW-05 | Routes diverses | Formats de réponse d'erreur incohérents |
| LOW-06 | `server/src/utils/cache.ts:106-114` | Hash DJB2 faible pour clés de cache |
| LOW-07 | `server/src/middleware/auth.ts:91` | Cookie `SameSite: lax` au lieu de `strict` |
| LOW-08 | `server/src/app.ts` | Pas de middleware de logging des requêtes (morgan) |
| LOW-09 | `server/src/app.ts:45` | CSP désactivé mais serveur sert le SPA |
| LOW-10 | `server/src/routes/alertes-fiscales.routes.ts:93-101` | Paramètre `:n` non validé |
| LOW-11 | `server/src/routes/chat.ts:180` | Paramètre `:numero` non validé |
| LOW-12 | `server/src/utils/prisma.ts` | Pas de config logging Prisma en prod |
| LOW-13 | `server/src/server.ts` | Pas de graceful shutdown (SIGTERM) |
| LOW-14 | `mobile/lib/services/contribution-fonciere.service.ts:92-95` | Commentaire "Minimum 1,000" trompeur |
| LOW-15 | `mobile/lib/api/client.ts:56-62` | Erreur header org silencieusement ignorée |
| LOW-16 | `mobile/lib/api/auth.ts:34-37` | Type mismatch forgotPassword |
| LOW-17 | `mobile/app.json:9` | `userInterfaceStyle: "light"` mais dark mode supporté |
| LOW-18 | `mobile/app.json:22-24` | Descriptions permissions iOS en langues mixtes |
| LOW-19 | `mobile/package.json:16` | IP du VPS exposée dans script deploy |
| LOW-20 | `mobile/components/ErrorBoundary.tsx:47-54` | Bouton retry sans accessibilityRole |
| LOW-21 | `mobile/app/(app)/simulateur/*.tsx` | Styles inline (pas de StyleSheet.create) |
| LOW-22 | `mobile/lib/services/contribution-fonciere.service.ts:49` | `usines_transfo` sans traduction i18n |
| LOW-23 | `mobile/app/(app)/simulateur/index.tsx:131` | Route retenue-source sans titre breadcrumb |
| LOW-24 | `mobile/lib/services/igf.service.ts:33` | Taux 0.035 (3.5%) — vérifier si conforme CGI |
| LOW-25 | `ETAT_FONCTIONNALITES_CGI242.md:125` | Référence erronée au split 35%/65% — **corrigé** |

---

## 6. Fonctionnalités manquantes

| # | Description |
|---|-------------|
| MISS-01 | Pas de protection CSRF pour l'auth par cookies |
| MISS-02 | Pas de verrouillage de compte après N tentatives échouées |
| MISS-03 | Pas d'IP dans les logs d'audit |
| MISS-04 | Pas de flux de changement d'email |
| MISS-05 | Pas de changement de mot de passe (authentifié) — seul forgot-password existe |

---

## 7. Inventaire routes et couverture auth

| Route | Auth | Validation | Rate Limit |
|-------|------|------------|------------|
| `POST /api/auth/register` | Non (public) | Oui + Turnstile | authLimiter |
| `POST /api/auth/login` | Non (public) | Oui + Turnstile | authLimiter |
| `POST /api/auth/verify-otp` | Non (public) | Oui | authLimiter |
| `POST /api/auth/send-otp-email` | Non (public) | Oui | sensitiveLimiter |
| `POST /api/auth/forgot-password` | Non (public) | Oui + Turnstile | authLimiter + sensitiveLimiter |
| `POST /api/auth/reset-password` | Non (public) | Oui | authLimiter + sensitiveLimiter |
| `POST /api/auth/refresh-token` | Non (public) | Oui | authLimiter |
| `POST /api/auth/check-email` | Non (public) | Oui | sensitiveLimiter |
| `POST /api/auth/clear-session` | Non (public) | Non | authLimiter |
| `POST /api/auth/logout` | requireAuth | Non | authLimiter |
| `POST /api/chat/message/stream` | requireAuth | Oui + checkQuota | chatLimiter |
| `GET /api/chat/conversations` | requireAuth | Non | chatLimiter |
| `GET /api/organizations` | requireAuth | Non | global seulement |
| `POST /api/organizations` | requireAuth | Oui | global seulement |
| `PUT /api/organizations/:id` | requireAuth + requireAdmin | Oui | global seulement |
| `DELETE /api/organizations/:id` | requireAuth + requireOwner | Oui | global seulement |
| Routes admin (`/api/admin/*`) | requireAuth + requireAdmin | Oui | global seulement |
| Routes subscription | requireAuth + requireOrg | Oui | global seulement |
| Routes analytics | requireAuth + requireOrg | Partiel | global seulement |
| Routes ingestion | requireAuth + requireAdmin | Oui | global seulement |

---

## Corrections déjà appliquées (6 mars 2026)

| Commit | Description |
|--------|-------------|
| `a497004` | Suppression split 35%/65% ITS + correction barème serveur alertes-fiscales |
| `70b7b34` | Fix 3 bugs auth critiques (verifyToken, quota, rememberMe) + doc |

---

*Rapport généré par audit automatisé — CGI-242 v2026*
