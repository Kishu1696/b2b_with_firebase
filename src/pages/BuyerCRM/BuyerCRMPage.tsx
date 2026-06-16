import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ModulePage } from "@/pages/ModulePage";
import { buyers, revenueTrend } from "@/data/mockData";
import type { Buyer } from "@/types";
import { formatCurrency } from "@/utils/format";

const stages = ["New Lead", "Contacted", "Qualified", "Negotiation", "Won", "Lost"];

export default function BuyerCRMPage() {
  return (
    <ModulePage<Buyer>
      title="Buyer CRM"
      description="Manage buyer directory, relationship context, activity, notes, communication history, and opportunity pipeline."
      createLabel="Add Buyer"
      data={buyers}
      actions={[
        { label: "Active Buyers", value: "426" },
        { label: "Open Opportunities", value: "132" },
        { label: "Pipeline Value", value: "$31.4M" },
        { label: "Avg Close Rate", value: "38%" }
      ]}
      charts={[
        { title: "Buyer Activity", data: revenueTrend, key: "buyers", kind: "bar" },
        { title: "Opportunity Value", data: revenueTrend, key: "revenue" },
        { title: "Sentiment Trend", data: revenueTrend, key: "score", kind: "line" }
      ]}
      columns={[
        { key: "company", header: "Company" },
        { key: "contact", header: "Contact" },
        { key: "segment", header: "Segment" },
        { key: "region", header: "Region" },
        { key: "lifetimeValue", header: "LTV", render: (row) => formatCurrency(row.lifetimeValue) },
        { key: "stage", header: "Stage", render: (row) => <Badge>{row.stage}</Badge> },
        { key: "sentiment", header: "Sentiment", render: (row) => <Badge>{row.sentiment}</Badge> }
      ]}
    >
      <div className="grid gap-3 lg:grid-cols-6">
        {stages.map((stage) => (
          <Card key={stage} className="min-h-44">
            <p className="text-sm font-bold">{stage}</p>
            <div className="mt-3 space-y-2">
              {buyers.filter((buyer) => buyer.stage === stage).slice(0, 3).map((buyer) => (
                <div key={buyer.id} className="rounded-md border border-border bg-background/50 p-2 text-xs text-slate-200">
                  {buyer.company}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ModulePage>
  );
}
