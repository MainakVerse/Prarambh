"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { allStages } from "@/lib/stages";
import { Reveal } from "@/components/ui/Reveal";
import { GateRibbon } from "@/components/dashboard/GateRibbon";
import { projects, healthMeta, type ProjectSummary } from "@/lib/dashboard-data";
import { cn } from "@/lib/cn";

type HealthFilter = "all" | ProjectSummary["health"];
type SortKey = "recent" | "name" | "progress";

function ProjectCard({ project }: { project: ProjectSummary }) {
  const health = healthMeta[project.health];
  const HealthIcon = Icon[health.icon];
  const progress = Math.round((project.currentStageId / allStages.length) * 100);

  return (
    <a
      href={`/dashboard/project/${allStages[project.currentStageId - 1]?.slug ?? "initiation"}`}
      className="glass flex flex-col gap-3 rounded-3xl p-5 transition-transform hover:-translate-y-0.5 hover:shadow-glass-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{project.name}</p>
          <p className="truncate text-xs text-ink-muted">{project.client}</p>
        </div>
        <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", health.className)}>
          <HealthIcon className="h-3 w-3" />
          {health.label}
        </span>
      </div>
      <GateRibbon currentStageId={project.currentStageId} />
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span className="tnum">{progress}% through lifecycle</span>
        <span>Updated {project.updatedAt}</span>
      </div>
    </a>
  );
}

export default function ProjectsPage() {
  const [health, setHealth] = useState<HealthFilter>("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    let list = health === "all" ? projects : projects.filter((p) => p.health === health);
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "progress") return b.currentStageId - a.currentStageId;
      return a.updatedAt < b.updatedAt ? 1 : -1;
    });
    return list;
  }, [health, sort]);

  const filters: HealthFilter[] = ["all", "on-track", "at-risk", "blocked"];

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-ink">Saved Projects</h1>
            <p className="text-sm text-ink-muted">Every project you&apos;re tracking, in one gallery.</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-primary-400 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow-primary hover:from-primary-500 hover:to-primary-600"
          >
            <Icon.plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-2xl bg-cream-100 p-1 shadow-neo-inset-sm">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setHealth(f)}
                aria-pressed={health === f}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  health === f ? "bg-white text-ink shadow-neo-xs" : "text-ink-muted hover:text-ink-soft"
                )}
              >
                {f === "all" ? "All" : healthMeta[f].label}
              </button>
            ))}
          </div>

          <label className="ml-auto flex items-center gap-2 text-xs text-ink-muted">
            <Icon.filter className="h-3.5 w-3.5" />
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-white/70 bg-white/60 px-2 py-1 text-xs text-ink shadow-neo-inset-sm"
            >
              <option value="recent">Recently updated</option>
              <option value="name">Name</option>
              <option value="progress">Progress</option>
            </select>
          </label>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-10 text-center text-sm text-ink-muted">
            No projects match this filter.
          </div>
        )}
      </Reveal>
    </div>
  );
}
