import { IconBrandFacebook, IconBrandWhatsapp } from "@tabler/icons-react";
import { Mail, MapPin, Phone } from "lucide-react";
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
  categoryLinks: _categoryLinks,
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
      <div className="container mx-auto space-y-2 px-4 py-2 sm:px-6 md:px-8">
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border/70 bg-background shadow-sm">
                <Image
                  src="/apple-touch-icon.png"
                  alt={siteSettings.brandName}
                  width={42}
                  height={42}
                  className="h-9 w-9 rounded-md object-contain"
                />
              </div>
              <div className="space-y-0">
                <p className="font-wordmark text-[15px] text-foreground">
                  {siteSettings.brandName}
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-xs leading-5 text-muted-foreground">
              {locale === "bn"
                ? "খাঁটি মধু, ঘি, তেল, গুড়, ফল এবং দৈনন্দিন অর্গানিক প্রয়োজনীয় পণ্য এখন এক জায়গায়।"
                : "Pure honey, ghee, oils, jaggery, fruit, and trusted organic essentials in one storefront."}
            </p>

            <div className="space-y-1 text-xs text-muted-foreground">
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

            <div className="flex flex-wrap gap-1.5">
              <Link
                href={whatsappHref}
                className="inline-flex items-center gap-2 rounded-sm border border-transparent bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/18"
              >
                <IconBrandWhatsapp className="size-4" />
                {locale === "bn" ? "WhatsApp" : "WhatsApp"}
              </Link>
              {siteSettings.facebookUrl ? (
                <Link
                  href={siteSettings.facebookUrl}
                  className="inline-flex items-center gap-2 rounded-sm border border-transparent bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/18"
                >
                  <IconBrandFacebook className="size-4" />
                  Facebook
                </Link>
              ) : null}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">
              {locale === "bn" ? "তথ্য" : "Information"}
            </h3>
            <div className="space-y-1 text-xs text-muted-foreground">
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

          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">
              {locale === "bn" ? "সাপোর্ট" : "Support"}
            </h3>
            <div className="space-y-1 text-xs text-muted-foreground">
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

        <div className="flex flex-col gap-1 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {siteSettings.brandName}.{" "}
            {locale === "bn" ? "সর্বস্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/track-order"
              className="transition-colors hover:text-primary"
            >
              {locale === "bn" ? "অর্ডার ট্র্যাক" : "Track order"}
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
