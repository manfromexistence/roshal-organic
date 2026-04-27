import type { Metadata } from "next";
import { MarketingPageOffset } from "@/components/storefront/marketing-page-offset";
import { StorefrontBottomNavigation } from "@/components/storefront/storefront-bottom-navigation";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRoshalSessionUser } from "@/lib/store-auth";
import {
  getRoshalNavigationPages,
  getRoshalPaymentSettings,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue, localizedValue } from "@/lib/store-locale";
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

  const curatedHeaderLinks = [
    {
      href: "/products",
      label: getLocalizedValue(
        locale,
        localizedValue("সব পণ্য", "All Products"),
      ),
    },
    {
      href: "/products?category=vegetables",
      label: getLocalizedValue(locale, localizedValue("সবজি", "Vegetables")),
    },
    {
      href: "/products?category=honey",
      label: getLocalizedValue(locale, localizedValue("মধু", "Honey")),
    },
    {
      href: "/products?category=ghee",
      label: getLocalizedValue(locale, localizedValue("ঘি", "Ghee")),
    },
    {
      href: "/products?category=gur",
      label: getLocalizedValue(locale, localizedValue("গুড়", "Jaggery")),
    },
    {
      href: "/products?category=fruit",
      label: getLocalizedValue(locale, localizedValue("ফল", "Fruits")),
    },
    {
      href: "/products?category=oil",
      label: getLocalizedValue(locale, localizedValue("তেল", "Oils")),
    },
    {
      href: "/products?category=dairy",
      label: getLocalizedValue(locale, localizedValue("দুগ্ধজাত", "Dairy")),
    },
    {
      href: "/products?q=fresh",
      label: getLocalizedValue(locale, localizedValue("তাজা পণ্য", "Fresh Picks")),
    },
    {
      href: "/products?q=seasonal",
      label: getLocalizedValue(
        locale,
        localizedValue("মৌসুমি পণ্য", "Seasonal Picks"),
      ),
    },
    {
      href: "/products?sort=price-low",
      label: getLocalizedValue(locale, localizedValue("সেরা দামে", "Best Value")),
    },
    {
      href: "/products?maxPrice=250",
      label: getLocalizedValue(
        locale,
        localizedValue("২৫০ টাকার মধ্যে", "Under ৳250"),
      ),
    },
    {
      href: "/products?minPrice=400",
      label: getLocalizedValue(locale, localizedValue("প্রিমিয়াম", "Premium")),
    },
  ];
  const productCategoryLinks = products.map((product) => ({
    href: `/products?category=${product.categoryKey}`,
    label: getLocalizedValue(locale, product.categoryLabel),
  }));
  const categories = Array.from(
    new Map(
      [...curatedHeaderLinks, ...productCategoryLinks].map((link) => [
        link.href,
        link,
      ]),
    ).values(),
  );

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground antialiased">
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
      <ScrollArea
        type="always"
        scrollHideDelay={0}
        className="min-h-0 flex-1"
        viewportClassName="min-w-0 overscroll-contain"
      >
        <div className="flex min-h-full flex-col">
          <main className="min-h-[calc(100vh-18rem)] min-w-0 pb-20 md:pb-0">
            <MarketingPageOffset>{children}</MarketingPageOffset>
          </main>
          <StorefrontFooter
            locale={locale}
            pages={pages}
            paymentOptions={paymentSettings.options}
            siteSettings={siteSettings}
          />
        </div>
      </ScrollArea>
      <StorefrontBottomNavigation locale={locale} />
    </div>
  );
}
