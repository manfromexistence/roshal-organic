import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/roshal/storefront/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatBdt } from "@/lib/roshal/format";
import { getLocalizedValue } from "@/lib/roshal/locale";
import type { RoshalLocale, RoshalProduct } from "@/lib/roshal/types";

export function RoshalProductCard({
  product,
  locale,
}: {
  product: RoshalProduct;
  locale: RoshalLocale;
}) {
  const name = getLocalizedValue(locale, product.name);
  const summary = getLocalizedValue(locale, product.summary);

  return (
    <Card className="flex h-full flex-col border-border/70 bg-card/90 transition-transform duration-200 hover:-translate-y-1">
      <CardHeader className="space-y-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
          <Image
            src={product.heroImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {getLocalizedValue(locale, product.categoryLabel)}
            </p>
            <h3 className="text-lg font-semibold">{name}</h3>
          </div>
          {product.badge ? (
            <Badge variant="secondary">{product.badge}</Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{summary}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-primary">
            {formatBdt(product.price, locale)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatBdt(product.compareAtPrice, locale)}
            </span>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/products/${product.slug}`}>
            {locale === "bn" ? "বিস্তারিত" : "Details"}
          </Link>
        </Button>
        <AddToCartButton
          product={product}
          locale={locale}
          className="w-full sm:w-auto sm:flex-1"
        />
      </CardFooter>
    </Card>
  );
}
