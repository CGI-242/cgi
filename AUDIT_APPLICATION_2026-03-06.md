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

| Sévérité     | Backend      | Frontend     | Total        |
| --------------- | ------------ | ------------ | ------------ |
| CRITIQUE        | 4            | 1            | **5**  |
| HAUT            | 7            | 7            | **14** |
| MOYEN           | 13           | 16           | **29** |
| BAS             | 13           | 12           | **25** |
| Manquant        | 5            | 0            | **5**  |
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

### HIGH-01 : Pas de gestionnaire d'erreurs global Express — CORRIGÉ

- **Fichier** : `server/src/app.ts`
- **Fix appliqué** : Ajout d'un error handler global `(err, req, res, next)` empêchant l'exposition de stack traces.

### HIGH-02 : Token blacklist en mémoire uniquement — CORRIGÉ (via MISS-02)

- **Fichier** : `server/src/services/tokenBlacklist.service.ts`
- **Fix appliqué** : Blacklist persistée en base via Prisma. Détection de replay avec révocation de toutes les sessions.

### HIGH-03 : `clear-session` sans authentification — CORRIGÉ

- **Fichier** : `server/src/routes/auth.ts`
- **Fix appliqué** : Documenté comme intentionnel (nécessaire pour nettoyer les cookies après session expirée). Protection CSRF ajoutée (MISS-01).

### HIGH-04 : `search-history/popular` expose les recherches de tous les utilisateurs — CORRIGÉ

- **Fichier** : `server/src/routes/search-history.routes.ts`
- **Fix appliqué** : Filtre `where: { userId }` ajouté pour scoper les recherches populaires par utilisateur.

### HIGH-05 : Rate limiter global trop bas (100 req/15min) — CORRIGÉ

- **Fichier** : `server/src/middleware/rateLimit.middleware.ts`
- **Fix appliqué** : Augmenté à 300 en production, 1000 en dev.

### HIGH-06 : Schéma organisation incompatible avec le service — CORRIGÉ

- **Fichier** : `server/src/services/organization.service.ts`
- **Fix appliqué** : `createOrganization` accepte `name` (REST) et `entrepriseNom` (register) avec fallback.

### HIGH-07 : Pas de rate limiting sur routes sensibles — CORRIGÉ

- **Fichier** : `server/src/app.ts`
- **Fix appliqué** : `sensitiveLimiter` ajouté sur `/api/admin`, `/api/subscription`, `/api/ingestion`.

### HIGH-08 : Paie service contourne `calculateFraisPro()` — CORRIGÉ

- **Fichier** : `mobile/lib/services/paie.service.ts`
- **Fix appliqué** : Remplacé `* 0.80` par `* (1 - FISCAL_PARAMS.fraisPro.taux)`.

### HIGH-09 : IS Service — taux minimum 1% uniquement (Art. 86-C §3) — CORRIGÉ

- **Fichier** : `mobile/lib/services/is.service.ts`
- **Fix appliqué** : Le taux 2% déficit n'existe pas dans le CGI. Conservé uniquement 1% (Art. 86-C §3).

### HIGH-10 : ErrorBoundary texte en dur français — CORRIGÉ

- **Fichier** : `mobile/components/ErrorBoundary.tsx`
- **Fix appliqué** : Migré vers `i18n.t()` (class component).

### HIGH-11 : Login screen "Mentions légales" en dur — CORRIGÉ

- **Fichier** : `mobile/app/(auth)/index.tsx`
- **Fix appliqué** : Remplacé par `t("settings.legalNotices")`.

### HIGH-12 : Landing page entièrement en dur français — CORRIGÉ

- **Fichiers** : `LandingFeatures.tsx`, `LandingPricing.tsx`, `LandingFooter.tsx`
- **Fix appliqué** : Migré vers i18n avec clés `landing.*`.

### HIGH-13 : Permissions labels en dur français — CORRIGÉ

- **Fichier** : `mobile/components/permissions/MyPermissionsCard.tsx`
- **Fix appliqué** : Migré vers i18n avec clés `permLabels.*`.

### HIGH-14 : Violation des règles React Hooks dans Dashboard — CORRIGÉ

- **Fichier** : `mobile/app/(app)/index.tsx`
- **Fix appliqué** : Tous les `useMemo` déplacés avant le return conditionnel.

---

## 4. MOYEN

| #      | Fichier                                           | Problème                                                                     | Statut             |
| ------ | ------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------ |
| MED-01 | `server/src/routes/auth.ts`                     | OTP réutilisé au lieu de regénéré lors du renvoi                         | **CORRIGÉ** |
| MED-02 | `server/src/routes/auth.ts`                     | Pas de détection de replay pour le refresh token rotation                    | **CORRIGÉ** |
| MED-03 | `server/src/app.ts`                             | SPA fallback sert HTML pour routes `/api/` inexistantes au lieu de 404 JSON | **CORRIGÉ** |
| MED-04 | `server/src/utils/cache.ts`                     | Cache en mémoire sans limite de taille (risque mémoire)                     | **CORRIGÉ** |
| MED-05 | `server/src/services/chat.service.ts`           | Conversation non liée à l'organisation                                      | **CORRIGÉ** |
| MED-06 | `server/src/schemas/common.schema.ts`           | Mot de passe : uniquement longueur min 8, pas de complexité                  | **CORRIGÉ** |
| MED-07 | `server/src/schemas/organization.schema.ts`     | Slug accepté du client mais auto-généré côté service                    | **CORRIGÉ** |
| MED-08 | `server/src/routes/auth.ts`                     | Coût bcrypt à 10, OWASP recommande 12 en 2026                               | **CORRIGÉ** |
| MED-09 | `server/src/routes/chat.ts`                     | `console.error` au lieu du logger Winston                                   | **CORRIGÉ** |
| MED-10 | `server/src/routes/organization.routes.ts`      | Hard delete sans log d'audit                                                  | **CORRIGÉ** |
| MED-11 | `server/src/services/organization.service.ts`   | Token d'invitation loggé en clair                                            | **CORRIGÉ** |
| MED-12 | `server/src/services/mfa.service.ts`            | `MFA_ENCRYPTION_KEY` fallback sur `JWT_SECRET`                            | **CORRIGÉ** |
| MED-13 | `server/src/routes/auth.ts`                     | Renvoi OTP sans Turnstile (spam possible)                                     | **CORRIGÉ** |
| MED-14 | `mobile/lib/services/fiscal-common.ts`          | Taux IS étranger 35% → 33% (Art. 86A)                                       | **CORRIGÉ** |
| MED-15 | `mobile/lib/services/*.ts`                      | Aucune validation des entrées négatives                                     | **CORRIGÉ** |
| MED-16 | `mobile/components/abonnement/*.tsx`            | Textes abonnement en dur français                                            | **CORRIGÉ** |
| MED-17 | `mobile/components/organisation/InviteForm.tsx` | Placeholder en dur français                                                  | **CORRIGÉ** |
| MED-18 | `mobile/components/code/MobileCGIBrowser.tsx`   | "En pause" en dur                                                             | **CORRIGÉ** |
| MED-19 | `mobile/app/(app)/audit/index.tsx`              | "Erreur" en dur                                                               | **CORRIGÉ** |
| MED-20 | `mobile/app/(app)/_layout.tsx`                  | Pas de loading pendant vérification subscription                             | **CORRIGÉ** |
| MED-21 | `mobile/lib/api/chat.ts`                        | SSE sans timeout ni AbortController                                           | **CORRIGÉ** |
| MED-22 | `mobile/lib/api/chat.ts`                        | 401 mobile SSE non géré (pas de refresh token)                              | **CORRIGÉ** |
| MED-23 | `mobile/lib/api/chat.ts`                        | Bug reset event SSE multi-lignes                                              | **CORRIGÉ** |
| MED-24 | `mobile/app.json`                               | Permissions Android dupliquées                                               | **CORRIGÉ** |
| MED-25 | `mobile/app/(app)/simulateur/*.tsx`             | Titres simulateurs en dur                                                     | **CORRIGÉ** |
| MED-26 | `mobile/app/(app)/simulateur/its.tsx`           | Boutons +/- sans accessibilityLabel                                           | **CORRIGÉ** |
| MED-27 | `mobile/app/(app)/simulateur/paie.tsx`          | Idem boutons +/- paie                                                         | **CORRIGÉ** |
| MED-28 | `mobile/lib/services/patente.service.ts`        | Logique 1ère tranche confuse                                                 | **CORRIGÉ** |
| MED-29 | `mobile/app/(app)/_layout.tsx`                  | retenue-source manquant dans PAGE_TITLES                                      | **CORRIGÉ** |

---

## 5. BAS

| #      | Fichier                                                  | Problème                                                | Statut                                                     |
| ------ | -------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| LOW-01 | `server/src/app.ts`                                    | Health check import dynamique inutile                    | **CORRIGÉ**                                         |
| LOW-02 | `server/src/services/tokenBlacklist.service.ts`        | `require()` au lieu de import                          | **CORRIGÉ**                                         |
| LOW-03 | `server/src/app.ts`                                    | Swagger exposé si NODE_ENV != "production"              | **CORRIGÉ**                                         |
| LOW-04 | `server/src/services/organization.service.ts`          | Naming incohérent entrepriseNom/name                    | **CORRIGÉ**                                         |
| LOW-05 | Routes diverses                                          | Formats de réponse d'erreur incohérents                | **CORRIGÉ**                                         |
| LOW-06 | `server/src/utils/cache.ts`                            | Hash DJB2 faible pour clés de cache                     | **CORRIGÉ**                                         |
| LOW-07 | `server/src/middleware/auth.ts`                        | Cookie `SameSite: lax` au lieu de `strict`           | **CORRIGÉ**                                         |
| LOW-08 | `server/src/app.ts`                                    | Pas de middleware de logging des requêtes               | **CORRIGÉ**                                         |
| LOW-09 | `server/src/app.ts`                                    | CSP désactivé mais serveur sert le SPA                 | **CORRIGÉ**                                         |
| LOW-10 | `server/src/routes/alertes-fiscales.routes.ts`         | Paramètre `:n` non validé                            | **CORRIGÉ**                                         |
| LOW-11 | `server/src/routes/chat.ts`                            | Paramètre `:numero` non validé                       | **CORRIGÉ**                                         |
| LOW-12 | `server/src/utils/prisma.ts`                           | Pas de config logging Prisma en prod                     | **CORRIGÉ**                                         |
| LOW-13 | `server/src/server.ts`                                 | Pas de graceful shutdown (SIGTERM)                       | **CORRIGÉ**                                         |
| LOW-14 | `mobile/lib/services/contribution-fonciere.service.ts` | Commentaire "Minimum 1,000" trompeur                     | **CORRIGÉ**                                         |
| LOW-15 | `mobile/lib/api/client.ts`                             | Erreur header org silencieusement ignorée               | **CORRIGÉ**                                         |
| LOW-16 | `mobile/lib/api/auth.ts`                               | Type mismatch forgotPassword                             | **CORRIGÉ**                                         |
| LOW-17 | `mobile/app.json`                                      | `userInterfaceStyle: "light"` mais dark mode supporté | **CORRIGÉ**                                         |
| LOW-18 | `mobile/app.json`                                      | Descriptions permissions iOS en langues mixtes           | **CORRIGÉ**                                         |
| LOW-19 | `mobile/package.json`                                  | IP du VPS exposée dans script deploy                    | **CORRIGÉ**                                         |
| LOW-20 | `mobile/components/ErrorBoundary.tsx`                  | Bouton retry sans accessibilityRole                      | **CORRIGÉ**                                         |
| LOW-21 | `mobile/app/(app)/simulateur/*.tsx`                    | Styles inline (pas de StyleSheet.create)                 | NON CORRIGÉ — cosmétique, trop invasif                  |
| LOW-22 | `mobile/lib/services/contribution-fonciere.service.ts` | `usines_transfo` sans traduction i18n                  | **CORRIGÉ**                                         |
| LOW-23 | `mobile/app/(app)/simulateur/index.tsx`                | Route retenue-source sans titre breadcrumb               | **CORRIGÉ** (MED-29)                                |
| LOW-24 | `mobile/lib/services/igf.service.ts`                   | Taux 0.035 (3.5%) — vérifier si conforme CGI           | NON CORRIGÉ — TODO ajouté, validation juridique requise |
| LOW-25 | `ETAT_FONCTIONNALITES_CGI242.md`                       | Référence erronée au split 35%/65%                    | **CORRIGÉ**                                         |

---

## 6. Fonctionnalités manquantes

| #       | Description                                                  | Statut                                                           |
| ------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| MISS-01 | Pas de protection CSRF pour l'auth par cookies               | **CORRIGÉ** — double-submit cookie + middleware          |
| MISS-02 | Pas de verrouillage de compte après N tentatives échouées | **CORRIGÉ** — 5 tentatives → lock 15min                 |
| MISS-03 | Pas d'IP dans les logs d'audit                               | **CORRIGÉ** — champ ipAddress + getClientIp()            |
| MISS-04 | Pas de flux de changement d'email                            | **CORRIGÉ** — POST change-email + confirm-email-change   |
| MISS-05 | Pas de changement de mot de passe (authentifié)             | **CORRIGÉ** — POST change-password + invalidation tokens |

---

## 7. Inventaire routes et couverture auth

| Route                              | Auth                       | Validation       | Rate Limit                     |
| ---------------------------------- | -------------------------- | ---------------- | ------------------------------ |
| `POST /api/auth/register`        | Non (public)               | Oui + Turnstile  | authLimiter                    |
| `POST /api/auth/login`           | Non (public)               | Oui + Turnstile  | authLimiter                    |
| `POST /api/auth/verify-otp`      | Non (public)               | Oui              | authLimiter                    |
| `POST /api/auth/send-otp-email`  | Non (public)               | Oui              | sensitiveLimiter               |
| `POST /api/auth/forgot-password` | Non (public)               | Oui + Turnstile  | authLimiter + sensitiveLimiter |
| `POST /api/auth/reset-password`  | Non (public)               | Oui              | authLimiter + sensitiveLimiter |
| `POST /api/auth/refresh-token`   | Non (public)               | Oui              | authLimiter                    |
| `POST /api/auth/check-email`     | Non (public)               | Oui              | sensitiveLimiter               |
| `POST /api/auth/clear-session`   | Non (public)               | Non              | authLimiter                    |
| `POST /api/auth/logout`          | requireAuth                | Non              | authLimiter                    |
| `POST /api/chat/message/stream`  | requireAuth                | Oui + checkQuota | chatLimiter                    |
| `GET /api/chat/conversations`    | requireAuth                | Non              | chatLimiter                    |
| `GET /api/organizations`         | requireAuth                | Non              | global seulement               |
| `POST /api/organizations`        | requireAuth                | Oui              | global seulement               |
| `PUT /api/organizations/:id`     | requireAuth + requireAdmin | Oui              | global seulement               |
| `DELETE /api/organizations/:id`  | requireAuth + requireOwner | Oui              | global seulement               |
| Routes admin (`/api/admin/*`)    | requireAuth + requireAdmin | Oui              | global seulement               |
| Routes subscription                | requireAuth + requireOrg   | Oui              | global seulement               |
| Routes analytics                   | requireAuth + requireOrg   | Partiel          | global seulement               |
| Routes ingestion                   | requireAuth + requireAdmin | Oui              | global seulement               |

---

## Corrections déjà appliquées (6 mars 2026)

| Commit      | Description                                                                 | Sévérité |
| ----------- | --------------------------------------------------------------------------- | ----------- |
| `a497004` | Suppression split 35%/65% ITS + correction barème serveur alertes-fiscales | —          |
| `70b7b34` | Fix 3 bugs auth critiques (verifyToken, quota, rememberMe) + doc            | —          |
| `705b79a` | Corriger 5 vulnérabilités critiques (CRIT-01 à CRIT-05)                  | CRITIQUE    |
| `3b4a567` | Sécurité auth + accessibilité aria-hidden                                | CRITIQUE    |
| `59778ff` | Invalider tous les tokens après changement de mot de passe                 | CRITIQUE    |
| `5f890a8` | Corriger 14 issues HIGH (HIGH-01 à HIGH-14) + fix "Refresh token manquant" | HAUT        |
| `4871dbf` | Corriger 29 issues MEDIUM (MED-01 à MED-29)                                | MOYEN       |
| `9bef4c7` | Implémenter 5 fonctionnalités manquantes (MISS-01 à MISS-05)             | FEATURE     |
| `b4c865b` | Corriger 25 issues LOW (LOW-01 à LOW-25)                                   | BAS         |

### Résumé de l'état des corrections

| Sévérité     | Total        | Corrigé     | Restant     |
| --------------- | ------------ | ------------ | ----------- |
| CRITIQUE        | 5            | 5            | 0           |
| HAUT            | 14           | 14           | 0           |
| MOYEN           | 29           | 29           | 0           |
| BAS             | 25           | 23           | 2           |
| FEATURE         | 5            | 5            | 0           |
| **Total** | **78** | **76** | **2** |

### Issues non corrigées (intentionnel)

| #          | Raison                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------- |
| LOW-21     | Styles inline dans simulateurs — trop invasif, aucun impact fonctionnel                    |
| LOW-24  | Taux IGF 3.5% — divergence avec Art. 5 (5%), TODO ajouté, nécessite validation juridique |

---

*Rapport généré par audit automatisé — CGI-242 v2026*
