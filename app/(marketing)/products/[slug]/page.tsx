import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/roshal/storefront/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getRoshalProductBySlug } from "@/lib/roshal/content";
import { formatBdt } from "@/lib/roshal/format";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import { getLocalizedValue } from "@/lib/roshal/locale";
import { buildRoshalProductMetadata } from "@/lib/roshal/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getRoshalLocale()]);
  const product = await getRoshalProductBySlug(slug);

  if (!product) {
    return undefined;
  }

  return buildRoshalProductMetadata(product, locale);
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getRoshalLocale()]);
  const product = await getRoshalProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1fr,0.95fr]">
      <div className="relative min-h-[26rem] overflow-hidden rounded-[2rem] border bg-muted">
        <Image
          src={product.heroImage}
          alt={getLocalizedValue(locale, product.name)}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 52vw"
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {getLocalizedValue(locale, product.categoryLabel)}
            </Badge>
            {product.badge ? (
              <Badge variant="outline">{product.badge}</Badge>
            ) : null}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">
            {getLocalizedValue(locale, product.name)}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            {getLocalizedValue(locale, product.description)}
          </p>
        </div>

        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-semibold text-primary">
            {formatBdt(product.price, locale)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-base text-muted-foreground line-through">
              {formatBdt(product.compareAtPrice, locale)}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {product.features.map((feature, index) => (
            <span
              key={`${product.id}-${index}`}
              className="rounded-full border border-border/70 bg-card px-3 py-1 text-sm text-muted-foreground"
            >
              {getLocalizedValue(locale, feature)}
            </span>
          ))}
        </div>

        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {locale === "bn" ? "স্টক" : "Inventory"}
              </p>
              <p className="text-lg font-semibold">{product.inventory}</p>
            </div>
            <AddToCartButton
              product={product}
              locale={locale}
              className="w-full sm:w-auto"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
