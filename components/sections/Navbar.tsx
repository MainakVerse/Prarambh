"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { NeoButton } from "@/components/ui/NeoButton";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#faq" },
];

function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink"
      aria-label="Prarambh home"
    >
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-extrabold text-white shadow-neo-xs"
      >
        प्र
      </span>
      Prarambh
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet when a link is chosen or viewport grows past mobile.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-lg transition-all duration-300",
        scrolled
          ? "border-white/80 bg-white/80 shadow-glass"
          : "border-white/40 bg-white/55"
      )}
    >
      <nav
        aria-label="Main"
        className="container-page flex h-16 items-center justify-between"
      >
        <Wordmark />

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-white/70 hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <NeoButton href="#pricing" variant="ghost">
            Sign in
          </NeoButton>
          <NeoButton href="/dashboard" variant="primary">
            Get Started
          </NeoButton>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl text-ink md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg
            aria-hidden
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile glass sheet */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/60 bg-white/85 backdrop-blur-xl md:hidden"
        >
          <ul className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-ink-soft hover:bg-white hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-3 px-4 pb-2">
              <NeoButton href="#pricing" variant="soft" className="flex-1">
                Sign in
              </NeoButton>
              <NeoButton href="/dashboard" variant="primary" className="flex-1">
                Get Started
              </NeoButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
