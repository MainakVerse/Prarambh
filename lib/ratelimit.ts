import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

/**
 * Sliding-window limiter for auth endpoints: 10 req/min per IP.
 * Sliding window (vs fixed) prevents the burst-at-boundary trick where a
 * client sends 10 at 0:59 and 10 more at 1:01.
 * Keyed per-IP: crude but right for unauthenticated endpoints (login/refresh
 * have no trusted user identity yet).
 */
const globalForRl = globalThis as unknown as { __authRl?: Ratelimit };

export const authRatelimit =
  globalForRl.__authRl ??
  (globalForRl.__authRl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "rl:auth",
    analytics: false,
    // Fail-open: if Redis doesn't answer in 2s, ALLOW the request.
    // A degraded rate limiter must not take down all of auth — the refresh
    // store still enforces one-time-use, and login still needs valid
    // credentials; the limiter is defense-in-depth, not the security boundary.
    timeout: 2000,
  }));

/** Client IP on Vercel: x-forwarded-for's FIRST hop is set by the platform. */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** Standard 429 with Retry-After (seconds) per RFC 6585. */
export function tooManyRequests(resetMs: number): Response {
  const retryAfterSec = Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));
  return new Response(JSON.stringify({ error: "rate_limited" }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfterSec),
    },
  });
}
