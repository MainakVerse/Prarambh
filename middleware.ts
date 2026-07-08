import { NextRequest, NextResponse } from "next/server";
import { authRatelimit, clientIp, tooManyRequests } from "@/lib/ratelimit";

/**
 * Edge middleware: rate-limit ALL auth endpoints (login, OAuth callback,
 * refresh, logout, verify, revoke) BEFORE any handler code runs.
 * 10 req/min per IP, sliding window. Legit users never hit this; credential
 * stuffing, refresh-token brute force and email-bombing do.
 *
 * Note: this is the one Redis call outside the refresh route, and it guards
 * only /api/auth/* — the application hot path (every other route) has no
 * middleware I/O at all.
 */
export async function middleware(req: NextRequest) {
  const ip = clientIp(req);
  const { success, reset } = await authRatelimit.limit(`${ip}`);

  if (!success) {
    return tooManyRequests(reset);
  }
  return NextResponse.next();
}

export const config = {
  // Only auth routes pay the rate-limit cost.
  matcher: ["/api/auth/:path*"],
};
