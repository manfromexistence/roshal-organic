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
      <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
        <ImageCardHeader className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden border-b border-border/70 bg-muted/35 md:h-full md:min-h-[12.5rem] md:border-r md:border-b-0">
            <Image
              src={product.image}
              alt={product.name[language]}
              fill
              className="rounded-sm object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 220px"
            />
            {product.badge ? (
              <Badge className="absolute top-3 right-3 rounded-md">
                {product.badge}
              </Badge>
            ) : null}
          </div>
        </ImageCardHeader>

        <ImageCardContent className="flex flex-col justify-center gap-3 px-4 py-4 text-left md:px-5 md:py-[1.125rem]">
          <div className="space-y-2">
            <ImageCardTitle className="text-base leading-6 tracking-tight md:text-lg">
              {product.name[language]}
            </ImageCardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold text-primary md:text-xl">
                {product.price}
              </span>
              {product.originalPrice ? (
                <span className="text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap md:justify-start">
            {product.cartProduct ? (
              <AddToCartButton
                product={product.cartProduct}
                locale={language}
                className="w-full rounded-md sm:min-w-36 sm:w-auto"
              />
            ) : (
              <Button className="w-full rounded-md sm:min-w-36 sm:w-auto">
                <ShoppingBag className="size-4" />
                {language === "bn" ? "কার্টে যোগ করুন" : "Add To Cart"}
              </Button>
            )}

            <Button
              asChild
              variant="secondary"
              className="w-full rounded-md sm:min-w-28 sm:w-auto"
            >
              <Link href={product.href || `/products/${product.id}`}>
                {language === "bn" ? "এখনই কিনুন" : "Buy now"}
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
    <section className="w-full bg-background py-12 md:py-16">
      <div className="container mx-auto space-y-8 px-4 sm:px-6 md:px-8">
        <HomeSectionHeading title={title} description={description} centered />

        <div className="grid grid-cols-2 gap-3 md:gap-5">
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
