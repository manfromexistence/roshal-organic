import { CartPageClient } from "@/components/storefront/cart-page-client";
import { getRoshalProducts, getRoshalSiteSettings } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function CartPage() {
  const [locale, products, siteSettings] = await Promise.all([
    getRoshalLocale(),
    getRoshalProducts(),
    getRoshalSiteSettings(),
  ]);

  return (
    <CartPageClient
      deliveryZones={siteSettings.deliveryZones}
      locale={locale}
      products={products}
    />
  );
}
