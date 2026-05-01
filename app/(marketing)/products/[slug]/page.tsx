import { notFound } from "next/navigation";
import { ProductDetailsPageClient } from "@/components/storefront/product-details-page-client";
import {
  getRoshalProductBySlug,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getRoshalProductReviewBundle } from "@/lib/store-product-reviews";
import { buildRoshalProductMetadata } from "@/lib/store-seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getRoshalLocale()]);
  const product = await getRoshalProductBySlug(slug);

  if (!product) {
    return undefined;
  }

  return buildRoshalProductMetadata(product, locale);
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getRoshalLocale()]);
  const [product, products, siteSettings] = await Promise.all([
    getRoshalProductBySlug(slug),
    getRoshalProducts(),
    getRoshalSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.isPublished &&
        candidate.categoryKey === product.categoryKey,
    )
    .slice(0, 4);

  const fallbackProducts =
    relatedProducts.length >= 4
      ? relatedProducts
      : [
          ...relatedProducts,
          ...products.filter(
            (candidate) =>
              candidate.id !== product.id &&
              candidate.isPublished &&
              !relatedProducts.some((item) => item.id === candidate.id),
          ),
        ].slice(0, 4);

  const reviewBundle = await getRoshalProductReviewBundle(product.id);

  return (
    <ProductDetailsPageClient
      locale={locale}
      product={product}
      reviewBundle={reviewBundle}
      relatedProducts={fallbackProducts}
      siteSettings={siteSettings}
    />
  );
}
