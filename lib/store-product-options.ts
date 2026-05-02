import type { LocalizedValue } from "@/lib/store-types";

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
