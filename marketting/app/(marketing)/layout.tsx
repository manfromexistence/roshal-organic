import type { Metadata } from "next";
import {
  Hind_Siliguri,
  JetBrains_Mono,
  Noto_Sans_Bengali,
} from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { BottomNavigation } from "@/components/bottom-navigation";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
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
  title: "Roshal Organic - খাঁটি স্বাদের আসল ঠিকানা",
  description: "খাঁটি স্বাদের আসল ঠিকানা - ১০০% প্রাকৃতিক ও অর্গানিক খাদ্য ব্র্যান্ড",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${jetbrainsMono.variable} ${hindSiliguri.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      <NuqsAdapter>
        <MarketingHeader />

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Footer */}
        <MarketingFooter />
      </NuqsAdapter>
    </div>
  );
}
