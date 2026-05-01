import { db } from "@/lib/db";

const reviewStatements = [
  `CREATE TABLE IF NOT EXISTS roshal_product_reviews (
    id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    user_id TEXT,
    reviewer_name TEXT NOT NULL,
    reviewer_email TEXT,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    is_published INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  )`,
];

let ensurePromise: Promise<void> | null = null;

async function runStatements() {
  for (const statement of reviewStatements) {
    await db.run(statement);
  }
}

export function ensureRoshalProductReviewSchema() {
  if (!ensurePromise) {
    ensurePromise = runStatements().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  return ensurePromise;
}
