import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Bengali } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ROSHAL_LOCALE_COOKIE } from "@/lib/store-locale";
import { getRoshalMetadataBase } from "@/lib/store-site";
import {
  getThemeBootstrapScript,
  NEXT_THEME_STORAGE_KEY,
} from "@/lib/theme-bootstrap";
import "./globals.css";

const roshalInter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roshal-inter",
});

const roshalBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-roshal-bengali",
});

const roshalMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roshal-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "Roshal Organic",
    template: "%s | Roshal Organic",
  },
  description:
    "Roshal Organic storefront and dashboard for bilingual ecommerce and marketing content management.",
  metadataBase: getRoshalMetadataBase(),
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale =
    cookieStore.get(ROSHAL_LOCALE_COOKIE)?.value === "bn" ? "bn" : "en";
  const themeBootstrapScript = getThemeBootstrapScript();

  return (
    <html
      lang={locale === "bn" ? "bn-BD" : "en"}
      className={`${roshalInter.variable} ${roshalBengali.variable} ${roshalMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full w-full">
        <Script id="roshal-theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrapScript}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey={NEXT_THEME_STORAGE_KEY}
        >
          <QueryProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster closeButton position="top-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
