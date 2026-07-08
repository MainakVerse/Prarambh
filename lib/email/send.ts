import { Resend } from "resend";
import { randomBytes } from "node:crypto";
import { env } from "@/lib/env";
import { redis } from "@/lib/redis";
import { verificationEmail, newDeviceAlertEmail, revocationAlertEmail, passwordResetEmail } from "@/lib/email/templates";

/**
 * Resend integration — OPTIONAL module. Every entry point no-ops unless
 * EMAIL_ENABLED=true and RESEND_API_KEY is set, so the auth system runs
 * without an email account configured.
 *
 * All sends are fire-and-forget from the caller's perspective: an email
 * outage must never block login/refresh. Failures are logged, not thrown.
 */
let _resend: Resend | null = null;
const resend = () => (_resend ??= new Resend(process.env.RESEND_API_KEY));
const FROM = () => process.env.EMAIL_FROM ?? "Auth <onboarding@resend.dev>";

async function safeSend(to: string, tpl: { subject: string; html: string }) {
  if (!env.emailEnabled) return;
  try {
    await resend().emails.send({ from: FROM(), to, ...tpl });
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

/**
 * Create a one-time verification token in Redis (24h TTL) and mail the link.
 * Token is random 256-bit, stored hashed-equivalent (opaque, single lookup key).
 */
export async function sendVerificationEmail(userId: string, email: string) {
  if (!env.emailEnabled) return;
  const token = randomBytes(32).toString("base64url");
  await redis.set(`verify:${token}`, userId, { ex: 24 * 60 * 60 });
  const url = `${env.appUrl}/api/auth/verify-email?token=${token}`;
  await safeSend(email, verificationEmail(url));
}

/** Consume a verification token. Returns userId or null. One-time-use. */
export async function consumeVerificationToken(token: string): Promise<string | null> {
  // GETDEL: atomic read+delete — the link can't be used twice.
  const userId = await redis.getdel<string>(`verify:${token}`);
  return userId ?? null;
}

/**
 * Password reset: one-time token in Redis, 1h TTL. Link opens the auth modal
 * in reset mode on the landing page.
 */
export async function sendPasswordResetEmail(userId: string, email: string) {
  if (!env.emailEnabled) return;
  const token = randomBytes(32).toString("base64url");
  await redis.set(`pwreset:${token}`, userId, { ex: 60 * 60 });
  const url = `${env.appUrl}/?auth=reset&token=${token}`;
  await safeSend(email, passwordResetEmail(url));
}

/** Consume a reset token atomically (GETDEL — single use). */
export async function consumeResetToken(token: string): Promise<string | null> {
  const userId = await redis.getdel<string>(`pwreset:${token}`);
  return userId ?? null;
}

export async function sendNewDeviceAlert(email: string, ip: string, userAgent: string) {
  await safeSend(email, newDeviceAlertEmail({ time: new Date().toUTCString(), ip, userAgent }));
}

export async function sendRevocationAlert(email: string) {
  await safeSend(email, revocationAlertEmail());
}

/**
 * Device memory for new-device alerts: remember hash(UA+IP-prefix) per user.
 * Coarse on purpose — goal is "alert on new browser/network", not tracking.
 */
export async function isNewDevice(userId: string, ip: string, userAgent: string): Promise<boolean> {
  const { createHash } = await import("node:crypto");
  const fp = createHash("sha256").update(`${userAgent}|${ip.split(".").slice(0, 3).join(".")}`).digest("hex");
  const added = await redis.sadd(`devices:${userId}`, fp);
  await redis.expire(`devices:${userId}`, 90 * 24 * 60 * 60); // 90d memory
  return added === 1; // sadd returns 1 only if fingerprint was unseen
}
