import Link from "next/link";
import {
  DashboardBarChartCard,
  DashboardPieChartCard,
} from "@/components/dashboard/dashboard-chart-card";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { RoshalProductsTable } from "@/components/dashboard/products-table";
import { Button } from "@/components/ui/button";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getAllRoshalProducts } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";

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
  const inventoryHealthData = [
    {
      key: "in-stock",
      label: locale === "bn" ? "স্টকে আছে" : "In stock",
      value: products.filter((product) => product.inventory > 10).length,
    },
    {
      key: "low-stock",
      label: locale === "bn" ? "লো স্টক" : "Low stock",
      value: lowStockCount,
    },
    {
      key: "out-of-stock",
      label: locale === "bn" ? "স্টক শেষ" : "Out of stock",
      value: outOfStockCount,
    },
  ];
  const categoryDistributionData = Array.from(
    products.reduce((map, product) => {
      const key = product.categoryKey;
      const label = getLocalizedValue(locale, product.categoryLabel);
      const current = map.get(key) || { key, label, value: 0 };

      current.value += 1;
      map.set(key, current);

      return map;
    }, new Map<string, { key: string; label: string; value: number }>()),
  )
    .map(([, value]) => value)
    .sort((left, right) => right.value - left.value)
    .slice(0, 8);
  const priceBandData = [
    {
      key: "under-500",
      label: locale === "bn" ? "৳৫০০ এর নিচে" : "Under BDT 500",
      value: products.filter((product) => product.price < 500).length,
    },
    {
      key: "500-999",
      label: locale === "bn" ? "৳৫০০-৯৯৯" : "BDT 500-999",
      value: products.filter(
        (product) => product.price >= 500 && product.price < 1000,
      ).length,
    },
    {
      key: "1000-1999",
      label: locale === "bn" ? "৳১০০০-১৯৯৯" : "BDT 1000-1999",
      value: products.filter(
        (product) => product.price >= 1000 && product.price < 2000,
      ).length,
    },
    {
      key: "2000-plus",
      label: locale === "bn" ? "৳২০০০+" : "BDT 2000+",
      value: products.filter((product) => product.price >= 2000).length,
    },
  ];

  return (
    <div className="min-w-0 space-y-6 p-4 md:p-6">
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
            {locale === "bn" ? "নতুন পণ্য" : "New product"}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          title={locale === "bn" ? "মোট পণ্য" : "Products"}
          value={products.length}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "প্রকাশিত" : "Published"}
          value={publishedCount}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "লো স্টক" : "Low stock"}
          value={lowStockCount}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "স্টক শেষ" : "Out of stock"}
          value={outOfStockCount}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardPieChartCard
          title={locale === "bn" ? "ইনভেন্টরি স্বাস্থ্য" : "Inventory health"}
          description={
            locale === "bn"
              ? "স্টকে আছে, ঝুঁকিতে আছে, এবং শেষ হয়ে গেছে এমন SKU-র অনুপাত।"
              : "The split between healthy, low, and exhausted inventory."
          }
          totalLabel={locale === "bn" ? "SKU" : "SKUs"}
          data={inventoryHealthData}
        />
        <DashboardBarChartCard
          title={locale === "bn" ? "ক্যাটাগরি বণ্টন" : "Category distribution"}
          description={
            locale === "bn"
              ? "কোন ক্যাটাগরিতে কতগুলো পণ্য আছে তা দ্রুত দেখা যায়।"
              : "See how the catalog is weighted across categories."
          }
          totalLabel={locale === "bn" ? "পণ্য" : "Products"}
          data={categoryDistributionData}
        />
        <DashboardBarChartCard
          title={locale === "bn" ? "মূল্য ব্যান্ড" : "Price bands"}
          description={
            locale === "bn"
              ? "কোন দামের রেঞ্জে আপনার ক্যাটালগ সবচেয়ে বেশি আছে তা বুঝতে সাহায্য করে।"
              : "Shows where the catalog is concentrated by retail price."
          }
          totalLabel={locale === "bn" ? "রেঞ্জ" : "Range"}
          data={priceBandData}
          className="xl:col-span-2"
        />
      </div>

      <RoshalProductsTable products={products} locale={locale} />
    </div>
  );
}
