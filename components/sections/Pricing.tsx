import { NeoButton } from "@/components/ui/NeoButton";
import { AuthCtaButton } from "@/components/auth/AuthCtaButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For small teams trying stage-gated delivery for the first time.",
    features: [
      "Up to 3 projects, 5 members",
      "Full 13-stage phase navigator",
      "Auto-generated documents",
      "Gate-health ribbon",
      "Community support",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Growth",
    price: "$12",
    period: "per user / month",
    description: "For delivery teams running many projects with real governance.",
    features: [
      "Unlimited projects & members",
      "Sign-off gates with audit trail",
      "Role-based views",
      "Concurrent-stage rules",
      "PDF export & live share links",
      "Priority email support",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual billing",
    description: "For PMOs that need control, compliance, and scale.",
    features: [
      "Everything in Growth",
      "SSO / SAML & SCIM",
      "Custom lifecycle templates",
      "Advanced audit & retention",
      "Dedicated success manager",
    ],
    cta: "Talk to Sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Start free. Scale when the portfolio does."
            description="Every plan includes the full 13-stage lifecycle. Pay only for governance and scale."
          />
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.1}>
              <div
                className={cn(
                  "neo relative flex h-full flex-col rounded-4xl p-6 sm:p-8",
                  tier.featured && "ring-2 ring-primary-400"
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-1 text-xs font-bold text-white shadow-glow-primary">
                    Most popular
                  </span>
                )}

                <h3 className="text-lg font-bold text-ink">{tier.name}</h3>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="tnum text-4xl font-extrabold tracking-tight text-ink">
                    {tier.price}
                  </span>
                  <span className="text-sm text-ink-muted">{tier.period}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-body">
                  {tier.description}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-ink-body"
                    >
                      <span
                        aria-hidden
                        className="mt-0.5 grid shrink-0 place-items-center rounded-full bg-primary-100 text-primary-700"
                        style={{ height: 18, width: 18 }}
                      >
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1.5 5.5 4 8l4.5-6" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {tier.name === "Enterprise" ? (
                  <NeoButton
                    href="#cta"
                    variant={tier.featured ? "primary" : "soft"}
                    className="mt-8 w-full"
                  >
                    {tier.cta}
                  </NeoButton>
                ) : (
                  <AuthCtaButton
                    view="signup"
                    variant={tier.featured ? "primary" : "soft"}
                    className="mt-8 w-full"
                  >
                    {tier.cta}
                  </AuthCtaButton>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
