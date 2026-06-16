import { ChartCard } from "@/components/charts/ChartCard";
import { Card, SectionHeader } from "@/components/ui/Card";
import { regionPerformance, revenueTrend } from "@/data/mockData";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics Center" description="Advanced revenue, demand, buyer, region, warehouse, and inventory forecasting." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Revenue Forecast" data={revenueTrend} />
        <ChartCard title="Demand Forecast" data={revenueTrend} dataKey="demand" kind="line" />
        <ChartCard title="Sales Analytics" data={revenueTrend} dataKey="buyers" kind="bar" />
        <ChartCard title="Buyer Analytics" data={revenueTrend} dataKey="score" />
        <ChartCard title="Region Analytics" data={regionPerformance} dataKey="revenue" kind="bar" />
        <ChartCard title="Inventory Forecast" data={revenueTrend} dataKey="inventory" kind="line" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {["Region Performance", "Warehouse Activity"].map((title) => (
          <Card key={title}>
            <h3 className="mb-5 text-base font-bold">{title}</h3>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 35 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-md border border-border"
                  style={{ background: `rgba(59, 130, 246, ${0.12 + (index % 9) / 12})` }}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
