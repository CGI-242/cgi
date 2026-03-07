/**
 * Service TVA — Taxe sur la Valeur Ajoutée
 * TFNC6 Art. 1-40 CGI Congo 2026
 * Format déclaration type français (CA3)
 */

export type TypeOperation = "taxable" | "exoneree" | "export";

export interface TvaInput {
  // Section A — Opérations réalisées
  ventesServicesHT: number;     // Ligne 01 : Ventes et prestations de services
  autresOpTaxables: number;     // Ligne 02 : Autres opérations taxables
  exportationsHT: number;       // Ligne 03 : Exportations (taux 0%)
  operationsExonerees: number;  // Ligne 04 : Opérations exonérées
  // Section C — TVA déductible
  achatsImmobilisations: number; // Ligne 09 : TVA sur immobilisations
  achatsBiensServices: number;   // Ligne 10 : TVA sur autres biens et services
  // Report
  creditAnterior: number;        // Ligne 14 : Crédit de TVA reporté du mois précédent
}

export interface TvaLigneDeclaration {
  numero: string;
  libelle: string;
  baseHT?: number;
  tva?: number;
}

export interface TvaResult {
  // Section A — Chiffre d'affaires
  lignesCA: TvaLigneDeclaration[];
  totalCAHT: number;

  // Section B — TVA brute
  lignesTvaBrute: TvaLigneDeclaration[];
  totalTvaBrute: number;

  // Section C — TVA déductible
  lignesTvaDeductible: TvaLigneDeclaration[];
  totalTvaDeductible: number;

  // Section D — TVA nette
  creditAnterior: number;
  tvaNette: number;
  tvaAPayer: number;
  creditTva: number;

  // Section E — Centimes additionnels (Art. 38-A TFNC6)
  centimesAdditionnels: number;
  // Total général
  totalAPayer: number;

  taux: number;
}

const TAUX_TVA = 0.18;
const TAUX_CENTIMES = 0.05; // 5% de la TVA collectée (Art. 38-A TFNC6)

export function calculerTVA(input: TvaInput): TvaResult {
  const ventes = Math.max(0, input.ventesServicesHT || 0);
  const autresOp = Math.max(0, input.autresOpTaxables || 0);
  const exports = Math.max(0, input.exportationsHT || 0);
  const exonerees = Math.max(0, input.operationsExonerees || 0);
  const achatsImmo = Math.max(0, input.achatsImmobilisations || 0);
  const achatsBnS = Math.max(0, input.achatsBiensServices || 0);
  const creditAnt = Math.max(0, input.creditAnterior || 0);

  // --- Section A : Chiffre d'affaires ---
  const lignesCA: TvaLigneDeclaration[] = [
    { numero: "01", libelle: "Ventes et prestations de services", baseHT: ventes },
    { numero: "02", libelle: "Autres opérations taxables", baseHT: autresOp },
    { numero: "03", libelle: "Exportations (taux 0%)", baseHT: exports },
    { numero: "04", libelle: "Opérations exonérées", baseHT: exonerees },
  ];
  const totalCAHT = ventes + autresOp + exports + exonerees;

  // --- Section B : TVA brute (collectée) ---
  const tvaVentes = Math.round(ventes * TAUX_TVA);
  const tvaAutres = Math.round(autresOp * TAUX_TVA);

  const lignesTvaBrute: TvaLigneDeclaration[] = [
    { numero: "05", libelle: "TVA sur ventes/prestations (18%)", baseHT: ventes, tva: tvaVentes },
    { numero: "06", libelle: "TVA sur autres opérations (18%)", baseHT: autresOp, tva: tvaAutres },
    { numero: "07", libelle: "TVA sur exportations (0%)", baseHT: exports, tva: 0 },
  ];
  const totalTvaBrute = tvaVentes + tvaAutres;

  // --- Section C : TVA déductible ---
  const lignesTvaDeductible: TvaLigneDeclaration[] = [
    { numero: "09", libelle: "TVA sur immobilisations", tva: achatsImmo },
    { numero: "10", libelle: "TVA sur autres biens et services", tva: achatsBnS },
  ];
  const totalTvaDeductible = achatsImmo + achatsBnS;

  // --- Section D : TVA nette ---
  const tvaNette = totalTvaBrute - totalTvaDeductible - creditAnt;
  const tvaAPayer = Math.max(0, tvaNette);
  const creditTva = Math.max(0, -tvaNette);

  // --- Section E : Centimes additionnels (Art. 38-A TFNC6) ---
  // Base = TVA collectée (brute), taux 5%, ne donnent pas droit à déduction
  const centimesAdditionnels = Math.round(totalTvaBrute * TAUX_CENTIMES);

  // Total général = TVA nette à payer + centimes additionnels
  const totalAPayer = tvaAPayer + centimesAdditionnels;

  return {
    lignesCA,
    totalCAHT,
    lignesTvaBrute,
    totalTvaBrute,
    lignesTvaDeductible,
    totalTvaDeductible,
    creditAnterior: creditAnt,
    tvaNette,
    tvaAPayer,
    creditTva,
    centimesAdditionnels,
    totalAPayer,
    taux: TAUX_TVA * 100,
  };
}
