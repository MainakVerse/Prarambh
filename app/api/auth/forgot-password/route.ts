import { NextRequest, NextResponse } from "next/server";
import { getUserByEmailWithPassword } from "@/lib/auth/users";
import { sendPasswordResetEmail } from "@/lib/email/send";
import { env } from "@/lib/env";

export const runtime = "nodejs";

/**
 * POST /api/auth/forgot-password — request a reset link.
 * ALWAYS answers 200 with the same body, whether or not the email exists:
 * this endpoint must not be an account-existence oracle. Rate-limited by
 * middleware against reset-mail bombing.
 */
export async function POST(req: NextRequest) {
  if (!env.emailEnabled) {
    // Deployment hasn't configured Resend — surface that honestly instead of
    // pretending a mail was sent that never will be.
    return NextResponse.json(
      { error: "Password reset is not available: email service is not configured." },
      { status: 503 }
    );
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const user = await getUserByEmailWithPassword(email);
    // Also sent for OAuth-only accounts: completing the reset SETS a first
    // password, which is the legitimate way to add password login to a
    // Google account (mailbox ownership is proven by the link).
    if (user) void sendPasswordResetEmail(user.id, user.email);
  }

  return NextResponse.json({
    ok: true,
    message: "If that email is registered, a reset link is on its way.",
  });
}
