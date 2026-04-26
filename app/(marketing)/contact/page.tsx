import { notFound } from "next/navigation";
import { RoshalMarketingPageView } from "@/components/storefront/marketing-page-view";
import {
  getRoshalPageBundle,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { buildRoshalMarketingMetadata } from "@/lib/store-seo";

export async function generateMetadata() {
  const [locale, pageBundle] = await Promise.all([
    getRoshalLocale(),
    getRoshalPageBundle("contact"),
  ]);

  if (!pageBundle) {
    return undefined;
  }

  return buildRoshalMarketingMetadata(pageBundle.page, locale);
}

export default async function ContactPage() {
  const [locale, siteSettings, pageBundle, products] = await Promise.all([
    getRoshalLocale(),
    getRoshalSiteSettings(),
    getRoshalPageBundle("contact"),
    getRoshalProducts(),
  ]);

  if (!pageBundle) {
    notFound();
  }

  return (
    <RoshalMarketingPageView
      locale={locale}
      page={pageBundle.page}
      sections={pageBundle.sections}
      products={products}
      siteSettings={siteSettings}
    />
  );
}
