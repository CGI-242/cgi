/**
 * Service Patente - Contribution des Patentes
 * Art. 314 CGI Congo 2026 (barème)
 * Art. 369 bis (centimes additionnels 5%)
 */

export interface PatenteInput {
  chiffreAffaires: number | null;
  regime: "reel" | "forfait" | "tpe" | "pe";
  isEntrepriseNouvelle: boolean;
  isStandBy: boolean;
  isPetroliere: boolean;
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
  // Réduction 50% uniquement pour les sociétés pétrolières (Art. 314)
  isPetroliere: boolean;
  reductionPetroliere: number;
  patenteNette: number;
  // Centimes additionnels (Art. 369 bis)
  centimesAdditionnels: number;
  partChambresCommerce: number;
  partCollectivitesLocales: number;
  // Total
  totalAPayer: number;
  totalParEntite: number;
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

const TAUX_CENTIMES = 0.05; // 5% (Art. 369 bis)
const PART_CHAMBRES_COMMERCE = 0.20; // 20%
const PART_COLLECTIVITES = 0.80; // 80%

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

function arrondir(montant: number): number {
  return Math.round(montant / 10) * 10;
}

export function calculerPatente(input: PatenteInput): PatenteResult | null {
  const ca = Math.max(0, input.chiffreAffaires || 0);

  if (ca <= 0 && !input.isStandBy) {
    return null;
  }

  // Cas stand-by (Art. 278 al. 6)
  if (input.isStandBy && input.dernierePatente) {
    const montantStandBy = input.dernierePatente * 0.25;
    const patenteApresStandBy = montantStandBy;

    // Réduction 50% uniquement si pétrolière
    const reductionPetroliere = input.isPetroliere ? patenteApresStandBy * 0.5 : 0;
    const patenteNette = arrondir(patenteApresStandBy - reductionPetroliere);

    // Centimes additionnels
    const centimes = arrondir(patenteNette * TAUX_CENTIMES);
    const totalAPayer = patenteNette + centimes;

    return {
      chiffreAffaires: 0,
      regime: getRegimeLabel(input.regime),
      tranches: [],
      patenteBrute: input.dernierePatente,
      reductionStandBy: input.dernierePatente - montantStandBy,
      patenteApresReduction: patenteApresStandBy,
      isPetroliere: input.isPetroliere,
      reductionPetroliere,
      patenteNette,
      centimesAdditionnels: centimes,
      partChambresCommerce: arrondir(centimes * PART_CHAMBRES_COMMERCE),
      partCollectivitesLocales: arrondir(centimes * PART_COLLECTIVITES),
      totalAPayer,
      totalParEntite: totalAPayer,
      nombreEntites: 1,
      dateEcheance: "10-20 avril",
      references: [
        "Art. 278 al. 6 : Stand-by = 25% dernière patente",
        ...(input.isPetroliere ? ["Art. 314 : Réduction 50% sociétés pétrolières"] : []),
        "Art. 369 bis : Centimes additionnels 5%",
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

  // Réduction 50% uniquement pour les sociétés pétrolières (Art. 314)
  const reductionPetroliere = input.isPetroliere ? patenteBrute * 0.5 : 0;
  const patenteNette = arrondir(patenteBrute - reductionPetroliere);

  // Centimes additionnels 5% (Art. 369 bis)
  const centimes = arrondir(patenteNette * TAUX_CENTIMES);
  const partCC = arrondir(centimes * PART_CHAMBRES_COMMERCE);
  const partCL = arrondir(centimes * PART_COLLECTIVITES);

  const totalAPayer = patenteNette + centimes;

  const nombreEntites = Math.max(1, input.nombreEntitesFiscales || 1);
  const totalParEntite = arrondir(totalAPayer / nombreEntites);

  return {
    chiffreAffaires: ca,
    regime: getRegimeLabel(input.regime),
    tranches,
    patenteBrute,
    reductionStandBy: 0,
    patenteApresReduction: patenteBrute,
    isPetroliere: input.isPetroliere,
    reductionPetroliere,
    patenteNette,
    centimesAdditionnels: centimes,
    partChambresCommerce: partCC,
    partCollectivitesLocales: partCL,
    totalAPayer,
    totalParEntite,
    nombreEntites,
    dateEcheance: totalAPayer > 100_000 ? "2 fractions (Q2)" : "10-20 avril",
    references: [
      "Art. 277 : Droit de patente",
      "Art. 278 : Assiette de la patente",
      "Art. 314 : Tarifs (L.F.2023)",
      ...(input.isPetroliere ? ["Art. 314 : Réduction 50% sociétés pétrolières"] : []),
      "Art. 369 bis : Centimes additionnels 5%",
    ],
  };
}
