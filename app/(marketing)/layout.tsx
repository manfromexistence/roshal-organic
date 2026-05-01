import type { Metadata } from "next";
import { MarketingPageOffset } from "@/components/storefront/marketing-page-offset";
import { StorefrontBottomNavigation } from "@/components/storefront/storefront-bottom-navigation";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { WhatsAppFloatingButton } from "@/components/storefront/whatsapp-floating-button";
import { getRoshalSessionUser } from "@/lib/store-auth";
import { getWhatsAppHref } from "@/lib/store-contact";
import {
  getRoshalNavigationPages,
  getRoshalPages,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import {
  buildFooterCategoryLinks,
  buildStorefrontTaxonomy,
} from "@/lib/store-taxonomy";
import { getRoshalTaxonomy } from "@/lib/store-taxonomy-content";
import "../globals.css";

export const metadata: Metadata = {
  title: "Roshal Organic",
  description:
    "Pure food storefront and content-managed dashboard for Roshal Organic.",
};

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, allPages, pages, siteSettings, sessionUser, taxonomyBundle] =
    await Promise.all([
      getRoshalLocale(),
      getRoshalPages(),
      getRoshalNavigationPages(),
      getRoshalSiteSettings(),
      getRoshalSessionUser(),
      getRoshalTaxonomy(),
    ]);

  const taxonomy = buildStorefrontTaxonomy(taxonomyBundle);
  const footerCategoryLinks = buildFooterCategoryLinks(taxonomyBundle);

  return (
    <div className="storefront-shell flex min-h-svh min-w-0 flex-col bg-background text-foreground antialiased">
      <StorefrontHeader
        locale={locale}
        pages={pages}
        taxonomy={taxonomy}
        siteSettings={siteSettings}
        sessionUser={
          sessionUser
            ? {
                id: sessionUser.id,
                name: sessionUser.name,
                email: sessionUser.email,
                role: sessionUser.role,
              }
            : null
        }
      />

      <WhatsAppFloatingButton
        href={getWhatsAppHref(siteSettings.whatsappPhone) || "/contact"}
        facebookHref={siteSettings.facebookUrl}
        label={locale === "bn" ? "চ্যাট" : "Chat"}
      />

      <div className="flex min-h-svh w-full min-w-0 flex-1 flex-col overflow-x-clip">
        <main className="min-h-[calc(100vh-18rem)] w-full min-w-0 flex-1 overflow-x-clip pb-20 md:pb-0">
          <MarketingPageOffset>{children}</MarketingPageOffset>
        </main>

        <StorefrontFooter
          locale={locale}
          pages={allPages}
          siteSettings={siteSettings}
          categoryLinks={footerCategoryLinks}
        />
      </div>

      <StorefrontBottomNavigation locale={locale} />
    </div>
  );
}
