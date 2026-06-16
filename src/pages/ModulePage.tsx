import { motion } from "framer-motion";
import { Download, Plus } from "lucide-react";
import { ChartCard } from "@/components/charts/ChartCard";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { FormField } from "@/components/forms/FormField";
import type { ChartPoint } from "@/types";
import { useState } from "react";

export interface ModuleAction {
  label: string;
  value: string;
}

export function ModulePage<T extends { id: string }>({
  title,
  description,
  actions,
  data,
  columns,
  charts,
  children,
  createLabel = "Create"
}: {
  title: string;
  description: string;
  actions: ModuleAction[];
  data: T[];
  columns: Column<T>[];
  charts: { title: string; data: ChartPoint[]; key?: keyof ChartPoint; kind?: "area" | "bar" | "line" }[];
  children?: React.ReactNode;
  createLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={title}
        description={description}
        action={
          <div className="flex gap-2">
            <Button variant="subtle">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              {createLabel}
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action, index) => (
          <motion.div key={action.label} whileHover={{ y: -3 }}>
            <Card>
              <p className="text-sm text-muted">{action.label}</p>
              <p className="mt-3 text-2xl font-bold">{action.value}</p>
              <p className="mt-2 text-xs text-slate-300">{index % 2 ? "AI monitored" : "Operationally ready"}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      {children}
      <div className="grid gap-4 xl:grid-cols-3">
        {charts.map((chart) => (
          <ChartCard key={chart.title} title={chart.title} data={chart.data} dataKey={chart.key ?? "revenue"} kind={chart.kind} />
        ))}
      </div>
      <DataTable data={data} columns={columns} searchPlaceholder={`Search ${title.toLowerCase()}`} />
      <Modal open={open} onOpenChange={setOpen} title={createLabel}>
        <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
          <FormField label="Name">
            <Input required placeholder="Enter record name" />
          </FormField>
          <FormField label="Owner">
            <Input required placeholder="Operations team" />
          </FormField>
          <FormField label="Notes">
            <Textarea placeholder="Add commercial context, risk notes, and AI instructions" />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="subtle" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setOpen(false)}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
