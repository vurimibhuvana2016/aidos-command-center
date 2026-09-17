import type { Activity, Product } from "../types";

// Deterministic PRNG seeded from a string (e.g. workspace name), so the same
// workspace always regenerates the same dataset, but different workspaces get
// different ones. Not cryptographic — just enough variety for a demo.
function seedFromString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAME_POOL: Record<string, string[]> = {
  "Frozen treats": ["Mango Burst Bar", "Choco Fudge Stick", "Kulfi Royale", "Berry Swirl Tub", "Nawabi Family Pack", "Vanilla Cloud Cone"],
  "Snacks": ["Classic Masala Chips", "Peri Peri Twists", "Roasted Makhana", "Banana Chips Crunch", "Tangy Tomato Sticks", "Spice Route Namkeen"],
  "Beverages": ["Pure Dairy Lassi", "Coconut Water 500ml", "Rose Milk 200ml", "Cold Brew Coffee", "Jaljeera Fizz", "Buttermilk Classic"],
};
const CATEGORIES = Object.keys(NAME_POOL);

function randInt(rng: () => number, min: number, max: number) { return Math.floor(min + rng() * (max - min + 1)); }

export function generateWorkspaceData(seedText: string): { products: Product[]; activity: Activity[] } {
  const rng = mulberry32(seedFromString(seedText || "AIDOS"));
  const usedNames = new Set<string>();
  const usedSkus = new Set<string>();
  const products: Product[] = [];

  for (let i = 0; i < 8; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const pool = NAME_POOL[category].filter(n => !usedNames.has(n));
    const name = pool[randInt(rng, 0, pool.length - 1)] ?? `${category} Item ${i + 1}`;
    usedNames.add(name);

    let sku = `SKU-${randInt(rng, 100, 599)}`;
    while (usedSkus.has(sku)) sku = `SKU-${randInt(rng, 100, 599)}`;
    usedSkus.add(sku);

    const dailySales = randInt(rng, 5, 90);
    const demandChange = randInt(rng, -20, 30);
    const stock = randInt(rng, 100, 950);
    const leadTime = randInt(rng, 2, 6);
    const safetyStock = Math.round(dailySales * (0.8 + rng() * 1.4));
    const forecast = [0, 1, 2, 3, 4, 5, 6].map(n => Math.max(0, Math.round(dailySales * (1 + (demandChange / 100) * (n + 1) / 7))));

    products.push({
      sku, name, category, stock, dailySales,
      sellThrough: randInt(rng, 35, 96),
      leadTime, safetyStock,
      expiryDays: randInt(rng, 10, 95),
      unitPrice: randInt(rng, 15, 300),
      demandChange, forecast,
    });
  }

  const [p1, p2] = products;
  const activity: Activity[] = [
    { id: "a1", type: "reviewed", label: `Expiry transfer reviewed for ${p1.sku}`, time: "12 min ago" },
    { id: "a2", type: "approved", label: `Reorder approved for ${p2.sku}`, time: "1 hr ago" },
    { id: "a3", type: "imported", label: `${randInt(rng, 400, 2200)} sales rows synced`, time: "Today, 08:42" },
  ];

  return { products, activity };
}
