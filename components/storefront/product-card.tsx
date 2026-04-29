import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { FavoriteToggleButton } from "@/components/storefront/favorite-toggle-button";
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
import { formatBdt } from "@/lib/store-format";
import { getLocalizedValue } from "@/lib/store-locale";
import type { RoshalLocale, RoshalProduct } from "@/lib/store-types";

function resolveDiscountLabel(product: RoshalProduct, locale: RoshalLocale) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return product.badge;
  }

  const discount = Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
  );

  if (discount <= 0) {
    return product.badge;
  }

  return locale === "bn" ? `সেভ ${discount}%` : `Save ${discount}%`;
}

export function RoshalProductCard({
  product,
  locale,
}: {
  product: RoshalProduct;
  locale: RoshalLocale;
}) {
  const name = getLocalizedValue(locale, product.name);
  const summary = getLocalizedValue(locale, product.summary);
  const categoryLabel = getLocalizedValue(locale, product.categoryLabel);
  const badgeLabel = resolveDiscountLabel(product, locale);

  return (
    <ImageCard className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md">
      <ImageCardHeader className="p-0">
        <div className="relative">
          <Link
            href={`/products/${product.slug}`}
            className="block rounded-t-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="relative aspect-square overflow-hidden border-b border-border/70 bg-muted/35">
              <Image
                src={product.heroImage}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
              />
            </div>
          </Link>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
            {badgeLabel ? (
              <Badge className="pointer-events-auto rounded-md">
                {badgeLabel}
              </Badge>
            ) : (
              <span />
            )}

            <FavoriteToggleButton
              productId={product.id}
              locale={locale}
              className="pointer-events-auto rounded-full border-border/70 bg-background/95 shadow-sm hover:bg-background"
              variant="ghost"
            />
          </div>
        </div>
      </ImageCardHeader>

      <ImageCardContent className="flex flex-1 flex-col items-start gap-3 px-4 pb-4 pt-4 text-left">
        <div className="w-full space-y-2">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {categoryLabel}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="block w-full transition-colors hover:text-primary"
          >
            <ImageCardTitle className="line-clamp-2 text-lg leading-7 text-foreground">
              {name}
            </ImageCardTitle>
          </Link>
          <ImageCardDescription className="line-clamp-2 leading-6">
            {summary}
          </ImageCardDescription>
        </div>

        <div className="mt-auto flex w-full flex-col items-start gap-1.5">
          <div className="space-y-1">
            <p className="price-emphasis text-xl font-semibold text-primary dark:[color:color-mix(in_oklch,var(--foreground)_68%,var(--primary))]">
              {formatBdt(product.price, locale)}
            </p>
            {product.compareAtPrice ? (
              <p className="text-sm text-muted-foreground line-through">
                {formatBdt(product.compareAtPrice, locale)}
              </p>
            ) : null}
          </div>

          <div className="text-xs text-muted-foreground">
            {product.inventory > 0
              ? locale === "bn"
                ? `${product.inventory} বাকি`
                : `${product.inventory} left`
              : locale === "bn"
                ? "স্টক শেষ"
                : "Out of stock"}
          </div>
        </div>
      </ImageCardContent>

      <ImageCardFooter className="mt-auto px-0 pb-0 pt-0">
        <div className="grid w-full gap-3 border-t border-border/70 px-4 pb-4 pt-4">
          <Button asChild variant="outline" className="rounded-lg">
            <Link href={`/products/${product.slug}`}>
              <Eye className="size-4" />
              {locale === "bn" ? "বিস্তারিত" : "Details"}
            </Link>
          </Button>

          <AddToCartButton
            product={product}
            locale={locale}
            className="w-full rounded-lg"
          />
        </div>
      </ImageCardFooter>
    </ImageCard>
  );
}
