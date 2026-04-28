import { saveRoshalCategory, saveRoshalSubcategory } from "@/actions/admin";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormCheckboxGroup } from "@/components/dashboard/form-checkbox-group";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "ক্যাটাগরি ও সাবক্যাটাগরি" : "Categories & subcategories"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "স্টোরফ্রন্ট ট্যাক্সোনমি" : "Storefront taxonomy"}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {locale === "bn"
            ? "হেডার নেভিগেশন, হোমপেজ ক্যাটাগরি, প্রোডাক্ট ফিল্টার এবং সাবক্যাটাগরি ড্রপডাউন এখন এই এক জায়গা থেকে নিয়ন্ত্রণ করুন।"
            : "Manage the header navigation, homepage categories, product filters, and subcategory dropdowns from one workspace."}
        </p>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={locale === "bn" ? "মোট ক্যাটাগরি" : "Categories"}
          value={String(taxonomy.categories.length)}
          hint={
            locale === "bn"
              ? "মেনু ও ফিল্টারে ব্যবহৃত টপ-লেভেল গ্রুপ"
              : "Top-level groups used by navigation and filters"
          }
        />
        <MetricCard
          label={locale === "bn" ? "মোট সাবক্যাটাগরি" : "Subcategories"}
          value={String(taxonomy.subcategories.length)}
          hint={
            locale === "bn"
              ? "প্রতিটি ক্যাটাগরির নিচে দেখানো নেস্টেড অপশন"
              : "Nested options shown under each category"
          }
        />
        <MetricCard
          label={locale === "bn" ? "নেভিগেশনে দৃশ্যমান" : "Visible in nav"}
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
        <MetricCard
          label={locale === "bn" ? "হোমপেজে দৃশ্যমান" : "Visible on home"}
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

      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "নতুন ক্যাটাগরি তৈরি করুন" : "Create category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={saveRoshalCategory}
            className="grid gap-5 md:grid-cols-2"
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

      <div className="space-y-6">
        {taxonomy.categories.map((category) => {
          const categorySubcategories = taxonomy.subcategories.filter(
            (subcategory) => subcategory.categoryId === category.id,
          );
          const categoryProductCount = products.filter((product) =>
            productMatchesCategory(product, category),
          ).length;

          return (
            <Card key={category.id}>
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
                  className="grid gap-5 md:grid-cols-2"
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
                      <Card key={subcategory.id} className="border-border/60">
                        <CardContent className="pt-6">
                          <form
                            action={saveRoshalSubcategory}
                            className="grid gap-5 md:grid-cols-2"
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
                                showInNavigation: subcategory.showInNavigation,
                                sortOrder: String(subcategory.sortOrder),
                              }}
                              submitLabel={
                                locale === "bn"
                                  ? "সাবক্যাটাগরি সেভ করুন"
                                  : "Save subcategory"
                              }
                            />
                          </form>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="border-dashed border-border/70">
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
                        className="grid gap-5 md:grid-cols-2"
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
                            sortOrder: String(categorySubcategories.length),
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
    </div>
  );
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

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-2 p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
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
