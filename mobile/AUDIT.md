# Audit complet — Application mobile CGI 242

**Date :** 2026-03-03
**Périmètre :** 152 fichiers JSON, 8 composants code CGI, couche données, 8 écrans auth, 12 simulateurs, 8 fichiers chat

---

## 1. Données JSON CGI (152 fichiers, 2248 articles)

| Problème | Sévérité | Articles affectés | Fichiers |
|----------|----------|-------------------|----------|
| Champ `section` manquant (null) | **CRITIQUE** | 700 (31%) | 102 fichiers |
| Format articles incohérent (`bis/ter` au lieu de `-B/-C`) | **MAJEUR** | 235 (10.4%) | 50 fichiers |
| Préfixe `(L.F.20xx)` manquant | **MAJEUR** | 184 (8.2%) | 52 fichiers |
| Articles avec texte vide | MINEUR | 17 (0.76%) | 3 fichiers |

### Détail — section null

Fichiers principaux affectés :
- `code-hydrocarbures-fiscal.json` (37 articles)
- `convention-france.json` (34 articles)
- `convention-rwanda.json` (31 articles)
- `convention-chine.json` (30 articles)
- `impot-global-forfaitaire.json` (20 articles)
- `index.json` (20 articles)
- 96 autres fichiers

**Impact :** Les articles sans section tombent dans une catégorie "Général" fourre-tout, rendant la navigation imprécise.

### Détail — format incohérent

Exemples :
- `Art. 177 bis` → devrait être `Art. 177-B`
- `Art. 373 ter` → devrait être `Art. 373-C`
- `Annexe 1`, `Annexe 2` (formats non standard)

### Détail — texte vide

- `tome1-partie1-livre1-chapitre3.json` (10 articles)
- `tome1-partie1-livre1-chapitre5.json` (4 articles)
- `tome1-partie1-livre1-chapitre4.json` (3 articles)

### Fichiers conformes (16/152)

- `tome1-partie1-livre1-chapitre1.json` (131 articles)
- `tome1-partie1-livre1-chapitre2.json` (58 articles)
- `tome2-livre1-chapitre8.json` (56 articles)
- `tome2-livre1-chapitre7.json` (15 articles)
- `tome2-livre1-chapitre9.json` (13 articles)
- `tome1-partie3-titre3-chapitre3.json` (12 articles)
- et 10 autres

---

## 2. Composants code CGI (8 fichiers)

### 2.1 Types TypeScript insuffisants

| Fichier | Ligne | Problème |
|---------|-------|----------|
| `ChapterReader.tsx` | 12 | `colors: any` dans Props |
| `ChapterReader.tsx` | 61 | `colors: any` dans ArticleBlock |
| `ChapterReader.tsx` | 112 | `colors: any` dans renderArticles |
| `ChapterReader.tsx` | 124 | `colors: any` dans SectionBlockProps |

**Correction :** Créer une interface `ThemeColors` et l'utiliser partout.

### 2.2 Couleurs hardcodées

| Fichier | Ligne | Valeur | Devrait être |
|---------|-------|--------|-------------|
| `ChapterReader.tsx` | 75 | `"#e74c3c"` | `colors.danger` |
| `ChapterReader.tsx` | 81 | `"#fff"` | `colors.background` |
| `ArticleDetail.tsx` | 153 | `"#fff"` | `colors.background` |
| `ArticleDetail.tsx` | 155 | `"#fff"` | `colors.background` |
| `ArticleDetail.tsx` | 175 | `"#000"` | constante shadow |
| `SearchResults.tsx` | 43 | `"#000"` | constante shadow |
| `ContentPanel.tsx` | 85 | `"#000"` | constante shadow |

### 2.3 Textes en dur (sans i18n)

| Fichier | Ligne | Texte |
|---------|-------|-------|
| `SearchResults.tsx` | 21 | `"Aucun resultat pour..."` |
| `SearchResults.tsx` | 24 | `"Essayez avec un autre terme..."` |
| `ContentPanel.tsx` | 53 | `"Selectionnez un element dans le sommaire"` |
| `ContentPanel.tsx` | 56 | `"Naviguez dans l'arborescence..."` |
| `ContentPanel.tsx` | 106 | `"Selectionnez une sous-section..."` |
| `ReferencesBlock.tsx` | 61 | `"Articles liés"` |
| `ReferencesBlock.tsx` | 67 | `"Cet article référence :"` |
| `ReferencesBlock.tsx` | 90 | `"Référencé par :"` |
| `TreeNode.tsx` | 38 | `"dossier"` dans accessibilityLabel |

### 2.4 Imports incohérents

- `ChapterReader.tsx` importe depuis `@/lib/data/types`
- Tous les autres fichiers importent depuis `@/lib/data/cgi`

### 2.5 Double source de vérité

- `code/index.tsx` : `readerNode` (state) et `readerNodeRef` (ref) stockent la même information
- Risque de désynchronisation entre les deux

### 2.6 Callbacks non memoizés

| Fichier | Ligne | Fonction |
|---------|-------|----------|
| `code/index.tsx` | 54 | `toggleExpand` |
| `code/index.tsx` | 58 | `handleSelect` |
| `code/index.tsx` | 91 | `handleSelectChild` |
| `code/index.tsx` | 96 | `handleClearSearch` |
| `ArticleDetail.tsx` | 58 | `prepareForSpeech` |
| `ArticleDetail.tsx` | 66 | `getChunks` |
| `ArticleDetail.tsx` | 97 | `speakChunk` |
| `ArticleDetail.tsx` | 112 | `handlePlay` |
| `ArticleDetail.tsx` | 126 | `handleBack` |

### 2.7 Logique morte / useEffect redondants

- `ArticleDetail.tsx` lignes 36-41 et 44-56 : deux `useEffect` avec la même dépendance `[article]` qui pourraient être fusionnés

### 2.8 ArticleData partiellement construit

- `ReferencesBlock.tsx` ligne 17-27 : `makeArticleData()` crée un `ArticleData` avec des champs vides (`texte: []`, `statut: ""`, etc.)
- Les articles créés via références croisées n'ont pas de contenu complet

---

## 3. Couche données (`lib/data/`)

### 3.1 searchArticles() incomplet

**Fichier :** `lib/data/cgi.ts` lignes 53-58

Champs inclus dans `_searchText` :
- ✅ `article` (numéro)
- ✅ `titre`
- ✅ `mots_cles`
- ✅ `texte`

Champs **NON** inclus :
- ❌ `statut` — chercher "abrogé" ne retourne rien
- ❌ `section` — chercher par numéro de section ne fonctionne pas
- ❌ `annee_application`

### 3.2 buildChapitreTree — clarté du code

**Fichier :** `lib/data/helpers.ts` ligne 80

Utilise `sectionMap.size` au lieu de `sections.length` pour générer les IDs. Fonctionne actuellement mais moins lisible et moins maintenable.

### 3.3 Articles avec section null

67 fichiers JSON sur 152 contiennent des articles avec `section: null`. Le code les convertit silencieusement en `"Général"` (ligne 24 de helpers.ts), créant une grande section fourre-tout.

---

## 4. Écrans d'authentification (8 fichiers)

### 4.1 Logo dupliqué dans 9 écrans

Le bloc logo (icône + texte "NORMX Tax" + tagline) est copié-collé dans :
- `index.tsx`, `password.tsx`, `forgot-password.tsx`, `register.tsx`
- `reset-password.tsx`, `verify-otp.tsx`, `mfa-verify.tsx`, `logout.tsx`
- `_layout.tsx` (header)

**Correction :** Extraire en composant `<AuthLogo />`.

### 4.2 Texte non traduit

`"L'intelligence fiscale africaine"` est hardcodé et non traduit dans 9 fichiers.

### 4.3 Couleurs hardcodées

| Fichier | Lignes | Couleurs |
|---------|--------|----------|
| `index.tsx` | 55, 78 | `"#08080d"` |
| `password.tsx` | 78, 171, 189 | `"#08080d"`, `"#fff"` |
| `forgot-password.tsx` | 58, 112 | `"#08080d"`, `"#fff"` |
| `register.tsx` | 173, 193, 371 | `"#08080d"`, `"#00815d15"`, `"#fff"` |
| `reset-password.tsx` | 118, 217 | `"#08080d"`, `"#fff"` |
| `verify-otp.tsx` | 121, 181 | `"#08080d"`, `"#fff"` |
| `mfa-verify.tsx` | 57, 112 | `"#08080d"`, `"#fff"` |
| `PasswordStrengthIndicator.tsx` | 24-27, 63, 68 | `"#ef4444"`, `"#f97316"`, `"#eab308"`, `"#22c55e"` |

### 4.4 Accessibilité manquante (30+ éléments)

Éléments sans `accessibilityLabel` :
- **TextInput** : index.tsx:83, password.tsx:115, forgot-password.tsx:87, register.tsx:213/305/317/341, reset-password.tsx:172/198, mfa-verify.tsx:86, EmailField.tsx:31, PasswordFields.tsx:44/69, OtpInput.tsx:21
- **TouchableOpacity (boutons)** : index.tsx:100/124, password.tsx:64/142/180/214, forgot-password.tsx:103/119, register.tsx:227/362, reset-password.tsx:208/224/232, verify-otp.tsx:172/188, mfa-verify.tsx:103/119, logout.tsx:44

### 4.5 Incohérence padding / maxWidth

| Écran | paddingHorizontal | maxWidth |
|-------|-------------------|----------|
| `index.tsx` | 24 / 40 | 440 |
| `password.tsx` | 20 / 32 | 420 |
| `forgot-password.tsx` | 20 / 32 | 420 |
| `register.tsx` | 16 / 32 | 520 |
| `reset-password.tsx` | 20 / 32 | 420 |

### 4.6 Catch vides

| Fichier | Ligne | Problème |
|---------|-------|----------|
| `forgot-password.tsx` | 40 | `catch` vide, erreur non loggée |
| `verify-otp.tsx` | 105 | `catch` silencieuse |
| `mfa-verify.tsx` | 37 | `catch` vide |

### 4.7 Anomalie MFA

- `mfa-verify.tsx` ligne 86 : `maxLength={9}` pour un code MFA (devrait être `6`)

---

## 5. Simulateurs (12 fichiers)

### 5.1 Code dupliqué (~60%)

Patterns répétés dans les 12 simulateurs :

| Pattern | Description | Occurrences |
|---------|-------------|-------------|
| Layout 50/50 responsive | `flexDirection: isMobile ? "column" : "row"` + `width: "50%"` | 12 fichiers |
| Header formulaire | Titre + description + icône | 12 fichiers |
| Boutons type/régime | Groupe de boutons sélectionnables | 13 instances |
| Empty state | Icône calculator + texte "saisissez..." | 12 fichiers |
| Section résultat rouge | Fond `#fef2f2` + texte `#b91c1c` | 12+ instances |
| Section résultat vert | Fond `citationsBg` + texte `#166534` | 10+ instances |

**Correction :** Créer des composants réutilisables : `<SimulateurLayout>`, `<SimulateurHeader>`, `<OptionButtonGroup>`, `<ResultBox>`, `<SimulateurEmptyState>`.

### 5.2 Couleurs hardcodées (65 occurrences)

| Couleur | Usage | Occurrences |
|---------|-------|-------------|
| `#fef2f2` | Fond rouge résultat | 12 |
| `#991b1b` | Texte rouge foncé | 12 |
| `#b91c1c` | Texte rouge | 12 |
| `#166534` | Texte vert | 12 |
| `#eff6ff` | Fond bleu | 1 |
| `#1e40af` | Texte bleu | 1 |
| `#fff` | Texte blanc | 15+ |

### 5.3 Textes hardcodés

- `"FCFA"` hardcodé dans 5 fichiers (patente x3, its x1, solde-liquidation x1)
- `"CFPB"` / `"CFPNB"` hardcodé dans contribution-fonciere.tsx

### 5.4 Imports inutilisés

| Fichier | Import inutilisé |
|---------|-----------------|
| `ircm.tsx` | `TextInput`, `formatInputNumber` |
| `enregistrement.tsx` | `Switch` |

---

## 6. Chat (8 fichiers)

### 6.1 Textes hardcodés

| Fichier | Ligne | Texte |
|---------|-------|-------|
| `CitationsBlock.tsx` | 33 | `"Sources CGI"` |
| `CitationsBlock.tsx` | 61 | `"Voir {n} autre(s) source(s)"` |
| `CitationsBlock.tsx` | 68 | `"Réduire"` |
| `StreamingBubble.tsx` | 58 | `"Réflexion en cours..."` |
| `HistoryPanel.tsx` | 36 | Locale `"fr-FR"` hardcodée |
| `HistoryPanel.tsx` | 63 | `"jours"` hardcodé |

### 6.2 Couleurs hardcodées

| Fichier | Ligne | Couleur |
|---------|-------|---------|
| `ChatHeader.tsx` | 34 | `"#333"` |
| `CitationsBlock.tsx` | 44 | `"#d1fae5"` |

### 6.3 Gestion d'erreurs

- `chat/index.tsx` ligne 97-116 : `getConversation()` sans `.finally()` — le state de chargement n'est pas reset en cas d'erreur

---

## Priorités de correction

### P0 — Critique

1. **Section null** : Corriger les 700 articles sans section dans 102 fichiers JSON
2. **Logo dupliqué** : Extraire en composant `<AuthLogo />` (9 fichiers)
3. **Composants simulateurs** : Factoriser les 6 patterns dupliqués (60% de code en moins)

### P1 — Majeur

4. **searchArticles()** : Ajouter `statut` et `section` à l'index de recherche
5. **Format articles** : Standardiser `bis` → `-B`, `ter` → `-C` (235 articles)
6. **Couleurs hardcodées** : Centraliser dans le thème (80+ occurrences)
7. **Accessibilité** : Ajouter les 30+ `accessibilityLabel` manquants

### P2 — Moyen

8. **i18n** : Traduire tous les textes en dur (20+ textes)
9. **Double source de vérité** : Fusionner `readerNode` state + `readerNodeRef`
10. **Préfixes L.F.** : Ajouter `(L.F.20xx)` aux 184 articles concernés
11. **maxLength MFA** : Corriger `9` → `6`
12. **Catch vides** : Ajouter logging dans les 3 écrans auth concernés

### P3 — Mineur

13. **Imports inutilisés** : Nettoyer ircm.tsx et enregistrement.tsx
14. **Types any** : Remplacer par `ThemeColors` dans ChapterReader
15. **useCallback** : Memoizer les 13+ callbacks non memoizés
16. **Texte vide** : Compléter les 17 articles sans contenu
