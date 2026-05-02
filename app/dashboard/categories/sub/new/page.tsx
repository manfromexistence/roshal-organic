import { ArrowLeft, ImageIcon, Save, X } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { saveRoshalSubcategory } from "@/actions/admin";
import { DashboardFormStatusToast } from "@/components/dashboard/dashboard-form-status-toast";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { DashboardSourceKeySelect } from "@/components/dashboard/source-key-select";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDashboardActionErrorMessage } from "@/lib/dashboard-action-errors";
import {
  getDashboardErrorFields,
  hasDashboardFieldError,
} from "@/lib/dashboard-field-errors";
import {
  dashboardDraftBoolean,
  dashboardDraftStringArray,
  dashboardDraftValue,
  readDashboardFormDraft,
} from "@/lib/dashboard-form-drafts";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getAllRoshalProducts } from "@/lib/store-content";
import { getLocalizedValue } from "@/lib/store-locale";
import { getRoshalTaxonomy } from "@/lib/store-taxonomy-content";

export default async function NewSubcategoryPage({
  searchParams,
}: {
  searchParams?: Promise<{
    categoryId?: string;
    error?: string;
    parent?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorMessage = getDashboardActionErrorMessage(
    resolvedSearchParams.error,
  );
  const errorFields = getDashboardErrorFields(resolvedSearchParams.error);
  const draftValues = resolvedSearchParams.error
    ? readDashboardFormDraft(await cookies(), "subcategory")
    : {};
  const [, taxonomy, products] = await Promise.all([
    requireRoshalAdmin(),
    getRoshalTaxonomy(),
    getAllRoshalProducts(),
  ]);
  const categoryOptions = taxonomy.categories.map((category) => ({
    value: category.id,
    label: getLocalizedValue("en", category.label),
  }));
  const defaultCategoryId =
    dashboardDraftValue(draftValues, "categoryId") ||
    resolvedSearchParams.categoryId ||
    taxonomy.categories.find(
      (category) => category.key === resolvedSearchParams.parent,
    )?.id ||
    taxonomy.categories[0]?.id ||
    "";
  const selectedCategory = taxonomy.categories.find(
    (category) => category.id === defaultCategoryId,
  );
  const bucketOptions = Array.from(
    products.reduce(
      (map, product) =>
        map.set(
          product.categoryKey,
          getLocalizedValue("en", product.categoryLabel),
        ),
      new Map<string, string>(),
    ),
  )
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([value, label]) => ({
      value,
      label,
      description: `Products tagged with the ${label} bucket will appear in this subcategory.`,
    }));
  const siblingCount = selectedCategory
    ? taxonomy.subcategories.filter(
        (subcategory) => subcategory.categoryId === selectedCategory.id,
      ).length
    : 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 pt-6 pb-4">
      <DashboardFormStatusToast errorMessage={errorMessage || undefined} />
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link href="/dashboard/categories">
            <ArrowLeft className="size-4" />
            Back to categories
          </Link>
        </Button>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Subcategory setup
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create new subcategory
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This creates a real nested menu item under a storefront category and
            can be used by product matching, filters, and category dropdowns.
          </p>
        </div>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {categoryOptions.length === 0 ? (
        <Alert>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            Create a parent category before adding a subcategory.
            <Button asChild size="sm">
              <Link href="/dashboard/categories/new">Create category</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <form action={saveRoshalSubcategory}>
          <input
            type="hidden"
            name="redirectTo"
            value="/dashboard/categories"
          />
          <input
            type="hidden"
            name="errorRedirectTo"
            value="/dashboard/categories/sub/new"
          />
          <Card className="border-none bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ImageIcon className="size-5 text-primary" />
                Subcategory details
              </CardTitle>
              <CardDescription>
                Assign this item to a parent category, then define labels,
                matching buckets, image, and navigation visibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid min-w-0 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Parent category</Label>
                <DashboardFormSelect
                  name="categoryId"
                  defaultValue={defaultCategoryId}
                  hasError={hasDashboardFieldError(errorFields, "categoryId")}
                  options={categoryOptions}
                />
              </div>
              <Field
                name="sortOrder"
                label="Sort order"
                type="number"
                defaultValue={dashboardDraftValue(
                  draftValues,
                  "sortOrder",
                  String(siblingCount),
                )}
              />
              <Field
                name="key"
                label="Key"
                placeholder="raw-honey"
                defaultValue={dashboardDraftValue(draftValues, "key")}
                hasError={hasDashboardFieldError(errorFields, "key")}
                required
              />
              <Field
                name="labelEn"
                label="Label (EN)"
                placeholder="Raw Honey"
                defaultValue={dashboardDraftValue(draftValues, "labelEn")}
                hasError={hasDashboardFieldError(errorFields, "labelEn")}
              />
              <Field
                name="labelBn"
                label="Label (BN)"
                placeholder="Raw Honey"
                defaultValue={dashboardDraftValue(draftValues, "labelBn")}
                hasError={hasDashboardFieldError(errorFields, "labelBn")}
              />
              <div className="md:col-span-2">
                <DashboardSourceKeySelect
                  name="sourceKeysJson"
                  label="Existing product bucket"
                  options={bucketOptions}
                  defaultValue={dashboardDraftStringArray(
                    draftValues,
                    "sourceKeysJson",
                    selectedCategory?.sourceKeys || [],
                  )}
                  helperText="Select the existing product group that should appear in this subcategory."
                />
              </div>
              <Accordion type="single" collapsible className="md:col-span-2">
                <AccordionItem value="optional-subcategory-details">
                  <AccordionTrigger>
                    Optional image and description
                  </AccordionTrigger>
                  <AccordionContent
                    forceMount
                    className="grid gap-5 data-[state=closed]:hidden"
                  >
                    <ImageUploadField
                      name="imageUrl"
                      label="Subcategory image"
                      helperText="Used in dropdown previews and future category landing sections."
                      value={dashboardDraftValue(draftValues, "imageUrl")}
                    />
                    <TextField
                      name="descriptionEn"
                      label="Description (EN)"
                      defaultValue={dashboardDraftValue(
                        draftValues,
                        "descriptionEn",
                      )}
                      placeholder="Describe what products belong in this subcategory."
                    />
                    <TextField
                      name="descriptionBn"
                      label="Description (BN)"
                      defaultValue={dashboardDraftValue(
                        draftValues,
                        "descriptionBn",
                      )}
                      placeholder="এই সাবক্যাটাগরির পণ্য সম্পর্কে লিখুন।"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex flex-wrap gap-6 md:col-span-2">
                <DashboardFormCheckbox
                  name="isEnabled"
                  defaultChecked={dashboardDraftBoolean(
                    draftValues,
                    "isEnabled",
                    true,
                  )}
                  label="Subcategory enabled"
                />
                <DashboardFormCheckbox
                  name="showInNavigation"
                  defaultChecked={dashboardDraftBoolean(
                    draftValues,
                    "showInNavigation",
                    true,
                  )}
                  label="Show in dropdown navigation"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col-reverse gap-3 border-t p-6 sm:flex-row sm:justify-between">
              <Button asChild variant="outline">
                <Link href="/dashboard/categories">
                  <X className="size-4" />
                  Cancel
                </Link>
              </Button>
              <Button type="submit">
                <Save className="size-4" />
                Save subcategory
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}

function Field({
  defaultValue = "",
  hasError = false,
  label,
  name,
  placeholder,
  required = false,
  type = "text",
}: {
  defaultValue?: string;
  hasError?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        aria-invalid={hasError || undefined}
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function TextField({
  defaultValue = "",
  label,
  name,
  placeholder,
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
      />
    </div>
  );
}
