import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@libsql/client";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

async function runMigration() {
  const migrationPath = join(
    process.cwd(),
    "drizzle",
    "0002_wide_forgotten_one.sql",
  );
  const sql = readFileSync(migrationPath, "utf-8");

  // Split by statement breakpoint and execute each statement
  const statements = sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s);

  for (const statement of statements) {
    if (statement) {
      try {
        await client.execute(statement);
        console.log("Executed statement successfully");
      } catch (error) {
        console.error("Error executing statement:", error);
        console.error("Statement:", `${statement.substring(0, 100)}...`);
      }
    }
  }

  console.log("Migration completed");
}

runMigration().catch(console.error);
