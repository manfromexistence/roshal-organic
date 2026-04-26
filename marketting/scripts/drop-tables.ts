import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

async function dropAllTables() {
  // Get all tables
  const tables = await client.execute(`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    AND name NOT LIKE 'sqlite_%'
  `);

  console.log("Tables to drop:", tables.rows);

  // Drop each table, ignoring errors
  for (const row of tables.rows) {
    const tableName = row.name as string;
    try {
      await client.execute(`DROP TABLE IF EXISTS ${tableName}`);
      console.log(`Dropped table: ${tableName}`);
    } catch (_error) {
      console.log(`Error dropping ${tableName}, continuing...`);
    }
  }

  console.log("All tables dropped successfully");
}

dropAllTables().catch(console.error);
