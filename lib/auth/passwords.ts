import bcrypt from "bcryptjs";

/**
 * Password hashing — bcryptjs (pure JS: no native bindings, works on any
 * serverless runtime/OS without build steps).
 * Cost 12 ≈ 250ms hash: slow enough to gut offline cracking, fast enough
 * for a login endpoint that is already rate-limited to 10/min/IP.
 */
const COST = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash); // constant-time inside bcrypt
}

/**
 * Server-side policy check (client validates too, but the server is the
 * authority). Length over composition rules, per NIST 800-63B.
 */
export function passwordPolicyError(plain: string): string | null {
  if (plain.length < 8) return "Password must be at least 8 characters.";
  if (plain.length > 72) return "Password must be at most 72 characters."; // bcrypt input limit
  return null;
}
