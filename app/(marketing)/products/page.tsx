import type { Metadata } from "next";
import { ProductsPageClient } from "@/components/roshal/storefront/products-page-client";
import { getRoshalProducts } from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import { buildRoshalMetadata } from "@/lib/roshal/seo";

export const metadata: Metadata = buildRoshalMetadata({
  title: "Products",
  description:
    "Browse Roshal Organic honey, ghee, jaggery, oils, seasonal fruits, and other natural essentials.",
  path: "/products",
});

export default async function ProductsPage() {
  const [locale, products] = await Promise.all([
    getRoshalLocale(),
    getRoshalProducts(),
  ]);

  return <ProductsPageClient locale={locale} products={products} />;
}
