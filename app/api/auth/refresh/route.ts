import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { rotateRefreshToken, revokeByCookieValue, REFRESH_TTL_SEC } from "@/lib/auth/refresh-store";
import { signAccessToken, ACCESS_TOKEN_TTL_SEC } from "@/lib/auth/jwt";
import { ACCESS_COOKIE, REFRESH_COOKIE, accessCookieOptions, refreshCookieOptions, REFRESH_PATH } from "@/lib/auth/cookies";
import { getUserById } from "@/lib/auth/users";
import { sendRevocationAlert } from "@/lib/email/send";

export const runtime = "nodejs"; // node:crypto (timingSafeEqual) in refresh store

/**
 * POST /api/auth/refresh — the ONLY route where Redis is consulted for auth.
 *
 * Flow: refresh cookie (path-scoped to exactly here) → validate+rotate in
 * Redis (one-time-use) → re-read roles from Neon (so role changes propagate
 * within one access-token lifetime) → mint new RS256 access token → set both
 * cookies. Replay of an old refresh token nukes the whole token family.
 */
export async function POST() {
  const jar = cookies();
  const refreshCookie = jar.get(REFRESH_COOKIE)?.value;

  if (!refreshCookie) {
    return NextResponse.json({ error: "no_refresh_token" }, { status: 401 });
  }

  const result = await rotateRefreshToken(refreshCookie);

  if (!result.ok) {
    // Whatever the failure, the cookie is dead — clear both to force re-login.
    const res = NextResponse.json(
      { error: result.reason },
      { status: result.reason === "reuse_detected" ? 403 : 401 }
    );
    clearAuthCookies(res);

    if (result.reason === "reuse_detected" && result.userId) {
      // Theft signal: family already revoked inside the store; alert the user.
      const user = await getUserById(result.userId).catch(() => null);
      if (user) void sendRevocationAlert(user.email);
    }
    return res;
  }

  // Fresh roles from Neon — refresh path MAY do I/O (hot path may not).
  const user = await getUserById(result.userId);
  if (!user) {
    // User deleted since login: kill the session entirely.
    await revokeByCookieValue(refreshCookie).catch(() => {});
    const res = NextResponse.json({ error: "user_not_found" }, { status: 401 });
    clearAuthCookies(res);
    return res;
  }

  const accessToken = await signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    roles: user.roles,
    emailVerified: user.email_verified,
  });

  const res = NextResponse.json({ ok: true, expiresIn: ACCESS_TOKEN_TTL_SEC });
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    ...accessCookieOptions,
    maxAge: ACCESS_TOKEN_TTL_SEC,
  });
  res.cookies.set(REFRESH_COOKIE, result.next.cookieValue, refreshCookieOptions(REFRESH_TTL_SEC));
  return res;
}

/**
 * DELETE /api/auth/refresh — logout for this device.
 * Lives on the refresh path because the refresh cookie is path-scoped here:
 * no other route can even read it. Revokes the token family server-side and
 * clears both cookies (client-side logout alone would leave the refresh
 * token alive in Redis for up to 30 days).
 */
export async function DELETE() {
  const refreshCookie = cookies().get(REFRESH_COOKIE)?.value;
  if (refreshCookie) {
    await revokeByCookieValue(refreshCookie).catch((err) =>
      console.error("[auth] logout revocation failed:", err)
    );
  }
  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}

function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, "", { ...accessCookieOptions, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: accessCookieOptions.secure,
    sameSite: "lax",
    path: REFRESH_PATH,
    maxAge: 0,
  });
}
