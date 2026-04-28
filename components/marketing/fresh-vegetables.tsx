"use client";

import { HomeProductShelf } from "@/components/marketing/home-product-shelf";
import type { RoshalProduct } from "@/lib/store-types";

interface FreshVegetablesProps {
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
    image: `/vegetables/vegetable-${index + 1}.jpg`,
    name: {
      en: `Fresh Vegetable ${index + 1}`,
      bn: `তাজা সবজি ${index + 1}`,
    },
    price: `BDT ${60 + ((index * 17) % 160)}`,
    originalPrice: `BDT ${180 + ((index * 23) % 170)}`,
    rating: Number((3.4 + ((index * 7) % 15) / 10).toFixed(1)),
    reviews: 20 + index * 13,
    href: "/products?category=vegetables",
  }),
);

export function FreshVegetables({
  language,
  products,
  title,
  description,
  ctaHref,
  ctaLabel,
}: FreshVegetablesProps) {
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
            ? "তাজা সবজি"
            : "Fresh Vegetables"
      }
      description={description?.[language]}
      ctaHref={ctaHref || "/products?category=vegetables"}
      ctaLabel={
        ctaLabel
          ? ctaLabel[language]
          : language === "bn"
            ? "সব সবজি দেখুন"
            : "View all vegetables"
      }
    />
  );
}
