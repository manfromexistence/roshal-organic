import {
  ArrowLeft,
  DollarSign,
  ExternalLink,
  ImageIcon,
  ListFilter,
  Package,
  Save,
} from "lucide-react";
import Link from "next/link";
import { saveRoshalProduct } from "@/actions/admin";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardImageGalleryField } from "@/components/dashboard/image-gallery-field";
import { JsonFieldEditor } from "@/components/dashboard/json-field-editor";
import { ProductTaxonomySelect } from "@/components/dashboard/product-taxonomy-select";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getAllRoshalProducts } from "@/lib/store-content";
import {
  getRoshalProductRegularFeatures,
  getRoshalProductSizeOptions,
} from "@/lib/store-product-options";
import {
  productMatchesCategory,
  productMatchesSubcategory,
} from "@/lib/store-taxonomy";
import { getRoshalTaxonomy } from "@/lib/store-taxonomy-content";

export default async function ProductEditorRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    saved?: string;
    slug?: string;
    sku?: string;
  }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams
    ? await searchParams
    : await Promise.resolve<{
        error?: string;
        saved?: string;
        slug?: string;
        sku?: string;
      }>({});

  return (
    <ProductEditorPage
      productId={id}
      errorCode={resolvedSearchParams.error}
      saved={resolvedSearchParams.saved}
      errorSlug={resolvedSearchParams.slug}
      errorSku={resolvedSearchParams.sku}
    />
  );
}

export async function ProductEditorPage({
  productId,
  errorCode,
  saved,
  errorSlug,
  errorSku,
}: {
  productId: string | null;
  errorCode?: string;
  saved?: string;
  errorSlug?: string;
  errorSku?: string;
}) {
  const [, products, taxonomy] = await Promise.all([
    requireRoshalAdmin(),
    getAllRoshalProducts(),
    getRoshalTaxonomy(),
  ]);
  const product = productId
    ? products.find((item) => item.id === productId) || null
    : null;
  const errorMessage = getProductEditorErrorMessage(
    errorCode,
    errorSlug,
    errorSku,
  );
  const displayName = product?.name.en || product?.name.bn || "New product";
  const initialCategory =
    product &&
    taxonomy.categories.find((category) =>
      productMatchesCategory(product, category),
    );
  const initialSubcategory =
    product &&
    taxonomy.subcategories.find((subcategory) =>
      productMatchesSubcategory(product, subcategory),
    );
  const regularFeatures = product
    ? getRoshalProductRegularFeatures(product.features)
    : [];
  const sizeOptions = product
    ? getRoshalProductSizeOptions(product.features)
    : [];

  return (
    <div className="min-w-0 space-y-6 px-4 pt-4 pb-4 md:px-6 md:pt-6">
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-2">
          <Button asChild variant="ghost" size="sm" className="-ml-3">
            <Link href="/dashboard/products">
              <ArrowLeft className="size-4" />
              Back to products
            </Link>
          </Button>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Product editor
          </p>
          <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
            {displayName}
          </h1>
        </div>
        {product ? (
          <Button asChild variant="outline">
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="size-4" />
              Open product page
            </Link>
          </Button>
        ) : null}
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {saved ? (
        <Alert>
          <AlertDescription>Product saved successfully.</AlertDescription>
        </Alert>
      ) : null}

      <form action={saveRoshalProduct} className="min-w-0 space-y-6">
        <input type="hidden" name="id" value={product?.id || ""} />
        <input type="hidden" name="previousSlug" value={product?.slug || ""} />

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <Card className="border-none bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="size-5 text-primary" />
                  Product information
                </CardTitle>
                <CardDescription>
                  Core naming, URL, and SKU data used across the storefront.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid min-w-0 gap-5 md:grid-cols-2">
                <Field
                  name="nameBn"
                  label="Name (BN)"
                  defaultValue={product?.name.bn || ""}
                />
                <Field
                  name="nameEn"
                  label="Name (EN)"
                  defaultValue={product?.name.en || ""}
                />
                <Field
                  name="slug"
                  label="Slug"
                  defaultValue={product?.slug || ""}
                />
                <Field
                  name="sku"
                  label="SKU"
                  defaultValue={product?.sku || ""}
                />
              </CardContent>
            </Card>

            <Card className="border-none bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="size-5 text-primary" />
                  Product media
                </CardTitle>
                <CardDescription>
                  Upload the main product image and manage gallery image URLs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ImageUploadField
                  name="heroImage"
                  label="Primary product image"
                  helperText="Used in product cards, product details, checkout, and related product blocks."
                  value={product?.heroImage || ""}
                />
                {/* Gallery URL management moved into the optional details dropdown per client request. */}
              </CardContent>
            </Card>

            <Card className="border-none bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="size-5 text-primary" />
                  Optional product details
                </CardTitle>
                <CardDescription>
                  Open only when the product needs long descriptions, feature
                  bullets, or gallery URLs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="optional-details">
                    <AccordionTrigger>More product details</AccordionTrigger>
                    <AccordionContent
                      forceMount
                      className="grid min-w-0 gap-5 data-[state=closed]:hidden"
                    >
                      <TextField
                        name="summaryEn"
                        label="Summary (EN)"
                        defaultValue={product?.summary.en || ""}
                        rows={3}
                      />
                      <TextField
                        name="summaryBn"
                        label="Summary (BN)"
                        defaultValue={product?.summary.bn || ""}
                        rows={3}
                      />
                      <TextField
                        name="descriptionEn"
                        label="Description (EN)"
                        defaultValue={product?.description.en || ""}
                        rows={5}
                      />
                      <TextField
                        name="descriptionBn"
                        label="Description (BN)"
                        defaultValue={product?.description.bn || ""}
                        rows={5}
                      />
                      <DashboardImageGalleryField
                        name="galleryJson"
                        label="Gallery"
                        defaultValue={JSON.stringify(
                          product?.gallery || [],
                          null,
                          2,
                        )}
                        hint="Each entry should be an image URL."
                      />
                      <JsonFieldEditor
                        name="sizeOptionsJson"
                        label="Size options"
                        defaultValue={JSON.stringify(sizeOptions, null, 2)}
                        mode="array-string"
                        itemLabel="Size"
                        hint="Add product size or pack options such as 500g, 1kg, 5L."
                      />
                      <JsonFieldEditor
                        name="featuresEnJson"
                        label="Features (EN)"
                        defaultValue={JSON.stringify(
                          regularFeatures.map((item) => item.en),
                          null,
                          2,
                        )}
                        mode="array-string"
                        itemLabel="Feature"
                        hint="Each row becomes one English feature bullet."
                      />
                      <JsonFieldEditor
                        name="featuresBnJson"
                        label="Features (BN)"
                        defaultValue={JSON.stringify(
                          regularFeatures.map((item) => item.bn),
                          null,
                          2,
                        )}
                        mode="array-string"
                        itemLabel="Feature"
                        hint="Each row becomes one Bangla feature bullet."
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="min-w-0 space-y-6">
            <Card className="border-none bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <DollarSign className="size-5 text-primary" />
                  Pricing & inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="grid min-w-0 gap-5">
                <Field
                  name="price"
                  label="Price"
                  type="number"
                  defaultValue={String(product?.price ?? 0)}
                />
                <Field
                  name="compareAtPrice"
                  label="Compare-at price"
                  type="number"
                  defaultValue={String(product?.compareAtPrice ?? 0)}
                />
                <Field
                  name="inventory"
                  label="Inventory"
                  type="number"
                  defaultValue={String(product?.inventory ?? 0)}
                />
              </CardContent>
            </Card>

            <Card className="border-none bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ListFilter className="size-5 text-primary" />
                  Organization
                </CardTitle>
                <CardDescription>
                  Category and sorting metadata used by filters and homepage
                  rails.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid min-w-0 gap-5">
                <ProductTaxonomySelect
                  categories={taxonomy.categories}
                  subcategories={taxonomy.subcategories}
                  initialCategoryId={initialCategory?.id || ""}
                  initialSubcategoryId={initialSubcategory?.id || ""}
                />
                <Field
                  name="badge"
                  label="Badge"
                  defaultValue={product?.badge || ""}
                />
                <Field
                  name="sortOrder"
                  label="Sort order"
                  type="number"
                  defaultValue={String(product?.sortOrder ?? 0)}
                />
              </CardContent>
            </Card>

            <Card className="border-none bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Save className="size-5 text-primary" />
                  Publishing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <DashboardFormCheckbox
                  name="isFeatured"
                  defaultChecked={product?.isFeatured ?? false}
                  label="Featured"
                />
                <DashboardFormCheckbox
                  name="isPublished"
                  defaultChecked={product?.isPublished ?? true}
                  label="Published"
                />
                <Button type="submit" className="w-full">
                  <Save className="size-4" />
                  Save product
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/products">Back to catalog</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
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
    <div className="min-w-0 space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={type !== "number" || name !== "compareAtPrice"}
      />
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
    <div className="min-w-0 space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} rows={rows} />
    </div>
  );
}

function getProductEditorErrorMessage(
  code: string | undefined,
  slug: string | undefined,
  sku: string | undefined,
) {
  switch (code) {
    case "duplicate-product-slug":
      return `The slug \`${slug || ""}\` is already used by another product.`;
    case "duplicate-product-sku":
      return `The SKU \`${sku || ""}\` is already used by another product.`;
    case "invalid-product-slug":
      return "Use only lowercase letters, numbers, and hyphens in product slugs.";
    case "invalid-product-sku":
      return "Product SKU is required.";
    case "invalid-product-price":
      return "Product price cannot be negative.";
    case "invalid-product-inventory":
      return "Product inventory cannot be negative.";
    default:
      return null;
  }
}
