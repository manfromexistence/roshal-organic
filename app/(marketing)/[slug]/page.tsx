import { notFound, redirect } from "next/navigation";
import { RoshalMarketingPageView } from "@/components/storefront/marketing-page-view";
import {
  getRoshalPageBundle,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { buildRoshalMarketingMetadata } from "@/lib/store-seo";

const canonicalMarketingSlugs: Record<string, string> = {
  "about-us": "about",
  "contact-us": "contact",
};

function resolveCanonicalMarketingSlug(slug: string) {
  return canonicalMarketingSlugs[slug] || slug;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getRoshalLocale()]);
  const canonicalSlug = resolveCanonicalMarketingSlug(slug);

  if (canonicalSlug === "home") {
    return undefined;
  }

  const pageBundle = await getRoshalPageBundle(canonicalSlug);

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

  const canonicalSlug = resolveCanonicalMarketingSlug(slug);

  if (canonicalSlug !== slug) {
    redirect(`/${canonicalSlug}`);
  }

  const pageBundle = await getRoshalPageBundle(canonicalSlug);

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
