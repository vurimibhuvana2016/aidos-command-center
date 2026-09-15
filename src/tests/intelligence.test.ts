import { describe, expect, it } from "vitest";
import { analyzeProduct, answerQuestion, daysCover } from "../lib/intelligence";
import { products } from "../data/demo";

describe("AIDOS intelligence engine", () => {
  it("calculates days of cover from stock and velocity", () => {
    expect(daysCover(products[0])).toBeCloseTo(186 / 61, 3);
  });

  it("flags tight cover against lead time as a stock-out risk", () => {
    const result = analyzeProduct(products[0]);
    expect(result.signal).toBe("Stock-out risk");
    expect(result.risk).toBe("critical");
    expect(result.reorderQty).toBeGreaterThan(0);
  });

  it("flags units unlikely to sell before expiry", () => {
    const result = analyzeProduct(products[2]);
    expect(result.signal).toBe("Expiry exposure");
    expect(result.exposure).toBeGreaterThan(0);
  });

  it("answers with evidence present in connected data", () => {
    const insights = products.map(analyzeProduct);
    const reply = answerQuestion("Why is SKU-104 at risk?", insights);
    expect(reply.title).toContain("Mango Burst Bar");
    expect(reply.evidence.join(" ")).toContain("days cover");
    expect(reply.action).toContain("Reorder");
  });
});
