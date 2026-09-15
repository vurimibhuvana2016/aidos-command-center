import type { Activity, Product } from "../types";

export const products: Product[] = [
  { sku:"SKU-104", name:"Mango Burst Bar", category:"Frozen treats", stock:186, dailySales:61, sellThrough:94, leadTime:4, safetyStock:122, expiryDays:81, unitPrice:25, demandChange:28, forecast:[48,52,54,58,62,67,71] },
  { sku:"SKU-217", name:"Classic Masala Chips", category:"Snacks", stock:492, dailySales:76, sellThrough:91, leadTime:3, safetyStock:160, expiryDays:94, unitPrice:20, demandChange:14, forecast:[67,70,72,75,77,81,84] },
  { sku:"SKU-088", name:"Nawabi Family Pack", category:"Frozen treats", stock:342, dailySales:9, sellThrough:42, leadTime:5, safetyStock:54, expiryDays:12, unitPrice:280, demandChange:-18, forecast:[11,10,9,8,8,7,6] },
  { sku:"SKU-331", name:"Pure Dairy Lassi", category:"Beverages", stock:720, dailySales:36, sellThrough:78, leadTime:2, safetyStock:90, expiryDays:16, unitPrice:35, demandChange:6, forecast:[34,36,37,39,38,41,42] },
  { sku:"SKU-142", name:"Vanilla Cloud Cone", category:"Frozen treats", stock:615, dailySales:44, sellThrough:86, leadTime:3, safetyStock:110, expiryDays:68, unitPrice:40, demandChange:9, forecast:[39,41,44,45,47,49,50] },
  { sku:"SKU-296", name:"Coconut Water 500ml", category:"Beverages", stock:928, dailySales:21, sellThrough:54, leadTime:4, safetyStock:84, expiryDays:71, unitPrice:45, demandChange:-12, forecast:[25,24,22,21,20,19,18] },
  { sku:"SKU-405", name:"Spice Route Namkeen", category:"Snacks", stock:311, dailySales:29, sellThrough:82, leadTime:3, safetyStock:75, expiryDays:52, unitPrice:30, demandChange:4, forecast:[27,28,29,31,30,32,33] },
  { sku:"SKU-512", name:"Rose Milk 200ml", category:"Beverages", stock:144, dailySales:34, sellThrough:89, leadTime:4, safetyStock:96, expiryDays:22, unitPrice:30, demandChange:19, forecast:[30,32,34,37,39,41,43] },
];

export const salesTrend = [
  { day:"08 Sep", actual:312, forecast:304 }, { day:"09 Sep", actual:326, forecast:319 },
  { day:"10 Sep", actual:318, forecast:331 }, { day:"11 Sep", actual:354, forecast:340 },
  { day:"12 Sep", actual:371, forecast:359 }, { day:"13 Sep", actual:390, forecast:382 },
  { day:"14 Sep", actual:412, forecast:401 }, { day:"15 Sep", forecast:423 },
  { day:"16 Sep", forecast:438 }, { day:"17 Sep", forecast:452 },
];

export const categoryMix = [
  { name:"Frozen treats", value:44, color:"#29d3a2" },
  { name:"Beverages", value:31, color:"#ffb86b" },
  { name:"Snacks", value:25, color:"#5b8def" },
];

export const initialActivity: Activity[] = [
  { id:"a1", type:"reviewed", label:"Expiry transfer reviewed for SKU-088", time:"12 min ago" },
  { id:"a2", type:"approved", label:"Reorder approved for SKU-217", time:"1 hr ago" },
  { id:"a3", type:"imported", label:"1,284 sales rows synced", time:"Today, 08:42" },
];
