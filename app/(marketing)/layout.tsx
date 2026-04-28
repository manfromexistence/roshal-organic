import type { Metadata } from "next";
import { MarketingPageOffset } from "@/components/storefront/marketing-page-offset";
import { StorefrontBottomNavigation } from "@/components/storefront/storefront-bottom-navigation";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRoshalSessionUser } from "@/lib/store-auth";
import {
  getRoshalNavigationPages,
  getRoshalPages,
  getRoshalPaymentSettings,
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
  const [
    locale,
    allPages,
    pages,
    siteSettings,
    sessionUser,
    paymentSettings,
    taxonomyBundle,
  ] = await Promise.all([
    getRoshalLocale(),
    getRoshalPages(),
    getRoshalNavigationPages(),
    getRoshalSiteSettings(),
    getRoshalSessionUser(),
    getRoshalPaymentSettings(),
    getRoshalTaxonomy(),
  ]);

  const taxonomy = buildStorefrontTaxonomy(taxonomyBundle);
  const footerCategoryLinks = buildFooterCategoryLinks(taxonomyBundle);

  return (
    <div className="flex h-svh min-w-0 flex-col overflow-hidden bg-background text-foreground antialiased">
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

      <ScrollArea
        type="always"
        scrollHideDelay={0}
        className="min-h-0 flex-1"
        viewportClassName="min-w-0 overscroll-contain [&>div]:!block [&>div]:!min-w-0 [&>div]:!w-full"
      >
        <div className="flex min-h-full w-full min-w-0 flex-col overflow-x-clip">
          <main className="min-h-[calc(100vh-18rem)] w-full min-w-0 overflow-x-clip pb-20 md:pb-0">
            <MarketingPageOffset>{children}</MarketingPageOffset>
          </main>

          <StorefrontFooter
            locale={locale}
            pages={allPages}
            paymentOptions={paymentSettings.options}
            siteSettings={siteSettings}
            categoryLinks={footerCategoryLinks}
          />
        </div>
      </ScrollArea>

      <StorefrontBottomNavigation locale={locale} />
    </div>
  );
}
