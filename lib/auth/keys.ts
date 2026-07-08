import { importPKCS8, importSPKI, exportJWK, type JWK } from "jose";
import { requireEnv } from "@/lib/env";

/**
 * RS256 key material, loaded once per runtime from base64-PEM env vars.
 * Asymmetric signing (vs HS256) so ONLY this app can mint tokens while any
 * service can verify via the public JWKS — no shared secret to leak.
 */
const ALG = "RS256";

const fromB64 = (b64: string) => Buffer.from(b64, "base64").toString("utf8");

let privateKeyPromise: ReturnType<typeof importPKCS8> | null = null;
let publicKeyPromise: ReturnType<typeof importSPKI> | null = null;

export const JWT_ALG = ALG;
export const jwtKid = () => requireEnv("JWT_KID");

export function getPrivateKey() {
  // Lazy singletons: key import is CPU work; do it once per lambda instance.
  return (privateKeyPromise ??= importPKCS8(fromB64(requireEnv("JWT_PRIVATE_KEY")), ALG));
}

export function getPublicKey() {
  return (publicKeyPromise ??= importSPKI(fromB64(requireEnv("JWT_PUBLIC_KEY")), ALG));
}

/**
 * JWK set for /.well-known/jwks.json.
 * Includes JWT_PREVIOUS_PUBLIC_KEYS (comma-separated base64 PEMs) so tokens
 * signed before a key rotation still verify until they expire (≤15 min).
 */
export async function buildJwks(): Promise<{ keys: JWK[] }> {
  const keys: JWK[] = [];

  const current = await exportJWK(await getPublicKey());
  keys.push({ ...current, kid: jwtKid(), alg: ALG, use: "sig" });

  const previous = process.env.JWT_PREVIOUS_PUBLIC_KEYS;
  if (previous) {
    for (const pem of previous.split(",").map((s) => s.trim()).filter(Boolean)) {
      const jwk = await exportJWK(await importSPKI(fromB64(pem), ALG));
      // Old keys get a derived kid; verifiers match by `kid` from token header.
      const { createHash } = await import("node:crypto");
      const kid = createHash("sha256").update(fromB64(pem)).digest("base64url").slice(0, 16);
      keys.push({ ...jwk, kid, alg: ALG, use: "sig" });
    }
  }
  return { keys };
}
