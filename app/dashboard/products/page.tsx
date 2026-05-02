import { Plus } from "lucide-react";
import Link from "next/link";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { ProductCreatedToast } from "@/components/dashboard/product-created-toast";
import { RoshalProductsTable } from "@/components/dashboard/products-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getAllRoshalProducts } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function DashboardProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ created?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, products] = await Promise.all([
    getRoshalLocale(),
    getAllRoshalProducts(),
    requireRoshalAdmin(),
  ]);
  const publishedCount = products.filter(
    (product) => product.isPublished,
  ).length;
  const lowStockCount = products.filter(
    (product) => product.inventory > 0 && product.inventory <= 10,
  ).length;
  const outOfStockCount = products.filter(
    (product) => product.inventory <= 0,
  ).length;
  return (
    <div className="min-w-0 space-y-6 px-6 pt-6 pb-4">
      <ProductCreatedToast enabled={Boolean(resolvedSearchParams.created)} />

      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "পণ্য" : "Products"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {locale === "bn" ? "ক্যাটালগ ম্যানেজমেন্ট" : "Catalog management"}
          </h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="size-4" />
            {locale === "bn" ? "নতুন পণ্য" : "New product"}
          </Link>
        </Button>
      </div>

      {resolvedSearchParams.created ? (
        <Alert>
          <AlertDescription>
            New product added. It is now visible in the product list.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardMetricCard
          title={locale === "bn" ? "মোট পণ্য" : "Products"}
          value={products.length}
          hint={`${publishedCount} published products`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "প্রকাশিত" : "Published"}
          value={publishedCount}
          hint={`${products.length - publishedCount} draft products`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "লো স্টক" : "Low stock"}
          value={lowStockCount}
          hint="Inventory is between 1 and 10"
        />
        <DashboardMetricCard
          title={locale === "bn" ? "স্টক শেষ" : "Out of stock"}
          value={outOfStockCount}
          hint="Unavailable storefront items"
        />
      </div>

      {/* Extra inventory/category/price insight panels are intentionally hidden per client request. */}

      <RoshalProductsTable products={products} locale={locale} />
    </div>
  );
}
