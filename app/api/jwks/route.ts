import { NextResponse } from "next/server";
import { buildJwks } from "@/lib/auth/keys";

export const runtime = "nodejs";
// Evaluate at request time, not build time: keys come from runtime env and
// must be rotatable without a rebuild.
export const dynamic = "force-dynamic";

/**
 * JWKS endpoint — served at /.well-known/jwks.json via a rewrite in
 * next.config.mjs (Next 14's app router ignores dot-prefixed folders, so the
 * route physically lives at /api/jwks).
 *
 * PUBLIC keys only — safe to expose; that's the point: any service verifies
 * our access tokens without sharing secrets, and key rotation is just
 * "publish new key, keep old one until in-flight tokens expire".
 */
export async function GET() {
  const jwks = await buildJwks();
  return NextResponse.json(jwks, {
    headers: {
      // Cache aggressively; rotation tolerance is minutes, not seconds.
      "Cache-Control": "public, max-age=300, stale-while-revalidate=300",
    },
  });
}
