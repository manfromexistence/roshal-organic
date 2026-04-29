import Image from "next/image";
import Link from "next/link";
import {
  MarketingMediaSurface,
  MarketingReveal,
} from "@/components/storefront/marketing-motion";
import { RoshalSectionRenderer } from "@/components/storefront/section-renderer";
import { Button } from "@/components/ui/button";
import { getLocalizedValue } from "@/lib/store-locale";
import type {
  RoshalLocale,
  RoshalMarketingPage,
  RoshalMarketingSection,
  RoshalProduct,
  RoshalSiteSettings,
} from "@/lib/store-types";

export function RoshalMarketingPageView({
  locale,
  page,
  sections,
  products,
  siteSettings,
}: {
  locale: RoshalLocale;
  page: RoshalMarketingPage;
  sections: RoshalMarketingSection[];
  products: RoshalProduct[];
  siteSettings: RoshalSiteSettings;
}) {
  const hasPrimaryHero = sections.some(
    (section) => section.type === "hero" || section.type === "story",
  );

  return (
    <div className="pb-10">
      {!hasPrimaryHero ? (
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <MarketingReveal className="grid items-center gap-8 rounded-[2rem] border border-border/60 bg-gradient-to-br from-background via-background to-muted/50 p-6 shadow-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.24em] text-primary dark:[color:color-mix(in_oklch,var(--foreground)_68%,var(--primary))]">
                  {getLocalizedValue(locale, page.navigationLabel)}
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {getLocalizedValue(locale, page.title)}
                </h1>
                {getLocalizedValue(locale, page.description) ? (
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                    {getLocalizedValue(locale, page.description)}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <Link href={siteSettings.primaryCtaHref}>
                      {getLocalizedValue(locale, siteSettings.primaryCtaLabel)}
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
              {page.heroImage ? (
                <MarketingMediaSurface className="relative min-h-80 overflow-hidden rounded-[1.5rem] border bg-muted">
                  <Image
                    src={page.heroImage}
                    alt={getLocalizedValue(locale, page.title)}
                    fill
                    priority
                    loading="eager"
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </MarketingMediaSurface>
              ) : null}
            </MarketingReveal>
          </div>
        </section>
      ) : null}

      <RoshalSectionRenderer
        locale={locale}
        page={page}
        siteSettings={siteSettings}
        sections={sections}
        products={products}
      />
    </div>
  );
}
