import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const testimonials = [
  {
    quote:
      "We replaced three trackers and a shared drive of stale templates with Prarambh. Gate reviews that took a week of chasing now close in a day.",
    name: "Ananya Iyer",
    role: "Head of Delivery, Kalinga Systems",
    initials: "AI",
  },
  {
    quote:
      "The auto-drafted BRD alone paid for itself. Our analysts stopped copy-pasting old documents and started reviewing real content on day one.",
    name: "Marcus Feld",
    role: "Program Manager, Northwind Labs",
    initials: "MF",
  },
  {
    quote:
      "Concurrent-stage view is the killer feature. Design and Development overlap on every project we run — Prarambh is the first tool that admits it.",
    name: "Priya Deshmukh",
    role: "PMO Lead, Meridian Rail",
    initials: "PD",
  },
];

export function Testimonials() {
  return (
    <section aria-label="Customer testimonials" className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Social proof"
            title="Teams ship calmer with Prarambh"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <GlassCard className="flex h-full flex-col p-6 sm:p-8">
                <svg
                  aria-hidden
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-primary-300"
                >
                  <path d="M4.6 11.2C4.6 7 7.4 4.2 11 3.4l.6 1.8c-2.3.8-3.7 2.4-3.9 4.3h3v6.9H4.6v-5.2zm9 0c0-4.2 2.8-7 6.4-7.8l.6 1.8c-2.3.8-3.7 2.4-3.9 4.3h3v6.9h-6.1v-5.2z" />
                </svg>
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink-body">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary-400 to-accent-400 text-sm font-bold text-white"
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.role}</p>
                  </div>
                </figcaption>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
