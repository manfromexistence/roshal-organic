import { Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLocalizedValue, localizedValue } from "@/lib/store-locale";
import type { StorefrontFooterCategoryLink } from "@/lib/store-taxonomy";
import type {
  RoshalLocale,
  RoshalMarketingPage,
  RoshalPaymentOption,
  RoshalSiteSettings,
} from "@/lib/store-types";

const partnerLogos = [
  { src: "/logos/bkash-com.png", alt: "bKash" },
  { src: "/logos/nagad-com-bd.png", alt: "Nagad" },
  { src: "/logos/bracbank-com.png", alt: "BRAC Bank" },
  { src: "/logos/sonali-bank-com.png", alt: "Sonali Bank" },
  { src: "/logos/janatabank-bd-com.png", alt: "Janata Bank" },
  { src: "/logos/bdpost-gov-bd.png", alt: "BD Post" },
  { src: "/logos/btrc-gov-bd.png", alt: "BTRC" },
  { src: "/logos/grameen-com.png", alt: "Grameen" },
  { src: "/logos/beximco-com.png", alt: "Beximco" },
  { src: "/logos/pran-rfl-com.png", alt: "PRAN-RFL" },
  { src: "/logos/partexstar-com.png", alt: "Partex Star" },
  { src: "/logos/mohammadi-group-com.png", alt: "Mohammadi Group" },
];

const infoPageSlugs = [
  "about",
  "contact",
  "company-information",
  "roshal-stories",
  "terms-and-conditions",
  "privacy-policy",
  "careers",
] as const;

const supportLinkConfig = [
  {
    href: "/orders",
    fallbackLabel: localizedValue("অর্ডার ট্র্যাকিং", "Order Tracking"),
  },
  {
    slug: "support-center",
    fallbackLabel: localizedValue("সাপোর্ট সেন্টার", "Support Center"),
  },
  {
    slug: "how-to-order",
    fallbackLabel: localizedValue("কিভাবে অর্ডার করবেন", "How to Order"),
  },
  {
    slug: "payment",
    fallbackLabel: localizedValue("পেমেন্ট", "Payment"),
  },
  {
    slug: "shipping",
    fallbackLabel: localizedValue("শিপিং", "Shipping"),
  },
  {
    slug: "faq",
    fallbackLabel: localizedValue("প্রশ্নোত্তর", "FAQ"),
  },
  {
    slug: "pre-order",
    fallbackLabel: localizedValue("প্রি-অর্ডার", "Pre-Order"),
  },
] as const;

const policyLinkConfig = [
  {
    slug: "happy-return",
    fallbackLabel: localizedValue("হ্যাপি রিটার্ন", "Happy Return"),
  },
  {
    slug: "refund-policy",
    fallbackLabel: localizedValue("রিফান্ড নীতি", "Refund Policy"),
  },
  {
    slug: "cancellation",
    fallbackLabel: localizedValue("ক্যানসেলেশন", "Cancellation"),
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

function resolveStaticLink(item: {
  href: string;
  fallbackLabel: ReturnType<typeof localizedValue>;
}) {
  return {
    href: item.href,
    label: item.fallbackLabel,
  };
}

export function StorefrontFooter({
  locale,
  pages,
  paymentOptions,
  siteSettings,
  categoryLinks,
}: {
  locale: RoshalLocale;
  pages: RoshalMarketingPage[];
  paymentOptions: RoshalPaymentOption[];
  siteSettings: RoshalSiteSettings;
  categoryLinks: StorefrontFooterCategoryLink[];
}) {
  const whatsappDigits = siteSettings.whatsappPhone.replace(/\D/g, "");
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}`
    : `tel:${siteSettings.contactPhone}`;
  const informationalPages = infoPageSlugs
    .map((slug) =>
      pages.find((page) => page.slug === slug && page.status === "published"),
    )
    .filter(Boolean) as RoshalMarketingPage[];
  const supportLinks = supportLinkConfig.map((item) =>
    "slug" in item
      ? resolvePageLink(pages, item.slug, item.fallbackLabel)
      : resolveStaticLink(item),
  );
  const policyLinks = policyLinkConfig.map((item) =>
    resolvePageLink(pages, item.slug, item.fallbackLabel),
  );
  const enabledPayments = paymentOptions
    .filter((option) => option.enabled)
    .sort((left, right) => left.sortOrder - right.sortOrder);

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto space-y-8 px-4 py-8 sm:py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.35fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-4 sm:space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 bg-card shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl">
                <Image
                  src="/logo.png"
                  alt={siteSettings.brandName}
                  width={42}
                  height={42}
                  className="h-8 w-auto object-contain sm:h-10"
                />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground sm:text-xl">
                  {siteSettings.brandName}
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {getLocalizedValue(locale, siteSettings.tagline)}
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-xs leading-6 text-muted-foreground sm:text-sm sm:leading-7">
              {locale === "bn"
                ? "প্রাকৃতিক মধু, তেল, ঘি, গুড়, ফল এবং বিশ্বস্ত অর্গানিক প্রয়োজনীয় সব পণ্য এখন এক জায়গায়।"
                : "Natural honey, oils, ghee, jaggery, fruit, and trusted organic essentials in one storefront."}
            </p>

            <div className="space-y-2 text-xs text-muted-foreground sm:space-y-3 sm:text-sm">
              <Link
                href={`tel:${siteSettings.contactPhone}`}
                className="flex items-center gap-2 sm:gap-3 transition-colors hover:text-primary"
              >
                <Phone className="size-3.5 sm:size-4" />
                <span>{siteSettings.contactPhone}</span>
              </Link>
              <Link
                href={`mailto:${siteSettings.contactEmail}`}
                className="flex items-center gap-2 sm:gap-3 transition-colors hover:text-primary"
              >
                <Mail className="size-3.5 sm:size-4" />
                <span>{siteSettings.contactEmail}</span>
              </Link>
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="mt-0.5 size-3.5 shrink-0 sm:size-4" />
                <span>{getLocalizedValue(locale, siteSettings.address)}</span>
              </div>
              <Link
                href={whatsappHref}
                className="flex items-center gap-2 sm:gap-3 transition-colors hover:text-primary"
              >
                <MessageCircle className="size-3.5 sm:size-4" />
                <span>{siteSettings.whatsappPhone}</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground sm:text-lg">
              {locale === "bn" ? "তথ্য" : "Information"}
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground sm:space-y-3 sm:text-sm">
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
            <h3 className="text-base font-semibold text-foreground sm:text-lg">
              {locale === "bn" ? "ক্যাটাগরি" : "Shop By"}
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground sm:space-y-3 sm:text-sm">
              {categoryLinks.map((link) => (
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
            <h3 className="text-base font-semibold text-foreground sm:text-lg">
              {locale === "bn" ? "সাপোর্ট" : "Support"}
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground sm:space-y-3 sm:text-sm">
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

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground sm:text-lg">
              {locale === "bn" ? "গ্রাহক নীতি" : "Consumer Policy"}
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground sm:space-y-3 sm:text-sm">
              {policyLinks.map((link) => (
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

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                {locale === "bn"
                  ? "সক্রিয় পেমেন্ট অপশন"
                  : "Active payment options"}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {enabledPayments.map((option) => (
                <Badge
                  key={option.key}
                  variant="secondary"
                  className="rounded-full px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
                >
                  {getLocalizedValue(locale, option.label)}
                </Badge>
              ))}
            </div>
            <p className="text-xs leading-6 text-muted-foreground sm:text-sm sm:leading-7">
              {locale === "bn"
                ? "ম্যানুয়াল ভেরিফিকেশন এবং সিকিউর গেটওয়ে – দুই ধরনের পেমেন্ট ফ্লোই এই স্টোরফ্রন্টে সমর্থিত।"
                : "Manual verification and secure gateway payment paths are both supported for checkout."}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground sm:text-base">
              {locale === "bn"
                ? "পেমেন্ট পার্টনার ও বিশ্বস্ত প্রতিষ্ঠান"
                : "Payment Partners & Trusted Companies"}
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6 xl:grid-cols-4">
              {partnerLogos.map((logo) => (
                <div
                  key={logo.src}
                  className="flex h-16 items-center justify-center rounded-xl border border-border/70 bg-card px-2 shadow-sm sm:h-20 sm:rounded-2xl sm:px-4"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={132}
                    height={42}
                    className="rounded-md h-8 w-auto object-contain opacity-85 sm:h-10"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:text-sm md:items-center md:justify-between md:text-left">
          <p>
            © 2026 {siteSettings.brandName}.{" "}
            {locale === "bn" ? "সর্বস্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end sm:gap-4">
            <Link
              href="/products"
              className="transition-colors hover:text-primary"
            >
              {locale === "bn" ? "পণ্যসমূহ" : "Products"}
            </Link>
            <Link
              href="/orders"
              className="transition-colors hover:text-primary"
            >
              {locale === "bn" ? "অর্ডার ট্র্যাকিং" : "Order Tracking"}
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
