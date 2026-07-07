import { NeoButton } from "@/components/ui/NeoButton";
import { Reveal } from "@/components/ui/Reveal";
import { HeroMockup } from "./HeroMockup";

export function Hero() {
  return (
    <section id="product" className="relative overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-20">
      {/* Warm ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-200/50 via-accent-200/40 to-transparent blur-3xl"
      />

      {/* Single column on mobile: copy + CTAs first, product mockup below */}
      <div className="container-page relative grid items-center gap-10 sm:gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-ink-soft shadow-neo-xs backdrop-blur">
            <span aria-hidden className="h-2 w-2 rounded-full bg-primary-500" />
            Project-lifecycle management for delivery teams
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl text-balance">
            From Prarambh to launch — every project stage,{" "}
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              one workspace
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-body">
            Prarambh guides your team through all 13 stages of project
            development — from Initiation to Closure — with stage-gate
            tracking, auto-generated documents, and sign-off workflows that
            keep every stakeholder aligned.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <NeoButton
              href="/dashboard"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Start Free
              <svg
                aria-hidden
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </NeoButton>
            <NeoButton
              href="#how-it-works"
              variant="soft"
              size="lg"
              className="w-full sm:w-auto"
            >
              See how it works
            </NeoButton>
          </div>

          <p className="mt-5 text-sm text-ink-muted">
            Free forever for 3 projects · No credit card required · Set up in
            under 5 minutes
          </p>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-5">
          <HeroMockup />
        </Reveal>
      </div>
    </section>
  );
}
