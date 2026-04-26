import { ShoppingCart, Snowflake, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface SeasonalProductsProps {
  language: "en" | "bn";
}

const seasonalProducts = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  image: `/vegetables/vegetable-${((i + 20) % 75) + 1}.jpg`,
  name: {
    en: `Seasonal ${["Winter Squash", "Pumpkin", "Sweet Potato", "Cabbage", "Carrot", "Turnip", "Beetroot", "Radish", "Spinach", "Kale", "Brussels Sprouts", "Cauliflower", "Broccoli", "Leeks", "Onion"][i % 15]}`,
    bn: `মৌসুমি ${["শীতকালীন স্কোয়াশ", "লাউ", "মিষ্টি আলু", "বাঁধাকপি", "গাজর", "শালগম", "বিট", "মুলা", "পালং শাক", "কেল", "ব্রাসেলস স্প্রাউট", "ফুলকপি", "ব্রোকলি", "লিক", "পেঁয়াজ"][i % 15]}`,
  },
  price: Math.floor(Math.random() * 100) + 40,
  originalPrice: Math.floor(Math.random() * 150) + 100,
  rating: (Math.random() * 1.5 + 3.5).toFixed(1),
  reviews: Math.floor(Math.random() * 200) + 15,
  season: i % 2 === 0 ? "winter" : "summer",
}));

export function SeasonalProducts({ language }: SeasonalProductsProps) {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Snowflake className="h-8 w-8 text-primary" />
            <Sun className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              {language === "bn" ? "মৌসুমি পণ্য" : "Seasonal Products"}
            </h2>
          </div>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            {language === "bn"
              ? "বর্তমান মৌসুমের সেরা সবজি। সবচেয়ে তাজা এবং পুষ্টিকর।"
              : "Best vegetables of the current season. Freshest and most nutritious."}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {seasonalProducts.slice(0, 10).map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.05}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name[language]}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        product.season === "winter"
                          ? "bg-blue-600 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {product.season === "winter" ? (
                        <>
                          <Snowflake className="mr-1 h-3 w-3" />
                          {language === "bn" ? "শীতকাল" : "WINTER"}
                        </>
                      ) : (
                        <>
                          <Sun className="mr-1 h-3 w-3" />
                          {language === "bn" ? "গ্রীষ্মকাল" : "SUMMER"}
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-1">
                      {product.name[language]}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500 text-xs">★</span>
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-lg">
                          ৳{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ৳{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/products/${product.id}`}>
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
            <Link href="/products?category=seasonal">
              <Button size="lg" variant="outline">
                {language === "bn"
                  ? "সব মৌসুমি পণ্য দেখুন"
                  : "View All Seasonal Products"}
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
