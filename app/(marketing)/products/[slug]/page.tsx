import { CreditCard, Leaf, PhoneCall, Truck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FavoriteToggleButton } from "@/components/storefront/favorite-toggle-button";
import { RoshalProductCard } from "@/components/storefront/product-card";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getRoshalProductBySlug,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { formatBdt } from "@/lib/store-format";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";
import { buildRoshalProductMetadata } from "@/lib/store-seo";

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
  const [product, products, siteSettings] = await Promise.all([
    getRoshalProductBySlug(slug),
    getRoshalProducts(),
    getRoshalSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const galleryImages = Array.from(
    new Set([product.heroImage, ...product.gallery].filter(Boolean)),
  ).slice(0, 4);
  const relatedProducts = products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.isPublished &&
        candidate.categoryKey === product.categoryKey,
    )
    .slice(0, 4);
  const fallbackProducts =
    relatedProducts.length >= 4
      ? relatedProducts
      : [
          ...relatedProducts,
          ...products.filter(
            (candidate) =>
              candidate.id !== product.id &&
              candidate.isPublished &&
              !relatedProducts.some((item) => item.id === candidate.id),
          ),
        ].slice(0, 4);

  return (
    <div className="container mx-auto min-w-0 space-y-12 overflow-x-clip px-4 py-10">
      <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0 space-y-4">
          <Card className="gap-0 overflow-hidden rounded-[2rem] border-border/70 p-0 shadow-sm">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-muted/20">
                <Image
                  src={product.heroImage}
                  alt={getLocalizedValue(locale, product.name)}
                  fill
                  priority
                  loading="eager"
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 48vw"
                />
              </div>
            </CardContent>
          </Card>

          {galleryImages.length > 1 ? (
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {galleryImages.map((image, index) => (
                <Card
                  key={`${image}-${index}`}
                  className="gap-0 overflow-hidden rounded-2xl border-border/70 p-0"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-muted/15">
                      <Image
                        src={image}
                        alt={`${getLocalizedValue(locale, product.name)} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 180px"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>

        <div className="min-w-0 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {getLocalizedValue(locale, product.categoryLabel)}
              </Badge>
              {product.badge ? (
                <Badge className="rounded-full px-3 py-1">
                  {product.badge}
                </Badge>
              ) : null}
              <FavoriteToggleButton
                productId={product.id}
                locale={locale}
                showLabel
                className="rounded-full"
              />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {getLocalizedValue(locale, product.name)}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                {getLocalizedValue(locale, product.summary)}
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <span className="text-4xl font-semibold text-primary">
                {formatBdt(product.price, locale)}
              </span>
              {product.compareAtPrice ? (
                <span className="text-lg text-muted-foreground line-through">
                  {formatBdt(product.compareAtPrice, locale)}
                </span>
              ) : null}
            </div>
          </div>

          <ProductPurchasePanel locale={locale} product={product} />

          <Card className="rounded-3xl border-border/70 shadow-sm">
            <CardContent className="space-y-5 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {locale === "bn"
                      ? "সহায়তা ও অর্ডার সাপোর্ট"
                      : "Support & order assistance"}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {siteSettings.contactPhone}
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {locale === "bn" ? "সরাসরি সহায়তা" : "Direct support"}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                  <Truck className="mb-3 size-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    {locale === "bn" ? "দ্রুত ডেলিভারি" : "Fast delivery"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {locale === "bn"
                      ? "ঢাকা ও দেশের বিভিন্ন জেলায় দ্রুত ডেলিভারি সাপোর্ট।"
                      : "Quick delivery support across Dhaka and major districts."}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                  <CreditCard className="mb-3 size-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    {locale === "bn" ? "নিরাপদ পেমেন্ট" : "Secure payment"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {locale === "bn"
                      ? "কার্ড, bKash, Nagad, Rocket ও Upay সহ নমনীয় পেমেন্ট সাপোর্ট।"
                      : "Flexible card, bKash, Nagad, Rocket, and Upay support."}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                  <Leaf className="mb-3 size-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    {locale === "bn"
                      ? "খাঁটি মানের অঙ্গীকার"
                      : "Pure-quality promise"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {locale === "bn"
                      ? "বিশ্বস্ত উৎস থেকে সংগ্রহ করা মানসম্মত ও খাঁটি পণ্য।"
                      : "Trusted sourcing with a focus on pure, dependable products."}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                  <PhoneCall className="mb-3 size-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    {locale === "bn" ? "অর্ডার সহায়তা" : "Order support"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {locale === "bn"
                      ? "অর্ডার, যাচাই, ডেলিভারি বা পেমেন্ট নিয়ে যেকোনো প্রশ্নে আমাদের সাপোর্ট টিম সহায়তা করবে।"
                      : "Our support team can help with orders, payment review, and delivery updates."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList
          variant="line"
          className="h-auto w-full flex-wrap justify-start border-b border-border/70 p-0"
        >
          <TabsTrigger value="details" className="px-4 py-3">
            {locale === "bn" ? "পণ্যের বিবরণ" : "Product details"}
          </TabsTrigger>
          <TabsTrigger value="features" className="px-4 py-3">
            {locale === "bn" ? "বৈশিষ্ট্য" : "Highlights"}
          </TabsTrigger>
          <TabsTrigger value="shipping" className="px-4 py-3">
            {locale === "bn" ? "ডেলিভারি ও পেমেন্ট" : "Delivery & payment"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="rounded-3xl border-border/70 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold text-foreground">
                {locale === "bn" ? "বিস্তারিত বিবরণ" : "Detailed description"}
              </h2>
              <p className="text-base leading-8 text-muted-foreground">
                {getLocalizedValue(locale, product.description)}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="rounded-3xl border-border/70 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold text-foreground">
                {locale === "bn"
                  ? "এই পণ্যের মূল দিক"
                  : "Why this product stands out"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {product.features.map((feature, index) => (
                  <Badge
                    key={`${product.id}-${index}`}
                    variant="secondary"
                    className="rounded-full px-4 py-2 text-sm"
                  >
                    {getLocalizedValue(locale, feature)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card className="rounded-3xl border-border/70 shadow-sm">
            <CardContent className="grid gap-5 p-6 md:grid-cols-2">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">
                  {locale === "bn" ? "ডেলিভারি তথ্য" : "Delivery information"}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  {locale === "bn"
                    ? "স্টকে থাকা পণ্য দ্রুত প্রসেস করা হয়। অর্ডার নিশ্চিত করার পর আমাদের টিম ডেলিভারি আপডেট শেয়ার করবে।"
                    : "In-stock products are processed quickly. After order confirmation, our team shares delivery updates."}
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">
                  {locale === "bn" ? "পেমেন্ট তথ্য" : "Payment information"}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  {locale === "bn"
                    ? "কার্ড, bKash, Nagad, Rocket, এবং Upay সহ উপলব্ধ অপশন চেকআউটে দেখানো হবে। কিছু পেমেন্ট ম্যানুয়াল ভেরিফিকেশনের মাধ্যমে সম্পন্ন হতে পারে।"
                    : "Available card, bKash, Nagad, Rocket, and Upay options are shown during checkout. Some payment flows may use manual verification."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {locale === "bn" ? "আপনার জন্য আরও" : "More for you"}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {locale === "bn" ? "সম্পর্কিত পণ্য" : "Related products"}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {fallbackProducts.map((relatedProduct) => (
            <RoshalProductCard
              key={relatedProduct.id}
              product={relatedProduct}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
