# Architecture Multi-Codes Juridiques — CGI-242

## 1. Vision

L'application CGI-242 passe d'un outil centré sur le **Code Général des Impôts** à une plateforme multi-codes juridiques du Congo. Chaque code peut être acheté individuellement ou via un **Pack PRO**.

### Codes prévus

| Code | Abréviation | Statut |
|------|-------------|--------|
| Code Général des Impôts | `cgi` | Existant |
| Code Douanier | `douanier` | À créer |
| Code des Hydrocarbures | `hydrocarbures` | À créer |
| Code Social (Travail + Sécurité sociale) | `social` | À créer |

---

## 2. Architecture actuelle (CGI seul)

### 2.1 Données — 3 emplacements synchronisés

```
┌─────────────────────────────────────────────────────┐
│  mobile/data/                                       │
│  Fichiers détaillés par chapitre                    │
│  Format : { meta, articles[] }                      │
│  Ex: tome2-livre1-chapitre12.json                   │
├─────────────────────────────────────────────────────┤
│  server/data/cgi/2026/                              │
│  Copie IDENTIQUE de mobile/data/                    │
│  Ex: tome2-livre1-chapitre12.json                   │
├─────────────────────────────────────────────────────┤
│  server/data/articles-2026-*.json                   │
│  Fichiers APLATIS pour Qdrant (recherche)           │
│  Format : [{ numero, titre, contenu, tome,          │
│              chapitre, keywords[], source }]         │
│  Ex: articles-2026-tome1.json                       │
│      articles-2026-tome2.json                       │
│      articles-2026-tfnc.json                        │
│      articles-2026-conventions.json                 │
│      articles-2026-annexes.json                     │
└─────────────────────────────────────────────────────┘
```

### 2.2 Format JSON — Fichier chapitre (détaillé)

```json
{
  "meta": {
    "document": "Code général des impôts",
    "pays": "République du Congo",
    "edition": "2026",
    "tome": 2,
    "partie": null,
    "livre": 1,
    "chapitre": 12,
    "chapitre_titre": "Enregistrement en débet...",
    "section": null,
    "section_titre": null,
    "page_source": null
  },
  "articles": [
    {
      "article": "Art. 268",
      "titre": "Énumération des actes...",
      "texte": [
        "Paragraphe 1...",
        "Paragraphe 2..."
      ],
      "mots_cles": [
        "mot1",
        "mot2"
      ],
      "statut": "en vigueur",
      "section": "Section 1 : ..."
    }
  ]
}
```

### 2.3 Format JSON — Fichier aplati (pour Qdrant/recherche)

```json
[
  {
    "numero": "268",
    "titre": "Énumération des actes...",
    "contenu": "Paragraphe 1...\nParagraphe 2...",
    "tome": "2",
    "chapitre": "12",
    "keywords": ["mot1", "mot2"],
    "source": "tome2-livre1-chapitre12.json"
  }
]
```

**Règles de conversion chapitre → aplati :**
- `numero` = numéro sans le préfixe "Art. " (ex: "268" pas "Art. 268")
- `contenu` = `texte[]` joint par `\n`
- `chapitre` = string (ex: `"12"` pas `12`)
- `keywords` = copie de `mots_cles`

### 2.4 Fichiers aplatis existants

| Fichier | Contenu | Tome |
|---------|---------|------|
| `articles-2026-tome1.json` | CGI Tome 1 | `"1"` |
| `articles-2026-tome2.json` | CGI Tome 2 | `"2"` |
| `articles-2026-tfnc.json` | Textes Fiscaux Non-Codifiés | `"TFNC*"` |
| `articles-2026-conventions.json` | Conventions internationales | `"CONV-*"` |
| `articles-2026-annexes.json` | Annexes | `"ANNEXES-1"` |

### 2.5 Fichiers data mobile existants (152 fichiers)

```
mobile/data/
├── tome1-partie1-livre1-chapitre*.json   # CGI Tome 1
├── tome2-livre*-chapitre*.json           # CGI Tome 2
├── tfnc*-*.json                          # Textes non codifiés
├── convention-*.json                     # Conventions internationales
├── taxe-*.json                           # Taxes spécifiques
├── code-hydrocarbures-fiscal.json        # Déjà existant (fiscal hydro)
├── fiscalite-miniere.json                # Fiscalité minière
├── zones-economiques-speciales.json      # ZES
├── index.json                            # Sommaire/Index
└── ...
```

### 2.6 Structure serveur

```
server/
├── src/
│   ├── routes/
│   │   ├── auth.ts                       # Authentification
│   │   ├── chat.ts                       # Chatbot IA
│   │   ├── subscription.routes.ts        # Abonnements
│   │   ├── ingestion.routes.ts           # Import données
│   │   ├── search-history.routes.ts      # Historique recherche
│   │   └── ...                           # 14 fichiers de routes
│   ├── services/                         # Logique métier
│   ├── middleware/                        # Auth, CORS, etc.
│   └── app.ts                            # Config Express
├── data/
│   ├── cgi/2026/                         # Fichiers chapitres
│   └── articles-2026-*.json              # Fichiers aplatis
└── prisma/                               # Schéma BDD
```

### 2.7 Structure mobile

```
mobile/
├── app/
│   ├── (app)/
│   │   ├── code/index.tsx                # Consultation CGI
│   │   ├── chat/index.tsx                # Chatbot IA
│   │   ├── simulateur/*.tsx              # 15 simulateurs fiscaux
│   │   ├── abonnement/index.tsx          # Gestion abonnement
│   │   └── ...                           # 39 écrans total
│   └── (auth)/                           # Login, register, etc.
├── components/
│   ├── code/                             # Composants consultation
│   ├── chat/                             # Composants chatbot
│   ├── paywall/                          # Composants paywall
│   └── ...
├── lib/
│   ├── store/                            # État global (Zustand)
│   ├── services/                         # Services API
│   └── theme/                            # Thème (noir/doré/blanc)
└── data/                                 # Fichiers JSON articles
```

---

## 3. Architecture cible (Multi-Codes)

### 3.1 Nouvelle structure des données

```
mobile/data/
├── cgi/                                  # Code Général des Impôts
│   ├── tome1-partie1-livre1-chapitre1.json
│   ├── tome2-livre1-chapitre12.json
│   ├── tfnc3-petrole-chapitre1.json
│   ├── convention-france.json
│   └── ...                               # 152 fichiers existants
│
├── douanier/                             # Code Douanier
│   ├── titre1-chapitre1.json
│   ├── titre1-chapitre2.json
│   └── ...
│
├── hydrocarbures/                        # Code des Hydrocarbures
│   ├── titre1-chapitre1.json
│   └── ...
│
└── social/                               # Code Social
    ├── livre1-chapitre1.json
    └── ...

server/data/
├── cgi/2026/                             # Identique à mobile/data/cgi/
│   └── *.json
├── douanier/2026/                        # Identique à mobile/data/douanier/
│   └── *.json
├── hydrocarbures/2026/                   # Identique à mobile/data/hydrocarbures/
│   └── *.json
├── social/2026/                          # Identique à mobile/data/social/
│   └── *.json
│
├── articles-2026-tome1.json              # CGI aplati (existant)
├── articles-2026-tome2.json              # CGI aplati (existant)
├── articles-2026-tfnc.json               # CGI aplati (existant)
├── articles-2026-conventions.json        # CGI aplati (existant)
├── articles-2026-annexes.json            # CGI aplati (existant)
├── articles-douanier-2026.json           # Douanier aplati (nouveau)
├── articles-hydrocarbures-2026.json      # Hydrocarbures aplati (nouveau)
└── articles-social-2026.json             # Social aplati (nouveau)
```

### 3.2 Format JSON — Nouveau champ `code`

#### Fichier chapitre (détaillé)

```json
{
  "meta": {
    "code": "douanier",
    "document": "Code Douanier",
    "pays": "République du Congo",
    "edition": "2026",
    "titre": 1,
    "chapitre": 3,
    "chapitre_titre": "Importations et exportations"
  },
  "articles": [
    {
      "article": "Art. 15",
      "titre": "Déclaration en douane",
      "texte": ["..."],
      "mots_cles": ["déclaration", "douane", "importation"],
      "statut": "en vigueur",
      "section": "Section 1 : ..."
    }
  ]
}
```

#### Fichier aplati (pour Qdrant/recherche)

```json
[
  {
    "code": "douanier",
    "numero": "15",
    "titre": "Déclaration en douane",
    "contenu": "...",
    "tome": null,
    "chapitre": "3",
    "keywords": ["déclaration", "douane", "importation"],
    "source": "titre1-chapitre3.json"
  }
]
```

### 3.3 Nommage des fichiers chapitres par code

| Code | Pattern de nommage | Exemple |
|------|-------------------|---------|
| CGI | `tome{N}-{partie}-livre{N}-chapitre{N}.json` | `tome1-partie1-livre1-chapitre3.json` |
| Douanier | `titre{N}-chapitre{N}.json` | `titre1-chapitre3.json` |
| Hydrocarbures | `titre{N}-chapitre{N}.json` | `titre2-chapitre1.json` |
| Social | `livre{N}-titre{N}-chapitre{N}.json` | `livre1-titre2-chapitre5.json` |

Le nommage s'adapte à la structure propre de chaque code juridique.

---

## 4. Process de création d'un nouveau code

### Étape 1 : Préparer les PDF sources
- Scanner ou récupérer le PDF officiel du code
- Numéroter les pages (1.pdf, 2.pdf, ...)

### Étape 2 : Créer la structure de dossiers
```bash
mkdir -p mobile/data/douanier/
mkdir -p server/data/douanier/2026/
```

### Étape 3 : Créer les JSON page par page
Pour chaque page PDF :
1. Lire le PDF
2. Identifier les articles
3. Créer le fichier chapitre JSON (format détaillé avec `meta` + `articles[]`)
4. Extraire les `mots_cles` directement du texte de l'article
5. Copier le fichier dans `server/data/<code>/2026/`
6. Ajouter les articles dans le fichier aplati `articles-<code>-2026.json`

### Étape 4 : Vérification PDF par PDF
Même process que le CGI :
1. Comparer texte JSON vs PDF — corriger les différences
2. Enrichir les mots-clés (toujours extraits du texte)
3. Synchroniser les 3 emplacements (mobile, server chapitre, aplati)

### Étape 5 : Ingestion Qdrant
```bash
# Ingérer le fichier aplati dans Qdrant
POST /api/ingestion { code: "douanier", file: "articles-douanier-2026.json" }
```

---

## 5. Modèle économique

### 5.1 Grille tarifaire

| Plan | Prix | Contenu |
|------|------|---------|
| **Free** | 0 € | 5 questions IA/mois, lecture CGI, simulateurs de base, 7 jours d'essai |
| **Basique** | 65 €/an | 1 code juridique au choix, 15 questions IA/mois, 14 simulateurs, historique, 50 membres |
| **Pro** | 256 €/an | 4 codes (CGI + Douanier + Hydrocarbures + Social), 30 questions IA/mois, historique illimité, support prioritaire, 50 membres |

### 5.2 Les 4 codes disponibles

| Code | Abréviation |
|------|-------------|
| Code Général des Impôts | `cgi` |
| Code Douanier | `douanier` |
| Code des Hydrocarbures | `hydrocarbures` |
| Code Social (Travail + Sécurité sociale) | `social` |

> **Calcul Pro** : 65 € × 4 codes = 256 € (pas de réduction, prix transparent)

### 5.2 Stratégie Freemium (conversion)

| Fonctionnalité | Gratuit (non acheté) | Acheté |
|---|---|---|
| **Recherche** | Résultats floutés + nombre d'articles trouvés | Texte complet |
| **Chatbot IA** | Réponse partielle + "source : Code Douanier" | Réponse complète avec articles |
| **Sommaire** | Titres des chapitres et articles visibles | Contenu complet |
| **Favoris / Notes** | Non | Oui |
| **Simulateurs** | CGI uniquement (gratuit) | Simulateurs étendus |

**Principe : montrer la valeur, bloquer l'accès.** Chaque interaction gratuite est une occasion de conversion.

### 5.3 Le chatbot comme outil de vente

Le chatbot IA répond sur **TOUS** les codes, même non achetés :
- Réponse partielle avec source identifiée
- Message : *"Cet article provient du Code Douanier. Débloquez-le pour voir le texte complet."*
- L'utilisateur découvre naturellement qu'il a besoin d'autres codes

---

## 6. Modifications techniques à prévoir

### 6.1 Base de données (Prisma)

```prisma
model UserPurchase {
  id        String   @id @default(uuid())
  userId    String
  code      String   // "cgi", "douanier", "hydrocarbures", "social", "pro"
  purchasedAt DateTime @default(now())
  expiresAt DateTime?
  user      User     @relation(fields: [userId], references: [id])
}
```

### 6.2 Backend — Nouvelles routes

```
GET    /api/codes                    # Liste des codes disponibles + prix
GET    /api/codes/:code/articles     # Articles d'un code (vérifie achat)
POST   /api/purchases                # Acheter un code
GET    /api/purchases                # Mes achats
```

### 6.3 Qdrant — Organisation

Option retenue : **une collection par code**
```
Collection: cgi-2026        → articles CGI
Collection: douanier-2026   → articles Douanier
Collection: hydrocarbures-2026
Collection: social-2026
```

La recherche interroge toutes les collections mais filtre l'affichage selon les achats.

### 6.4 Mobile — Modifications

- **Écran d'accueil** : sélecteur de code (tabs ou cards)
- **Écran Code** : filtre par code actif avec icône cadenas sur les non-achetés
- **Recherche** : résultats multi-codes, floutage des non-achetés
- **Chatbot** : contexte Qdrant multi-collections, réponse partielle si non acheté
- **Boutique** : nouvel écran pour acheter des codes individuels ou Pack PRO
- **Store Zustand** : état des achats (`purchasedCodes: string[]`)

---

## 7. Palette de couleurs

| Usage | Couleur | Hex |
|-------|---------|-----|
| Fond principal (dark) | Noir profond | `#08080d` |
| Fond secondaire | Noir bleuté | `#0c0c14` |
| Accent / Primary | Doré | `#c8a03c` |
| Cartes / Surfaces | Blanc | `#ffffff` |
| Texte principal | Gris foncé | `#1f2937` |
| Texte secondaire | Gris moyen | `#6b7280` |
| Succès | Vert | `#10b981` |
| Erreur | Rouge | `#ef4444` |
| Cadenas (non acheté) | Gris | `#9ca3af` |

---

## 8. Priorités

1. **Finir la vérification PDF du CGI** (en cours — tome 2)
2. Restructurer `mobile/data/` en sous-dossiers par code
3. Ajouter le champ `code` dans les fichiers aplatis
4. Créer le modèle `UserPurchase` en BDD
5. Implémenter le paywall/floutage
6. Commencer la saisie du Code Douanier (PDF par PDF)
7. Ajouter Code Hydrocarbures et Code Social
