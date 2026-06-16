import { SendHorizontal } from "lucide-react";
import { KpiCard } from "@/components/cards/KpiCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ChartCard } from "@/components/charts/ChartCard";
import { DataTable } from "@/components/tables/DataTable";
import { buyers, revenueTrend, transactions } from "@/data/mockData";
import { BrainCircuit, Gauge, ShieldAlert, WalletCards } from "lucide-react";
import type { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";

export default function NegotiationPage() {
  const messages = [
    ["buyer", "We can move 14 truckloads if you can improve the blended unit cost."],
    ["ai", "Recommend counter at $428K with freight credit capped at 2.5%. Closing probability rises to 74%."],
    ["operator", "Counter sent with payment due inside 48 hours and partial shipment release."]
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="AI Negotiation Center" description="Chat-guided counter offers, buyer sentiment, risk scoring, and close probability intelligence." />
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Suggested Price" value="$428K" delta="Counter offer ceiling" icon={WalletCards} />
        <KpiCard label="Risk Score" value="21%" delta="Low default exposure" icon={ShieldAlert} tone="success" />
        <KpiCard label="Expected Revenue" value="$1.8M" delta="Open negotiations" icon={BrainCircuit} />
        <KpiCard label="Confidence Score" value="86%" delta="Based on buyer history" icon={Gauge} tone="warning" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="min-h-[520px]">
          <h3 className="text-base font-bold">Negotiation Workspace</h3>
          <div className="mt-5 space-y-4">
            {messages.map(([role, text]) => (
              <div key={text} className={role === "buyer" ? "mr-16 rounded-lg bg-white/10 p-4" : "ml-16 rounded-lg bg-secondary/20 p-4"}>
                <p className="mb-1 text-xs font-bold uppercase text-muted">{role}</p>
                <p className="text-sm leading-6 text-slate-100">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <Input placeholder="Ask AI for a counter offer, risk read, or clause suggestion" />
            <Button size="icon" aria-label="Send">
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </Card>
        <div className="space-y-4">
          <ChartCard title="Closing Probability" data={revenueTrend} dataKey="score" kind="line" />
          <Card>
            <h3 className="text-base font-bold">AI Recommendations</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <p>Anchor on landed cost savings, not unit discount.</p>
              <p>Offer staged release after escrow clears.</p>
              <p>Buyer sentiment is positive but price sensitive.</p>
            </div>
          </Card>
        </div>
      </div>
      <DataTable<Transaction>
        data={transactions.slice(0, 80)}
        columns={[
          { key: "buyer", header: "Buyer" },
          { key: "sku", header: "SKU" },
          { key: "value", header: "Expected Revenue", render: (row) => formatCurrency(row.value) },
          { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> }
        ]}
      />
    </div>
  );
}
