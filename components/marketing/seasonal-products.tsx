"use client";

import { HomeProductShelf } from "@/components/marketing/home-product-shelf";
import type { RoshalProduct } from "@/lib/store-types";

interface SeasonalProductsProps {
  language: "en" | "bn";
  products?: GridProduct[];
  title?: { bn: string; en: string };
  description?: { bn: string; en: string };
  ctaHref?: string;
  ctaLabel?: { bn: string; en: string };
}

interface GridProduct {
  id: string | number;
  image: string;
  href?: string;
  name: {
    en: string;
    bn: string;
  };
  price: number | string;
  originalPrice?: number | string;
  rating?: string | number;
  reviews?: number;
  cartProduct?: RoshalProduct;
}

const fallbackProducts: GridProduct[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    image: `/vegetables/vegetable-${((index + 20) % 75) + 1}.jpg`,
    name: {
      en: `Premium Pick ${index + 1}`,
      bn: `প্রিমিয়াম পছন্দ ${index + 1}`,
    },
    price: `BDT ${50 + ((index * 13) % 90)}`,
    originalPrice: `BDT ${110 + ((index * 17) % 120)}`,
    rating: Number((3.5 + ((index * 3) % 14) / 10).toFixed(1)),
    reviews: 18 + index * 9,
    href: "/products",
  }),
);

export function SeasonalProducts({
  language,
  products,
  title,
  description,
  ctaHref,
  ctaLabel,
}: SeasonalProductsProps) {
  const normalizedProducts = (
    products?.length ? products : fallbackProducts
  ).map((product) => ({
    ...product,
    price:
      typeof product.price === "number"
        ? `BDT ${product.price}`
        : product.price,
    originalPrice:
      typeof product.originalPrice === "number"
        ? `BDT ${product.originalPrice}`
        : product.originalPrice,
    rating:
      typeof product.rating === "string"
        ? Number.parseFloat(product.rating)
        : product.rating,
  }));

  return (
    <HomeProductShelf
      products={normalizedProducts.slice(0, 5)}
      language={language}
      title={
        title
          ? title[language]
          : language === "bn"
            ? "প্রিমিয়াম পছন্দ"
            : "Premium Picks"
      }
      description={description?.[language]}
      ctaHref={ctaHref || "/products"}
      ctaLabel={
        ctaLabel
          ? ctaLabel[language]
          : language === "bn"
            ? "সব প্রিমিয়াম পণ্য দেখুন"
            : "View all premium picks"
      }
    />
  );
}
