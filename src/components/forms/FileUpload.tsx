import { UploadCloud } from "lucide-react";

export function FileUpload() {
  return (
    <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/60 px-6 text-center transition hover:border-secondary">
      <UploadCloud className="mb-3 h-8 w-8 text-secondary" />
      <span className="text-sm font-semibold text-white">Drop CSV, XLSX, or ERP export files</span>
      <span className="mt-1 text-xs text-muted">Bulk validation, SKU mapping, and duplicate detection included</span>
      <input type="file" className="hidden" multiple />
    </label>
  );
}
