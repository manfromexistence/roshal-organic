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
  price: Math.floor(Math.random() * 200) + 50,
  originalPrice: Math.floor(Math.random() * 300) + 200,
  rating: (Math.random() * 2 + 3).toFixed(1),
  reviews: Math.floor(Math.random() * 500) + 10,
}));

export function FreshVegetables({ language }: FreshVegetablesProps) {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            {language === "bn" ? "তাজা সবজি" : "Fresh Vegetables"}
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            {language === "bn"
              ? "আমাদের কাছে সেরা মানের তাজা সবজি পাবেন। সব সবজি অর্গানিক এবং প্রাকৃতিকভাবে জন্মানো।"
              : "Get the freshest vegetables directly from local farmers. All organic and naturally grown."}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {vegetableImages.slice(0, 10).map((vegetable, index) => (
            <ScrollReveal key={vegetable.id} delay={index * 0.02}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={vegetable.image}
                      alt={vegetable.name[language]}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      {language === "bn" ? "তাজা" : "FRESH"}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-1">
                      {vegetable.name[language]}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500 text-xs">★</span>
                      <span className="text-xs text-muted-foreground">
                        {vegetable.rating} ({vegetable.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-lg">
                          ৳{vegetable.price}
                        </span>
                        {vegetable.originalPrice > vegetable.price && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ৳{vegetable.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/products/${vegetable.id}`}>
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
          <div className="text-center mt-12">
            <Link href="/products?category=vegetables">
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
