"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Icon } from "@/lib/icons";
import { allStages } from "@/lib/stages";
import { StageTab } from "@/components/dashboard/StageTab";
import { ProjectSwitcher } from "@/components/dashboard/ProjectSwitcher";
import { cn } from "@/lib/cn";

const globalItems = [
  { label: "Saved Projects", href: "/dashboard/projects", icon: "folder" as const },
  { label: "Community", href: "/dashboard/community", icon: "users" as const },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" as const },
];

function Wordmark({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 px-1 text-lg font-bold tracking-tight text-ink"
      aria-label="Prarambh dashboard home"
    >
      <span
        aria-hidden
        className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-extrabold text-white shadow-neo-xs"
      >
        प्र
      </span>
      {!collapsed && "Prarambh"}
    </Link>
  );
}

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeSlug = pathname?.startsWith("/dashboard/project/")
    ? pathname.split("/")[3]
    : undefined;

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <div className="flex items-center justify-between">
        <Wordmark collapsed={collapsed} />
      </div>

      <ProjectSwitcher collapsed={collapsed} />

      <nav aria-label="Navigation" role="tree">
        {!collapsed ? (
          <div className="flex flex-col gap-0.5 px-2">
            {allStages.map((stage) => (
              <StageTab
                key={stage.id}
                stage={stage}
                active={stage.slug === activeSlug}
                onNavigate={onNavigate}
              />
            ))}
            {globalItems.map((item) => {
              const ItemIcon = Icon[item.icon];
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl py-2 pl-4 pr-2.5 text-sm transition-colors",
                    active
                      ? "bg-cream-100 font-semibold text-ink shadow-neo-inset-sm"
                      : "text-ink-body hover:bg-white/70 hover:text-ink"
                  )}
                >
                  <ItemIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            {allStages.map((stage) => {
              const StageIcon = Icon[stage.icon];
              const active = stage.slug === activeSlug;
              return (
                <Link
                  key={stage.id}
                  href={`/dashboard/project/${stage.slug}`}
                  title={stage.name}
                  aria-label={stage.name}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl transition-colors",
                    active
                      ? "bg-cream-100 text-primary-600 shadow-neo-inset-sm"
                      : "text-ink-faint hover:bg-white/70 hover:text-ink-soft"
                  )}
                >
                  <StageIcon className="h-[18px] w-[18px]" />
                </Link>
              );
            })}
            {globalItems.map((item) => {
              const ItemIcon = Icon[item.icon];
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl transition-colors",
                    active
                      ? "bg-cream-100 text-primary-600 shadow-neo-inset-sm"
                      : "text-ink-faint hover:bg-white/70 hover:text-ink-soft"
                  )}
                >
                  <ItemIcon className="h-[18px] w-[18px]" />
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {/* Desktop: full sidebar (lg+) */}
      <aside className="glass sticky top-0 hidden min-h-screen w-[19rem] shrink-0 self-start border-y-0 border-l-0 rounded-none lg:block">
        <SidebarContent />
      </aside>

      {/* Tablet: icon rail (md to lg) */}
      <aside className="glass sticky top-0 hidden min-h-screen w-[4.5rem] shrink-0 self-start border-y-0 border-l-0 rounded-none md:block lg:hidden">
        <SidebarContent collapsed />
      </aside>

      {/* Mobile: glassmorphic slide-over drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              aria-hidden
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="glass-strong fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs rounded-none border-y-0 border-l-0 md:hidden"
              initial={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl text-ink-soft hover:bg-white/70"
              >
                <Icon.x className="h-[18px] w-[18px]" />
              </button>
              <SidebarContent onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
