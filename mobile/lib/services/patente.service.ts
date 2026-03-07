/**
 * Service Patente - Contribution des Patentes
 * Article 314 CGI Congo 2026
 */

export interface PatenteInput {
  chiffreAffaires: number | null;
  regime: "reel" | "forfait" | "tpe" | "pe";
  isEntrepriseNouvelle: boolean;
  isStandBy: boolean;
  dernierePatente: number | null;
  nombreEntitesFiscales: number;
}

export interface PatenteTrancheDetail {
  tranche: string;
  base: number;
  taux: number;
  montant: number;
}

export interface PatenteResult {
  chiffreAffaires: number;
  regime: string;
  tranches: PatenteTrancheDetail[];
  patenteBrute: number;
  reductionStandBy: number;
  patenteApresReduction: number;
  reduction50Pourcent: number;
  patenteNette: number;
  patenteParEntite: number;
  nombreEntites: number;
  dateEcheance: string;
  references: string[];
}

const BAREME_PATENTE = [
  { min: 0, max: 1_000_000, taux: 0 },
  { min: 1_000_001, max: 20_000_000, taux: 0.0075 },
  { min: 20_000_001, max: 40_000_000, taux: 0.0065 },
  { min: 40_000_001, max: 100_000_000, taux: 0.0045 },
  { min: 100_000_001, max: 300_000_000, taux: 0.002 },
  { min: 300_000_001, max: 500_000_000, taux: 0.0015 },
  { min: 500_000_001, max: 1_000_000_000, taux: 0.0014 },
  { min: 1_000_000_001, max: 3_000_000_000, taux: 0.00135 },
  { min: 3_000_000_001, max: 20_000_000_000, taux: 0.00125 },
  { min: 20_000_000_001, max: Infinity, taux: 0.00045 },
];

function formatTranche(min: number, max: number): string {
  if (max === Infinity) {
    return `> ${formatShort(min)}`;
  }
  return `${formatShort(min + 1)} - ${formatShort(max)}`;
}

function formatShort(montant: number): string {
  if (montant >= 1_000_000_000) {
    return `${(montant / 1_000_000_000).toFixed(0)} Mds`;
  }
  if (montant >= 1_000_000) {
    return `${(montant / 1_000_000).toFixed(0)} M`;
  }
  return montant.toLocaleString("fr-FR");
}

function getRegimeLabel(regime: string): string {
  const labels: Record<string, string> = {
    reel: "Regime du reel",
    forfait: "Regime forfaitaire",
    tpe: "Tres petites entreprises",
    pe: "Petites entreprises",
  };
  return labels[regime] || regime;
}

export function calculerPatente(input: PatenteInput): PatenteResult | null {
  const ca = Math.max(0, input.chiffreAffaires || 0);

  if (ca <= 0 && !input.isStandBy) {
    return null;
  }

  if (input.isStandBy && input.dernierePatente) {
    const montantStandBy = input.dernierePatente * 0.25;
    return {
      chiffreAffaires: 0,
      regime: getRegimeLabel(input.regime),
      tranches: [],
      patenteBrute: input.dernierePatente,
      reductionStandBy: input.dernierePatente - montantStandBy,
      patenteApresReduction: montantStandBy,
      reduction50Pourcent: montantStandBy * 0.5,
      patenteNette: Math.round((montantStandBy * 0.5) / 10) * 10,
      patenteParEntite: Math.round((montantStandBy * 0.5) / 10) * 10,
      nombreEntites: 1,
      dateEcheance: "10-20 avril",
      references: [
        "Art. 278 al. 6 : Stand-by = 25% derniere patente",
        "Art. 314 : Reduction de 50% du montant liquide",
      ],
    };
  }

  const tranches: PatenteTrancheDetail[] = [];
  let patenteBrute = 0;
  let caRestant = ca;

  // Forfait 10.000 FCFA pour CA < 1.000.000 (Art. 314)
  if (ca < 1_000_000) {
    patenteBrute = 10_000;
    tranches.push({
      tranche: `< 1 M`,
      base: ca,
      taux: 0,
      montant: 10_000,
    });
  } else {
    for (const bareme of BAREME_PATENTE) {
      if (caRestant <= 0) break;

      const largeurTranche = bareme.max === Infinity ? caRestant : (bareme.max - bareme.min);
      const baseImposable = Math.min(caRestant, largeurTranche);
      const montantTranche = baseImposable * bareme.taux;

      if (montantTranche > 0) {
        tranches.push({
          tranche: formatTranche(bareme.min, bareme.max),
          base: baseImposable,
          taux: bareme.taux * 100,
          montant: montantTranche,
        });
      }

      patenteBrute += montantTranche;
      caRestant -= baseImposable;
    }
  }

  const reduction50 = patenteBrute * 0.5;
  const patenteNette = patenteBrute - reduction50;
  const patenteArrondie = Math.round(patenteNette / 10) * 10;

  const nombreEntites = Math.max(1, input.nombreEntitesFiscales || 1);
  const patenteParEntite = Math.round(patenteArrondie / nombreEntites / 10) * 10;

  return {
    chiffreAffaires: ca,
    regime: getRegimeLabel(input.regime),
    tranches,
    patenteBrute,
    reductionStandBy: 0,
    patenteApresReduction: patenteBrute,
    reduction50Pourcent: reduction50,
    patenteNette: patenteArrondie,
    patenteParEntite,
    nombreEntites,
    dateEcheance: patenteArrondie > 100_000 ? "2 fractions (Q2)" : "10-20 avril",
    references: [
      "Art. 277 : Droit de patente",
      "Art. 278 : Assiette de la patente",
      "Art. 314 : Tarifs (L.F.2023) - Reduction 50%",
      "Art. 307 : Paiement",
    ],
  };
}
