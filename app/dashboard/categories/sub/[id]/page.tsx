import { ArrowLeft, ImageIcon, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import {
  removeRoshalSubcategory,
  saveRoshalSubcategory,
} from "@/actions/admin";
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
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getAllRoshalProducts } from "@/lib/store-content";
import { getLocalizedValue } from "@/lib/store-locale";
import { getRoshalTaxonomy } from "@/lib/store-taxonomy-content";

export default async function EditSubcategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

      <form action={saveRoshalSubcategory}>
        <input type="hidden" name="id" value={subcategory.id} />
        <input type="hidden" name="redirectTo" value="/dashboard/categories" />
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
                defaultValue={subcategory.categoryId}
                options={categoryOptions}
              />
            </div>
            <Field
              name="sortOrder"
              label="Sort order"
              type="number"
              defaultValue={String(subcategory.sortOrder)}
            />
            <Field name="key" label="Key" defaultValue={subcategory.key} />
            <Field
              name="labelEn"
              label="Label (EN)"
              defaultValue={subcategory.label.en}
            />
            <Field
              name="labelBn"
              label="Label (BN)"
              defaultValue={subcategory.label.bn}
            />
            <div className="md:col-span-2">
              <DashboardSourceKeySelect
                name="sourceKeysJson"
                label="Existing product bucket"
                options={bucketOptions}
                defaultValue={
                  subcategory.sourceKeys.length > 0
                    ? subcategory.sourceKeys
                    : selectedCategory?.sourceKeys || []
                }
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
                    value={subcategory.imageUrl}
                  />
                  <TextField
                    name="descriptionEn"
                    label="Description (EN)"
                    defaultValue={subcategory.description.en}
                  />
                  <TextField
                    name="descriptionBn"
                    label="Description (BN)"
                    defaultValue={subcategory.description.bn}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-wrap gap-6 md:col-span-2">
              <DashboardFormCheckbox
                name="isEnabled"
                defaultChecked={subcategory.isEnabled}
                label="Subcategory enabled"
              />
              <DashboardFormCheckbox
                name="showInNavigation"
                defaultChecked={subcategory.showInNavigation}
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

      <form action={removeRoshalSubcategory}>
        <input type="hidden" name="id" value={subcategory.id} />
        <Button type="submit" variant="destructive" className="w-fit">
          <Trash2 className="size-4" />
          Delete subcategory
        </Button>
      </form>
    </div>
  );
}

function Field({
  defaultValue = "",
  label,
  name,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} />
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
