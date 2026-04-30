import {
  allDistricts,
  thanaNamesOf,
  upazilaNamesOf,
} from "@bangladeshi/bangladesh-address/build/src/index.js";

export interface BangladeshDistrictOption {
  value: string;
  label: string;
  thanas: string[];
}

function sortBangladeshLabels(values: string[]) {
  return [...values].sort((left, right) =>
    left.localeCompare(right, "en", {
      sensitivity: "base",
    }),
  );
}

function uniqueSortedAreas(values: string[]) {
  return sortBangladeshLabels(
    Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))),
  );
}

export const bangladeshDistrictOptions: BangladeshDistrictOption[] =
  sortBangladeshLabels(allDistricts()).map((district) => ({
    value: district,
    label: district,
    thanas: uniqueSortedAreas([
      ...upazilaNamesOf(district),
      ...thanaNamesOf(district),
    ]),
  }));

export function getBangladeshDistrictByValue(value: string) {
  return (
    bangladeshDistrictOptions.find((district) => district.value === value) ||
    bangladeshDistrictOptions[0]
  );
}
