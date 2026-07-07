import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Map your lifecycle",
    description:
      "Pick the 13-stage template or trim it to fit. Prarambh groups stages into 5 phases — Define, Plan & Design, Build & Verify, Release, Run & Close — and assigns a gate and an owner to each.",
  },
  {
    number: "02",
    title: "Work the stages",
    description:
      "Teams execute stages — concurrently when needed. Deliverables auto-draft from project data, blockers surface on the gate-health ribbon, and every role sees the view that matters to them.",
  },
  {
    number: "03",
    title: "Sign off and move on",
    description:
      "Named approvers accept each stage's deliverables at the gate. Decisions are timestamped for audit, downstream stages unlock automatically, and the closure report writes itself.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from kickoff to closure"
            description="Prarambh turns the project lifecycle into a visible, governed flow — without adding process for its own sake."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <GlassCard className="h-full p-6 sm:p-8">
                <span className="tnum inline-grid h-12 w-12 place-items-center rounded-2xl bg-cream-100 text-lg font-extrabold text-primary-700 shadow-neo-inset-sm">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-body">
                  {step.description}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
