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

const spacingMap: Record<string, string> = {
  compact: "py-10",
  comfortable: "py-16",
  spacious: "py-24",
};

const columnsMap: Record<string, string> = {
  "2": "grid-cols-1 md:grid-cols-2",
  "3": "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  "5": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

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

function resolveSectionColumns(section: RoshalMarketingSection) {
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

  return (
    <>
      {sortedSections.map((section) => (
        <section
          key={section.id}
          className={`${spacingMap[siteSettings.sectionSpacing] || spacingMap.comfortable} ${
            section.variant === "muted" ? "bg-muted/35" : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4">
            <SectionContent
              section={section}
              locale={locale}
              products={products}
              siteSettings={siteSettings}
              page={section.id === primarySectionId ? page : undefined}
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
}: {
  section: RoshalMarketingSection;
  locale: RoshalLocale;
  products: RoshalProduct[];
  siteSettings: RoshalSiteSettings;
  page?: RoshalMarketingPage;
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
  const sectionColumns = resolveSectionColumns(section);

  if (section.type === "hero" || section.type === "story") {
    return (
      <MarketingReveal
        className={`grid items-center gap-8 rounded-[2rem] border border-border/60 bg-gradient-to-br from-background via-background to-muted/60 p-6 shadow-sm lg:p-10 ${
          siteSettings.heroLayout === "split"
            ? "lg:grid-cols-[1.1fr_0.9fr]"
            : "mx-auto max-w-4xl"
        }`}
      >
        <div className="space-y-5">
          {heroEyebrow ? (
            <p className="text-xs uppercase tracking-[0.24em] text-primary dark:[color:color-mix(in_oklch,var(--foreground)_68%,var(--primary))]">
              {heroEyebrow}
            </p>
          ) : null}
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {heroTitle}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {heroBody}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="transition-transform duration-200 hover:-translate-y-0.5"
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
              className="transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
            >
              <Link href="/contact">
                {locale === "bn" ? "যোগাযোগ করুন" : "Contact us"}
              </Link>
            </Button>
          </div>
        </div>
        {heroImage ? (
          <MarketingMediaSurface className="relative min-h-80 overflow-hidden rounded-[1.5rem] border bg-muted">
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
      <div className="space-y-8">
        <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        <div className={`grid gap-4 ${sectionColumns}`}>
          {section.items.map((item, index) => {
            const itemTitle = resolveLocalizedItemValue(locale, item.title);
            const itemBody = resolveLocalizedItemValue(locale, item.body);
            const itemLabel = resolveLocalizedItemValue(locale, item.label);

            return (
              <MarketingHoverSurface
                key={`${section.id}-${index}`}
                delay={index * 0.04}
              >
                <Card className="overflow-hidden border-border/60 bg-card/95 shadow-sm transition-colors duration-200 hover:border-primary/25 dark:hover:bg-card">
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
                  <CardContent className="space-y-3 p-6">
                    {itemLabel ? (
                      <Badge variant="secondary">{itemLabel}</Badge>
                    ) : null}
                    {itemTitle ? (
                      <h3 className="text-lg font-semibold">{itemTitle}</h3>
                    ) : null}
                    {itemBody ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {itemBody}
                      </p>
                    ) : null}
                    {item.value ? (
                      <p className="text-lg font-semibold text-primary">
                        {item.value}
                      </p>
                    ) : null}
                    {item.href ? (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
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
              className="transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
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
      <div className="space-y-8">
        <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        <MarketingReveal className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
              className="transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
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
      <div className="space-y-8">
        <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        <div className={`grid gap-4 ${sectionColumns}`}>
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
                delay={index * 0.04}
              >
                <Card className="border-border/60 bg-card/95 shadow-sm transition-colors duration-200 hover:border-primary/25 dark:hover:bg-card">
                  <CardContent className="space-y-3 p-5">
                    {itemLabel ? (
                      <p className="text-sm font-medium text-muted-foreground">
                        {itemLabel}
                      </p>
                    ) : null}
                    {itemTitle && itemTitle !== itemValue ? (
                      <p className="text-lg font-semibold">{itemTitle}</p>
                    ) : null}
                    {itemValue ? (
                      <p className="text-lg font-semibold">{itemValue}</p>
                    ) : null}
                    {itemBody ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {itemBody}
                      </p>
                    ) : null}
                    {itemHref ? (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
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
              className="transition-transform duration-200 hover:-translate-y-0.5"
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
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <MarketingReveal className="max-w-3xl space-y-3">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.24em] text-primary dark:[color:color-mix(in_oklch,var(--foreground)_68%,var(--primary))]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {body ? (
        <p className="text-base leading-7 text-muted-foreground">{body}</p>
      ) : null}
    </MarketingReveal>
  );
}
