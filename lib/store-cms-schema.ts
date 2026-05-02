import { db } from "@/lib/db";

const cmsStatements = [
  `CREATE TABLE IF NOT EXISTS roshal_pages (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL,
    navigation_label_bn TEXT NOT NULL,
    navigation_label_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_bn TEXT,
    description_en TEXT,
    hero_image TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    show_in_navigation INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS roshal_pages_slug_unique ON roshal_pages (slug)`,
  `ALTER TABLE roshal_pages ADD COLUMN hero_image TEXT`,
  `ALTER TABLE roshal_pages ADD COLUMN status TEXT NOT NULL DEFAULT 'published'`,
  `ALTER TABLE roshal_pages ADD COLUMN show_in_navigation INTEGER NOT NULL DEFAULT 1`,
  `CREATE TABLE IF NOT EXISTS roshal_sections (
    id TEXT PRIMARY KEY NOT NULL,
    page_id TEXT NOT NULL,
    section_key TEXT NOT NULL,
    type TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    layout TEXT NOT NULL DEFAULT 'stacked',
    variant TEXT NOT NULL DEFAULT 'default',
    is_enabled INTEGER NOT NULL DEFAULT 1,
    eyebrow_bn TEXT,
    eyebrow_en TEXT,
    title_bn TEXT,
    title_en TEXT,
    body_bn TEXT,
    body_en TEXT,
    cta_label_bn TEXT,
    cta_label_en TEXT,
    cta_href TEXT,
    image_url TEXT,
    items_json TEXT,
    styles_json TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (page_id) REFERENCES roshal_pages(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS roshal_sections_page_id_idx ON roshal_sections (page_id)`,
  `ALTER TABLE roshal_sections ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE roshal_sections ADD COLUMN layout TEXT NOT NULL DEFAULT 'stacked'`,
  `ALTER TABLE roshal_sections ADD COLUMN variant TEXT NOT NULL DEFAULT 'default'`,
  `ALTER TABLE roshal_sections ADD COLUMN is_enabled INTEGER NOT NULL DEFAULT 1`,
  `ALTER TABLE roshal_sections ADD COLUMN eyebrow_bn TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN eyebrow_en TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN title_bn TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN title_en TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN body_bn TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN body_en TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN cta_label_bn TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN cta_label_en TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN cta_href TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN image_url TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN items_json TEXT`,
  `ALTER TABLE roshal_sections ADD COLUMN styles_json TEXT`,
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
  for (const statement of cmsStatements) {
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

export function ensureRoshalCmsSchema() {
  if (!ensurePromise) {
    ensurePromise = runStatements().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  return ensurePromise;
}
