/**
 * Tiny idempotent migration runner: applies db/migrations/*.sql in order,
 * recording applied files in _migrations. Safe to re-run.
 * Usage: node scripts/migrate.mjs
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// minimal .env loader (no dotenv dep); tolerates `KEY = 'value'` style
for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
}

const url = process.env.DATABASE_URL ?? process.env.DATABASE_URI;
if (!url) throw new Error("DATABASE_URL / DATABASE_URI not set");
const sql = neon(url);

await sql`CREATE TABLE IF NOT EXISTS _migrations (
  name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now()
)`;

const applied = new Set((await sql`SELECT name FROM _migrations`).map((r) => r.name));
const dir = join(process.cwd(), "db", "migrations");

for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (applied.has(file)) {
    console.log(`skip   ${file}`);
    continue;
  }
  const body = readFileSync(join(dir, file), "utf8")
    .split(/\r?\n/)
    .map((l) => l.replace(/--.*$/, "")) // strip line comments
    .join("\n");
  // Statements split on `;` — keep migrations simple (no functions/
  // procedures with embedded semicolons or `--` inside string literals).
  for (const stmt of body.split(";").map((s) => s.trim()).filter(Boolean)) {
    await sql.query(stmt);
  }
  await sql`INSERT INTO _migrations (name) VALUES (${file})`;
  console.log(`apply  ${file}`);
}
console.log("done");
