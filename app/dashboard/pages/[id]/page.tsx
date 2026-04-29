import Link from "next/link";
import { notFound } from "next/navigation";
import { saveRoshalPage, saveRoshalSection } from "@/actions/admin";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { JsonFieldEditor } from "@/components/dashboard/json-field-editor";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getRoshalHomeSectionGuide,
  getRoshalMarketingPageGuide,
  roshalHomeSectionGuides,
} from "@/lib/cms-guides";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalPages, getRoshalSectionsForPage } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    slug?: string;
    sectionKey?: string;
  }>;
}) {
  const [{ id }, locale, resolvedSearchParams] = await Promise.all([
    params,
    getRoshalLocale(),
    searchParams
      ? searchParams
      : Promise.resolve<{
          error?: string;
          slug?: string;
          sectionKey?: string;
        }>({}),
    requireRoshalAdmin(),
  ]);
  const pages = await getRoshalPages();
  const page = pages.find((item) => item.id === id);

  if (!page) {
    notFound();
  }

  const sections = await getRoshalSectionsForPage(page.id);
  const storefrontPath = storefrontPathFromSlug(page.slug);
  const pageGuide = getRoshalMarketingPageGuide(page.slug);
  const errorMessage = getPageEditorErrorMessage(
    locale,
    resolvedSearchParams.error,
    resolvedSearchParams.slug,
    resolvedSearchParams.sectionKey,
  );

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

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

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
                    ? "hero/story সেকশন নিজের image দিলে সেটি আগে দেখানো হবে। না হলে এই page-level image fallback cover হিসেবে কাজ করবে।"
                    : "Hero or story sections can override this with their own image. Otherwise, this page-level image is used as the fallback cover."
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

      {page.slug === "home" ? (
        <Card>
          <CardHeader>
            <CardTitle>Homepage section map</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {roshalHomeSectionGuides.map((guide) => (
              <div
                key={guide.sectionKey}
                className="rounded-xl border border-border/70 bg-muted/20 p-4"
              >
                <p className="font-medium">
                  {locale === "bn" ? guide.label.bn : guide.label.en}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {guide.sectionKey}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {locale === "bn" ? guide.summary.bn : guide.summary.en}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {locale === "bn" ? guide.stylesHint.bn : guide.stylesHint.en}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {page.slug !== "home" && pageGuide ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {getLocalizedGuideText(locale, pageGuide.label)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">
              {getLocalizedGuideText(locale, pageGuide.summary)}
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {pageGuide.editingTips.map((tip, index) => (
                <div
                  key={`${pageGuide.slug}-tip-${index}`}
                  className="rounded-md border border-border/70 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground"
                >
                  {getLocalizedGuideText(locale, tip)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {locale === "bn" ? "সেকশনসমূহ" : "Sections"}
        </h2>
        {sections.map((section) => (
          <Card key={section.id} id={`section-${section.sectionKey}`}>
            <CardHeader>
              <CardTitle>
                {section.sectionKey} · {section.type}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {page.slug === "home" &&
              getRoshalHomeSectionGuide(section.sectionKey) ? (
                <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {locale === "bn"
                      ? getRoshalHomeSectionGuide(section.sectionKey)?.label.bn
                      : getRoshalHomeSectionGuide(section.sectionKey)?.label.en}
                  </p>
                  <p className="mt-2">
                    {locale === "bn"
                      ? getRoshalHomeSectionGuide(section.sectionKey)
                          ?.contentHint.bn
                      : getRoshalHomeSectionGuide(section.sectionKey)
                          ?.contentHint.en}
                  </p>
                  <p className="mt-2">
                    {locale === "bn"
                      ? getRoshalHomeSectionGuide(section.sectionKey)
                          ?.stylesHint.bn
                      : getRoshalHomeSectionGuide(section.sectionKey)
                          ?.stylesHint.en}
                  </p>
                </div>
              ) : null}
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
              ? "hero/story সেকশনে image থাকলে এটি page cover-কে override করবে। অন্যান্য ভিজ্যুয়াল সেকশনের জন্যও এটি ব্যবহার করুন।"
              : "For hero or story sections, this image overrides the page cover. Use it for other visual sections as well."
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
        <JsonFieldEditor
          name="itemsJson"
          label="Items"
          defaultValue={defaults.itemsJson}
          mode="array-object"
          itemLabel="Content item"
          hint="Each item is a set of key-value fields (e.g. title, body, imageUrl, href)."
        />
      </div>
      <div className="md:col-span-2">
        <JsonFieldEditor
          name="stylesJson"
          label="Styles"
          defaultValue={defaults.stylesJson}
          mode="object"
          hint="Style keys like columns, highlight, density, source, limit, offset."
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

function getLocalizedGuideText(
  locale: "bn" | "en",
  value: { bn: string; en: string },
) {
  return locale === "bn" ? value.bn : value.en;
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

function getPageEditorErrorMessage(
  locale: "bn" | "en",
  code: string | undefined,
  slug: string | undefined,
  sectionKey: string | undefined,
) {
  switch (code) {
    case "reserved-slug":
      return locale === "bn"
        ? `\`${slug || ""}\` স্লাগটি সিস্টেম রুটের সঙ্গে সংঘর্ষ করছে। অন্য একটি স্লাগ ব্যবহার করুন।`
        : `The slug \`${slug || ""}\` conflicts with a system route. Choose a different slug.`;
    case "duplicate-slug":
      return locale === "bn"
        ? `\`${slug || ""}\` স্লাগটি ইতিমধ্যেই অন্য একটি মার্কেটিং পেজে ব্যবহৃত হচ্ছে।`
        : `The slug \`${slug || ""}\` is already used by another marketing page.`;
    case "invalid-slug":
      return locale === "bn"
        ? "পেজ স্লাগে শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন ব্যবহার করুন।"
        : "Use only lowercase letters, numbers, and hyphens in page slugs.";
    case "duplicate-section-key":
      return locale === "bn"
        ? `\`${sectionKey || ""}\` সেকশন কীটি এই পেজে ইতিমধ্যেই আছে। নতুন একটি ইউনিক কী দিন।`
        : `The section key \`${sectionKey || ""}\` already exists on this page. Use a unique key.`;
    case "invalid-section-key":
      return locale === "bn"
        ? "সেকশন কীতে শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন ব্যবহার করুন।"
        : "Use only lowercase letters, numbers, and hyphens in section keys.";
    default:
      return null;
  }
}
