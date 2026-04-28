import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HomeSectionHeading } from "@/components/marketing/home-section-heading";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ImageCard,
  ImageCardContent,
  ImageCardDescription,
  ImageCardFooter,
  ImageCardHeader,
  ImageCardTitle,
} from "@/components/ui/image-card";
import type { RoshalProduct } from "@/lib/store-types";

type Language = "bn" | "en";

interface ShelfProduct {
  id: string | number;
  href?: string;
  image: string;
  name: { bn: string; en: string };
  price: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  cartProduct?: RoshalProduct;
}

function ShelfProductCard({
  product,
  language,
}: {
  product: ShelfProduct;
  language: Language;
}) {
  return (
    <ImageCard className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md">
      <ImageCardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden border-b border-border/70 bg-muted/35">
          <Image
            src={product.image}
            alt={product.name[language]}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          />
          {product.badge ? (
            <Badge
              variant={product.badgeVariant || "secondary"}
              className="absolute left-3 top-3 rounded-md"
            >
              {product.badge}
            </Badge>
          ) : null}
        </div>
      </ImageCardHeader>

      <ImageCardContent className="flex flex-1 flex-col items-start gap-3 px-4 pb-4 pt-4 text-left">
        <div className="w-full space-y-2">
          <ImageCardTitle className="line-clamp-2 text-base leading-6 text-foreground">
            {product.name[language]}
          </ImageCardTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-primary">{product.price}</span>
            {product.originalPrice ? (
              <span className="text-muted-foreground line-through">
                {product.originalPrice}
              </span>
            ) : null}
          </div>
        </div>

        {typeof product.rating === "number" ? (
          <ImageCardDescription className="text-xs">
            {product.rating.toFixed(1)}
            {typeof product.reviews === "number" ? ` (${product.reviews})` : ""}
          </ImageCardDescription>
        ) : null}
      </ImageCardContent>

      <ImageCardFooter className="mt-auto px-0 pb-0 pt-0">
        <div className="grid w-full gap-2 border-t border-border/70 px-4 pb-4 pt-4">
          {product.cartProduct ? (
            <AddToCartButton
              product={product.cartProduct}
              locale={language}
              className="w-full rounded-lg"
            />
          ) : (
            <Button className="w-full rounded-lg">
              <ShoppingBag className="size-4" />
              {language === "bn" ? "কার্টে যোগ করুন" : "Add To Cart"}
            </Button>
          )}
          <Button asChild variant="outline" className="w-full rounded-lg">
            <Link href={product.href || `/products/${product.id}`}>
              {language === "bn" ? "বিস্তারিত দেখুন" : "View details"}
            </Link>
          </Button>
        </div>
      </ImageCardFooter>
    </ImageCard>
  );
}

export function HomeProductShelf({
  products,
  language,
  title,
  description,
  ctaHref,
  ctaLabel,
  showLoadMore = false,
}: {
  products: ShelfProduct[];
  language: Language;
  title: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
  showLoadMore?: boolean;
}) {
  return (
    <section className="w-full bg-background py-12 md:py-16">
      <div className="container mx-auto space-y-8 px-4 sm:px-6 md:px-8">
        <HomeSectionHeading
          title={title}
          description={description}
          ctaHref={ctaHref}
          ctaLabel={ctaLabel}
        />

        <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <ShelfProductCard
              key={String(product.id)}
              product={product}
              language={language}
            />
          ))}
        </div>

        {showLoadMore && ctaHref ? (
          <div className="flex justify-center pt-2">
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href={ctaHref}>
                {language === "bn" ? "আরও দেখুন" : "Load more"}
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
