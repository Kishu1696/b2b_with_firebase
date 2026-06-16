import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FileUpload } from "@/components/forms/FileUpload";
import { ModulePage } from "@/pages/ModulePage";
import { inventoryRecords, revenueTrend } from "@/data/mockData";
import type { InventoryItem } from "@/types";
import { formatCurrency } from "@/utils/format";

export default function InventoryPage() {
  return (
    <ModulePage<InventoryItem>
      title="Inventory Management"
      description="List, inspect, add, edit, delete, bulk upload, and segment liquidation inventory across warehouses and regions."
      createLabel="Add Inventory"
      data={inventoryRecords}
      actions={[
        { label: "Listed Units", value: "812K" },
        { label: "Warehouses", value: "5" },
        { label: "Aged Lots", value: "246" },
        { label: "Liquidation Value", value: "$48.6M" }
      ]}
      charts={[
        { title: "Inventory Aging", data: revenueTrend, key: "inventory", kind: "bar" },
        { title: "Market Value Trend", data: revenueTrend, key: "revenue" },
        { title: "Liquidation Conversion", data: revenueTrend, key: "score", kind: "line" }
      ]}
      columns={[
        { key: "sku", header: "SKU" },
        { key: "productName", header: "Product" },
        { key: "category", header: "Category" },
        { key: "quantity", header: "Qty" },
        { key: "warehouse", header: "Warehouse" },
        { key: "age", header: "Age", render: (row) => `${row.age}d` },
        { key: "marketValue", header: "Market Value", render: (row) => formatCurrency(row.marketValue) },
        { key: "liquidationValue", header: "Liquidation", render: (row) => formatCurrency(row.liquidationValue) },
        { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> }
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h3 className="mb-4 text-base font-bold">Bulk Upload</h3>
          <FileUpload />
        </Card>
        <Card>
          <h3 className="text-base font-bold">Filters</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {["Category", "Warehouse", "Region", "Status"].map((filter) => (
              <select key={filter} className="input-shell">
                <option>{filter}</option>
              </select>
            ))}
          </div>
        </Card>
      </div>
    </ModulePage>
  );
}
