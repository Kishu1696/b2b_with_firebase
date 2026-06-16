import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = "Search records",
  pageSize = 8
}: {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(query);

  const filtered = useMemo(() => {
    if (!debounced) return data;
    return data.filter((row) => JSON.stringify(row).toLowerCase().includes(debounced.toLowerCase()));
  }, [data, debounced]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="glass-panel overflow-hidden rounded-lg">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="pl-9" placeholder={searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <span className="text-xs font-semibold text-muted">{filtered.length.toLocaleString()} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-background/40 text-xs uppercase text-muted">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={cn("px-4 py-3 font-bold", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-white/[0.03]">
                {columns.map((column) => (
                  <td key={String(column.key)} className={cn("px-4 py-4 text-sm text-slate-200", column.className)}>
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border p-4 text-sm text-muted">
        <button className="font-semibold disabled:opacity-40" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {pageCount}
        </span>
        <button
          className="font-semibold disabled:opacity-40"
          disabled={page === pageCount}
          onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
