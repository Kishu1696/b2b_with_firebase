import { BellRing, BrainCircuit, FileWarning, Truck } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const notifications = [
  { icon: BrainCircuit, title: "AI repricing recommendation", status: "Active", detail: "14 lots should be repriced before the West buyer window closes." },
  { icon: Truck, title: "Shipment delay", status: "Delayed", detail: "SHP-000128 is projected 18 hours late on Atlanta to Northeast route." },
  { icon: FileWarning, title: "Contract expiry alert", status: "Pending", detail: "Three contracts expire inside 30 days and need legal confirmation." },
  { icon: BellRing, title: "Auction closing", status: "Active", detail: "Consumer electronics auction closes in 2h 18m with 42 active bidders." }
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Notifications" description="Real-time alerts for AI recommendations, shipment changes, and contract risk." />
      <div className="space-y-3">
        {notifications.map((item) => (
          <Card key={item.title} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-12 w-12 place-items-center rounded-lg border border-secondary/30 bg-secondary/10 text-secondary">
              <item.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.detail}</p>
            </div>
            <Badge>{item.status}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
