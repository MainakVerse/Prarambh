import { Icon } from "@/lib/icons";
import type { Document } from "@/lib/dashboard-data";
import { cn } from "@/lib/cn";

const docStatusMeta: Record<Document["status"], { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-zinc-100 text-ink-body" },
  "in-review": { label: "In review", className: "bg-amber-100 text-amber-900" },
  final: { label: "Final", className: "bg-green-100 text-green-900" },
};

export function DocumentCard({ doc }: { doc: Document }) {
  const meta = docStatusMeta[doc.status];
  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-600"
        >
          <Icon.clipboard className="h-4 w-4" />
        </span>
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", meta.className)}>
          {meta.label}
        </span>
      </div>
      <div>
        <p className="truncate text-sm font-semibold text-ink">{doc.name}</p>
        <p className="text-xs text-ink-muted">
          {doc.kind} · Updated {doc.updatedAt}
        </p>
      </div>
      <div className="mt-auto flex gap-2 pt-1">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-medium text-ink shadow-neo-xs hover:shadow-neo-sm active:shadow-neo-inset-sm"
        >
          <Icon.download className="h-3.5 w-3.5" />
          Download
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-medium text-ink shadow-neo-xs hover:shadow-neo-sm active:shadow-neo-inset-sm"
        >
          <Icon.refresh className="h-3.5 w-3.5" />
          Regenerate
        </button>
      </div>
    </div>
  );
}
