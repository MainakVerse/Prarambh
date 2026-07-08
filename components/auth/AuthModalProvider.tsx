"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

export type AuthView = "signin" | "signup" | "forgot" | "reset";

interface AuthModalContextValue {
  openAuth: (view?: AuthView) => void;
  closeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside <AuthModalProvider>");
  return ctx;
}

/**
 * Mounted once in the root layout. Any client component opens the modal via
 * useAuthModal(). Also handles the password-reset deep link
 * (/?auth=reset&token=...) coming from the reset email: opens the modal in
 * reset mode and scrubs the token from the URL/history immediately.
 */
export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthView | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    // window.location (not useSearchParams) — avoids forcing a Suspense
    // boundary around the whole layout in Next 14.
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "reset" && params.get("token")) {
      setResetToken(params.get("token"));
      setView("reset");
      // Token out of the address bar/history: less shoulder-surf + referer risk.
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const openAuth = useCallback((v: AuthView = "signin") => setView(v), []);
  const closeAuth = useCallback(() => setView(null), []);

  return (
    <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthModal view={view} resetToken={resetToken} onViewChange={setView} onClose={closeAuth} />
    </AuthModalContext.Provider>
  );
}
