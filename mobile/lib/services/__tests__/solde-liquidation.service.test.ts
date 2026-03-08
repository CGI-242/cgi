import {
  calculerSoldeLiquidation,
  type SoldeLiquidationInput,
} from "../solde-liquidation.service";

describe("calculerSoldeLiquidation", () => {
  const baseInput: SoldeLiquidationInput = {
    resultatFiscal: 20_000_000,
    typeContribuable: "general",
    acompte1: 262_500,
    acompte2: 262_500,
    acompte3: 262_500,
    acompte4: 262_500,
  };

  it("applique le taux general de 28%", () => {
    const result = calculerSoldeLiquidation(baseInput);
    expect(result.tauxIS).toBe(28);
    expect(result.isCalcule).toBe(5_600_000);
  });

  it("applique le taux microfinance/enseignement de 25%", () => {
    const result = calculerSoldeLiquidation({
      ...baseInput,
      typeContribuable: "microfinance",
    });
    expect(result.tauxIS).toBe(25);
    expect(result.isCalcule).toBe(5_000_000);
  });

  it("applique le taux mines/immobilier de 28%", () => {
    const result = calculerSoldeLiquidation({
      ...baseInput,
      typeContribuable: "mines",
    });
    expect(result.tauxIS).toBe(28);
    expect(result.isCalcule).toBe(5_600_000);
  });

  it("neglige la fraction < 1 000 FCFA (Art. 86A-1)", () => {
    const result = calculerSoldeLiquidation({
      ...baseInput,
      resultatFiscal: 20_000_500,
    });
    expect(result.beneficeArrondi).toBe(20_000_000);
    expect(result.isCalcule).toBe(5_600_000);
  });

  it("calcule le solde positif quand IS > acomptes", () => {
    const result = calculerSoldeLiquidation(baseInput);
    // IS = 5 600 000, acomptes = 1 050 000 => solde = 4 550 000
    expect(result.totalAcomptes).toBe(1_050_000);
    expect(result.solde).toBe(4_550_000);
    expect(result.creditImpot).toBe(false);
  });

  it("detecte un credit d'impot quand acomptes > IS", () => {
    const input: SoldeLiquidationInput = {
      resultatFiscal: 1_000_000,
      typeContribuable: "general",
      acompte1: 262_500,
      acompte2: 262_500,
      acompte3: 262_500,
      acompte4: 262_500,
    };
    const result = calculerSoldeLiquidation(input);
    // IS = 280 000, acomptes = 1 050 000 => solde = -770 000
    expect(result.isCalcule).toBe(280_000);
    expect(result.solde).toBe(-770_000);
    expect(result.creditImpot).toBe(true);
  });

  it("retourne le detail des 4 acomptes", () => {
    const result = calculerSoldeLiquidation(baseInput);
    expect(result.detailAcomptes).toHaveLength(4);
  });
});
