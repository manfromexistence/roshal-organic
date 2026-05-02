import { Plus } from "lucide-react";
import Link from "next/link";
import { DashboardFormStatusToast } from "@/components/dashboard/dashboard-form-status-toast";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { RoshalProductsTable } from "@/components/dashboard/products-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getDashboardActionErrorMessage } from "@/lib/dashboard-action-errors";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getAllRoshalProducts } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function DashboardProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    actionId?: string;
    created?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorMessage = getDashboardActionErrorMessage(
    resolvedSearchParams.error,
  );
  const showDeletedFeedback = Boolean(resolvedSearchParams.deleted);
  const showCreatedFeedback =
    Boolean(resolvedSearchParams.created) && !showDeletedFeedback;
  const feedbackStatus = showDeletedFeedback
    ? "deleted"
    : showCreatedFeedback
      ? "created"
      : undefined;
  const successMessage =
    feedbackStatus === "deleted"
      ? "Product deleted successfully."
      : feedbackStatus === "created"
        ? "New product added. It is now visible in the product list."
        : undefined;
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
      <DashboardFormStatusToast
        errorMessage={errorMessage || undefined}
        successMessage={successMessage}
      />

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

      {showCreatedFeedback ? (
        <Alert>
          <AlertDescription>
            New product added. It is now visible in the product list.
          </AlertDescription>
        </Alert>
      ) : null}

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {showDeletedFeedback ? (
        <Alert>
          <AlertDescription>Product deleted successfully.</AlertDescription>
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
