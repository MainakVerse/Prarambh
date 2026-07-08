import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { redis } from "@/lib/redis";

/**
 * Refresh-token store (Upstash Redis) with ROTATION + FAMILY THEFT DETECTION.
 *
 * Model:
 * - A "family" = one login (one device/browser). First token of a family is
 *   minted at sign-in; every refresh ROTATES: old token is marked used, a new
 *   one is issued in the SAME family.
 * - Theft detection: a refresh token is one-time-use. If a token arrives that
 *   is already used (or unknown but its family exists), someone replayed a
 *   stolen token — we can't tell attacker from victim, so we revoke the WHOLE
 *   family. Both parties get logged out; the victim just re-authenticates.
 *
 * Storage (all TTL'd to token expiry — Redis self-cleans, no cron needed):
 *   refresh:{userId}:{tokenId} -> { hash, familyId, used, exp }
 *   family:{userId}:{familyId} -> set of tokenIds (for family-wide revoke)
 *   families:{userId}          -> set of familyIds (for revoke-all-user)
 *
 * Only the SHA-256 HASH of the token is stored: a Redis dump/compromise
 * yields nothing replayable. The raw token exists only in the user's cookie.
 */

export const REFRESH_TTL_SEC = 30 * 24 * 60 * 60; // 30 days (spec: 7–30d)

interface StoredToken {
  hash: string;
  familyId: string;
  used: 0 | 1;
  exp: number; // epoch seconds
}

export interface RefreshToken {
  /** Opaque value that goes in the cookie: `${userId}.${tokenId}.${secret}` */
  cookieValue: string;
  tokenId: string;
  familyId: string;
  expiresAt: number;
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const tKey = (userId: string, tokenId: string) => `refresh:${userId}:${tokenId}`;
const fKey = (userId: string, familyId: string) => `family:${userId}:${familyId}`;
const uKey = (userId: string) => `families:${userId}`;

async function persist(userId: string, familyId: string, ttlSec: number): Promise<RefreshToken> {
  const tokenId = randomBytes(16).toString("base64url");
  const secret = randomBytes(32).toString("base64url"); // 256-bit entropy
  const exp = Math.floor(Date.now() / 1000) + ttlSec;

  const record: StoredToken = { hash: sha256(secret), familyId, used: 0, exp };

  // Pipeline: single round trip to Upstash.
  const p = redis.pipeline();
  p.set(tKey(userId, tokenId), record, { ex: ttlSec });
  p.sadd(fKey(userId, familyId), tokenId);
  p.expire(fKey(userId, familyId), ttlSec);
  p.sadd(uKey(userId), familyId);
  p.expire(uKey(userId), ttlSec);
  await p.exec();

  return { cookieValue: `${userId}.${tokenId}.${secret}`, tokenId, familyId, expiresAt: exp };
}

/** Issue the FIRST refresh token of a new family (call at sign-in). */
export async function issueRefreshToken(userId: string): Promise<RefreshToken> {
  return persist(userId, randomBytes(12).toString("base64url"), REFRESH_TTL_SEC);
}

export type RotateResult =
  | { ok: true; userId: string; next: RefreshToken }
  | { ok: false; reason: "invalid" | "expired" | "reuse_detected"; userId?: string };

/**
 * Validate + rotate in one step (refresh tokens are one-time-use, so
 * validation without rotation would burn the token anyway).
 */
export async function rotateRefreshToken(cookieValue: string): Promise<RotateResult> {
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return { ok: false, reason: "invalid" };
  const [userId, tokenId, secret] = parts;

  const record = await redis.get<StoredToken>(tKey(userId, tokenId));
  if (!record) {
    // Unknown tokenId. Either garbage, or a replay of a token that expired /
    // was already cleaned after family revocation. Nothing to revoke.
    return { ok: false, reason: "invalid" };
  }

  // Constant-time hash compare — no timing oracle on the secret.
  const a = Buffer.from(sha256(secret), "hex");
  const b = Buffer.from(record.hash, "hex");
  const hashOk = a.length === b.length && timingSafeEqual(a, b);

  if (!hashOk || record.used === 1) {
    // REPLAY: correct tokenId with wrong/used secret means the one-time token
    // was presented twice → assume theft, kill the whole family.
    await revokeFamily(userId, record.familyId);
    return { ok: false, reason: "reuse_detected", userId };
  }

  if (record.exp <= Math.floor(Date.now() / 1000)) {
    return { ok: false, reason: "expired", userId };
  }

  // Mark old token USED (keep it, with its remaining TTL, so a later replay
  // of it is detectable), then mint successor in the same family.
  const remaining = record.exp - Math.floor(Date.now() / 1000);
  await redis.set(tKey(userId, tokenId), { ...record, used: 1 }, { ex: Math.max(remaining, 60) });

  const next = await persist(userId, record.familyId, REFRESH_TTL_SEC);
  return { ok: true, userId, next };
}

/** Revoke one family (used on theft detection and on logout of one device). */
export async function revokeFamily(userId: string, familyId: string): Promise<void> {
  const tokenIds = await redis.smembers(fKey(userId, familyId));
  const p = redis.pipeline();
  for (const id of tokenIds) p.del(tKey(userId, id));
  p.del(fKey(userId, familyId));
  p.srem(uKey(userId), familyId);
  await p.exec();
}

/** Revoke EVERYTHING for a user (password-reset / account-compromise path). */
export async function revokeAllForUser(userId: string): Promise<void> {
  const familyIds = await redis.smembers(uKey(userId));
  await Promise.all(familyIds.map((f) => revokeFamily(userId, f)));
  await redis.del(uKey(userId));
}

/** Logout helper: revoke the family the presented cookie belongs to. */
export async function revokeByCookieValue(cookieValue: string): Promise<void> {
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return;
  const [userId, tokenId] = parts;
  const record = await redis.get<StoredToken>(tKey(userId, tokenId));
  if (record) await revokeFamily(userId, record.familyId);
}
