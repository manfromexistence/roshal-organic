import Link from "next/link";
import { getLocalizedValue } from "@/lib/roshal/locale";
import type {
  RoshalLocale,
  RoshalMarketingPage,
  RoshalSiteSettings,
} from "@/lib/roshal/types";

export function StorefrontFooter({
  locale,
  pages,
  siteSettings,
}: {
  locale: RoshalLocale;
  pages: RoshalMarketingPage[];
  siteSettings: RoshalSiteSettings;
}) {
  return (
    <footer className="border-t border-border/70 bg-muted/35">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-[1.3fr,1fr,1fr]">
        <div className="space-y-3">
          <p className="text-xl font-semibold">{siteSettings.brandName}</p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            {getLocalizedValue(locale, siteSettings.tagline)}
          </p>
          <p className="text-sm text-muted-foreground">
            {siteSettings.contactPhone}
          </p>
          <p className="text-sm text-muted-foreground">
            {siteSettings.contactEmail}
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {locale === "bn" ? "নেভিগেশন" : "Navigation"}
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" className="hover:text-primary">
              {locale === "bn" ? "হোম" : "Home"}
            </Link>
            <Link href="/products" className="hover:text-primary">
              {locale === "bn" ? "পণ্য" : "Products"}
            </Link>
            {pages
              .filter((page) => page.slug !== "home")
              .map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="hover:text-primary"
                >
                  {getLocalizedValue(locale, page.navigationLabel)}
                </Link>
              ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {locale === "bn" ? "যোগাযোগ" : "Contact"}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {getLocalizedValue(locale, siteSettings.address)}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {locale === "bn"
              ? "অর্ডার, সহায়তা বা পাইকারি জিজ্ঞাসার জন্য কল, ইমেইল বা হোয়াটসঅ্যাপে যোগাযোগ করুন।"
              : "Reach out over phone, email, or WhatsApp for orders, support, or wholesale inquiries."}
          </p>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 {siteSettings.brandName}.{" "}
            {locale === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
          <p>{siteSettings.whatsappPhone}</p>
        </div>
      </div>
    </footer>
  );
}
