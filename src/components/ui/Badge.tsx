import { cn } from "@/utils/cn";

const tones: Record<string, string> = {
  Active: "border-success/30 bg-success/10 text-green-300",
  Paid: "border-success/30 bg-success/10 text-green-300",
  Won: "border-success/30 bg-success/10 text-green-300",
  Delivered: "border-success/30 bg-success/10 text-green-300",
  Delayed: "border-danger/30 bg-danger/10 text-red-300",
  Failed: "border-danger/30 bg-danger/10 text-red-300",
  Lost: "border-danger/30 bg-danger/10 text-red-300",
  Pending: "border-warning/30 bg-warning/10 text-amber-300",
  Review: "border-warning/30 bg-warning/10 text-amber-300",
  default: "border-secondary/30 bg-secondary/10 text-blue-200"
};

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  const key = String(children);
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", tones[key] ?? tones.default, className)}>
      {children}
    </span>
  );
}
