import { Badge } from "@/components/ui/Badge";
import { ModulePage } from "@/pages/ModulePage";
import { revenueTrend, shipments } from "@/data/mockData";
import type { Shipment } from "@/types";
import { formatCurrency } from "@/utils/format";

export default function LogisticsPage() {
  return (
    <ModulePage<Shipment>
      title="Logistics & Supply Chain"
      description="Track shipments, optimize routes, manage carriers, and monitor delivery performance."
      createLabel="Create Shipment"
      data={shipments}
      actions={[
        { label: "Active Shipments", value: "122" },
        { label: "Delayed Shipments", value: "9" },
        { label: "Delivered Orders", value: "348" },
        { label: "Pending Deliveries", value: "21" }
      ]}
      charts={[
        { title: "Delivery Analytics", data: revenueTrend, key: "score", kind: "line" },
        { title: "Route Optimization Savings", data: revenueTrend, key: "revenue" },
        { title: "Carrier Throughput", data: revenueTrend, key: "buyers", kind: "bar" }
      ]}
      columns={[
        { key: "id", header: "Shipment ID" },
        { key: "carrier", header: "Carrier" },
        { key: "origin", header: "Origin" },
        { key: "destination", header: "Destination" },
        { key: "eta", header: "ETA" },
        { key: "value", header: "Value", render: (row) => formatCurrency(row.value) },
        { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> }
      ]}
    />
  );
}
