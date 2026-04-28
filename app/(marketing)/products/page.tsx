import type { Metadata } from "next";
import { ProductsPageClient } from "@/components/storefront/products-page-client";
import { getRoshalProducts } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { buildRoshalMetadata } from "@/lib/store-seo";
import { getRoshalTaxonomy } from "@/lib/store-taxonomy-content";

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

function resolvePriceValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    subcategory?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, products, taxonomy] = await Promise.all([
    getRoshalLocale(),
    getRoshalProducts(),
    getRoshalTaxonomy(),
  ]);

  return (
    <ProductsPageClient
      locale={locale}
      products={products}
      taxonomy={taxonomy}
      initialCategory={resolvedSearchParams.category || "all"}
      initialMaxPrice={resolvePriceValue(resolvedSearchParams.maxPrice)}
      initialMinPrice={resolvePriceValue(resolvedSearchParams.minPrice)}
      initialSearchQuery={resolvedSearchParams.q || ""}
      initialSubcategory={resolvedSearchParams.subcategory || "all"}
      initialSortKey={resolveSortValue(resolvedSearchParams.sort)}
    />
  );
}
