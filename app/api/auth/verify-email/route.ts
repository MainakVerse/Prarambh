import { NextRequest, NextResponse } from "next/server";
import { consumeVerificationToken } from "@/lib/email/send";
import { markEmailVerified } from "@/lib/auth/users";
import { env } from "@/lib/env";

export const runtime = "nodejs";

/**
 * GET /api/auth/verify-email?token=... — link target from the verification
 * email. Token is one-time-use (atomic GETDEL in Redis, 24h TTL).
 * The emailVerified claim updates in the access token at next refresh/login.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token || token.length > 128) {
    return NextResponse.redirect(new URL("/?verify=invalid", env.appUrl));
  }

  const userId = await consumeVerificationToken(token);
  if (!userId) {
    return NextResponse.redirect(new URL("/?verify=expired", env.appUrl));
  }

  await markEmailVerified(userId);
  return NextResponse.redirect(new URL("/?verify=success", env.appUrl));
}
