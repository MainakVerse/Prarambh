import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface NeoButtonProps {
  /** With href renders a Link; without it renders a <button>. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: ReactNode;
  variant?: "primary" | "soft" | "ghost";
  size?: "md" | "lg";
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 select-none";

const sizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variants = {
  /* Neomorphic-glass primary: warm gradient, soft glow, presses in on active */
  primary:
    "text-white bg-gradient-to-b from-primary-400 to-primary-500 shadow-glow-primary " +
    "hover:from-primary-500 hover:to-primary-600 hover:shadow-neo-sm " +
    "active:shadow-neo-inset-sm active:translate-y-px",
  /* Neomorphic soft: extruded cream tile, insets when pressed */
  soft:
    "text-ink bg-cream-100 shadow-neo-sm hover:shadow-neo " +
    "active:shadow-neo-inset-sm active:translate-y-px",
  /* Ghost: quiet text button */
  ghost:
    "text-ink-soft hover:text-ink hover:bg-white/60",
};

export function NeoButton({
  href,
  onClick,
  type = "button",
  disabled,
  children,
  variant = "primary",
  size = "md",
  className,
}: NeoButtonProps) {
  const classes = cn(
    base,
    sizes[size],
    variants[variant],
    disabled && "pointer-events-none opacity-60",
    className
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
