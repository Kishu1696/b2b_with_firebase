import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";

const reports = ["Revenue Reports", "Inventory Reports", "Buyer Reports", "Auction Reports"];
const exports = ["PDF", "Excel", "CSV"];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Reports Center" description="Generate board-ready liquidation reports and export operational datasets." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((report) => (
          <Card key={report}>
            <FileSpreadsheet className="h-8 w-8 text-secondary" />
            <h3 className="mt-4 text-lg font-bold">{report}</h3>
            <p className="mt-2 text-sm text-muted">Scheduled delivery, filters, audit metadata, and AI narrative summary.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {exports.map((type) => (
                <Button key={type} variant="subtle" size="sm">
                  <Download className="h-4 w-4" />
                  {type}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
