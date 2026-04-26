import type { Metadata } from "next";
import { FavoritesPageClient } from "@/components/roshal/storefront/favorites-page-client";
import { getRoshalProducts } from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import { buildRoshalMetadata } from "@/lib/roshal/seo";

export const metadata: Metadata = buildRoshalMetadata({
  title: "Favorites",
  description:
    "Review the Roshal Organic products you saved for later and jump back into checkout quickly.",
  path: "/favorites",
});

export default async function FavoritesPage() {
  const [locale, products] = await Promise.all([
    getRoshalLocale(),
    getRoshalProducts(),
  ]);

  return <FavoritesPageClient locale={locale} products={products} />;
}
