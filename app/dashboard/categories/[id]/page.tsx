import { ArrowLeft, ImageIcon, Save, Trash2, X } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { removeRoshalCategory, saveRoshalCategory } from "@/actions/admin";
import { DashboardFormStatusToast } from "@/components/dashboard/dashboard-form-status-toast";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
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

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorMessage = getDashboardActionErrorMessage(
    resolvedSearchParams.error,
  );
  const errorFields = getDashboardErrorFields(resolvedSearchParams.error);
  const draftValues = resolvedSearchParams.error
    ? readDashboardFormDraft(await cookies(), "category")
    : {};
  const [, taxonomy, products] = await Promise.all([
    requireRoshalAdmin(),
    getRoshalTaxonomy(),
    getAllRoshalProducts(),
  ]);
  const category = taxonomy.categories.find((item) => item.id === id);
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
      description: `Products tagged with the ${label} bucket will appear in this category.`,
    }));

  if (!category) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 pt-6 pb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-3 w-fit">
          <Link href="/dashboard/categories">
            <ArrowLeft className="size-4" />
            Back to categories
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertDescription>Category not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

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
            Category setup
          </p>
          <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
            Edit {getLocalizedValue("en", category.label)}
          </h1>
        </div>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <form action={saveRoshalCategory}>
        <input type="hidden" name="id" value={category.id} />
        <input type="hidden" name="redirectTo" value="/dashboard/categories" />
        <input
          type="hidden"
          name="errorRedirectTo"
          value={`/dashboard/categories/${category.id}`}
        />
        <Card className="border-none bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="size-5 text-primary" />
              Category details
            </CardTitle>
            <CardDescription>
              Update labels, matching product buckets, image, and visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid min-w-0 gap-5 md:grid-cols-2">
            <Field
              name="key"
              label="Key"
              defaultValue={dashboardDraftValue(
                draftValues,
                "key",
                category.key,
              )}
              hasError={hasDashboardFieldError(errorFields, "key")}
              required
            />
            <Field
              name="sortOrder"
              label="Sort order"
              type="number"
              defaultValue={dashboardDraftValue(
                draftValues,
                "sortOrder",
                String(category.sortOrder),
              )}
            />
            <Field
              name="labelEn"
              label="Label (EN)"
              defaultValue={dashboardDraftValue(
                draftValues,
                "labelEn",
                category.label.en,
              )}
              hasError={hasDashboardFieldError(errorFields, "labelEn")}
            />
            <Field
              name="labelBn"
              label="Label (BN)"
              defaultValue={dashboardDraftValue(
                draftValues,
                "labelBn",
                category.label.bn,
              )}
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
                  category.sourceKeys,
                )}
                helperText="Select the existing product group that should appear in this storefront category."
              />
            </div>
            <Accordion type="single" collapsible className="md:col-span-2">
              <AccordionItem value="optional-category-details">
                <AccordionTrigger>
                  Optional image and description
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="grid gap-5 data-[state=closed]:hidden"
                >
                  <ImageUploadField
                    name="imageUrl"
                    label="Category image"
                    helperText="Used by homepage category cards and future category landing surfaces."
                    value={dashboardDraftValue(
                      draftValues,
                      "imageUrl",
                      category.imageUrl,
                    )}
                  />
                  <TextField
                    name="descriptionEn"
                    label="Description (EN)"
                    defaultValue={dashboardDraftValue(
                      draftValues,
                      "descriptionEn",
                      category.description.en,
                    )}
                  />
                  <TextField
                    name="descriptionBn"
                    label="Description (BN)"
                    defaultValue={dashboardDraftValue(
                      draftValues,
                      "descriptionBn",
                      category.description.bn,
                    )}
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
                  category.isEnabled,
                )}
                label="Category enabled"
              />
              <DashboardFormCheckbox
                name="showInNavigation"
                defaultChecked={dashboardDraftBoolean(
                  draftValues,
                  "showInNavigation",
                  category.showInNavigation,
                )}
                label="Show in header navigation"
              />
              <DashboardFormCheckbox
                name="showOnHomepage"
                defaultChecked={dashboardDraftBoolean(
                  draftValues,
                  "showOnHomepage",
                  category.showOnHomepage,
                )}
                label="Show on homepage"
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
              Save category
            </Button>
          </CardFooter>
        </Card>
      </form>

      <form action={removeRoshalCategory}>
        <input type="hidden" name="id" value={category.id} />
        <Button type="submit" variant="destructive" className="w-fit">
          <Trash2 className="size-4" />
          Delete category
        </Button>
      </form>
    </div>
  );
}

function Field({
  defaultValue = "",
  hasError = false,
  label,
  name,
  required = false,
  type = "text",
}: {
  defaultValue?: string;
  hasError?: boolean;
  label: string;
  name: string;
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
        required={required}
      />
    </div>
  );
}

function TextField({
  defaultValue,
  label,
  name,
}: {
  defaultValue: string;
  label: string;
  name: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} rows={3} />
    </div>
  );
}
