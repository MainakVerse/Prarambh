import Link from "next/link";
import { Icon } from "@/lib/icons";
import { allStages } from "@/lib/stages";
import { Reveal } from "@/components/ui/Reveal";
import { GateRibbon } from "@/components/dashboard/GateRibbon";
import { StatTile } from "@/components/dashboard/StatTile";
import {
  projects,
  healthMeta,
  upcomingGateReviews,
  stageActivity,
} from "@/lib/dashboard-data";

const recentActivity = Object.values(stageActivity).flat().slice(0, 5);
const blockedCount = allStages.filter((s) => s.status === "blocked").length;
const activeCount = allStages.filter((s) => s.status === "active").length;

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div>
          <h1 className="text-xl font-bold text-ink">Portfolio overview</h1>
          <p className="text-sm text-ink-muted">
            Stage-gate health across every active project.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Active projects" value={String(projects.length)} icon="folder" />
          <StatTile label="Stages in progress" value={String(activeCount)} icon="activity" tone="good" />
          <StatTile label="Blocked stages" value={String(blockedCount)} icon="warning" tone={blockedCount > 0 ? "warning" : "neutral"} />
          <StatTile label="Gate reviews due" value={String(upcomingGateReviews.length)} icon="calendar" />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="glass rounded-3xl p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Project pipelines</h2>
          <div className="flex flex-col gap-4">
            {projects.map((p) => {
              const health = healthMeta[p.health];
              const HealthIcon = Icon[health.icon];
              return (
                <Link
                  key={p.id}
                  href="/dashboard/project/testing"
                  className="rounded-2xl p-3 transition-colors hover:bg-white/70"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-ink">{p.name}</span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${health.className}`}>
                      <HealthIcon className="h-3 w-3" />
                      {health.label}
                    </span>
                  </div>
                  <GateRibbon currentStageId={p.currentStageId} />
                </Link>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal delay={0.15}>
          <div className="glass rounded-3xl p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Upcoming gate reviews</h2>
            <ul className="flex flex-col gap-3">
              {upcomingGateReviews.map((g) => (
                <li key={g.id} className="flex items-center gap-3 rounded-2xl bg-white/50 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-600">
                    <Icon.calendar className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{g.project}</p>
                    <p className="text-xs text-ink-muted">{g.stage}</p>
                  </div>
                  <span className="tnum shrink-0 text-xs font-medium text-ink-muted">{g.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass rounded-3xl p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Recent activity</h2>
            <ul className="flex flex-col gap-3">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-600">
                    <Icon.activity className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-ink-body">
                    <span className="font-medium text-ink">{a.actor}</span> {a.action}{" "}
                    <span className="font-medium text-ink">{a.target}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
