# Simulateurs fiscaux — CGI Congo 2026

## Simulateurs existants

| # | Simulateur | Impôt | Articles CGI |
|---|-----------|-------|-------------|
| 1 | **ITS** | Impôt sur les Traitements et Salaires | Art. 114-116I |
| 2 | **IS — Minimum de perception** | Acomptes trimestriels IS | Art. 86B |
| 3 | **IS — Solde de liquidation** | Calcul IS définitif - acomptes versés | Art. 86A, 86G |
| 4 | **Patente** | Contribution des patentes | Art. 277-307 |

---

## Simulateurs à implémenter

### Priorité 1 — Fort impact utilisateur

| # | Simulateur | Description | Inputs | Formule | Articles |
|---|-----------|------------|--------|---------|----------|
| 5 | **IRCM** | Impôt sur le Revenu des Capitaux Mobiliers | Montant dividendes/intérêts/plus-values, type de revenu | Taux 15% (standard), 35% (revenus occultes) | Art. 103-110A |
| 6 | **IRF — Loyers** | Impôt sur les Revenus Fonciers (loyers) | Loyers bruts annuels, charges | Base = loyers bruts, taux 9%, retenue source par locataire PM | Art. 111-113A |
| 7 | **IRF — Plus-values immobilières** | Plus-values de cession d'immeubles | Prix d'achat, prix de vente, durée détention | Taux 15% sur la plus-value nette | Art. 111B, 112B |
| 8 | **IBA** | Impôt sur les Bénéfices d'Affaires | CA, charges déductibles, régime (réel/forfait) | Taux 30% (réel) ou forfait selon CA | Art. 93-102 |
| 9 | **TVA** | Calcul TVA collectée - déductible | CA HT, achats HT, taux applicable | TVA due = TVA collectée (18%) - TVA déductible | TFNC6 Art. 16-29 |

### Priorité 2 — Utile pour les entreprises

| # | Simulateur | Description | Inputs | Formule | Articles |
|---|-----------|------------|--------|---------|----------|
| 10 | **TUS** | Taxe Unique sur les Salaires | Masse salariale brute | Taux 5% sur masse salariale | TFNC4 titre 4.15 |
| 11 | **IGF** | Impôt Global Forfaitaire (petites entreprises) | CA estimé | Barème forfaitaire selon tranches CA | TFNC4 titre 4.6 |
| 12 | **Droits d'enregistrement — Mutations immobilières** | Cession d'immeuble | Prix de vente, nature du bien | Barème selon nature (terrain, bâti, fonds de commerce) | Tome 2, Livre 3 |
| 13 | **Droits d'enregistrement — Cessions parts sociales** | Cession de parts/actions | Prix de cession, type société | Taux selon type de société | Tome 2, Livre 1 |
| 14 | **Contribution foncière (CFPNB/CFPB)** | Propriétés bâties et non bâties | Valeur locative, nature propriété | Taux selon catégorie + centimes additionnels | Tome 2, Livre 4 |
| 15 | **Retenue source non-résidents** | IS retenu sur paiements aux non-résidents | Montant versé, nature prestation | Taux 35% (Art. 86C) ou convention applicable | Art. 86C, conventions |

### Priorité 3 — Spécialisé / niches

| # | Simulateur | Description | Inputs | Formule | Articles |
|---|-----------|------------|--------|---------|----------|
| 16 | **Droits d'accises** | Boissons, tabac, produits pétroliers | Quantité, type produit | Taux spécifique par produit | TFNC4 titre 4.3 |
| 17 | **Pénalités fiscales** | Calcul des majorations/amendes | Type infraction, montant impôt, délai retard | Taux selon gravité (50%-200%) + intérêts | Art. 372-381 |
| 18 | **Taxe sur les transferts de fonds** | Transferts hors CEMAC | Montant transféré | Taux selon destination | TFNC4 titre 4.14 |
| 19 | **Redevance crédits carbone** | Activités émettrices CO2 | Volume émissions, type activité | Barème selon volume | TFNC4 titre 4.18 |

---

## Récapitulatif

| Catégorie | Existants | À implémenter | Total |
|-----------|----------|---------------|-------|
| Impôts sur le revenu (Chap. 2) | 1 (ITS) | 4 (IRCM, IRF loyers, IRF PV, IBA) | 5 |
| Impôt sur les sociétés (Chap. 1) | 2 (IS min, solde) | 1 (retenue non-résidents) | 3 |
| Taxes indirectes | 0 | 2 (TVA, accises) | 2 |
| Contributions/patentes | 1 (patente) | 3 (TUS, IGF, contribution foncière) | 4 |
| Enregistrement/mutations | 0 | 2 (immo, parts sociales) | 2 |
| Sanctions | 0 | 1 (pénalités) | 1 |
| Spécialisé | 0 | 2 (transferts, carbone) | 2 |
| **Total** | **4** | **15** | **19** |
