import { NextRequest, NextResponse } from "next/server";
import { hashPassword, passwordPolicyError } from "@/lib/auth/passwords";
import { createUserWithPassword } from "@/lib/auth/users";
import { sendVerificationEmail } from "@/lib/email/send";

export const runtime = "nodejs";

/**
 * POST /api/auth/signup — email/password registration.
 * Rate-limited by middleware (10/min/IP). On success the client follows up
 * with signIn("credentials") so cookie issuance goes through the one
 * Auth.js sign-in path (single place that mints tokens).
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim().slice(0, 120) : null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const policyError = passwordPolicyError(password);
  if (policyError) {
    return NextResponse.json({ error: policyError }, { status: 400 });
  }

  const user = await createUserWithPassword({
    email,
    name,
    passwordHash: await hashPassword(password),
  });

  if (!user) {
    // Duplicate email. Honest 409 here: signup already confirms existence
    // by failing, and a vague error would only hurt legitimate users. The
    // endpoint is rate-limited, which is the enumeration defense.
    return NextResponse.json(
      { error: "This email is already registered. Sign in instead — or use “Forgot password”." },
      { status: 409 }
    );
  }

  void sendVerificationEmail(user.id, user.email); // no-op if email disabled
  return NextResponse.json({ ok: true }, { status: 201 });
}
