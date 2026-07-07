"use client";

import Link from "next/link";
import { Icon } from "@/lib/icons";
import { statusMeta, type Stage } from "@/lib/stages";
import { cn } from "@/lib/cn";

/** One of the 13 lifecycle stages in the sidebar list. Renders as an ARIA treeitem. */
export function StageTab({
  stage,
  active,
  onNavigate,
}: {
  stage: Stage;
  active: boolean;
  onNavigate?: () => void;
}) {
  const StageIcon = Icon[stage.icon];
  const meta = statusMeta[stage.status];

  return (
    <Link
      href={`/dashboard/project/${stage.slug}`}
      role="treeitem"
      aria-current={active ? "page" : undefined}
      aria-label={`${stage.name}, ${meta.label}`}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-xl py-2 pl-4 pr-2.5 text-sm transition-all duration-150",
        active
          ? "bg-cream-100 font-semibold text-ink shadow-neo-inset-sm"
          : "text-ink-body hover:bg-white/70 hover:text-ink"
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-gradient-to-b from-primary-400 to-primary-600"
        />
      )}
      <StageIcon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-primary-600" : "text-ink-faint group-hover:text-ink-soft"
        )}
      />
      <span className="flex-1 truncate">{stage.name}</span>
      <span
        aria-hidden
        title={meta.label}
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full",
          meta.pill
        )}
      >
        {stage.status === "blocked" && <Icon.warning className="h-3 w-3" />}
        {stage.status === "done" && <Icon.checkCircle className="h-3 w-3" />}
        {stage.status === "signed-off" && <Icon.lock className="h-3 w-3" />}
        {(stage.status === "active" || stage.status === "not-started") && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              meta.dot,
              stage.status === "active" && "animate-pulse"
            )}
          />
        )}
      </span>
      <span className="sr-only">{meta.label}</span>
    </Link>
  );
}
