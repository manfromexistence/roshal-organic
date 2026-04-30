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
    <ImageCard className="group flex h-full flex-col overflow-hidden rounded-sm border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
      <ImageCardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-border/70 bg-muted/35">
          <Image
            src={product.image}
            alt={product.name[language]}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 18vw"
          />
          {product.badge ? (
            <Badge
              variant={product.badgeVariant || "secondary"}
              className="absolute left-2.5 top-2.5 rounded-sm"
            >
              {product.badge}
            </Badge>
          ) : null}
        </div>
      </ImageCardHeader>

      <ImageCardContent className="flex flex-1 flex-col items-start gap-1 px-2.5 pb-2 pt-2 text-left">
        <div className="w-full space-y-0.5">
          <ImageCardTitle className="line-clamp-2 min-h-9 text-[0.88rem] leading-[1.08rem] text-foreground">
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
      </ImageCardContent>

      <ImageCardFooter className="mt-auto px-0 pb-0 pt-0">
        <div className="grid w-full gap-1.5 border-t border-border/70 px-2.5 pb-2.5 pt-2">
          {product.cartProduct ? (
            <AddToCartButton
              product={product.cartProduct}
              locale={language}
              className="h-8 w-full rounded-sm text-[11px]"
            />
          ) : (
            <Button className="h-8 w-full rounded-sm text-[11px]">
              <ShoppingBag className="size-4" />
              {language === "bn" ? "কার্টে যোগ করুন" : "Add To Cart"}
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className="h-8 w-full rounded-sm text-[11px]"
          >
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

        <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-2 md:grid-cols-3 lg:gap-3.5 xl:grid-cols-5">
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
