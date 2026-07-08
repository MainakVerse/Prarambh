"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/cn";
import { NeoButton } from "@/components/ui/NeoButton";
import type { AuthView } from "@/components/auth/AuthModalProvider";

interface AuthModalProps {
  view: AuthView | null; // null = closed
  resetToken: string | null;
  onViewChange: (v: AuthView) => void;
  onClose: () => void;
}

const titles: Record<AuthView, string> = {
  signin: "Welcome back",
  signup: "Create your account",
  forgot: "Reset your password",
  reset: "Choose a new password",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.03c2.2-2.1 3.5-5.1 3.5-8.6z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.8-2.1-6.8-5l-.14.01-3.65 2.8-.05.13C3.4 21.3 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.4c-.3-.7-.4-1.5-.4-2.4s.2-1.6.4-2.4l-.01-.16-3.7-2.9-.12.06C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l3.8-3z" />
      <path fill="#EB4335" d="M12 4.6c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l3.8 3c1-2.9 3.6-5 6.8-5z" />
    </svg>
  );
}

const inputClasses =
  "w-full rounded-xl border border-white/70 bg-cream-50 px-4 py-2.5 text-sm text-ink " +
  "shadow-neo-inset-sm outline-none placeholder:text-ink-soft/60 " +
  "focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30";

export function AuthModal({ view, resetToken, onViewChange, onClose }: AuthModalProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Clear transient state whenever the view changes / modal reopens.
  useEffect(() => {
    setError(null);
    setNotice(null);
    setPending(false);
  }, [view]);

  // Escape closes; focus moves into the dialog on open.
  useEffect(() => {
    if (!view) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector("input")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [view, onClose]);

  async function handleGoogle() {
    setPending(true);
    // Full-page redirect to Google; Auth.js callback lands on /dashboard.
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!view || pending) return;
    setError(null);
    setNotice(null);
    setPending(true);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    try {
      if (view === "signin") {
        const res = await signIn("credentials", { redirect: false, email, password });
        if (res?.error) {
          setError("Wrong email or password. If you signed up with Google, use “Continue with Google” or reset your password.");
        } else {
          window.location.href = "/dashboard";
          return;
        }
      } else if (view === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: String(data.get("name") ?? "") }),
        });
        if (!res.ok) {
          setError((await res.json()).error ?? "Sign-up failed. Try again.");
        } else {
          // Account created — sign straight in through the credentials flow.
          const login = await signIn("credentials", { redirect: false, email, password });
          if (login?.error) {
            setError("Account created — but automatic sign-in failed. Please sign in.");
            onViewChange("signin");
          } else {
            window.location.href = "/dashboard";
            return;
          }
        }
      } else if (view === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const body = await res.json();
        if (!res.ok) setError(body.error ?? "Could not send the reset email.");
        else setNotice(body.message);
      } else if (view === "reset") {
        const confirm = String(data.get("confirm") ?? "");
        if (password !== confirm) {
          setError("Passwords don't match.");
        } else {
          const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: resetToken, password }),
          });
          const body = await res.json();
          if (!res.ok) {
            setError(body.error ?? "Reset failed.");
          } else {
            setNotice("Password updated — sign in with it now.");
            onViewChange("signin");
          }
        }
      }
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AnimatePresence>
      {view && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/30 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={titles[view]}
            className="w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-7 shadow-glass-lg backdrop-blur-xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mb-5 flex items-start justify-between">
              <h2 className="text-xl font-bold tracking-tight text-ink">{titles[view]}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-xl text-ink-soft hover:bg-cream-50 hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>

            {(view === "signin" || view === "signup") && (
              <>
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={pending}
                  className={cn(
                    "flex w-full items-center justify-center gap-3 rounded-2xl border border-white/80",
                    "bg-cream-50 px-5 py-2.5 text-sm font-semibold text-ink shadow-neo-sm",
                    "hover:shadow-neo active:shadow-neo-inset-sm active:translate-y-px",
                    pending && "pointer-events-none opacity-60"
                  )}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
                <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-ink-soft/70">
                  <span className="h-px flex-1 bg-ink/10" />
                  or
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {view === "signup" && (
                <input name="name" type="text" autoComplete="name" placeholder="Full name" className={inputClasses} />
              )}
              {view !== "reset" && (
                <input name="email" type="email" required autoComplete="email" placeholder="Email address" className={inputClasses} />
              )}
              {view !== "forgot" && (
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={view === "signin" ? "current-password" : "new-password"}
                  placeholder={view === "reset" ? "New password (min 8 characters)" : "Password (min 8 characters)"}
                  className={inputClasses}
                />
              )}
              {view === "reset" && (
                <input name="confirm" type="password" required minLength={8} autoComplete="new-password" placeholder="Confirm new password" className={inputClasses} />
              )}

              {view === "signin" && (
                <button
                  type="button"
                  onClick={() => onViewChange("forgot")}
                  className="self-end text-xs font-medium text-primary-600 hover:underline"
                >
                  Forgot password?
                </button>
              )}

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  {notice}
                </p>
              )}

              <NeoButton type="submit" variant="primary" disabled={pending} className="mt-1 w-full">
                {pending
                  ? "Please wait…"
                  : view === "signin"
                    ? "Sign in"
                    : view === "signup"
                      ? "Create account"
                      : view === "forgot"
                        ? "Send reset link"
                        : "Set new password"}
              </NeoButton>
            </form>

            <p className="mt-5 text-center text-xs text-ink-soft">
              {view === "signin" && (
                <>
                  New here?{" "}
                  <button type="button" onClick={() => onViewChange("signup")} className="font-semibold text-primary-600 hover:underline">
                    Create an account
                  </button>
                </>
              )}
              {view === "signup" && (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => onViewChange("signin")} className="font-semibold text-primary-600 hover:underline">
                    Sign in
                  </button>
                </>
              )}
              {(view === "forgot" || view === "reset") && (
                <button type="button" onClick={() => onViewChange("signin")} className="font-semibold text-primary-600 hover:underline">
                  Back to sign in
                </button>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
