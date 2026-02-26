/**
 * Service commun pour les calculs fiscaux
 * Centralise les methodes et constantes partagees entre IRPP, ITS et IS
 * CGI Congo-Brazzaville 2026
 */

export type SituationFamiliale = "celibataire" | "marie" | "divorce" | "veuf";
export type PeriodeRevenu = "mensuel" | "annuel";

export interface CnssResult {
  baseMensuelle: number;
  baseAnnuelle: number;
  retenueMensuelle: number;
  retenueAnnuelle: number;
  plafondApplique: boolean;
}

export interface FraisProResult {
  baseApresCnss: number;
  fraisProfessionnels: number;
  revenuNetImposable: number;
}

export interface BaremeTranche {
  min: number;
  max: number | null;
  taux: number;
}

export interface BaremeItsTranche extends BaremeTranche {
  forfait?: number;
}

// Configuration fiscale 2026
export const FISCAL_PARAMS = {
  cnss: {
    taux: 0.04,
    plafondMensuel: 1_200_000,
  },
  fraisPro: {
    taux: 0.20,
  },
  quotientFamilial: {
    maxParts: 6.5,
  },
  smig: {
    mensuel: 70_400,
    annuel: 70_400 * 12,
  },
  irpp: {
    baremes: [
      { min: 0, max: 464_000, taux: 0.01 },
      { min: 464_000, max: 1_000_000, taux: 0.10 },
      { min: 1_000_000, max: 3_000_000, taux: 0.25 },
      { min: 3_000_000, max: null, taux: 0.40 },
    ] as BaremeTranche[],
  },
  its: {
    baremes: [
      { min: 0, max: 615_000, taux: 0, forfait: 1_200 },
      { min: 615_000, max: 1_500_000, taux: 0.10 },
      { min: 1_500_000, max: 3_500_000, taux: 0.15 },
      { min: 3_500_000, max: 5_000_000, taux: 0.20 },
      { min: 5_000_000, max: null, taux: 0.30 },
    ] as BaremeItsTranche[],
    minimumAnnuel: 1_200,
  },
  is: {
    tauxGeneral: 0.25,
    tauxEtranger: 0.33,
    tauxMinimumNormal: 0.01,
    tauxMinimumDeficit: 0.02,
  },
};

export function calculateCNSS(revenuBrutMensuel: number): CnssResult {
  const { taux, plafondMensuel } = FISCAL_PARAMS.cnss;
  const baseMensuelle = Math.min(revenuBrutMensuel, plafondMensuel);
  const retenueMensuelle = baseMensuelle * taux;
  const plafondApplique = revenuBrutMensuel > plafondMensuel;

  return {
    baseMensuelle,
    baseAnnuelle: baseMensuelle * 12,
    retenueMensuelle,
    retenueAnnuelle: retenueMensuelle * 12,
    plafondApplique,
  };
}

export function calculateFraisPro(revenuBrutAnnuel: number, retenueCnssAnnuelle: number): FraisProResult {
  const baseApresCnss = revenuBrutAnnuel - retenueCnssAnnuelle;
  const fraisProfessionnels = baseApresCnss * FISCAL_PARAMS.fraisPro.taux;
  const revenuNetImposable = baseApresCnss - fraisProfessionnels;

  return { baseApresCnss, fraisProfessionnels, revenuNetImposable };
}

export function calculateQuotient(
  situation: SituationFamiliale,
  nombreEnfants: number | null,
  appliquerCharge = true
): number {
  if (!appliquerCharge) return 1;

  const enfants = Math.max(0, nombreEnfants || 0);

  let partsBase: number;
  if (situation === "marie") {
    partsBase = 2;
  } else if (situation === "veuf" && enfants > 0) {
    partsBase = 2;
  } else {
    partsBase = 1;
  }

  let partsEnfants: number;
  if (situation === "celibataire" || situation === "divorce") {
    if (enfants === 0) {
      partsEnfants = 0;
    } else {
      partsEnfants = 1 + (enfants - 1) * 0.5;
    }
  } else {
    partsEnfants = enfants * 0.5;
  }

  const totalParts = partsBase + partsEnfants;
  return Math.min(totalParts, FISCAL_PARAMS.quotientFamilial.maxParts);
}

export function applyBaremeIts(
  revenuParPart: number,
  baremes: BaremeItsTranche[]
): { impotTotal: number; details: { tranche: string; tauxAffiche: string; taux: number; base: number; impot: number }[] } {
  const details: { tranche: string; tauxAffiche: string; taux: number; base: number; impot: number }[] = [];
  let impotTotal = 0;
  let revenuRestant = revenuParPart;

  for (const tranche of baremes) {
    if (revenuRestant <= 0) break;

    const limiteHaute = tranche.max ?? Infinity;
    const largeurTranche = limiteHaute - tranche.min;
    const baseImposable = Math.min(revenuRestant, largeurTranche);

    let impot: number;
    let tauxAffiche: string;

    if (tranche.forfait !== undefined) {
      impot = tranche.forfait;
      tauxAffiche = `${formatMontant(tranche.forfait)} (forfait)`;
    } else {
      impot = baseImposable * tranche.taux;
      tauxAffiche = `${tranche.taux * 100}%`;
    }

    details.push({
      tranche: tranche.max
        ? `${formatMontant(tranche.min)} - ${formatMontant(tranche.max)}`
        : `> ${formatMontant(tranche.min)}`,
      tauxAffiche,
      taux: tranche.taux * 100,
      base: baseImposable,
      impot,
    });

    impotTotal += impot;
    revenuRestant -= baseImposable;
  }

  return { impotTotal, details };
}

export function applyBareme(
  revenuParPart: number,
  baremes: BaremeTranche[]
): { impotTotal: number; details: { tranche: string; taux: number; base: number; impot: number }[] } {
  const details: { tranche: string; taux: number; base: number; impot: number }[] = [];
  let impotTotal = 0;
  let revenuRestant = revenuParPart;

  for (const tranche of baremes) {
    if (revenuRestant <= 0) break;

    const limiteHaute = tranche.max ?? Infinity;
    const largeurTranche = limiteHaute - tranche.min;
    const baseImposable = Math.min(revenuRestant, largeurTranche);
    const impot = baseImposable * tranche.taux;

    details.push({
      tranche: tranche.max
        ? `${formatMontant(tranche.min)} - ${formatMontant(tranche.max)}`
        : `> ${formatMontant(tranche.min)}`,
      taux: tranche.taux * 100,
      base: baseImposable,
      impot,
    });

    impotTotal += impot;
    revenuRestant -= baseImposable;
  }

  return { impotTotal, details };
}

export function annualizeRevenu(montant: number, periode: PeriodeRevenu): { annuel: number; mensuel: number } {
  const annuel = periode === "mensuel" ? montant * 12 : montant;
  const mensuel = annuel / 12;
  return { annuel, mensuel };
}

export function isUnderSmig(revenuBrutAnnuel: number): boolean {
  return revenuBrutAnnuel < FISCAL_PARAMS.smig.annuel;
}

export function calculateTauxEffectif(impot: number, revenuNetImposable: number): number {
  return revenuNetImposable > 0 ? (impot / revenuNetImposable) * 100 : 0;
}

export function formatMontant(montant: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(montant)) + " FCFA";
}

export function formatNumber(montant: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(montant));
}

/**
 * Formate une saisie numerique avec separateurs de milliers (espaces).
 * Utilise dans les TextInput pour afficher ex: "1 050 000" pendant la saisie.
 */
export function formatInputNumber(text: string): string {
  const digits = text.replace(/[^\d]/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
