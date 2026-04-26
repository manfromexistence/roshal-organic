import { notFound } from "next/navigation";
import { RoshalMarketingPageView } from "@/components/roshal/storefront/marketing-page-view";
import {
  getFeaturedRoshalProducts,
  getRoshalPageBundle,
  getRoshalSiteSettings,
} from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import { buildRoshalMarketingMetadata } from "@/lib/roshal/seo";

export async function generateMetadata() {
  const [locale, pageBundle] = await Promise.all([
    getRoshalLocale(),
    getRoshalPageBundle("about"),
  ]);

  if (!pageBundle) {
    return undefined;
  }

  return buildRoshalMarketingMetadata(pageBundle.page, locale);
}

export default async function AboutPage() {
  const [locale, siteSettings, pageBundle, featuredProducts] =
    await Promise.all([
      getRoshalLocale(),
      getRoshalSiteSettings(),
      getRoshalPageBundle("about"),
      getFeaturedRoshalProducts(4),
    ]);

  if (!pageBundle) {
    notFound();
  }

  return (
    <RoshalMarketingPageView
      locale={locale}
      page={pageBundle.page}
      sections={pageBundle.sections}
      featuredProducts={featuredProducts}
      siteSettings={siteSettings}
    />
  );
}
