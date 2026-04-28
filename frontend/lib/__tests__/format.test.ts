import { describe, it, expect } from "vitest";
import { formatCurrency, formatCompactCurrency, formatArea, formatDate } from "@/lib/format";

describe("formatCurrency", () => {
  it("formats a VND amount with dot thousands separator", () => {
    const result = formatCurrency(3500000);
    // Vietnamese locale formats as "3.500.000 ₫" or similar
    expect(result).toContain("3.500.000");
    expect(result).toContain("₫");
  });

  it("formats zero correctly", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
    expect(result).toContain("₫");
  });
});

describe("formatCompactCurrency", () => {
  it("converts amount to millions with tr/thang suffix", () => {
    const result = formatCompactCurrency(3500000);
    expect(result).toBe("3,5 tr/thang");
  });

  it("handles exact millions", () => {
    const result = formatCompactCurrency(5000000);
    expect(result).toBe("5 tr/thang");
  });
});

describe("formatArea", () => {
  it("appends m2 to the value", () => {
    expect(formatArea(25)).toBe("25 m2");
  });

  it("handles decimal areas", () => {
    expect(formatArea(18.5)).toBe("18.5 m2");
  });
});

describe("formatDate", () => {
  it("formats ISO date string to Vietnamese medium date", () => {
    const result = formatDate("2026-04-15T10:30:00Z");
    // Vietnamese medium date: "15 thg 4, 2026" or similar
    expect(result).toContain("2026");
    expect(result).toContain("15");
  });
});
