import type { IconKey } from "@/lib/icons";
import type { StageStatus } from "@/lib/stages";

export interface Document {
  id: string;
  name: string;
  kind: string;
  updatedAt: string;
  status: "draft" | "in-review" | "final";
}

export const stageDocuments: Record<string, Document[]> = {
  initiation: [{ id: "d1", name: "Project Charter", kind: "Charter", updatedAt: "2026-05-02", status: "final" }],
  feasibility: [{ id: "d2", name: "Feasibility Report", kind: "Report", updatedAt: "2026-05-10", status: "final" }],
  requirements: [
    { id: "d3", name: "Business Requirements Doc", kind: "BRD", updatedAt: "2026-05-20", status: "final" },
    { id: "d4", name: "Functional Spec", kind: "FRS", updatedAt: "2026-05-22", status: "in-review" },
  ],
  planning: [{ id: "d5", name: "Project Plan & RAID Log", kind: "Plan", updatedAt: "2026-05-29", status: "final" }],
  design: [
    { id: "d6", name: "Solution Design Spec", kind: "Design", updatedAt: "2026-06-14", status: "in-review" },
    { id: "d7", name: "Architecture Diagram", kind: "Diagram", updatedAt: "2026-06-15", status: "draft" },
  ],
  development: [{ id: "d8", name: "Sprint Release Notes", kind: "Notes", updatedAt: "2026-07-01", status: "draft" }],
  testing: [
    { id: "d9", name: "Test Plan", kind: "Plan", updatedAt: "2026-06-28", status: "final" },
    { id: "d10", name: "UAT Sign-off", kind: "Sign-off", updatedAt: "2026-07-05", status: "in-review" },
  ],
  deployment: [], training: [], "go-live": [], operations: [], monitoring: [], closure: [],
};

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export const stageActivity: Record<string, ActivityItem[]> = {
  design: [
    { id: "a1", actor: "Priya Nair", action: "requested changes on", target: "Solution Design Spec", timestamp: "2026-07-06T14:20:00Z" },
    { id: "a2", actor: "Arjun Mehta", action: "uploaded", target: "Architecture Diagram v2", timestamp: "2026-07-05T09:10:00Z" },
  ],
  testing: [
    { id: "a3", actor: "QA Bot", action: "flagged severity-1 defect on", target: "Checkout flow", timestamp: "2026-07-06T18:40:00Z" },
    { id: "a4", actor: "Devika Rao", action: "commented on", target: "UAT Sign-off", timestamp: "2026-07-05T11:05:00Z" },
  ],
  development: [
    { id: "a5", actor: "Tech Lead", action: "merged", target: "feature/payments-v2", timestamp: "2026-07-06T08:00:00Z" },
  ],
};

export const stageBlockers: Record<string, { reason: string; owner: string; since: string }[]> = {
  testing: [
    { reason: "2 open severity-1 defects in checkout flow", owner: "Tech Lead", since: "2026-07-03" },
    { reason: "UAT environment awaiting refreshed data set", owner: "DevOps Lead", since: "2026-07-05" },
  ],
};

export interface ProjectSummary {
  id: string;
  name: string;
  client: string;
  currentStageId: number;
  health: "on-track" | "at-risk" | "blocked";
  updatedAt: string;
}

export const projects: ProjectSummary[] = [
  { id: "p1", name: "Northwind Ledger Migration", client: "Northwind Retail", currentStageId: 7, health: "at-risk", updatedAt: "2026-07-06" },
  { id: "p2", name: "Aurora Benefits Portal", client: "Aurora Health", currentStageId: 5, health: "on-track", updatedAt: "2026-07-05" },
  { id: "p3", name: "Kestrel Logistics API", client: "Kestrel Freight", currentStageId: 13, health: "on-track", updatedAt: "2026-06-20" },
  { id: "p4", name: "Solace CRM Rollout", client: "Solace Finance", currentStageId: 3, health: "blocked", updatedAt: "2026-07-04" },
];

export const healthMeta: Record<ProjectSummary["health"], { label: string; className: string; icon: IconKey }> = {
  "on-track": { label: "On track", className: "bg-green-100 text-green-900", icon: "checkCircle" },
  "at-risk": { label: "At risk", className: "bg-amber-100 text-amber-900", icon: "warning" },
  blocked: { label: "Blocked", className: "bg-red-100 text-red-900", icon: "warning" },
};

export interface GateReview {
  id: string;
  project: string;
  stage: string;
  date: string;
}

export const upcomingGateReviews: GateReview[] = [
  { id: "g1", project: "Northwind Ledger Migration", stage: "Testing → Deployment", date: "2026-07-10" },
  { id: "g2", project: "Aurora Benefits Portal", stage: "Design → Development", date: "2026-07-12" },
  { id: "g3", project: "Solace CRM Rollout", stage: "Requirements → Planning", date: "2026-07-15" },
];

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  category: "Template" | "Discussion" | "Best Practice";
  replies: number;
  updatedAt: string;
  excerpt: string;
}

export const communityPosts: CommunityPost[] = [
  { id: "c1", title: "Our UAT sign-off checklist template", author: "Devika Rao", category: "Template", replies: 12, updatedAt: "2026-07-05", excerpt: "Sharing the checklist we use to gate UAT sign-off across fintech projects — covers severity thresholds and rollback triggers." },
  { id: "c2", title: "How do you handle scope creep during Design?", author: "Arjun Mehta", category: "Discussion", replies: 27, updatedAt: "2026-07-04", excerpt: "Curious how other PMs push back on late-stage requirement changes without blowing the timeline." },
  { id: "c3", title: "RACI matrix that actually gets used", author: "Priya Nair", category: "Best Practice", replies: 8, updatedAt: "2026-07-02", excerpt: "Most RACI docs rot in a drive. Here's the lightweight version our team keeps alive in every stage review." },
  { id: "c4", title: "Go-live checklist for regulated industries", author: "Sam Okafor", category: "Template", replies: 15, updatedAt: "2026-06-29", excerpt: "Added compliance sign-off gates specific to healthcare and finance rollouts." },
];

export const statusFilterOptions: (StageStatus | "all")[] = ["all", "not-started", "active", "blocked", "done", "signed-off"];
