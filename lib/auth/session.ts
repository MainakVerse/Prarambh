import { cookies } from "next/headers";
import { verifyAccessToken, type AccessTokenClaims } from "@/lib/auth/jwt";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";

/**
 * HOT-PATH session read for server components / route handlers.
 * Equivalent to Auth.js `auth()` but with zero framework overhead:
 * cookie → local RS256 verify. NO Redis. NO Neon. NO network.
 *
 * Use this in latency-sensitive code; use `auth()` where you want the
 * Auth.js Session shape.
 */
export async function getCurrentUser(): Promise<AccessTokenClaims | null> {
  const token = cookies().get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

/** Role guard helper for route handlers. Throws-free: returns null if denied. */
export async function requireRole(role: string): Promise<AccessTokenClaims | null> {
  const user = await getCurrentUser();
  if (!user || !user.roles.includes(role)) return null;
  return user;
}
