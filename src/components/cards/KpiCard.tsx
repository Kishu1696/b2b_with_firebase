import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "secondary"
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone?: "secondary" | "success" | "warning" | "danger";
}) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">{label}</p>
            <p className="mt-3 text-2xl font-bold text-white">{value}</p>
            <p className="mt-2 text-xs text-slate-300">{delta}</p>
          </div>
          <span
            className={cn(
              "rounded-lg border p-3",
              tone === "success" && "border-success/30 bg-success/10 text-green-300",
              tone === "warning" && "border-warning/30 bg-warning/10 text-amber-300",
              tone === "danger" && "border-danger/30 bg-danger/10 text-red-300",
              tone === "secondary" && "border-secondary/30 bg-secondary/10 text-blue-200"
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
