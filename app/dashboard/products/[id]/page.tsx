import Link from "next/link";
import { saveRoshalProduct } from "@/actions/roshal-admin";
import { DashboardFormCheckbox } from "@/components/roshal/dashboard/form-checkbox";
import { ImageUploadField } from "@/components/roshal/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/roshal/auth";
import { getAllRoshalProducts } from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";

export default async function ProductEditorRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductEditorPage productId={id} />;
}

export async function ProductEditorPage({
  productId,
}: {
  productId: string | null;
}) {
  const [locale, products] = await Promise.all([
    getRoshalLocale(),
    getAllRoshalProducts(),
    requireRoshalAdmin(),
  ]);
  const product = productId
    ? products.find((item) => item.id === productId) || null
    : null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "পণ্য এডিটর" : "Product editor"}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {product
              ? locale === "bn"
                ? product.name.bn
                : product.name.en
              : locale === "bn"
                ? "নতুন পণ্য"
                : "New product"}
          </h1>
        </div>
        {product ? (
          <Button asChild variant="outline">
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              {locale === "bn" ? "লাইভ পণ্য দেখুন" : "Open product page"}
            </Link>
          </Button>
        ) : null}
      </div>

      <form action={saveRoshalProduct} className="space-y-6">
        <input type="hidden" name="id" value={product?.id || ""} />
        <input type="hidden" name="previousSlug" value={product?.slug || ""} />
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "বেসিক তথ্য" : "Basic details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
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
            <Field name="sku" label="SKU" defaultValue={product?.sku || ""} />
            <Field
              name="categoryLabelBn"
              label="Category (BN)"
              defaultValue={product?.categoryLabel.bn || ""}
            />
            <Field
              name="categoryLabelEn"
              label="Category (EN)"
              defaultValue={product?.categoryLabel.en || ""}
            />
            <Field
              name="categoryKey"
              label="Category Key"
              defaultValue={product?.categoryKey || ""}
            />
            <Field
              name="badge"
              label="Badge"
              defaultValue={product?.badge || ""}
            />
            <Field
              name="sortOrder"
              label="Sort Order"
              type="number"
              defaultValue={String(product?.sortOrder ?? 0)}
            />
            <div className="md:col-span-2">
              <ImageUploadField
                name="heroImage"
                label={
                  locale === "bn" ? "প্রধান পণ্যের ইমেজ" : "Primary product image"
                }
                helperText={
                  locale === "bn"
                    ? "এই ইমেজটি প্রোডাক্ট কার্ড, প্রোডাক্ট ডিটেইলস এবং চেকআউট-সংশ্লিষ্ট ভিউতে ব্যবহৃত হবে।"
                    : "This image is used in product cards, product details, and related checkout views."
                }
                value={product?.heroImage || ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "মূল্য ও স্টক" : "Pricing and stock"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-3">
            <Field
              name="price"
              label="Price"
              type="number"
              defaultValue={String(product?.price ?? 0)}
            />
            <Field
              name="compareAtPrice"
              label="Compare-at Price"
              type="number"
              defaultValue={String(product?.compareAtPrice ?? 0)}
            />
            <Field
              name="inventory"
              label="Inventory"
              type="number"
              defaultValue={String(product?.inventory ?? 0)}
            />
            <div className="md:col-span-3 flex flex-wrap gap-6">
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{locale === "bn" ? "কনটেন্ট" : "Content"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <TextField
              name="summaryBn"
              label="Summary (BN)"
              defaultValue={product?.summary.bn || ""}
              rows={3}
            />
            <TextField
              name="summaryEn"
              label="Summary (EN)"
              defaultValue={product?.summary.en || ""}
              rows={3}
            />
            <TextField
              name="descriptionBn"
              label="Description (BN)"
              defaultValue={product?.description.bn || ""}
              rows={5}
            />
            <TextField
              name="descriptionEn"
              label="Description (EN)"
              defaultValue={product?.description.en || ""}
              rows={5}
            />
            <TextField
              name="galleryJson"
              label="Gallery JSON"
              defaultValue={JSON.stringify(product?.gallery || [], null, 2)}
              rows={4}
            />
            <TextField
              name="featuresBnJson"
              label="Features BN JSON"
              defaultValue={JSON.stringify(
                product?.features.map((item) => item.bn) || [],
                null,
                2,
              )}
              rows={4}
            />
            <TextField
              name="featuresEnJson"
              label="Features EN JSON"
              defaultValue={JSON.stringify(
                product?.features.map((item) => item.en) || [],
                null,
                2,
              )}
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">
            {locale === "bn" ? "সংরক্ষণ" : "Save product"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/products">
              {locale === "bn" ? "ক্যাটালগে ফিরুন" : "Back to catalog"}
            </Link>
          </Button>
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
    <div className="space-y-2">
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
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} rows={rows} />
    </div>
  );
}
