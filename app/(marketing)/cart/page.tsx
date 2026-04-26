import { CartPageClient } from "@/components/storefront/cart-page-client";
import { getRoshalProducts } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function CartPage() {
  const [locale, products] = await Promise.all([
    getRoshalLocale(),
    getRoshalProducts(),
  ]);

  return <CartPageClient locale={locale} products={products} />;
}
