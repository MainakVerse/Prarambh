# Auth System — Architecture & Setup

Production auth for Next.js 14 (App Router) + Auth.js v5 + Neon + Upstash + Vercel.

## Request Flow

```
┌─────────┐  1. GET /api/auth/signin/google        ┌────────────┐
│ Browser │ ─────────────────────────────────────▶ │  Google    │
│         │ ◀───────── OAuth consent + redirect ── │  OAuth     │
└─────────┘                                        └────────────┘
     │ 2. /api/auth/callback/google
     ▼
┌──────────────────────────────────────────────────────────────┐
│ Auth.js jwt callback (sign-in only):                         │
│   • upsert user in NEON (profile only — id/email/roles)     │
│   • issue refresh token family in REDIS (hashed, 30d TTL)   │
│   • optional: verification / new-device email via RESEND    │
│ Cookies set:                                                 │
│   access  = RS256 JWT, 15 min, httpOnly Secure Lax, path=/  │
│   refresh = opaque,   30 d,   httpOnly Secure Lax,          │
│             path=/api/auth/refresh ONLY                     │
└──────────────────────────────────────────────────────────────┘
     │ 3. Normal requests (HOT PATH)
     ▼
┌──────────────────────────────────────────────────────────────┐
│ auth() / getCurrentUser(): verify RS256 signature locally   │
│ with the PUBLIC key. NO Redis. NO Neon. NO network. O(1).   │
└──────────────────────────────────────────────────────────────┘
     │ 4. Access token expires (≤15 min)
     ▼
┌──────────────────────────────────────────────────────────────┐
│ POST /api/auth/refresh (the ONLY Redis-touching auth route) │
│   • validate refresh token hash in Redis (constant-time)   │
│   • ROTATE: old marked used, new token in same family      │
│   • REPLAY of a used token ⇒ revoke ENTIRE family (theft)  │
│     + security email                                        │
│   • re-read roles from Neon ⇒ new 15-min access token      │
└──────────────────────────────────────────────────────────────┘
     │ 5. Logout / revocation
     ▼
  DELETE /api/auth/refresh      → revoke this device's family
  POST   /api/auth/revoke-all   → revoke every family (all devices)
```

**Why this shape:** access tokens are verifiable by signature alone, so per-request
auth costs zero I/O and scales with CPU, not with Redis/Postgres limits. Revocation
latency is bounded by the access-token TTL (≤15 min) — the classic stateless-JWT
trade-off, made acceptable by short TTL + rotating refresh tokens.

## File Map

```
auth.ts                              Auth.js config (Google, JWT strategy, RS256 encode/decode)
middleware.ts                        Rate limit /api/auth/* (10/min/IP, sliding window)
scripts/generate-keys.mjs            RS256 keypair + kid + AUTH_SECRET generator
db/migrations/001_users.sql          Neon schema (users only — NO sessions)
lib/
  env.ts                             Env access + validation
  db.ts                              Neon serverless client (singleton, pooled URL)
  redis.ts                           Upstash Redis client (singleton, REST)
  ratelimit.ts                       Upstash sliding-window limiter + 429 helper
  auth/
    keys.ts                          Key loading + JWKS building (kid, rotation)
    jwt.ts                           RS256 sign/verify, 15-min TTL, minimal claims
    cookies.ts                       Cookie names/flags (httpOnly, Secure, Lax, path scoping)
    refresh-store.ts                 Redis: issue/rotate/validate/revoke + family theft detection
    users.ts                         Neon user upsert/get
    session.ts                       getCurrentUser() — pure hot-path verify
  email/
    send.ts                          Resend integration (optional via EMAIL_ENABLED)
    templates.ts                     Verification / new-device / revocation emails
app/api/
  auth/[...nextauth]/route.ts        Auth.js handlers (signin, callback, signout…)
  auth/refresh/route.ts              POST rotate · DELETE logout
  auth/revoke-all/route.ts           POST revoke all devices
  auth/verify-email/route.ts         Email-verification link target
  jwks/route.ts                      JWKS (rewritten from /.well-known/jwks.json)
types/next-auth.d.ts                 Session/JWT type augmentation
.env.example                         All required env vars, annotated
```

## Local Setup

```bash
npm install                          # deps already added to package.json
node scripts/generate-keys.mjs       # → paste output into .env
cp .env.example .env                 # fill in the rest
# apply schema (psql or Neon SQL editor):
#   run db/migrations/001_users.sql against your Neon database
npm run dev
```

Sign in at `http://localhost:3000/api/auth/signin`.

## Usage in Code

```ts
// Server component / route handler — hot path, zero I/O:
import { getCurrentUser } from "@/lib/auth/session";
const user = await getCurrentUser();          // { sub, email, roles, emailVerified } | null

// Or the Auth.js shape:
import { auth } from "@/auth";
const session = await auth();                 // session.user.id / .roles

// Client: refresh before/after access expiry (15 min):
await fetch("/api/auth/refresh", { method: "POST" });   // rotates silently
await fetch("/api/auth/refresh", { method: "DELETE" }); // logout this device
await fetch("/api/auth/revoke-all", { method: "POST" }); // logout everywhere
```

External services verify tokens against `https://yourdomain.com/.well-known/jwks.json`
(see `remoteVerifier()` in `lib/auth/jwt.ts`).

## Security Decisions (summary)

| Decision | Why |
|---|---|
| RS256, not HS256 | Only the app holds the private key; verifiers need only the public JWKS. No shared secret sprawl. |
| 15-min access / 30-day rotating refresh | Bounds stolen-access-token damage to 15 min; refresh is one-time-use so a stolen refresh token dies on first legit reuse. |
| Family revocation on replay | Can't distinguish attacker from victim when a used token reappears — revoke both, victim re-logs-in. |
| Refresh tokens hashed (SHA-256) in Redis | Redis compromise yields nothing replayable. |
| Refresh cookie path=/api/auth/refresh | Browser never attaches the long-lived credential to any other request. |
| httpOnly + Secure + `__Secure-` prefix + SameSite=Lax | No JS access (XSS), no plaintext transport, browser-enforced Secure, CSRF-hostile default that still allows the OAuth redirect. |
| Hot path = local signature check | Auth scales with CPU; Redis/Neon outages can't take down request auth. |
| Constant-time hash compare | No timing oracle on refresh-token secrets. |
| iss/aud pinned to app URL, alg pinned to RS256 | Cross-app token confusion and alg-substitution both fail verification. |
| Neon pooled endpoint + singleton client | Serverless concurrency spikes hit PgBouncer, not raw Postgres connections. |

## ⚠️ MANUAL DASHBOARD SETUP — CHECKLIST

### 1. Google Cloud Console (console.cloud.google.com)
- [ ] APIs & Services → Credentials → your OAuth 2.0 Client ID
- [ ] **Authorized JavaScript origins**: add
  - `http://localhost:3000`
  - `https://yourdomain.com`
- [ ] **Authorized redirect URIs**: add EXACTLY
  - `http://localhost:3000/api/auth/callback/google`
  - `https://yourdomain.com/api/auth/callback/google`
- [ ] OAuth consent screen: publish (or add test users while in Testing mode)

### 2. Neon (console.neon.tech)
- [ ] Copy the **pooled** connection string (host contains `-pooler`) → `DATABASE_URL`
- [ ] SQL Editor → run `db/migrations/001_users.sql`

### 3. Upstash (console.upstash.com)
- [ ] Create a Redis database (pick region nearest your Vercel region)
- [ ] Copy **REST URL** and **REST TOKEN** → `UPSTASH_REDIS_REST_URL` / `_TOKEN`

### 4. Resend (resend.com) — optional
- [ ] Create API key → `RESEND_API_KEY`
- [ ] Verify your sending domain (SPF + DKIM DNS records) → set `EMAIL_FROM`
- [ ] Set `EMAIL_ENABLED=true`

### 5. Vercel (vercel.com)
- [ ] Project → Settings → Environment Variables: add EVERY var from `.env.example`
  - All are **runtime** (Production + Preview). `NEXT_PUBLIC_APP_URL` is also
    **build-time** (inlined into the client bundle) — set it before building.
  - Mark `JWT_PRIVATE_KEY`, `AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`,
    `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `DATABASE_URL` as **Sensitive**.
- [ ] Settings → Domains: add `yourdomain.com` + follow the DNS instructions
  (A/ALIAS or CNAME). SSL cert is provisioned **automatically** (Let's Encrypt);
  HTTP→HTTPS redirect is automatic.
- [ ] After the domain is live: set `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
  in Production env and **redeploy** (build-time var).
- [ ] Confirm the Google redirect URI (step 1) uses the final HTTPS domain.

### HTTPS notes
- Production cookies use the `__Secure-` prefix + `Secure` flag — they simply
  won't be set over plain HTTP. Localhost dev falls back to non-prefixed,
  non-Secure cookies automatically (`NODE_ENV`-based, see `lib/auth/cookies.ts`).
- All email links and OAuth redirects derive from `NEXT_PUBLIC_APP_URL`, so
  prod must set it to the `https://` domain.

## Operational Notes
- **Key rotation**: run `node scripts/generate-keys.mjs`, set the new pair as
  `JWT_PRIVATE_KEY`/`JWT_PUBLIC_KEY`/`JWT_KID`, move the old public key into
  `JWT_PREVIOUS_PUBLIC_KEYS`. JWKS serves both; drop the old one after 15 min.
- **Role changes** propagate at next refresh (≤15 min) — refresh re-reads Neon.
- **Rate limit** also covers `/api/auth/session`; if you use `useSession()`
  with aggressive polling client-side, raise the limit or exclude that path in
  `middleware.ts`.
- Auth.js's built-in `signOut()` clears the access cookie but can't reach the
  path-scoped refresh cookie — use `DELETE /api/auth/refresh` for real logout.
