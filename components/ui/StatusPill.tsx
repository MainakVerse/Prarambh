import { statusMeta, type StageStatus } from "@/lib/stages";
import { cn } from "@/lib/cn";

/** Status is never conveyed by color alone: every pill carries a dot + label. */
export function StatusPill({ status }: { status: StageStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        meta.pill
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
