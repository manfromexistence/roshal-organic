import { OrdersDashboardClient } from "@/components/dashboard/orders-dashboard-client";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalOrders } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function DashboardOrdersPage() {
  const [locale, orders] = await Promise.all([
    getRoshalLocale(),
    getRoshalOrders(),
    requireRoshalAdmin(),
  ]);

  return <OrdersDashboardClient orders={orders} locale={locale} />;
}
