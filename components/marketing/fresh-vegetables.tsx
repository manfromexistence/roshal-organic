import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface FreshVegetablesProps {
  language: "en" | "bn";
  products?: GridProduct[];
  title?: { bn: string; en: string };
  description?: { bn: string; en: string };
  ctaHref?: string;
  ctaLabel?: { bn: string; en: string };
  badgeLabel?: { bn: string; en: string };
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
}

const vegetableImages: GridProduct[] = Array.from({ length: 75 }, (_, i) => ({
  id: i + 1,
  image: `/vegetables/vegetable-${i + 1}.jpg`,
  name: {
    en: `Fresh Vegetable ${i + 1}`,
    bn: `তাজা সবজি ${i + 1}`,
  },
  price: 60 + ((i * 17) % 160),
  originalPrice: 180 + ((i * 23) % 170),
  rating: (3.4 + ((i * 7) % 15) / 10).toFixed(1),
  reviews: 20 + i * 13,
  href: "/products",
}));

export function FreshVegetables({
  language,
  products,
  title,
  description,
  ctaHref,
  ctaLabel,
  badgeLabel,
}: FreshVegetablesProps) {
  const displayProducts = (products?.length ? products : vegetableImages).slice(
    0,
    10,
  );

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            {title
              ? title[language]
              : language === "bn"
                ? "তাজা সবজি"
                : "Fresh Vegetables"}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            {description
              ? description[language]
              : language === "bn"
                ? "আমাদের কাছে সেরা মানের তাজা সবজি পাবেন। সব সবজি অর্গানিক এবং প্রাকৃতিকভাবে জন্মানো।"
                : "Get the freshest vegetables directly from local farmers. All organic and naturally grown."}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {displayProducts.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.02}>
              <Card className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name[language]}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      {badgeLabel
                        ? badgeLabel[language]
                        : language === "bn"
                          ? "তাজা"
                          : "FRESH"}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="mb-2 line-clamp-1 text-sm font-semibold">
                      {product.name[language]}
                    </h3>
                    {product.rating ? (
                      <div className="mb-2 flex items-center gap-1">
                        <span className="text-xs text-primary">★</span>
                        <span className="text-xs text-muted-foreground">
                          {product.rating}
                          {product.reviews ? ` (${product.reviews})` : ""}
                        </span>
                      </div>
                    ) : null}
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold">
                          {typeof product.price === "number"
                            ? `৳${product.price}`
                            : product.price}
                        </span>
                        {product.originalPrice ? (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            {typeof product.originalPrice === "number"
                              ? `৳${product.originalPrice}`
                              : product.originalPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <Link href={product.href || "/products"}>
                      <Button size="sm" className="w-full" variant="secondary">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {language === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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
                    ? "সব সবজি দেখুন"
                    : "View All Vegetables"}
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
