import type { IconKey } from "@/lib/icons";

export type StageStatus =
  | "not-started"
  | "active"
  | "blocked"
  | "done"
  | "signed-off";

export interface Stage {
  id: number;
  /** URL-safe slug used for the /project/[stage] route. */
  slug: string;
  name: string;
  deliverable: string;
  status: StageStatus;
  /** Accountable role shown in the stage info bubble. */
  owner: string;
  /** What the gate checks before this stage can close. */
  gate: string;
  icon: IconKey;
  /** Short blurb for the "not started" teaching empty state. */
  purpose: string;
  entryCriteria: string;
  exitCriteria: string;
  daysInStage: number;
  openItems: number;
}

export interface Phase {
  name: string;
  icon: IconKey;
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
    icon: "compass",
    stages: [
      { id: 1, slug: "initiation", name: "Initiation", deliverable: "Project charter", status: "signed-off", owner: "Sponsor", gate: "Charter approved and budget code issued", icon: "flag", purpose: "Formally kicks off the project: names the sponsor, sets objectives, and issues the budget code that unlocks spend.", entryCriteria: "Business need identified and sponsor assigned", exitCriteria: "Charter signed and budget code issued", daysInStage: 4, openItems: 0 },
      { id: 2, slug: "feasibility", name: "Feasibility Study", deliverable: "Feasibility report", status: "signed-off", owner: "Business Analyst", gate: "Cost-benefit case cleared by steering committee", icon: "scale", purpose: "Tests whether the project is viable — cost, benefit, risk, and alternatives — before deeper investment.", entryCriteria: "Charter signed off", exitCriteria: "Steering committee clears the cost-benefit case", daysInStage: 6, openItems: 0 },
      { id: 3, slug: "requirements", name: "Requirements Gathering & Analysis", deliverable: "BRD / FRS", status: "done", owner: "Business Analyst", gate: "All requirements traced and stakeholder-reviewed", icon: "clipboard", purpose: "Captures what the solution must do — business and functional requirements traced to stakeholder needs.", entryCriteria: "Feasibility case approved", exitCriteria: "All requirements traced and reviewed by stakeholders", daysInStage: 9, openItems: 1 },
    ],
  },
  {
    name: "Plan & Design",
    icon: "calendar",
    stages: [
      { id: 4, slug: "planning", name: "Planning", deliverable: "Project plan & RAID log", status: "done", owner: "Project Manager", gate: "Baseline plan locked, risks logged with owners", icon: "calendar", purpose: "Builds the baseline schedule, resourcing, and RAID log the rest of the project executes against.", entryCriteria: "Requirements signed off", exitCriteria: "Baseline plan locked, risks logged with owners", daysInStage: 7, openItems: 0 },
      { id: 5, slug: "design", name: "Design", deliverable: "Solution design spec", status: "active", owner: "Solution Architect", gate: "Design review passed with no open majors", icon: "compass", purpose: "Translates requirements into a solution architecture and detailed design ready for build.", entryCriteria: "Plan baselined", exitCriteria: "Design review passed with zero open major findings", daysInStage: 5, openItems: 3 },
    ],
  },
  {
    name: "Build & Verify",
    icon: "code",
    stages: [
      { id: 6, slug: "development", name: "Development / Implementation", deliverable: "Release notes", status: "active", owner: "Tech Lead", gate: "Feature-complete build with code review done", icon: "code", purpose: "Implements the design into working software with continuous code review.", entryCriteria: "Design signed off", exitCriteria: "Feature-complete build, all code reviewed", daysInStage: 12, openItems: 5 },
      { id: 7, slug: "testing", name: "Testing / Quality Assurance", deliverable: "Test plan & UAT sign-off", status: "blocked", owner: "QA Lead", gate: "UAT sign-off — blocked on 2 open severity-1 defects", icon: "checkSquare", purpose: "Verifies the build against requirements through system, integration, and user acceptance testing.", entryCriteria: "Feature-complete build delivered", exitCriteria: "UAT signed off with zero open severity-1 defects", daysInStage: 8, openItems: 2 },
    ],
  },
  {
    name: "Release",
    icon: "rocket",
    stages: [
      { id: 8, slug: "deployment", name: "Deployment / Release", deliverable: "Deployment runbook", status: "not-started", owner: "DevOps Lead", gate: "Runbook rehearsed and rollback path verified", icon: "truck", purpose: "Prepares and rehearses the production release, including a verified rollback path.", entryCriteria: "UAT signed off", exitCriteria: "Runbook rehearsed, rollback path verified", daysInStage: 0, openItems: 0 },
      { id: 9, slug: "training", name: "Training & Change Management", deliverable: "Training pack", status: "not-started", owner: "Change Manager", gate: "90% of end users trained and assessed", icon: "graduationCap", purpose: "Prepares end users and support staff to operate and use the new solution.", entryCriteria: "Deployment runbook approved", exitCriteria: "90% of end users trained and assessed", daysInStage: 0, openItems: 0 },
      { id: 10, slug: "go-live", name: "Go-Live / Transition", deliverable: "Go-live checklist", status: "not-started", owner: "Project Manager", gate: "Go / no-go call signed by all workstream leads", icon: "rocket", purpose: "Executes the cutover to production with a formal go/no-go decision.", entryCriteria: "Training completion threshold met", exitCriteria: "Go/no-go call signed by all workstream leads", daysInStage: 0, openItems: 0 },
    ],
  },
  {
    name: "Run & Close",
    icon: "archive",
    stages: [
      { id: 11, slug: "operations", name: "Operations & Maintenance", deliverable: "Ops handover doc", status: "not-started", owner: "Ops Manager", gate: "Support team accepts handover with SLA agreed", icon: "server", purpose: "Hands the live solution over to the operations team under an agreed SLA.", entryCriteria: "Go-live complete", exitCriteria: "Support team accepts handover, SLA agreed", daysInStage: 0, openItems: 0 },
      { id: 12, slug: "monitoring", name: "Monitoring & Control", deliverable: "KPI dashboard spec", status: "not-started", owner: "Product Owner", gate: "KPIs green for 30 consecutive days", icon: "activity", purpose: "Tracks live KPIs to confirm the solution performs as intended in production.", entryCriteria: "Ops handover accepted", exitCriteria: "KPIs green for 30 consecutive days", daysInStage: 0, openItems: 0 },
      { id: 13, slug: "closure", name: "Closure", deliverable: "Closure report", status: "not-started", owner: "Sponsor", gate: "Lessons learned filed, budget reconciled, project archived", icon: "archive", purpose: "Formally closes the project — lessons learned, budget reconciliation, and archival.", entryCriteria: "KPIs stable for 30 days", exitCriteria: "Lessons learned filed, budget reconciled, archived", daysInStage: 0, openItems: 0 },
    ],
  },
];

export const allStages: Stage[] = phases.flatMap((p) => p.stages);

export function findStageBySlug(slug: string): Stage | undefined {
  return allStages.find((s) => s.slug === slug);
}

export function findPhaseByStageSlug(slug: string): Phase | undefined {
  return phases.find((p) => p.stages.some((s) => s.slug === slug));
}
