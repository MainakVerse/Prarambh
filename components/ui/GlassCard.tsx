import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** "strong" raises opacity + shadow for surfaces sitting over busy areas. */
  variant?: "default" | "strong";
}

export function GlassCard({
  variant = "default",
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl",
        variant === "strong" ? "glass-strong" : "glass",
        className
      )}
      {...props}
    />
  );
}
