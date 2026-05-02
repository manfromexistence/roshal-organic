"use client";

import {
  ChevronRight,
  MessageCircle,
  Minus,
  PhoneCall,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { FavoriteToggleButton } from "@/components/storefront/favorite-toggle-button";
import { RoshalProductCard } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getWhatsAppHref } from "@/lib/store-contact";
import { formatBdt } from "@/lib/store-format";
import { getLocalizedValue } from "@/lib/store-locale";
import {
  getDefaultRoshalProductPurchaseOption,
  getRoshalProductPurchaseOption,
  getRoshalProductPurchaseOptions,
} from "@/lib/store-product-options";
import type {
  RoshalLocale,
  RoshalProduct,
  RoshalProductReviewBundle,
  RoshalSiteSettings,
} from "@/lib/store-types";
import { useCartStore } from "@/store/cart-store";

function resolveDiscountPercent(price: number, compareAtPrice: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) {
    return null;
  }

  const discount = Math.round(
    ((compareAtPrice - price) / compareAtPrice) * 100,
  );

  return discount > 0 ? discount : null;
}

function normalizePhoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:${digits}` : "/contact";
}

function buildWhatsAppOrderHref(
  locale: RoshalLocale,
  product: RoshalProduct,
  phone: string,
) {
  const base = getWhatsAppHref(phone);

  if (!base) {
    return "/contact";
  }

  const message =
    locale === "bn"
      ? `আমি ${getLocalizedValue(locale, product.name)} অর্ডার করতে চাই।`
      : `I want to order ${getLocalizedValue(locale, product.name)}.`;

  return `${base}?text=${encodeURIComponent(message)}`;
}

export function ProductDetailsPageClient({
  locale,
  product,
  reviewBundle: initialReviewBundle,
  relatedProducts,
  siteSettings,
}: {
  locale: RoshalLocale;
  product: RoshalProduct;
  reviewBundle: RoshalProductReviewBundle;
  relatedProducts: RoshalProduct[];
  siteSettings: RoshalSiteSettings;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewRating, setReviewRating] = useState("none");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewBundle, setReviewBundle] = useState(initialReviewBundle);
  const galleryImages = useMemo(
    () =>
      Array.from(
        new Set([product.heroImage, ...product.gallery].filter(Boolean)),
      ),
    [product.gallery, product.heroImage],
  );
  const [selectedImage, setSelectedImage] = useState(
    galleryImages[0] || product.heroImage,
  );
  const purchaseOptions = useMemo(
    () =>
      getRoshalProductPurchaseOptions(product).filter(
        (option) => option.id !== "default" || option.size || option.amount,
      ),
    [product],
  );
  const [selectedOptionId, setSelectedOptionId] = useState(
    () => getDefaultRoshalProductPurchaseOption(product)?.id || "default",
  );
  const selectedOption = useMemo(
    () => getRoshalProductPurchaseOption(product, selectedOptionId),
    [product, selectedOptionId],
  );
  const effectiveInventory = Math.max(
    0,
    Math.min(product.inventory, selectedOption?.inventory ?? product.inventory),
  );
  const displayPrice = selectedOption?.price ?? product.price;
  const displayCompareAtPrice =
    selectedOption?.compareAtPrice ?? product.compareAtPrice;
  const discountPercent = resolveDiscountPercent(
    displayPrice,
    displayCompareAtPrice,
  );
  const categoryLabel = getLocalizedValue(locale, product.categoryLabel);
  const whatsappHref = buildWhatsAppOrderHref(
    locale,
    product,
    siteSettings.whatsappPhone,
  );
  const callHref = normalizePhoneHref(siteSettings.contactPhone);
  const averageRatingLabel = reviewBundle.averageRating.toFixed(1);
  const reviewDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", {
        dateStyle: "medium",
      }),
    [locale],
  );

  const updateQuantity = (nextQuantity: number) => {
    setQuantity(
      Math.min(Math.max(nextQuantity, 1), Math.max(effectiveInventory, 1)),
    );
  };

  const buyNow = () => {
    addItem(product, quantity, selectedOption?.id);
    window.location.assign("/checkout");
  };

  const reviewPlaceholder =
    locale === "bn"
      ? "এই পণ্যের সম্পর্কে আপনার মতামত লিখুন"
      : "Write your opinion about the product";

  const submitReview = async () => {
    const normalizedMessage = reviewMessage.trim();

    if (!normalizedMessage || reviewRating === "none") {
      toast({
        title:
          locale === "bn"
            ? "রিভিউ জমা দিতে তথ্য পূরণ করুন"
            : "Complete the review details",
        description:
          locale === "bn"
            ? "মতামত এবং রেটিং দুটোই নির্বাচন করতে হবে।"
            : "Please provide both a review message and rating.",
      });
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await fetch(`/api/products/${product.slug}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: Number(reviewRating),
          comment: normalizedMessage,
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        summary?: RoshalProductReviewBundle;
      } | null;

      if (!response.ok || !payload?.summary) {
        throw new Error(
          payload?.error ||
            (locale === "bn"
              ? "রিভিউ সাবমিট করা যায়নি।"
              : "Could not submit the review."),
        );
      }

      setReviewBundle(payload.summary);
      setReviewMessage("");
      setReviewRating("none");
      toast({
        title: locale === "bn" ? "রিভিউ জমা হয়েছে" : "Review submitted",
        description:
          locale === "bn"
            ? "আপনার মতামত এখন পণ্যের রিভিউ তালিকায় দেখা যাবে।"
            : "Your feedback now appears in the product review list.",
      });
    } catch (error) {
      toast({
        title:
          locale === "bn" ? "রিভিউ সাবমিট ব্যর্থ" : "Review submission failed",
        description:
          error instanceof Error
            ? error.message
            : locale === "bn"
              ? "রিভিউ সাবমিট করা যায়নি।"
              : "Could not submit the review.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="container mx-auto min-w-0 space-y-6 overflow-x-clip px-4 py-6 md:space-y-8 md:py-8">
      <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          {locale === "bn" ? "হোম" : "Home"}
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href="/products"
          className="transition-colors hover:text-foreground"
        >
          {locale === "bn" ? "পণ্যসমূহ" : "Products"}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="truncate text-foreground">
          {getLocalizedValue(locale, product.name)}
        </span>
      </div>

      <Card className="overflow-hidden rounded-sm border-border/70 shadow-sm">
        <CardContent className="p-4 md:p-5 lg:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(19rem,0.98fr)] lg:gap-8">
            <div className="min-w-0">
              <div className="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-3 md:grid-cols-[4.25rem_minmax(0,1fr)]">
                <div className="flex flex-col gap-3">
                  {galleryImages.map((image, index) => {
                    const isActive = selectedImage === image;

                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className={`relative aspect-square overflow-hidden rounded-sm border bg-card transition-colors ${
                          isActive
                            ? "border-primary shadow-sm"
                            : "border-border/70 hover:border-primary/40"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${getLocalizedValue(locale, product.name)} ${index + 1}`}
                          fill
                          className="object-contain p-1.5"
                          sizes="80px"
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="relative overflow-hidden rounded-sm border border-border/70 bg-card">
                  <div className="relative aspect-square min-h-[18rem] bg-background md:min-h-[26rem]">
                    <Image
                      src={selectedImage}
                      alt={getLocalizedValue(locale, product.name)}
                      fill
                      priority
                      loading="eager"
                      className="object-contain p-4 md:p-8"
                      sizes="(max-width: 1024px) 100vw, 48vw"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <h1 className="text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                      {getLocalizedValue(locale, product.name)}
                    </h1>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {getLocalizedValue(locale, product.summary)}
                    </p>
                  </div>

                  <FavoriteToggleButton
                    productId={product.id}
                    locale={locale}
                    className="shrink-0 rounded-full border-border/70"
                    iconClassName="size-4"
                    variant="outline"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-3xl font-semibold text-primary md:text-4xl">
                    {formatBdt(displayPrice, locale)}
                  </span>
                  {displayCompareAtPrice ? (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatBdt(displayCompareAtPrice, locale)}
                    </span>
                  ) : null}
                  {discountPercent ? (
                    <Badge className="rounded-sm">
                      {locale === "bn"
                        ? `${discountPercent}% সেভ`
                        : `Save ${discountPercent}%`}
                    </Badge>
                  ) : product.badge ? (
                    <Badge className="rounded-sm">{product.badge}</Badge>
                  ) : null}
                </div>
              </div>

              <Separator />

              {purchaseOptions.length > 0 ? (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {locale === "bn" ? "সাইজ / পরিমাণ" : "Size / amount"}
                  </Label>
                  <Select
                    value={selectedOption?.id || selectedOptionId}
                    onValueChange={(value) => {
                      setSelectedOptionId(value);
                      setQuantity(1);
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {purchaseOptions.map((option) => {
                        const optionLabel =
                          [option.size, option.amount]
                            .filter(Boolean)
                            .join(" ") || "Default";

                        return (
                          <SelectItem key={option.id} value={option.id}>
                            {optionLabel} - {formatBdt(option.price, locale)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {locale === "bn" ? "পরিমাণ" : "Quantity"}
                </Label>
                <div className="flex w-full max-w-[11rem] items-center overflow-hidden rounded-sm border border-border/70 bg-background">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none border-r border-border/70"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>

                  <Input
                    value={String(quantity)}
                    onChange={(event) => {
                      const parsed = Number.parseInt(event.target.value, 10);
                      if (Number.isFinite(parsed)) {
                        updateQuantity(parsed);
                      }
                    }}
                    inputMode="numeric"
                    className="h-10 border-0 text-center text-base font-semibold shadow-none focus-visible:ring-0"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none border-l border-border/70"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= effectiveInventory}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AddToCartButton
                  product={product}
                  locale={locale}
                  quantity={quantity}
                  optionId={selectedOption?.id}
                  disabled={effectiveInventory <= 0}
                  className="h-11 rounded-sm text-sm font-semibold uppercase tracking-wide"
                />

                <Button
                  type="button"
                  className="h-11 rounded-sm text-sm font-semibold uppercase tracking-wide"
                  onClick={buyNow}
                  disabled={effectiveInventory <= 0}
                >
                  <ShoppingBag className="size-4" />
                  {locale === "bn" ? "এখনই কিনুন" : "Buy now"}
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild variant="outline" className="h-11 rounded-sm">
                  <Link
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <MessageCircle className="size-4" />
                    {locale === "bn" ? "হোয়াটসঅ্যাপে অর্ডার" : "Order on WhatsApp"}
                  </Link>
                </Button>

                <Button asChild variant="secondary" className="h-11 rounded-sm">
                  <Link
                    href={callHref}
                    className="inline-flex items-center gap-2"
                  >
                    <PhoneCall className="size-4" />
                    {locale === "bn" ? "কল করে অর্ডার" : "Call for order"}
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-sm border border-border/70 bg-card px-4 py-3 text-sm">
                  <span className="font-medium text-muted-foreground">
                    {locale === "bn" ? "ক্যাটাগরি:" : "Category:"}
                  </span>{" "}
                  <span className="font-semibold text-foreground">
                    {categoryLabel}
                  </span>
                </div>

                <div className="rounded-sm border border-border/70 bg-card px-4 py-3 text-sm">
                  <span className="font-medium text-muted-foreground">
                    SKU:
                  </span>{" "}
                  <span className="font-semibold text-foreground">
                    {product.sku}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="description" className="space-y-4">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start overflow-x-auto border-b border-border/70 p-0"
        >
          <TabsTrigger
            value="description"
            className="rounded-none px-4 py-3 whitespace-nowrap"
          >
            {locale === "bn" ? "বিবরণ" : "Description"}
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none px-4 py-3 whitespace-nowrap"
          >
            {locale === "bn"
              ? `গ্রাহকের মতামত (${reviewBundle.reviewCount})`
              : `Customer reviews (${reviewBundle.reviewCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardHeader className="space-y-3 pb-3">
              <CardTitle className="text-xl">
                {locale === "bn" ? "পণ্যের বিস্তারিত" : "Product details"}
              </CardTitle>
              <div className="h-0.5 w-16 rounded-full bg-primary" />
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-7 text-muted-foreground md:text-[0.95rem]">
                {getLocalizedValue(locale, product.description)}
              </p>

              {product.features.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {locale === "bn" ? "মূল বৈশিষ্ট্য" : "Highlights"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, index) => (
                      <Badge
                        key={`${product.id}-feature-${index}`}
                        variant="secondary"
                        className="rounded-sm px-3 py-1.5"
                      >
                        {getLocalizedValue(locale, feature)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardContent className="grid gap-6 p-5 md:grid-cols-[15rem_minmax(0,1fr)] md:p-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-5xl font-semibold leading-none text-foreground">
                    {averageRatingLabel}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locale === "bn"
                      ? `গড় রেটিং (${reviewBundle.reviewCount} রিভিউ)`
                      : `Average rating (${reviewBundle.reviewCount} reviews)`}
                  </p>
                </div>

                <div className="space-y-2">
                  {reviewBundle.ratingsBreakdown.map((entry) => (
                    <div
                      key={entry.rating}
                      className="grid grid-cols-[4rem_minmax(0,1fr)_2.5rem] items-center gap-2"
                    >
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="size-3.5 fill-current" />
                        <span className="text-xs font-medium">
                          {entry.rating}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${entry.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {entry.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {locale === "bn" ? "আপনার মতামত দিন" : "Submit your review"}
                  </h3>
                  <div className="h-0.5 w-16 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">
                    {locale === "bn"
                      ? "আপনার ইমেইল প্রকাশ করা হবে না। প্রয়োজনীয় ঘরগুলো চিহ্নিত।"
                      : "Your email address will not be published. Required fields are marked."}
                  </p>
                </div>

                <div className="grid gap-4">
                  <Textarea
                    placeholder={reviewPlaceholder}
                    className="min-h-40 rounded-sm"
                    value={reviewMessage}
                    onChange={(event) => setReviewMessage(event.target.value)}
                  />

                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-end">
                    <div className="space-y-2">
                      <Label>{locale === "bn" ? "রেটিং" : "Your rating"}</Label>
                      <Select
                        value={reviewRating}
                        onValueChange={setReviewRating}
                      >
                        <SelectTrigger className="rounded-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            {locale === "bn" ? "একটি সিলেক্ট করুন" : "Select one"}
                          </SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="button"
                      className="rounded-sm"
                      onClick={submitReview}
                      disabled={isSubmittingReview}
                    >
                      {isSubmittingReview
                        ? locale === "bn"
                          ? "রিভিউ জমা হচ্ছে..."
                          : "Submitting..."
                        : locale === "bn"
                          ? "রিভিউ সাবমিট"
                          : "Submit review"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="rounded-sm border-border/70 shadow-sm">
            <CardContent className="grid gap-6 p-5 md:grid-cols-[15rem_minmax(0,1fr)] md:p-6">
              <div className="space-y-4">
                <div className="text-5xl font-semibold leading-none text-foreground">
                  {averageRatingLabel}
                </div>
                <p className="text-sm text-muted-foreground">
                  {reviewBundle.reviewCount > 0
                    ? locale === "bn"
                      ? `${reviewBundle.reviewCount}টি রিভিউ পাওয়া গেছে`
                      : `${reviewBundle.reviewCount} reviews available`
                    : locale === "bn"
                      ? "এখনো কোনো রিভিউ নেই"
                      : "No customer reviews yet"}
                </p>
              </div>
              <div className="space-y-3">
                {reviewBundle.reviews.length > 0 ? (
                  reviewBundle.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-sm border border-border/70 bg-card p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {review.reviewerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reviewDateFormatter.format(
                              new Date(review.createdAt),
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={`${review.id}-star-${index + 1}`}
                              className={`size-4 ${
                                index < review.rating
                                  ? "fill-current"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-sm border border-dashed border-border/70 bg-muted/20 p-5 text-sm leading-7 text-muted-foreground">
                    {locale === "bn"
                      ? "এখনো কোনো রিভিউ যোগ হয়নি। প্রথম রিভিউটি আপনি যোগ করতে পারেন।"
                      : "No reviews have been added yet. Be the first to leave one."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
            <h2 className="text-xl font-semibold text-foreground">
              {locale === "bn" ? "সম্পর্কিত পণ্য" : "Related products"}
            </h2>
            <Link
              href={`/products?category=${product.categoryKey}`}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {locale === "bn" ? "আরও পণ্য" : "More products"}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <RoshalProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                locale={locale}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
