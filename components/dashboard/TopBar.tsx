"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/lib/icons";
import { findStageBySlug, findPhaseByStageSlug } from "@/lib/stages";
import { cn } from "@/lib/cn";

function useBreadcrumb() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard/project/")) {
    const slug = pathname.split("/")[3];
    const stage = findStageBySlug(slug);
    const phase = findPhaseByStageSlug(slug);
    if (stage && phase) {
      return ["Northwind Ledger Migration", phase.name, stage.name];
    }
  }
  if (pathname === "/dashboard/projects") return ["Saved Projects"];
  if (pathname === "/dashboard/community") return ["Community"];
  if (pathname === "/dashboard/settings") return ["Settings"];
  return ["Overview"];
}

type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

/** "Jane Doe" -> "JD"; falls back to the email's first letter. */
function initialsFor(user: SessionUser | null): string {
  if (!user) return "";
  const name = user.name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const letters = parts.length >= 2 ? [parts[0][0], parts[parts.length - 1][0]] : [parts[0][0]];
    return letters.join("").toUpperCase();
  }
  return user.email?.[0]?.toUpperCase() ?? "?";
}

function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.user) setUser(data.user);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const showImage = user?.image && !imgFailed;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-accent-400 to-primary-500 text-sm font-bold text-white shadow-neo-xs"
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image as string}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        ) : (
          initialsFor(user)
        )}
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full z-30 mt-1.5 w-48 rounded-2xl border border-white/70 bg-white/95 p-1.5 shadow-glass-lg backdrop-blur-xl"
        >
          {["Profile", "Team & Roles", "Billing"].map((label) => (
            <li key={label} role="none">
              <Link
                role="menuitem"
                href="/dashboard/settings"
                className="block rounded-xl px-3 py-2 text-sm text-ink-body hover:bg-cream-50 hover:text-ink"
              >
                {label}
              </Link>
            </li>
          ))}
          <li role="none">
            <button
              role="menuitem"
              type="button"
              onClick={async () => {
                // Server-side logout: revokes this device's refresh-token
                // family in Redis and clears both auth cookies. A client-only
                // redirect would leave the refresh token alive for 30 days.
                await fetch("/api/auth/refresh", { method: "DELETE" }).catch(() => {});
                window.location.href = "/";
              }}
              className="block w-full rounded-xl px-3 py-2 text-left text-sm text-ink-body hover:bg-cream-50 hover:text-ink"
            >
              Sign out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export function TopBar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const crumbs = useBreadcrumb();

  return (
    <header className="glass-strong sticky top-0 z-30 flex h-16 items-center gap-3 rounded-none border-x-0 border-t-0 px-3 sm:px-5">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-ink-soft hover:bg-white/70 md:hidden"
      >
        <Icon.menu className="h-5 w-5" />
      </button>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 items-center gap-1.5 text-sm md:flex">
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <Icon.chevronRight className="h-3 w-3 shrink-0 text-ink-faint" />}
            <span
              className={cn(
                "truncate",
                i === crumbs.length - 1 ? "font-semibold text-ink" : "text-ink-muted"
              )}
            >
              {c}
            </span>
          </span>
        ))}
      </nav>

      <div className="relative hidden flex-1 max-w-sm lg:block">
        <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          placeholder="Search projects, docs, stages…"
          aria-label="Global search"
          className="w-full rounded-xl border border-white/70 bg-white/60 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint shadow-neo-inset-sm focus:bg-white"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Search"
          className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-white/70 lg:hidden"
        >
          <Icon.search className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-b from-primary-400 to-primary-500 px-3.5 py-2 text-sm font-semibold text-white shadow-glow-primary transition-all hover:from-primary-500 hover:to-primary-600 sm:flex"
        >
          <Icon.sparkles className="h-4 w-4" />
          Generate docs
        </button>
        <button
          type="button"
          aria-label="Generate docs"
          className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-primary-400 to-primary-500 text-white shadow-glow-primary sm:hidden"
        >
          <Icon.sparkles className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-white/70"
        >
          <Icon.bell className="h-5 w-5" />
          <span
            aria-hidden
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"
          />
        </button>

        <AvatarMenu />
      </div>
    </header>
  );
}
