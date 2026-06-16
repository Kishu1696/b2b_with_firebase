import type { Auction, Buyer, ChartPoint, Contract, InventoryItem, Shipment, Transaction } from "@/types";
import { todayOffset } from "@/utils/format";

const categories = ["Consumer Electronics", "Apparel", "Home Goods", "Industrial", "Beauty", "Sports"];
const warehouses = ["Phoenix DC", "Dallas Hub", "Newark Crossdock", "Reno FC", "Atlanta Node"];
const regions = ["West", "South", "Northeast", "Midwest", "International"];
const productNouns = ["Smart Display", "Athletic Jacket", "Standing Desk", "Cordless Tool", "Skincare Kit", "Trail Pack"];
const companies = ["Northstar Wholesale", "Vantage Resale", "Apex Closeouts", "BluePeak Trading", "OmniBin", "Mercury Lots"];

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

export const inventoryRecords: InventoryItem[] = Array.from({ length: 1000 }, (_, index) => {
  const marketValue = 18_000 + ((index * 913) % 420_000);
  const age = 8 + ((index * 7) % 280);
  return {
    id: `inv-${index + 1}`,
    sku: `LF-${String(index + 1).padStart(5, "0")}`,
    productName: `${pick(productNouns, index)} Lot ${index + 1}`,
    category: pick(categories, index),
    quantity: 24 + ((index * 17) % 2400),
    warehouse: pick(warehouses, index),
    region: pick(regions, index),
    age,
    marketValue,
    liquidationValue: Math.round(marketValue * (0.42 + (index % 32) / 100)),
    status: pick(["Listed", "In Auction", "Reserved", "Liquidated", "Hold"] as const, index)
  };
});

export const buyers: Buyer[] = Array.from({ length: 500 }, (_, index) => ({
  id: `buyer-${index + 1}`,
  company: `${pick(companies, index)} ${index + 1}`,
  contact: ["Avery Chen", "Maya Patel", "Jordan Lee", "Noah Smith", "Sara Kim"][index % 5],
  segment: ["Marketplace", "Exporter", "Discount Retail", "D2C Reseller"][index % 4],
  region: pick(regions, index + 2),
  lifetimeValue: 45_000 + ((index * 12_701) % 2_400_000),
  lastActivity: todayOffset(-((index * 3) % 45)),
  sentiment: pick(["Positive", "Neutral", "At Risk"] as const, index),
  stage: pick(["New Lead", "Contacted", "Qualified", "Negotiation", "Won", "Lost"] as const, index)
}));

export const transactions: Transaction[] = Array.from({ length: 5000 }, (_, index) => ({
  id: `txn-${index + 1}`,
  buyer: buyers[index % buyers.length].company,
  sku: inventoryRecords[index % inventoryRecords.length].sku,
  value: 4_500 + ((index * 4567) % 185_000),
  margin: 8 + ((index * 1.7) % 31),
  date: todayOffset(-((index * 2) % 365)),
  status: pick(["Paid", "Pending", "Escrow", "Failed"] as const, index)
}));

export const auctions: Auction[] = Array.from({ length: 100 }, (_, index) => ({
  id: `auc-${index + 1}`,
  title: `${pick(productNouns, index + 3)} Liquidation Event`,
  category: pick(categories, index + 1),
  currentBid: 12_000 + ((index * 29_001) % 760_000),
  startingPrice: 8_000 + ((index * 15_317) % 410_000),
  timeRemaining: index % 3 === 0 ? "2h 18m" : `${1 + (index % 9)}d ${index % 24}h`,
  status: pick(["Active", "Closed", "Scheduled"] as const, index),
  bidders: 4 + ((index * 5) % 58),
  image: `https://images.unsplash.com/photo-${[
    "1498049794561-7780e7231661",
    "1555041469-a586c61ea9bc",
    "1516321318423-f06f85e504b3",
    "1581091226825-a6a2a5aee158"
  ][index % 4]}?auto=format&fit=crop&w=900&q=80`
}));

export const shipments: Shipment[] = Array.from({ length: 500 }, (_, index) => ({
  id: `SHP-${String(index + 1).padStart(6, "0")}`,
  carrier: ["Maersk", "DHL Freight", "FedEx Supply Chain", "XPO", "Flexport"][index % 5],
  origin: pick(warehouses, index),
  destination: `${pick(regions, index + 1)} Buyer Pool`,
  eta: todayOffset(1 + (index % 24)),
  status: pick(["In Transit", "Delivered", "Delayed", "Pending"] as const, index),
  value: 25_000 + ((index * 6_111) % 620_000)
}));

export const contracts: Contract[] = Array.from({ length: 100 }, (_, index) => ({
  id: `CTR-${String(index + 1).padStart(5, "0")}`,
  buyer: buyers[index % buyers.length].company,
  value: 80_000 + ((index * 84_103) % 3_400_000),
  expiryDate: todayOffset(12 + ((index * 11) % 210)),
  status: pick(["Active", "Review", "Expired", "Draft"] as const, index),
  risk: pick(["Low", "Medium", "High"] as const, index)
}));

export const revenueTrend: ChartPoint[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
].map((name, index) => ({
  name,
  revenue: 520_000 + index * 82_000 + (index % 3) * 46_000,
  inventory: 340_000 + index * 51_000,
  buyers: 180 + index * 24,
  demand: 52 + index * 3.4,
  price: 42 + index * 2.1,
  score: 62 + index * 2.7
}));

export const regionPerformance = regions.map((name, index) => ({
  name,
  revenue: 840_000 + index * 310_000,
  demand: 64 + index * 7,
  inventory: 520 + index * 140
}));

export const aiInsights = [
  "AI recommends bundling slow-moving smart displays with accessories to lift close rate by 18%.",
  "West region demand is accelerating for refurbished electronics; reserve 22% more lots for auction.",
  "Three contracts expire inside 30 days with high-value buyers. Legal review is recommended.",
  "Carrier delays are concentrated on Atlanta to Northeast routes; reroute premium shipments via Newark."
];
