import { notFound, redirect } from "next/navigation";
import { RoshalMarketingPageView } from "@/components/roshal/storefront/marketing-page-view";
import {
  getRoshalPageBundle,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import { buildRoshalMarketingMetadata } from "@/lib/roshal/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getRoshalLocale()]);

  if (slug === "home") {
    return undefined;
  }

  const pageBundle = await getRoshalPageBundle(slug);

  if (!pageBundle) {
    return undefined;
  }

  return buildRoshalMarketingMetadata(pageBundle.page, locale);
}

export default async function MarketingContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale, siteSettings, products] = await Promise.all([
    params,
    getRoshalLocale(),
    getRoshalSiteSettings(),
    getRoshalProducts(),
  ]);

  if (slug === "home") {
    redirect("/");
  }

  const pageBundle = await getRoshalPageBundle(slug);

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
