"use client";

import { useState } from "react";
import { Icon } from "@/lib/icons";
import type { Stage } from "@/lib/stages";
import { cn } from "@/lib/cn";

/** Checklist of gate criteria plus the sign-off / advance CTA. Disabled with a tooltip when unmet. */
export function GateCriteriaPanel({ stage }: { stage: Stage }) {
  const canAdvance = stage.status === "done";
  const isSignedOff = stage.status === "signed-off";
  const criteria = [
    { label: stage.entryCriteria, met: stage.status !== "not-started" },
    { label: "Deliverable reviewed by owner", met: stage.status === "done" || isSignedOff },
    { label: stage.exitCriteria, met: stage.status === "done" || isSignedOff },
  ];
  const [requested, setRequested] = useState(false);

  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="text-sm font-semibold text-ink">Gate criteria</h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {criteria.map((c) => (
          <li key={c.label} className="flex items-start gap-2.5 text-sm">
            <span
              aria-hidden
              className={cn(
                "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                c.met ? "bg-green-100 text-green-700" : "bg-zinc-100 text-ink-faint"
              )}
            >
              {c.met ? <Icon.checkCircle className="h-3.5 w-3.5" /> : <Icon.clock className="h-3.5 w-3.5" />}
            </span>
            <span className={c.met ? "text-ink-body" : "text-ink-muted"}>{c.label}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-4 group/cta">
        <button
          type="button"
          disabled={!canAdvance || requested}
          onClick={() => setRequested(true)}
          aria-describedby={!canAdvance ? "gate-cta-hint" : undefined}
          className={cn(
            "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
            canAdvance && !requested
              ? "bg-gradient-to-b from-primary-400 to-primary-500 text-white shadow-glow-primary hover:from-primary-500 hover:to-primary-600 active:shadow-neo-inset-sm"
              : "cursor-not-allowed bg-cream-100 text-ink-faint shadow-neo-inset-sm"
          )}
        >
          {isSignedOff
            ? "Signed off"
            : requested
              ? "Sign-off requested"
              : "Request Sign-off / Advance to next stage"}
        </button>
        {!canAdvance && !isSignedOff && (
          <div
            id="gate-cta-hint"
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs text-white opacity-0 shadow-glass-lg transition-opacity duration-150 group-hover/cta:opacity-100"
          >
            Unmet gate criteria: complete the checklist above before requesting sign-off.
          </div>
        )}
      </div>
    </div>
  );
}
