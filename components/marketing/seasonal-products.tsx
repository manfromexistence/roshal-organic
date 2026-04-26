import { ShoppingCart, Snowflake, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/roshal/storefront/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageCard, ImageCardContent } from "@/components/ui/image-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { RoshalProduct } from "@/lib/roshal/types";

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
  season?: "winter" | "summer";
  cartProduct?: RoshalProduct;
}

const seasonalProducts: GridProduct[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  image: `/vegetables/vegetable-${((i + 20) % 75) + 1}.jpg`,
  name: {
    en: `Seasonal ${["Winter Squash", "Pumpkin", "Sweet Potato", "Cabbage", "Carrot", "Turnip", "Beetroot", "Radish", "Spinach", "Kale", "Brussels Sprouts", "Cauliflower", "Broccoli", "Leeks", "Onion"][i % 15]}`,
    bn: `মৌসুমি ${["শীতকালীন স্কোয়াশ", "লাউ", "মিষ্টি আলু", "বাঁধাকপি", "গাজর", "শালগম", "বিট", "মূলা", "পালং শাক", "কেল", "ব্রাসেলস স্প্রাউট", "ফুলকপি", "ব্রোকলি", "লিক", "পেঁয়াজ"][i % 15]}`,
  },
  price: 50 + ((i * 13) % 90),
  originalPrice: 110 + ((i * 17) % 120),
  rating: (3.5 + ((i * 3) % 14) / 10).toFixed(1),
  reviews: 18 + i * 9,
  season: i % 2 === 0 ? "winter" : "summer",
  href: "/products",
}));

export function SeasonalProducts({
  language,
  products,
  title,
  description,
  ctaHref,
  ctaLabel,
}: SeasonalProductsProps) {
  const displayProducts = (
    products?.length ? products : seasonalProducts
  ).slice(0, 10);

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mb-4 flex items-center justify-center gap-2">
            <Snowflake className="h-8 w-8 text-primary" />
            <Sun className="h-8 w-8 text-primary" />
            <h2 className="text-center text-3xl font-bold md:text-4xl">
              {title
                ? title[language]
                : language === "bn"
                  ? "মৌসুমি পণ্য"
                  : "Seasonal Products"}
            </h2>
          </div>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            {description
              ? description[language]
              : language === "bn"
                ? "বর্তমান মৌসুমের সেরা সবজি। সবচেয়ে তাজা এবং পুষ্টিকর।"
                : "Best vegetables of the current season. Freshest and most nutritious."}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {displayProducts.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.05}>
              <ImageCard className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <ImageCardContent>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name[language]}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
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
                    {product.cartProduct ? (
                      <AddToCartButton
                        product={product.cartProduct}
                        locale={language}
                        className="w-full"
                      />
                    ) : (
                      <Link href={product.href || "/products"}>
                        <Button
                          size="sm"
                          className="w-full"
                          variant="secondary"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {language === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </ImageCardContent>
              </ImageCard>
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
