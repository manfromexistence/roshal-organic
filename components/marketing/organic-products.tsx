"use client";

import { HomeProductShelf } from "@/components/marketing/home-product-shelf";
import type { RoshalProduct } from "@/lib/store-types";

interface OrganicProductsProps {
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
    image: `/vegetables/vegetable-${(index % 10) + 11}.jpg`,
    name: {
      en: `Organic Pantry Pick ${index + 1}`,
      bn: `অর্গানিক প্যান্ট্রি পছন্দ ${index + 1}`,
    },
    price: `BDT ${90 + ((index * 19) % 130)}`,
    originalPrice: `BDT ${170 + ((index * 11) % 140)}`,
    rating: Number((3.6 + ((index * 5) % 12) / 10).toFixed(1)),
    reviews: 30 + index * 11,
    href: "/products",
  }),
);

export function OrganicProducts({
  language,
  products,
  title,
  description,
  ctaHref,
  ctaLabel,
}: OrganicProductsProps) {
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
            ? "অর্গানিক সার্টিফায়েড"
            : "Organic Certified"
      }
      description={description?.[language]}
      ctaHref={ctaHref || "/products"}
      ctaLabel={
        ctaLabel
          ? ctaLabel[language]
          : language === "bn"
            ? "সব অর্গানিক পণ্য দেখুন"
            : "View all organic items"
      }
    />
  );
}
