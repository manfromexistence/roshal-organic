import {
  DashboardBarChartCard,
  DashboardPieChartCard,
} from "@/components/dashboard/dashboard-chart-card";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { RoshalOrdersTable } from "@/components/dashboard/orders-table";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalOrders } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";
import {
  getRoshalOrderStatusLabel,
  getRoshalPaymentMethodLabel,
  getRoshalPaymentStatusLabel,
} from "@/lib/store-orders";
import type { RoshalPaymentMethod } from "@/lib/store-types";

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
  const orderStatusData = [
    "pending",
    "payment-review",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ].map((status) => ({
    key: status,
    label: getLocalizedValue(locale, getRoshalOrderStatusLabel(status)),
    value: orders.filter((order) => order.status === status).length,
  }));
  const paymentMethodOrder: RoshalPaymentMethod[] = [
    "cash_on_delivery",
    "bkash",
    "nagad",
    "rocket",
    "upay",
    "card",
  ];
  const paymentMethodData = paymentMethodOrder.map((method) => ({
    key: method,
    label: getLocalizedValue(locale, getRoshalPaymentMethodLabel(method)),
    value: orders.filter((order) => order.paymentMethod === method).length,
  }));
  const paymentStatusData = ["pending", "under-review", "paid", "failed"].map(
    (status) => ({
      key: status,
      label: getLocalizedValue(locale, getRoshalPaymentStatusLabel(status)),
      value: orders.filter((order) => order.paymentStatus === status).length,
    }),
  );

  return (
    <div className="min-w-0 space-y-6 p-4 md:p-6">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "অর্ডার" : "Orders"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "অর্ডার ম্যানেজমেন্ট" : "Order management"}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          title={locale === "bn" ? "পেমেন্ট যাচাই" : "Payment review"}
          value={paymentReviewCount}
          hint={
            locale === "bn"
              ? "স্ক্রিনশট বা ম্যানুয়াল ভেরিফিকেশন অপেক্ষমাণ"
              : "Screenshot or manual-verification orders waiting for review"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "চলমান ডেলিভারি" : "Active fulfillment"}
          value={activeFulfillmentCount}
          hint={
            locale === "bn"
              ? "কনফার্মড, প্রসেসিং বা শিপড"
              : "Orders already confirmed, processing, or shipped"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "ডেলিভার হয়েছে" : "Delivered"}
          value={deliveredCount}
          hint={
            locale === "bn"
              ? "সম্পন্ন কাস্টমার অর্ডার"
              : "Completed customer deliveries"
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardBarChartCard
          title={
            locale === "bn" ? "অর্ডার স্ট্যাটাস ব্রেকডাউন" : "Order status breakdown"
          }
          description={
            locale === "bn"
              ? "কোন ধাপে সবচেয়ে বেশি অর্ডার আটকে আছে তা এখানে সঙ্গে সঙ্গে দেখা যায়।"
              : "See exactly where the order pipeline is stacking up."
          }
          totalLabel={locale === "bn" ? "মোট অর্ডার" : "Total orders"}
          data={orderStatusData}
        />
        <DashboardPieChartCard
          title={locale === "bn" ? "পেমেন্ট মেথড" : "Payment methods"}
          description={
            locale === "bn"
              ? "গ্রাহকরা কোন চ্যানেল দিয়ে সবচেয়ে বেশি পেমেন্ট করছে তার বণ্টন।"
              : "Distribution of the channels customers use to place payments."
          }
          totalLabel={locale === "bn" ? "অর্ডার" : "Orders"}
          data={paymentMethodData}
        />
        <DashboardBarChartCard
          title={locale === "bn" ? "পেমেন্ট স্ট্যাটাস" : "Payment status"}
          description={
            locale === "bn"
              ? "ম্যানুয়াল ভেরিফিকেশন, পেইড, এবং ব্যর্থ পেমেন্টের বর্তমান চিত্র।"
              : "Current split between pending, reviewed, paid, and failed payments."
          }
          totalLabel={locale === "bn" ? "পেমেন্ট" : "Payments"}
          data={paymentStatusData}
          className="xl:col-span-2"
        />
      </div>

      <RoshalOrdersTable orders={orders} locale={locale} />
    </div>
  );
}
