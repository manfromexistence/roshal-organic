import { safeJsonParse } from "@/lib/store-format";
import type {
  LocalizedValue,
  RoshalProduct,
  RoshalProductPurchaseOption,
} from "@/lib/store-types";

const SIZE_PREFIX_EN = "Size:";
const SIZE_PREFIX_BN = "Size:";

function stripSizePrefix(value: string) {
  return value
    .replace(new RegExp(`^${SIZE_PREFIX_EN}\\s*`, "i"), "")
    .replace(new RegExp(`^${SIZE_PREFIX_BN}\\s*`, "i"), "")
    .trim();
}

export function isRoshalSizeFeature(feature: LocalizedValue) {
  return (
    feature.en.trim().toLowerCase().startsWith(SIZE_PREFIX_EN.toLowerCase()) ||
    feature.bn.trim().toLowerCase().startsWith(SIZE_PREFIX_BN.toLowerCase())
  );
}

export function getRoshalProductSizeOptions(features: LocalizedValue[]) {
  return features
    .filter(isRoshalSizeFeature)
    .map((feature) => stripSizePrefix(feature.en || feature.bn))
    .filter(Boolean);
}

export function getRoshalProductRegularFeatures(features: LocalizedValue[]) {
  return features.filter((feature) => !isRoshalSizeFeature(feature));
}

export function mergeRoshalProductFeatureInput({
  featuresBn,
  featuresEn,
  sizeOptions,
}: {
  featuresBn: string[];
  featuresEn: string[];
  sizeOptions: string[];
}) {
  const normalizedSizeOptions = sizeOptions
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    bn: [
      ...featuresBn,
      ...normalizedSizeOptions.map((item) => `${SIZE_PREFIX_BN} ${item}`),
    ],
    en: [
      ...featuresEn,
      ...normalizedSizeOptions.map((item) => `${SIZE_PREFIX_EN} ${item}`),
    ],
  };
}

type RawPurchaseOption = {
  id?: unknown;
  size?: unknown;
  amount?: unknown;
  label?: unknown;
  price?: unknown;
  compareAtPrice?: unknown;
  inventory?: unknown;
  isDefault?: unknown;
};

function textFromUnknown(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberFromUnknown(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value));

  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : null;
}

function optionIdFromText(value: string, index: number) {
  const key = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return key || `option-${index + 1}`;
}

function uniqueOptionId(
  rawId: string,
  label: string,
  index: number,
  seen: Set<string>,
) {
  const baseId = optionIdFromText(rawId || label, index);
  let nextId = baseId;
  let suffix = 2;

  while (seen.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  seen.add(nextId);
  return nextId;
}

export function normalizeRoshalProductPurchaseOptions({
  fallbackCompareAtPrice,
  fallbackInventory,
  fallbackPrice,
  legacySizeOptions = [],
  value,
}: {
  fallbackCompareAtPrice?: number | null;
  fallbackInventory: number;
  fallbackPrice: number;
  legacySizeOptions?: string[];
  value: unknown;
}): RoshalProductPurchaseOption[] {
  const rawOptions = Array.isArray(value)
    ? (value as RawPurchaseOption[])
    : typeof value === "string"
      ? safeJsonParse<RawPurchaseOption[]>(value, [])
      : [];
  const sourceOptions: RawPurchaseOption[] =
    rawOptions.length > 0
      ? rawOptions
      : legacySizeOptions.map((size) => ({
          amount: size,
          size,
        }));
  const seenIds = new Set<string>();
  const normalized = sourceOptions.flatMap((option, index) => {
    const size =
      textFromUnknown(option.size) ||
      textFromUnknown(option.label) ||
      textFromUnknown(option.amount);
    const amount = textFromUnknown(option.amount) || size;

    if (!size && !amount) {
      return [];
    }

    const label = [size, amount].filter(Boolean).join(" ");
    const price = numberFromUnknown(option.price) ?? fallbackPrice;
    const compareAtPrice =
      numberFromUnknown(option.compareAtPrice) ??
      fallbackCompareAtPrice ??
      null;
    const inventory = numberFromUnknown(option.inventory) ?? fallbackInventory;

    return [
      {
        id: uniqueOptionId(textFromUnknown(option.id), label, index, seenIds),
        size,
        amount,
        price,
        compareAtPrice,
        inventory,
        isDefault: Boolean(option.isDefault),
      },
    ];
  });

  if (normalized.length === 0) {
    return [
      {
        id: "default",
        size: "",
        amount: "",
        price: Math.max(0, Math.round(fallbackPrice)),
        compareAtPrice: fallbackCompareAtPrice ?? null,
        inventory: Math.max(0, Math.round(fallbackInventory)),
        isDefault: true,
      },
    ];
  }

  const hasDefault = normalized.some((option) => option.isDefault);

  return normalized.map((option, index) => ({
    ...option,
    isDefault: hasDefault ? option.isDefault : index === 0,
  }));
}

export function serializeRoshalProductPurchaseOptions(value: unknown) {
  const options = normalizeRoshalProductPurchaseOptions({
    fallbackInventory: 0,
    fallbackPrice: 0,
    value,
  }).filter(
    (option) => option.id !== "default" || option.size || option.amount,
  );

  return JSON.stringify(options);
}

export function getRoshalProductPurchaseOptions(
  product: Pick<
    RoshalProduct,
    "compareAtPrice" | "features" | "inventory" | "price" | "purchaseOptions"
  >,
) {
  return normalizeRoshalProductPurchaseOptions({
    fallbackCompareAtPrice: product.compareAtPrice,
    fallbackInventory: product.inventory,
    fallbackPrice: product.price,
    legacySizeOptions: getRoshalProductSizeOptions(product.features),
    value: product.purchaseOptions,
  });
}

export function getDefaultRoshalProductPurchaseOption(
  product: Pick<
    RoshalProduct,
    "compareAtPrice" | "features" | "inventory" | "price" | "purchaseOptions"
  >,
) {
  const options = getRoshalProductPurchaseOptions(product);

  return options.find((option) => option.isDefault) || options[0];
}

export function getRoshalProductPurchaseOption(
  product: Pick<
    RoshalProduct,
    "compareAtPrice" | "features" | "inventory" | "price" | "purchaseOptions"
  >,
  optionId?: string | null,
) {
  const options = getRoshalProductPurchaseOptions(product);
  const normalizedOptionId = optionId?.trim();

  return (
    (normalizedOptionId
      ? options.find((option) => option.id === normalizedOptionId)
      : null) ||
    options.find((option) => option.isDefault) ||
    options[0]
  );
}
