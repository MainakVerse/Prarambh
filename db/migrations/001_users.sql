-- Users table: the ONLY auth-related data in Neon.
-- No sessions, no tokens here — sessions are stateless JWTs, refresh state
-- lives in Redis. Postgres is touched only at sign-in (upsert) and for
-- profile reads.
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid()

CREATE TABLE IF NOT EXISTS users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          text NOT NULL UNIQUE,
  name           text,
  image          text,
  roles          text[] NOT NULL DEFAULT ARRAY['user'],
  email_verified boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Sign-in hot lookup is by email (from Google profile).
CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users (lower(email));
