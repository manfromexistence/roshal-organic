import type { RoshalProduct } from "@/lib/store-types";

const VEGETABLE_IMAGE_COUNT = 75;

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  beverage: "/beverage.jpg",
  dairy: "/yogurt-2.jpg",
  fruit: "/mango-2.jpg",
  ghee: "/ghee-2.jpg",
  gur: "/dates.jpg",
  honey: "/honey-2.jpg",
  oil: "/oil-2.jpg",
  rice: "/rice.jpg",
  spices: "/spices.jpg",
  vegetables: "/organic-vegetables.jpg",
};

function isAbsoluteAssetPath(value: string) {
  return /^(?:https?:\/\/|data:|blob:)/i.test(value);
}

function normalizeVegetableImageIndex(index: number) {
  if (!Number.isFinite(index)) {
    return 1;
  }

  return (
    ((Math.trunc(index) - 1 + VEGETABLE_IMAGE_COUNT) % VEGETABLE_IMAGE_COUNT) +
    1
  );
}

export function getVegetableImagePath(index: number) {
  return `/vegetables/vegetable-${normalizeVegetableImageIndex(index)}.jpg`;
}

export function normalizeRoshalAssetPath(
  value: string | null | undefined,
  fallback = "",
) {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return fallback;
  }

  if (isAbsoluteAssetPath(trimmedValue)) {
    return trimmedValue;
  }

  const normalizedValue = trimmedValue.startsWith("/")
    ? trimmedValue
    : `/${trimmedValue.replace(/^\.?\//, "")}`;
  const vegetableMatch = normalizedValue.match(
    /^\/vegetables\/vegetable-(\d+)\.(?:avif|gif|jpe?g|png|webp)$/i,
  );

  if (!vegetableMatch) {
    return normalizedValue;
  }

  return getVegetableImagePath(Number.parseInt(vegetableMatch[1] ?? "1", 10));
}

function getProductFallbackImage(
  product: Pick<
    RoshalProduct,
    "categoryKey" | "heroImage" | "id" | "name" | "slug"
  >,
) {
  if (product.id.startsWith("vegetable-")) {
    const suffix = Number.parseInt(product.id.replace("vegetable-", ""), 10);
    return getVegetableImagePath(suffix);
  }

  if (product.categoryKey in CATEGORY_FALLBACK_IMAGES) {
    return CATEGORY_FALLBACK_IMAGES[product.categoryKey]!;
  }

  const slugOrName = `${product.slug} ${product.name.en}`.toLocaleLowerCase();

  if (slugOrName.includes("honey")) {
    return CATEGORY_FALLBACK_IMAGES.honey;
  }

  if (slugOrName.includes("ghee")) {
    return CATEGORY_FALLBACK_IMAGES.ghee;
  }

  if (slugOrName.includes("gur") || slugOrName.includes("jaggery")) {
    return CATEGORY_FALLBACK_IMAGES.gur;
  }

  if (slugOrName.includes("fruit") || slugOrName.includes("mango")) {
    return CATEGORY_FALLBACK_IMAGES.fruit;
  }

  return "/healthy-food.jpg";
}

export function normalizeRoshalProductMedia(product: RoshalProduct) {
  const heroImage = normalizeRoshalAssetPath(
    product.heroImage,
    getProductFallbackImage(product),
  );
  const normalizedGallery = product.gallery
    .map((image) => normalizeRoshalAssetPath(image, heroImage))
    .filter(Boolean);
  const gallery = Array.from(new Set([heroImage, ...normalizedGallery]));

  return {
    ...product,
    heroImage,
    gallery,
  };
}
