import { CartPageClient } from "@/components/roshal/storefront/cart-page-client";
import { getRoshalProducts } from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";

export default async function CartPage() {
  const [locale, products] = await Promise.all([
    getRoshalLocale(),
    getRoshalProducts(),
  ]);

  return <CartPageClient locale={locale} products={products} />;
}
