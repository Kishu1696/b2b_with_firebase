import type { ComponentType } from "react";

export type Status = "Active" | "Pending" | "Closed" | "Delayed" | "Won" | "Lost";

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  quantity: number;
  warehouse: string;
  region: string;
  age: number;
  marketValue: number;
  liquidationValue: number;
  status: "Listed" | "In Auction" | "Reserved" | "Liquidated" | "Hold";
}

export interface Buyer {
  id: string;
  company: string;
  contact: string;
  segment: string;
  region: string;
  lifetimeValue: number;
  lastActivity: string;
  sentiment: "Positive" | "Neutral" | "At Risk";
  stage: "New Lead" | "Contacted" | "Qualified" | "Negotiation" | "Won" | "Lost";
}

export interface Transaction {
  id: string;
  buyer: string;
  sku: string;
  value: number;
  margin: number;
  date: string;
  status: "Paid" | "Pending" | "Escrow" | "Failed";
}

export interface Auction {
  id: string;
  title: string;
  category: string;
  currentBid: number;
  startingPrice: number;
  timeRemaining: string;
  status: "Active" | "Closed" | "Scheduled";
  bidders: number;
  image: string;
}

export interface Shipment {
  id: string;
  carrier: string;
  origin: string;
  destination: string;
  eta: string;
  status: "In Transit" | "Delivered" | "Delayed" | "Pending";
  value: number;
}

export interface Contract {
  id: string;
  buyer: string;
  value: number;
  expiryDate: string;
  status: "Active" | "Review" | "Expired" | "Draft";
  risk: "Low" | "Medium" | "High";
}

export interface ChartPoint {
  name: string;
  revenue?: number;
  inventory?: number;
  buyers?: number;
  demand?: number;
  price?: number;
  score?: number;
}

export interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
}
