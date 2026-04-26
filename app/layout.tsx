import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getRoshalMetadataBase } from "@/lib/roshal/site";
import { getThemeBootstrapScript } from "@/lib/theme-bootstrap";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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
  const locale = cookieStore.get("roshal-locale")?.value === "en" ? "en" : "bn";
  const themeBootstrapScript = getThemeBootstrapScript();

  return (
    <html
      lang={locale === "en" ? "en" : "bn-BD"}
      className={`${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full w-full">
        <Script id="roshal-theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrapScript}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
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
