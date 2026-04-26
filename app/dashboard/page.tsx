import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRoshalAdmin } from "@/lib/roshal/auth";
import { getRoshalDashboardSnapshot } from "@/lib/roshal/content";
import { formatBdt, formatOrderDate } from "@/lib/roshal/format";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import { getRoshalOrderStatusLabel } from "@/lib/roshal/orders";

export default async function DashboardHomePage() {
  const [locale, snapshot] = await Promise.all([
    getRoshalLocale(),
    getRoshalDashboardSnapshot(),
    requireRoshalAdmin(),
  ]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "অ্যাডমিন ড্যাশবোর্ড" : "Admin dashboard"}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
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
        <MetricCard
          title={locale === "bn" ? "মোট পণ্য" : "Products"}
          value={snapshot.productCount}
        />
        <MetricCard
          title={locale === "bn" ? "লো স্টক" : "Low stock"}
          value={snapshot.lowStockProductCount}
        />
        <MetricCard
          title={locale === "bn" ? "স্টক শেষ" : "Out of stock"}
          value={snapshot.outOfStockProductCount}
        />
        <MetricCard
          title={locale === "bn" ? "চলমান অর্ডার" : "Pending orders"}
          value={snapshot.pendingOrderCount}
        />
        <MetricCard
          title={locale === "bn" ? "ব্যবহারকারী" : "Users"}
          value={snapshot.userCount}
        />
        <MetricCard
          title={locale === "bn" ? "মার্কেটিং পেজ" : "Marketing pages"}
          value={snapshot.marketingPageCount}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {locale === "bn" ? "সাম্প্রতিক অর্ডার" : "Recent orders"}
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
                className="flex flex-col gap-2 rounded-xl border border-border/70 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerName} ·{" "}
                    {formatOrderDate(order.createdAt, locale)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {formatBdt(order.total, locale)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === "bn"
                      ? getRoshalOrderStatusLabel(order.status).bn
                      : getRoshalOrderStatusLabel(order.status).en}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {locale === "bn" ? "ফিচারড পণ্য" : "Featured products"}
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
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-4"
              >
                <div>
                  <p className="font-medium">
                    {locale === "bn" ? product.name.bn : product.name.en}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === "bn"
                      ? product.categoryLabel.bn
                      : product.categoryLabel.en}
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  {formatBdt(product.price, locale)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
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
