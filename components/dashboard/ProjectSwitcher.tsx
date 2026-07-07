"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/lib/icons";
import { projects, healthMeta } from "@/lib/dashboard-data";
import { cn } from "@/lib/cn";

/** Scopes the 13-stage sidebar tree to the currently selected project. */
export function ProjectSwitcher({ collapsed }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(projects[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const health = healthMeta[selected.health];
  const HealthIcon = Icon[health.icon];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Current project: ${selected.name}. Change project`}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border border-white/70 bg-white/50 px-2.5 py-2 text-left shadow-neo-xs transition-shadow hover:shadow-neo-sm",
          collapsed && "justify-center px-0"
        )}
      >
        <span
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 text-[11px] font-bold text-white"
        >
          {selected.name.slice(0, 1)}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-ink">
                {selected.name}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                <HealthIcon className="h-3 w-3" />
                {health.label}
              </span>
            </span>
            <Icon.chevronUpDown className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
          </>
        )}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select project"
          className="absolute left-0 top-full z-30 mt-1.5 w-64 rounded-2xl border border-white/70 bg-white/95 p-1.5 shadow-glass-lg backdrop-blur-xl"
        >
          {projects.map((p) => {
            const m = healthMeta[p.health];
            const Ic = Icon[m.icon];
            return (
              <li key={p.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={p.id === selected.id}
                  onClick={() => {
                    setSelected(p);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                    p.id === selected.id
                      ? "bg-cream-100 font-medium text-ink"
                      : "text-ink-body hover:bg-cream-50"
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  <Ic className={cn("h-3.5 w-3.5 shrink-0", m.className.includes("green") ? "text-green-700" : m.className.includes("amber") ? "text-amber-700" : "text-red-700")} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
