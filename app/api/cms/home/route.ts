import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getRoshalHomeSectionGuide,
  roshalHomeSectionGuides,
} from "@/lib/cms-guides";
import {
  getAllRoshalProducts,
  getRoshalPages,
  getRoshalSectionsForPage,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const locale = await getRoshalLocale();
  const [pages, products, siteSettings] = await Promise.all([
    getRoshalPages(),
    getAllRoshalProducts(),
    getRoshalSiteSettings(),
  ]);
  const homePage = pages.find((page) => page.slug === "home");

  if (!homePage) {
    return NextResponse.json(
      { error: "Home page is not configured" },
      { status: 404 },
    );
  }

  const sections = await getRoshalSectionsForPage(homePage.id);

  return NextResponse.json({
    locale,
    generatedAt: new Date().toISOString(),
    overview: {
      totalPages: pages.length,
      publishedPages: pages.filter((page) => page.status === "published")
        .length,
      totalProducts: products.length,
      publishedProducts: products.filter((product) => product.isPublished)
        .length,
      featuredProducts: products.filter((product) => product.isFeatured).length,
      totalSections: sections.length,
      enabledSections: sections.filter((section) => section.isEnabled).length,
    },
    homePage: {
      id: homePage.id,
      slug: homePage.slug,
      title: getLocalizedValue(locale, homePage.title),
      description: getLocalizedValue(locale, homePage.description),
      status: homePage.status,
      showInNavigation: homePage.showInNavigation,
      editorHref: `/dashboard/pages/${homePage.id}`,
      liveHref: "/",
    },
    siteSettings: {
      brandName: siteSettings.brandName,
      primaryCtaHref: siteSettings.primaryCtaHref,
      primaryCtaLabel: getLocalizedValue(locale, siteSettings.primaryCtaLabel),
      heroLayout: siteSettings.heroLayout,
      cardStyle: siteSettings.cardStyle,
      sectionSpacing: siteSettings.sectionSpacing,
    },
    guides: roshalHomeSectionGuides.map((guide) => ({
      sectionKey: guide.sectionKey,
      label: getLocalizedValue(locale, guide.label),
      summary: getLocalizedValue(locale, guide.summary),
      contentHint: getLocalizedValue(locale, guide.contentHint),
      stylesHint: getLocalizedValue(locale, guide.stylesHint),
      recommendedTypes: guide.recommendedTypes,
      styleKeys: guide.styleKeys,
    })),
    sections: sections.map((section) => {
      const guide = getRoshalHomeSectionGuide(section.sectionKey);

      return {
        id: section.id,
        sectionKey: section.sectionKey,
        type: section.type,
        sortOrder: section.sortOrder,
        layout: section.layout,
        variant: section.variant,
        isEnabled: section.isEnabled,
        title:
          getLocalizedValue(locale, section.title) ||
          guide?.label.en ||
          section.sectionKey,
        body: getLocalizedValue(locale, section.body),
        itemCount: section.items.length,
        styleKeys: Object.keys(section.styles),
        styleValues: section.styles,
        editorHref: `/dashboard/pages/${homePage.id}#section-${section.sectionKey}`,
        guide: guide
          ? {
              label: getLocalizedValue(locale, guide.label),
              summary: getLocalizedValue(locale, guide.summary),
              contentHint: getLocalizedValue(locale, guide.contentHint),
              stylesHint: getLocalizedValue(locale, guide.stylesHint),
              recommendedTypes: guide.recommendedTypes,
              styleKeys: guide.styleKeys,
            }
          : null,
      };
    }),
  });
}
