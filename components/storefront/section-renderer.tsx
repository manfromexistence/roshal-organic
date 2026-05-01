import Image from "next/image";
import Link from "next/link";
import {
  MarketingHoverSurface,
  MarketingMediaSurface,
  MarketingReveal,
} from "@/components/storefront/marketing-motion";
import { RoshalProductCard } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getWhatsAppHref } from "@/lib/store-contact";
import { getLocalizedValue } from "@/lib/store-locale";
import type {
  LocalizedValue,
  RoshalLocale,
  RoshalMarketingPage,
  RoshalMarketingSection,
  RoshalProduct,
  RoshalSiteSettings,
} from "@/lib/store-types";
import { cn } from "@/lib/utils";

const spacingMap: Record<string, string> = {
  compact: "py-8 sm:py-10",
  comfortable: "py-10 sm:py-12 md:py-16",
  spacious: "py-12 sm:py-16 md:py-24",
};

const columnsMap: Record<string, string> = {
  "2": "grid-cols-1 md:grid-cols-2",
  "3": "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  "5": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

const primaryButtonClass =
  "h-auto min-h-10 max-w-full whitespace-normal px-4 py-2 text-center leading-5 sm:px-6";

const compactButtonClass =
  "h-auto min-h-8 max-w-full whitespace-normal px-3 py-1.5 text-center leading-4";

const wrappingTextClass = "break-words [overflow-wrap:anywhere]";

function parseLimit(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getSectionProducts(
  section: RoshalMarketingSection,
  products: RoshalProduct[],
) {
  const source = section.styles.source || "featured";
  const limit = parseLimit(section.styles.limit, 4);
  const offset = parseLimit(section.styles.offset, 0);
  const featuredProducts = products.filter((product) => product.isFeatured);

  const baseProducts =
    source === "all"
      ? products
      : source === "reverse"
        ? [...products].reverse()
        : featuredProducts.length
          ? featuredProducts
          : products;

  return baseProducts.slice(offset, offset + limit);
}

function resolveLocalizedItemValue(
  locale: RoshalLocale,
  value?: LocalizedValue | null,
) {
  return value ? getLocalizedValue(locale, value) : "";
}

function isCompactMarketingPage(slug?: string) {
  return slug === "about" || slug === "contact";
}

function resolveSectionSpacing(
  section: RoshalMarketingSection,
  pageSlug: string | undefined,
  sectionSpacing: string,
) {
  if (isCompactMarketingPage(pageSlug)) {
    if (section.type === "hero" || section.type === "story") {
      return "py-6 sm:py-8 lg:py-10";
    }

    return "py-5 sm:py-7 lg:py-9";
  }

  return spacingMap[sectionSpacing] || spacingMap.comfortable;
}

function resolveSectionColumns(
  section: RoshalMarketingSection,
  pageSlug?: string,
) {
  const hasDetailedCards = section.items.some(
    (item) =>
      Boolean(resolveLocalizedItemValue("en", item.body)) || Boolean(item.href),
  );

  if (
    pageSlug === "contact" &&
    section.type === "contact-cards" &&
    section.items.length >= 4 &&
    !hasDetailedCards
  ) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  }

  if (section.styles.columns && columnsMap[section.styles.columns]) {
    return columnsMap[section.styles.columns];
  }

  if (section.layout === "split") {
    return columnsMap["2"];
  }

  return columnsMap["4"];
}

function resolveContactCardValue(
  locale: RoshalLocale,
  siteSettings: RoshalSiteSettings,
  label: string,
  fallback: string,
) {
  const normalizedLabel = label.trim().toLowerCase();

  if (normalizedLabel.includes("phone") || normalizedLabel.includes("ফোন")) {
    return siteSettings.contactPhone || fallback;
  }

  if (normalizedLabel.includes("email") || normalizedLabel.includes("ইমেইল")) {
    return siteSettings.contactEmail || fallback;
  }

  if (
    normalizedLabel.includes("address") ||
    normalizedLabel.includes("ঠিকানা") ||
    normalizedLabel.includes("location") ||
    normalizedLabel.includes("লোকেশন")
  ) {
    return getLocalizedValue(locale, siteSettings.address) || fallback;
  }

  if (
    normalizedLabel.includes("whatsapp") ||
    normalizedLabel.includes("হোয়াটসঅ্যাপ") ||
    normalizedLabel.includes("হোয়াটসআপ")
  ) {
    return siteSettings.whatsappPhone || fallback;
  }

  if (
    normalizedLabel.includes("facebook") ||
    normalizedLabel.includes("ফেসবুক")
  ) {
    return siteSettings.facebookUrl || fallback;
  }

  return fallback;
}

function resolveContactCardHref(
  siteSettings: RoshalSiteSettings,
  label: string,
  fallback?: string,
) {
  const normalizedLabel = label.trim().toLowerCase();
  if (normalizedLabel.includes("phone") || normalizedLabel.includes("ফোন")) {
    return `tel:${siteSettings.contactPhone}`;
  }

  if (normalizedLabel.includes("email") || normalizedLabel.includes("ইমেইল")) {
    return `mailto:${siteSettings.contactEmail}`;
  }

  if (
    normalizedLabel.includes("whatsapp") ||
    normalizedLabel.includes("হোয়াটসঅ্যাপ") ||
    normalizedLabel.includes("হোয়াটসআপ")
  ) {
    return getWhatsAppHref(siteSettings.whatsappPhone) || fallback;
  }

  if (
    normalizedLabel.includes("facebook") ||
    normalizedLabel.includes("ফেসবুক")
  ) {
    return siteSettings.facebookUrl || fallback;
  }

  return fallback;
}

export function RoshalSectionRenderer({
  sections,
  locale,
  products,
  siteSettings,
  page,
}: {
  sections: RoshalMarketingSection[];
  locale: RoshalLocale;
  products: RoshalProduct[];
  siteSettings: RoshalSiteSettings;
  page?: RoshalMarketingPage;
}) {
  const sortedSections = [...sections].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const primarySectionId = sortedSections.find(
    (section) => section.type === "hero" || section.type === "story",
  )?.id;
  const pageSlug = page?.slug;

  return (
    <>
      {sortedSections.map((section) => (
        <section
          key={section.id}
          className={`overflow-x-clip ${resolveSectionSpacing(section, pageSlug, siteSettings.sectionSpacing)} ${
            section.variant === "muted" ? "bg-muted/35" : "bg-transparent"
          }`}
        >
          <div className="container mx-auto min-w-0 px-4 sm:px-6 md:px-8">
            <SectionContent
              section={section}
              locale={locale}
              products={products}
              siteSettings={siteSettings}
              page={section.id === primarySectionId ? page : undefined}
              pageSlug={pageSlug}
            />
          </div>
        </section>
      ))}
    </>
  );
}

function SectionContent({
  section,
  locale,
  products,
  siteSettings,
  page,
  pageSlug,
}: {
  section: RoshalMarketingSection;
  locale: RoshalLocale;
  products: RoshalProduct[];
  siteSettings: RoshalSiteSettings;
  page?: RoshalMarketingPage;
  pageSlug?: string;
}) {
  const eyebrow = getLocalizedValue(locale, section.eyebrow);
  const title = getLocalizedValue(locale, section.title);
  const body = getLocalizedValue(locale, section.body);
  const ctaLabel = getLocalizedValue(locale, section.ctaLabel);
  const pageEyebrow = page
    ? getLocalizedValue(locale, page.navigationLabel)
    : "";
  const pageTitle = page ? getLocalizedValue(locale, page.title) : "";
  const pageBody = page ? getLocalizedValue(locale, page.description) : "";
  const heroEyebrow = eyebrow || pageEyebrow;
  const heroTitle = title || pageTitle;
  const heroBody = body || pageBody;
  const heroImage = section.imageUrl || page?.heroImage;
  const sectionColumns = resolveSectionColumns(section, pageSlug);
  const compactInfoPage = isCompactMarketingPage(pageSlug);

  if (section.type === "hero" || section.type === "story") {
    return (
      <MarketingReveal
        className={cn(
          "grid min-w-0 items-center overflow-hidden border border-border/60 bg-gradient-to-br from-background via-background to-muted/60 shadow-sm",
          compactInfoPage
            ? "gap-5 rounded-xl p-4 sm:p-5 md:gap-6 lg:p-8"
            : "gap-6 rounded-2xl p-4 sm:p-6 md:gap-8 lg:p-10",
          siteSettings.heroLayout === "split"
            ? "lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]"
            : "mx-auto max-w-4xl",
        )}
      >
        <div
          className={cn("min-w-0", compactInfoPage ? "space-y-4" : "space-y-5")}
        >
          {heroEyebrow ? (
            <p
              className={`${wrappingTextClass} text-xs uppercase tracking-[0.16em] text-primary sm:tracking-[0.24em] dark:[color:color-mix(in_oklch,var(--foreground)_68%,var(--primary))]`}
            >
              {heroEyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              wrappingTextClass,
              "max-w-3xl font-semibold leading-[1.16] tracking-tight text-foreground",
              compactInfoPage
                ? "text-3xl sm:text-4xl xl:text-5xl"
                : "text-3xl sm:text-4xl md:text-5xl",
            )}
          >
            {heroTitle}
          </h1>
          <p
            className={`${wrappingTextClass} max-w-2xl text-base leading-7 text-muted-foreground md:text-lg`}
          >
            {heroBody}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className={`w-full transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto ${primaryButtonClass}`}
            >
              <Link href={section.ctaHref || siteSettings.primaryCtaHref}>
                {ctaLabel ||
                  getLocalizedValue(locale, siteSettings.primaryCtaLabel)}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={`w-full transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 sm:w-auto ${primaryButtonClass}`}
            >
              <Link href="/contact">
                {locale === "bn" ? "যোগাযোগ করুন" : "Contact us"}
              </Link>
            </Button>
          </div>
        </div>
        {heroImage ? (
          <MarketingMediaSurface
            className={cn(
              "relative overflow-hidden rounded-xl border bg-muted",
              compactInfoPage
                ? "min-h-48 sm:min-h-60 lg:min-h-72"
                : "min-h-56 sm:min-h-72 md:min-h-80 md:rounded-[1.5rem]",
            )}
          >
            <Image
              src={heroImage}
              alt={heroTitle}
              fill
              priority
              loading="eager"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </MarketingMediaSurface>
        ) : null}
      </MarketingReveal>
    );
  }

  if (section.type === "feature-grid") {
    return (
      <div
        className={cn("min-w-0", compactInfoPage ? "space-y-4" : "space-y-5")}
      >
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          body={body}
          compact={compactInfoPage}
        />
        <div
          className={cn(
            "grid min-w-0 items-stretch",
            compactInfoPage ? "gap-3 sm:gap-4" : "gap-3",
            sectionColumns,
          )}
        >
          {section.items.map((item, index) => {
            const itemTitle = resolveLocalizedItemValue(locale, item.title);
            const itemBody = resolveLocalizedItemValue(locale, item.body);
            const itemLabel = resolveLocalizedItemValue(locale, item.label);

            return (
              <MarketingHoverSurface
                key={`${section.id}-${index}`}
                className="h-full min-w-0"
                delay={index * 0.04}
              >
                <Card className="h-full min-w-0 overflow-hidden border-border/60 bg-card/95 p-0 shadow-sm transition-colors duration-200 hover:border-primary/25 dark:hover:bg-card">
                  {item.imageUrl ? (
                    <MarketingMediaSurface className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={item.imageUrl}
                        alt={itemTitle || itemLabel || title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </MarketingMediaSurface>
                  ) : null}
                  <CardContent
                    className={cn(
                      "min-w-0 space-y-3",
                      compactInfoPage ? "p-4 sm:p-5" : "p-4 sm:p-6",
                    )}
                  >
                    {itemLabel ? (
                      <Badge
                        variant="secondary"
                        className={`max-w-full whitespace-normal text-left leading-5 ${wrappingTextClass}`}
                      >
                        {itemLabel}
                      </Badge>
                    ) : null}
                    {itemTitle ? (
                      <h3
                        className={`${wrappingTextClass} text-lg font-semibold`}
                      >
                        {itemTitle}
                      </h3>
                    ) : null}
                    {itemBody ? (
                      <p
                        className={`${wrappingTextClass} text-sm leading-6 text-muted-foreground`}
                      >
                        {itemBody}
                      </p>
                    ) : null}
                    {item.value ? (
                      <p
                        className={`${wrappingTextClass} text-lg font-semibold text-primary`}
                      >
                        {item.value}
                      </p>
                    ) : null}
                    {item.href ? (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className={`w-full transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 sm:w-auto ${compactButtonClass}`}
                      >
                        <Link href={item.href}>
                          {itemLabel ||
                            (locale === "bn" ? "বিস্তারিত" : "Learn more")}
                        </Link>
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              </MarketingHoverSurface>
            );
          })}
        </div>
        {ctaLabel ? (
          <MarketingReveal delay={0.08}>
            <Button
              asChild
              variant="outline"
              className={`w-full transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 sm:w-auto ${primaryButtonClass}`}
            >
              <Link href={section.ctaHref}>{ctaLabel}</Link>
            </Button>
          </MarketingReveal>
        ) : null}
      </div>
    );
  }

  if (section.type === "featured-products") {
    const sectionProducts = getSectionProducts(section, products);

    return (
      <div className="min-w-0 space-y-8">
        <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        <MarketingReveal className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sectionProducts.map((product) => (
            <RoshalProductCard
              key={product.id}
              product={product}
              locale={locale}
            />
          ))}
        </MarketingReveal>
        {ctaLabel ? (
          <MarketingReveal delay={0.08}>
            <Button
              asChild
              variant="outline"
              className={`w-full transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 sm:w-auto ${primaryButtonClass}`}
            >
              <Link href={section.ctaHref || "/products"}>{ctaLabel}</Link>
            </Button>
          </MarketingReveal>
        ) : null}
      </div>
    );
  }

  if (section.type === "contact-cards") {
    const resolvedCtaHref = ctaLabel
      ? resolveContactCardHref(siteSettings, ctaLabel, section.ctaHref)
      : section.ctaHref;

    return (
      <div
        className={cn("min-w-0", compactInfoPage ? "space-y-4" : "space-y-5")}
      >
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          body={body}
          compact={compactInfoPage}
        />
        <div
          className={cn(
            "grid min-w-0 items-stretch",
            compactInfoPage ? "gap-3 sm:gap-4" : "gap-3",
            sectionColumns,
          )}
        >
          {section.items.map((item, index) => {
            const itemLabel = resolveLocalizedItemValue(locale, item.label);
            const itemTitle = resolveContactCardValue(
              locale,
              siteSettings,
              itemLabel,
              resolveLocalizedItemValue(locale, item.title),
            );
            const itemValue = resolveContactCardValue(
              locale,
              siteSettings,
              itemLabel,
              item.value || "",
            );
            const itemBody = resolveLocalizedItemValue(locale, item.body);
            const itemHref = resolveContactCardHref(
              siteSettings,
              itemLabel,
              item.href,
            );

            return (
              <MarketingHoverSurface
                key={`${section.id}-${index}`}
                className="h-full min-w-0"
                delay={index * 0.04}
              >
                <Card className="h-full min-w-0 border-border/60 bg-card/95 p-0 shadow-sm transition-colors duration-200 hover:border-primary/25 dark:hover:bg-card">
                  <CardContent
                    className={cn(
                      "min-w-0 space-y-2",
                      compactInfoPage ? "p-4" : "p-3 sm:p-3.5",
                    )}
                  >
                    {itemLabel ? (
                      <p
                        className={`${wrappingTextClass} text-xs font-medium text-muted-foreground`}
                      >
                        {itemLabel}
                      </p>
                    ) : null}
                    {itemTitle && itemTitle !== itemValue ? (
                      <p
                        className={`${wrappingTextClass} text-sm font-semibold leading-5`}
                      >
                        {itemTitle}
                      </p>
                    ) : null}
                    {itemValue ? (
                      <p
                        className={`${wrappingTextClass} text-sm font-semibold leading-5`}
                      >
                        {itemValue}
                      </p>
                    ) : null}
                    {itemBody ? (
                      <p
                        className={`${wrappingTextClass} text-xs leading-5 text-muted-foreground`}
                      >
                        {itemBody}
                      </p>
                    ) : null}
                    {itemHref ? (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className={`w-full rounded-sm text-xs transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 sm:w-auto ${compactButtonClass}`}
                      >
                        <Link href={itemHref}>
                          {itemLabel || (locale === "bn" ? "খুলুন" : "Open")}
                        </Link>
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              </MarketingHoverSurface>
            );
          })}
        </div>
        {ctaLabel && resolvedCtaHref ? (
          <MarketingReveal delay={0.08}>
            <Button
              asChild
              size="lg"
              className={`w-full transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto ${primaryButtonClass}`}
            >
              <Link href={resolvedCtaHref}>{ctaLabel}</Link>
            </Button>
          </MarketingReveal>
        ) : null}
      </div>
    );
  }

  return null;
}

function SectionHeading({
  eyebrow,
  title,
  body,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  compact?: boolean;
}) {
  return (
    <MarketingReveal
      className={cn("min-w-0 max-w-3xl", compact ? "space-y-2.5" : "space-y-3")}
    >
      {eyebrow ? (
        <p
          className={`${wrappingTextClass} text-xs uppercase tracking-[0.16em] text-primary sm:tracking-[0.24em] dark:[color:color-mix(in_oklch,var(--foreground)_68%,var(--primary))]`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          wrappingTextClass,
          "font-semibold leading-[1.18] tracking-tight",
          compact
            ? "text-2xl sm:text-3xl xl:text-4xl"
            : "text-2xl sm:text-3xl md:text-4xl",
        )}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={`${wrappingTextClass} text-base leading-7 text-muted-foreground`}
        >
          {body}
        </p>
      ) : null}
    </MarketingReveal>
  );
}
