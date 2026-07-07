import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { phases } from "@/lib/stages";

export function DocAutomation() {
  return (
    <section id="documents" className="py-20 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            align="left"
            eyebrow="Document automation"
            title="Every stage ships its paperwork — written for you"
            description="Prarambh pre-fills the standard deliverable for each of the 13 stages from live project data: charters at Initiation, BRD and FRS at Requirements, test plans and UAT sign-offs at Testing, all the way to the closure report. Documents stay versioned, linked to their gate, and export-ready."
          />
          <ul className="mt-8 space-y-3">
            {[
              "Pre-filled from project data — no blank-page starts",
              "Versioned automatically on every gate decision",
              "Export to PDF or share a live link with stakeholders",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-ink-body">
                <span
                  aria-hidden
                  className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-100 text-primary-700"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 5.5 4 8l4.5-6" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <GlassCard variant="strong" className="p-6 sm:p-8">
            <p className="mb-4 text-sm font-semibold text-ink-soft">
              Deliverables by phase
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {phases.map((phase) => (
                <div key={phase.name} className="neo rounded-2xl p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary-700">
                    {phase.name}
                  </p>
                  <ul className="mt-2.5 space-y-1.5">
                    {phase.stages.map((stage) => (
                      <li
                        key={stage.id}
                        className="flex items-baseline justify-between gap-2 text-sm"
                      >
                        <span className="font-medium text-ink">
                          {stage.name}
                        </span>
                        <span className="text-right text-xs text-ink-muted">
                          {stage.deliverable}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
