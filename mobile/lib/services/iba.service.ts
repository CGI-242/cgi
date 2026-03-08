/**
 * Service IBA — Impôt sur les Bénéfices d'Affaires
 * Art. 93-102 CGI Congo 2026
 *
 * Régime réel (Art. 94-95) :
 *   RC = Produits − Charges
 *   RF = RC + Réintégrations − Déductions − Report déficitaire (max 3 ans, Art. 94)
 *   IBA brut = RF × 30% (Art. 95)
 *   Minimum de perception = 1,5% × (produits exploitation + financiers + HAO) (Art. 95)
 *   IBA retenu = max(IBA brut, minimum de perception)
 *   ASDI = 3% × achats/importations (Art. 1-9 TFNC4), déductible de l'IBA
 *   IBA net = IBA retenu − ASDI
 */

export interface IbaInput {
  // Résultat comptable
  produitsExploitation: number;
  produitsFinanciers: number;
  produitsHAO: number;
  charges: number;

  // Passage au résultat fiscal
  reintegrations: number;
  deductions: number;
  reportDeficitaire: number;

  // ASDI
  montantAchatsImportations: number;
}

export interface IbaResult {
  // Résultat comptable
  totalProduits: number;
  charges: number;
  resultatComptable: number;

  // Résultat fiscal
  reintegrations: number;
  deductions: number;
  reportDeficitaire: number;
  resultatFiscal: number;

  // IBA brut
  tauxIBA: number;
  ibaBrut: number;

  // Minimum de perception (Art. 95)
  baseMinimumPerception: number;
  tauxMinimum: number;
  minimumPerception: number;
  minimumApplique: boolean;

  // IBA retenu
  ibaRetenu: number;

  // ASDI (Art. 1-9 TFNC4)
  montantAchatsImportations: number;
  tauxASDI: number;
  asdi: number;

  // IBA net final
  ibaNet: number;
  beneficeNet: number;

  references: string[];
}

// Art. 95 — Taux IBA
const TAUX_IBA = 0.30;

// Art. 95 — Minimum de perception
const TAUX_MINIMUM_PERCEPTION = 0.015;

// Art. 4 TFNC4 — ASDI
const TAUX_ASDI = 0.03;

export function calculerIBA(input: IbaInput): IbaResult {
  const prodExpl = Math.max(0, input.produitsExploitation || 0);
  const prodFin = Math.max(0, input.produitsFinanciers || 0);
  const prodHAO = Math.max(0, input.produitsHAO || 0);
  const totalProduits = prodExpl + prodFin + prodHAO;
  const charges = Math.max(0, input.charges || 0);
  const reintegrations = Math.max(0, input.reintegrations || 0);
  const deductions = Math.max(0, input.deductions || 0);
  const reportDeficitaire = Math.max(0, input.reportDeficitaire || 0);
  const achats = Math.max(0, input.montantAchatsImportations || 0);

  // RC = Produits − Charges
  const resultatComptable = totalProduits - charges;

  // RF = RC + Réintégrations − Déductions − Report déficitaire (Art. 94 : max 3 ans)
  const resultatFiscal = Math.max(0, resultatComptable + reintegrations - deductions - reportDeficitaire);

  // IBA brut = RF × 30% (Art. 95)
  const ibaBrut = Math.round(resultatFiscal * TAUX_IBA);

  // Minimum de perception = 1,5% × total produits (Art. 95)
  const baseMinimumPerception = totalProduits;
  const minimumPerception = Math.round(baseMinimumPerception * TAUX_MINIMUM_PERCEPTION);
  const minimumApplique = minimumPerception > ibaBrut;
  const ibaRetenu = Math.max(ibaBrut, minimumPerception);

  // ASDI = 3% × achats/importations (Art. 1-9 TFNC4)
  const asdi = Math.round(achats * TAUX_ASDI);

  // IBA net = IBA retenu − ASDI (plancher 0)
  const ibaNet = Math.max(0, ibaRetenu - asdi);

  const beneficeNet = resultatFiscal - ibaNet;

  const references: string[] = [
    "Art. 93 — Principe IBA",
    "Art. 94 — Détermination du bénéfice (règles Art. 6+), report déficitaire max 3 ans",
    "Art. 95 — Taux 30%, minimum de perception 1,5%",
    "Art. 1-9 TFNC4 — ASDI 3% sur achats/importations",
  ];

  return {
    totalProduits,
    charges,
    resultatComptable,
    reintegrations,
    deductions,
    reportDeficitaire,
    resultatFiscal,
    tauxIBA: TAUX_IBA * 100,
    ibaBrut,
    baseMinimumPerception,
    tauxMinimum: TAUX_MINIMUM_PERCEPTION * 100,
    minimumPerception,
    minimumApplique,
    ibaRetenu,
    montantAchatsImportations: achats,
    tauxASDI: TAUX_ASDI * 100,
    asdi,
    ibaNet,
    beneficeNet,
    references,
  };
}
