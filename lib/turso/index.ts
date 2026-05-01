import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

let _db: any = null;

export const db = new Proxy({} as any, {
  get(_target, prop) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for Turso data access.");
    }

    if (!_db) {
      const client = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      });
      _db = drizzle({ client, schema });
    }

    return _db[prop];
  },
});
