import type { IconKey } from "@/lib/icons";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/cn";

/** Neomorphic extruded KPI tile used in the stat row of every stage view. */
export function StatTile({
  label,
  value,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  icon: IconKey;
  tone?: "neutral" | "warning" | "good";
}) {
  const TileIcon = Icon[icon];
  return (
    <div className="neo flex items-center gap-3 rounded-2xl px-4 py-3.5">
      <span
        aria-hidden
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
          tone === "warning" && "bg-amber-100 text-amber-700",
          tone === "good" && "bg-green-100 text-green-700",
          tone === "neutral" && "bg-primary-100 text-primary-600"
        )}
      >
        <TileIcon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="tnum block text-lg font-bold leading-tight text-ink">{value}</span>
        <span className="block truncate text-xs text-ink-muted">{label}</span>
      </span>
    </div>
  );
}
