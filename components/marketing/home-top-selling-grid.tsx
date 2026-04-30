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
    <ImageCard className="group overflow-hidden rounded-sm border-border/80 bg-card shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-md">
      <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
        <ImageCardHeader className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden border-b border-border/70 bg-muted/35 md:h-full md:min-h-[10rem] md:border-r md:border-b-0">
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

        <ImageCardContent className="flex flex-col justify-center gap-2 px-3.5 py-2.5 text-left md:px-4 md:py-3">
          <div className="space-y-1">
            <ImageCardTitle className="text-[0.95rem] leading-[1.2rem] tracking-tight md:text-[1.05rem] md:leading-5">
              {product.name[language]}
            </ImageCardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold text-primary md:text-lg">
                {product.price}
              </span>
              {product.originalPrice ? (
                <span className="text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap md:justify-start">
            {product.cartProduct ? (
              <AddToCartButton
                product={product.cartProduct}
                locale={language}
                className="h-8 w-full rounded-sm sm:min-w-28 sm:w-auto"
              />
            ) : (
              <Button className="h-8 w-full rounded-sm sm:min-w-28 sm:w-auto">
                <ShoppingBag className="size-4" />
                {language === "bn"
                  ? "à¦•à¦¾à¦°à§à¦Ÿà§‡ à¦¯à§‹à¦— à¦•à¦°à§à¦¨"
                  : "Add To Cart"}
              </Button>
            )}

            <Button
              asChild
              variant="secondary"
              className="h-8 w-full rounded-sm sm:min-w-24 sm:w-auto"
            >
              <Link href={product.href || `/products/${product.id}`}>
                {language === "bn" ? "à¦à¦–à¦¨à¦‡ à¦•à¦¿à¦¨à§à¦¨" : "Buy now"}
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
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
