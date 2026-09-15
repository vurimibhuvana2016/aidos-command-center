import type { Insight, Product } from "../types";

export const daysCover = (p: Product) => p.dailySales > 0 ? p.stock / p.dailySales : 999;

export function analyzeProduct(product: Product): Insight {
  const cover = daysCover(product);
  const leadDemand = product.forecast.slice(0, product.leadTime).reduce((a, b) => a + b, 0);
  const targetStock = Math.ceil(leadDemand + product.safetyStock);
  const reorderQty = Math.max(0, targetStock - product.stock);
  let risk: Insight["risk"] = "healthy";
  let signal = "On track";
  let reason = `${cover.toFixed(1)} days of cover remains and stock is aligned with observed demand.`;
  let action = "Maintain the current replenishment cadence.";
  let exposure = 0;

  if (product.expiryDays <= 15 && product.stock > product.dailySales * product.expiryDays) {
    risk = "critical";
    signal = "Expiry exposure";
    const surplus = Math.ceil(product.stock - product.dailySales * product.expiryDays);
    exposure = surplus * product.unitPrice;
    reason = `${surplus} units are unlikely to sell before expiry at the current ${product.dailySales} units/day velocity.`;
    action = `Pause replenishment and transfer or promote ${surplus} units within 48 hours.`;
  } else if (cover <= product.leadTime + 1.5 || reorderQty > 0) {
    risk = cover < product.leadTime ? "critical" : "watch";
    signal = "Stock-out risk";
    exposure = Math.ceil(Math.max(0, product.dailySales * (product.leadTime + 2) - product.stock) * product.unitPrice);
    reason = `${cover.toFixed(1)} days of cover is tight against a ${product.leadTime}-day lead time while demand is ${product.demandChange > 0 ? "up" : "down"} ${Math.abs(product.demandChange)}%.`;
    action = `Reorder ${reorderQty} units today to restore safety stock.`;
  } else if (cover > 30 && product.sellThrough < 65) {
    risk = "watch";
    signal = "Excess inventory";
    exposure = Math.ceil((product.stock - product.dailySales * 21) * product.unitPrice);
    reason = `${cover.toFixed(1)} days of cover and ${product.sellThrough}% sell-through indicate capital is moving slowly.`;
    action = "Reduce the next purchase and activate a targeted retailer offer.";
  } else if (product.expiryDays <= 18) {
    risk = "watch";
    signal = "Freshness watch";
    exposure = Math.ceil(product.stock * .15 * product.unitPrice);
    reason = `${product.expiryDays} days remain before expiry; velocity should be watched daily.`;
    action = "Prioritize high-velocity retailers on the next dispatch.";
  }

  return { product, risk, signal, cover, reorderQty, reason, action, exposure };
}

export const analyzeAll = (items: Product[]) => items.map(analyzeProduct);

export function answerQuestion(question: string, insights: Insight[]) {
  const q = question.toLowerCase();
  const direct = insights.find(({ product }) =>
    q.includes(product.sku.toLowerCase()) || q.includes(product.name.toLowerCase().split(" ")[0])
  );
  const subject = direct ?? insights.find(x => x.risk === "critical") ?? insights[0];
  if (!subject) return { title:"No connected data", answer:"Import inventory data before asking operational questions.", evidence:[], action:"Open Data hub and load the sample CSV." };

  if (q.includes("expiry") || q.includes("expire")) {
    const expiring = insights.filter(x => x.signal.includes("Expiry") || x.signal.includes("Freshness"));
    return {
      title: `${expiring.length} freshness signal${expiring.length === 1 ? "" : "s"} need attention`,
      answer: expiring.length ? `${expiring[0].product.name} is the most urgent because ${expiring[0].reason.toLowerCase()}` : "No current item breaches the configured freshness thresholds.",
      evidence: expiring.slice(0, 3).map(x => `${x.product.sku}: ${x.product.expiryDays} days to expiry · ${x.product.stock} units`),
      action: expiring[0]?.action ?? "Continue daily monitoring."
    };
  }
  if (q.includes("stock") || q.includes("reorder") || q.includes("risk") || direct) {
    return {
      title: `${subject.product.name} · ${subject.signal}`,
      answer: subject.reason,
      evidence: [`${subject.cover.toFixed(1)} days cover`, `${subject.product.sellThrough}% sell-through`, `${subject.product.leadTime}-day supplier lead time`],
      action: subject.action
    };
  }
  if (q.includes("summary") || q.includes("today")) {
    const critical = insights.filter(x => x.risk === "critical");
    return { title:"Today's operating brief", answer:`${critical.length} critical signals and ${insights.filter(x=>x.risk === "watch").length} watch items were found across ${insights.length} SKUs.`, evidence:critical.map(x=>`${x.product.sku}: ${x.signal}`), action:critical[0]?.action ?? "No immediate intervention required." };
  }
  return { title:"I need a more specific operational question", answer:"I can explain stock-out risk, expiry exposure, today's summary, or a specific SKU using only the connected demo data.", evidence:["No external or invented figures are used"], action:"Try: Why is SKU-104 at risk?" };
}
