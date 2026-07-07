import { Icon } from "@/lib/icons";
import type { Stage } from "@/lib/stages";

export function InsightsRail({ stage }: { stage: Stage }) {
  return (
    <aside className="flex flex-col gap-4">
      <div className="glass rounded-3xl p-5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Icon.sparkles className="h-4 w-4 text-primary-500" />
          AI insight
        </h3>
        <p className="mt-2 text-sm text-ink-body">
          {stage.status === "blocked"
            ? `This stage has been blocked for ${stage.daysInStage} days — longer than the team average of 3 days. Consider escalating to the gate owner.`
            : stage.status === "active"
              ? `At the current pace, ${stage.name} is on track to close in ~${Math.max(1, 6 - stage.daysInStage)} more days.`
              : `No anomalies detected for ${stage.name}.`}
        </p>
      </div>

      <div className="glass rounded-3xl p-5">
        <h3 className="text-sm font-semibold text-ink">Owner</h3>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent-400 to-primary-500 text-xs font-bold text-white">
            {stage.owner.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{stage.owner}</p>
            <p className="text-xs text-ink-muted">Accountable role</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <h3 className="text-sm font-semibold text-ink">Related stages</h3>
        <p className="mt-2 text-xs text-ink-muted">
          Deliverable: <span className="font-medium text-ink-body">{stage.deliverable}</span>
        </p>
      </div>
    </aside>
  );
}
