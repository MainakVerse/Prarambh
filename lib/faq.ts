export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "What is Prarambh?",
    answer:
      "Prarambh is a project-lifecycle management platform that guides teams through 13 defined stages of project development — Initiation, Feasibility, Requirements, Planning, Design, Development, Testing, Deployment, Training, Go-Live, Operations, Monitoring, and Closure. Each stage has a gate, an owner, and auto-generated documentation, so projects move forward with a clear audit trail.",
  },
  {
    question: "What are the 13 stages Prarambh tracks?",
    answer:
      "Prarambh groups 13 stages into 5 phases: Define (Initiation, Feasibility, Requirements), Plan & Design (Planning, Design), Build & Verify (Development, Testing), Release (Deployment, Training, Go-Live), and Run & Close (Operations, Monitoring, Closure). Teams can rename stages or hide the ones a project does not need.",
  },
  {
    question: "Can multiple stages run at the same time?",
    answer:
      "Yes. Prarambh supports concurrent stages — for example, Development can run while Design is still being refined. The phase navigator shows every active stage side by side, and stage-gate rules define which sign-offs must complete before a downstream stage can close.",
  },
  {
    question: "Which documents does Prarambh generate automatically?",
    answer:
      "Prarambh auto-generates the standard deliverable for each stage: a project charter at Initiation, a feasibility report, BRD and FRS documents at Requirements, a project plan and RAID log, design specs, test plans and UAT sign-off records, deployment runbooks, training packs, go-live checklists, operations handover docs, and a final closure report. Every document is pre-filled from project data and versioned.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. The Starter plan is free forever for up to 3 projects and 5 team members, and includes the full 13-stage navigator and document generation. Paid plans add unlimited projects, sign-off gates with audit trails, role-based views, and priority support. No credit card is required to start.",
  },
  {
    question: "How do role-based views and sign-off gates work?",
    answer:
      "Every stakeholder sees the lifecycle through their own lens: sponsors see gate health and sign-off queues, project managers see the full stage rail with blockers, and contributors see only their assigned deliverables. Sign-off gates require named approvers to formally accept a stage's deliverables before the gate closes, and every decision is recorded with a timestamp for audit.",
  },
];
