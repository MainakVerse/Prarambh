"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Neomorphic switch: pressed-inset track, extruded orange thumb when on. */
export function NeoToggle({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => setChecked((v) => !v)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full shadow-neo-inset-sm transition-colors duration-200",
        checked ? "bg-primary-200" : "bg-cream-200"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full shadow-neo-xs transition-transform duration-200",
          checked
            ? "translate-x-[22px] bg-gradient-to-b from-primary-400 to-primary-500"
            : "translate-x-0.5 bg-white"
        )}
      />
    </button>
  );
}
