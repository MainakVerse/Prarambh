export type StageStatus =
  | "not-started"
  | "active"
  | "blocked"
  | "done"
  | "signed-off";

export interface Stage {
  id: number;
  name: string;
  deliverable: string;
  status: StageStatus;
  /** Accountable role shown in the stage info bubble. */
  owner: string;
  /** What the gate checks before this stage can close. */
  gate: string;
}

export interface Phase {
  name: string;
  stages: Stage[];
}

export const statusMeta: Record<
  StageStatus,
  { label: string; dot: string; pill: string; description: string }
> = {
  "not-started": {
    label: "Not started",
    dot: "bg-ink-faint",
    pill: "bg-zinc-100 text-ink-body",
    description: "Queued behind an open gate. Work begins once the prior stage is signed off.",
  },
  active: {
    label: "Active",
    dot: "bg-amber-500",
    pill: "bg-amber-100 text-amber-900",
    description: "Work in progress. The deliverable is being drafted and reviewed in-tool.",
  },
  blocked: {
    label: "Blocked",
    dot: "bg-red-600",
    pill: "bg-red-100 text-red-900",
    description: "Gate check failed or approval is pending. The approver has been notified.",
  },
  done: {
    label: "Done",
    dot: "bg-green-600",
    pill: "bg-green-100 text-green-900",
    description: "Deliverable complete and gate criteria met — awaiting formal sign-off.",
  },
  "signed-off": {
    label: "Signed-off",
    dot: "bg-teal-600",
    pill: "bg-teal-100 text-teal-900",
    description: "Approved by the gate owner. The stage is closed and locked in the audit log.",
  },
};

/** Ribbon segment fill per status (decorative mockup; legend carries meaning). */
export const statusRibbon: Record<StageStatus, string> = {
  "not-started": "bg-zinc-200",
  active: "bg-amber-400",
  blocked: "bg-red-500",
  done: "bg-green-500",
  "signed-off": "bg-teal-500",
};

/**
 * The 13 stages of the Prarambh lifecycle, grouped into 5 phases.
 * Statuses here paint the marketing mockup as a believable in-flight project.
 */
export const phases: Phase[] = [
  {
    name: "Define",
    stages: [
      { id: 1, name: "Initiation", deliverable: "Project charter", status: "signed-off", owner: "Sponsor", gate: "Charter approved and budget code issued" },
      { id: 2, name: "Feasibility", deliverable: "Feasibility report", status: "signed-off", owner: "Business Analyst", gate: "Cost-benefit case cleared by steering committee" },
      { id: 3, name: "Requirements", deliverable: "BRD / FRS", status: "done", owner: "Business Analyst", gate: "All requirements traced and stakeholder-reviewed" },
    ],
  },
  {
    name: "Plan & Design",
    stages: [
      { id: 4, name: "Planning", deliverable: "Project plan & RAID log", status: "done", owner: "Project Manager", gate: "Baseline plan locked, risks logged with owners" },
      { id: 5, name: "Design", deliverable: "Solution design spec", status: "active", owner: "Solution Architect", gate: "Design review passed with no open majors" },
    ],
  },
  {
    name: "Build & Verify",
    stages: [
      { id: 6, name: "Development", deliverable: "Release notes", status: "active", owner: "Tech Lead", gate: "Feature-complete build with code review done" },
      { id: 7, name: "Testing", deliverable: "Test plan & UAT sign-off", status: "blocked", owner: "QA Lead", gate: "UAT sign-off — blocked on 2 open severity-1 defects" },
    ],
  },
  {
    name: "Release",
    stages: [
      { id: 8, name: "Deployment", deliverable: "Deployment runbook", status: "not-started", owner: "DevOps Lead", gate: "Runbook rehearsed and rollback path verified" },
      { id: 9, name: "Training", deliverable: "Training pack", status: "not-started", owner: "Change Manager", gate: "90% of end users trained and assessed" },
      { id: 10, name: "Go-Live", deliverable: "Go-live checklist", status: "not-started", owner: "Project Manager", gate: "Go / no-go call signed by all workstream leads" },
    ],
  },
  {
    name: "Run & Close",
    stages: [
      { id: 11, name: "Operations", deliverable: "Ops handover doc", status: "not-started", owner: "Ops Manager", gate: "Support team accepts handover with SLA agreed" },
      { id: 12, name: "Monitoring", deliverable: "KPI dashboard spec", status: "not-started", owner: "Product Owner", gate: "KPIs green for 30 consecutive days" },
      { id: 13, name: "Closure", deliverable: "Closure report", status: "not-started", owner: "Sponsor", gate: "Lessons learned filed, budget reconciled, project archived" },
    ],
  },
];

export const allStages: Stage[] = phases.flatMap((p) => p.stages);
