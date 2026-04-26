"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ProductCard } from "./product-card";

type Language = "bn" | "en";

interface Product {
  id: string | number;
  image: string;
  name: { bn: string; en: string };
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
}

interface FeaturedProductsProps {
  products: Product[];
  language: Language;
}

export function FeaturedProducts({
  products,
  language,
}: FeaturedProductsProps) {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {language === "bn" ? "বিশেষ পণ্য" : "Featured Products"}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.1} direction="up">
              <ProductCard
                id={product.id}
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
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">
                {language === "bn" ? "সব পণ্য দেখুন" : "View All Products"}
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
