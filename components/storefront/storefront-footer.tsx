import Image from "next/image";
import Link from "next/link";
import { getLocalizedValue } from "@/lib/store-locale";
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
  { src: "/logos/bashundharagroup-com.png", alt: "Bashundhara Group" },
  { src: "/logos/navana-com.png", alt: "Navana" },
  { src: "/logos/ab-group-com.png", alt: "AB Group" },
  { src: "/logos/confidencegroup-com-bd.png", alt: "Confidence Group" },
  { src: "/logos/beximco-pharma-com.png", alt: "Beximco Pharma" },
  { src: "/logos/squarepharma-com-bd.png", alt: "Square Pharma" },
  { src: "/logos/lifeline-com-bd.png", alt: "Lifeline" },
  { src: "/logos/desco-org-bd.png", alt: "DESCO" },
  { src: "/logos/bpdb-gov-bd.png", alt: "BPDB" },
];

export function StorefrontFooter({
  locale,
  pages,
  paymentOptions: _paymentOptions,
  siteSettings,
}: {
  locale: RoshalLocale;
  pages: RoshalMarketingPage[];
  paymentOptions: RoshalPaymentOption[];
  siteSettings: RoshalSiteSettings;
}) {
  const whatsappDigits = siteSettings.whatsappPhone.replace(/\D/g, "");
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}`
    : `tel:${siteSettings.contactPhone}`;

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt={siteSettings.brandName}
                width={32}
                height={32}
                className="h-8 w-auto rounded-md"
              />
              <span className="font-bold text-foreground">
                {siteSettings.brandName}
              </span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              {getLocalizedValue(locale, siteSettings.tagline)}
            </p>
            <p className="text-sm text-muted-foreground">
              {locale === "bn"
                ? "আমরা প্রতিশ্রুতি দিচ্ছি সেরা মানের পণ্য সরবরাহ করার।"
                : "We are committed to delivering the highest quality products."}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {locale === "bn" ? "দ্রুত লিংক" : "Quick Links"}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  {locale === "bn" ? "হোম" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition-colors hover:text-primary"
                >
                  {locale === "bn" ? "পণ্যসমূহ" : "Products"}
                </Link>
              </li>
              {pages
                .filter((page) => page.slug !== "home")
                .map((page) => (
                  <li key={page.id}>
                    <Link
                      href={`/${page.slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {getLocalizedValue(locale, page.navigationLabel)}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {locale === "bn" ? "যোগাযোগ তথ্য" : "Contact Info"}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{getLocalizedValue(locale, siteSettings.address)}</li>
              <li>{siteSettings.contactPhone}</li>
              <li>{siteSettings.contactEmail}</li>
              <li>{siteSettings.whatsappPhone}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {locale === "bn" ? "কাস্টমার কেয়ার" : "Customer Care"}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={`tel:${siteSettings.contactPhone}`}
                  className="transition-colors hover:text-primary"
                >
                  {locale === "bn"
                    ? `অর্ডার সহায়তা: ${siteSettings.contactPhone}`
                    : `Order support: ${siteSettings.contactPhone}`}
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="transition-colors hover:text-primary"
                >
                  {locale === "bn"
                    ? "ইমেইলে যোগাযোগ করুন"
                    : "Email customer support"}
                </Link>
              </li>
              <li>
                <Link
                  href={whatsappHref}
                  className="transition-colors hover:text-primary"
                >
                  {locale === "bn"
                    ? "হোয়াটসঅ্যাপে অর্ডার আপডেট নিন"
                    : "Get order updates on WhatsApp"}
                </Link>
              </li>
              <li>
                <Link
                  href={siteSettings.primaryCtaHref}
                  className="transition-colors hover:text-primary"
                >
                  {getLocalizedValue(locale, siteSettings.primaryCtaLabel)}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <h3 className="mb-4 text-center font-semibold text-foreground">
            {locale === "bn"
              ? "পেমেন্ট পার্টনার ও বিশ্বস্ত কোম্পানি"
              : "Payment Partners & Trusted Companies"}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {partnerLogos.map((logo) => (
              <div
                key={logo.src}
                className="flex h-10 min-w-24 items-center justify-center rounded-xl border border-border/60 bg-background/70 px-3 py-2"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2026 {siteSettings.brandName}.{" "}
            {locale === "bn" ? "সর্বস্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
