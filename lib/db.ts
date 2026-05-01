import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim().replace(/^["']|["']$/g, "");
  return trimmed || undefined;
}

const databaseUrl = cleanEnvValue(process.env.DATABASE_URL);

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for Roshal Organic data access.");
}

const client = createClient({
  url: databaseUrl,
  authToken: cleanEnvValue(process.env.DATABASE_AUTH_TOKEN),
});

export const db = drizzle(client);
