import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  FileText,
  Package,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
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
import type { RoshalOrder, RoshalProduct } from "@/lib/store-types";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  trend: string;
  trendDirection?: "up" | "down";
  icon: ComponentType<{ className?: string }>;
  accentClassName: string;
  emoji: string;
};

function DashboardStatCard({
  title,
  value,
  description,
  trend,
  trendDirection = "up",
  icon: Icon,
  accentClassName,
  emoji,
}: StatCardProps) {
  const TrendIcon = trendDirection === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card
      className={`group min-w-0 overflow-hidden border-none border-r-[6px] bg-card/50 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-card hover:shadow-md ${accentClassName}`}
    >
      <CardContent className="min-w-0 p-4 sm:p-5">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="break-words text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="break-words text-2xl font-bold leading-tight tracking-tight">
              {value}
            </p>
            <p className="break-words text-xs text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-lg">
              {emoji}
            </span>
            <span className="hidden rounded-full bg-primary/10 p-2 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground sm:flex">
              <Icon className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="mt-4 flex min-w-0 items-start gap-1 text-xs text-muted-foreground">
          <TrendIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="min-w-0 break-words">{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentOrderRow({
  order,
  locale,
}: {
  order: RoshalOrder;
  locale: Awaited<ReturnType<typeof getRoshalLocale>>;
}) {
  return (
    <div className="flex items-center gap-4 rounded-md border bg-background/60 p-3 transition hover:bg-accent/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {order.orderNumber.slice(-2)}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold">{order.orderNumber}</p>
          <Badge variant="secondary" className="rounded-sm">
            {getLocalizedValue(locale, getRoshalOrderStatusLabel(order.status))}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {order.customerName} · {formatOrderDate(order.createdAt, locale)}
        </p>
      </div>
      <p className="shrink-0 text-sm font-semibold">
        {formatBdt(order.total, locale)}
      </p>
    </div>
  );
}

function FeaturedProductRow({
  product,
  locale,
}: {
  product: RoshalProduct;
  locale: Awaited<ReturnType<typeof getRoshalLocale>>;
}) {
  return (
    <div className="flex items-center gap-4 rounded-md border bg-background/60 p-3 transition hover:bg-accent/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Package className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-semibold">
          {getLocalizedValue(locale, product.name)}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {getLocalizedValue(locale, product.categoryLabel)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold">
          {formatBdt(product.price, locale)}
        </p>
        <p className="text-xs text-muted-foreground">
          {product.inventory} stock
        </p>
      </div>
    </div>
  );
}

export default async function DashboardHomePage() {
  await requireRoshalAdmin();

  const [locale, snapshot, products, orders, pages, users] = await Promise.all([
    getRoshalLocale(),
    getRoshalDashboardSnapshot(),
    getAllRoshalProducts(),
    getRoshalOrders(),
    getRoshalPages(),
    getRoshalUsers(),
  ]);

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  );
  const deliveredRevenue = deliveredOrders.reduce(
    (sum, order) => sum + order.total,
    0,
  );
  const publishedPages = pages.filter(
    (page) => page.status === "published",
  ).length;
  const visibleNavigationPages = pages.filter(
    (page) => page.showInNavigation,
  ).length;
  const customerCount = users.filter((user) => user.role !== "admin").length;
  const publishedProducts = products.filter((product) => product.isPublished);
  const publishedProductRatio =
    products.length > 0
      ? Math.round((publishedProducts.length / products.length) * 100)
      : 0;
  const fulfillmentOrders = orders.filter((order) =>
    ["pending", "payment-review", "confirmed", "processing"].includes(
      order.status,
    ),
  ).length;
  const storefrontHealth =
    snapshot.outOfStockProductCount === 0
      ? "No stock blockers"
      : `${snapshot.outOfStockProductCount} stock blocker${
          snapshot.outOfStockProductCount === 1 ? "" : "s"
        }`;

  return (
    <div className="min-w-0 space-y-6 p-6">
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Admin dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Roshal Organic overview
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Live store, catalog, order, and CMS controls in one clean admin
            workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/pages">Marketing pages</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/products/new">New product</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        <DashboardStatCard
          title="Total revenue"
          value={formatBdt(deliveredRevenue, locale)}
          description={`${deliveredOrders.length} delivered order${
            deliveredOrders.length === 1 ? "" : "s"
          } counted`}
          trend={`${fulfillmentOrders} need fulfillment`}
          icon={ShoppingBag}
          accentClassName="border-r-primary"
          emoji={"\u{1F4B0}"}
        />
        <DashboardStatCard
          title="Products"
          value={snapshot.productCount}
          description={`${publishedProductRatio}% published catalog`}
          trend={`${snapshot.lowStockProductCount} low-stock items`}
          trendDirection={
            snapshot.lowStockProductCount > 0 ||
            snapshot.outOfStockProductCount > 0
              ? "down"
              : "up"
          }
          icon={Package}
          accentClassName="border-r-secondary"
          emoji={"\u{1F6CD}\uFE0F"}
        />
        <DashboardStatCard
          title="Customers"
          value={customerCount}
          description={`${users.length - customerCount} admin account${
            users.length - customerCount === 1 ? "" : "s"
          }`}
          trend="Audience data stays dashboard-managed"
          icon={Users}
          accentClassName="border-r-accent"
          emoji={"\u{1F465}"}
        />
        <DashboardStatCard
          title="CMS pages"
          value={snapshot.marketingPageCount}
          description={`${publishedPages} published pages`}
          trend={`${visibleNavigationPages} visible in navigation`}
          icon={FileText}
          accentClassName="border-r-muted-foreground"
          emoji={"\u{1F4C4}"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        <DashboardStatCard
          title="Pending orders"
          value={snapshot.pendingOrderCount}
          description="Orders awaiting review"
          trend="Review before fulfillment"
          trendDirection={snapshot.pendingOrderCount > 0 ? "down" : "up"}
          icon={Clock}
          accentClassName="border-r-destructive"
          emoji={"\u23F1\uFE0F"}
        />
        <DashboardStatCard
          title="Storefront health"
          value={storefrontHealth}
          description={`${snapshot.outOfStockProductCount} out-of-stock item${
            snapshot.outOfStockProductCount === 1 ? "" : "s"
          }`}
          trend="Keep catalog availability clean"
          trendDirection={snapshot.outOfStockProductCount > 0 ? "down" : "up"}
          icon={AlertTriangle}
          accentClassName="border-r-primary"
          emoji={"\u26A0\uFE0F"}
        />
        <DashboardStatCard
          title="Featured products"
          value={snapshot.featuredProducts.length}
          description="Highlighted on storefront shelves"
          trend="Managed from product editor"
          icon={Store}
          accentClassName="border-r-secondary"
          emoji={"\u2B50"}
        />
        <DashboardStatCard
          title="Published products"
          value={snapshot.publishedProductCount}
          description={`${products.length - snapshot.publishedProductCount} draft item${
            products.length - snapshot.publishedProductCount === 1 ? "" : "s"
          }`}
          trend="Catalog visibility signal"
          icon={Package}
          accentClassName="border-r-accent"
          emoji={"\u2705"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-none bg-card shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Recent orders</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest customer activity from the live checkout flow.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.recentOrders.length > 0 ? (
              snapshot.recentOrders.map((order) => (
                <RecentOrderRow key={order.id} order={order} locale={locale} />
              ))
            ) : (
              <p className="rounded-md border bg-background/60 p-4 text-sm text-muted-foreground">
                No orders have been placed yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Featured products</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Storefront highlights currently controlled by product data.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/products">Catalog</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.featuredProducts.length > 0 ? (
              snapshot.featuredProducts.map((product) => (
                <FeaturedProductRow
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))
            ) : (
              <p className="rounded-md border bg-background/60 p-4 text-sm text-muted-foreground">
                No featured products are selected yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
