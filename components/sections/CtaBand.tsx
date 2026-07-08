import { NeoButton } from "@/components/ui/NeoButton";
import { AuthCtaButton } from "@/components/auth/AuthCtaButton";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";

export function CtaBand() {
  return (
    <section id="cta" className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <GlassCard
            variant="strong"
            className="relative overflow-hidden px-6 py-12 text-center sm:px-16 sm:py-14"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 right-0 h-64 w-96 rounded-full bg-gradient-to-bl from-accent-200/60 to-primary-200/50 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-0 h-64 w-96 rounded-full bg-gradient-to-tr from-primary-200/50 to-accent-200/40 blur-3xl"
            />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl text-balance">
                Your next project deserves a better prarambh
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-ink-body">
                Set up your first 13-stage project in under five minutes. Free
                for 3 projects — no credit card, no sales call.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <AuthCtaButton
                  view="signup"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Start Free
                </AuthCtaButton>
                <NeoButton
                  href="#how-it-works"
                  variant="soft"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  See how it works
                </NeoButton>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
