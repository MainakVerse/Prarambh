"use client";

import { type ReactNode } from "react";
import { NeoButton } from "@/components/ui/NeoButton";
import { useAuthModal, type AuthView } from "@/components/auth/AuthModalProvider";

/**
 * Client CTA that opens the auth modal — lets server components (Hero,
 * CtaBand, Pricing) trigger auth without becoming client components.
 */
export function AuthCtaButton({
  view = "signup",
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  view?: AuthView;
  children: ReactNode;
  variant?: "primary" | "soft" | "ghost";
  size?: "md" | "lg";
  className?: string;
}) {
  const { openAuth } = useAuthModal();
  return (
    <NeoButton onClick={() => openAuth(view)} variant={variant} size={size} className={className}>
      {children}
    </NeoButton>
  );
}
