import {
  Bell,
  Boxes,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileBarChart,
  Gavel,
  Handshake,
  LayoutDashboard,
  LineChart,
  MessageSquareText,
  Settings,
  Sparkles,
  Truck
} from "lucide-react";
import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", path: "/inventory", icon: Boxes },
  { label: "AI Pricing", path: "/pricing", icon: Sparkles },
  { label: "Buyer CRM", path: "/buyers", icon: Handshake },
  { label: "Negotiation Center", path: "/negotiation", icon: MessageSquareText },
  { label: "Auction Marketplace", path: "/auctions", icon: Gavel },
  { label: "Logistics", path: "/logistics", icon: Truck },
  { label: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { label: "Contracts", path: "/contracts", icon: ClipboardCheck },
  { label: "Reports", path: "/reports", icon: FileBarChart },
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Forecast Lab", path: "/analytics?view=forecast", icon: LineChart }
];
