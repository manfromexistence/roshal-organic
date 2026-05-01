import {
  type CategoryTableRow,
  RoshalCategoriesTable,
} from "@/components/dashboard/categories-table";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getAllRoshalProducts } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";
import { productMatchesCategory } from "@/lib/store-taxonomy";
import { getRoshalTaxonomy } from "@/lib/store-taxonomy-content";

export default async function DashboardCategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    key?: string;
    subcategory?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, taxonomy, products] = await Promise.all([
    getRoshalLocale(),
    getRoshalTaxonomy(),
    getAllRoshalProducts(),
    requireRoshalAdmin(),
  ]);
  const errorMessage = getTaxonomyErrorMessage(
    locale,
    resolvedSearchParams.error,
    resolvedSearchParams.key,
    resolvedSearchParams.subcategory,
  );
  const visibleInNavigationCount = taxonomy.categories.filter(
    (category) => category.showInNavigation && category.isEnabled,
  ).length;
  const visibleOnHomeCount = taxonomy.categories.filter(
    (category) => category.showOnHomepage && category.isEnabled,
  ).length;
  const categoryRows: CategoryTableRow[] = taxonomy.categories.map(
    (category) => {
      const subcategoryCount = taxonomy.subcategories.filter(
        (subcategory) => subcategory.categoryId === category.id,
      ).length;
      const productCount = products.filter((product) =>
        productMatchesCategory(product, category),
      ).length;

      return {
        id: category.id,
        key: category.key,
        label: getLocalizedValue(locale, category.label),
        latestAt: (
          category.updatedAt ||
          category.createdAt ||
          new Date(0)
        ).getTime(),
        productCount,
        showInNavigation: category.showInNavigation && category.isEnabled,
        showOnHomepage: category.showOnHomepage && category.isEnabled,
        sortOrder: category.sortOrder,
        status: category.isEnabled ? "Enabled" : "Disabled",
        subcategoryCount,
      };
    },
  );

  return (
    <div className="min-w-0 space-y-6 px-6 pt-6 pb-4">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "ক্যাটাগরি ও সাবক্যাটাগরি" : "Categories & subcategories"}
        </p>
        <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "স্টোরফ্রন্ট ট্যাক্সোনমি" : "Category Management"}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {locale === "bn"
            ? "টপ কার্ড এবং ক্যাটাগরি টেবিল দিয়ে দ্রুত স্টোরফ্রন্ট ট্যাক্সোনমি দেখুন।"
            : "Review storefront taxonomy through summary cards and the category table."}
        </p>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title={locale === "bn" ? "মোট ক্যাটাগরি" : "Categories"}
          value={String(taxonomy.categories.length)}
          hint={
            locale === "bn"
              ? "মেনু ও ফিল্টারে ব্যবহৃত টপ-লেভেল গ্রুপ"
              : "Top-level groups used by navigation and filters"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "মোট সাবক্যাটাগরি" : "Subcategories"}
          value={String(taxonomy.subcategories.length)}
          hint={
            locale === "bn"
              ? "প্রতিটি ক্যাটাগরির নিচে দেখানো নেস্টেড অপশন"
              : "Nested options shown under each category"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "নেভিগেশনে দৃশ্যমান" : "Visible in nav"}
          value={String(visibleInNavigationCount)}
          hint={
            locale === "bn"
              ? "হেডার সাব-নেভিগেশনে বর্তমানে দেখানো গ্রুপ"
              : "Groups currently shown in the storefront header"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "হোমপেজে দৃশ্যমান" : "Visible on home"}
          value={String(visibleOnHomeCount)}
          hint={
            locale === "bn"
              ? "হোমপেজের ফিচার্ড ক্যাটাগরি স্ট্রিপে দেখানো আইটেম"
              : "Items currently surfaced in the homepage category strip"
          }
        />
      </div>

      {/* Category cards, insight panels, and inline create/manage taxonomy forms are intentionally hidden per client request. */}
      <RoshalCategoriesTable rows={categoryRows} />
    </div>
  );
}

function getTaxonomyErrorMessage(
  locale: "bn" | "en",
  code: string | undefined,
  key: string | undefined,
  subcategory: string | undefined,
) {
  switch (code) {
    case "invalid-category-key":
      return locale === "bn"
        ? "ক্যাটাগরি key-তে শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন ব্যবহার করুন।"
        : "Use only lowercase letters, numbers, and hyphens in category keys.";
    case "duplicate-category-key":
      return locale === "bn"
        ? `\`${key || ""}\` key-টি ইতিমধ্যেই অন্য একটি ক্যাটাগরিতে ব্যবহৃত হচ্ছে।`
        : `The category key \`${key || ""}\` is already in use.`;
    case "invalid-subcategory-key":
      return locale === "bn"
        ? "সাবক্যাটাগরি key-তে শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন ব্যবহার করুন।"
        : "Use only lowercase letters, numbers, and hyphens in subcategory keys.";
    case "duplicate-subcategory-key":
      return locale === "bn"
        ? `\`${subcategory || ""}\` key-টি ইতিমধ্যেই অন্য একটি সাবক্যাটাগরিতে ব্যবহৃত হচ্ছে।`
        : `The subcategory key \`${subcategory || ""}\` is already in use.`;
    case "category-not-found":
      return locale === "bn"
        ? "নির্বাচিত parent category খুঁজে পাওয়া যায়নি। আবার নির্বাচন করুন।"
        : "The selected parent category could not be found.";
    default:
      return null;
  }
}
