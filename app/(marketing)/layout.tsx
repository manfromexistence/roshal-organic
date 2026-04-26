import type { Metadata } from "next";
import { StorefrontBottomNavigation } from "@/components/storefront/storefront-bottom-navigation";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { getRoshalSessionUser } from "@/lib/store-auth";
import {
  getRoshalNavigationPages,
  getRoshalPaymentSettings,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";
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
  const [locale, pages, siteSettings, sessionUser, products, paymentSettings] =
    await Promise.all([
      getRoshalLocale(),
      getRoshalNavigationPages(),
      getRoshalSiteSettings(),
      getRoshalSessionUser(),
      getRoshalProducts(),
      getRoshalPaymentSettings(),
    ]);

  const categories = Array.from(
    new Map(
      products.map((product) => [
        product.categoryKey,
        {
          href: `/products?category=${product.categoryKey}`,
          label: getLocalizedValue(locale, product.categoryLabel),
        },
      ]),
    ).values(),
  );

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <StorefrontHeader
        locale={locale}
        pages={pages}
        categories={categories}
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
      <main className="min-h-[calc(100vh-18rem)] pb-20 md:pb-0">
        {children}
      </main>
      <StorefrontFooter
        locale={locale}
        pages={pages}
        paymentOptions={paymentSettings.options}
        siteSettings={siteSettings}
      />
      <StorefrontBottomNavigation locale={locale} />
    </div>
  );
}
