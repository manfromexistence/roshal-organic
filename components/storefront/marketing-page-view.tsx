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
import { cn } from "@/lib/utils";

const primaryButtonClass =
  "h-auto min-h-10 max-w-full whitespace-normal px-4 py-2 text-center leading-5 sm:px-6";

const wrappingTextClass = "break-words [overflow-wrap:anywhere]";

function isCompactMarketingPage(slug: string) {
  return slug === "about" || slug === "contact";
}

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
  const compactInfoPage = isCompactMarketingPage(page.slug);

  return (
    <div
      className={cn(
        "min-w-0 overflow-x-clip",
        compactInfoPage ? "pb-6 sm:pb-8" : "pb-10",
      )}
    >
      {!hasPrimaryHero ? (
        <section
          className={cn(
            "overflow-x-clip",
            compactInfoPage ? "py-6 sm:py-8 lg:py-10" : "py-8 md:py-12",
          )}
        >
          <div className="container mx-auto min-w-0 px-4 sm:px-6 md:px-8">
            <MarketingReveal
              className={cn(
                "grid min-w-0 items-center overflow-hidden border border-border/60 bg-gradient-to-br from-background via-background to-muted/50 shadow-sm lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]",
                compactInfoPage
                  ? "gap-5 rounded-xl p-4 sm:p-5 md:gap-6 lg:p-8"
                  : "gap-6 rounded-2xl p-4 sm:p-6 md:gap-8 lg:p-10",
              )}
            >
              <div
                className={cn(
                  "min-w-0",
                  compactInfoPage ? "space-y-4" : "space-y-5",
                )}
              >
                <p
                  className={`${wrappingTextClass} text-xs uppercase tracking-[0.16em] text-primary sm:tracking-[0.24em] dark:[color:color-mix(in_oklch,var(--foreground)_68%,var(--primary))]`}
                >
                  {getLocalizedValue(locale, page.navigationLabel)}
                </p>
                <h1
                  className={cn(
                    wrappingTextClass,
                    "max-w-3xl font-semibold leading-[1.16] tracking-tight text-foreground",
                    compactInfoPage
                      ? "text-3xl sm:text-4xl xl:text-5xl"
                      : "text-3xl sm:text-4xl md:text-5xl",
                  )}
                >
                  {getLocalizedValue(locale, page.title)}
                </h1>
                {getLocalizedValue(locale, page.description) ? (
                  <p
                    className={`${wrappingTextClass} max-w-2xl text-base leading-7 text-muted-foreground md:text-lg`}
                  >
                    {getLocalizedValue(locale, page.description)}
                  </p>
                ) : null}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    asChild
                    size="lg"
                    className={`w-full transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto ${primaryButtonClass}`}
                  >
                    <Link href={siteSettings.primaryCtaHref}>
                      {getLocalizedValue(locale, siteSettings.primaryCtaLabel)}
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
              {page.heroImage ? (
                <MarketingMediaSurface
                  className={cn(
                    "relative overflow-hidden rounded-xl border bg-muted",
                    compactInfoPage
                      ? "min-h-48 sm:min-h-60 lg:min-h-72"
                      : "min-h-56 sm:min-h-72 md:min-h-80 md:rounded-[1.5rem]",
                  )}
                >
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
