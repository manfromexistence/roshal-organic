import {
  ChevronRight,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  removeRoshalCategory,
  removeRoshalSubcategory,
  saveRoshalCategory,
  saveRoshalSubcategory,
} from "@/actions/admin";
import { DashboardInsightCard } from "@/components/dashboard/dashboard-insight-card";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormCheckboxGroup } from "@/components/dashboard/form-checkbox-group";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getAllRoshalProducts } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";
import {
  productMatchesCategory,
  productMatchesSubcategory,
} from "@/lib/store-taxonomy";
import { getRoshalTaxonomy } from "@/lib/store-taxonomy-content";

export default async function DashboardCategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    key?: string;
    subcategory?: string;
    view?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, taxonomy, products] = await Promise.all([
    getRoshalLocale(),
    getRoshalTaxonomy(),
    getAllRoshalProducts(),
    requireRoshalAdmin(),
  ]);

  const bucketOptions = Array.from(
    products.reduce(
      (map, product) =>
        map.set(
          product.categoryKey,
          getLocalizedValue(locale, product.categoryLabel),
        ),
      new Map<string, string>(),
    ),
  )
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([value, label]) => ({
      value,
      label,
      description:
        locale === "bn"
          ? `এই প্রোডাক্ট বালতিটি ${label} ক্যাটাগরিতে পড়বে।`
          : `Products tagged with the ${label} bucket will appear here.`,
    }));
  const categoryOptions = taxonomy.categories.map((category) => ({
    value: category.id,
    label: getLocalizedValue(locale, category.label),
  }));
  const errorMessage = getTaxonomyErrorMessage(
    locale,
    resolvedSearchParams.error,
    resolvedSearchParams.key,
    resolvedSearchParams.subcategory,
  );
  const enabledCategoryCount = taxonomy.categories.filter(
    (category) => category.isEnabled,
  ).length;
  const visibleInNavigationCount = taxonomy.categories.filter(
    (category) => category.showInNavigation && category.isEnabled,
  ).length;
  const visibleOnHomeCount = taxonomy.categories.filter(
    (category) => category.showOnHomepage && category.isEnabled,
  ).length;
  const categoryVisibilityData = [
    {
      key: "nav",
      label: locale === "bn" ? "নেভিগেশনে" : "In navigation",
      value: visibleInNavigationCount,
    },
    {
      key: "home",
      label: locale === "bn" ? "হোমপেজে" : "On homepage",
      value: visibleOnHomeCount,
    },
    {
      key: "disabled",
      label: locale === "bn" ? "বন্ধ" : "Disabled",
      value: taxonomy.categories.length - enabledCategoryCount,
    },
  ];
  const subcategoryDepthData = taxonomy.categories.map((category) => ({
    key: category.key,
    label: getLocalizedValue(locale, category.label),
    value: taxonomy.subcategories.filter(
      (subcategory) => subcategory.categoryId === category.id,
    ).length,
  }));
  const productCoverageData = taxonomy.categories.map((category) => ({
    key: category.key,
    label: getLocalizedValue(locale, category.label),
    value: products.filter((product) =>
      productMatchesCategory(product, category),
    ).length,
  }));
  const firstCategoryId = taxonomy.categories[0]?.id;
  const activeView =
    resolvedSearchParams.view === "create" ? "create" : "categories";

  return (
    <div className="min-w-0 space-y-6 p-6">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "ক্যাটাগরি ও সাবক্যাটাগরি" : "Categories & subcategories"}
        </p>
        <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "স্টোরফ্রন্ট ট্যাক্সোনমি" : "Category Management"}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {locale === "bn"
            ? "হেডার নেভিগেশন, হোমপেজ ক্যাটাগরি, প্রোডাক্ট ফিল্টার এবং সাবক্যাটাগরি ড্রপডাউন এখন এই এক জায়গা থেকে নিয়ন্ত্রণ করুন।"
            : "Organize and manage your product catalog segments."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <Button asChild variant="secondary" className="shadow-sm">
          <Link
            href={
              firstCategoryId
                ? `/dashboard/categories/sub/new?categoryId=${firstCategoryId}`
                : "/dashboard/categories/new"
            }
          >
            <Plus className="size-4" />
            {locale === "bn" ? "নতুন সাবক্যাটাগরি" : "New Subcategory"}
          </Link>
        </Button>
        <Button asChild className="shadow-sm">
          <Link href="/dashboard/categories/new">
            <Plus className="size-4" />
            {locale === "bn" ? "নতুন ক্যাটাগরি" : "New Category"}
          </Link>
        </Button>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
          value={String(
            taxonomy.categories.filter(
              (category) => category.showInNavigation && category.isEnabled,
            ).length,
          )}
          hint={
            locale === "bn"
              ? "হেডার সাব-নেভিগেশনে বর্তমানে দেখানো গ্রুপ"
              : "Groups currently shown in the storefront header"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "হোমপেজে দৃশ্যমান" : "Visible on home"}
          value={String(
            taxonomy.categories.filter(
              (category) => category.showOnHomepage && category.isEnabled,
            ).length,
          )}
          hint={
            locale === "bn"
              ? "হোমপেজের ফিচার্ড ক্যাটাগরি স্ট্রিপে দেখানো আইটেম"
              : "Items currently surfaced in the homepage category strip"
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {taxonomy.categories.map((category) => {
          const categorySubcategories = taxonomy.subcategories.filter(
            (subcategory) => subcategory.categoryId === category.id,
          );
          const categoryProductCount = products.filter((product) =>
            productMatchesCategory(product, category),
          ).length;
          const categoryLabel = getLocalizedValue(locale, category.label);

          return (
            <Card
              key={category.id}
              className="group border-none bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-2xl shadow-inner">
                    {getCategoryIcon(category.key)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">
                          {locale === "bn"
                            ? "ক্যাটাগরি অ্যাকশন"
                            : "Category actions"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/categories/sub/new?categoryId=${category.id}`}
                        >
                          <Plus className="size-4" />
                          {locale === "bn"
                            ? "সাবক্যাটাগরি যোগ করুন"
                            : "Add Subcategory"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/categories?view=categories#edit-category-${category.id}`}
                        >
                          <Pencil className="size-4" />
                          {locale === "bn"
                            ? "ক্যাটাগরি এডিট করুন"
                            : "Edit Category"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/categories?view=categories#delete-category-${category.id}`}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          {locale === "bn" ? "ডিলিট অপশনে যান" : "Review Delete"}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <h2 className="truncate text-lg font-bold">
                      {categoryLabel}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="shrink-0 rounded-full font-normal"
                    >
                      {locale === "bn"
                        ? `${categoryProductCount} পণ্য`
                        : `${categoryProductCount} items`}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <LayoutGrid className="size-3" />
                      {locale === "bn" ? "সাবক্যাটাগরি" : "Subcategories"} (
                      {categorySubcategories.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {categorySubcategories.slice(0, 8).map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/dashboard/categories?view=categories#subcategory-${subcategory.id}`}
                          className="group/sub inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          {getLocalizedValue(locale, subcategory.label)}
                          <ChevronRight className="size-2 opacity-0 transition-opacity group-hover/sub:opacity-100" />
                        </Link>
                      ))}
                      <Link
                        href={`/dashboard/categories/sub/new?categoryId=${category.id}`}
                        className="inline-flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/30 px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted"
                      >
                        <Plus className="size-2" />
                        {locale === "bn" ? "যোগ" : "Add"}
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Button
          asChild
          variant="outline"
          className="h-full min-h-[200px] flex-col gap-2 border-dashed bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        >
          <Link href="/dashboard/categories/new">
            <Plus className="size-6" />
            <span className="font-medium">
              {locale === "bn" ? "নতুন ক্যাটাগরি যোগ করুন" : "Add New Category"}
            </span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardInsightCard
          title={locale === "bn" ? "ক্যাটাগরি ভিজিবিলিটি" : "Category visibility"}
          description={
            locale === "bn"
              ? "স্টোরফ্রন্ট নেভিগেশন, হোমপেজ, এবং নিষ্ক্রিয় ক্যাটাগরির দ্রুত চিত্র।"
              : "A quick read on navigation, homepage, and disabled category states."
          }
          totalLabel={locale === "bn" ? "ক্যাটাগরি" : "Categories"}
          data={categoryVisibilityData}
        />
        <DashboardInsightCard
          title={locale === "bn" ? "সাবক্যাটাগরি গভীরতা" : "Subcategory depth"}
          description={
            locale === "bn"
              ? "প্রতি ক্যাটাগরির নিচে কতগুলো সাবক্যাটাগরি আছে।"
              : "How deep each category currently goes in the storefront taxonomy."
          }
          totalLabel={locale === "bn" ? "সাবক্যাটাগরি" : "Subcategories"}
          data={subcategoryDepthData}
        />
        <DashboardInsightCard
          title={locale === "bn" ? "প্রোডাক্ট কভারেজ" : "Product coverage"}
          description={
            locale === "bn"
              ? "কোন ক্যাটাগরিতে কতগুলো প্রোডাক্ট মিলে পড়ছে তা ট্র্যাক করুন।"
              : "Track how many products currently resolve into each category."
          }
          totalLabel={locale === "bn" ? "প্রোডাক্ট" : "Products"}
          data={productCoverageData}
          className="xl:col-span-2"
        />
      </div>

      <Tabs
        id="category-workspace"
        defaultValue={activeView}
        className="space-y-4"
      >
        <div className="overflow-x-auto rounded-lg border border-border/70 bg-card p-1 shadow-sm">
          <TabsList className="grid h-auto w-full min-w-[520px] grid-cols-2 bg-muted/60">
            <TabsTrigger value="create" className="h-10 gap-2">
              <Plus className="size-4" />
              Create
              <Badge variant="secondary" className="rounded-full">
                1
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="categories" className="h-10 gap-2">
              <Pencil className="size-4" />
              Manage taxonomy
              <Badge variant="secondary" className="rounded-full">
                {taxonomy.categories.length + taxonomy.subcategories.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="create">
          <Card id="create-category" className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>
                {locale === "bn" ? "নতুন ক্যাটাগরি তৈরি করুন" : "Create category"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={saveRoshalCategory}
                className="grid min-w-0 gap-5 md:grid-cols-2"
              >
                <CategoryFields
                  locale={locale}
                  bucketOptions={bucketOptions}
                  defaults={{
                    key: "",
                    labelBn: "",
                    labelEn: "",
                    descriptionBn: "",
                    descriptionEn: "",
                    imageUrl: "",
                    sourceKeys: [],
                    isEnabled: true,
                    showInNavigation: true,
                    showOnHomepage: true,
                    sortOrder: String(taxonomy.categories.length),
                  }}
                  submitLabel={
                    locale === "bn" ? "ক্যাটাগরি তৈরি করুন" : "Create category"
                  }
                />
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <ScrollArea
            className="h-[64vh] min-h-[360px] rounded-lg"
            viewportClassName="pr-3"
          >
            <div className="space-y-6">
              {taxonomy.categories.map((category) => {
                const categorySubcategories = taxonomy.subcategories.filter(
                  (subcategory) => subcategory.categoryId === category.id,
                );
                const categoryProductCount = products.filter((product) =>
                  productMatchesCategory(product, category),
                ).length;

                return (
                  <Card key={category.id} id={`edit-category-${category.id}`}>
                    <CardHeader className="gap-3">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                          <CardTitle>
                            {getLocalizedValue(locale, category.label)}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {locale === "bn"
                              ? `${categoryProductCount}টি প্রোডাক্ট মিলে এই ক্যাটাগরিতে পড়ছে।`
                              : `${categoryProductCount} products currently resolve into this category.`}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>{category.key}</span>
                          <span>•</span>
                          <span>
                            {locale === "bn"
                              ? `${categorySubcategories.length}টি সাবক্যাটাগরি`
                              : `${categorySubcategories.length} subcategories`}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <form
                        action={saveRoshalCategory}
                        className="grid min-w-0 gap-5 md:grid-cols-2"
                      >
                        <input type="hidden" name="id" value={category.id} />
                        <CategoryFields
                          locale={locale}
                          bucketOptions={bucketOptions}
                          defaults={{
                            key: category.key,
                            labelBn: category.label.bn,
                            labelEn: category.label.en,
                            descriptionBn: category.description.bn,
                            descriptionEn: category.description.en,
                            imageUrl: category.imageUrl,
                            sourceKeys: category.sourceKeys,
                            isEnabled: category.isEnabled,
                            showInNavigation: category.showInNavigation,
                            showOnHomepage: category.showOnHomepage,
                            sortOrder: String(category.sortOrder),
                          }}
                          submitLabel={
                            locale === "bn" ? "ক্যাটাগরি সেভ করুন" : "Save category"
                          }
                        />
                      </form>

                      <form
                        action={removeRoshalCategory}
                        id={`delete-category-${category.id}`}
                      >
                        <input type="hidden" name="id" value={category.id} />
                        <Button type="submit" variant="destructive">
                          {locale === "bn"
                            ? "ক্যাটাগরি ডিলিট করুন"
                            : "Delete category"}
                        </Button>
                      </form>

                      <div className="space-y-4 rounded-2xl border border-border/70 bg-muted/10 p-4">
                        <div className="space-y-1">
                          <h2 className="text-lg font-semibold">
                            {locale === "bn" ? "সাবক্যাটাগরি" : "Subcategories"}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {locale === "bn"
                              ? "ড্রপডাউন নেভিগেশন, ক্যাটাগরি ফিল্টার এবং আরও নির্দিষ্ট প্রোডাক্ট ম্যাচিংয়ের জন্য।"
                              : "Used by the navigation dropdown, deeper filters, and more specific product matching."}
                          </p>
                        </div>

                        <div className="space-y-4">
                          {categorySubcategories.map((subcategory) => (
                            <Card
                              key={subcategory.id}
                              id={`subcategory-${subcategory.id}`}
                              className="border-border/60"
                            >
                              <CardContent className="pt-6">
                                <form
                                  action={saveRoshalSubcategory}
                                  className="grid min-w-0 gap-5 md:grid-cols-2"
                                >
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={subcategory.id}
                                  />
                                  <SubcategoryFields
                                    locale={locale}
                                    bucketOptions={bucketOptions}
                                    categoryOptions={categoryOptions}
                                    productCount={
                                      products.filter((product) =>
                                        productMatchesSubcategory(
                                          product,
                                          subcategory,
                                        ),
                                      ).length
                                    }
                                    defaults={{
                                      categoryId: subcategory.categoryId,
                                      key: subcategory.key,
                                      labelBn: subcategory.label.bn,
                                      labelEn: subcategory.label.en,
                                      descriptionBn: subcategory.description.bn,
                                      descriptionEn: subcategory.description.en,
                                      imageUrl: subcategory.imageUrl,
                                      sourceKeys: subcategory.sourceKeys,
                                      isEnabled: subcategory.isEnabled,
                                      showInNavigation:
                                        subcategory.showInNavigation,
                                      sortOrder: String(subcategory.sortOrder),
                                    }}
                                    submitLabel={
                                      locale === "bn"
                                        ? "সাবক্যাটাগরি সেভ করুন"
                                        : "Save subcategory"
                                    }
                                  />
                                </form>
                                <form
                                  action={removeRoshalSubcategory}
                                  className="mt-4"
                                >
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={subcategory.id}
                                  />
                                  <Button type="submit" variant="destructive">
                                    {locale === "bn"
                                      ? "সাবক্যাটাগরি ডিলিট করুন"
                                      : "Delete subcategory"}
                                  </Button>
                                </form>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <Card
                          id={`add-subcategory-${category.id}`}
                          className="border-dashed border-border/70"
                        >
                          <CardHeader>
                            <CardTitle className="text-base">
                              {locale === "bn"
                                ? "নতুন সাবক্যাটাগরি যোগ করুন"
                                : "Add subcategory"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <form
                              action={saveRoshalSubcategory}
                              className="grid min-w-0 gap-5 md:grid-cols-2"
                            >
                              <SubcategoryFields
                                locale={locale}
                                bucketOptions={bucketOptions}
                                categoryOptions={categoryOptions}
                                productCount={0}
                                defaults={{
                                  categoryId: category.id,
                                  key: "",
                                  labelBn: "",
                                  labelEn: "",
                                  descriptionBn: "",
                                  descriptionEn: "",
                                  imageUrl: "",
                                  sourceKeys: category.sourceKeys,
                                  isEnabled: true,
                                  showInNavigation: true,
                                  sortOrder: String(
                                    categorySubcategories.length,
                                  ),
                                }}
                                submitLabel={
                                  locale === "bn"
                                    ? "সাবক্যাটাগরি তৈরি করুন"
                                    : "Create subcategory"
                                }
                              />
                            </form>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getCategoryIcon(key: string) {
  const normalizedKey = key.toLowerCase();

  if (normalizedKey.includes("fruit") || normalizedKey.includes("date")) {
    return "🍎";
  }
  if (normalizedKey.includes("vegetable") || normalizedKey.includes("fresh")) {
    return "🥬";
  }
  if (normalizedKey.includes("honey")) {
    return "🍯";
  }
  if (normalizedKey.includes("ghee") || normalizedKey.includes("dairy")) {
    return "🥛";
  }
  if (normalizedKey.includes("oil")) {
    return "🫒";
  }
  if (normalizedKey.includes("spice") || normalizedKey.includes("masala")) {
    return "🌶️";
  }
  if (normalizedKey.includes("rice") || normalizedKey.includes("flour")) {
    return "🌾";
  }
  if (normalizedKey.includes("nut") || normalizedKey.includes("seed")) {
    return "🥜";
  }

  return "🛒";
}

function CategoryFields({
  locale,
  bucketOptions,
  defaults,
  submitLabel,
}: {
  locale: "bn" | "en";
  bucketOptions: Array<{ value: string; label: string; description: string }>;
  defaults: {
    key: string;
    labelBn: string;
    labelEn: string;
    descriptionBn: string;
    descriptionEn: string;
    imageUrl: string;
    sourceKeys: string[];
    isEnabled: boolean;
    showInNavigation: boolean;
    showOnHomepage: boolean;
    sortOrder: string;
  };
  submitLabel: string;
}) {
  return (
    <>
      <Field name="key" label="Key" defaultValue={defaults.key} />
      <Field
        name="sortOrder"
        label="Sort Order"
        defaultValue={defaults.sortOrder}
        type="number"
      />
      <Field
        name="labelBn"
        label="Label (BN)"
        defaultValue={defaults.labelBn}
      />
      <Field
        name="labelEn"
        label="Label (EN)"
        defaultValue={defaults.labelEn}
      />
      <div className="md:col-span-2">
        <ImageUploadField
          name="imageUrl"
          label={locale === "bn" ? "ক্যাটাগরি ইমেজ" : "Category image"}
          helperText={
            locale === "bn"
              ? "হোমপেজ ক্যাটাগরি স্ট্রিপ এবং নেভিগেশন কনটেক্সটে ব্যবহৃত হবে।"
              : "Used by the homepage category strip and category navigation."
          }
          value={defaults.imageUrl}
        />
      </div>
      <div className="md:col-span-2">
        <TextField
          name="descriptionBn"
          label="Description (BN)"
          defaultValue={defaults.descriptionBn}
          rows={3}
        />
      </div>
      <div className="md:col-span-2">
        <TextField
          name="descriptionEn"
          label="Description (EN)"
          defaultValue={defaults.descriptionEn}
          rows={3}
        />
      </div>
      <div className="md:col-span-2">
        <DashboardFormCheckboxGroup
          name="sourceKeysJson"
          label={
            locale === "bn" ? "লিঙ্কড প্রোডাক্ট বালতি" : "Linked product buckets"
          }
          options={bucketOptions}
          defaultValue={defaults.sourceKeys}
          helperText={
            locale === "bn"
              ? "যে প্রোডাক্ট bucket key-গুলো এই ক্যাটাগরির অধীনে দেখানো হবে সেগুলো নির্বাচন করুন।"
              : "Choose which product bucket keys should resolve into this category."
          }
        />
      </div>
      <div className="md:col-span-2 flex flex-wrap gap-6">
        <DashboardFormCheckbox
          name="isEnabled"
          defaultChecked={defaults.isEnabled}
          label={locale === "bn" ? "ক্যাটাগরি চালু" : "Category enabled"}
        />
        <DashboardFormCheckbox
          name="showInNavigation"
          defaultChecked={defaults.showInNavigation}
          label={
            locale === "bn"
              ? "হেডার নেভিগেশনে দেখান"
              : "Show in header navigation"
          }
        />
        <DashboardFormCheckbox
          name="showOnHomepage"
          defaultChecked={defaults.showOnHomepage}
          label={locale === "bn" ? "হোমপেজে দেখান" : "Show on homepage"}
        />
      </div>
      <div className="md:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </>
  );
}

function SubcategoryFields({
  locale,
  bucketOptions,
  categoryOptions,
  productCount,
  defaults,
  submitLabel,
}: {
  locale: "bn" | "en";
  bucketOptions: Array<{ value: string; label: string; description: string }>;
  categoryOptions: Array<{ value: string; label: string }>;
  productCount: number;
  defaults: {
    categoryId: string;
    key: string;
    labelBn: string;
    labelEn: string;
    descriptionBn: string;
    descriptionEn: string;
    imageUrl: string;
    sourceKeys: string[];
    isEnabled: boolean;
    showInNavigation: boolean;
    sortOrder: string;
  };
  submitLabel: string;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label>Parent Category</Label>
        <DashboardFormSelect
          name="categoryId"
          defaultValue={defaults.categoryId}
          options={categoryOptions}
        />
      </div>
      <Field
        name="sortOrder"
        label="Sort Order"
        defaultValue={defaults.sortOrder}
        type="number"
      />
      <Field name="key" label="Key" defaultValue={defaults.key} />
      <div className="space-y-2">
        <Label>
          {locale === "bn" ? "লাইভ প্রোডাক্ট সংখ্যা" : "Matched products"}
        </Label>
        <div className="rounded-xl border border-border/70 bg-muted/15 px-4 py-3 text-sm text-muted-foreground">
          {locale === "bn"
            ? `${productCount}টি প্রোডাক্ট বর্তমানে এই সাবক্যাটাগরিতে মিলছে।`
            : `${productCount} products currently match this subcategory.`}
        </div>
      </div>
      <Field
        name="labelBn"
        label="Label (BN)"
        defaultValue={defaults.labelBn}
      />
      <Field
        name="labelEn"
        label="Label (EN)"
        defaultValue={defaults.labelEn}
      />
      <div className="md:col-span-2">
        <ImageUploadField
          name="imageUrl"
          label={locale === "bn" ? "সাবক্যাটাগরি ইমেজ" : "Subcategory image"}
          helperText={
            locale === "bn"
              ? "ড্রপডাউন বা ভবিষ্যৎ ক্যাটাগরি ল্যান্ডিং ব্লকে ব্যবহার করতে পারেন।"
              : "Useful for dropdown previews or future category landing blocks."
          }
          value={defaults.imageUrl}
        />
      </div>
      <div className="md:col-span-2">
        <TextField
          name="descriptionBn"
          label="Description (BN)"
          defaultValue={defaults.descriptionBn}
          rows={3}
        />
      </div>
      <div className="md:col-span-2">
        <TextField
          name="descriptionEn"
          label="Description (EN)"
          defaultValue={defaults.descriptionEn}
          rows={3}
        />
      </div>
      <div className="md:col-span-2">
        <DashboardFormCheckboxGroup
          name="sourceKeysJson"
          label={
            locale === "bn" ? "লিঙ্কড প্রোডাক্ট বালতি" : "Linked product buckets"
          }
          options={bucketOptions}
          defaultValue={defaults.sourceKeys}
          helperText={
            locale === "bn"
              ? "এই সাবক্যাটাগরির নিচে কোন product bucket key-গুলো দেখানো হবে তা বেছে নিন।"
              : "Choose which product bucket keys should resolve into this subcategory."
          }
        />
      </div>
      <div className="md:col-span-2 flex flex-wrap gap-6">
        <DashboardFormCheckbox
          name="isEnabled"
          defaultChecked={defaults.isEnabled}
          label={locale === "bn" ? "সাবক্যাটাগরি চালু" : "Subcategory enabled"}
        />
        <DashboardFormCheckbox
          name="showInNavigation"
          defaultChecked={defaults.showInNavigation}
          label={
            locale === "bn" ? "ড্রপডাউনে দেখান" : "Show in dropdown navigation"
          }
        />
      </div>
      <div className="md:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} type={type} />
    </div>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  rows,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} rows={rows} />
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
