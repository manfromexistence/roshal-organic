"use client";

import { HomeTopSellingGrid } from "@/components/marketing/home-top-selling-grid";
import type { RoshalProduct } from "@/lib/store-types";

type Language = "bn" | "en";

interface Product {
  id: string | number;
  href?: string;
  image: string;
  name: { bn: string; en: string };
  price: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  cartProduct?: RoshalProduct;
}

interface TopSellersProps {
  products: Product[];
  language: Language;
  ctaHref?: string;
  ctaLabel?: { bn: string; en: string };
  title?: { bn: string; en: string };
  description?: { bn: string; en: string };
}

export function TopSellers({
  products,
  language,
  title,
  description,
}: TopSellersProps) {
  return (
    <HomeTopSellingGrid
      products={products.slice(0, 4)}
      language={language}
      title={
        title
          ? title[language]
          : language === "bn"
            ? "শীর্ষ বিক্রিত পণ্য"
            : "Top Selling Products"
      }
      description={description?.[language]}
    />
  );
}
