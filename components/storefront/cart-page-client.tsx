"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getRoshalDeliveryMatchLabel,
  getRoshalDeliveryZoneLabel,
  resolveRoshalDeliveryEstimate,
} from "@/lib/store-delivery";
import { formatBdt } from "@/lib/store-format";
import { getLocalizedValue } from "@/lib/store-locale";
import type {
  RoshalDeliveryZone,
  RoshalLocale,
  RoshalProduct,
} from "@/lib/store-types";
import { useCartStore } from "@/store/cart-store";

export function CartPageClient({
  deliveryZones,
  locale,
  products,
}: {
  deliveryZones: RoshalDeliveryZone[];
  locale: RoshalLocale;
  products: RoshalProduct[];
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const syncCatalog = useCartStore((state) => state.syncCatalog);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const visibleItems = isHydrated ? items : [];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const result = syncCatalog(products);

    if (result.adjustedCount > 0 || result.removedCount > 0) {
      setSyncMessage(
        getCartSyncMessage(locale, result.adjustedCount, result.removedCount),
      );
      return;
    }

    setSyncMessage(null);
  }, [isHydrated, locale, products, syncCatalog]);

  const subtotal = visibleItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryEstimate = resolveRoshalDeliveryEstimate({
    itemCount: visibleItems.length,
    zones: deliveryZones,
  });
  const shippingFee = deliveryEstimate.fee;
  const total = subtotal + shippingFee;

  return (
    <div className="container mx-auto space-y-8 px-4 py-10">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          {locale === "bn" ? "শপিং কার্ট" : "Shopping Cart"}
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {locale === "bn" ? "আপনার নির্বাচিত পণ্য" : "Your selected products"}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              {locale === "bn"
                ? "পরিমাণ আপডেট করুন, অনুপস্থিত আইটেম সরান, এবং অর্ডার সম্পূর্ণ করার আগে সবকিছু যাচাই করুন।"
                : "Update quantities, remove unavailable items, and review everything before checkout."}
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-full">
            <Link href="/products">
              <ShoppingBag className="size-4" />
              {locale === "bn" ? "আরও পণ্য দেখুন" : "Continue shopping"}
            </Link>
          </Button>
        </div>
      </div>

      {syncMessage ? (
        <Alert>
          <AlertDescription>{syncMessage}</AlertDescription>
        </Alert>
      ) : null}

      {!isHydrated ? (
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="p-8 text-center text-muted-foreground">
            {locale === "bn"
              ? "আপনার সংরক্ষিত কার্ট লোড হচ্ছে..."
              : "Loading your saved cart..."}
          </CardContent>
        </Card>
      ) : visibleItems.length === 0 ? (
        <Card className="rounded-3xl border-border/70 shadow-sm">
          <CardContent className="space-y-4 p-10 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              {locale === "bn" ? "কার্ট এখন খালি" : "Your cart is empty"}
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-7 text-muted-foreground">
              {locale === "bn"
                ? "আপনার পছন্দের অর্গানিক পণ্য বেছে নিতে আবার ক্যাটালগে ফিরে যান।"
                : "Go back to the catalog and pick the pantry essentials you want to order."}
            </p>
            <Button asChild className="rounded-full px-8">
              <Link href="/products">
                {locale === "bn" ? "পণ্যসমূহ দেখুন" : "Browse products"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-4">
            {visibleItems.map((item) => (
              <Card
                key={item.productId}
                className="overflow-hidden rounded-3xl border-border/70 shadow-sm"
              >
                <CardContent className="grid gap-5 p-5 md:grid-cols-[10rem_minmax(0,1fr)] md:p-6">
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative block overflow-hidden rounded-2xl border border-border/60 bg-muted/25"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={item.image}
                        alt={locale === "bn" ? item.name.bn : item.name.en}
                        fill
                        className="object-cover p-4"
                        sizes="160px"
                      />
                    </div>
                  </Link>

                  <div className="space-y-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-xl font-semibold text-foreground transition-colors hover:text-primary"
                        >
                          {locale === "bn" ? item.name.bn : item.name.en}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="secondary" className="rounded-full">
                            {formatBdt(item.price, locale)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {locale === "bn"
                              ? `লাইন মোট: ${formatBdt(item.price * item.quantity, locale)}`
                              : `Line total: ${formatBdt(item.price * item.quantity, locale)}`}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="size-4" />
                        {locale === "bn" ? "বাদ দিন" : "Remove"}
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center rounded-full border border-border/70 bg-background">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="min-w-10 text-center text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {locale === "bn"
                          ? "কার্টে পরিমাণ আপডেট করলেই মোট মূল্য স্বয়ংক্রিয়ভাবে পরিবর্তন হবে।"
                          : "Updating the quantity here automatically updates the order total."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit rounded-3xl border-border/70 shadow-sm lg:sticky lg:top-28">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">
                {locale === "bn" ? "অর্ডার সারাংশ" : "Order summary"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {locale === "bn"
                  ? "চেকআউটের আগে আপনার খরচ ও ডেলিভারি চার্জ যাচাই করুন।"
                  : "Review your subtotal and delivery charge before checkout."}
              </p>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {locale === "bn" ? "পণ্য মূল্য" : "Subtotal"}
                </span>
                <span className="font-medium text-foreground">
                  {formatBdt(subtotal, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {locale === "bn" ? "ডেলিভারি" : "Delivery"}
                </span>
                <span className="font-medium text-foreground">
                  {formatBdt(shippingFee, locale)}
                </span>
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                {locale === "bn"
                  ? `${getRoshalDeliveryZoneLabel(locale, deliveryEstimate.zone)} • ${getLocalizedValue(locale, getRoshalDeliveryMatchLabel(deliveryEstimate.matchedBy))}. চূড়ান্ত চার্জ চেকআউটে লোকেশন অনুযায়ী মিলবে।`
                  : `${getRoshalDeliveryZoneLabel(locale, deliveryEstimate.zone)} • ${getLocalizedValue(locale, getRoshalDeliveryMatchLabel(deliveryEstimate.matchedBy))}. Final delivery is recalculated at checkout based on location.`}
              </p>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">
                  {locale === "bn" ? "মোট" : "Total"}
                </span>
                <span className="text-2xl font-semibold text-primary">
                  {formatBdt(total, locale)}
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                asChild
                className="w-full rounded-xl"
                disabled={!isHydrated || visibleItems.length === 0}
              >
                <Link href="/checkout">
                  {locale === "bn" ? "চেকআউট করুন" : "Proceed to checkout"}
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href="/products">
                  {locale === "bn" ? "আরও পণ্য যোগ করুন" : "Add more products"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

function getCartSyncMessage(
  locale: RoshalLocale,
  adjustedCount: number,
  removedCount: number,
) {
  if (locale === "bn") {
    if (adjustedCount > 0 && removedCount > 0) {
      return "লাইভ স্টকের সঙ্গে মিলিয়ে কিছু পণ্যের পরিমাণ কমানো হয়েছে এবং অনুপলভ্য পণ্য কার্ট থেকে সরানো হয়েছে।";
    }

    if (removedCount > 0) {
      return "অনুপলভ্য বা স্টক শেষ হওয়া পণ্য কার্ট থেকে সরানো হয়েছে।";
    }

    return "লাইভ স্টকের সঙ্গে মিলিয়ে কার্টের কিছু পরিমাণ আপডেট করা হয়েছে।";
  }

  if (adjustedCount > 0 && removedCount > 0) {
    return "Your cart was synced with live stock: some quantities were reduced and unavailable products were removed.";
  }

  if (removedCount > 0) {
    return "Unavailable or sold-out products were removed from your cart.";
  }

  return "Your cart quantities were updated to match live stock.";
}
