-- Credentials (email/password) login support.
-- NULL password_hash = OAuth-only account (Google): credentials login is
-- rejected for those until the user sets a password via reset flow.
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;
