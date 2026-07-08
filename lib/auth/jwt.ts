import { SignJWT, jwtVerify, createRemoteJWKSet } from "jose";
import { getPrivateKey, getPublicKey, jwtKid, JWT_ALG } from "@/lib/auth/keys";
import { env } from "@/lib/env";

/** 15 minutes — short enough that a stolen access token has a small blast
 *  radius; refresh rotation handles longevity. */
export const ACCESS_TOKEN_TTL_SEC = 15 * 60;

/** Minimal claim set. No profile blobs in the token: anything else is a
 *  DB lookup by `sub`. Keeps cookies small and PII exposure minimal. */
export interface AccessTokenClaims {
  sub: string; // user id (uuid from Neon users table)
  email: string;
  name: string | null;
  image: string | null; // public avatar URL (Google CDN) or null — not PII-sensitive
  roles: string[];
  emailVerified: boolean;
}

const issuer = () => env.appUrl; // iss/aud pin tokens to this deployment;
const audience = () => env.appUrl; // a token minted for another app won't verify

export async function signAccessToken(claims: AccessTokenClaims): Promise<string> {
  return new SignJWT({
    email: claims.email,
    name: claims.name,
    image: claims.image,
    roles: claims.roles,
    emailVerified: claims.emailVerified,
  })
    .setProtectedHeader({ alg: JWT_ALG, kid: jwtKid(), typ: "JWT" })
    .setSubject(claims.sub)
    .setIssuer(issuer())
    .setAudience(audience())
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SEC}s`)
    .sign(await getPrivateKey());
}

/**
 * HOT PATH. Pure local RS256 verification — no Redis, no Neon, no network.
 * This is what makes per-request auth O(1) crypto instead of I/O.
 * Returns null (never throws) on any invalid/expired token.
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenClaims | null> {
  try {
    const { payload } = await jwtVerify(token, await getPublicKey(), {
      algorithms: [JWT_ALG], // pin alg: rejects alg-confusion (e.g. HS256 forgery)
      issuer: issuer(),
      audience: audience(),
    });
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : null,
      image: typeof payload.image === "string" ? payload.image : null,
      roles: Array.isArray(payload.roles) ? (payload.roles as string[]) : [],
      emailVerified: payload.emailVerified === true,
    };
  } catch {
    return null; // expired, bad signature, wrong iss/aud — all one answer: unauthenticated
  }
}

/**
 * For EXTERNAL services verifying our tokens independently:
 * point jose at our JWKS. Included here as reference usage.
 */
export function remoteVerifier(appUrl: string) {
  const jwks = createRemoteJWKSet(new URL("/.well-known/jwks.json", appUrl));
  return (token: string) =>
    jwtVerify(token, jwks, { algorithms: [JWT_ALG], issuer: appUrl, audience: appUrl });
}
