import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ModulePage } from "@/pages/ModulePage";
import { auctions, revenueTrend } from "@/data/mockData";
import type { Auction } from "@/types";
import { formatCurrency } from "@/utils/format";

export default function AuctionsPage() {
  return (
    <ModulePage<Auction>
      title="Auction Marketplace"
      description="Create, manage, analyze, and close liquidation auctions with live bid intelligence."
      createLabel="Create Auction"
      data={auctions}
      actions={[
        { label: "Active Auctions", value: "68" },
        { label: "Closed Auctions", value: "32" },
        { label: "Total Bidders", value: "1,842" },
        { label: "Bid Lift", value: "+16.8%" }
      ]}
      charts={[
        { title: "Auction Analytics", data: revenueTrend, key: "revenue" },
        { title: "Buyer Activity", data: revenueTrend, key: "buyers", kind: "bar" },
        { title: "Liquidation Performance", data: revenueTrend, key: "score", kind: "line" }
      ]}
      columns={[
        { key: "title", header: "Auction" },
        { key: "category", header: "Category" },
        { key: "currentBid", header: "Current Bid", render: (row) => formatCurrency(row.currentBid) },
        { key: "startingPrice", header: "Starting", render: (row) => formatCurrency(row.startingPrice) },
        { key: "timeRemaining", header: "Remaining" },
        { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> }
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {auctions.slice(0, 4).map((auction) => (
          <Card key={auction.id} className="overflow-hidden p-0">
            <img src={auction.image} alt="" className="h-36 w-full object-cover" />
            <div className="p-4">
              <p className="font-bold">{auction.title}</p>
              <p className="mt-2 text-sm text-muted">{formatCurrency(auction.currentBid)} current bid</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                <span>{auction.bidders} bidders</span>
                <Badge>{auction.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ModulePage>
  );
}
