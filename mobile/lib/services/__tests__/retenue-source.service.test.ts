import { calculerRetenueSource, type RetenueSourceInput } from "../retenue-source.service";

describe("calculerRetenueSource", () => {
  it("applique 20% pour les non-résidents (Art. 86-D)", () => {
    const result = calculerRetenueSource({ montantHT: 1_000_000, typeRetenue: "non_resident" });
    expect(result.taux).toBe(20);
    expect(result.montantRetenue).toBe(200_000);
    expect(result.articleRef).toBe("Art. 86-D");
  });

  it("applique 10% pour les non soumis IS (Art. 183)", () => {
    const result = calculerRetenueSource({ montantHT: 1_000_000, typeRetenue: "non_soumis_is" });
    expect(result.taux).toBe(10);
    expect(result.montantRetenue).toBe(100_000);
    expect(result.articleRef).toBe("Art. 183");
  });

  it("applique 10% pour le Trésor Public (TFNC4)", () => {
    const result = calculerRetenueSource({ montantHT: 1_000_000, typeRetenue: "tresor_public" });
    expect(result.taux).toBe(10);
    expect(result.montantRetenue).toBe(100_000);
    expect(result.articleRef).toBe("TFNC4");
  });

  it("calcule montant net = HT - retenue", () => {
    const result = calculerRetenueSource({ montantHT: 5_000_000, typeRetenue: "non_resident" });
    expect(result.montantNet).toBe(5_000_000 - 1_000_000);
    expect(result.montantNet).toBe(result.montantHT - result.montantRetenue);
  });

  it("retourne 0 pour un montant 0", () => {
    const result = calculerRetenueSource({ montantHT: 0, typeRetenue: "non_resident" });
    expect(result.montantHT).toBe(0);
    expect(result.montantRetenue).toBe(0);
    expect(result.montantNet).toBe(0);
  });
});
