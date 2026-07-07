import Link from "next/link";
import { site } from "@/lib/site";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Document automation", href: "#documents" },
    ],
  },
  {
    heading: "Lifecycle",
    links: [
      { label: "The 13 stages", href: "#product" },
      { label: "Stage gates", href: "#features" },
      { label: "Sign-off workflow", href: "#features" },
      { label: "Role-based views", href: "#features" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Templates", href: "#documents" },
      { label: "Support", href: `mailto:${site.email}` },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#product" },
      { label: "Contact", href: `mailto:${site.email}` },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-cream-300/60 bg-cream-100">
      <div className="container-page py-14">
        {/* Mobile: brand full-width, nav columns 2-up; desktop: 6-col row */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-6 md:gap-10">
          <div className="col-span-2">
            <p className="flex items-center gap-2 text-lg font-bold text-ink">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-extrabold text-white"
              >
                प्र
              </span>
              Prarambh
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-body">
              Prarambh (प्रारम्भ, &ldquo;beginning&rdquo;) is the
              project-lifecycle platform that carries teams from Initiation to
              Closure — 13 stages, one workspace.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-body transition-colors hover:text-primary-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream-300/60 pt-8 sm:flex-row">
          <p className="text-sm text-ink-muted">
            © {new Date().getFullYear()} Prarambh. All rights reserved.
          </p>
          <p className="text-sm text-ink-muted">
            Built for teams who finish what they start.
          </p>
        </div>
      </div>
    </footer>
  );
}
