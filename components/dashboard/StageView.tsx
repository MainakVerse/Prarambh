"use client";

import { useState, useEffect } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { StatusPill } from "@/components/ui/StatusPill";
import { StatTile } from "@/components/dashboard/StatTile";
import { DocumentCard } from "@/components/dashboard/DocumentCard";
import { GateCriteriaPanel } from "@/components/dashboard/GateCriteriaPanel";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { InsightsRail } from "@/components/dashboard/InsightsRail";
import {
  StageEmptyState,
  StageLoadingState,
  StageBlockedState,
  StagePermissionPartialState,
} from "@/components/dashboard/StageStates";
import type { Stage } from "@/lib/stages";
import { stageDocuments, stageActivity, stageBlockers } from "@/lib/dashboard-data";

/** Reusable workspace every one of the 13 stage tabs renders. Reads live status from `lib/stages`. */
export function StageView({
  stage,
  /** Demo-only: forces the read-only "viewer" permission state to showcase it. */
  viewerRole = false,
}: {
  stage: Stage;
  viewerRole?: boolean;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [stage.id]);

  const docs = stageDocuments[stage.slug] ?? [];
  const activity = stageActivity[stage.slug] ?? [];
  const blockers = stageBlockers[stage.slug];

  if (loading) {
    return <StageLoadingState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="glass-strong flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white shadow-neo-xs">
              {stage.id}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-ink">{stage.name}</h1>
                <StatusPill status={stage.status} />
              </div>
              <p className="text-xs text-ink-muted">
                Exit criteria: {stage.exitCriteria}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:flex-col sm:items-end">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent-400 to-primary-500 text-xs font-bold text-white">
              {stage.owner.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-xs text-ink-muted">{stage.owner}</span>
          </div>
        </div>
      </Reveal>

      {stage.status === "blocked" && blockers && (
        <Reveal delay={0.05}>
          <StageBlockedState blockers={blockers} />
        </Reveal>
      )}

      {stage.status === "not-started" ? (
        <Reveal delay={0.05}>
          <StageEmptyState stage={stage} />
        </Reveal>
      ) : (
        <>
          <Reveal delay={0.05}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile
                label="Progress"
                value={stage.status === "signed-off" || stage.status === "done" ? "100%" : stage.status === "active" ? "60%" : "0%"}
                icon="activity"
                tone="good"
              />
              <StatTile
                label="Open items"
                value={String(stage.openItems)}
                icon="checkSquare"
                tone={stage.openItems > 0 ? "warning" : "neutral"}
              />
              <StatTile label="Days in stage" value={String(stage.daysInStage)} icon="clock" />
              <StatTile
                label="Sign-off"
                value={stage.status === "signed-off" ? "Approved" : "Pending"}
                icon="lock"
                tone={stage.status === "signed-off" ? "good" : "neutral"}
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <h2 className="mb-3 text-sm font-semibold text-ink">Deliverables</h2>
              {viewerRole ? (
                <StagePermissionPartialState />
              ) : docs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {docs.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              ) : (
                <div className="glass rounded-2xl p-5 text-sm text-ink-muted">
                  No deliverables generated yet for this stage.
                </div>
              )}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-6">
              <Reveal delay={0.15}>
                <GateCriteriaPanel stage={stage} />
              </Reveal>
              <Reveal delay={0.2}>
                <ActivityTimeline items={activity} />
              </Reveal>
            </div>
            <Reveal delay={0.15} className="lg:order-last">
              <InsightsRail stage={stage} />
            </Reveal>
          </div>
        </>
      )}
    </div>
  );
}
