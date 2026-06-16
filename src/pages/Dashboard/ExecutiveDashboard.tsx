import { Activity, Banknote, Boxes, FileCheck2, Gavel, Handshake, ShipWheel, TrendingUp } from "lucide-react";
import { KpiCard } from "@/components/cards/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Card, SectionHeader } from "@/components/ui/Card";
import { aiInsights, buyers, inventoryRecords, revenueTrend, transactions } from "@/data/mockData";
import type { Buyer, InventoryItem, Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Executive Dashboard"
        description="A command view of liquidation value, buyer demand, auctions, contracts, and AI revenue opportunities."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Inventory Value" value="$84.2M" delta="+12.4% vs prior month" icon={Boxes} />
        <KpiCard label="Active Auctions" value="68" delta="21 closing inside 24h" icon={Gavel} tone="warning" />
        <KpiCard label="Revenue Generated" value="$18.7M" delta="+$2.1M AI-attributed lift" icon={Banknote} tone="success" />
        <KpiCard label="Active Buyers" value="426" delta="74 enterprise buyers engaged" icon={Handshake} />
        <KpiCard label="Pending Contracts" value="19" delta="$7.3M pending signatures" icon={FileCheck2} tone="warning" />
        <KpiCard label="Active Shipments" value="122" delta="96% on-time performance" icon={ShipWheel} tone="success" />
        <KpiCard label="AI Insights" value="34" delta="9 urgent recommendations" icon={Activity} tone="danger" />
        <KpiCard label="Forecasted Revenue" value="$24.9M" delta="Next 45-day liquidation outlook" icon={TrendingUp} />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Revenue Trend" data={revenueTrend} />
        </div>
        <Card>
          <h3 className="text-base font-bold">AI Insights</h3>
          <div className="mt-4 space-y-3">
            {aiInsights.map((insight) => (
              <div key={insight} className="rounded-md border border-border bg-background/50 p-3 text-sm leading-6 text-slate-200">
                {insight}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Monthly Sales" data={revenueTrend} dataKey="buyers" kind="bar" />
        <ChartCard title="Inventory Aging" data={revenueTrend} dataKey="inventory" kind="line" />
        <ChartCard title="Liquidation Performance" data={revenueTrend} dataKey="score" />
      </div>
      <div className="grid gap-5 2xl:grid-cols-3">
        <DataTable<Transaction>
          data={transactions.slice(0, 80)}
          searchPlaceholder="Search recent transactions"
          columns={[
            { key: "id", header: "Transaction" },
            { key: "buyer", header: "Buyer" },
            { key: "value", header: "Value", render: (row) => formatCurrency(row.value) },
            { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> }
          ]}
        />
        <DataTable<InventoryItem>
          data={inventoryRecords.slice(0, 80)}
          searchPlaceholder="Search latest inventory"
          columns={[
            { key: "sku", header: "SKU" },
            { key: "productName", header: "Product" },
            { key: "quantity", header: "Qty" },
            { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> }
          ]}
        />
        <DataTable<Buyer>
          data={buyers.slice(0, 80)}
          searchPlaceholder="Search buyer activity"
          columns={[
            { key: "company", header: "Buyer" },
            { key: "stage", header: "Stage", render: (row) => <Badge>{row.stage}</Badge> },
            { key: "lifetimeValue", header: "LTV", render: (row) => formatCurrency(row.lifetimeValue) }
          ]}
        />
      </div>
    </div>
  );
}
