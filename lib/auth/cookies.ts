import { env } from "@/lib/env";

/**
 * Cookie policy — the only place cookie names/flags are defined.
 *
 * - httpOnly: tokens are NEVER readable from client JS (kills XSS token theft;
 *   nothing goes to localStorage, ever).
 * - secure: HTTPS-only in prod. `__Secure-` prefix makes the browser ENFORCE
 *   the Secure flag — a downgraded/spoofed cookie is rejected by the browser.
 * - sameSite=lax: cookies ride top-level navigations (OAuth redirect back from
 *   Google works) but not cross-site subrequests (CSRF-hostile default).
 * - refresh cookie is PATH-SCOPED to the refresh endpoint: the browser only
 *   attaches the long-lived credential to that one route, so it never leaks
 *   into normal page/API traffic and a logged request can't capture it.
 */
export const REFRESH_PATH = "/api/auth/refresh";

export const ACCESS_COOKIE = env.isProd ? "__Secure-authjs.session-token" : "authjs.session-token";
export const REFRESH_COOKIE = env.isProd ? "__Secure-refresh-token" : "refresh-token";

export const accessCookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: "lax" as const,
  path: "/",
};

export const refreshCookieOptions = (maxAgeSec: number) => ({
  httpOnly: true,
  secure: env.isProd,
  sameSite: "lax" as const,
  path: REFRESH_PATH, // scope: only sent to the refresh endpoint
  maxAge: maxAgeSec,
});
