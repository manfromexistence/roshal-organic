import { OrdersPageClient } from "@/components/storefront/orders-page-client";
import { requireRoshalUser } from "@/lib/store-auth";
import { getRoshalOrdersForUser } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function OrdersPage() {
  const [locale, sessionUser] = await Promise.all([
    getRoshalLocale(),
    requireRoshalUser(),
  ]);
  const orders = await getRoshalOrdersForUser(sessionUser.id);

  return <OrdersPageClient locale={locale} orders={orders} />;
}
