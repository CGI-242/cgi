import { formatNumber, formatInputNumber, formatMontant } from "@/lib/services/fiscal-common";

describe("formatNumber", () => {
  it("formats a standard number with thousands separators", () => {
    // Intl fr-FR uses narrow no-break space (\u202F) as group separator
    const result = formatNumber(1050000);
    expect(result).toMatch(/1.050.000/); // flexible on separator char
    expect(result.replace(/\s/g, "")).toBe("1050000");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("formats negative numbers", () => {
    const result = formatNumber(-50000);
    // Should contain the digits 50000 with a minus sign
    expect(result.replace(/[^\d-]/g, "")).toBe("-50000");
  });

  it("rounds decimal numbers", () => {
    const result = formatNumber(1234.7);
    expect(result.replace(/\s/g, "")).toBe("1235");
  });

  it("formats very large numbers", () => {
    const result = formatNumber(999999999);
    expect(result.replace(/\s/g, "")).toBe("999999999");
  });
});

describe("formatInputNumber", () => {
  it("formats digits with space separators", () => {
    expect(formatInputNumber("1050000")).toBe("1 050 000");
  });

  it("returns empty string for empty input", () => {
    expect(formatInputNumber("")).toBe("");
  });

  it("strips non-digit characters", () => {
    expect(formatInputNumber("1 050 abc 000")).toBe("1 050 000");
  });

  it("handles single digit", () => {
    expect(formatInputNumber("5")).toBe("5");
  });

  it("caps at maximum amount (100 milliards)", () => {
    const result = formatInputNumber("999999999999999");
    // Should be capped to 100_000_000_000
    expect(result).toBe("100 000 000 000");
  });

  it("handles input with only non-digit characters", () => {
    expect(formatInputNumber("abc")).toBe("");
  });
});

describe("formatMontant", () => {
  it("appends FCFA suffix", () => {
    const result = formatMontant(5000);
    expect(result).toContain("FCFA");
    expect(result).toContain("5");
  });

  it("formats zero with FCFA", () => {
    expect(formatMontant(0)).toBe("0 FCFA");
  });
});
