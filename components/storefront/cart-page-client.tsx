"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatBdt } from "@/lib/store-format";
import { ROSHAL_STANDARD_SHIPPING_FEE } from "@/lib/store-orders";
import type { RoshalLocale, RoshalProduct } from "@/lib/store-types";
import { useCartStore } from "@/store/cart-store";

export function CartPageClient({
  locale,
  products,
}: {
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

  return (
    <div className="container mx-auto grid min-w-0 gap-8 px-4 py-10 lg:grid-cols-[1fr,22rem]">
      <div className="min-w-0 space-y-4">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "কার্ট" : "Cart"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {locale === "bn" ? "আপনার নির্বাচিত পণ্য" : "Your selected products"}
          </h1>
        </div>

        {syncMessage ? (
          <Alert>
            <AlertDescription>{syncMessage}</AlertDescription>
          </Alert>
        ) : null}

        {!isHydrated ? (
          <Card>
            <CardContent className="space-y-4 p-8 text-center">
              <p className="text-muted-foreground">
                {locale === "bn"
                  ? "আপনার সংরক্ষিত কার্ট লোড হচ্ছে..."
                  : "Loading your saved cart..."}
              </p>
            </CardContent>
          </Card>
        ) : visibleItems.length === 0 ? (
          <Card>
            <CardContent className="space-y-4 p-8 text-center">
              <p className="text-muted-foreground">
                {locale === "bn" ? "কার্ট এখন খালি।" : "Your cart is empty."}
              </p>
              <Button asChild>
                <Link href="/products">
                  {locale === "bn" ? "পণ্য দেখুন" : "Browse products"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          visibleItems.map((item) => (
            <Card key={item.productId}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row">
                <div className="relative h-32 overflow-hidden rounded-xl border bg-muted sm:w-40">
                  <Image
                    src={item.image}
                    alt={locale === "bn" ? item.name.bn : item.name.en}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      {locale === "bn" ? item.name.bn : item.name.en}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {formatBdt(item.price, locale)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-border/70 px-2 py-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="size-4" />
                      {locale === "bn" ? "বাদ দিন" : "Remove"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="h-fit lg:sticky lg:top-6">
        <CardHeader className="pb-0">
          <CardTitle>
            {locale === "bn" ? "অর্ডার সারাংশ" : "Order summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 py-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {locale === "bn" ? "পণ্য মূল্য" : "Subtotal"}
            </span>
            <span>{formatBdt(subtotal, locale)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {locale === "bn" ? "ডেলিভারি" : "Delivery"}
            </span>
            <span>
              {formatBdt(
                visibleItems.length > 0 ? ROSHAL_STANDARD_SHIPPING_FEE : 0,
                locale,
              )}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          <div className="flex w-full items-center justify-between text-lg font-semibold">
            <span>{locale === "bn" ? "মোট" : "Total"}</span>
            <span className="text-primary">
              {formatBdt(
                subtotal +
                  (visibleItems.length > 0 ? ROSHAL_STANDARD_SHIPPING_FEE : 0),
                locale,
              )}
            </span>
          </div>
          <Button
            asChild
            className="w-full"
            disabled={!isHydrated || visibleItems.length === 0}
          >
            <Link href="/checkout">
              {locale === "bn" ? "চেকআউট" : "Checkout"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
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
      return "লাইভ স্টকের সাথে মিলিয়ে কিছু পণ্যের পরিমাণ কমানো হয়েছে এবং অনুপলভ্য পণ্য কার্ট থেকে সরানো হয়েছে।";
    }

    if (removedCount > 0) {
      return "অনুপলভ্য বা স্টক শেষ হওয়া পণ্য কার্ট থেকে সরানো হয়েছে।";
    }

    return "লাইভ স্টকের সাথে মিলিয়ে কার্টের কিছু পরিমাণ আপডেট করা হয়েছে।";
  }

  if (adjustedCount > 0 && removedCount > 0) {
    return "Your cart was synced with live stock: some quantities were reduced and unavailable products were removed.";
  }

  if (removedCount > 0) {
    return "Unavailable or sold-out products were removed from your cart.";
  }

  return "Your cart quantities were updated to match live stock.";
}
