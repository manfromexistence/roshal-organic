import { bangladeshDistrictOptions } from "@/lib/bangladesh-locations";

export function isSyntheticRoshalEmail(value: string | null | undefined) {
  return /^customer\+\d+@roshalorganic\.app$/i.test(value || "");
}

export function getDisplayRoshalEmail(value: string | null | undefined) {
  return isSyntheticRoshalEmail(value) ? "" : value || "";
}

export function parseRoshalDefaultAddress(defaultAddress: string) {
  const parts = defaultAddress
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const normalizedParts = parts.map((part) => part.toLowerCase());
  const district =
    bangladeshDistrictOptions.find((option) =>
      normalizedParts.some(
        (part) =>
          part === option.value.toLowerCase() ||
          part === option.label.toLowerCase(),
      ),
    ) || null;
  const thana =
    district?.thanas.find((option) =>
      normalizedParts.some((part) => part === option.toLowerCase()),
    ) || "";
  const addressLine1 = parts
    .filter((part) => {
      const normalizedPart = part.toLowerCase();

      return (
        normalizedPart !== thana.toLowerCase() &&
        normalizedPart !== district?.value.toLowerCase() &&
        normalizedPart !== district?.label.toLowerCase()
      );
    })
    .join(", ");

  return {
    addressLine1: addressLine1 || defaultAddress,
    district: district?.value || "",
    thana,
  };
}

export function buildRoshalDefaultAddress(input: {
  addressLine1: string;
  districtLabel: string;
  thana: string;
}) {
  return [input.addressLine1, input.thana, input.districtLabel]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");
}
