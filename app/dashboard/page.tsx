import Link from "next/link";
import {
  DashboardBarChartCard,
  DashboardPieChartCard,
} from "@/components/dashboard/dashboard-chart-card";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRoshalAdmin } from "@/lib/store-auth";
import {
  getAllRoshalProducts,
  getRoshalDashboardSnapshot,
  getRoshalOrders,
  getRoshalPages,
  getRoshalUsers,
} from "@/lib/store-content";
import { formatBdt, formatOrderDate } from "@/lib/store-format";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";
import { getRoshalOrderStatusLabel } from "@/lib/store-orders";

export default async function DashboardHomePage() {
  const [locale, snapshot, products, orders, pages, users] = await Promise.all([
    getRoshalLocale(),
    getRoshalDashboardSnapshot(),
    getAllRoshalProducts(),
    getRoshalOrders(),
    getRoshalPages(),
    getRoshalUsers(),
    requireRoshalAdmin(),
  ]);

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
  const publicationData = [
    {
      key: "published",
      label: locale === "bn" ? "প্রকাশিত" : "Published",
      value: products.filter((product) => product.isPublished).length,
    },
    {
      key: "draft",
      label: locale === "bn" ? "ড্রাফট" : "Draft",
      value: products.filter((product) => !product.isPublished).length,
    },
    {
      key: "featured",
      label: locale === "bn" ? "ফিচারড" : "Featured",
      value: products.filter((product) => product.isFeatured).length,
    },
  ];
  const audienceData = [
    {
      key: "admin",
      label: locale === "bn" ? "অ্যাডমিন" : "Admins",
      value: users.filter((user) => user.role === "admin").length,
    },
    {
      key: "user",
      label: locale === "bn" ? "গ্রাহক" : "Customers",
      value: users.filter((user) => user.role !== "admin").length,
    },
    {
      key: "navigation",
      label: locale === "bn" ? "নেভ পেজ" : "Nav pages",
      value: pages.filter((page) => page.showInNavigation).length,
    },
  ];

  return (
    <div className="min-w-0 space-y-6 p-4 md:p-6">
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "অ্যাডমিন ড্যাশবোর্ড" : "Admin dashboard"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {locale === "bn"
              ? "Roshal Organic পরিচালনা"
              : "Manage Roshal Organic"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/pages">
              {locale === "bn" ? "মার্কেটিং পেজ" : "Marketing pages"}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/products/new">
              {locale === "bn" ? "নতুন পণ্য" : "New product"}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardMetricCard
          title={locale === "bn" ? "🛍️ মোট পণ্য" : "🛍️ Products"}
          value={snapshot.productCount}
          hint={locale === "bn" ? "লাইভ ক্যাটালগ গুনতি" : "Live catalog count"}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "⚠️ লো স্টক" : "⚠️ Low stock"}
          value={snapshot.lowStockProductCount}
          hint={
            locale === "bn"
              ? "অবিলম্বে রিস্টক দরকার"
              : "Items that need restocking soon"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "❌ স্টক শেষ" : "❌ Out of stock"}
          value={snapshot.outOfStockProductCount}
          hint={
            locale === "bn"
              ? "স্টোরফ্রন্টে ঝুঁকিপূর্ণ SKU"
              : "SKUs currently unavailable on the storefront"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "📋 চলমান অর্ডার" : "📋 Pending orders"}
          value={snapshot.pendingOrderCount}
          hint={
            locale === "bn"
              ? "রিভিউ বা ফুলফিলমেন্টে আছে"
              : "Still in review or fulfillment"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "👥 ব্যবহারকারী" : "👥 Users"}
          value={snapshot.userCount}
          hint={
            locale === "bn"
              ? "অ্যাডমিন ও কাস্টমার মিলিয়ে"
              : "Admins and customers combined"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "📄 মার্কেটিং পেজ" : "📄 Marketing pages"}
          value={snapshot.marketingPageCount}
          hint={
            locale === "bn"
              ? "CMS থেকে চালিত পাবলিক পেজ"
              : "Public pages managed through the CMS"
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardBarChartCard
          title={locale === "bn" ? "অর্ডার ফানেল" : "Order funnel"}
          description={
            locale === "bn"
              ? "লাইভ অর্ডার স্ট্যাটাস বণ্টন এখন সরাসরি স্টোরফ্রন্ট অর্ডার ফ্লো থেকে আসছে।"
              : "Live order-status distribution pulled directly from the storefront order flow."
          }
          totalLabel={locale === "bn" ? "মোট অর্ডার" : "Total orders"}
          data={orderStatusData}
          className="xl:col-span-2"
        />
        <DashboardPieChartCard
          title={locale === "bn" ? "ক্যাটালগ প্রকাশ অবস্থা" : "Catalog publication"}
          description={
            locale === "bn"
              ? "প্রকাশিত, ড্রাফট, এবং ফিচারড পণ্যের দ্রুত স্বাস্থ্য-সিগন্যাল।"
              : "A quick health signal for published, draft, and featured products."
          }
          totalLabel={locale === "bn" ? "পণ্য" : "Products"}
          data={publicationData}
        />
        <DashboardPieChartCard
          title={
            locale === "bn" ? "অডিয়েন্স ও নেভিগেশন" : "Audience and navigation"
          }
          description={
            locale === "bn"
              ? "অ্যাডমিন, গ্রাহক, এবং নেভিগেশনে প্রকাশিত পেজের অনুপাত।"
              : "The split between admins, customers, and pages surfaced in navigation."
          }
          totalLabel={locale === "bn" ? "সক্রিয়" : "Active"}
          data={audienceData}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-none bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              {locale === "bn" ? "📦 সাম্প্রতিক অর্ডার" : "📦 Recent orders"}
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/orders">
                {locale === "bn" ? "সব দেখুন" : "View all"}
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4"
              >
                <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center font-semibold text-xs text-accent-foreground">
                  {order.orderNumber.slice(-2)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{order.customerName}</p>
                </div>
                <div className="font-medium text-sm">{formatBdt(order.total, locale)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              {locale === "bn" ? "⭐ ফিচারড পণ্য" : "⭐ Featured products"}
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/products">
                {locale === "bn" ? "ক্যাটালগ" : "Catalog"}
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4"
              >
                <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center font-semibold text-xs text-accent-foreground">
                  🛍️
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {locale === "bn" ? product.name.bn : product.name.en}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === "bn"
                      ? product.categoryLabel.bn
                      : product.categoryLabel.en}
                  </p>
                </div>
                <div className="font-medium text-sm">{formatBdt(product.price, locale)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
