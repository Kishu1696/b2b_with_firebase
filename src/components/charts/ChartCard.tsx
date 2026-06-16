import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { ChartPoint } from "@/types";

type ChartKind = "area" | "bar" | "line";

export function ChartCard({
  title,
  data,
  dataKey = "revenue",
  kind = "area"
}: {
  title: string;
  data: ChartPoint[];
  dataKey?: keyof ChartPoint;
  kind?: ChartKind;
}) {
  const chartProps = { data, margin: { top: 10, right: 8, left: -18, bottom: 0 } };
  const axis = (
    <>
      <CartesianGrid stroke="#27324B" strokeDasharray="4 4" vertical={false} />
      <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} fontSize={12} />
      <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} fontSize={12} />
      <Tooltip
        contentStyle={{ background: "#121A2D", border: "1px solid #27324B", borderRadius: 8, color: "#fff" }}
        cursor={{ fill: "rgba(59,130,246,0.08)" }}
      />
    </>
  );

  return (
    <Card className="min-h-80">
      <h3 className="mb-5 text-base font-bold text-white">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {kind === "bar" ? (
            <BarChart {...chartProps}>
              {axis}
              <Bar dataKey={dataKey as string} fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : kind === "line" ? (
            <LineChart {...chartProps}>
              {axis}
              <Line type="monotone" dataKey={dataKey as string} stroke="#22C55E" strokeWidth={3} dot={false} />
            </LineChart>
          ) : (
            <AreaChart {...chartProps}>
              {axis}
              <defs>
                <linearGradient id={`${String(dataKey)}Gradient`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={dataKey as string}
                stroke="#3B82F6"
                strokeWidth={3}
                fill={`url(#${String(dataKey)}Gradient)`}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
