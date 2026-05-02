import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HomeSectionHeading } from "@/components/marketing/home-section-heading";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ImageCard,
  ImageCardContent,
  ImageCardHeader,
  ImageCardTitle,
} from "@/components/ui/image-card";
import type { RoshalProduct } from "@/lib/store-types";

type Language = "bn" | "en";

interface FeaturedProduct {
  id: string | number;
  href?: string;
  image: string;
  name: { bn: string; en: string };
  price: string;
  originalPrice?: string;
  badge?: string;
  cartProduct?: RoshalProduct;
}

function TopSellingCard({
  product,
  language,
}: {
  product: FeaturedProduct;
  language: Language;
}) {
  return (
    <ImageCard className="group overflow-hidden rounded-md border-border/80 bg-card shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-md">
      <div className="grid gap-0 xl:grid-cols-[0.95fr_1.05fr]">
        <ImageCardHeader className="p-0">
          <div className="relative aspect-[11/8] overflow-hidden border-b border-border/70 bg-muted/35 xl:h-full xl:min-h-[11rem] xl:border-r xl:border-b-0">
            <Image
              src={product.image}
              alt={product.name[language]}
              fill
              className="rounded-sm object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 220px"
            />
            {product.badge ? (
              <Badge className="absolute top-2.5 right-2.5 rounded-sm">
                {product.badge}
              </Badge>
            ) : null}
          </div>
        </ImageCardHeader>

        <ImageCardContent className="flex flex-col justify-center gap-2.5 px-3.5 py-3.5 text-left md:px-4 md:py-3.5">
          <div className="space-y-1.5">
            <ImageCardTitle className="line-clamp-2 text-sm leading-4 tracking-tight sm:text-base sm:leading-5 xl:text-lg">
              {product.name[language]}
            </ImageCardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold text-primary sm:text-lg xl:text-xl">
                {product.price}
              </span>
              {product.originalPrice ? (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:justify-start">
            {product.cartProduct ? (
              <AddToCartButton
                product={product.cartProduct}
                locale={language}
                className="h-9 w-full rounded-sm text-xs sm:text-sm xl:min-w-36 xl:w-auto"
              />
            ) : (
              <Button className="h-9 w-full rounded-sm text-xs sm:text-sm xl:min-w-36 xl:w-auto">
                <ShoppingBag className="size-4" />
                {language === "bn" ? "কার্টে যোগ করুন" : "Add To Cart"}
              </Button>
            )}

            <Button
              asChild
              variant="secondary"
              className="h-9 w-full rounded-sm text-xs sm:text-sm xl:min-w-28 xl:w-auto"
            >
              <Link href={product.href || `/products/${product.id}`}>
                {language === "bn" ? "বিস্তারিত দেখুন" : "View Details"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </ImageCardContent>
      </div>
    </ImageCard>
  );
}

export function HomeTopSellingGrid({
  products,
  language,
  title,
  description,
}: {
  products: FeaturedProduct[];
  language: Language;
  title: string;
  description?: string;
}) {
  return (
    <section className="w-full bg-background py-4 md:py-6">
      <div className="container mx-auto space-y-4 px-4 sm:px-6 md:space-y-5 md:px-8">
        <HomeSectionHeading title={title} description={description} centered />

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {products.map((product) => (
            <TopSellingCard
              key={String(product.id)}
              product={product}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
