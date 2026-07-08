import { NextRequest, NextResponse } from "next/server";
import { consumeResetToken, sendRevocationAlert } from "@/lib/email/send";
import { hashPassword, passwordPolicyError } from "@/lib/auth/passwords";
import { setPasswordHash, markEmailVerified, getUserById } from "@/lib/auth/users";
import { revokeAllForUser } from "@/lib/auth/refresh-store";

export const runtime = "nodejs";

/**
 * POST /api/auth/reset-password — complete a reset with { token, password }.
 * Token is one-time (atomic GETDEL) and 1h-lived. On success:
 * - new bcrypt hash stored
 * - email marked verified (the link proved mailbox ownership)
 * - ALL refresh-token families revoked — a password reset is the
 *   "my account may be compromised" gesture, so every existing session dies
 * - notification email sent
 */
export async function POST(req: NextRequest) {
  let body: { token?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!token || token.length > 128) {
    return NextResponse.json({ error: "Invalid reset link." }, { status: 400 });
  }
  const policyError = passwordPolicyError(password);
  if (policyError) {
    return NextResponse.json({ error: policyError }, { status: 400 });
  }

  const userId = await consumeResetToken(token);
  if (!userId) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Request a new one." },
      { status: 400 }
    );
  }

  await setPasswordHash(userId, await hashPassword(password));
  await markEmailVerified(userId);
  await revokeAllForUser(userId);

  const user = await getUserById(userId).catch(() => null);
  if (user) void sendRevocationAlert(user.email);

  return NextResponse.json({ ok: true });
}
