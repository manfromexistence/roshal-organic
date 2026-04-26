"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ProductCard } from "./product-card";

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
}

interface FeaturedProductsProps {
  products: Product[];
  language: Language;
  ctaHref?: string;
  ctaLabel?: { bn: string; en: string };
}

export function FeaturedProducts({
  products,
  language,
  ctaHref,
  ctaLabel,
}: FeaturedProductsProps) {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            {language === "bn" ? "বিশেষ পণ্য" : "Featured Products"}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.slice(0, 4).map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.1} direction="up">
              <ProductCard
                id={product.id}
                href={product.href}
                image={product.image}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviews={product.reviews}
                badge="20% OFF"
                badgeVariant="destructive"
                language={language}
              />
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={0.5}>
          <div className="mt-12 text-center">
            <Link href={ctaHref || "/products"}>
              <Button size="lg" variant="outline">
                {ctaLabel
                  ? ctaLabel[language]
                  : language === "bn"
                    ? "সব পণ্য দেখুন"
                    : "View All Products"}
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
