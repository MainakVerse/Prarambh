import { statusMeta, type StageStatus } from "@/lib/stages";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/cn";

const statusGlyph: Record<StageStatus, keyof typeof Icon | null> = {
  "not-started": null,
  active: null,
  blocked: "warning",
  done: "checkCircle",
  "signed-off": "lock",
};

/** Status is never conveyed by color alone: every pill carries an icon/dot + label. */
export function StatusPill({
  status,
  size = "md",
}: {
  status: StageStatus;
  /** "sm" is used inline in dense sidebar/tree rows. */
  size?: "sm" | "md";
}) {
  const meta = statusMeta[status];
  const glyph = statusGlyph[status];
  const GlyphIcon = glyph ? Icon[glyph] : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs",
        meta.pill
      )}
    >
      {GlyphIcon ? (
        <GlyphIcon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      ) : (
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            meta.dot,
            status === "active" && "animate-pulse"
          )}
        />
      )}
      {meta.label}
    </span>
  );
}
