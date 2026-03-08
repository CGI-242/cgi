import {
  calculerPaie,
  calculerAvantagesForfaitaires,
  type PaieInput,
  type RubriquesInput,
} from "../paie.service";
import { FISCAL_PARAMS, PAIE_PARAMS } from "../fiscal-common";

const rubriquesVides: RubriquesInput = {
  salaireBase: 0,
  primesImposables: 0,
  heuresSup: 0,
  congesAnnuels: 0,
  primeTransport: 0,
  primeRepresentation: 0,
  primePanier: 0,
  primeSalissure: 0,
  avLogement: 0,
  avDomesticite: 0,
  avElectricite: 0,
  avVoiture: 0,
  avTelephone: 0,
  avNourriture: 0,
};

const baseInput: PaieInput = {
  rubriques: {
    ...rubriquesVides,
    salaireBase: 500_000,
    primesImposables: 100_000,
    heuresSup: 50_000,
    congesAnnuels: 0,
    primeTransport: 30_000,
    primeRepresentation: 20_000,
    primePanier: 15_000,
    primeSalissure: 10_000,
    avLogement: 100_000,
    avDomesticite: 0,
    avElectricite: 0,
    avVoiture: 0,
    avTelephone: 0,
    avNourriture: 0,
  },
  profilSalarie: "national",
  situationFamiliale: "celibataire",
  nombreEnfants: 0,
  zoneTOL: "centre_ville",
  moisJanvier: false,
};

// Valeurs de référence calculées à partir du service :
// salairePresence = 500k + 100k + 50k + 0 = 650 000
// totalAvantagesNature = 100 000
// salaireBrutTotal = salairePresence + avantages = 750 000
// totalExonere = transport + représentation + panier + salissure = 75 000
// baseCNSS = salairePresence = 650 000
// cnssSalarieMensuel = 650 000 × 4% = 26 000
// baseITS = (750 000 − 26 000) × 80% = 579 200
// baseTUS = salaireBrutTotal = 750 000

describe("calculerPaie — Bases de calcul", () => {
  it("baseCNSS = salairePresence (hors avantages et primes exonérées)", () => {
    const result = calculerPaie(baseInput);
    expect(result.baseCNSS).toBe(650_000);
  });

  it("baseITS = (brutTotal − CNSS) × (1 − fraisPro)", () => {
    const result = calculerPaie(baseInput);
    // baseITS = (750 000 − 26 000) × 0.80 = 579 200
    const expected = Math.round((750_000 - 26_000) * (1 - FISCAL_PARAMS.fraisPro.taux));
    expect(result.baseITS).toBe(expected);
  });

  it("totalExonere inclut transport, représentation, panier et salissure (Art. 114-A)", () => {
    const result = calculerPaie(baseInput);
    expect(result.totalExonere).toBe(30_000 + 20_000 + 15_000 + 10_000);
  });

  it("baseTUS = salaireBrutTotal", () => {
    const result = calculerPaie(baseInput);
    expect(result.baseTUS).toBe(result.salaireBrutTotal);
  });

  it("salaireBrutTotal = salairePresence + avantages en nature", () => {
    const result = calculerPaie(baseInput);
    expect(result.salaireBrutTotal).toBe(650_000 + 100_000);
  });
});

describe("calculerPaie — CNSS salarié 4%", () => {
  it("calcule CNSS 4% sans plafond", () => {
    const result = calculerPaie(baseInput);
    expect(result.cnssSalarieMensuel).toBe(Math.round(650_000 * 0.04));
    expect(result.cnssPlafondApplique).toBe(false);
  });

  it("applique le plafond CNSS pour gros salaire", () => {
    const highInput: PaieInput = {
      ...baseInput,
      rubriques: { ...rubriquesVides, salaireBase: 2_000_000 },
    };
    const result = calculerPaie(highInput);
    expect(result.cnssPlafondApplique).toBe(true);
    expect(result.cnssSalarieMensuel).toBe(
      Math.round(FISCAL_PARAMS.cnss.plafondMensuel * FISCAL_PARAMS.cnss.taux)
    );
  });
});

describe("calculerPaie — ITS", () => {
  it("utilise le barème progressif pour un national", () => {
    const result = calculerPaie(baseInput);
    expect(result.modeCalculIts).toBe("bareme");
    expect(result.itsAnnuel).toBeGreaterThan(0);
    expect(result.itsMensuel).toBe(Math.round(result.itsAnnuel / 12));
  });

  it("utilise 20% forfaitaire pour non-résident", () => {
    const nrInput: PaieInput = {
      ...baseInput,
      profilSalarie: "non_resident",
    };
    const result = calculerPaie(nrInput);
    expect(result.modeCalculIts).toBe("forfaitaire_20");
    expect(result.nombreParts).toBe(1);
    const expectedITS = Math.round(result.baseITS * 12 * 0.20);
    expect(result.itsAnnuel).toBe(expectedITS);
  });

  it("étranger résident = même traitement que national (barème)", () => {
    const erInput: PaieInput = {
      ...baseInput,
      profilSalarie: "etranger_resident",
    };
    const resultER = calculerPaie(erInput);
    const resultNat = calculerPaie(baseInput);
    expect(resultER.modeCalculIts).toBe("bareme");
    expect(resultER.itsAnnuel).toBe(resultNat.itsAnnuel);
    expect(resultER.itsMensuel).toBe(resultNat.itsMensuel);
  });
});

describe("calculerPaie — TUS", () => {
  it("applique 7.5% sur baseTUS pour résident", () => {
    const result = calculerPaie(baseInput);
    expect(result.tauxTUS).toBe(0.075);
    expect(result.tusMensuel).toBe(Math.round(result.baseTUS * 0.075));
  });

  it("applique 6% sur baseTUS pour non-résident", () => {
    const nrInput: PaieInput = { ...baseInput, profilSalarie: "non_resident" };
    const result = calculerPaie(nrInput);
    expect(result.tauxTUS).toBe(0.06);
    expect(result.tusMensuel).toBe(Math.round(result.baseTUS * 0.06));
  });
});

describe("calculerPaie — TOL", () => {
  it("retourne 5 000 pour centre-ville", () => {
    const result = calculerPaie(baseInput);
    expect(result.tolMensuel).toBe(5_000);
  });

  it("retourne 1 000 pour périphérie", () => {
    const periInput: PaieInput = { ...baseInput, zoneTOL: "peripherie" };
    const result = calculerPaie(periInput);
    expect(result.tolMensuel).toBe(1_000);
  });
});

describe("calculerPaie — CAMU", () => {
  it("calcule 0.5% au-delà de 500 000 sur (brutTotal − CNSS)", () => {
    const result = calculerPaie(baseInput);
    // baseCAMU = (750 000 − 26 000) − 500 000 = 224 000
    const expectedBase = Math.max(0, (result.salaireBrutTotal - result.cnssSalarieMensuel) - PAIE_PARAMS.camu.seuilMensuel);
    expect(result.baseCAMU).toBe(expectedBase);
    expect(result.camuMensuel).toBe(Math.round(expectedBase * 0.005));
  });

  it("CAMU = 0 si base nette sous 500 000", () => {
    const lowInput: PaieInput = {
      ...baseInput,
      rubriques: { ...rubriquesVides, salaireBase: 200_000 },
    };
    const result = calculerPaie(lowInput);
    expect(result.camuMensuel).toBe(0);
  });
});

describe("calculerPaie — Taxe régionale", () => {
  it("vaut 0 si moisJanvier = false", () => {
    const result = calculerPaie(baseInput);
    expect(result.taxeRegionale).toBe(0);
  });

  it("vaut 2 400 si moisJanvier = true", () => {
    const janInput: PaieInput = { ...baseInput, moisJanvier: true };
    const result = calculerPaie(janInput);
    expect(result.taxeRegionale).toBe(PAIE_PARAMS.taxeRegionale);
  });
});

describe("calculerPaie — Charges patronales", () => {
  it("calcule vieillesse 8% avec plafond 1 200 000", () => {
    const result = calculerPaie(baseInput);
    const expected = Math.round(Math.min(result.baseCNSS, 1_200_000) * 0.08);
    expect(result.cnssVieillessePatronale).toBe(expected);
  });

  it("calcule alloc. familiales 10.03% avec plafond 600 000", () => {
    const result = calculerPaie(baseInput);
    const expected = Math.round(Math.min(result.baseCNSS, 600_000) * 0.1003);
    expect(result.cnssAFPatronale).toBe(expected);
  });

  it("calcule prest. familiales 2.25% avec plafond 600 000", () => {
    const result = calculerPaie(baseInput);
    const expected = Math.round(Math.min(result.baseCNSS, 600_000) * 0.0225);
    expect(result.cnssPFPatronale).toBe(expected);
  });

  it("total patronal = 3 branches CNSS + TUS", () => {
    const result = calculerPaie(baseInput);
    expect(result.totalChargesPatronales).toBe(
      result.cnssVieillessePatronale + result.cnssAFPatronale + result.cnssPFPatronale + result.tusMensuel
    );
  });

  it("applique le plafond 600 000 pour AF/PF si baseCNSS > 600 000", () => {
    const result = calculerPaie(baseInput);
    // baseCNSS = 650 000 > 600 000
    expect(result.cnssAFPatronale).toBe(Math.round(600_000 * 0.1003));
    expect(result.cnssPFPatronale).toBe(Math.round(600_000 * 0.0225));
  });
});

describe("calculerPaie — Salaire net et coût employeur", () => {
  it("salaire net = brutTotal + exonérés − avantages − retenues", () => {
    const result = calculerPaie(baseInput);
    expect(result.salaireNetMensuel).toBe(
      result.salaireBrutTotal + result.totalExonere - result.totalAvantagesNature - result.totalRetenuesSalarie
    );
  });

  it("total retenues = CNSS + ITS + TOL + CAMU + taxeRégionale (pas TUS)", () => {
    const result = calculerPaie(baseInput);
    expect(result.totalRetenuesSalarie).toBe(
      result.cnssSalarieMensuel + result.itsMensuel +
      result.tolMensuel + result.camuMensuel + result.taxeRegionale
    );
  });

  it("coût total employeur = brut total + charges patronales", () => {
    const result = calculerPaie(baseInput);
    expect(result.coutTotalEmployeur).toBe(result.salaireBrutTotal + result.totalChargesPatronales);
  });

  it("salaire net annuel = net mensuel × 12", () => {
    const result = calculerPaie(baseInput);
    expect(result.salaireNetAnnuel).toBe(result.salaireNetMensuel * 12);
  });
});

describe("calculerAvantagesForfaitaires — Art. 115", () => {
  it("calcule logement à 20% du plafond CNSS", () => {
    const salairePresence = 800_000;
    const result = calculerAvantagesForfaitaires(salairePresence);
    expect(result.avLogement).toBe(Math.round(800_000 * 0.20));
  });

  it("plafonne logement au plafond CNSS si salaire > plafond", () => {
    const salairePresence = 2_000_000;
    const result = calculerAvantagesForfaitaires(salairePresence);
    expect(result.avLogement).toBe(Math.round(1_200_000 * 0.20));
  });

  it("calcule domesticité à 7% du brut", () => {
    const salairePresence = 1_000_000;
    const result = calculerAvantagesForfaitaires(salairePresence);
    expect(result.avDomesticite).toBe(Math.round(1_000_000 * 0.07));
  });

  it("calcule électricité à 5% du brut", () => {
    const salairePresence = 1_000_000;
    const result = calculerAvantagesForfaitaires(salairePresence);
    expect(result.avElectricite).toBe(Math.round(1_000_000 * 0.05));
  });

  it("calcule voiture à 3% du brut", () => {
    const salairePresence = 1_000_000;
    const result = calculerAvantagesForfaitaires(salairePresence);
    expect(result.avVoiture).toBe(Math.round(1_000_000 * 0.03));
  });

  it("calcule téléphone à 2% du brut", () => {
    const salairePresence = 1_000_000;
    const result = calculerAvantagesForfaitaires(salairePresence);
    expect(result.avTelephone).toBe(Math.round(1_000_000 * 0.02));
  });

  it("calcule nourriture à 20% du brut", () => {
    const salairePresence = 1_000_000;
    const result = calculerAvantagesForfaitaires(salairePresence);
    expect(result.avNourriture).toBe(Math.round(1_000_000 * 0.20));
  });
});
