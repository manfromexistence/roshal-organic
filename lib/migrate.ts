import { readFileSync } from "node:fs";
import { join } from "node:path";
import { db } from "./db";

export async function runMigration() {
  console.log("Running migration...");

  try {
    const migrationFile = readFileSync(
      join(process.cwd(), "drizzle", "0003_ancient_molecule_man.sql"),
      "utf-8",
    );

    // Split by statement-breakpoint and execute each statement
    const statements = migrationFile.split("--> statement-breakpoint");

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        await db.run(trimmed);
        console.log("Executed:", `${trimmed.substring(0, 50)}...`);
      }
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration if executed directly
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error running migration:", error);
      process.exit(1);
    });
}
