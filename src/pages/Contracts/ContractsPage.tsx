import { Badge } from "@/components/ui/Badge";
import { ModulePage } from "@/pages/ModulePage";
import { contracts, revenueTrend } from "@/data/mockData";
import type { Contract } from "@/types";
import { formatCurrency } from "@/utils/format";

export default function ContractsPage() {
  return (
    <ModulePage<Contract>
      title="Contracts & Compliance"
      description="Manage contracts, compliance controls, legal alerts, document storage, and risk assessments."
      createLabel="New Contract"
      data={contracts}
      actions={[
        { label: "Expiring Contracts", value: "11" },
        { label: "Compliance Score", value: "94%" },
        { label: "Legal Alerts", value: "7" },
        { label: "Contract Value", value: "$64.1M" }
      ]}
      charts={[
        { title: "Contract Value", data: revenueTrend, key: "revenue" },
        { title: "Compliance Tracking", data: revenueTrend, key: "score", kind: "line" },
        { title: "Risk Assessment", data: revenueTrend, key: "demand", kind: "bar" }
      ]}
      columns={[
        { key: "id", header: "Contract ID" },
        { key: "buyer", header: "Buyer" },
        { key: "value", header: "Value", render: (row) => formatCurrency(row.value) },
        { key: "expiryDate", header: "Expiry Date" },
        { key: "risk", header: "Risk", render: (row) => <Badge>{row.risk}</Badge> },
        { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> }
      ]}
    />
  );
}
