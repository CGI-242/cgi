/**
 * Service IS Parapétrolier — Régime forfaitaire
 *
 * Sociétés parapétrolières (sous-traitants pétroliers étrangers ou
 * congolaises avec ≥70% CA pétrolier) : IS + IRCM calculés sur le CA.
 *
 * Base légale CGI Congo 2026 :
 * - Art. 92 à 92-K (anciens Art. 126 ter/quater/quinquies) — IS forfaitaire PM étrangères
 * - Art. 86-A — Taux IS 33% pour non-résidents
 * - Art. 92-A — Base forfaitaire = 22% du CA HT
 * - Art. 92-B §5 — Taux réduit 5,75% zone Angola
 * - Art. 92-J — Régime dérogatoire (sociétés congolaises ≥70% CA pétrolier)
 * - Art. 1, 4° Tome 2 Livre 3 — Distribution réputée = 70% du bénéfice forfaitaire
 * - Art. 3 Tome 2 Livre 3 — IRCM taux 15%
 * - Art. 9 ter Tome 2 Livre 3 — IRCM forfaitaire libératoire, payable mensuellement
 */

export interface IsParapetrolierInput {
  chiffreAffairesHT: number | null;
  montantMobDemob: number | null;
  montantRemboursements: number | null;
  isZoneAngola: boolean;
}

export interface IsParapetrolierResult {
  caHTBrut: number;
  exclusions: number;
  caHTNet: number;
  baseForfaitaire: number;
  tauxIS: number;
  isForfaitaire: number;
  distributionReputee: number;
  tauxIRCM: number;
  ircmForfaitaire: number;
  totalISPlusIRCM: number;
  tauxEffectifCA: number;
  mensualiteIS: number;
  mensualiteIRCM: number;
  mensualiteTotal: number;
  references: string[];
}

// Art. 92-A : base forfaitaire = 22% du CA HT
const TAUX_BASE_FORFAITAIRE = 0.22;

// Art. 86-A : taux IS = 33% pour PM non-résidentes
const TAUX_IS_ETRANGER = 0.33;

// Art. 92-B §5 : taux réduit zone Angola = 5,75%
const TAUX_ZONE_ANGOLA = 0.0575;

// Art. 1, 4° Tome 2 Livre 3 : distribution réputée = 70% du bénéfice forfaitaire
const TAUX_DISTRIBUTION = 0.70;

// Art. 3 Tome 2 Livre 3 : IRCM = 15%
const TAUX_IRCM = 0.15;

export function calculerIsParapetrolier(input: IsParapetrolierInput): IsParapetrolierResult {
  const caHTBrut = Math.max(0, input.chiffreAffairesHT || 0);
  const mobDemob = Math.max(0, input.montantMobDemob || 0);
  const remboursements = Math.max(0, input.montantRemboursements || 0);

  // 1. CA net = CA brut − mob/demob − remboursements
  const exclusions = mobDemob + remboursements;
  const caHTNet = Math.max(0, caHTBrut - exclusions);

  // 2. Base forfaitaire = 22% × CA net (Art. 92-A)
  const baseForfaitaire = caHTNet * TAUX_BASE_FORFAITAIRE;

  // 3. IS = base × taux (33% normal ou 5,75% Angola)
  const tauxIS = input.isZoneAngola ? TAUX_ZONE_ANGOLA : TAUX_IS_ETRANGER;
  const isForfaitaire = baseForfaitaire * tauxIS;

  // 4. Distribution réputée = 70% × base forfaitaire (Art. 1, 4° T2L3)
  const distributionReputee = baseForfaitaire * TAUX_DISTRIBUTION;

  // 5. IRCM = 15% × distribution réputée (Art. 3 T2L3)
  const ircmForfaitaire = distributionReputee * TAUX_IRCM;

  // 6. Total = IS + IRCM, mensualités = total / 12
  const totalISPlusIRCM = isForfaitaire + ircmForfaitaire;
  const mensualiteIS = isForfaitaire / 12;
  const mensualiteIRCM = ircmForfaitaire / 12;
  const mensualiteTotal = totalISPlusIRCM / 12;

  // 7. Taux effectif = total / CA net × 100
  const tauxEffectifCA = caHTNet > 0 ? (totalISPlusIRCM / caHTNet) * 100 : 0;

  const references = [
    "Art. 92 à 92-K CGI — IS forfaitaire PM étrangères",
    "Art. 86-A CGI — Taux IS 33%",
    "Art. 92-A CGI — Base forfaitaire 22% du CA HT",
    ...(input.isZoneAngola ? ["Art. 92-B §5 CGI — Taux réduit 5,75% zone Angola"] : []),
    "Art. 92-J CGI — Régime dérogatoire sociétés congolaises ≥70% CA pétrolier",
    "Art. 1, 4° T2L3 — Distribution réputée 70%",
    "Art. 3 T2L3 — IRCM 15%",
    "Art. 9 ter T2L3 — IRCM forfaitaire libératoire mensuel",
  ];

  return {
    caHTBrut: Math.round(caHTBrut),
    exclusions: Math.round(exclusions),
    caHTNet: Math.round(caHTNet),
    baseForfaitaire: Math.round(baseForfaitaire),
    tauxIS: tauxIS * 100,
    isForfaitaire: Math.round(isForfaitaire),
    distributionReputee: Math.round(distributionReputee),
    tauxIRCM: TAUX_IRCM * 100,
    ircmForfaitaire: Math.round(ircmForfaitaire),
    totalISPlusIRCM: Math.round(totalISPlusIRCM),
    tauxEffectifCA: Math.round(tauxEffectifCA * 100) / 100,
    mensualiteIS: Math.round(mensualiteIS),
    mensualiteIRCM: Math.round(mensualiteIRCM),
    mensualiteTotal: Math.round(mensualiteTotal),
    references,
  };
}
