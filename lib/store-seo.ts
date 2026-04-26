import type { Metadata } from "next";
import { getLocalizedValue } from "@/lib/store-locale";
import { getRoshalAbsoluteUrl, getRoshalSiteName } from "@/lib/store-site";
import type {
  LocalizedValue,
  RoshalLocale,
  RoshalMarketingPage,
  RoshalProduct,
} from "@/lib/store-types";

function resolveTitle(title: string) {
  const siteName = getRoshalSiteName();
  return title === siteName ? siteName : `${title} | ${siteName}`;
}

function resolveImageUrl(image: string | null | undefined) {
  if (!image) {
    return undefined;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return getRoshalAbsoluteUrl(image);
}

export function buildRoshalMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}): Metadata {
  const imageUrl = resolveImageUrl(image);
  const absoluteUrl = getRoshalAbsoluteUrl(path);
  const resolvedTitle = resolveTitle(title);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      url: absoluteUrl,
      title: resolvedTitle,
      description,
      siteName: getRoshalSiteName(),
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: resolvedTitle,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export function getRoshalLocalizedMetadataText(
  locale: RoshalLocale,
  value: LocalizedValue,
  fallback: string,
) {
  const resolved = getLocalizedValue(locale, value).trim();
  return resolved || fallback;
}

export function buildRoshalMarketingMetadata(
  page: RoshalMarketingPage,
  locale: RoshalLocale,
) {
  const title = getRoshalLocalizedMetadataText(
    locale,
    page.title,
    getRoshalSiteName(),
  );
  const description = getRoshalLocalizedMetadataText(
    locale,
    page.description,
    locale === "bn"
      ? "Roshal Organic এর খাঁটি ও প্রাকৃতিক পণ্য সম্পর্কে জানুন।"
      : "Discover pure and natural products from Roshal Organic.",
  );

  return buildRoshalMetadata({
    title,
    description,
    path: page.slug === "home" ? "/" : `/${page.slug}`,
    image: page.heroImage || undefined,
  });
}

export function buildRoshalProductMetadata(
  product: RoshalProduct,
  locale: RoshalLocale,
) {
  const title = getRoshalLocalizedMetadataText(locale, product.name, "Product");
  const description = getRoshalLocalizedMetadataText(
    locale,
    product.summary,
    getLocalizedValue(locale, product.description),
  );

  return buildRoshalMetadata({
    title,
    description,
    path: `/products/${product.slug}`,
    image: product.heroImage,
  });
}
