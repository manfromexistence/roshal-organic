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

function resolveSortValue(value: string | undefined) {
  return value === "price-low" || value === "price-high" || value === "name"
    ? value
    : "featured";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, products] = await Promise.all([
    getRoshalLocale(),
    getRoshalProducts(),
  ]);

  return (
    <ProductsPageClient
      locale={locale}
      products={products}
      initialCategory={resolvedSearchParams.category || "all"}
      initialSearchQuery={resolvedSearchParams.q || ""}
      initialSortKey={resolveSortValue(resolvedSearchParams.sort)}
    />
  );
}
