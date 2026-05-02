import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  removeRoshalPage,
  saveRoshalPage,
  saveRoshalSection,
} from "@/actions/admin";
import { CmsSaveToast } from "@/components/dashboard/cms-save-toast";
import { DashboardFormStatusToast } from "@/components/dashboard/dashboard-form-status-toast";
import { DeleteConfirmationButton } from "@/components/dashboard/delete-confirmation-button";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import {
  type MarketingSectionItemsCopy,
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
import { getDashboardActionErrorMessage } from "@/lib/dashboard-action-errors";
import {
  dashboardDraftBoolean,
  dashboardDraftJson,
  dashboardDraftValue,
  readDashboardFormDraft,
} from "@/lib/dashboard-form-drafts";
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

const sectionDraftErrorCodes = new Set([
  "duplicate-section-key",
  "invalid-section-items",
  "invalid-section-styles",
  "missing-section-key",
  "missing-section-page",
  "missing-section-type",
]);

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

type SectionEditorMeta = {
  description: string;
  imageHelperText: string;
  imageLabel: string;
  itemsCopy: MarketingSectionItemsCopy;
  title: string;
  titleBnLabel: string;
  titleEnLabel: string;
  bodyBnLabel: string;
  bodyEnLabel: string;
};

const defaultItemsCopy: MarketingSectionItemsCopy = {
  addButtonLabel: "Add row",
  emptyText: "No rows added yet.",
  helperText:
    "Rows render in Sort order. Use only the fields this section needs and leave the rest blank.",
  itemLabel: "Row",
  title: "Section rows",
};

const sectionEditorMetaByKey: Record<string, Partial<SectionEditorMeta>> = {
  hero: {
    title: "Hero carousel",
    description:
      "Top homepage banner area. Add one slide per banner image and keep slide text blank when the image already contains text.",
    imageLabel: "Fallback hero image",
    imageHelperText:
      "Used only when no slide image is available. It does not create text by itself.",
    titleBnLabel: "Fallback hero title (BN, optional)",
    titleEnLabel: "Fallback hero title (EN, optional)",
    bodyBnLabel: "Fallback hero text (BN, optional)",
    bodyEnLabel: "Fallback hero text (EN, optional)",
    itemsCopy: {
      addButtonLabel: "Add carousel slide",
      bodyBnLabel: "Slide text (BN, optional)",
      bodyEnLabel: "Slide text (EN, optional)",
      emptyText: "No carousel slides yet.",
      helperText:
        "Each row is one hero slide. Leave slide title and text blank for an image-only banner; the storefront will not borrow text from slide 0 or another slide.",
      hrefLabel: "Slide button link",
      containerHeightLabel: "Slide container height",
      imageLabel: "Slide image",
      imageFitLabel: "Slide image fit",
      imageScaleLabel: "Slide image scale %",
      itemLabel: "Slide",
      labelBnLabel: "Slide button label (BN, optional)",
      labelEnLabel: "Slide button label (EN, optional)",
      showSlideDesignFields: true,
      textColorLabel: "Slide text color",
      title: "Carousel slides",
      titleBnLabel: "Slide title (BN, optional)",
      titleEnLabel: "Slide title (EN, optional)",
      valueLabel: "Small value/badge (optional)",
    },
  },
  promises: {
    title: "Promise cards",
    description: "Small trust badges shown near the top of the homepage.",
    itemsCopy: {
      addButtonLabel: "Add promise card",
      helperText:
        "Each row is one compact promise card. Title and body are the important fields here.",
      itemLabel: "Promise",
      title: "Promise cards",
    },
  },
  "featured-products": {
    title: "Featured products",
    description:
      "Controls the featured product block and optional product source settings.",
  },
  "brand-story": {
    title: "Brand story",
    description: "Short homepage story block with one main supporting image.",
  },
  "landing-categories": {
    title: "Featured categories",
    description: "Homepage category strip shown below the hero area.",
    itemsCopy: {
      addButtonLabel: "Add category card",
      helperText:
        "Use rows only when this section is set to manual source. Each row is one category card.",
      imageLabel: "Category image",
      itemLabel: "Category",
      title: "Category cards",
    },
  },
  "landing-top-sellers": {
    title: "Top selling products",
    description: "Product grid for best-selling or priority catalog items.",
  },
  "landing-new-arrivals": {
    title: "New arrivals",
    description: "Product grid for newly added or highlighted products.",
  },
  "landing-special-offers": {
    title: "Special deals",
    description: "Manual offer cards or product-driven deal cards.",
    itemsCopy: {
      addButtonLabel: "Add deal card",
      helperText:
        "Each row is one deal card. Use image, title, text, link, and value only when needed.",
      imageLabel: "Deal image",
      itemLabel: "Deal",
      title: "Deal cards",
    },
  },
  "landing-fresh-picks": {
    title: "Fresh picks",
    description: "Optional fresh product section for homepage merchandising.",
  },
  "landing-organic-picks": {
    title: "Organic products",
    description: "Optional organic-product section for homepage merchandising.",
  },
  "landing-seasonal-picks": {
    title: "Seasonal products",
    description:
      "Optional seasonal-product section for homepage merchandising.",
  },
  "landing-stats": {
    title: "Our numbers",
    description: "Metric cards such as customers, products, or delivery reach.",
    itemsCopy: {
      addButtonLabel: "Add number card",
      helperText:
        "Each row is one metric card. Use Value for the number and Title/Body for the label.",
      itemLabel: "Number",
      title: "Number cards",
      valueLabel: "Number value",
    },
  },
  "landing-testimonials": {
    title: "Customer reviews",
    description:
      "Homepage testimonial area. Public reviews are normally pulled from saved product reviews.",
  },
  intro: {
    title: "Page intro",
    description: "Top story or introductory block for this marketing page.",
  },
  commitments: {
    title: "Commitments",
    description: "Trust, quality, or promise cards for this page.",
  },
  details: {
    title: "Page details",
    description: "Detailed content section for this marketing page.",
  },
  "sourcing-story": {
    title: "Sourcing story",
    description: "About-page story content about sourcing and quality.",
  },
  "quality-standards": {
    title: "Quality standards",
    description: "About-page quality cards or standards list.",
  },
  "contact-help-topics": {
    title: "Contact help topics",
    description: "Contact-page support cards and help routes.",
  },
  "service-promise": {
    title: "Service promise",
    description: "Contact-page service promise or support assurance block.",
  },
  "response-commitments": {
    title: "Response commitments",
    description: "Contact-page response time or support metric cards.",
  },
  "terms-responsibilities": {
    title: "Terms responsibilities",
    description:
      "Responsibilities, order rules, and terms cards for the customer-facing Terms page.",
    itemsCopy: {
      addButtonLabel: "Add terms card",
      helperText:
        "Each row is one terms card. Keep title and short text focused.",
      itemLabel: "Terms card",
      title: "Terms cards",
    },
  },
  "terms-guide": {
    title: "Terms guide",
    description:
      "Main Terms & Conditions content shown to customers. Keep the visible text concise.",
    titleBnLabel: "Terms heading (BN)",
    titleEnLabel: "Terms heading (EN)",
    bodyBnLabel: "Terms details (BN)",
    bodyEnLabel: "Terms details (EN)",
    itemsCopy: {
      addButtonLabel: "Add terms point",
      helperText:
        "Each row is one customer-facing terms point. Use title and text; leave unused fields blank.",
      itemLabel: "Terms point",
      title: "Terms points",
    },
  },
  "privacy-rights": {
    title: "Customer privacy rights",
    description:
      "Privacy Policy cards explaining customer data rights and data-use rules.",
    itemsCopy: {
      addButtonLabel: "Add privacy card",
      helperText:
        "Each row is one privacy card. Keep the message short and customer-friendly.",
      itemLabel: "Privacy card",
      title: "Privacy cards",
    },
  },
  "privacy-security-story": {
    title: "Privacy and security story",
    description:
      "Short story section explaining how Roshal Organic protects customer data.",
    titleBnLabel: "Security heading (BN)",
    titleEnLabel: "Security heading (EN)",
    bodyBnLabel: "Security text (BN)",
    bodyEnLabel: "Security text (EN)",
  },
  "privacy-guide": {
    title: "Privacy policy guide",
    description:
      "Main Privacy Policy content shown to customers. Keep required policy points here.",
    titleBnLabel: "Privacy heading (BN)",
    titleEnLabel: "Privacy heading (EN)",
    bodyBnLabel: "Privacy details (BN)",
    bodyEnLabel: "Privacy details (EN)",
    itemsCopy: {
      addButtonLabel: "Add privacy point",
      helperText:
        "Each row is one privacy policy point. Use title and text; leave unused fields blank.",
      itemLabel: "Privacy point",
      title: "Privacy points",
    },
  },
};

function humanizeSectionKey(value: string) {
  return (value || "section")
    .replace(/^landing-/, "")
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getSectionEditorMeta(
  section: Pick<RoshalMarketingSection, "layout" | "sectionKey" | "type">,
): SectionEditorMeta {
  const configured = sectionEditorMetaByKey[section.sectionKey] || {};
  const fallbackTitle = humanizeSectionKey(section.sectionKey || section.type);
  const isCarouselSection =
    section.type === "hero" || section.layout === "carousel";

  return {
    bodyBnLabel: configured.bodyBnLabel || "Section text (BN)",
    bodyEnLabel: configured.bodyEnLabel || "Section text (EN)",
    description:
      configured.description ||
      `Edit the ${fallbackTitle.toLowerCase()} section content and visibility.`,
    imageHelperText:
      configured.imageHelperText ||
      "Main image for visual sections. Leave blank when this section does not need an image.",
    imageLabel: configured.imageLabel || "Section image",
    itemsCopy: {
      ...defaultItemsCopy,
      ...(isCarouselSection
        ? {
            addButtonLabel: "Add carousel slide",
            containerHeightLabel: "Slide container height",
            emptyText: "No carousel slides yet.",
            helperText:
              "Each row is one carousel slide. Use Sort to order slides, Remove to delete, and leave title/text blank for image-only slides.",
            imageFitLabel: "Slide image fit",
            imageLabel: "Slide image",
            imageScaleLabel: "Slide image scale %",
            itemLabel: "Slide",
            showSlideDesignFields: true,
            textColorLabel: "Slide text color",
            title: "Carousel slides",
          }
        : {}),
      ...configured.itemsCopy,
    },
    title: configured.title || fallbackTitle,
    titleBnLabel: configured.titleBnLabel || "Section title (BN)",
    titleEnLabel: configured.titleEnLabel || "Section title (EN)",
  };
}

function getPageCoverImageCopy(pageSlug: string) {
  if (pageSlug === "home") {
    return {
      helperText:
        "This is for page cover/SEO only. It will not become a Home carousel slide. Add carousel images inside Hero carousel slides below.",
      label: "Page cover image (not carousel)",
    };
  }

  return {
    helperText: "Main cover image for this page.",
    label: "Hero or cover image",
  };
}

function getSectionEditorPreviewImage(section: RoshalMarketingSection) {
  return (
    section.imageUrl ||
    section.items.find((item) => item.imageUrl)?.imageUrl ||
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
    sectionId?: string;
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
          sectionId?: string;
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
  const isSectionError = Boolean(
    resolvedSearchParams.sectionId ||
      resolvedSearchParams.sectionKey ||
      (resolvedSearchParams.error &&
        sectionDraftErrorCodes.has(resolvedSearchParams.error)),
  );
  const draftCookieStore = resolvedSearchParams.error ? await cookies() : null;
  const pageDraftValues =
    resolvedSearchParams.error && !isSectionError && draftCookieStore
      ? readDashboardFormDraft(draftCookieStore, "cms-page")
      : {};
  const sectionDraftValues =
    isSectionError && draftCookieStore
      ? readDashboardFormDraft(draftCookieStore, "cms-section")
      : {};
  const draftSectionId = dashboardDraftValue(sectionDraftValues, "id");
  const hasSectionDraft = Object.keys(sectionDraftValues).length > 0;
  const pageCoverImageCopy = getPageCoverImageCopy(page.slug);

  return (
    <div className="min-w-0 space-y-6 px-6 pt-6 pb-4">
      <DashboardFormStatusToast errorMessage={errorMessage || undefined} />
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
              defaultValue={dashboardDraftValue(
                pageDraftValues,
                "navigationLabelBn",
                page.navigationLabel.bn,
              )}
            />
            <Field
              name="navigationLabelEn"
              label="Navigation Label (EN)"
              defaultValue={dashboardDraftValue(
                pageDraftValues,
                "navigationLabelEn",
                page.navigationLabel.en,
              )}
            />
            <Field
              name="titleBn"
              label="Title (BN)"
              defaultValue={dashboardDraftValue(
                pageDraftValues,
                "titleBn",
                page.title.bn,
              )}
            />
            <Field
              name="titleEn"
              label="Title (EN)"
              defaultValue={dashboardDraftValue(
                pageDraftValues,
                "titleEn",
                page.title.en,
              )}
            />
            <div className="md:col-span-2">
              <ImageUploadField
                name="heroImage"
                label={pageCoverImageCopy.label}
                helperText={pageCoverImageCopy.helperText}
                value={dashboardDraftValue(
                  pageDraftValues,
                  "heroImage",
                  page.heroImage || "",
                )}
                compact
                previewClassName="w-full max-w-72"
              />
            </div>
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
                      Slug, status, description, and navigation visibility.
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent forceMount>
                  <div className="grid min-w-0 gap-5 pt-1 md:grid-cols-2">
                    <Field
                      name="slug"
                      label="Slug"
                      defaultValue={dashboardDraftValue(
                        pageDraftValues,
                        "slug",
                        page.slug,
                      )}
                      required
                    />
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <DashboardFormSelect
                        name="status"
                        defaultValue={dashboardDraftValue(
                          pageDraftValues,
                          "status",
                          page.status,
                        )}
                        options={pageStatusOptions}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <TextField
                        name="descriptionBn"
                        label="Description (BN)"
                        defaultValue={dashboardDraftValue(
                          pageDraftValues,
                          "descriptionBn",
                          page.description.bn,
                        )}
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <TextField
                        name="descriptionEn"
                        label="Description (EN)"
                        defaultValue={dashboardDraftValue(
                          pageDraftValues,
                          "descriptionEn",
                          page.description.en,
                        )}
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <DashboardFormCheckbox
                        name="showInNavigation"
                        defaultChecked={dashboardDraftBoolean(
                          pageDraftValues,
                          "showInNavigation",
                          page.showInNavigation,
                        )}
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
            const sectionMeta = getSectionEditorMeta(section);
            const sectionPreviewImage = getSectionEditorPreviewImage(section);
            const sectionDefaults = applySectionDraft(
              {
                bodyBn: section.body.bn,
                bodyEn: section.body.en,
                ctaHref: section.ctaHref,
                ctaLabelBn: section.ctaLabel.bn,
                ctaLabelEn: section.ctaLabel.en,
                eyebrowBn: section.eyebrow.bn,
                eyebrowEn: section.eyebrow.en,
                imageUrl: section.imageUrl,
                isEnabled: section.isEnabled,
                items: section.items,
                layout: section.layout,
                previewImageUrl: sectionPreviewImage,
                sectionKey: section.sectionKey,
                sortOrder: String(section.sortOrder),
                styles: section.styles,
                titleBn: section.title.bn,
                titleEn: section.title.en,
                type: section.type,
                variant: section.variant,
              },
              draftSectionId === section.id ? sectionDraftValues : {},
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
                      {sectionMeta.title}
                    </span>
                    <span className="mt-1 block text-sm font-normal text-muted-foreground">
                      {section.isEnabled ? "Live on storefront" : "Hidden"} /
                      order {section.sortOrder}
                    </span>
                    <span className="mt-1 block text-sm font-normal text-muted-foreground">
                      {sectionMeta.description}
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
                      defaults={sectionDefaults}
                      meta={sectionMeta}
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
                  defaults={applySectionDraft(
                    {
                      bodyBn: "",
                      bodyEn: "",
                      ctaHref: "",
                      ctaLabelBn: "",
                      ctaLabelEn: "",
                      eyebrowBn: "",
                      eyebrowEn: "",
                      imageUrl: "",
                      isEnabled: true,
                      items: [],
                      layout: "stacked",
                      previewImageUrl: "",
                      sectionKey: "",
                      sortOrder: String(sections.length),
                      styles: {},
                      titleBn: "",
                      titleEn: "",
                      type: "story",
                      variant: "default",
                    },
                    hasSectionDraft && !draftSectionId
                      ? sectionDraftValues
                      : {},
                  )}
                  meta={getSectionEditorMeta({
                    layout: "stacked",
                    sectionKey: "new-section",
                    type: "story",
                  })}
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

type SectionFieldDefaults = {
  bodyBn: string;
  bodyEn: string;
  ctaHref: string;
  ctaLabelBn: string;
  ctaLabelEn: string;
  eyebrowBn: string;
  eyebrowEn: string;
  imageUrl: string;
  isEnabled: boolean;
  items: RoshalMarketingSection["items"];
  layout: string;
  previewImageUrl: string;
  sectionKey: string;
  sortOrder: string;
  styles: RoshalMarketingSection["styles"];
  titleBn: string;
  titleEn: string;
  type: string;
  variant: string;
};

function applySectionDraft(
  defaults: SectionFieldDefaults,
  draftValues: Record<string, string>,
): SectionFieldDefaults {
  const imageUrl = dashboardDraftValue(
    draftValues,
    "imageUrl",
    defaults.imageUrl,
  );

  return {
    ...defaults,
    bodyBn: dashboardDraftValue(draftValues, "bodyBn", defaults.bodyBn),
    bodyEn: dashboardDraftValue(draftValues, "bodyEn", defaults.bodyEn),
    ctaHref: dashboardDraftValue(draftValues, "ctaHref", defaults.ctaHref),
    ctaLabelBn: dashboardDraftValue(
      draftValues,
      "ctaLabelBn",
      defaults.ctaLabelBn,
    ),
    ctaLabelEn: dashboardDraftValue(
      draftValues,
      "ctaLabelEn",
      defaults.ctaLabelEn,
    ),
    eyebrowBn: dashboardDraftValue(
      draftValues,
      "eyebrowBn",
      defaults.eyebrowBn,
    ),
    eyebrowEn: dashboardDraftValue(
      draftValues,
      "eyebrowEn",
      defaults.eyebrowEn,
    ),
    imageUrl,
    isEnabled: dashboardDraftBoolean(
      draftValues,
      "isEnabled",
      defaults.isEnabled,
    ),
    items: dashboardDraftJson<RoshalMarketingSection["items"]>(
      draftValues,
      "itemsJson",
      defaults.items,
    ),
    layout: dashboardDraftValue(draftValues, "layout", defaults.layout),
    previewImageUrl: imageUrl || defaults.previewImageUrl,
    sectionKey: dashboardDraftValue(
      draftValues,
      "sectionKey",
      defaults.sectionKey,
    ),
    sortOrder: dashboardDraftValue(
      draftValues,
      "sortOrder",
      defaults.sortOrder,
    ),
    styles: dashboardDraftJson<RoshalMarketingSection["styles"]>(
      draftValues,
      "stylesJson",
      defaults.styles,
    ),
    titleBn: dashboardDraftValue(draftValues, "titleBn", defaults.titleBn),
    titleEn: dashboardDraftValue(draftValues, "titleEn", defaults.titleEn),
    type: dashboardDraftValue(draftValues, "type", defaults.type),
    variant: dashboardDraftValue(draftValues, "variant", defaults.variant),
  };
}

function SectionFields({
  locale,
  defaults,
  meta,
  submitLabel,
}: {
  locale: "bn" | "en";
  defaults: SectionFieldDefaults;
  meta: SectionEditorMeta;
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
        label={meta.titleBnLabel}
        defaultValue={defaults.titleBn}
      />
      <Field
        name="titleEn"
        label={meta.titleEnLabel}
        defaultValue={defaults.titleEn}
      />
      <div className="md:col-span-2">
        <TextField
          name="bodyBn"
          label={meta.bodyBnLabel}
          defaultValue={defaults.bodyBn}
          rows={4}
        />
      </div>
      <div className="md:col-span-2">
        <TextField
          name="bodyEn"
          label={meta.bodyEnLabel}
          defaultValue={defaults.bodyEn}
          rows={4}
        />
      </div>
      <div className="md:col-span-2">
        <ImageUploadField
          name="imageUrl"
          label={meta.imageLabel}
          helperText={meta.imageHelperText}
          value={defaults.imageUrl}
          previewValue={defaults.previewImageUrl}
          compact
          previewClassName="w-full max-w-64"
        />
      </div>
      <Accordion type="multiple" className="space-y-3 md:col-span-2">
        <AccordionItem
          value="section-setup"
          className="rounded-lg border border-border/70 px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="min-w-0 text-left">
              <span className="block font-semibold">More section controls</span>
              <span className="block text-sm font-normal text-muted-foreground">
                Key, type, order, layout, accent/variant, and eyebrow text.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent forceMount>
            <div className="grid min-w-0 gap-5 pt-1 md:grid-cols-2">
              <Field
                name="sectionKey"
                label="Section Key"
                defaultValue={defaults.sectionKey}
                required
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
              <span className="block font-semibold">Button link</span>
              <span className="block text-sm font-normal text-muted-foreground">
                Optional call-to-action labels and link.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent forceMount>
            <div className="grid min-w-0 gap-5 pt-1 md:grid-cols-2">
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
              <span className="block font-semibold">
                {meta.itemsCopy.title || "Cards and slides"}
              </span>
              <span className="block text-sm font-normal text-muted-foreground">
                {meta.itemsCopy.helperText ||
                  "Cards, stats, brand tiles, contact rows, and list items."}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent forceMount>
            <div className="pt-1">
              <MarketingSectionItemsField
                name="itemsJson"
                defaultItems={defaults.items}
                copy={meta.itemsCopy}
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
              <span className="block font-semibold">Renderer style keys</span>
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
  required = false,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue}
        type={type}
        required={required}
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
      return getDashboardActionErrorMessage(code) || null;
  }
}
