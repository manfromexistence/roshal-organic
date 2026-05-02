import { CartPageClient } from "@/components/storefront/cart-page-client";
import { getRoshalSessionUser } from "@/lib/store-auth";
import { getRoshalProducts, getRoshalSiteSettings } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function CartPage() {
  const [locale, products, siteSettings, sessionUser] = await Promise.all([
    getRoshalLocale(),
    getRoshalProducts(),
    getRoshalSiteSettings(),
    getRoshalSessionUser(),
  ]);

  return (
    <CartPageClient
      deliverySettings={siteSettings.deliverySettings}
      deliveryZones={siteSettings.deliveryZones}
      locale={locale}
      products={products}
      userDefaultAddress={sessionUser?.defaultAddress || ""}
    />
  );
}
