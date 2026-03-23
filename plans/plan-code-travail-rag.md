# Plan : Enrichir le RAG avec le Code du travail

## Objectif
Lorsque le CGI ne peut pas répondre à une question (ex: "qu'est-ce que le salaire de présence ?"),
le Code du travail doit prendre le relais et fournir la réponse.

## Source
- **Fichier** : `COG-14546.pdf` (racine du projet) — PDF numérique, texte sélectionnable
- **Ancien fichier** : `code-du-travail2.pdf` (scan OCR de qualité moyenne, 93 pages) — remplacé
- **Loi** : N° 45-75 du 15 mars 1975, modifiée par Loi N° 22-88 du 17 septembre 1988 et Loi N° 6-96 du 6 mars 1996
- **Pages** : 53 pages, ~200 articles

---

## Sections pertinentes du Code du travail

### 1. TITRE III - DU SALAIRE (Art. 80-102) — PRIORITÉ HAUTE
Directement lié à l'ITS (Art. 115 du CGI). Répond aux questions sur la composition du salaire.

| Chapitre | Articles | Contenu fiscal |
|---|---|---|
| Ch.1 - Détermination du salaire | Art. 80-86 | Égalité salariale, SMIG, primes d'éloignement, indemnité de déplacement, salaire à la tâche |
| Ch.2 - Paiement du salaire | Art. 87-90 | Mode de paiement, bulletin de paie, livre de paie, périodicité |
| Section II - Privilèges/garanties | Art. 91-98 | **Art. 91 NOUVEAU** = définition du salaire (salaire de base + allocation de congé + primes + indemnités sauf licenciement), fraction insaisissable, créances en cas de faillite |
| Section III - Prescription | Art. 99 | Prescription de 1 an pour l'action en paiement |
| Ch.3 - Retenues sur salaire | Art. 100-102 | Prélèvements obligatoires, taux, portions soumises à retenue, indemnités exclues (remboursement frais, charges de famille) |

### 2. TITRE IV - DES CONDITIONS DU TRAVAIL (Art. 105-129) — PRIORITÉ HAUTE
Impact direct sur le calcul de la rémunération imposable.

| Chapitre | Articles | Contenu fiscal |
|---|---|---|
| Ch.1 - Durée du travail | Art. 105 | 40h/semaine, 2400h/an (agricole), heures supplémentaires (majorées = imposables) |
| Ch.2 - Travail de nuit | Art. 106-111 | Travail entre 20h-5h, majorations salariales (imposables) |
| Ch.3 - Femmes et enfants | Art. 112-117 | Congé maternité 15 semaines, salaire pendant maternité (50% employeur + 50% CNSS), allaitement |
| Ch.4 - Repos hebdomadaire | Art. 118 | 24h minimum, dimanche |
| Ch.5 - Congé payé | Art. 119-129 | **Art. 119** : 26 jours ouvrables/an. **Art. 122** : allocation de congé (= rémunérations des 12 derniers mois). Transports à charge de l'employeur |

### 3. TITRE II - DU CONTRAT DE TRAVAIL (Art. 26-47) — PRIORITÉ MOYENNE
Indemnités de fin de contrat = impact fiscal direct.

| Section | Articles | Contenu fiscal |
|---|---|---|
| Section 3 - Résiliation | Art. 37-46 | Indemnité de licenciement (Art. 42 NOUVEAU), indemnité de préavis (Art. 41 NOUVEAU), dommages-intérêts, certificat de travail |
| Section 4 - Suspension | Art. 47 NOUVEAU | Cas de suspension : maladie (6 mois), accident de travail, maternité, chômage économique/technique, grève, détention préventive (6 mois) |
| Section 5 - Chômage éco/technique | Art. 47-2 à 47-12 | Durée chômage économique (3 mois renouvelable 1 fois), chômage technique (6 mois) |

### 4. TITRE I - DISPOSITIONS GÉNÉRALES (Art. 1-4) — PRIORITÉ BASSE
Définitions de base.

| Article | Contenu |
|---|---|
| Art. 2 NOUVEAU | Définition de "travailleur" : toute personne engagée moyennant rémunération |
| Art. 3 | Définition d'"entreprise" : toute personne employant un ou plusieurs travailleurs |

### 5. CHAPITRE 7 - DU CAUTIONNEMENT (Art. 77-79) — PRIORITÉ BASSE
Dépôts d'argent par les travailleurs auprès de l'employeur.

| Article | Contenu |
|---|---|
| Art. 77 | Cautionnement : registre d'employeur, dépôt dans le mois |
| Art. 78 | Retrait sous double consentement |
| Art. 79 | Privilège sur les sommes déposées |

### 6. CHAPITRE 5 - DU TRAVAIL TEMPORAIRE (Art. 73 à 73-19) — PRIORITÉ BASSE
Cotisations sociales des travailleurs temporaires.

### 7. TITRE V - HYGIÈNE, SÉCURITÉ ET SERVICE MÉDICAL (Art. 131-148) — PRIORITÉ BASSE
Obligations de l'employeur en matière de sécurité, accidents du travail, service médical obligatoire.

| Chapitre | Articles | Contenu |
|---|---|---|
| Ch.1 - Hygiène et sécurité | Art. 131-140 | Commission nationale, prévention des risques, machines, mise en demeure |
| Ch.2 - Service médical | Art. 141-148 | Accidents du travail, visites médicales, infirmerie obligatoire, soins gratuits |

### 8. TITRE VI - ORGANISMES ET MOYENS D'EXÉCUTION (Art. 149+) — PRIORITÉ BASSE
Administration du travail, inspection du travail.

### 9. TITRES VII à X — PRIORITÉ BASSE
- Titre 7 : Syndicats professionnels
- Titre 8 : Règlement des différends du travail
- Titre 9 : Pénalités
- Titre 10 : Dispositions transitoires

---

## Fichier à créer

### `server/data/articles-2026-code-travail.json`

Format identique aux autres fichiers articles :

```json
[
  {
    "numero": "CT-80",
    "titre": "Égalité salariale",
    "contenu": "A conditions égales de travail, de qualification professionnelle et de rendement le salaire est égal pour tous les travailleurs quels que soient leur origine, leur sexe, leur âge et leur statut.\nDans tous les cas où les conditions de travail et d'exploitation le permettront, les salaires seront fixés au mois.\nLes dispositions nécessaires seront prévues par les Conventions Collectives ou Accords d'Établissements.",
    "tome": "CODE-TRAVAIL",
    "chapitre": "Titre III - Du Salaire",
    "keywords": ["salaire", "égalité salariale", "qualification", "rendement", "convention collective"],
    "source": "code-du-travail-titre3-ch1.json"
  }
]
```

**Convention de numérotation** : préfixe `CT-` + numéro d'article (ex: `CT-91`, `CT-105`, `CT-122`)

**Tome** : `"CODE-TRAVAIL"` pour les distinguer des articles du CGI

### Estimation : ~130 articles à saisir

| Priorité | Articles | Nb estimé |
|---|---|---|
| Haute | Art. 80-102, 105-129 | ~50 |
| Moyenne | Art. 37-47-16 (inclut sous-articles 37-2 à 37-5, 39-2, 39-3, 47-2 à 47-16) | ~30 |
| Basse | Art. 1-4, 73-73-19, 77-79, 131-148 | ~50 |

---

## Fichier à modifier

### `server/scripts/migrate-qdrant-voyage.ts`

Ajouter le fichier Code du travail dans la liste de chargement :

```typescript
const articleFiles = [
  'articles-2026-tome1.json',
  'articles-2026-tome2.json',
  'articles-2026-tfnc.json',
  'articles-2026-conventions.json',
  'articles-2026-annexes.json',
  'articles-2026-code-travail.json',  // ← AJOUT
];
```

---

## Étapes d'implémentation

### Étape 1 : Saisie des articles (depuis le PDF numérique)
1. Lire chaque section du PDF `COG-14546.pdf`
2. Transcrire chaque article dans le format JSON ci-dessus
3. Ajouter des mots-clés pertinents pour le matching RAG
4. **Commencer par Titre III (salaire)** car c'est le besoin immédiat

### Étape 2 : Validation du JSON
```bash
cd server/data
node -e "const a = require('./articles-2026-code-travail.json'); console.log(a.length + ' articles')"
```

### Étape 3 : Modifier le script de migration
- Ajouter `'articles-2026-code-travail.json'` à la liste `articleFiles`

### Étape 4 : Ré-indexer dans Qdrant
```bash
cd server
npx ts-node scripts/migrate-qdrant-voyage.ts
```

### Étape 5 : Tester
Questions à tester sur le chatbot :
- "Qu'est-ce que le salaire de présence ?"
- "Comment est composé le salaire ?"
- "Quelle est la durée du congé payé au Congo ?"
- "Quelles sont les retenues sur salaire ?"
- "Quelle est la durée légale du travail ?"
- "Quels sont les droits de la femme enceinte au travail ?"
- "Comment est calculée l'allocation de congé ?"
- "Quelle est l'indemnité de licenciement ?"

---

## Articles clés à saisir en priorité

### Titre III - Salaire
- **Art. 80** : Égalité salariale, fixation au mois
- **Art. 81** : Indemnité compensatrice de déplacement
- **Art. 82** : Primes d'éloignement, indemnité de déplacement
- **Art. 83** : SMIG, salaires minima, taux heures supplémentaires, primes d'ancienneté
- **Art. 84** : Rémunération à la tâche, pas de salaire en cas d'absence
- **Art. 85** : Affichage des taux minima de salaire
- **Art. 86** : Rémunération par commissions (calcul congé payé, indemnités, 12 derniers mois)
- **Art. 87** : Paiement en monnaie légale, pas en nature ni alcool
- **Art. 88** : Périodicité de paiement (quinzaine/mois), acomptes, participations aux bénéfices
- **Art. 89** : Paiement mensuel entreprises > 50 travailleurs
- **Art. 90** : Constatation du paiement, bulletin de paie, livre de paie, "solde de tout compte" inopposable
- **Art. 91 NOUVEAU** : **DÉFINITION DU SALAIRE** = salaire de base + allocation de congé + primes + indemnités (sauf licenciement)
- **Art. 92 NOUVEAU** : Fraction insaisissable, privilège préférable sur biens de l'employeur
- **Art. 93-98** : Créances en cas de faillite, logement, droit de rétention, travaux publics
- **Art. 99** : Prescription de 1 an pour action en paiement
- **Art. 100** : Retenues sur salaire : prélèvements obligatoires, saisie-arrêt, cession volontaire
- **Art. 101** : Portions soumises à prélèvements progressifs, exclusions (frais remboursés, charges de famille)
- **Art. 102** : Nullité des prélèvements non autorisés, intérêts au taux légal

### Titre IV - Conditions du travail
- **Art. 105** : Durée légale 40h/semaine, 2400h/an agricole, heures supplémentaires
- **Art. 106** : Travail de nuit = 20h à 5h
- **Art. 107** : Max 8h consécutives de nuit
- **Art. 113** : Congé maternité, suspension 15 semaines, salaire (50% employeur + 50% CNSS)
- **Art. 114** : Interdiction d'employer femme enceinte pendant 15 semaines
- **Art. 118** : Repos hebdomadaire 24h, dimanche
- **Art. 119** : Congé payé 26 jours ouvrables/an, ancienneté
- **Art. 120** : Droit au congé acquis après 12 mois, prescrit par 3 ans
- **Art. 122** : **ALLOCATION DE CONGÉ** = rémunérations des 12 mois précédents (sauf indemnité de dépaysement)

### Titre II - Contrat de travail
- **Art. 37** : Contrat à durée déterminée = fin à l'expiration du terme
- **Art. 37-2 à 37-5** *(Loi n°6-96)* : Résolution, rupture anticipée, préjudice
- **Art. 38** : Engagement à l'essai = cessation sans préavis par l'une des parties
- **Art. 39** *(Loi n°6-96)* : Résiliation CDI, préavis, licenciement économique
- **Art. 39-2, 39-3** *(Loi n°6-96)* : Exceptions, réunion délégués, calendrier licenciements
- **Art. 40** : Obligations pendant le préavis, jours de liberté
- **Art. 41** *(Loi n°6-96)* : Indemnité compensatrice de préavis
- **Art. 42** *(Loi n°6-96)* : Rupture abusive = réintégration, dommages-intérêts
- **Art. 43** : Nouvel employeur solidaire si débauchage
- **Art. 44-46** : Résiliation contrat Art.33, modification juridique, certificat de travail
- **Art. 47** *(Loi n°6-96)* : Suspension du contrat (12 cas : maladie, accident, maternité, grève, etc.)
- **Art. 47-2 à 47-16** *(Loi n°6-96)* : Chômage économique et technique (durée, indemnités, procédure)

---

## Notes techniques
- Le PDF `COG-14546.pdf` est un PDF numérique de bonne qualité (texte sélectionnable, source : www.Droit-Afrique.com)
- L'ancien `code-du-travail2.pdf` (scan OCR) est conservé comme référence mais n'est plus la source principale
- Certains articles ont des numéros composés (37-2, 47-12, 73-8) → utiliser le format `CT-37-2`
- Le Code du travail date de 1975, modifié en 1988 et 1996. Les articles modifiés portent la mention *(Loi n°6-96)* ou *(loi n°22/88)*
- La collection Qdrant `cgi_2026` contiendra à la fois les articles CGI et Code du travail, distingués par le champ `tome`
