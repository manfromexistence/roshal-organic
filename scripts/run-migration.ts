import { readdirSync, readFileSync } from "node:fs";
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
  const drizzleDir = join(process.cwd(), "drizzle");
  const migrationFiles = readdirSync(drizzleDir)
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();

  for (const migrationFile of migrationFiles) {
    const migrationPath = join(drizzleDir, migrationFile);
    const sql = readFileSync(migrationPath, "utf-8");
    const statements = sql
      .split("--> statement-breakpoint")
      .map((statement) => statement.trim())
      .filter(Boolean);

    console.log(`Running ${migrationFile}...`);

    for (const statement of statements) {
      try {
        await client.execute(statement);
        console.log("Executed statement successfully");
      } catch (error) {
        console.error("Error executing statement:", error);
        console.error("Statement:", `${statement.substring(0, 100)}...`);
      }
    }
  }

  console.log("All migrations completed");
}

runMigration().catch(console.error);
