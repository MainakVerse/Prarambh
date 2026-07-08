import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";

/**
 * Neon serverless driver over HTTP.
 * - Use the POOLED connection string (host contains `-pooler`): serverless
 *   functions can spike to hundreds of concurrent invocations; PgBouncer on
 *   the pooler absorbs that instead of exhausting Postgres connections.
 * - Module-level singleton: one client per lambda instance, reused across
 *   requests. `neon()` is stateless HTTP so this is cheap AND safe.
 * - Neon stores ONLY user profiles. Sessions/tokens never touch Postgres
 *   (JWT strategy + Redis), so the auth hot path has zero DB latency.
 */
const globalForDb = globalThis as unknown as { __sql?: ReturnType<typeof neon> };

export const sql =
  globalForDb.__sql ?? (globalForDb.__sql = neon(env.databaseUrl));
