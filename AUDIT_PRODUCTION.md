# Audit de Production — CGI 242 Mobile

**Projet :** `/cgi-242/mobile`
**Framework :** React Native 0.81 / Expo 54 / TypeScript 5.9
**Date :** 01/03/2026

---

## Résultats des vérifications automatiques

| Vérification | Résultat |
|---|---|
| TypeScript (`tsc --noEmit`) | PASS — 0 erreurs |
| Tests (`npm test`) | PASS — 37 tests, 4 suites |
| Secrets / clés API | PASS — aucun secret dans le code |
| TODO / FIXME / HACK | PASS — aucun trouvé |
| Mock / données factices | PASS — aucun trouvé |
| `.gitignore` | PASS — `.env`, `node_modules/`, `dist/` exclus |
| Capture d'écran | PASS — bloquée en production (mobile uniquement) |
| ErrorBoundary + Sentry | PASS — erreurs capturées et envoyées |

---

## CRITIQUE (4)

### C1. URL localhost en fallback dans le code de production

**Fichiers :** `lib/api/client.ts:3`, `lib/api/chat.ts:6`

```ts
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3004/api";
```

Si `EXPO_PUBLIC_API_URL` n'est pas défini au build, l'app appellera `localhost:3004` en production. De plus, le port `3004` ne correspond pas au `.env.example` qui indique `3003`.

**Correction :** supprimer le fallback localhost ou le remplacer par l'URL de production.

---

### C2. API_URL dupliqué (violation DRY)

`API_URL` est défini indépendamment dans `client.ts` et `chat.ts`. Si l'un est mis à jour sans l'autre, les requêtes iront vers des serveurs différents.

**Correction :** `chat.ts` doit importer l'URL depuis `client.ts`.

---

### C3. `expo-screen-capture` absent des plugins `app.json`

Le code appelle `ScreenCapture.preventScreenCaptureAsync()` en production, mais le plugin n'est pas déclaré dans `app.json > plugins`. Cela peut causer un crash ou une défaillance silencieuse sur les builds EAS natifs.

**Correction :** ajouter `"expo-screen-capture"` dans le tableau `plugins` de `app.json`.

---

### C4. Sentry DSN optionnel sans validation au build

**Fichier :** `lib/sentry.ts`

Si le build de production est créé sans `EXPO_PUBLIC_SENTRY_DSN`, le monitoring est complètement désactivé sans avertissement. Les crashs en production passeront inaperçus.

**Correction :** ajouter un warning visible si le DSN est absent en production.

---

## AVERTISSEMENT (8)

### W1. `console.warn` non gardé en production

**Fichier :** `lib/hooks/usePushNotifications.ts:47`

```ts
console.warn("Push notification registration failed:", err);
```

Ce `console.warn` n'est pas conditionné par `__DEV__` et s'exécutera en production.

---

### W2. Blocs `.catch(() => {})` vides (erreurs avalées)

| Fichier | Contexte |
|---|---|
| `app/(app)/chat/index.tsx:106` | Chargement des messages — l'utilisateur ne voit rien si ça échoue |
| `app/(auth)/verify-otp.tsx:35` | Envoi OTP initial — l'utilisateur attend un code qui n'arrive jamais |
| `components/code/ArticleDetail.tsx:48` | Chargement des références croisées |
| `lib/theme/ThemeContext.tsx:43` | Sauvegarde de la préférence de thème |

Le plus critique : l'envoi OTP silencieux (`verify-otp.tsx`).

---

### W3. i18n incomplet — chaînes françaises en dur

L'app utilise `react-i18next` sur certains écrans, mais plusieurs écrans contiennent des dizaines de chaînes en dur :

- `securite/index.tsx` — ~20 chaînes
- `organisation/index.tsx` — ~15 chaînes
- `admin/index.tsx` — ~8 chaînes
- `abonnement/index.tsx` — ~6 chaînes
- `analytics/index.tsx` — ~10 chaînes
- `invitations/index.tsx` — écran entier en dur
- `permissions/index.tsx` — ~6 chaînes
- `components/code/ArticleDetail.tsx` — "Retour aux articles", "Ecouter", etc.
- `components/ErrorBoundary.tsx` — "Une erreur est survenue", "Réessayer"

Un changement de langue ne traduira pas ces écrans.

---

### W4. Version hardcodée

**Fichier :** `app/(app)/parametres/index.tsx:200`

```tsx
<SettingsRow ... value="1.0.0" />
```

La version est en dur au lieu d'être lue depuis `app.json` via `expo-constants`.

---

### W5. Profil EAS production minimal

**Fichier :** `eas.json`

```json
"production": { "autoIncrement": true }
```

Il manque : `channel` (OTA updates), bloc `env`, paramètres iOS/Android spécifiques.

---

### W6. `eas.projectId` absent de `app.json`

Requis pour EAS Build et EAS Update. Sans lui, `eas build` échouera en CI.

---

### W7. Sentry sans tag `environment`

**Fichier :** `lib/sentry.ts`

Pas de tag `environment` configuré — les erreurs production et staging seront mélangées dans le dashboard Sentry.

---

### W8. Vérification de connectivité via Google

**Fichier :** `lib/hooks/useOnlineStatus.ts:25`

```ts
await fetch("https://clients3.google.com/generate_204", { method: "HEAD" });
```

Le ping Google toutes les 15s peut signaler "hors ligne" dans les régions où Google est bloqué. Utiliser l'API de l'app à la place.

---

## INFO (5)

| # | Détail |
|---|---|
| I1 | Les `console.warn` dans `client.ts` et `auth.ts` sont gardés par `__DEV__` — OK |
| I2 | Config `app.json` correcte (nom, icônes, splash, bundle IDs, permissions) |
| I3 | Protection capture d'écran active en production mobile uniquement — OK |
| I4 | ErrorBoundary + `Sentry.wrap()` en place — OK |
| I5 | Couverture de tests limitée aux services fiscaux (0 tests composants/API/navigation) |

---

## Résumé

| Sévérité | Nombre | Bloquant pour la production ? |
|---|---|---|
| **CRITIQUE** | 4 | Oui — C1 et C2 peuvent rendre l'app non fonctionnelle |
| **AVERTISSEMENT** | 8 | Non bloquant mais recommandé |
| **INFO** | 5 | Améliorations futures |

**Recommandation :** Corriger les 4 points CRITIQUES avant tout build de production. Les points C1 (localhost fallback) et C2 (API_URL dupliqué) sont les plus risqués.
