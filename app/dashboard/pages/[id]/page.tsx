import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  removeRoshalPage,
  saveRoshalPage,
  saveRoshalSection,
} from "@/actions/admin";
import { CmsSaveToast } from "@/components/dashboard/cms-save-toast";
import { DeleteConfirmationButton } from "@/components/dashboard/delete-confirmation-button";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import {
  MarketingSectionItemsField,
  MarketingSectionStylesField,
} from "@/components/dashboard/marketing-section-data-fields";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalPages, getRoshalSectionsForPage } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import type { RoshalMarketingSection } from "@/lib/store-types";

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

const homeSectionPresetImages: Record<string, string> = {
  hero: "/special-offer.jpg",
  "landing-categories": "/ghee.jpg",
  "landing-top-sellers": "/deal-3.jpg",
  "landing-new-arrivals": "/fruits.jpg",
  "landing-brands": "/logo.png",
  "landing-special-offers": "/deal-3.jpg",
  "landing-fresh-picks": "/organic-vegetables.jpg",
  "landing-organic-picks": "/oil-2.jpg",
  "landing-seasonal-picks": "/mango-2.jpg",
  "landing-stats": "/healthy-food.jpg",
  "landing-testimonials": "/brand-story.jpg",
};

function getSectionEditorPreviewImage(
  section: RoshalMarketingSection,
  pageHeroImage: string,
) {
  return (
    section.imageUrl ||
    section.items.find((item) => item.imageUrl)?.imageUrl ||
    (section.sectionKey === "hero" ? pageHeroImage : "") ||
    homeSectionPresetImages[section.sectionKey] ||
    ""
  );
}

export default async function DashboardPageEditorRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    saved?: string;
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
          saved?: string;
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
  const errorMessage = getPageEditorErrorMessage(
    locale,
    resolvedSearchParams.error,
    resolvedSearchParams.slug,
    resolvedSearchParams.sectionKey,
  );

  return (
    <div className="min-w-0 space-y-6 px-6 pt-6 pb-4">
      <CmsSaveToast status={resolvedSearchParams.saved} />
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "পেজ এডিটর" : "Page editor"}
          </p>
          <h1 className="break-words text-4xl font-semibold tracking-tight">
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
          <form
            action={saveRoshalPage}
            className="grid min-w-0 gap-5 md:grid-cols-2"
          >
            <input type="hidden" name="id" value={page.id} />
            <input type="hidden" name="previousSlug" value={page.slug} />
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
            <Accordion type="multiple" className="space-y-3 md:col-span-2">
              <AccordionItem
                value="page-advanced"
                className="rounded-lg border border-border/70 px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="min-w-0 text-left">
                    <span className="block font-semibold">
                      {locale === "bn"
                        ? "অ্যাডভান্সড পেজ সেটিংস"
                        : "Advanced page settings"}
                    </span>
                    <span className="block text-sm font-normal text-muted-foreground">
                      Slug, status, cover image, description, and navigation
                      visibility.
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent forceMount>
                  <div className="grid min-w-0 gap-5 pt-1 md:grid-cols-2">
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
                          locale === "bn"
                            ? "হিরো বা কভার ইমেজ"
                            : "Hero or cover image"
                        }
                        helperText={
                          locale === "bn"
                            ? "hero/story সেকশন নিজের image দিলে সেটি আগে দেখানো হবে। না হলে এই page-level image fallback cover হিসেবে কাজ করবে।"
                            : "Hero or story sections can override this with their own image. Otherwise, this page-level image is used as the fallback cover."
                        }
                        value={page.heroImage || ""}
                        compact
                        previewClassName="w-full max-w-72"
                      />
                    </div>
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="md:col-span-2">
              <Button type="submit">
                {locale === "bn" ? "পেজ সেভ করুন" : "Save page"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DeleteConfirmationButton
        action={removeRoshalPage}
        buttonLabel={
          locale === "bn"
            ? "à¦ªà§‡à¦œ à¦¡à¦¿à¦²à¦¿à¦Ÿ à¦•à¦°à§à¦¨"
            : "Delete page"
        }
        description={
          locale === "bn"
            ? "à¦à¦‡ à¦ªà§‡à¦œà¦Ÿà¦¿ dashboard à¦¥à§‡à¦•à§‡ à¦¸à¦°à¦¿à§Ÿà§‡ à¦¦à§‡à¦¬à§‡ à¦à¦¬à¦‚ à¦à¦° CMS section à¦—à§à¦²à§‹ à¦®à§à¦›à§‡ à¦¦à§‡à¦¬à§‡à¥¤"
            : `This removes ${page.title.en} from the dashboard page list and deletes its CMS sections.`
        }
        id={page.id}
        redirectTo="/dashboard/pages?deleted=1"
        title={
          locale === "bn"
            ? "à¦ªà§‡à¦œ à¦¡à¦¿à¦²à¦¿à¦Ÿ à¦•à¦°à¦¬à§‡à¦¨?"
            : "Delete marketing page?"
        }
      />

      {/* Homepage section map is intentionally hidden to keep this marketing page editor compact. */}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {locale === "bn" ? "সেকশনসমূহ" : "Sections"}
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Open only the section you need to edit. This keeps long marketing
          pages compact while preserving every CMS control.
        </p>
        <Accordion type="single" collapsible className="space-y-3">
          {sections.map((section) => {
            const sectionPreviewImage = getSectionEditorPreviewImage(
              section,
              page.heroImage,
            );

            return (
              <AccordionItem
                key={section.id}
                value={`section-${section.id}`}
                id={`section-${section.sectionKey}`}
                className="rounded-lg border border-border/70 bg-card px-4 shadow-sm"
              >
                <AccordionTrigger className="gap-4 py-4 hover:no-underline">
                  {sectionPreviewImage ? (
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border/70 bg-muted">
                      <Image
                        src={sectionPreviewImage}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block break-words text-base font-semibold text-foreground">
                      {section.sectionKey} · {section.type}
                    </span>
                    <span className="mt-1 block text-sm font-normal text-muted-foreground">
                      {section.isEnabled ? "Live section" : "Hidden section"} /
                      sort {section.sortOrder}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <form
                    action={saveRoshalSection}
                    className="grid min-w-0 gap-5 md:grid-cols-2"
                  >
                    <input type="hidden" name="id" value={section.id} />
                    <input type="hidden" name="pageId" value={page.id} />
                    <input type="hidden" name="pageSlug" value={page.slug} />
                    <input
                      type="hidden"
                      name="redirectTo"
                      value={`/dashboard/pages/${page.id}?saved=section#section-${section.sectionKey}`}
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
                        previewImageUrl: sectionPreviewImage,
                        items: section.items,
                        styles: section.styles,
                        isEnabled: section.isEnabled,
                      }}
                      submitLabel={
                        locale === "bn" ? "সেকশন সেভ করুন" : "Save section"
                      }
                    />
                  </form>
                </AccordionContent>
              </AccordionItem>
            );
          })}

          <AccordionItem
            value="new-section"
            className="rounded-lg border border-dashed border-border/80 bg-card px-4 shadow-sm"
          >
            <AccordionTrigger className="gap-4 py-4 hover:no-underline">
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-base font-semibold text-foreground">
                  {locale === "bn" ? "নতুন সেকশন যোগ করুন" : "Add new section"}
                </span>
                <span className="mt-1 block text-sm font-normal text-muted-foreground">
                  Create another CMS section for this marketing page.
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <form
                action={saveRoshalSection}
                className="grid min-w-0 gap-5 md:grid-cols-2"
              >
                <input type="hidden" name="pageId" value={page.id} />
                <input type="hidden" name="pageSlug" value={page.slug} />
                <input
                  type="hidden"
                  name="redirectTo"
                  value={`/dashboard/pages/${page.id}?saved=section-created`}
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
                    previewImageUrl: "",
                    items: [],
                    styles: {},
                    isEnabled: true,
                  }}
                  submitLabel={
                    locale === "bn" ? "সেকশন তৈরি করুন" : "Create section"
                  }
                />
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
    previewImageUrl: string;
    items: RoshalMarketingSection["items"];
    styles: RoshalMarketingSection["styles"];
    isEnabled: boolean;
  };
  submitLabel: string;
}) {
  return (
    <>
      <div className="md:col-span-2">
        <DashboardFormCheckbox
          name="isEnabled"
          defaultChecked={defaults.isEnabled}
          label={locale === "bn" ? "সেকশন চালু" : "Section enabled"}
        />
      </div>
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
      <Accordion type="multiple" className="space-y-3 md:col-span-2">
        <AccordionItem
          value="section-setup"
          className="rounded-lg border border-border/70 px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="min-w-0 text-left">
              <span className="block font-semibold">Section setup</span>
              <span className="block text-sm font-normal text-muted-foreground">
                Key, type, order, layout, variant, and eyebrow text.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent forceMount>
            <div className="grid min-w-0 gap-5 pt-1 md:grid-cols-2">
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
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="section-media"
          className="rounded-lg border border-border/70 px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="min-w-0 text-left">
              <span className="block font-semibold">Media and button</span>
              <span className="block text-sm font-normal text-muted-foreground">
                Section image and call-to-action fields.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent forceMount>
            <div className="grid min-w-0 gap-5 pt-1 md:grid-cols-2">
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
                  previewValue={defaults.previewImageUrl}
                  compact
                  previewClassName="w-full max-w-64"
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
              <Field
                name="ctaHref"
                label="CTA Href"
                defaultValue={defaults.ctaHref}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="section-items"
          className="rounded-lg border border-border/70 px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="min-w-0 text-left">
              <span className="block font-semibold">Section items</span>
              <span className="block text-sm font-normal text-muted-foreground">
                Cards, stats, brand tiles, contact rows, and list items.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent forceMount>
            <div className="pt-1">
              <MarketingSectionItemsField
                name="itemsJson"
                defaultItems={defaults.items}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="section-styles"
          className="rounded-lg border border-border/70 px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="min-w-0 text-left">
              <span className="block font-semibold">Section styles</span>
              <span className="block text-sm font-normal text-muted-foreground">
                Optional renderer keys such as source, limit, columns, or
                density.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent forceMount>
            <div className="pt-1">
              <MarketingSectionStylesField
                name="stylesJson"
                defaultStyles={defaults.styles}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
    <div className="min-w-0 space-y-2">
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
    <div className="min-w-0 space-y-2">
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
