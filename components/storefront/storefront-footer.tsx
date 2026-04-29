import { Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getWhatsAppHref } from "@/lib/store-contact";
import { getLocalizedValue, localizedValue } from "@/lib/store-locale";
import type { StorefrontFooterCategoryLink } from "@/lib/store-taxonomy";
import type {
  RoshalLocale,
  RoshalMarketingPage,
  RoshalSiteSettings,
} from "@/lib/store-types";

const infoPageSlugs = [
  "about",
  "contact",
  "company-information",
  "privacy-policy",
  "terms-and-conditions",
] as const;

const supportLinkConfig = [
  {
    href: "/track-order",
    fallbackLabel: localizedValue("অর্ডার ট্র্যাকিং", "Track order"),
  },
  {
    slug: "support-center",
    fallbackLabel: localizedValue("সাপোর্ট সেন্টার", "Support center"),
  },
  {
    slug: "faq",
    fallbackLabel: localizedValue("প্রশ্নোত্তর", "FAQ"),
  },
  {
    slug: "shipping",
    fallbackLabel: localizedValue("ডেলিভারি", "Delivery"),
  },
] as const;

function resolvePageLink(
  pages: RoshalMarketingPage[],
  slug: string,
  fallbackLabel: ReturnType<typeof localizedValue>,
) {
  const page = pages.find(
    (candidate) => candidate.slug === slug && candidate.status === "published",
  );

  return {
    href: `/${slug}`,
    label: page?.navigationLabel || fallbackLabel,
  };
}

export function StorefrontFooter({
  locale,
  pages,
  siteSettings,
  categoryLinks,
}: {
  locale: RoshalLocale;
  pages: RoshalMarketingPage[];
  siteSettings: RoshalSiteSettings;
  categoryLinks: StorefrontFooterCategoryLink[];
}) {
  const whatsappHref =
    getWhatsAppHref(siteSettings.whatsappPhone) ||
    `tel:${siteSettings.contactPhone}`;
  const informationalPages = infoPageSlugs
    .map((slug) =>
      pages.find((page) => page.slug === slug && page.status === "published"),
    )
    .filter(Boolean) as RoshalMarketingPage[];
  const supportLinks = supportLinkConfig.map((item) =>
    "slug" in item
      ? resolvePageLink(pages, item.slug, item.fallbackLabel)
      : { href: item.href, label: item.fallbackLabel },
  );

  return (
    <footer className="border-t border-border/60 bg-card/70 pb-16 md:pb-0">
      <div className="container mx-auto space-y-6 px-4 py-8 sm:px-6 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border/70 bg-background shadow-sm">
                <Image
                  src="/logo.png"
                  alt={siteSettings.brandName}
                  width={42}
                  height={42}
                  className="h-9 w-auto object-contain dark:hidden rounded-md"
                />
                <Image
                  src="/logo-light.png"
                  alt={siteSettings.brandName}
                  width={42}
                  height={42}
                  className="hidden h-9 w-auto object-contain dark:block rounded-md"
                />
              </div>
              <div className="space-y-1">
                <p className="font-wordmark text-xl text-foreground">
                  {siteSettings.brandName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getLocalizedValue(locale, siteSettings.tagline)}
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              {locale === "bn"
                ? "খাঁটি মধু, ঘি, তেল, গুড়, ফল এবং দৈনন্দিন অর্গানিক প্রয়োজনীয় পণ্য এখন এক জায়গায়।"
                : "Pure honey, ghee, oils, jaggery, fruit, and trusted organic essentials in one storefront."}
            </p>

            <div className="space-y-2 text-sm text-muted-foreground">
              <Link
                href={`tel:${siteSettings.contactPhone}`}
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="size-4" />
                <span>{siteSettings.contactPhone}</span>
              </Link>
              <Link
                href={`mailto:${siteSettings.contactEmail}`}
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="size-4" />
                <span>{siteSettings.contactEmail}</span>
              </Link>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{getLocalizedValue(locale, siteSettings.address)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={whatsappHref}
                className="inline-flex items-center gap-2 rounded-sm border border-border/70 bg-background px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:text-primary"
              >
                <MessageCircle className="size-4" />
                {locale === "bn" ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
              </Link>
              {siteSettings.facebookUrl ? (
                <Link
                  href={siteSettings.facebookUrl}
                  className="inline-flex items-center gap-2 rounded-sm border border-border/70 bg-background px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Globe className="size-4" />
                  Facebook
                </Link>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80">
              {locale === "bn" ? "তথ্য" : "Information"}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {informationalPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="block transition-colors hover:text-primary"
                >
                  {getLocalizedValue(locale, page.navigationLabel)}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80">
              {locale === "bn" ? "ক্যাটাগরি" : "Categories"}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {categoryLinks.slice(0, 6).map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="block transition-colors hover:text-primary"
                >
                  {getLocalizedValue(locale, link.label)}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80">
              {locale === "bn" ? "সাপোর্ট" : "Support"}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block transition-colors hover:text-primary"
                >
                  {getLocalizedValue(locale, link.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {siteSettings.brandName}.{" "}
            {locale === "bn" ? "সর্বস্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="transition-colors hover:text-primary"
            >
              {locale === "bn" ? "পণ্যসমূহ" : "Products"}
            </Link>
            <Link
              href="/track-order"
              className="transition-colors hover:text-primary"
            >
              {locale === "bn" ? "ট্র্যাক অর্ডার" : "Track order"}
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-primary"
            >
              {locale === "bn" ? "যোগাযোগ" : "Contact"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
