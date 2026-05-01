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

const wrappingTextClass = "break-words [overflow-wrap:anywhere]";

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
    <footer className="min-w-0 overflow-x-clip border-t border-primary-foreground/12 bg-primary pb-20 text-primary-foreground md:pb-6">
      <div className="container mx-auto space-y-2 px-4 pt-3 pb-4 sm:px-6 md:px-8 md:py-4">
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)_minmax(0,0.75fr)]">
          <div className="min-w-0 space-y-2">
            <Link
              href="/"
              className="inline-flex max-w-full min-w-0 items-center gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-primary-foreground/18 bg-primary-foreground/10 shadow-sm">
                <Image
                  src="/apple-touch-icon.png"
                  alt={siteSettings.brandName}
                  width={42}
                  height={42}
                  className="h-9 w-9 rounded-md object-contain"
                />
              </div>
              <div className="min-w-0 space-y-0">
                <p
                  className={`${wrappingTextClass} font-wordmark text-[15px] text-primary-foreground`}
                >
                  {siteSettings.brandName}
                </p>
              </div>
            </Link>

            <p
              className={`${wrappingTextClass} max-w-sm text-xs leading-5 text-primary-foreground/80`}
            >
              {locale === "bn"
                ? "খাঁটি মধু, ঘি, তেল, গুড় ও অর্গানিক পণ্য।"
                : "Pure honey, ghee, oils, jaggery, and organic essentials."}
            </p>

            <div className="min-w-0 space-y-1 text-xs text-primary-foreground/80">
              <Link
                href={`tel:${siteSettings.contactPhone}`}
                className="flex min-w-0 items-center gap-2 transition-colors hover:text-primary-foreground"
              >
                <Phone className="size-4 shrink-0" />
                <span className={wrappingTextClass}>
                  {siteSettings.contactPhone}
                </span>
              </Link>
              <Link
                href={`mailto:${siteSettings.contactEmail}`}
                className="flex min-w-0 items-center gap-2 transition-colors hover:text-primary-foreground"
              >
                <Mail className="size-4 shrink-0" />
                <span className={wrappingTextClass}>
                  {siteSettings.contactEmail}
                </span>
              </Link>
              <div className="flex min-w-0 items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span className={wrappingTextClass}>
                  {getLocalizedValue(locale, siteSettings.address)}
                </span>
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap gap-1.5">
              <Link
                href={whatsappHref}
                className={`inline-flex max-w-full items-center gap-2 rounded-sm border border-primary-foreground/10 bg-primary-foreground/12 px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20 ${wrappingTextClass}`}
              >
                <IconBrandWhatsapp className="size-4 shrink-0" />
                {locale === "bn" ? "WhatsApp" : "WhatsApp"}
              </Link>
              {siteSettings.facebookUrl ? (
                <Link
                  href={siteSettings.facebookUrl}
                  className={`inline-flex max-w-full items-center gap-2 rounded-sm border border-primary-foreground/10 bg-primary-foreground/12 px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20 ${wrappingTextClass}`}
                >
                  <IconBrandFacebook className="size-4 shrink-0" />
                  Facebook
                </Link>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 space-y-1">
            <h3
              className={`${wrappingTextClass} text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/80 sm:tracking-[0.18em]`}
            >
              {locale === "bn" ? "তথ্য" : "Information"}
            </h3>
            <div className="min-w-0 space-y-1 text-xs text-primary-foreground/80">
              {informationalPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className={`${wrappingTextClass} block transition-colors hover:text-primary-foreground`}
                >
                  {getLocalizedValue(locale, page.navigationLabel)}
                </Link>
              ))}
            </div>
          </div>

          <div className="min-w-0 space-y-1">
            <h3
              className={`${wrappingTextClass} text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/80 sm:tracking-[0.18em]`}
            >
              {locale === "bn" ? "সাপোর্ট" : "Support"}
            </h3>
            <div className="min-w-0 space-y-1 text-xs text-primary-foreground/80">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${wrappingTextClass} block transition-colors hover:text-primary-foreground`}
                >
                  {getLocalizedValue(locale, link.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-primary-foreground/12" />

        <div className="flex min-w-0 flex-col gap-1 text-[11px] text-primary-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p className={wrappingTextClass}>
            © 2026 {siteSettings.brandName}.{" "}
            {locale === "bn" ? "সর্বস্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
          <div className="flex min-w-0 flex-wrap gap-3">
            <Link
              href="/track-order"
              className={`${wrappingTextClass} transition-colors hover:text-primary-foreground`}
            >
              {locale === "bn" ? "অর্ডার ট্র্যাক" : "Track order"}
            </Link>
            <Link
              href="/contact"
              className={`${wrappingTextClass} transition-colors hover:text-primary-foreground`}
            >
              {locale === "bn" ? "যোগাযোগ" : "Contact"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
