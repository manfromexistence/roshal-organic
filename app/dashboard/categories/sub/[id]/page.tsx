import { ArrowLeft, ImageIcon, Save, X } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  removeRoshalSubcategory,
  saveRoshalSubcategory,
} from "@/actions/admin";
import { DashboardFormStatusToast } from "@/components/dashboard/dashboard-form-status-toast";
import { DeleteConfirmationButton } from "@/components/dashboard/delete-confirmation-button";
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

export default async function EditSubcategoryPage({
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
    ? readDashboardFormDraft(await cookies(), "subcategory")
    : {};
  const [, taxonomy, products] = await Promise.all([
    requireRoshalAdmin(),
    getRoshalTaxonomy(),
    getAllRoshalProducts(),
  ]);
  const subcategory = taxonomy.subcategories.find((item) => item.id === id);
  const categoryOptions = taxonomy.categories.map((category) => ({
    value: category.id,
    label: getLocalizedValue("en", category.label),
  }));
  const selectedCategory = taxonomy.categories.find(
    (category) => category.id === subcategory?.categoryId,
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

  if (!subcategory) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 pt-6 pb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-3 w-fit">
          <Link href="/dashboard/categories">
            <ArrowLeft className="size-4" />
            Back to categories
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertDescription>Subcategory not found.</AlertDescription>
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
            Subcategory setup
          </p>
          <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
            Edit {getLocalizedValue("en", subcategory.label)}
          </h1>
        </div>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <form action={saveRoshalSubcategory}>
        <input type="hidden" name="id" value={subcategory.id} />
        <input type="hidden" name="redirectTo" value="/dashboard/categories" />
        <input
          type="hidden"
          name="errorRedirectTo"
          value={`/dashboard/categories/sub/${subcategory.id}`}
        />
        <Card className="border-none bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="size-5 text-primary" />
              Subcategory details
            </CardTitle>
            <CardDescription>
              Update parent category, labels, matching buckets, image, and
              dropdown visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid min-w-0 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Parent category</Label>
              <DashboardFormSelect
                name="categoryId"
                defaultValue={dashboardDraftValue(
                  draftValues,
                  "categoryId",
                  subcategory.categoryId,
                )}
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
                String(subcategory.sortOrder),
              )}
            />
            <Field
              name="key"
              label="Key"
              defaultValue={dashboardDraftValue(
                draftValues,
                "key",
                subcategory.key,
              )}
              hasError={hasDashboardFieldError(errorFields, "key")}
              required
            />
            <Field
              name="labelEn"
              label="Label (EN)"
              defaultValue={dashboardDraftValue(
                draftValues,
                "labelEn",
                subcategory.label.en,
              )}
              hasError={hasDashboardFieldError(errorFields, "labelEn")}
            />
            <Field
              name="labelBn"
              label="Label (BN)"
              defaultValue={dashboardDraftValue(
                draftValues,
                "labelBn",
                subcategory.label.bn,
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
                  subcategory.sourceKeys.length > 0
                    ? subcategory.sourceKeys
                    : selectedCategory?.sourceKeys || [],
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
                    value={dashboardDraftValue(
                      draftValues,
                      "imageUrl",
                      subcategory.imageUrl,
                    )}
                  />
                  <TextField
                    name="descriptionEn"
                    label="Description (EN)"
                    defaultValue={dashboardDraftValue(
                      draftValues,
                      "descriptionEn",
                      subcategory.description.en,
                    )}
                  />
                  <TextField
                    name="descriptionBn"
                    label="Description (BN)"
                    defaultValue={dashboardDraftValue(
                      draftValues,
                      "descriptionBn",
                      subcategory.description.bn,
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
                  subcategory.isEnabled,
                )}
                label="Subcategory enabled"
              />
              <DashboardFormCheckbox
                name="showInNavigation"
                defaultChecked={dashboardDraftBoolean(
                  draftValues,
                  "showInNavigation",
                  subcategory.showInNavigation,
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

      <DeleteConfirmationButton
        action={removeRoshalSubcategory}
        buttonLabel="Delete subcategory"
        description={`This permanently removes ${getLocalizedValue("en", subcategory.label)} from the dashboard and storefront filters.`}
        id={subcategory.id}
        redirectTo="/dashboard/categories"
        title="Delete subcategory?"
      />
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
