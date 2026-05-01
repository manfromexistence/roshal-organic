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

  return locale === "bn" ? `Save ${discount}%` : `Save ${discount}%`;
}

export function RoshalProductCard({
  product,
  locale,
  priority = false,
}: {
  product: RoshalProduct;
  locale: RoshalLocale;
  priority?: boolean;
}) {
  const name = getLocalizedValue(locale, product.name);
  const categoryLabel = getLocalizedValue(locale, product.categoryLabel);
  const badgeLabel = resolveDiscountLabel(product, locale);

  return (
    <ImageCard className="group flex h-full flex-col overflow-hidden rounded-sm border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
      <ImageCardHeader className="p-0">
        <div className="relative">
          <Link
            href={`/products/${product.slug}`}
            className="block rounded-t-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden border-b border-border/70 bg-muted/35">
              <Image
                src={product.heroImage}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading={priority ? "eager" : "lazy"}
                priority={priority}
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
              />
            </div>
          </Link>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2">
            {badgeLabel ? (
              <Badge className="pointer-events-auto rounded-sm">
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

      <ImageCardContent className="flex flex-1 flex-col items-start gap-0.5 px-2 pb-1 pt-1.5 text-left">
        <div className="w-full space-y-0.5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {categoryLabel}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="block w-full transition-colors hover:text-primary"
          >
            <ImageCardTitle className="line-clamp-2 text-sm leading-[1.18] text-foreground">
              {name}
            </ImageCardTitle>
          </Link>
        </div>

        <div className="mt-auto flex w-full flex-col items-start gap-0.5 pt-0.5">
          <div className="space-y-0">
            <p className="price-emphasis text-base font-semibold text-primary dark:[color:color-mix(in_oklch,var(--foreground)_68%,var(--primary))]">
              {formatBdt(product.price, locale)}
            </p>
            {product.compareAtPrice ? (
              <p className="text-[11px] text-muted-foreground line-through">
                {formatBdt(product.compareAtPrice, locale)}
              </p>
            ) : null}
          </div>
        </div>
      </ImageCardContent>

      <ImageCardFooter className="mt-auto px-0 pb-0 pt-0">
        <div className="grid w-full gap-1 border-t border-border/70 px-2 pb-2 pt-1.5">
          <Button
            asChild
            variant="outline"
            className="h-8 rounded-sm px-2 text-[11px]"
          >
            <Link href={`/products/${product.slug}`}>
              <Eye className="mr-1.5 size-3.5" />
              {locale === "bn" ? "Details" : "Details"}
            </Link>
          </Button>

          <AddToCartButton
            product={product}
            locale={locale}
            className="h-8 w-full rounded-sm text-[11px]"
          />
        </div>
      </ImageCardFooter>
    </ImageCard>
  );
}
