import { sql } from "@/lib/db";

export interface UserRow {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: string[];
  email_verified: boolean;
  created_at: string;
}

/**
 * Upsert at OAuth sign-in. Google emails arrive pre-verified by Google, but
 * we still run our own verification mail (defense in depth + provider-agnostic
 * if more providers are added later). Runs ONCE per login, never per request.
 * Returns row + whether this was a first-time signup.
 */
export async function upsertUserFromOAuth(profile: {
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<{ user: UserRow; isNew: boolean }> {
  const rows = (await sql`
    INSERT INTO users (email, name, image)
    VALUES (${profile.email.toLowerCase()}, ${profile.name ?? null}, ${profile.image ?? null})
    ON CONFLICT (email) DO UPDATE
      SET name = COALESCE(EXCLUDED.name, users.name),
          image = COALESCE(EXCLUDED.image, users.image),
          updated_at = now()
    RETURNING *, (xmax = 0) AS is_new
  `) as (UserRow & { is_new: boolean })[];

  const row = rows[0];
  if (!row) throw new Error("User upsert returned no row");
  return { user: row, isNew: row.is_new };
}

/** Includes password_hash — for the credentials-login path ONLY. */
export async function getUserByEmailWithPassword(
  email: string
): Promise<(UserRow & { password_hash: string | null }) | null> {
  const rows = (await sql`
    SELECT * FROM users WHERE email = ${email.toLowerCase()}
  `) as (UserRow & { password_hash: string | null })[];
  return rows[0] ?? null;
}

/**
 * Email/password signup. Fails on duplicate email (no upsert: silently
 * linking a password onto an existing OAuth account would let anyone who
 * knows the email hijack it — linking requires the reset-password flow,
 * which proves mailbox ownership).
 */
export async function createUserWithPassword(input: {
  email: string;
  name: string | null;
  passwordHash: string;
}): Promise<UserRow | null> {
  const rows = (await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (${input.email.toLowerCase()}, ${input.name}, ${input.passwordHash})
    ON CONFLICT (email) DO NOTHING
    RETURNING *
  `) as UserRow[];
  return rows[0] ?? null; // null = email already registered
}

/** Reset flow: set new hash. Caller must have verified mailbox ownership. */
export async function setPasswordHash(id: string, passwordHash: string): Promise<void> {
  await sql`UPDATE users SET password_hash = ${passwordHash}, updated_at = now() WHERE id = ${id}`;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const rows = (await sql`SELECT * FROM users WHERE id = ${id}`) as UserRow[];
  return rows[0] ?? null;
}

export async function markEmailVerified(id: string): Promise<void> {
  await sql`UPDATE users SET email_verified = true, updated_at = now() WHERE id = ${id}`;
}
