import type { RoshalLocale } from "@/lib/store-types";

const bdtFormatters: Record<RoshalLocale, Intl.NumberFormat> = {
  bn: new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }),
  en: new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }),
};

export function formatBdt(amount: number, locale: RoshalLocale): string {
  return bdtFormatters[locale].format(Number.isFinite(amount) ? amount : 0);
}

export function safeJsonParse<T>(
  value: string | null | undefined,
  fallback: T,
): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function formatOrderDate(
  value: Date | string | number,
  locale: RoshalLocale,
): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat(locale === "en" ? "en-BD" : "bn-BD", {
    dateStyle: "medium",
  }).format(date);
}
