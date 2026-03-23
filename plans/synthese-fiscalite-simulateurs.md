# Synthèse Fiscalité CGI Congo — Amélioration Simulateurs & RAG

> Sources : *Cours fiscalité de droit commun.docx* + *RIT-6_OF_06022021 vdef.pptx*
> Croisé avec CGI 2026 et simulateurs existants de NORMX Tax

---

## 1. Régimes d'imposition — CGI 2026

### Terminologie CGI 2026 (≠ ancien cours 2014-2020)
Le CGI 2026 a **renommé** les catégories d'impôts sur le revenu :

| Ancien (cours) | **CGI 2026** | Articles |
|----------------|-------------|----------|
| ~~IRPP cat. IBA/BNC/BA~~ | **IBA** — Impôt sur les Bénéfices d'Affaires | Art. 93+ |
| ~~IRPP cat. salaires~~ | **ITS** — Impôt sur les Traitements et Salaires | Art. 112+ |
| ~~IRF~~ | **IRF** — Impôt sur les Revenus Fonciers | Art. 111+ |
| ~~IRCM~~ | **IRCM** — Impôt sur le Revenu des Capitaux Mobiliers | Art. 105+ |
| ~~IS~~ | **IS** — Impôt sur les Sociétés | Chap. 1 |

### Régimes d'imposition
| Régime | Personnes | CA HT | Impôt principal |
|--------|-----------|-------|-----------------|
| **Entreprenant** (LF 2019) | PP, TPE | Très petit | IGF simplifié |
| **Forfait (IGF)** | PP, CA ≤ 100M | ≤ 100M FCFA | IGF (5% CA / 8% marge) |
| **Réel** | PP > 100M ou PM | > 100M FCFA | IBA (PP) ou IS (PM) |

### Forfait — IGF (Impôt Global Forfaitaire)
- ⚠️ **Le cours indique 7% / 10% — ANCIENNES valeurs (avant 2026)**
- **CGI 2026 (Art. 5 §5 TFNC4)** :
  - Produits à marge libre : **IGF = CA HT × 5%**
  - Produits à marge réglementée : **IGF = Marge globale annuelle × 8%**
- Payable en **4 acomptes** : 20 mars, 20 juin, 20 septembre, 20 décembre (Art. 3bis)
- L'IGF est **libératoire** de : **IBA** (ex-IRPP cat. IBA/BNC/BA), TVA, centimes additionnels TVA, TUS (Art. 3)
- Sanction : celles prévues en matière de patente (Art. 6)

> **→ Notre simulateur IGF est CONFORME au CGI 2026** (5% / 8%, 4 acomptes). ✅

---

### Régime de l'entreprenant (LF 2019 — nouveau dans le CGI 2026)
- **Personnes éligibles** : personnes physiques exerçant activité civile, commerciale, artisanale ou agricole (Art. 2)
- **Non éligibles** : personnes morales, personnes déjà sous un régime fiscal existant (Art. 3)
- **Statut** : acquis par déclaration au RCCM sans frais (Art. 4)
- **Régime d'imposition** : très petites entreprises (Art. 7)
- **Obligations** : registre chronologique achats/ventes, comptabilité SMT (OHADA), factures (Art. 8)
- **Perte du statut** : si seuils dépassés 2 années consécutives (Art. 9)

> **→ Pas de simulateur nécessaire** (régime simplifié, pas de calcul complexe). À intégrer dans le RAG.

---

## 2. IBA — Impôt sur les Bénéfices d'Affaires (ex-IRPP/IBA)

### Calcul du résultat fiscal (régime réel)
```
RC = Produits − Charges
RF = RC + Réintégrations − Déductions − ARD − Report déficitaire
```

### Abattements spéciaux
- **Bénéfice Agricole (BA)** : abattement **40%** sur le RF
- **Micro-finances / Écoles privées** : abattement **30%** sur le RF (LF 2012)

### Calcul du IBA (même barème que ITS)
1. **Quotient Familial** : QF = RF / Nombre de parts
2. **Barème progressif** :

⚠️ **ATTENTION** : Le cours (2014) cite l'ancien barème IBA (Art. 95). Le CGI 2026 a un **barème ITS différent** :

| Ancien barème cours (IBA) | Taux | CGI 2026 barème ITS | Taux |
|---------------------------|------|---------------------|------|
| 0 – 464 000 | 1% | 0 – 615 000 | 1 200 fixe |
| 464 001 – 1 000 000 | 10% | 615 001 – 1 500 000 | 10% |
| 1 000 001 – 3 000 000 | 25% | 1 500 001 – 3 500 000 | 15% |
| > 3 000 000 | 40% | 3 500 001 – 5 000 000 | 20% |
| | | > 5 000 000 | 30% |

→ Vérifier quel barème s'applique au IBA dans le CGI 2026 (possiblement le même que l'ITS Art. 95)

3. **IBA = Somme des tranches × Nombre de parts**
4. **IBA net = IBA − ASDI − Tiers prévisionnels**

### Tiers prévisionnels
- **Tiers prévisionnel = Bénéfice net N−1 / 3**
- Payables : **20 février** et **20 mai**

> **→ Simulateur IBA/IBA existe** (`iba.service.ts`). Vérifier :
> - Les abattements 40% (BA) et 30% (micro-finances/écoles)
> - Le calcul des tiers prévisionnels
> - Les dates d'échéance dans le calendrier (20 fév, 20 mai)

---

## 3. IS — Impôt sur les Sociétés

### Taux IS (RIT-6, slide 17)
| Type d'entreprise | Taux |
|-------------------|------|
| Écoles privées, Micro-finances | **25%** |
| Entreprises classiques (mines, carrières, immobilier) | **28%** |
| Personnes morales étrangères | **33%** |

### Calcul
```
IS = Résultat fiscal × Taux
Solde IS = IS − Acomptes IS − TSS
```

### Acomptes IS
```
Acompte IS = RF × 80% × Taux / 4
         ou = RF × 1/4 × 4/5 × Taux
```
- **1er exercice** : Acompte = Capital social × 5% × Taux / 4
- **4 acomptes** : 20 février, 20 mai, 20 août, 20 novembre
- Le 1er acompte se calcule sur le résultat N−2, régularisation sur le 2e acompte

> **→ Notre simulateur IS existe** (`is.service.ts`) + solde (`solde-liquidation.service.ts`).
> Vérifier :
> - Les 3 taux (25%, 28%, 33%) — actuellement on a peut-être seulement 28% et 33%
> - Le taux 25% pour écoles privées/micro-finances
> - Le calcul des acomptes sur RF × 80% × taux / 4
> - Le cas du 1er exercice (capital social × 5%)

---

## 4. TSS — Taxe Spéciale sur les Sociétés

### Caractéristiques
- **Base** : CA global HT + produits et profits divers (exercice N−1)
- **Taux** : **1%** (normal) / **2%** (si RF déficitaire 2 exercices consécutifs)
- **Minimum de perception** :
  - CA < 10M → minimum **500 000 FCFA**
  - CA ≤ 100M → minimum **1 000 000 FCFA**
  - CA > 100M → formule de calcul
- **Date** : **20 mars** sur CA N−1
- **Sanction** : TSS payée après le 20 mars est **doublée** (100% pénalités)
- TSS = 5e acompte IS ; déductible de l'IS sauf si taux 2% (après 2 exercices bénéficiaires)
- Si RF déficitaire → TSS comptabilisée en IMF (Impôt Minimum Forfaitaire)

> **→ SIMULATEUR TSS MANQUANT.** À créer :
> - Inputs : CA global N−1, produits divers, situation résultat (bénéficiaire/déficitaire depuis combien d'exercices)
> - Outputs : TSS à payer, minimum applicable, déductibilité IS

---

## 5. ASDI — Acompte sur Divers Impôts

### Caractéristiques
- **Taux** : **3%**
- **Base** : valeur douanière (importations) ou facture HT (achats locaux)
- **Personnes imposables** : personnes physiques IRPP/IBA + PM ne payant pas régulièrement TSS/acomptes IS
- **Exonérés** : PM assujetties IS+TSS, achats gaz/produits pétroliers
- Déductible de l'impôt sur le revenu ; report possible sur exercices suivants ; remboursement possible fin du 2e exercice

> **→ SIMULATEUR ASDI MANQUANT.** À créer :
> - Inputs : montant importation ou facture HT, type (import/achat local)
> - Outputs : ASDI à prélever, crédit d'impôt

---

## 6. Patente — Barème détaillé (RIT-6)

| Tranche CA HT (FCFA) | Taux |
|-----------------------|------|
| < 1 000 000 | 10 000 fixe |
| 1M – 20M | 0,750% |
| 20M – 40M | 0,650% |
| 40M – 100M | 0,450% |
| 100M – 300M | 0,200% |
| 300M – 500M | 0,150% |
| 500M – 1Md | 0,140% |
| 1Md – 20Mds | 0,135% |
| > 20Mds | 0,045% |

- **Note** : La tranche 300M–500M apparaît deux fois dans le RIT (0,150% puis 0,140%). Le barème CGI 2026 Art. 314 fait foi.
- Date limite : **20 avril** (→ 15 avril par Art. 461 bis LF 2026)

> **→ Notre simulateur Patente existe** (`patente.service.ts`). Vérifier la conformité du barème avec ces tranches.

---

## 7. Retenue à la source

- **Fournisseurs locaux** (non soumis IS) : **10%**
- **Fournisseurs étrangers** (sans domicile/résidence au Congo, pas de convention fiscale) : **20%**
- État trimestriel des versements à remettre aux services fiscaux
- Sanction : amende = prélèvement non effectué + majoration

> **→ Notre simulateur Retenue à la source existe** (`retenue-source.service.ts`). Vérifier les deux taux.

---

## 8. DAS — Déclaration Annuelle des Salaires

### DAS 1 (salariés)
- Identité, rémunérations, retenues IRPP, période, enfants à charge, indemnités non imposables, NIU
- Omission d'une mention : amende **10 000 FCFA**
- **Échéance : 15 février** (Art. 461 bis LF 2026)

### DAS 2 (prestataires)
- Loyers, commissions, courtages, ristournes, honoraires > 5 000 FCFA
- Sanction : **perte de déductibilité** des sommes versées

> **→ Pas de simulateur nécessaire** (déclaratif, pas de calcul). Intégrer dans le RAG.

---

## 9. Fiscalité de la paie (Paie_VF_fisca.pdf — slides 30-39)

### 4 composantes de la fiscalité de la paie
1. **IRPP** (Chap. 1, Livre 1 CGI)
2. **TUS** (Taxe Unique sur Salaires) — LF 2022
3. **TOL** (Taxe d'Occupation des Locaux)
4. **CAMU** (Contribution solidarité) — Art. 3-4 LF 2022

### TUS
- Résidents : **7,5%** (dont 6% fisc + 1,5% CNSS)
- Non-résidents : **6%** (protocole UNICONGO 22/12/2014)
- Sociétés pétrolières : **2,5%** (LF 2021)

### TOL
- Centre-ville : **5 000 FCFA/mois**
- Quartier périphérique : **1 000 FCFA/mois**

### CAMU
- **Base** : excédent du salaire brut taxable sur le seuil de **500 000 FCFA** (après déduction cotisations sociales)
- **Taux** : **0,5%**

### Taxe régionale
- Montant fixe : **2 400 FCFA**

### CNSS — Cotisations sociales
| Régime | Taux | Plafond mensuel | Part salariale | Part patronale |
|--------|------|-----------------|----------------|----------------|
| Assurance vieillesse | 12% | 1 200 000 FCFA | 4% | 8% |
| Allocations familiales | 10,03% | 600 000 FCFA | — | 10,03% |
| Allocations familiales (2) | 2,25% | 600 000 FCFA | — | 2,25% |
- Non-résidents : CNSS applicable à partir du **91e jour** de travail (effet rétroactif)

### IRPP salaires — Calcul
1. Revenu brut imposable = salaire net + avantages en argent/nature
2. − Retenue CNSS (4% plafonné à 1 200 000/mois = 14 400 000/an) — Art. 40 CGI
3. − Déduction 20% frais professionnels — Art. 41 CGI
4. = **Revenu net imposable**
5. ÷ Nombre de parts (quotient familial, Art. 91, max 6,5 parts)
6. × Barème progressif (Art. 95 : 1%, 10%, 25%, 40%)
7. × Nombre de parts = **IRPP total**

> **→ Notre simulateur Paie existe** (`paie.service.ts`). Vérifier :
> - TUS avec les 3 taux (7,5%, 6%, 2,5%)
> - TOL (centre-ville vs périphérie)
> - CAMU (seuil 500 000, taux 0,5%)
> - Taxe régionale (2 400 fixe)
> - CNSS : les 3 régimes avec plafonds corrects

---

## 10. Résumé — Actions à mener

### Simulateurs existants à vérifier/améliorer

| Simulateur | Fichier service | Points à vérifier |
|-----------|----------------|-------------------|
| **IGF** | `igf.service.ts` | 2 modes (marge libre 7% / réglementée 10%), 4 acomptes |
| **IBA/IBA** | `iba.service.ts` | Abattements 40% BA / 30% micro-finances, tiers prévisionnels |
| **IS** | `is.service.ts` | Taux 25% (écoles/MF), calcul acomptes 80%×taux/4, 1er exercice |
| **Solde IS** | `solde-liquidation.service.ts` | Intégrer TSS dans la déduction |
| **Patente** | `patente.service.ts` | Barème 9 tranches conforme |
| **Retenue source** | `retenue-source.service.ts` | 10% local / 20% étranger |
| **Paie** | `paie.service.ts` | TUS 3 taux, TOL, CAMU seuil 500K, CNSS 3 régimes |

### Nouveaux simulateurs à créer

| Simulateur | Priorité | Description |
|-----------|----------|-------------|
| **TSS** | Haute | CA×1% (ou 2%), minimums 500K/1M, déductibilité IS |
| **ASDI** | Moyenne | 3% sur imports/achats locaux, crédit d'impôt |
| **IBA complet** | Moyenne | RF + abattements + barème IBA + quotient familial + tiers prévisionnels |

### Éléments pour le RAG (pas de simulateur, mais à documenter)

- Régimes d'imposition (forfait / réel simplifié / réel normal) — critères et obligations
- DAS 1 et DAS 2 — contenu, sanctions
- Sanctions fiscales (défaut déclaration, retard, etc.)
- Crédit d'impôt (acompte IS excédentaire, ASDI reportable)
- IMF (Impôt Minimum Forfaitaire) — TSS en cas de RF déficitaire

---

## 11. Dates clés consolidées (calendrier fiscal)

| Échéance | Date | Remarque |
|----------|------|----------|
| Tiers prévisionnel IBA n°1 | 20 février | |
| TSS | 20 mars | Sur CA N−1, doublée si retard |
| IGF acompte 1 | 20 mars | |
| Patente | 15 avril (Art. 461 bis) | Anciennement 20 avril |
| Tiers prévisionnel IBA n°2 | 20 mai | |
| IGF acompte 2 | 20 juin | |
| IGF acompte 3 | 20 septembre | Anciennement 20 août dans le cours |
| Acomptes IS | 20 fév, 20 mai, 20 août, 20 nov | 4 acomptes trimestriels |
| IGF acompte 4 | 20 décembre | Anciennement 20 octobre dans le cours |

> **Note** : Les dates du cours (2014-2020) ne sont pas toutes à jour. Le CGI 2026 (Art. 461 bis) fixe le délai au **15 du mois**, sauf août (**20**). Les dates ci-dessus sont à croiser avec notre `calendrier-fiscal.ts`.
