import Link from "next/link";
import { notFound } from "next/navigation";
import { saveRoshalPage, saveRoshalSection } from "@/actions/roshal-admin";
import { DashboardFormCheckbox } from "@/components/roshal/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/roshal/dashboard/form-select";
import { ImageUploadField } from "@/components/roshal/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/roshal/auth";
import { getRoshalPages, getRoshalSectionsForPage } from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";

const pageStatusOptions = [
  { value: "published", label: "published" },
  { value: "draft", label: "draft" },
];

const sectionTypeOptions = [
  { value: "hero", label: "hero" },
  { value: "story", label: "story" },
  { value: "feature-grid", label: "feature-grid" },
  { value: "featured-products", label: "featured-products" },
  { value: "contact-cards", label: "contact-cards" },
];

const sectionLayoutOptions = [
  { value: "stacked", label: "stacked" },
  { value: "split", label: "split" },
  { value: "grid", label: "grid" },
  { value: "carousel", label: "carousel" },
];

const sectionVariantOptions = [
  { value: "default", label: "default" },
  { value: "muted", label: "muted" },
  { value: "accent", label: "accent" },
  { value: "soft", label: "soft" },
];

function storefrontPathFromSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export default async function DashboardPageEditorRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, locale] = await Promise.all([
    params,
    getRoshalLocale(),
    requireRoshalAdmin(),
  ]);
  const pages = await getRoshalPages();
  const page = pages.find((item) => item.id === id);

  if (!page) {
    notFound();
  }

  const sections = await getRoshalSectionsForPage(page.id);
  const storefrontPath = storefrontPathFromSlug(page.slug);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "পেজ এডিটর" : "Page editor"}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {locale === "bn" ? page.title.bn : page.title.en}
          </h1>
        </div>
        {page.status === "published" ? (
          <Button asChild variant="outline">
            <Link href={storefrontPath} target="_blank" rel="noreferrer">
              {locale === "bn" ? "লাইভ পেজ দেখুন" : "Open live page"}
            </Link>
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "পেজ সেটিংস" : "Page settings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveRoshalPage} className="grid gap-5 md:grid-cols-2">
            <input type="hidden" name="id" value={page.id} />
            <input type="hidden" name="previousSlug" value={page.slug} />
            <Field name="slug" label="Slug" defaultValue={page.slug} />
            <div className="space-y-2">
              <Label>Status</Label>
              <DashboardFormSelect
                name="status"
                defaultValue={page.status}
                options={pageStatusOptions}
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploadField
                name="heroImage"
                label={
                  locale === "bn" ? "হিরো বা কভার ইমেজ" : "Hero or cover image"
                }
                helperText={
                  locale === "bn"
                    ? "পেজে hero/story সেকশন না থাকলে এই ইমেজটি টপ কভার হিসেবে ব্যবহার হবে।"
                    : "This image becomes the top cover when the page has no hero/story section."
                }
                value={page.heroImage || ""}
              />
            </div>
            <Field
              name="navigationLabelBn"
              label="Navigation Label (BN)"
              defaultValue={page.navigationLabel.bn}
            />
            <Field
              name="navigationLabelEn"
              label="Navigation Label (EN)"
              defaultValue={page.navigationLabel.en}
            />
            <Field
              name="titleBn"
              label="Title (BN)"
              defaultValue={page.title.bn}
            />
            <Field
              name="titleEn"
              label="Title (EN)"
              defaultValue={page.title.en}
            />
            <div className="md:col-span-2">
              <TextField
                name="descriptionBn"
                label="Description (BN)"
                defaultValue={page.description.bn}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <TextField
                name="descriptionEn"
                label="Description (EN)"
                defaultValue={page.description.en}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <DashboardFormCheckbox
                name="showInNavigation"
                defaultChecked={page.showInNavigation}
                label={
                  locale === "bn"
                    ? "স্টোরফ্রন্ট নেভিগেশনে দেখান"
                    : "Show in storefront navigation"
                }
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">
                {locale === "bn" ? "পেজ সেভ করুন" : "Save page"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {locale === "bn" ? "সেকশনসমূহ" : "Sections"}
        </h2>
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>
                {section.sectionKey} · {section.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={saveRoshalSection}
                className="grid gap-5 md:grid-cols-2"
              >
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="pageId" value={page.id} />
                <input type="hidden" name="pageSlug" value={page.slug} />
                <input
                  type="hidden"
                  name="redirectTo"
                  value={`/dashboard/pages/${page.id}`}
                />
                <SectionFields
                  locale={locale}
                  defaults={{
                    sectionKey: section.sectionKey,
                    type: section.type,
                    sortOrder: String(section.sortOrder),
                    layout: section.layout,
                    variant: section.variant,
                    eyebrowBn: section.eyebrow.bn,
                    eyebrowEn: section.eyebrow.en,
                    titleBn: section.title.bn,
                    titleEn: section.title.en,
                    bodyBn: section.body.bn,
                    bodyEn: section.body.en,
                    ctaLabelBn: section.ctaLabel.bn,
                    ctaLabelEn: section.ctaLabel.en,
                    ctaHref: section.ctaHref,
                    imageUrl: section.imageUrl,
                    itemsJson: JSON.stringify(section.items, null, 2),
                    stylesJson: JSON.stringify(section.styles, null, 2),
                    isEnabled: section.isEnabled,
                  }}
                  submitLabel={
                    locale === "bn" ? "সেকশন সেভ করুন" : "Save section"
                  }
                />
              </form>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "নতুন সেকশন যোগ করুন" : "Add new section"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={saveRoshalSection}
              className="grid gap-5 md:grid-cols-2"
            >
              <input type="hidden" name="pageId" value={page.id} />
              <input type="hidden" name="pageSlug" value={page.slug} />
              <input
                type="hidden"
                name="redirectTo"
                value={`/dashboard/pages/${page.id}`}
              />
              <SectionFields
                locale={locale}
                defaults={{
                  sectionKey: "",
                  type: "story",
                  sortOrder: String(sections.length),
                  layout: "stacked",
                  variant: "default",
                  eyebrowBn: "",
                  eyebrowEn: "",
                  titleBn: "",
                  titleEn: "",
                  bodyBn: "",
                  bodyEn: "",
                  ctaLabelBn: "",
                  ctaLabelEn: "",
                  ctaHref: "",
                  imageUrl: "",
                  itemsJson: "[]",
                  stylesJson: "{}",
                  isEnabled: true,
                }}
                submitLabel={
                  locale === "bn" ? "সেকশন তৈরি করুন" : "Create section"
                }
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SectionFields({
  locale,
  defaults,
  submitLabel,
}: {
  locale: "bn" | "en";
  defaults: {
    sectionKey: string;
    type: string;
    sortOrder: string;
    layout: string;
    variant: string;
    eyebrowBn: string;
    eyebrowEn: string;
    titleBn: string;
    titleEn: string;
    bodyBn: string;
    bodyEn: string;
    ctaLabelBn: string;
    ctaLabelEn: string;
    ctaHref: string;
    imageUrl: string;
    itemsJson: string;
    stylesJson: string;
    isEnabled: boolean;
  };
  submitLabel: string;
}) {
  return (
    <>
      <Field
        name="sectionKey"
        label="Section Key"
        defaultValue={defaults.sectionKey}
      />
      <div className="space-y-2">
        <Label>Type</Label>
        <DashboardFormSelect
          name="type"
          defaultValue={defaults.type}
          options={sectionTypeOptions}
        />
      </div>
      <Field
        name="sortOrder"
        label="Sort Order"
        defaultValue={defaults.sortOrder}
        type="number"
      />
      <div className="space-y-2">
        <Label>Layout</Label>
        <DashboardFormSelect
          name="layout"
          defaultValue={defaults.layout}
          options={sectionLayoutOptions}
        />
      </div>
      <div className="space-y-2">
        <Label>Variant</Label>
        <DashboardFormSelect
          name="variant"
          defaultValue={defaults.variant}
          options={sectionVariantOptions}
        />
      </div>
      <div className="md:col-span-2">
        <ImageUploadField
          name="imageUrl"
          label={locale === "bn" ? "সেকশন ইমেজ" : "Section image"}
          helperText={
            locale === "bn"
              ? "hero, story বা ভিজ্যুয়াল কনটেন্ট সেকশনের জন্য ব্যবহার করুন।"
              : "Use this for hero, story, or other visual sections."
          }
          value={defaults.imageUrl}
        />
      </div>
      <Field
        name="eyebrowBn"
        label="Eyebrow (BN)"
        defaultValue={defaults.eyebrowBn}
      />
      <Field
        name="eyebrowEn"
        label="Eyebrow (EN)"
        defaultValue={defaults.eyebrowEn}
      />
      <Field
        name="titleBn"
        label="Title (BN)"
        defaultValue={defaults.titleBn}
      />
      <Field
        name="titleEn"
        label="Title (EN)"
        defaultValue={defaults.titleEn}
      />
      <div className="md:col-span-2">
        <TextField
          name="bodyBn"
          label="Body (BN)"
          defaultValue={defaults.bodyBn}
          rows={4}
        />
      </div>
      <div className="md:col-span-2">
        <TextField
          name="bodyEn"
          label="Body (EN)"
          defaultValue={defaults.bodyEn}
          rows={4}
        />
      </div>
      <Field
        name="ctaLabelBn"
        label="CTA Label (BN)"
        defaultValue={defaults.ctaLabelBn}
      />
      <Field
        name="ctaLabelEn"
        label="CTA Label (EN)"
        defaultValue={defaults.ctaLabelEn}
      />
      <Field name="ctaHref" label="CTA Href" defaultValue={defaults.ctaHref} />
      <div className="md:col-span-2">
        <TextField
          name="itemsJson"
          label="Items JSON"
          defaultValue={defaults.itemsJson}
          rows={6}
        />
      </div>
      <div className="md:col-span-2">
        <TextField
          name="stylesJson"
          label="Styles JSON"
          defaultValue={defaults.stylesJson}
          rows={4}
        />
      </div>
      <div className="md:col-span-2">
        <DashboardFormCheckbox
          name="isEnabled"
          defaultChecked={defaults.isEnabled}
          label={locale === "bn" ? "সেকশন চালু" : "Section enabled"}
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
