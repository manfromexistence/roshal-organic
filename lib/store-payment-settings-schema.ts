import { db } from "@/lib/db";

const paymentSettingsStatements = [
  `CREATE TABLE IF NOT EXISTS roshal_payment_settings (
    id TEXT PRIMARY KEY NOT NULL,
    manual_review_notice_bn TEXT NOT NULL,
    manual_review_notice_en TEXT NOT NULL,
    support_message_bn TEXT NOT NULL,
    support_message_en TEXT NOT NULL,
    options_json TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
];

let ensurePromise: Promise<void> | null = null;

async function runStatements() {
  for (const statement of paymentSettingsStatements) {
    await db.run(statement);
  }
}

export function ensureRoshalPaymentSettingsSchema() {
  if (!ensurePromise) {
    ensurePromise = runStatements().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  return ensurePromise;
}
