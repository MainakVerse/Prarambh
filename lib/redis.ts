import { Redis } from "@upstash/redis";

/**
 * Upstash Redis over REST — works on both Node and Edge runtimes.
 * Singleton: REST client is stateless, safe to share.
 * Redis holds ONLY refresh-token state + rate-limit counters + short-lived
 * email-verification tokens. Access-token validation never reads Redis.
 */
const globalForRedis = globalThis as unknown as { __redis?: Redis };

export const redis =
  globalForRedis.__redis ?? (globalForRedis.__redis = Redis.fromEnv());
