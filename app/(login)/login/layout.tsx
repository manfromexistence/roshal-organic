import type { Metadata } from "next";
import { StorefrontBottomNavigation } from "@/components/storefront/storefront-bottom-navigation";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRoshalSessionUser } from "@/lib/store-auth";
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
import "../../globals.css";

export const metadata: Metadata = {
  title: "Login | Roshal Organic",
  description: "Sign in to the Roshal Organic storefront and admin dashboard.",
};

export default async function LoginLayout({
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
    <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground antialiased">
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
        viewportClassName="min-w-0 overscroll-contain pt-32"
      >
        <div className="flex min-h-full flex-col">
          <main className="min-h-[calc(100vh-18rem)] min-w-0 pb-20 md:pb-0">
            {children}
          </main>
          <StorefrontFooter
            locale={locale}
            pages={allPages}
            siteSettings={siteSettings}
            categoryLinks={footerCategoryLinks}
          />
        </div>
      </ScrollArea>
      <StorefrontBottomNavigation locale={locale} />
    </div>
  );
}
