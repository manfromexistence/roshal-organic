import { ArrowDownRight, ArrowUpRight, Package } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRoshalAdmin } from "@/lib/store-auth";
import {
  getAllRoshalProducts,
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
  accentClassName: string;
  emoji: string;
  href: string;
  surfaceClassName?: string;
};

function DashboardStatCard({
  title,
  value,
  description,
  trend,
  trendDirection = "up",
  accentClassName,
  emoji,
  href,
  surfaceClassName,
}: StatCardProps) {
  const TrendIcon = trendDirection === "up" ? ArrowUpRight : ArrowDownRight;
  const colorSurfaceClass =
    surfaceClassName ||
    (accentClassName === "border-r-primary"
      ? "bg-primary/10"
      : accentClassName === "border-r-secondary"
        ? "bg-secondary/80"
        : accentClassName === "border-r-accent"
          ? "bg-accent/80"
          : accentClassName === "border-r-destructive"
            ? "bg-destructive/10"
            : "bg-muted/70");

  return (
    <Link
      href={href}
      className="block min-w-0 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Card
        className={`group h-full min-w-0 overflow-hidden border-none border-r-[6px] p-0 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${accentClassName} ${colorSurfaceClass}`}
      >
        <CardContent className="min-w-0 p-2.5 sm:p-3">
          <div className="flex min-w-0 items-start justify-between gap-1.5 sm:gap-3">
            <div className="min-w-0 space-y-1">
              <p className="break-words text-xs font-semibold text-foreground sm:text-sm">
                {title}
              </p>
              <p className="break-words text-xl font-extrabold leading-tight tracking-tight text-foreground sm:text-2xl">
                {value}
              </p>
              <p className="break-words text-[11px] text-muted-foreground sm:text-xs">
                {description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs sm:h-7 sm:w-7 sm:text-sm">
                {emoji}
              </span>
            </div>
          </div>
          <div className="mt-2 flex min-w-0 items-start gap-1 text-[11px] text-muted-foreground sm:mt-2.5 sm:text-xs">
            <TrendIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="min-w-0 break-words">{trend}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
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
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="flex items-center gap-3 rounded-md border bg-background/60 p-2.5 transition hover:bg-accent/50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
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
    </Link>
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
    <Link
      href={`/dashboard/products/${product.id}`}
      className="flex items-center gap-3 rounded-md border bg-background/60 p-2.5 transition hover:bg-accent/50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
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
    </Link>
  );
}

export default async function DashboardHomePage() {
  await requireRoshalAdmin();

  const [locale, products, orders, pages, users] = await Promise.all([
    getRoshalLocale(),
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
  const unpaidAmount = orders
    .filter((order) => order.paymentStatus !== "paid")
    .reduce((sum, order) => sum + order.total, 0);
  const paymentReviewOrders = orders.filter(
    (order) =>
      order.status === "payment-review" ||
      order.paymentStatus === "under-review",
  );
  const publishedPages = pages.filter(
    (page) => page.status === "published",
  ).length;
  const visibleNavigationPages = pages.filter(
    (page) => page.showInNavigation,
  ).length;
  const customerCount = users.filter((user) => user.role !== "admin").length;
  const publishedProducts = products.filter((product) => product.isPublished);
  const lowStockProducts = publishedProducts.filter(
    (product) => product.inventory > 0 && product.inventory <= 10,
  );
  const outOfStockProducts = publishedProducts.filter(
    (product) => product.inventory <= 0,
  );
  const featuredProducts = publishedProducts
    .filter((product) => product.isFeatured)
    .slice(0, 4);
  const recentOrders = orders.slice(0, 5);
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
    outOfStockProducts.length === 0
      ? "No stock blockers"
      : `${outOfStockProducts.length} stock blocker${
          outOfStockProducts.length === 1 ? "" : "s"
        }`;

  return (
    <div className="min-w-0 space-y-5 px-6 pt-6 pb-4">
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
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardStatCard
          title="Total revenue"
          value={formatBdt(deliveredRevenue, locale)}
          description={`${deliveredOrders.length} delivered order${
            deliveredOrders.length === 1 ? "" : "s"
          } counted`}
          trend={`${fulfillmentOrders} need fulfillment`}
          accentClassName="border-r-emerald-500"
          surfaceClassName="bg-emerald-50 text-emerald-950 dark:bg-emerald-950/35 dark:text-emerald-50"
          emoji={"\u{1F4B0}"}
          href="/dashboard/orders"
        />
        <DashboardStatCard
          title="Unpaid amount"
          value={formatBdt(unpaidAmount, locale)}
          description="Pending, review, or failed payments"
          trend={`${fulfillmentOrders} active fulfillment orders`}
          trendDirection={unpaidAmount > 0 ? "down" : "up"}
          accentClassName="border-r-red-500"
          surfaceClassName="bg-red-50 text-red-950 dark:bg-red-950/35 dark:text-red-50"
          emoji={"\u{1F4B3}"}
          href="/dashboard/orders"
        />
        <DashboardStatCard
          title="Payment review"
          value={paymentReviewOrders.length}
          description="Manual payment checks waiting"
          trend="Review proof and confirm payments"
          trendDirection={paymentReviewOrders.length > 0 ? "down" : "up"}
          accentClassName="border-r-orange-500"
          surfaceClassName="bg-orange-50 text-orange-950 dark:bg-orange-950/35 dark:text-orange-50"
          emoji={"\u2728"}
          href="/dashboard/orders"
        />
        <DashboardStatCard
          title="Products"
          value={products.length}
          description={`${publishedProductRatio}% published catalog`}
          trend={`${lowStockProducts.length} low-stock items`}
          trendDirection={
            lowStockProducts.length > 0 || outOfStockProducts.length > 0
              ? "down"
              : "up"
          }
          accentClassName="border-r-secondary"
          emoji={"\u{1F6CD}\uFE0F"}
          href="/dashboard/products"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardStatCard
          title="Customers"
          value={customerCount}
          description={`${users.length - customerCount} admin account${
            users.length - customerCount === 1 ? "" : "s"
          }`}
          trend="Audience data stays dashboard-managed"
          accentClassName="border-r-accent"
          emoji={"\u{1F465}"}
          href="/dashboard/users"
        />
        <DashboardStatCard
          title="CMS pages"
          value={pages.length}
          description={`${publishedPages} published pages`}
          trend={`${visibleNavigationPages} visible in navigation`}
          accentClassName="border-r-muted-foreground"
          emoji={"\u{1F4C4}"}
          href="/dashboard/pages"
        />
        <DashboardStatCard
          title="Storefront health"
          value={storefrontHealth}
          description={`${outOfStockProducts.length} live out-of-stock item${
            outOfStockProducts.length === 1 ? "" : "s"
          }`}
          trend="Keep catalog availability clean"
          trendDirection={outOfStockProducts.length > 0 ? "down" : "up"}
          accentClassName="border-r-orange-500"
          surfaceClassName="bg-orange-50 text-orange-950 dark:bg-orange-950/35 dark:text-orange-50"
          emoji={"\u26A0\uFE0F"}
          href="/dashboard/products"
        />
        <DashboardStatCard
          title="Published products"
          value={publishedProducts.length}
          description={`${products.length - publishedProducts.length} draft item${
            products.length - publishedProducts.length === 1 ? "" : "s"
          }`}
          trend="Catalog visibility signal"
          accentClassName="border-r-accent"
          emoji={"\u2705"}
          href="/dashboard/products"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-none bg-card p-0 shadow-sm">
          <CardHeader className="flex flex-col gap-3 p-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
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
          <CardContent className="space-y-2.5 p-4 pt-0">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <RecentOrderRow key={order.id} order={order} locale={locale} />
              ))
            ) : (
              <p className="rounded-md border bg-background/60 p-4 text-sm text-muted-foreground">
                No orders have been placed yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-card p-0 shadow-sm">
          <CardHeader className="flex flex-col gap-3 p-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
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
          <CardContent className="space-y-2.5 p-4 pt-0">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
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
