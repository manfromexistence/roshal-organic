import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface FreshVegetablesProps {
  language: "en" | "bn";
}

const vegetableImages = Array.from({ length: 75 }, (_, i) => ({
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
}));

export function FreshVegetables({ language }: FreshVegetablesProps) {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            {language === "bn" ? "তাজা সবজি" : "Fresh Vegetables"}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            {language === "bn"
              ? "আমাদের কাছে সেরা মানের তাজা সবজি পাবেন। সব সবজি অর্গানিক এবং প্রাকৃতিকভাবে জন্মানো।"
              : "Get the freshest vegetables directly from local farmers. All organic and naturally grown."}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {vegetableImages.slice(0, 10).map((vegetable, index) => (
            <ScrollReveal key={vegetable.id} delay={index * 0.02}>
              <Card className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={vegetable.image}
                      alt={vegetable.name[language]}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      {language === "bn" ? "তাজা" : "FRESH"}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="mb-2 line-clamp-1 text-sm font-semibold">
                      {vegetable.name[language]}
                    </h3>
                    <div className="mb-2 flex items-center gap-1">
                      <span className="text-xs text-primary">★</span>
                      <span className="text-xs text-muted-foreground">
                        {vegetable.rating} ({vegetable.reviews})
                      </span>
                    </div>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold">
                          ৳{vegetable.price}
                        </span>
                        {vegetable.originalPrice > vegetable.price ? (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            ৳{vegetable.originalPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <Link href="/products">
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
            <Link href="/products">
              <Button size="lg" variant="outline">
                {language === "bn" ? "সব সবজি দেখুন" : "View All Vegetables"}
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
