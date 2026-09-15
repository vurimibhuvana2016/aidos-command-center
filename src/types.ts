export type Risk = "critical" | "watch" | "healthy";

export interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  dailySales: number;
  sellThrough: number;
  leadTime: number;
  safetyStock: number;
  expiryDays: number;
  unitPrice: number;
  demandChange: number;
  forecast: number[];
}

export interface Insight {
  product: Product;
  risk: Risk;
  signal: string;
  cover: number;
  reorderQty: number;
  reason: string;
  action: string;
  exposure: number;
}

export interface Activity {
  id: string;
  type: "approved" | "reviewed" | "imported";
  label: string;
  time: string;
}

export type Page = "Command center" | "Inventory" | "Forecast" | "Action center" | "Data hub";
