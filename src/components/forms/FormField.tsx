import * as Label from "@radix-ui/react-label";

export function FormField({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label.Root className="text-sm font-semibold text-slate-200">{label}</Label.Root>
      {children}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
