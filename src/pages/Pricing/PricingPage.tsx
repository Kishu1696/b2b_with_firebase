import { BrainCircuit, Timer, TrendingUp } from "lucide-react";
import { KpiCard } from "@/components/cards/KpiCard";
import { Badge } from "@/components/ui/Badge";
import { ModulePage } from "@/pages/ModulePage";
import { inventoryRecords, revenueTrend } from "@/data/mockData";
import type { InventoryItem } from "@/types";
import { formatCurrency } from "@/utils/format";

export default function PricingPage() {
  return (
    <ModulePage<InventoryItem>
      title="AI Pricing Engine"
      description="Model market value, suggested liquidation price, demand score, sell-through time, and revenue forecast."
      createLabel="Run Pricing Model"
      data={inventoryRecords.slice(0, 250)}
      actions={[
        { label: "Market Value", value: "$84.2M" },
        { label: "AI Suggested Price", value: "$51.8M" },
        { label: "Demand Score", value: "87/100" },
        { label: "Predicted Sell Time", value: "18 days" }
      ]}
      charts={[
        { title: "Demand Trend", data: revenueTrend, key: "demand", kind: "line" },
        { title: "Market Trend", data: revenueTrend, key: "revenue" },
        { title: "Pricing Trend", data: revenueTrend, key: "price", kind: "bar" }
      ]}
      columns={[
        { key: "sku", header: "SKU" },
        { key: "productName", header: "Product" },
        { key: "marketValue", header: "Market Value", render: (row) => formatCurrency(row.marketValue) },
        { key: "liquidationValue", header: "AI Price", render: (row) => formatCurrency(row.liquidationValue) },
        { key: "age", header: "Sell Time", render: (row) => `${Math.max(6, Math.round(row.age / 7))} days` },
        { key: "status", header: "Score", render: () => <Badge>Active</Badge> }
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Liquidation Score" value="92%" delta="High confidence pricing" icon={BrainCircuit} tone="success" />
        <KpiCard label="Revenue Forecast" value="$24.9M" delta="Next 45 days" icon={TrendingUp} />
        <KpiCard label="Sell Time Delta" value="-11d" delta="Compared with manual pricing" icon={Timer} tone="warning" />
      </div>
    </ModulePage>
  );
}
