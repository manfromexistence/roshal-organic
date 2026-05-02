import { db } from "@/lib/db";

const productStatements = [
  `CREATE TABLE IF NOT EXISTS roshal_products (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL,
    sku TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    summary_bn TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    description_en TEXT NOT NULL,
    category_key TEXT NOT NULL,
    category_label_bn TEXT NOT NULL,
    category_label_en TEXT NOT NULL,
    price INTEGER NOT NULL,
    compare_at_price INTEGER,
    inventory INTEGER NOT NULL DEFAULT 0,
    badge TEXT,
    hero_image TEXT NOT NULL,
    gallery_json TEXT,
    features_bn_json TEXT,
    features_en_json TEXT,
    purchase_options_json TEXT,
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_published INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS roshal_products_slug_unique ON roshal_products (slug)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS roshal_products_sku_unique ON roshal_products (sku)`,
  `ALTER TABLE roshal_products ADD COLUMN purchase_options_json TEXT`,
];

let ensurePromise: Promise<void> | null = null;

function collectErrorMessages(error: unknown) {
  const messages: string[] = [];
  let current: unknown = error;

  while (current) {
    if (current instanceof Error) {
      messages.push(current.message);
      current = "cause" in current ? current.cause : null;
      continue;
    }

    messages.push(String(current));
    break;
  }

  return messages.join(" | ").toLowerCase();
}

async function runStatements() {
  for (const statement of productStatements) {
    try {
      await db.run(statement);
    } catch (error) {
      const message = collectErrorMessages(error);

      if (
        statement.startsWith("ALTER TABLE") &&
        message.includes("duplicate column name")
      ) {
        continue;
      }

      throw error;
    }
  }
}

export function ensureRoshalProductSchema() {
  if (!ensurePromise) {
    ensurePromise = runStatements().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  return ensurePromise;
}
