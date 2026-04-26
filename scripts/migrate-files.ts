import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

async function migrate() {
  console.log("Creating files table...");

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      file_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log("Files table created successfully!");
}

migrate().catch(console.error);
