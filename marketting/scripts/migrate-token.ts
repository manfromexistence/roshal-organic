import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

async function migrate() {
  const migrationFile = join(
    process.cwd(),
    "drizzle",
    "0001_worthless_ken_ellis.sql",
  );
  const sql = readFileSync(migrationFile, "utf-8");

  const statements = sql.split(";").filter((s) => s.trim());

  for (const statement of statements) {
    if (statement.trim()) {
      await client.execute(statement);
      console.log("Executed:", `${statement.substring(0, 50)}...`);
    }
  }

  console.log("Migration completed successfully");
}

migrate().catch(console.error);
