import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { revokeAllForUser } from "@/lib/auth/refresh-store";
import { getUserById } from "@/lib/auth/users";
import { sendRevocationAlert } from "@/lib/email/send";
import { ACCESS_COOKIE, REFRESH_COOKIE, accessCookieOptions, REFRESH_PATH } from "@/lib/auth/cookies";

export const runtime = "nodejs";

/**
 * POST /api/auth/revoke-all — "log me out everywhere" / compromise response.
 * Auth: valid ACCESS token (stateless check). Revokes every refresh-token
 * family for the user; all other devices die at their next refresh (≤15 min).
 */
export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await revokeAllForUser(userId);

  const user = await getUserById(userId).catch(() => null);
  if (user) void sendRevocationAlert(user.email);

  // Also end THIS device's session immediately.
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, "", { ...accessCookieOptions, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: accessCookieOptions.secure,
    sameSite: "lax",
    path: REFRESH_PATH,
    maxAge: 0,
  });
  return res;
}
