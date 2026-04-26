import { OrdersPageClient } from "@/components/roshal/storefront/orders-page-client";
import { requireRoshalUser } from "@/lib/roshal/auth";
import { getRoshalOrdersForUser } from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";

export default async function OrdersPage() {
  const [locale, sessionUser] = await Promise.all([
    getRoshalLocale(),
    requireRoshalUser(),
  ]);
  const orders = await getRoshalOrdersForUser(sessionUser.id);

  return <OrdersPageClient locale={locale} orders={orders} />;
}
