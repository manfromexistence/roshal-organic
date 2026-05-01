import { ArrowLeft, ImageIcon, Save, X } from "lucide-react";
import Link from "next/link";
import { saveRoshalCategory } from "@/actions/admin";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardSourceKeySelect } from "@/components/dashboard/source-key-select";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

export default async function NewCategoryPage() {
  const [, products] = await Promise.all([
    requireRoshalAdmin(),
    getAllRoshalProducts(),
  ]);
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
            Category setup
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create new category
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This creates a real storefront category used by the header
            navigation, homepage category strip, product filters, and dashboard
            taxonomy controls.
          </p>
        </div>
      </div>

      <form action={saveRoshalCategory}>
        <input type="hidden" name="redirectTo" value="/dashboard/categories" />
        <Card className="border-none bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="size-5 text-primary" />
              Category details
            </CardTitle>
            <CardDescription>
              Define labels, matching product buckets, image, and visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid min-w-0 gap-5 md:grid-cols-2">
            <Field name="key" label="Key" placeholder="organic-certified" />
            <Field
              name="sortOrder"
              label="Sort order"
              type="number"
              defaultValue="0"
            />
            <Field
              name="labelEn"
              label="Label (EN)"
              placeholder="Organic Certified"
            />
            <Field
              name="labelBn"
              label="Label (BN)"
              placeholder="অর্গানিক সার্টিফায়েড"
            />
            <div className="md:col-span-2">
              <DashboardSourceKeySelect
                name="sourceKeysJson"
                label="Existing product bucket"
                options={bucketOptions}
                defaultValue={[]}
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
                    value=""
                  />
                  <TextField
                    name="descriptionEn"
                    label="Description (EN)"
                    placeholder="Describe what products belong in this category."
                  />
                  <TextField
                    name="descriptionBn"
                    label="Description (BN)"
                    placeholder="এই ক্যাটাগরির পণ্য সম্পর্কে লিখুন।"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-wrap gap-6 md:col-span-2">
              <DashboardFormCheckbox
                name="isEnabled"
                defaultChecked
                label="Category enabled"
              />
              <DashboardFormCheckbox
                name="showInNavigation"
                defaultChecked
                label="Show in header navigation"
              />
              <DashboardFormCheckbox
                name="showOnHomepage"
                defaultChecked
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
    </div>
  );
}

function Field({
  defaultValue = "",
  label,
  name,
  placeholder,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}

function TextField({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} placeholder={placeholder} rows={3} />
    </div>
  );
}
