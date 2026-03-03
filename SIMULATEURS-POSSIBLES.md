# Simulateurs fiscaux — CGI Congo 2026

## A. Simulateurs existants (4)

### 1. ITS — Impôt sur les Traitements et Salaires (Art. 114-116I)

**Inputs** : Salaire brut mensuel, situation familiale, nombre d'enfants

**Formule** :

```
1. CNSS = min(salaire_brut, 1 200 000) × 4%
2. Base après CNSS = salaire_brut − CNSS
3. Frais professionnels = base_après_CNSS × 20%
4. Revenu net imposable annuel = (base_après_CNSS − frais_pro) × 12
5. Parts = selon situation (marié = 2, célibataire = 1, +0.5/enfant, max 6.5)
6. Revenu par part = revenu_net_imposable / parts
7. Barème progressif par part :
   - 0 → 615 000         : forfait 1 200 FCFA
   - 615 001 → 1 500 000 : 10%
   - 1 500 001 → 3 500 000 : 15%
   - 3 500 001 → 5 000 000 : 20%
   - > 5 000 000          : 30%
8. ITS annuel = impôt_par_part × nombre_de_parts
9. ITS mensuel = ITS_annuel / 12
10. Salaire net = salaire_brut − CNSS − ITS_mensuel
```

**Pertinence** : Très élevée — concerne tous les salariés et employeurs du Congo.

---

### 2. IS — Minimum de perception (Art. 86B)

**Inputs** : Produits d'exploitation, produits financiers, produits HAO, retenues libératoires, déficit consécutif (oui/non)

**Formule** :

```
1. Base = produits_exploitation + produits_financiers + produits_HAO − retenues_libératoires
2. Taux = 1% (normal) ou 2% (si déficit fiscal ≥ 2 exercices consécutifs)
3. Minimum annuel = base × taux
4. Acompte trimestriel = minimum_annuel / 4
   → Échéances : 15 mars, 15 juin, 15 septembre, 15 décembre
```

**Pertinence** : Très élevée — toutes les sociétés doivent le calculer chaque trimestre.

---

### 3. IS — Solde de liquidation (Art. 86A, 86G)

**Inputs** : Résultat fiscal, type contribuable, 4 acomptes trimestriels versés

**Formule** :

```
1. Résultat arrondi = arrondir_inf(résultat_fiscal, 1 000)
2. Taux IS selon type :
   - Droit commun : 28%
   - Microfinance / Enseignement privé : 25%
   - Mines / Carrières : 28%
   - Entités étrangères : 35%
3. IS calculé = résultat_arrondi × taux
4. Total acomptes = Q1 + Q2 + Q3 + Q4
5. Solde = IS_calculé − total_acomptes
   → Si solde > 0 : montant à payer
   → Si solde < 0 : crédit d'impôt
```

**Pertinence** : Très élevée — clôture annuelle de toute société.

---

### 4. Patente — Contribution des patentes (Art. 277-307)

**Inputs** : Chiffre d'affaires, régime fiscal, mise en veille (oui/non), nombre d'entités fiscales

**Formule** :

```
1. Si mise en veille : patente = dernière_patente × 25%
2. Sinon, barème dégressif sur CA :
   - 0 → 1 000 000               : 0%
   - 1 000 001 → 20 000 000      : 0,75%
   - 20 000 001 → 40 000 000     : 0,65%
   - 40 000 001 → 100 000 000    : 0,45%
   - 100 000 001 → 300 000 000   : 0,20%
   - 300 000 001 → 500 000 000   : 0,15%
   - 500 000 001 → 1 000 000 000 : 0,14%
   - 1 Md → 3 Mds                : 0,135%
   - 3 Mds → 20 Mds              : 0,125%
   - > 20 Mds                    : 0,045%
3. Patente brute = somme par tranche
4. Réduction = patente_brute × 50% (Art. 306)
5. Patente nette = patente_brute − réduction
6. Patente par entité = patente_nette / nombre_entités
```

**Pertinence** : Très élevée — obligatoire pour toute activité commerciale.

---

## B. Simulateurs à implémenter

### Priorité 1 — Fort impact utilisateur

---

### 5. IRCM — Impôt sur le Revenu des Capitaux Mobiliers (Art. 103-110A)

**Inputs** : Montant brut (dividendes, intérêts, plus-values mobilières), type de revenu

**Formule** :

```
1. Base imposable = montant_brut (pas d'abattement)
2. Taux selon type :
   - Dividendes : 15%
   - Intérêts créances/dépôts : 15%
   - Plus-values cession valeurs mobilières : 15%
   - Revenus occultes / distributions déguisées : 35%
3. IRCM = base × taux
4. Mode : retenue à la source (précompte libératoire)
```

**Pertinence** : Élevée — tout actionnaire recevant des dividendes, tout épargnant percevant des intérêts.

---

### 6. IRF — Revenus fonciers / Loyers (Art. 111-113A)

**Inputs** : Loyers bruts annuels, type de locataire (personne morale ou physique)

**Formule** :

```
1. Base imposable = loyers_bruts (pas d'abattement pour charges)
2. Taux = 9%
3. IRF = base × 9%
4. Si locataire = personne morale :
   → Retenue à la source par le locataire (Art. 113A)
   → IRF retenu = loyer_mensuel × 9%
5. Si locataire = personne physique :
   → Déclaration et paiement par le propriétaire
```

**Pertinence** : Élevée — tout propriétaire bailleur, tout locataire PM qui doit retenir.

---

### 7. IRF — Plus-values immobilières (Art. 111B, 112B)

**Inputs** : Prix d'acquisition, frais d'acquisition, travaux, prix de cession, frais de cession

**Formule** :

```
1. Prix d'acquisition majoré = prix_achat + frais_acquisition + travaux
2. Plus-value brute = prix_cession − frais_cession − prix_acquisition_majoré
3. Si plus-value ≤ 0 : pas d'impôt
4. Si plus-value > 0 :
   → Taux = 15%
   → IRF = plus_value × 15%
5. Exonérations (Art. 111D) :
   - Résidence principale (sous conditions)
   - Cessions entre époux
```

**Pertinence** : Moyenne-élevée — concerne toute cession immobilière (terrain, appartement, maison).

---

### 8. IBA — Impôt sur les Bénéfices d'Affaires (Art. 93-102)

**Inputs** : CA annuel, charges déductibles, régime (réel ou forfait)

**Formule** :

```
RÉGIME RÉEL (Art. 95) :
1. Bénéfice imposable = CA − charges_déductibles
2. IBA = bénéfice_imposable × 30%
3. Minimum de perception = produits_bruts × 1,5%
4. Impôt dû = max(IBA, minimum_perception)

RÉGIME FORFAITAIRE (Art. 96-101) :
1. Applicable si CA < seuil TVA
2. Bénéfice forfaitaire = CA × coefficient_selon_activité
3. IBA forfaitaire = selon barème IGF (TFNC4 titre 4.6)
```

**Pertinence** : Élevée — tout entrepreneur individuel, commerçant, artisan.

---

### 9. TVA — Taxe sur la Valeur Ajoutée (TFNC6)

**Inputs** : CA HT, achats/investissements HT éligibles, type d'opération (taxable/exonérée/export)

**Formule** :

```
1. TVA collectée = CA_HT_taxable × 18%
2. TVA déductible = achats_HT_éligibles × 18%
3. TVA due = TVA_collectée − TVA_déductible
   → Si TVA due > 0 : montant à reverser
   → Si TVA due < 0 : crédit de TVA (reportable ou remboursable)
4. Cas export : TVA collectée = 0% (exonéré), TVA déductible maintenue
   → Crédit structurel → demande de remboursement
5. Déclaration mensuelle (avant le 15 du mois suivant — Art. 461 bis LF 2026)
```

**Pertinence** : Très élevée — tout assujetti TVA (CA > seuil).

---

### Priorité 2 — Utile pour les entreprises

---

### 10. TUS — Taxe Unique sur les Salaires (TFNC4 titre 4.15)

**Inputs** : Masse salariale brute mensuelle, type d'entreprise

**Formule** :

```
1. Base = salaire_brut (salaire + émoluments + primes + indemnités + avantages en nature)
   (Art. 3 — même assiette que l'IRPP, Art. 37-39 Tome 1)
2. Taux selon type :
   - Droit commun : 7,5% (Art. 6, LF 2024)
   - Sociétés pétrolières : 2,5% (LF 2021, Art. 5 modifié)
   - Zones franches santé / ZVI : 2,5%
3. TUS = base × taux
4. Répartition du produit (Art. 8, LF 2024) :
   - Budget de l'État : 27%
   - FIGA : 10%
   - FONEA : 23%
   - ACPE : 10%
   - FNH : 5%
   - ADPME : 5%
   - ACPCE : 5%
   - Université Marien NGOUABI : 5%
   - ANIRSJ : 10%
   → Part État collectée par l'administration fiscale (DGI)
   → Parts organismes collectées par la CNSS
5. Paiement : avant le 15 du mois suivant (Art. 7 + Art. 461 bis LF 2026)
   (NB : Art. 461 bis LF 2026 unifie tous les délais mensuels au 15, sauf août → 20)
6. Déclaration spontanée mensuelle auprès DGI + CNSS (Art. 7)
7. Charge patronale (non retenue sur le salaire du salarié)
8. Exonérations (Art. 5) : représentations diplomatiques, organisations internationales
9. Non récupérable comme coût pétrolier, mais déductible de l'IS
```

**Pertinence** : Élevée — tout employeur (PM droit public/privé, exploitants individuels régime réel).

---

### 11. IGF — Impôt Global Forfaitaire (TFNC4 titre 4.6)

**Inputs** : CA annuel estimé, type d'activité

**Formule** :

```
Barème forfaitaire par tranches de CA :
- 0 → 1 000 000               : montant fixe selon activité
- 1 000 001 → 5 000 000       : montant fixe croissant
- 5 000 001 → 10 000 000      : montant fixe croissant
- 10 000 001 → 20 000 000     : montant fixe croissant
- 20 000 001 → 30 000 000     : montant fixe croissant
- > 30 000 000                 : passage au régime réel obligatoire

L'IGF remplace : IBA + patente + ITS patronal pour les petites entreprises.
Paiement trimestriel.
```

**Pertinence** : Moyenne — petites entreprises/commerçants informels en voie de formalisation.

---

### 12. Droits d'enregistrement — Mutations immobilières (Tome 2, Livre 3)

**Inputs** : Prix de vente, nature du bien (terrain nu, bâti, fonds de commerce), localisation

**Formule** :

```
1. Base = prix_de_vente (ou valeur vénale si supérieure)
2. Taux selon nature :
   - Terrain nu : 6%
   - Immeuble bâti : 6%
   - Fonds de commerce : 10% (variable selon tranche)
3. Droits = base × taux
4. Frais additionnels : timbre fiscal + salaire conservateur (1%)
5. Total = droits + frais
6. Délai : 3 mois après signature acte
```

**Pertinence** : Moyenne-élevée — toute transaction immobilière, notaires, promoteurs.

---

### 13. Droits d'enregistrement — Cessions parts sociales (Tome 2, Livre 1)

**Inputs** : Prix de cession, type de société (SARL, SA), valeur nominale

**Formule** :

```
1. Base = prix_de_cession (ou valeur réelle si supérieure)
2. Taux :
   - Parts sociales SARL : 5%
   - Actions SA : 1,5%
3. Droits = base × taux
4. Minimum de perception applicable
```

**Pertinence** : Moyenne — cessions d'entreprises, restructurations, M&A.

---

### 14. Contribution foncière CFPNB / CFPB (Tome 2, Livre 4)

**Inputs** : Valeur locative estimée, nature (bâti/non bâti), localisation

**Formule** :

```
CFPB (propriétés bâties) :
1. Base = valeur_locative × 50% (abattement pour charges)
2. Taux = variable selon commune (ex: 15% à Brazzaville)
3. CFPB = base × taux
4. Centimes additionnels communaux en sus

CFPNB (propriétés non bâties) :
1. Base = valeur_locative (pas d'abattement)
2. Taux = variable selon commune
3. CFPNB = base × taux
```

**Pertinence** : Moyenne — propriétaires immobiliers, promoteurs.

---

### 15. Retenue à la source non-résidents (Art. 86C, conventions)

**Inputs** : Montant versé, nature prestation (services, redevances, intérêts), pays bénéficiaire

**Formule** :

```
1. Base = montant_brut versé au non-résident
2. Taux par défaut (Art. 86C) : 35%
3. Taux conventionnel (si convention applicable) :
   - France : dividendes 15%, intérêts 15%, redevances 15%
   - CEMAC : dividendes 15%, intérêts 15%, redevances 20%
   - Autres conventions : selon accord bilatéral
4. Retenue = base × taux_applicable
5. Retenue opérée et versée par le payeur congolais
6. Déclaration dans les 15 jours suivant le paiement
```

**Pertinence** : Élevée — toute entreprise payant des prestataires étrangers.

---

### Priorité 3 — Spécialisé / niches

---

### 16. Droits d'accises (TFNC4 titre 4.3)

**Inputs** : Type de produit, quantité/volume, valeur CIF (si importation)

**Formule** :

```
Taux spécifiques par catégorie :
- Boissons alcoolisées : 25% à 32% ad valorem
- Tabac/cigarettes : 30% ad valorem + droit spécifique/unité
- Produits pétroliers : montant fixe par litre
- Véhicules de luxe : 10% à 25%
- Cosmétiques importés : 25%

Accise = (valeur_CIF + droits_douane) × taux_accise
ou
Accise = quantité × droit_spécifique
```

**Pertinence** : Faible-moyenne — importateurs, brasseries, distributeurs pétroliers.

---

### 17. Pénalités fiscales (Art. 372-381)

**Inputs** : Type d'infraction, montant de l'impôt en cause, nombre de jours/mois de retard

**Formule** :

```
DÉCLARATION TARDIVE (Art. 373) :
- Amende = 15 000 FCFA/jour de retard (max 500 000 FCFA)
- Majoration = 50% des cotisations dues

INEXACTITUDE DÉCLARATIVE (Art. 374) :
- Bonne foi : majoration 50%
- Mauvaise foi : majoration 100%
- Fraude TVA : majoration 200%

PAIEMENT EN RETARD :
- Intérêt de retard = 0,5%/jour (max 20%) — Art. 374 ter
- TVA/accises : 5%/mois ou 15%/mois (max 50%) — Art. 373

DÉFAUT DÉCLARATION D'EXISTENCE : amende fixe 200 000 FCFA (Art. 378)
VENTES SANS FACTURE : 2× droits compromis (récidive 4×) — Art. 374
```

**Pertinence** : Moyenne-élevée — utile pour les entreprises et comptables qui veulent anticiper le coût d'un retard.

---

### 18. Taxe sur les transferts de fonds (TFNC4 titre 4.14)

**Inputs** : Montant transféré, destination (CEMAC/hors CEMAC)

**Formule** :

```
1. Base = montant_transféré
2. Taux :
   - Transferts intra-CEMAC : exonéré
   - Transferts hors CEMAC : 1,5% (taux standard)
3. Taxe = base × taux
4. Retenue par l'établissement financier
```

**Pertinence** : Faible — banques et établissements de transfert.

---

### 19. Redevance crédits carbone — RCC (TFNC4 titre 4.18)

**Inputs** : Volume d'émissions CO2 estimé (tonnes), type d'activité

**Formule** :

```
1. Base = volume_émissions en tonnes CO2 équivalent
2. Taux = montant par tonne selon barème LF 2026
3. RCC = base × taux_par_tonne
4. Déclaration annuelle
```

**Pertinence** : Faible — concerne uniquement les grandes industries émettrices.

---

## C. Récapitulatif et priorisation

| #  | Simulateur                       | Pertinence       | Complexité  | Recommandation |
| -- | -------------------------------- | ---------------- | ------------ | -------------- |
| 5  | **IRCM**                   | Élevée         | Faible       | Implémenter   |
| 6  | **IRF Loyers**             | Élevée         | Faible       | Implémenter   |
| 9  | **TVA**                    | Très élevée   | Moyenne      | Implémenter   |
| 10 | **TUS**                    | Élevée         | Très faible | Implémenter   |
| 15 | **Retenue non-résidents** | Élevée         | Moyenne      | Implémenter   |
| 8  | **IBA**                    | Élevée         | Moyenne      | Implémenter   |
| 17 | **Pénalités fiscales**   | Moyenne-élevée | Moyenne      | Implémenter   |
| 7  | **IRF Plus-values**        | Moyenne-élevée | Faible       | Implémenter   |
| 12 | **Enregistrement immo**    | Moyenne-élevée | Moyenne      | Optionnel      |
| 14 | **Contribution foncière** | Moyenne          | Moyenne      | Optionnel      |
| 13 | **Enregistrement parts**   | Moyenne          | Faible       | Optionnel      |
| 11 | **IGF**                    | Moyenne          | Moyenne      | Optionnel      |
| 16 | **Accises**                | Faible-moyenne   | Élevée     | Reporter       |
| 18 | **Transferts de fonds**    | Faible           | Très faible | Reporter       |
| 19 | **Crédits carbone**       | Faible           | Faible       | Reporter       |

**Recommandation** : implémenter les 8 premiers (IRCM, IRF loyers, TVA, TUS, retenue non-résidents, IBA, pénalités, IRF plus-values) pour couvrir 90% des besoins des utilisateurs.
