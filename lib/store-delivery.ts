import type {
  LocalizedValue,
  RoshalDeliveryZone,
  RoshalLocale,
} from "@/lib/store-types";

export interface RoshalDeliveryEstimate {
  fee: number;
  matchedBy: "postal" | "city" | "keyword" | "default" | "none";
  zone: RoshalDeliveryZone | null;
}

function normalizeText(value: string | null | undefined) {
  return value?.trim().toLowerCase() || "";
}

function normalizeList(values: string[] | null | undefined) {
  return Array.from(
    new Set(
      (values || []).map((value) => normalizeText(value)).filter(Boolean),
    ),
  );
}

function normalizeZone(
  value: Partial<RoshalDeliveryZone> | null | undefined,
  index: number,
): RoshalDeliveryZone | null {
  if (!value) {
    return null;
  }

  const labelBn = value.label?.bn?.trim() || "";
  const labelEn = value.label?.en?.trim() || "";

  if (!labelBn && !labelEn) {
    return null;
  }

  return {
    id: value.id?.trim() || `delivery-zone-${index + 1}`,
    label: {
      bn: labelBn || labelEn,
      en: labelEn || labelBn,
    },
    fee: Math.max(0, Number(value.fee) || 0),
    cityPatterns: normalizeList(value.cityPatterns),
    postalCodes: normalizeList(value.postalCodes),
    addressKeywords: normalizeList(value.addressKeywords),
    isEnabled: value.isEnabled !== false,
    isDefault: Boolean(value.isDefault),
    sortOrder: Number.isFinite(Number(value.sortOrder))
      ? Number(value.sortOrder)
      : index,
  };
}

export function normalizeRoshalDeliveryZones(
  input: unknown,
  fallbackZones: RoshalDeliveryZone[],
) {
  const candidateZones = Array.isArray(input)
    ? input
        .map((zone, index) =>
          normalizeZone(zone as Partial<RoshalDeliveryZone>, index),
        )
        .filter((zone): zone is RoshalDeliveryZone => Boolean(zone))
    : [];
  const zones = candidateZones.length > 0 ? candidateZones : fallbackZones;
  const sortedZones = [...zones].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.label.en.localeCompare(right.label.en);
  });
  const enabledZones = sortedZones.filter((zone) => zone.isEnabled);
  const defaultZoneId =
    enabledZones.find((zone) => zone.isDefault)?.id ||
    enabledZones[0]?.id ||
    "";

  return sortedZones.map((zone) => ({
    ...zone,
    isDefault: zone.id === defaultZoneId,
  }));
}

function isInsideDhakaZone(zone: RoshalDeliveryZone) {
  const searchable = [
    zone.id,
    zone.label.bn,
    zone.label.en,
    ...zone.cityPatterns,
    ...zone.addressKeywords,
  ]
    .join(" ")
    .toLowerCase();

  return (
    zone.id === "delivery-inside-dhaka" ||
    searchable.includes("inside dhaka") ||
    searchable.includes("dhaka") ||
    searchable.includes("ঢাকা")
  );
}

export function normalizeRoshalTwoZoneDeliveryZones(
  input: unknown,
  fallbackZones: RoshalDeliveryZone[],
) {
  const fallback = normalizeRoshalDeliveryZones([], fallbackZones);
  const fallbackInside =
    fallback.find((zone) => zone.id === "delivery-inside-dhaka") || fallback[0];
  const fallbackOutside =
    fallback.find((zone) => zone.id === "delivery-outside-dhaka") ||
    fallback.find((zone) => zone.id.includes("outside")) ||
    fallback[1] ||
    fallbackInside;
  const sourceZones = normalizeRoshalDeliveryZones(input, fallbackZones);
  const explicitInside =
    sourceZones.find((zone) => zone.id === "delivery-inside-dhaka") ||
    sourceZones.find(isInsideDhakaZone) ||
    fallbackInside;
  const explicitOutside =
    sourceZones.find((zone) => zone.id === "delivery-outside-dhaka") ||
    sourceZones.find((zone) => zone.id.includes("outside")) ||
    fallbackOutside;

  return normalizeRoshalDeliveryZones(
    [
      {
        ...fallbackInside,
        ...explicitInside,
        id: "delivery-inside-dhaka",
        label: fallbackInside.label,
        cityPatterns: explicitInside.cityPatterns.length
          ? explicitInside.cityPatterns
          : fallbackInside.cityPatterns,
        addressKeywords: explicitInside.addressKeywords.length
          ? explicitInside.addressKeywords
          : fallbackInside.addressKeywords,
        isDefault: false,
        sortOrder: 0,
      },
      {
        ...fallbackOutside,
        ...explicitOutside,
        id: "delivery-outside-dhaka",
        label: fallbackOutside.label,
        cityPatterns: [],
        postalCodes: explicitOutside.postalCodes,
        addressKeywords: [],
        isDefault: true,
        sortOrder: 1,
      },
    ],
    fallbackZones,
  );
}

export function getRoshalDefaultDeliveryZone(zones: RoshalDeliveryZone[]) {
  return (
    zones.find((zone) => zone.isEnabled && zone.isDefault) ||
    zones.find((zone) => zone.isEnabled) ||
    null
  );
}

function getZoneMatchScore(
  zone: RoshalDeliveryZone,
  input: {
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    postalCode?: string | null;
  },
) {
  const city = normalizeText(input.city);
  const postalCode = normalizeText(input.postalCode);
  const address = normalizeText(
    [input.addressLine1, input.addressLine2, input.city]
      .filter(Boolean)
      .join(" "),
  );
  const matchesPostal =
    postalCode && zone.postalCodes.some((value) => value === postalCode);
  const matchesCity =
    city &&
    zone.cityPatterns.some(
      (value) =>
        value === city || city.includes(value) || address.includes(value),
    );
  const matchesKeyword =
    address && zone.addressKeywords.some((value) => address.includes(value));

  if (matchesPostal) {
    return { matchedBy: "postal" as const, score: 300 };
  }

  if (matchesCity) {
    return { matchedBy: "city" as const, score: 200 };
  }

  if (matchesKeyword) {
    return { matchedBy: "keyword" as const, score: 100 };
  }

  if (zone.isDefault) {
    return { matchedBy: "default" as const, score: 10 };
  }

  return { matchedBy: "none" as const, score: 0 };
}

export function resolveRoshalDeliveryEstimate(input: {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  postalCode?: string | null;
  itemCount?: number;
  zones: RoshalDeliveryZone[];
}): RoshalDeliveryEstimate {
  if ((input.itemCount || 0) <= 0) {
    return {
      fee: 0,
      matchedBy: "none",
      zone: null,
    };
  }

  const enabledZones = input.zones.filter((zone) => zone.isEnabled);
  const fallbackZone = getRoshalDefaultDeliveryZone(enabledZones);
  const matches = enabledZones
    .map((zone) => ({
      zone,
      ...getZoneMatchScore(zone, input),
    }))
    .sort((left, right) => {
      if (left.score !== right.score) {
        return right.score - left.score;
      }

      return left.zone.sortOrder - right.zone.sortOrder;
    });
  const bestMatch = matches.find((match) => match.score > 0);
  const zone = bestMatch?.zone || fallbackZone;

  return {
    fee: zone?.fee || 0,
    matchedBy: bestMatch?.matchedBy || (zone ? "default" : "none"),
    zone: zone || null,
  };
}

export function getRoshalDeliveryZoneLabel(
  locale: RoshalLocale,
  zone: Pick<RoshalDeliveryZone, "label"> | null,
) {
  if (!zone) {
    return locale === "bn" ? "ডেলিভারি অঞ্চল" : "Delivery zone";
  }

  return locale === "bn" ? zone.label.bn : zone.label.en;
}

export function getRoshalDeliveryMatchLabel(
  match: RoshalDeliveryEstimate["matchedBy"],
): LocalizedValue {
  switch (match) {
    case "postal":
      return {
        bn: "পোস্ট কোড অনুযায়ী",
        en: "Matched by postal code",
      };
    case "city":
      return {
        bn: "শহর অনুযায়ী",
        en: "Matched by city",
      };
    case "keyword":
      return {
        bn: "ঠিকানা অনুযায়ী",
        en: "Matched by address",
      };
    case "default":
      return {
        bn: "ডিফল্ট রেট",
        en: "Default rate",
      };
    default:
      return {
        bn: "অপেক্ষমাণ",
        en: "Pending",
      };
  }
}
