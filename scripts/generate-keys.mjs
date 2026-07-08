/**
 * RS256 key pair + JWK generator.
 *
 * Usage: node scripts/generate-keys.mjs
 *
 * Prints env-ready values. Keys are emitted as base64-encoded PEM so they fit
 * in a single-line env var (Vercel env UI mangles multiline values).
 * NEVER commit the private key. Paste output into .env / Vercel env manager.
 */
import { generateKeyPairSync, createHash, randomBytes } from "node:crypto";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048, // 2048 = RS256 baseline; bump to 4096 if policy requires
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

// kid = stable fingerprint of the public key. Lets JWKS serve multiple keys
// during rotation: verifiers pick the right key by kid from the token header.
const kid = createHash("sha256").update(publicKey).digest("base64url").slice(0, 16);

const b64 = (s) => Buffer.from(s, "utf8").toString("base64");

console.log("# --- Paste into .env (and Vercel env manager) ---");
console.log(`JWT_PRIVATE_KEY=${b64(privateKey)}`);
console.log(`JWT_PUBLIC_KEY=${b64(publicKey)}`);
console.log(`JWT_KID=${kid}`);
console.log(`# AUTH_SECRET (for Auth.js CSRF/state encryption):`);
console.log(`AUTH_SECRET=${randomBytes(32).toString("base64url")}`);
console.log("");
console.log("# Key rotation: run this script again, add the NEW pair as the");
console.log("# active signer, and keep the OLD public key in JWT_PREVIOUS_PUBLIC_KEYS");
console.log("# (comma-separated base64 PEMs) so the JWKS still serves it until all");
console.log("# 15-minute access tokens signed by it have expired.");
