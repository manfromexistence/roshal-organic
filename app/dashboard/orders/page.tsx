import { RoshalOrdersTable } from "@/components/roshal/dashboard/orders-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRoshalAdmin } from "@/lib/roshal/auth";
import { getRoshalOrders } from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";

export default async function DashboardOrdersPage() {
  const [locale, orders] = await Promise.all([
    getRoshalLocale(),
    getRoshalOrders(),
    requireRoshalAdmin(),
  ]);
  const paymentReviewCount = orders.filter(
    (order) =>
      order.status === "payment-review" ||
      order.paymentStatus === "under-review",
  ).length;
  const activeFulfillmentCount = orders.filter((order) =>
    ["confirmed", "processing", "shipped"].includes(order.status),
  ).length;
  const deliveredCount = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "অর্ডার" : "Orders"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {locale === "bn" ? "অর্ডার ম্যানেজমেন্ট" : "Order management"}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title={locale === "bn" ? "পেমেন্ট যাচাই" : "Payment review"}
          value={paymentReviewCount}
        />
        <MetricCard
          title={locale === "bn" ? "চলমান ডেলিভারি" : "Active fulfillment"}
          value={activeFulfillmentCount}
        />
        <MetricCard
          title={locale === "bn" ? "ডেলিভার হয়েছে" : "Delivered"}
          value={deliveredCount}
        />
      </div>

      <RoshalOrdersTable orders={orders} locale={locale} />
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
