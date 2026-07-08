import { handlers } from "@/auth";

/**
 * Auth.js catch-all: /api/auth/signin, /api/auth/callback/google,
 * /api/auth/signout, /api/auth/session, CSRF, etc.
 * Node runtime (not edge): sign-in path touches Neon + node:crypto.
 * Rate limiting for these routes lives in middleware.ts.
 */
export const { GET, POST } = handlers;
export const runtime = "nodejs";
