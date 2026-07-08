import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmailWithPassword } from "@/lib/auth/users";
import { verifyPassword } from "@/lib/auth/passwords";
import { cookies, headers } from "next/headers";
import { signAccessToken, verifyAccessToken, ACCESS_TOKEN_TTL_SEC } from "@/lib/auth/jwt";
import { issueRefreshToken, REFRESH_TTL_SEC } from "@/lib/auth/refresh-store";
import { ACCESS_COOKIE, REFRESH_COOKIE, accessCookieOptions, refreshCookieOptions } from "@/lib/auth/cookies";
import { upsertUserFromOAuth } from "@/lib/auth/users";
import { sendVerificationEmail, sendNewDeviceAlert, isNewDevice } from "@/lib/email/send";
import { env } from "@/lib/env";

/**
 * Auth.js (NextAuth v5) — Google OAuth, JWT strategy, RS256 tokens.
 *
 * Key design decision: we OVERRIDE Auth.js's jwt encode/decode. By default
 * Auth.js issues an encrypted JWE only it can read. We replace that with our
 * own RS256-SIGNED access token, so:
 *   - the Auth.js session cookie IS the access token (one cookie, no drift),
 *   - `auth()` verification = local public-key check (no Redis/Neon — hot
 *     path is pure crypto),
 *   - any external service can verify the same token via /.well-known/jwks.json.
 * Claims are signed, not encrypted — so we keep them minimal and non-secret:
 * sub, email, roles, exp, iss, aud (+ emailVerified flag).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      // Env-based credentials; Auth.js also auto-reads AUTH_GOOGLE_ID/SECRET,
      // but we bind explicitly to the vars this project already defines.
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      /**
       * Email/password login. Runs on the already-rate-limited auth path.
       * Returns null (generic failure) for EVERY failure mode — wrong email,
       * wrong password, OAuth-only account — so responses don't reveal
       * whether an email is registered (user-enumeration resistance).
       */
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const user = await getUserByEmailWithPassword(email);
        // OAuth-only accounts have no hash: reject, don't reveal why.
        if (!user?.password_hash) return null;
        if (!(await verifyPassword(password, user.password_hash))) return null;

        // Everything returned here lands on the `user` param of the jwt
        // callback — same claim shape as the OAuth path.
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          emailVerified: user.email_verified,
        } as never;
      },
    }),
  ],

  // JWT strategy: NO session rows in Neon. Session lives in the signed cookie.
  session: {
    strategy: "jwt",
    maxAge: ACCESS_TOKEN_TTL_SEC, // 15 min — client refreshes via /api/auth/refresh
  },

  // Secure cookie flags (see lib/auth/cookies.ts for the rationale).
  cookies: {
    sessionToken: {
      name: ACCESS_COOKIE,
      options: accessCookieOptions,
    },
  },

  // trustHost: Vercel terminates TLS at the proxy; without this Auth.js
  // rejects the forwarded host. Safe because Vercel sets the header itself.
  trustHost: true,

  jwt: {
    /**
     * encode: called when Auth.js writes the session cookie.
     * Emits our RS256 JWT with the minimal claim set.
     */
    async encode({ token }) {
      if (!token?.sub) throw new Error("Cannot encode session without sub");
      return signAccessToken({
        sub: token.sub,
        email: (token.email as string) ?? "",
        name: (token.name as string | null) ?? null,
        image: (token.image as string | null) ?? null,
        roles: (token.roles as string[]) ?? ["user"],
        emailVerified: token.emailVerified === true,
      });
    },
    /**
     * decode: called on EVERY auth() — this is the hot path.
     * Local RS256 verify only. Returns null on any failure = logged out.
     */
    async decode({ token }) {
      if (!token) return null;
      const claims = await verifyAccessToken(token);
      if (!claims) return null;
      return {
        sub: claims.sub,
        email: claims.email,
        name: claims.name,
        image: claims.image,
        roles: claims.roles,
        emailVerified: claims.emailVerified,
      };
    },
  },

  callbacks: {
    /**
     * Runs at sign-in (trigger === "signIn") and whenever the cookie is
     * re-encoded. Sign-in is the ONLY place we touch Neon/Redis here.
     */
    async jwt({ token, trigger, profile, user: authUser }) {
      if (trigger === "signIn") {
        let identity: {
          id: string;
          email: string;
          name: string | null;
          image: string | null;
          roles: string[];
          emailVerified: boolean;
          isNew: boolean;
        };

        if (profile?.email) {
          // OAuth path: upsert profile in Neon (the only user data Postgres holds).
          const { user, isNew } = await upsertUserFromOAuth({
            email: profile.email,
            name: (profile.name as string) ?? null,
            image: (profile.picture as string) ?? null,
          });
          identity = {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            roles: user.roles,
            emailVerified: user.email_verified,
            isNew,
          };
        } else if (authUser?.id && authUser.email) {
          // Credentials path: authorize() already verified the password and
          // loaded the row — no second DB hit. No Google avatar here: image
          // stays null so the UI falls back to initials.
          const u = authUser as { id: string; email: string; name?: string | null; roles?: string[]; emailVerified?: boolean };
          identity = {
            id: u.id,
            email: u.email,
            name: u.name ?? null,
            image: null,
            roles: u.roles ?? ["user"],
            emailVerified: u.emailVerified === true,
            isNew: false,
          };
        } else {
          return token; // unknown sign-in shape — leave token unauthenticated
        }

        // Token identity = OUR user id, not the provider's — providers are swappable.
        token.sub = identity.id;
        token.email = identity.email;
        token.name = identity.name;
        token.image = identity.image;
        token.roles = identity.roles;
        token.emailVerified = identity.emailVerified;
        const user = { id: identity.id, email: identity.email, email_verified: identity.emailVerified };
        const isNew = identity.isNew;

        // 2) Mint the rotating refresh token (new family = this device).
        //    Cookie is path-scoped to the refresh endpoint only.
        try {
          const refresh = await issueRefreshToken(user.id);
          cookies().set(REFRESH_COOKIE, refresh.cookieValue, refreshCookieOptions(REFRESH_TTL_SEC));
        } catch (err) {
          // Refresh issuance failing must not block login; user just gets a
          // 15-min session and re-authenticates.
          console.error("[auth] refresh token issuance failed:", err);
        }

        // 3) Optional email side effects — fully fire-and-forget. Wrapped in
        // an async IIFE (not awaited) so the isNewDevice Redis round-trip
        // can't add latency to the login response.
        if (env.emailEnabled) {
          const h = headers();
          const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
          const ua = h.get("user-agent") ?? "unknown";
          void (async () => {
            try {
              if (isNew && !user.email_verified) {
                await sendVerificationEmail(user.id, user.email);
              } else if (await isNewDevice(user.id, ip, ua)) {
                await sendNewDeviceAlert(user.email, ip, ua);
              }
            } catch (err) {
              console.error("[auth] email side effect failed:", err);
            }
          })();
        }
      }
      return token;
    },

    /** Shape `session` from verified token claims — no I/O. */
    async session({ session, token }) {
      if (token.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
          email: (token.email as string) ?? session.user?.email ?? "",
          name: (token.name as string | null) ?? null,
          image: (token.image as string | null) ?? null,
          roles: (token.roles as string[]) ?? [],
          emailVerified: token.emailVerified === true,
        } as typeof session.user & { id: string; roles: string[]; emailVerified: boolean };
      }
      return session;
    },
  },

  pages: {
    // Default Auth.js pages are fine to start; point these at custom routes
    // when the app grows its own /login UI.
  },
});
