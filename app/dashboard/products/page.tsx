import Link from "next/link";
import { RoshalProductsTable } from "@/components/roshal/dashboard/products-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRoshalAdmin } from "@/lib/roshal/auth";
import { getAllRoshalProducts } from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";

export default async function DashboardProductsPage() {
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
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "পণ্য" : "Products"}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {locale === "bn" ? "ক্যাটালগ ম্যানেজমেন্ট" : "Catalog management"}
          </h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            {locale === "bn" ? "নতুন পণ্য" : "New product"}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={locale === "bn" ? "মোট পণ্য" : "Products"}
          value={products.length}
        />
        <MetricCard
          title={locale === "bn" ? "প্রকাশিত" : "Published"}
          value={publishedCount}
        />
        <MetricCard
          title={locale === "bn" ? "লো স্টক" : "Low stock"}
          value={lowStockCount}
        />
        <MetricCard
          title={locale === "bn" ? "স্টক শেষ" : "Out of stock"}
          value={outOfStockCount}
        />
      </div>

      <RoshalProductsTable products={products} locale={locale} />
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
