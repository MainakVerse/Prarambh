import { Reveal } from "@/components/ui/Reveal";

const companies = [
  "Northwind Labs",
  "Kalinga Systems",
  "Vertex & Co",
  "BlueOtter",
  "Meridian Rail",
  "Sahyadri Tech",
];

const stats = [
  { value: "4,200+", label: "projects delivered" },
  { value: "13", label: "stages tracked per project" },
  { value: "38%", label: "fewer gate slippages" },
  { value: "12 hrs", label: "saved per project on docs" },
];

export function TrustStrip() {
  return (
    <section aria-label="Trusted by teams" className="py-14">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-sm font-medium text-ink-muted">
            Trusted by delivery teams at
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {companies.map((name) => (
              <li
                key={name}
                className="text-base font-semibold tracking-tight text-ink-faint transition-colors hover:text-ink-muted"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="neo rounded-3xl px-4 py-6 text-center sm:px-6 sm:py-7"
              >
                <dd className="tnum text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 text-sm text-ink-body">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
