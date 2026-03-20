import type { ArticleData, SommaireNode } from "./types";
import { parseArticles, buildChapitreTree } from "./helpers";

// TFNC2 - Incitations fiscales
import charteInvestData from "@/data/charte-investissements.json";
import decretAgrementData from "@/data/decret-agrement-investissements.json";
import zesData from "@/data/zones-economiques-speciales.json";
import zonesFranchesSanteData from "@/data/zones-franches-sante.json";
import zoneValoInfraData from "@/data/zone-valorisation-infrastructures.json";
import entrepreneuriatData from "@/data/encouragement-entrepreneuriat.json";
import operationsBvmacData from "@/data/operations-bvmac.json";
// TFNC3 - Fiscalité mines et hydrocarbures
import codeHydroData from "@/data/code-hydrocarbures-fiscal.json";
import redevSuperfData from "@/data/redevance-superficiaire.json";
import tfnc3PetCh1Data from "@/data/tfnc3-petrole-chapitre1.json";
import tfnc3PetCh2Data from "@/data/tfnc3-petrole-chapitre2.json";
import tfnc3PetCh3Data from "@/data/tfnc3-petrole-chapitre3.json";
import tfnc3PetCh4Data from "@/data/tfnc3-petrole-chapitre4.json";
import tfnc3PetCh5Data from "@/data/tfnc3-petrole-chapitre5.json";
import tvaPetrolierData from "@/data/tva-secteur-petrolier-amont.json";
import fiscMiniereData from "@/data/fiscalite-miniere.json";
// TFNC4 - Impôts, taxes et retenues divers
import tfnc4AsdiData from "@/data/tfnc4-1-asdi.json";
import tfnc4CamuData from "@/data/tfnc4-2-camu.json";
import tfnc4AccisesData from "@/data/tfnc4-3-droits-accises.json";
import tfnc4BoissonsData from "@/data/tfnc4-3-taxe-boissons-tabac.json";
import droitsFonciersData from "@/data/droits-fonciers-exceptionnels.json";
import impotPylonesData from "@/data/impot-pylones-telecom.json";
import impotGlobalForfData from "@/data/impot-global-forfaitaire.json";
import redevAudioData from "@/data/redevance-audiovisuelle-electrification.json";
import retenueTresorData from "@/data/retenue-source-tresor-public.json";
import taxeAbonnTvData from "@/data/taxe-abonnement-televisuelle.json";
import taxeOccupLocauxData from "@/data/taxe-occupation-locaux.json";
import taxeTraficComData from "@/data/taxe-trafic-communications-electroniques.json";
import taxeBilletsAvionData from "@/data/taxe-billets-avion-internationaux.json";
import taxeJeuxData from "@/data/taxe-jeux-hasard.json";
import taxeTransfertsData from "@/data/taxe-transferts-fonds.json";
import taxeUniqueSalData from "@/data/taxe-unique-salaires.json";
import taxeEmballagesData from "@/data/taxe-emballages-non-recuperables.json";
import taxeRtnData from "@/data/taxe-terminaux-numeriques-sim.json";
import redevCarboneData from "@/data/redevance-credits-carbone.json";
import taxePolluantesData from "@/data/taxe-activites-polluantes.json";
// TFNC5 - Administrations fiscales et procédures
import niuDecretData from "@/data/tfnc5-2-niu-decret.json";
import niuArrete5327Data from "@/data/tfnc5-2-niu-arrete-5327.json";
import niuArrete25604Data from "@/data/tfnc5-2-niu-arrete-25604.json";
import recouvRecettesData from "@/data/recouvrement-recettes-publiques.json";
import approcheRisquesData from "@/data/approche-risques-controles-fiscaux.json";
import echangeRenseignData from "@/data/echange-renseignements-fiscaux.json";
import attestNonRedevData from "@/data/attestation-non-redevance-fiscale.json";
// TFNC6 - TVA
import tfnc6TvaCh1Data from "@/data/tfnc6-tva-chapitre1.json";
import tfnc6TvaCh2Data from "@/data/tfnc6-tva-chapitre2.json";
import tfnc6TvaCh3Data from "@/data/tfnc6-tva-chapitre3.json";
import tfnc6TvaCh4Data from "@/data/tfnc6-tva-chapitre4.json";
import tfnc6TvaCh5Data from "@/data/tfnc6-tva-chapitre5.json";
import tfnc6TvaAnnexesData from "@/data/tfnc6-tva-annexes.json";

// TFNC2
const aCharteInvest = parseArticles(charteInvestData.articles);
const aDecretAgrement = parseArticles(decretAgrementData.articles);
const aZes = parseArticles(zesData.articles);
const aZonesFranchesSante = parseArticles(zonesFranchesSanteData.articles);
const aZoneValoInfra = parseArticles(zoneValoInfraData.articles);
const aEntrepreneuriat = parseArticles(entrepreneuriatData.articles);
const aOperationsBvmac = parseArticles(operationsBvmacData.articles);
// TFNC3
const aCodeHydro = parseArticles(codeHydroData.articles);
const aRedevSuperf = parseArticles(redevSuperfData.articles);
const aTfnc3PetCh1 = parseArticles(tfnc3PetCh1Data.articles);
const aTfnc3PetCh2 = parseArticles(tfnc3PetCh2Data.articles);
const aTfnc3PetCh3 = parseArticles(tfnc3PetCh3Data.articles);
const aTfnc3PetCh4 = parseArticles(tfnc3PetCh4Data.articles);
const aTfnc3PetCh5 = parseArticles(tfnc3PetCh5Data.articles);
const aTvaPetrolier = parseArticles(tvaPetrolierData.articles);
const aFiscMiniere = parseArticles(fiscMiniereData.articles);
// TFNC4
const aTfnc4Asdi = parseArticles(tfnc4AsdiData.articles);
const aTfnc4Camu = parseArticles(tfnc4CamuData.articles);
const aTfnc4Accises = parseArticles(tfnc4AccisesData.articles);
const aTfnc4Boissons = parseArticles(tfnc4BoissonsData.articles);
const aDroitsFonciers = parseArticles(droitsFonciersData.articles);
const aImpotPylones = parseArticles(impotPylonesData.articles);
const aImpotGlobalForf = parseArticles(impotGlobalForfData.articles);
const aRedevAudio = parseArticles(redevAudioData.articles);
const aRetenueTresor = parseArticles(retenueTresorData.articles);
const aTaxeAbonnTv = parseArticles(taxeAbonnTvData.articles);
const aTaxeOccupLocaux = parseArticles(taxeOccupLocauxData.articles);
const aTaxeTraficCom = parseArticles(taxeTraficComData.articles);
const aTaxeBilletsAvion = parseArticles(taxeBilletsAvionData.articles);
const aTaxeJeux = parseArticles(taxeJeuxData.articles);
const aTaxeTransferts = parseArticles(taxeTransfertsData.articles);
const aTaxeUniqueSal = parseArticles(taxeUniqueSalData.articles);
const aTaxeEmballages = parseArticles(taxeEmballagesData.articles);
const aTaxeRtn = parseArticles(taxeRtnData.articles);
const aRedevCarbone = parseArticles(redevCarboneData.articles);
const aTaxePolluantes = parseArticles(taxePolluantesData.articles);
// TFNC5
const aNiuDecret = parseArticles(niuDecretData.articles);
const aNiuArrete5327 = parseArticles(niuArrete5327Data.articles);
const aNiuArrete25604 = parseArticles(niuArrete25604Data.articles);
const aRecouvRecettes = parseArticles(recouvRecettesData.articles);
const aApprocheRisques = parseArticles(approcheRisquesData.articles);
const aEchangeRenseign = parseArticles(echangeRenseignData.articles);
const aAttestNonRedev = parseArticles(attestNonRedevData.articles);
// TFNC6
const aTfnc6Ch1 = parseArticles(tfnc6TvaCh1Data.articles);
const aTfnc6Ch2 = parseArticles(tfnc6TvaCh2Data.articles);
const aTfnc6Ch3 = parseArticles(tfnc6TvaCh3Data.articles);
const aTfnc6Ch4 = parseArticles(tfnc6TvaCh4Data.articles);
const aTfnc6Ch5 = parseArticles(tfnc6TvaCh5Data.articles);
const aTfnc6Annexes = parseArticles(tfnc6TvaAnnexesData.articles);

// TFNC2 - Incitations fiscales
export const tfnc2Node: SommaireNode = {
  id: "tfnc2", label: "2. Textes relatifs aux investissements",
  children: [
    { id: "tfnc2-charte", label: charteInvestData.meta.chapitre_titre, articles: aCharteInvest },
    { id: "tfnc2-agrement", label: decretAgrementData.meta.chapitre_titre, articles: aDecretAgrement },
    { id: "tfnc2-zes", label: zesData.meta.chapitre_titre, articles: aZes },
    { id: "tfnc2-sante", label: zonesFranchesSanteData.meta.chapitre_titre, articles: aZonesFranchesSante },
    { id: "tfnc2-infra", label: zoneValoInfraData.meta.chapitre_titre, articles: aZoneValoInfra },
    { id: "tfnc2-entrepreneuriat", label: entrepreneuriatData.meta.chapitre_titre, articles: aEntrepreneuriat },
    { id: "tfnc2-bvmac", label: operationsBvmacData.meta.chapitre_titre, articles: aOperationsBvmac },
  ],
};

// TFNC3 - Fiscalité mines et hydrocarbures
const tfnc3PetCh1 = buildChapitreTree(aTfnc3PetCh1, `Chapitre 1 - ${tfnc3PetCh1Data.meta.chapitre_titre}`, "tfnc3-pet-ch1");
const tfnc3PetCh2 = buildChapitreTree(aTfnc3PetCh2, `Chapitre 2 - ${tfnc3PetCh2Data.meta.chapitre_titre}`, "tfnc3-pet-ch2");
const tfnc3PetCh3 = buildChapitreTree(aTfnc3PetCh3, `Chapitre 3 - ${tfnc3PetCh3Data.meta.chapitre_titre}`, "tfnc3-pet-ch3");
const tfnc3PetCh4 = buildChapitreTree(aTfnc3PetCh4, `Chapitre 4 - ${tfnc3PetCh4Data.meta.chapitre_titre}`, "tfnc3-pet-ch4");
const tfnc3PetCh5 = buildChapitreTree(aTfnc3PetCh5, `Chapitre 5 - ${tfnc3PetCh5Data.meta.chapitre_titre}`, "tfnc3-pet-ch5");
export const tfnc3Node: SommaireNode = {
  id: "tfnc3", label: "3. Fiscalité des mines et des hydrocarbures",
  children: [
    { id: "tfnc3-hydro", label: codeHydroData.meta.chapitre_titre, articles: aCodeHydro },
    { id: "tfnc3-redev", label: redevSuperfData.meta.chapitre_titre, articles: aRedevSuperf },
    {
      id: "tfnc3-petrole", label: "3.3. Application des dispositions fiscales au secteur pétrolier amont",
      articles: [...aTfnc3PetCh1, ...aTfnc3PetCh2, ...aTfnc3PetCh3, ...aTfnc3PetCh4, ...aTfnc3PetCh5],
    },
    { id: "tfnc3-tva-pet", label: tvaPetrolierData.meta.chapitre_titre, articles: aTvaPetrolier },
    buildChapitreTree(aFiscMiniere, fiscMiniereData.meta.chapitre_titre, "tfnc3-mines"),
  ],
};

// TFNC4 - Impôts, taxes et retenues divers
export const tfnc4Node: SommaireNode = {
  id: "tfnc4", label: "4. Impôts, taxes et retenues divers",
  children: [
    { id: "tfnc4-asdi", label: "4.1. Acompte sur divers impôts (ASDI)", articles: aTfnc4Asdi },
    { id: "tfnc4-camu", label: "4.2. Contribution de solidarité pour la CAMU", articles: aTfnc4Camu },
    {
      id: "tfnc4-accises-parent", label: "4.3. Droits d'accises et taxes assimilées",
      children: [
        { id: "tfnc4-accises", label: tfnc4AccisesData.meta.chapitre_titre, articles: aTfnc4Accises },
        { id: "tfnc4-boissons", label: tfnc4BoissonsData.meta.chapitre_titre, articles: aTfnc4Boissons },
      ],
    },
    buildChapitreTree(aDroitsFonciers, "4.4. Droits fonciers exceptionnels", "tfnc4-foncier"),
    { id: "tfnc4-pylones", label: impotPylonesData.meta.chapitre_titre, articles: aImpotPylones },
    { id: "tfnc4-igf", label: impotGlobalForfData.meta.chapitre_titre, articles: aImpotGlobalForf },
    { id: "tfnc4-audio", label: redevAudioData.meta.chapitre_titre, articles: aRedevAudio },
    { id: "tfnc4-tresor", label: retenueTresorData.meta.chapitre_titre, articles: aRetenueTresor },
    { id: "tfnc4-tv", label: taxeAbonnTvData.meta.chapitre_titre, articles: aTaxeAbonnTv },
    { id: "tfnc4-tol", label: taxeOccupLocauxData.meta.chapitre_titre, articles: aTaxeOccupLocaux },
    { id: "tfnc4-telecom", label: taxeTraficComData.meta.chapitre_titre, articles: aTaxeTraficCom },
    { id: "tfnc4-avion", label: taxeBilletsAvionData.meta.chapitre_titre, articles: aTaxeBilletsAvion },
    { id: "tfnc4-jeux", label: taxeJeuxData.meta.chapitre_titre, articles: aTaxeJeux },
    { id: "tfnc4-transf", label: taxeTransfertsData.meta.chapitre_titre, articles: aTaxeTransferts },
    { id: "tfnc4-tus", label: taxeUniqueSalData.meta.chapitre_titre, articles: aTaxeUniqueSal },
    { id: "tfnc4-emball", label: taxeEmballagesData.meta.chapitre_titre, articles: aTaxeEmballages },
    { id: "tfnc4-rcc", label: redevCarboneData.meta.chapitre_titre, articles: aRedevCarbone },
    { id: "tfnc4-polluantes", label: taxePolluantesData.meta.chapitre_titre, articles: aTaxePolluantes },
  ],
};

// TFNC5 - Administrations fiscales et procédures
export const tfnc5Node: SommaireNode = {
  id: "tfnc5", label: "5. Obligations et procédures fiscales non codifiées",
  children: [
    { id: "tfnc5-attest", label: attestNonRedevData.meta.chapitre_titre, articles: aAttestNonRedev },
    { id: "tfnc5-niu", label: "5.2. Numéro d'identification unique (NIU)", articles: [...aNiuDecret, ...aNiuArrete5327, ...aNiuArrete25604] },
    { id: "tfnc5-recouv", label: recouvRecettesData.meta.chapitre_titre, articles: aRecouvRecettes },
    { id: "tfnc5-risques", label: approcheRisquesData.meta.chapitre_titre, articles: aApprocheRisques },
    { id: "tfnc5-echange", label: echangeRenseignData.meta.chapitre_titre, articles: aEchangeRenseign },
  ],
};

// TFNC6 - TVA
export const tfnc6Node: SommaireNode = {
  id: "tfnc6", label: "6. Taxe sur la valeur ajoutée (TVA)",
  children: [
    { id: "tfnc6-ch1", label: `Chapitre 1 - ${tfnc6TvaCh1Data.meta.chapitre_titre}`, articles: aTfnc6Ch1 },
    { id: "tfnc6-ch2", label: `Chapitre 2 - ${tfnc6TvaCh2Data.meta.chapitre_titre}`, articles: aTfnc6Ch2 },
    { id: "tfnc6-ch3", label: `Chapitre 3 - ${tfnc6TvaCh3Data.meta.chapitre_titre}`, articles: aTfnc6Ch3 },
    { id: "tfnc6-ch4", label: `Chapitre 4 - ${tfnc6TvaCh4Data.meta.chapitre_titre}`, articles: aTfnc6Ch4 },
    { id: "tfnc6-ch5", label: `Chapitre 5 - ${tfnc6TvaCh5Data.meta.chapitre_titre}`, articles: aTfnc6Ch5 },
    { id: "tfnc6-annexes", label: tfnc6TvaAnnexesData.meta.chapitre_titre, articles: aTfnc6Annexes },
  ],
};

export const tfncArticles: ArticleData[] = [
  // TFNC2
  ...aCharteInvest, ...aDecretAgrement, ...aZes, ...aZonesFranchesSante, ...aZoneValoInfra, ...aEntrepreneuriat, ...aOperationsBvmac,
  // TFNC3
  ...aCodeHydro, ...aRedevSuperf,
  ...aTfnc3PetCh1, ...aTfnc3PetCh2, ...aTfnc3PetCh3, ...aTfnc3PetCh4, ...aTfnc3PetCh5,
  ...aTvaPetrolier, ...aFiscMiniere,
  // TFNC4
  ...aTfnc4Asdi, ...aTfnc4Camu, ...aTfnc4Accises, ...aTfnc4Boissons,
  ...aDroitsFonciers, ...aImpotPylones, ...aImpotGlobalForf,
  ...aRedevAudio, ...aRetenueTresor, ...aTaxeAbonnTv, ...aTaxeOccupLocaux,
  ...aTaxeTraficCom, ...aTaxeBilletsAvion, ...aTaxeJeux, ...aTaxeTransferts, ...aTaxeUniqueSal, ...aTaxeEmballages,
  ...aTaxeRtn, ...aRedevCarbone, ...aTaxePolluantes,
  // TFNC5
  ...aNiuDecret, ...aNiuArrete5327, ...aNiuArrete25604,
  ...aRecouvRecettes, ...aApprocheRisques, ...aEchangeRenseign, ...aAttestNonRedev,
  // TFNC6
  ...aTfnc6Ch1, ...aTfnc6Ch2, ...aTfnc6Ch3,
  ...aTfnc6Ch4, ...aTfnc6Ch5, ...aTfnc6Annexes,
];
