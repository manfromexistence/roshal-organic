import { db } from "@/lib/db";

const taxonomyStatements = [
  `CREATE TABLE IF NOT EXISTS roshal_categories (
    id TEXT PRIMARY KEY NOT NULL,
    key TEXT NOT NULL UNIQUE,
    label_bn TEXT NOT NULL,
    label_en TEXT NOT NULL,
    description_bn TEXT,
    description_en TEXT,
    image_url TEXT,
    source_keys_json TEXT NOT NULL,
    is_enabled INTEGER NOT NULL DEFAULT 1,
    show_in_navigation INTEGER NOT NULL DEFAULT 1,
    show_on_homepage INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS roshal_subcategories (
    id TEXT PRIMARY KEY NOT NULL,
    category_id TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    label_bn TEXT NOT NULL,
    label_en TEXT NOT NULL,
    description_bn TEXT,
    description_en TEXT,
    image_url TEXT,
    source_keys_json TEXT NOT NULL,
    is_enabled INTEGER NOT NULL DEFAULT 1,
    show_in_navigation INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES roshal_categories(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS roshal_taxonomy_meta (
    id TEXT PRIMARY KEY NOT NULL,
    defaults_seeded INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
];

let ensurePromise: Promise<void> | null = null;

async function runStatements() {
  for (const statement of taxonomyStatements) {
    await db.run(statement);
  }
}

export function ensureRoshalTaxonomySchema() {
  if (!ensurePromise) {
    ensurePromise = runStatements().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  return ensurePromise;
}
