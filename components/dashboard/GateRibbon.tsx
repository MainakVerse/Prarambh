import { allStages, statusRibbon } from "@/lib/stages";
import { cn } from "@/lib/cn";

/** Compact 13-segment stage-gate pipeline ribbon. Decorative — legend/labels carry the meaning elsewhere. */
export function GateRibbon({ currentStageId }: { currentStageId: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Currently at stage ${currentStageId} of 13`}>
      {allStages.map((s) => (
        <span
          key={s.id}
          className={cn(
            "h-1.5 flex-1 rounded-full",
            s.id <= currentStageId ? statusRibbon[s.status] : "bg-zinc-200"
          )}
        />
      ))}
    </div>
  );
}
