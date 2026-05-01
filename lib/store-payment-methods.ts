import { localizedValue } from "@/lib/store-locale";
import type {
  LocalizedValue,
  RoshalPaymentMethod,
  RoshalPaymentOption,
} from "@/lib/store-types";

export const ROSHAL_GATEWAY_PAYMENT_METHODS: RoshalPaymentMethod[] = [
  "card",
  "bkash",
  "nagad",
];

export function normalizeRoshalPaymentMethodKey(
  value: string | null | undefined,
  fallback = "",
): RoshalPaymentMethod {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return (normalized || fallback || "cash_on_delivery") as RoshalPaymentMethod;
}

export function isRoshalCashOnDeliveryMethod(method: RoshalPaymentMethod) {
  return normalizeRoshalPaymentMethodKey(method) === "cash_on_delivery";
}

export function isRoshalManualPaymentReferenceRequired(
  option: Pick<
    RoshalPaymentOption,
    "accountNumber" | "accountType" | "key" | "mode"
  >,
) {
  if (option.mode !== "manual" || isRoshalCashOnDeliveryMethod(option.key)) {
    return false;
  }

  return Boolean(option.accountNumber.trim());
}

export function humanizeRoshalPaymentMethodKey(
  method: RoshalPaymentMethod,
): string {
  return normalizeRoshalPaymentMethodKey(method)
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function getRoshalFallbackPaymentMethodLabel(
  method: RoshalPaymentMethod,
): LocalizedValue {
  const label = humanizeRoshalPaymentMethodKey(method);

  return localizedValue(label, label);
}
