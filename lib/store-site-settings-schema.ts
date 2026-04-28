import { db } from "@/lib/db";

const siteSettingsStatements = [
  `CREATE TABLE IF NOT EXISTS roshal_site_settings (
    id TEXT PRIMARY KEY NOT NULL,
    brand_name TEXT NOT NULL DEFAULT 'Roshal Organic',
    tagline_bn TEXT NOT NULL,
    tagline_en TEXT NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    whatsapp_phone TEXT,
    address_bn TEXT,
    address_en TEXT,
    hero_layout TEXT NOT NULL DEFAULT 'split',
    card_style TEXT NOT NULL DEFAULT 'soft',
    section_spacing TEXT NOT NULL DEFAULT 'comfortable',
    primary_cta_href TEXT NOT NULL DEFAULT '/products',
    primary_cta_label_bn TEXT NOT NULL,
    primary_cta_label_en TEXT NOT NULL,
    delivery_zones_json TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `ALTER TABLE roshal_site_settings ADD COLUMN delivery_zones_json TEXT`,
];

let ensurePromise: Promise<void> | null = null;

async function runStatements() {
  for (const statement of siteSettingsStatements) {
    try {
      await db.run(statement);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (
        statement.startsWith("ALTER TABLE") &&
        message.toLowerCase().includes("duplicate column name")
      ) {
        continue;
      }

      throw error;
    }
  }
}

export function ensureRoshalSiteSettingsSchema() {
  if (!ensurePromise) {
    ensurePromise = runStatements().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  return ensurePromise;
}
