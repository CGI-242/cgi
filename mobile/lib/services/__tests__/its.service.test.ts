import { calculerNombreParts, calculerIts, type ItsInput } from "../its.service";
import { FISCAL_PARAMS } from "../fiscal-common";

describe("calculerNombreParts", () => {
  it("celibataire sans enfants = 1 part", () => {
    expect(calculerNombreParts("celibataire", 0, true)).toBe(1);
  });

  it("marie sans enfants = 2 parts", () => {
    expect(calculerNombreParts("marie", 0, true)).toBe(2);
  });

  it("marie avec 2 enfants = 3 parts", () => {
    expect(calculerNombreParts("marie", 2, true)).toBe(3);
  });

  it("celibataire avec 1 enfant = 2 parts (1 base + 1 premier enfant)", () => {
    expect(calculerNombreParts("celibataire", 1, true)).toBe(2);
  });

  it("celibataire avec 3 enfants = 3 parts (1 + 1 + 0.5 + 0.5)", () => {
    expect(calculerNombreParts("celibataire", 3, true)).toBe(3);
  });

  it("veuf avec enfants = 2 parts base", () => {
    expect(calculerNombreParts("veuf", 2, true)).toBe(3);
  });

  it("sans charge familiale = 1 part", () => {
    expect(calculerNombreParts("marie", 5, false)).toBe(1);
  });

  it("plafond a 6.5 parts", () => {
    expect(calculerNombreParts("marie", 20, true)).toBe(FISCAL_PARAMS.quotientFamilial.maxParts);
  });
});

describe("calculerIts", () => {
  const baseInput: ItsInput = {
    salaireBrut: 500_000,
    periode: "mensuel",
    situationFamiliale: "celibataire",
    nombreEnfants: 0,
    appliquerChargeFamille: true,
  };

  it("retourne un resultat avec toutes les proprietes", () => {
    const result = calculerIts(baseInput);
    expect(result).toHaveProperty("revenuBrutMensuel");
    expect(result).toHaveProperty("revenuBrutAnnuel");
    expect(result).toHaveProperty("retenueCnss");
    expect(result).toHaveProperty("fraisProfessionnels");
    expect(result).toHaveProperty("revenuNetImposable");
    expect(result).toHaveProperty("nombreParts");
    expect(result).toHaveProperty("itsAnnuel");
    expect(result).toHaveProperty("itsMensuel");
    expect(result).toHaveProperty("tauxEffectif");
    expect(result).toHaveProperty("salaireNetMensuel");
  });

  it("annualise correctement un salaire mensuel", () => {
    const result = calculerIts(baseInput);
    expect(result.revenuBrutAnnuel).toBe(500_000 * 12);
    expect(result.revenuBrutMensuel).toBe(500_000);
  });

  it("applique le plafond CNSS", () => {
    const highSalary: ItsInput = { ...baseInput, salaireBrut: 2_000_000 };
    const result = calculerIts(highSalary);
    expect(result.plafondCnssApplique).toBe(true);
    // CNSS retenue mensuelle = plafond * taux
    expect(result.retenueCnssMensuelle).toBe(
      FISCAL_PARAMS.cnss.plafondMensuel * FISCAL_PARAMS.cnss.taux
    );
  });

  it("ne plafonne pas la CNSS sous le seuil", () => {
    const result = calculerIts(baseInput);
    expect(result.plafondCnssApplique).toBe(false);
    expect(result.retenueCnssMensuelle).toBe(500_000 * FISCAL_PARAMS.cnss.taux);
  });

  it("ITS annuel est positif pour un salaire significatif", () => {
    const result = calculerIts({ ...baseInput, salaireBrut: 1_000_000 });
    expect(result.itsAnnuel).toBeGreaterThan(0);
  });

  it("itsMensuel = itsAnnuel / 12", () => {
    const result = calculerIts(baseInput);
    expect(result.itsMensuel).toBe(Math.round(result.itsAnnuel / 12));
  });
});
