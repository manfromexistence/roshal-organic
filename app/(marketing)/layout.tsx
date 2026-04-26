import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { StorefrontBottomNavigation } from "@/components/roshal/storefront/storefront-bottom-navigation";
import { StorefrontFooter } from "@/components/roshal/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/roshal/storefront/storefront-header";
import { getRoshalSessionUser } from "@/lib/roshal/auth";
import {
  getRoshalNavigationPages,
  getRoshalPaymentSettings,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import { getLocalizedValue } from "@/lib/roshal/locale";
import "../globals.css";

const marketingThemeStyles = {
  "--primary": "oklch(72.3% 0.219 149.579)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--ring": "oklch(72.3% 0.219 149.579)",
} as CSSProperties;

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
    <div
      style={marketingThemeStyles}
      className="min-h-screen bg-background text-foreground antialiased"
    >
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
