"use client";

import { HomeProductShelf } from "@/components/marketing/home-product-shelf";
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

interface NewArrivalsProps {
  products: Product[];
  language: Language;
  ctaHref?: string;
  ctaLabel?: { bn: string; en: string };
  title?: { bn: string; en: string };
  description?: { bn: string; en: string };
}

export function NewArrivals({
  products,
  language,
  ctaHref,
  ctaLabel,
  title,
  description,
}: NewArrivalsProps) {
  return (
    <HomeProductShelf
      products={products.slice(0, 5)}
      language={language}
      title={
        title
          ? title[language]
          : language === "bn"
            ? "নতুন আগমন"
            : "New Arrivals"
      }
      description={description?.[language]}
      ctaHref={ctaHref || "/products"}
      ctaLabel={
        ctaLabel
          ? ctaLabel[language]
          : language === "bn"
            ? "সব নতুন পণ্য দেখুন"
            : "View all new arrivals"
      }
    />
  );
}
