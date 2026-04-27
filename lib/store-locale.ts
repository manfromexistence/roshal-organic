import type { LocalizedValue, RoshalLocale } from "@/lib/store-types";

export const ROSHAL_LOCALE_COOKIE = "roshal-locale-v2";
export const roshalLocales = [
  "bn",
  "en",
] as const satisfies readonly RoshalLocale[];

export function isRoshalLocale(
  value: string | null | undefined,
): value is RoshalLocale {
  return value === "bn" || value === "en";
}

export function getLocalizedValue(
  locale: RoshalLocale,
  value: LocalizedValue,
): string {
  return locale === "en" ? value.en : value.bn;
}

export function localizedValue(bn: string, en: string): LocalizedValue {
  return { bn, en };
}
