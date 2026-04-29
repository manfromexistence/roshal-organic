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
    <ImageCard className="group overflow-hidden rounded-[2rem] border-border/80 bg-card shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-md">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-[0.92fr_1.08fr]">
        <ImageCardHeader className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden border-b border-border/70 bg-muted/35 md:h-full md:min-h-[18rem] md:border-r md:border-b-0">
            <Image
              src={product.image}
              alt={product.name[language]}
              fill
              className="rounded-sm object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 176px"
            />
            {product.badge ? (
              <Badge className="absolute top-3 right-3 rounded-md">
                {product.badge}
              </Badge>
            ) : null}
          </div>
        </ImageCardHeader>

        <ImageCardContent className="flex flex-col justify-center gap-5 px-5 py-5 text-center md:px-6 md:py-6 md:text-left">
          <div className="space-y-2">
            <ImageCardTitle className="text-xl tracking-tight">
              {product.name[language]}
            </ImageCardTitle>
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="text-2xl font-semibold text-primary">
                {product.price}
              </span>
              {product.originalPrice ? (
                <span className="text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
            {product.cartProduct ? (
              <AddToCartButton
                product={product.cartProduct}
                locale={language}
                className="w-full rounded-xl sm:min-w-40 sm:w-auto"
              />
            ) : (
              <Button className="w-full rounded-xl sm:min-w-40 sm:w-auto">
                <ShoppingBag className="size-4" />
                {language === "bn"
                  ? "à¦•à¦¾à¦°à§à¦Ÿà§‡ à¦¯à§‹à¦— à¦•à¦°à§à¦¨"
                  : "Add To Cart"}
              </Button>
            )}

            <Button
              asChild
              variant="secondary"
              className="w-full rounded-xl sm:min-w-32 sm:w-auto"
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
