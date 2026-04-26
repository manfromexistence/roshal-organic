import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

async function testSchema() {
  console.log("Testing database schema...\n");

  try {
    // Get all table names
    const tables = await db.run(sql`
      SELECT name FROM sqlite_master WHERE type='table'
    `);

    console.log("Tables in database:");
    console.log(tables);
    console.log();

    // Check users table structure
    console.log("Users table structure:");
    const usersSchema = await db.run(sql`PRAGMA table_info(users)`);
    console.log(usersSchema);
    console.log();

    // Check accounts table structure
    console.log("Accounts table structure:");
    const accountsSchema = await db.run(sql`PRAGMA table_info(accounts)`);
    console.log(accountsSchema);
    console.log();

    // Check sessions table structure
    console.log("Sessions table structure:");
    const sessionsSchema = await db.run(sql`PRAGMA table_info(sessions)`);
    console.log(sessionsSchema);
    console.log();

    // Check files table structure
    console.log("Files table structure:");
    const filesSchema = await db.run(sql`PRAGMA table_info(files)`);
    console.log(filesSchema);
    console.log();

    // Check sample data
    console.log("Sample users data:");
    const users = await db.run(sql`SELECT * FROM users LIMIT 3`);
    console.log(users);
    console.log();

    console.log("Sample accounts data:");
    const accounts = await db.run(sql`SELECT * FROM accounts LIMIT 3`);
    console.log(accounts);
    console.log();

    console.log("Sample sessions data:");
    const sessions = await db.run(sql`SELECT * FROM sessions LIMIT 3`);
    console.log(sessions);
    console.log();
  } catch (error) {
    console.error("Error testing schema:", error);
  }
}

testSchema();
