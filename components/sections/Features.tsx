import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusPill } from "@/components/ui/StatusPill";

function GateIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
      <path d="M9 20v-6h6v6" />
      <path d="M2 20h20" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const iconBox =
  "inline-grid h-12 w-12 place-items-center rounded-2xl bg-cream-100 text-primary-700 shadow-neo-inset-sm";

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title="Everything the lifecycle demands, nothing it doesn't"
            description="Stage gates, living documents, and role-aware views — built as one system instead of five bolted-on tools."
          />
        </Reveal>

        {/* Bento grid: mixed glass + neomorphic cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-6">
          {/* Stage-gate tracking — large glass card */}
          <Reveal className="md:col-span-4">
            <GlassCard className="h-full p-6 sm:p-8">
              <span className={iconBox}>
                <GateIcon />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">
                Stage-gate tracking
              </h3>
              <p className="mt-3 max-w-lg leading-relaxed text-ink-body">
                Every one of the 13 stages carries a formal gate with entry and
                exit criteria. The health ribbon shows at a glance which gates
                are moving, which are blocked, and which are signed off — no
                status meetings required.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <StatusPill status="signed-off" />
                <StatusPill status="done" />
                <StatusPill status="active" />
                <StatusPill status="blocked" />
                <StatusPill status="not-started" />
              </div>
            </GlassCard>
          </Reveal>

          {/* Auto documentation — neo card */}
          <Reveal delay={0.05} className="md:col-span-2">
            <div className="neo h-full rounded-3xl p-6 sm:p-8">
              <span className={iconBox}>
                <DocIcon />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">
                Auto-generated documentation
              </h3>
              <p className="mt-3 leading-relaxed text-ink-body">
                Charters, BRDs, test plans, and closure reports draft
                themselves from project data at each stage — versioned and
                ready for review.
              </p>
            </div>
          </Reveal>

          {/* Concurrent stages — neo card */}
          <Reveal delay={0.1} className="md:col-span-2">
            <div className="neo h-full rounded-3xl p-6 sm:p-8">
              <span className={iconBox}>
                <LayersIcon />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">
                Concurrent-stage visibility
              </h3>
              <p className="mt-3 leading-relaxed text-ink-body">
                Real projects overlap. Run Development while Design iterates —
                the phase navigator shows every active stage side by side.
              </p>
            </div>
          </Reveal>

          {/* Sign-off gates — glass card */}
          <Reveal delay={0.15} className="md:col-span-2">
            <GlassCard className="h-full p-6 sm:p-8">
              <span className={iconBox}>
                <CheckIcon />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">
                Sign-off gates
              </h3>
              <p className="mt-3 leading-relaxed text-ink-body">
                Named approvers formally accept each stage&apos;s deliverables.
                Every decision is timestamped and audit-ready.
              </p>
            </GlassCard>
          </Reveal>

          {/* Role-based views — glass card */}
          <Reveal delay={0.2} className="md:col-span-2">
            <GlassCard className="h-full p-6 sm:p-8">
              <span className={iconBox}>
                <UsersIcon />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">
                Role-based views
              </h3>
              <p className="mt-3 leading-relaxed text-ink-body">
                Sponsors see gate health, PMs see the full rail with blockers,
                contributors see only their deliverables. One source of truth,
                many lenses.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
