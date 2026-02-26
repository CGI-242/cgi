import { calculerIS, type IsInput } from "../is.service";

describe("calculerIS - Minimum de perception", () => {
  const baseInput: IsInput = {
    produitsExploitation: 100_000_000,
    produitsFinanciers: 5_000_000,
    produitsHAO: 0,
    retenuesLiberatoires: 0,
    deficitConsecutif: false,
  };

  it("calcule la base minimum perception", () => {
    const result = calculerIS(baseInput);
    expect(result.baseMinimumPerception).toBe(105_000_000);
  });

  it("applique le taux 1% sans deficit", () => {
    const result = calculerIS(baseInput);
    expect(result.tauxMinimum).toBe(1);
    expect(result.minimumPerceptionAnnuel).toBe(1_050_000);
  });

  it("applique le taux 2% en deficit consecutif", () => {
    const result = calculerIS({ ...baseInput, deficitConsecutif: true });
    expect(result.tauxMinimum).toBe(2);
    expect(result.minimumPerceptionAnnuel).toBe(2_100_000);
  });

  it("calcule 4 acomptes trimestriels egaux", () => {
    const result = calculerIS(baseInput);
    expect(result.acomptes).toHaveLength(4);
    expect(result.acompteTrimestriel).toBe(262_500);
    result.acomptes.forEach((a) => {
      expect(a.montant).toBe(262_500);
    });
  });

  it("deduit les retenues liberatoires de la base", () => {
    const result = calculerIS({
      ...baseInput,
      retenuesLiberatoires: 5_000_000,
    });
    expect(result.baseMinimumPerception).toBe(100_000_000);
  });

  it("minimum annuel >= 0 meme si base negative", () => {
    const result = calculerIS({
      ...baseInput,
      produitsExploitation: 0,
      retenuesLiberatoires: 10_000_000,
    });
    expect(result.minimumPerceptionAnnuel).toBe(0);
  });
});
