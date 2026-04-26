import type { Metadata } from "next";
import {
  Hind_Siliguri,
  JetBrains_Mono,
  Noto_Sans_Bengali,
} from "next/font/google";
import { StorefrontFooter } from "@/components/roshal/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/roshal/storefront/storefront-header";
import { getRoshalSessionUser } from "@/lib/roshal/auth";
import {
  getRoshalNavigationPages,
  getRoshalSiteSettings,
} from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import "../globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-bengali",
});

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
  const [locale, pages, siteSettings, sessionUser] = await Promise.all([
    getRoshalLocale(),
    getRoshalNavigationPages(),
    getRoshalSiteSettings(),
    getRoshalSessionUser(),
  ]);

  return (
    <div
      className={`${jetbrainsMono.variable} ${hindSiliguri.variable} ${notoSansBengali.variable} min-h-screen bg-background text-foreground antialiased`}
    >
      <StorefrontHeader
        locale={locale}
        pages={pages}
        siteSettings={siteSettings}
        sessionUser={
          sessionUser
            ? {
                name: sessionUser.name,
                email: sessionUser.email,
                role: sessionUser.role,
              }
            : null
        }
      />
      <main className="min-h-[calc(100vh-18rem)]">{children}</main>
      <StorefrontFooter
        locale={locale}
        pages={pages}
        siteSettings={siteSettings}
      />
    </div>
  );
}
