/**
 * Central env access. Fails loudly at first use instead of deep in a request.
 * Secrets stay server-side: nothing here is NEXT_PUBLIC except APP_URL.
 */
export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  get databaseUrl() {
    // Project .env historically used DATABASE_URI; accept both.
    const v = process.env.DATABASE_URL ?? process.env.DATABASE_URI;
    if (!v) throw new Error("Missing DATABASE_URL (pooled Neon connection string)");
    return v;
  },
  get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },
  get isProd() {
    return process.env.NODE_ENV === "production";
  },
  get emailEnabled() {
    // Email module is optional: flips whole Resend integration on/off.
    return process.env.EMAIL_ENABLED === "true" && !!process.env.RESEND_API_KEY;
  },
};
