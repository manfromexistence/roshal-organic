"use client";

import { Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLocalizedValue } from "@/lib/store-locale";
import type { RoshalLocale, RoshalProduct } from "@/lib/store-types";
import { useCartStore } from "@/store/cart-store";

export function ProductPurchasePanel({
  locale,
  product,
}: {
  locale: RoshalLocale;
  product: RoshalProduct;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const updateQuantity = (nextQuantity: number) => {
    setQuantity(
      Math.min(Math.max(nextQuantity, 1), Math.max(product.inventory, 1)),
    );
  };

  const buyNow = () => {
    addItem(product, quantity);
    window.location.assign("/checkout");
  };

  return (
    <div className="space-y-5 rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {locale === "bn" ? "পরিমাণ নির্বাচন" : "Choose quantity"}
          </p>
          <p className="text-sm text-muted-foreground">
            {locale === "bn"
              ? "প্রয়োজন অনুযায়ী পরিমাণ বেছে নিন এবং সরাসরি কার্ট বা চেকআউটে যান।"
              : "Choose the quantity you need and continue to cart or checkout."}
          </p>
        </div>

        <Badge
          variant={product.inventory > 0 ? "secondary" : "destructive"}
          className="rounded-full px-3 py-1"
        >
          {product.inventory > 0
            ? locale === "bn"
              ? `${product.inventory} পিস স্টকে আছে`
              : `${product.inventory} in stock`
            : locale === "bn"
              ? "স্টক শেষ"
              : "Out of stock"}
        </Badge>
      </div>

      <div className="flex w-full items-center rounded-2xl border border-border/70 bg-background">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-none rounded-l-2xl border-r border-border/70"
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
          className="h-12 flex-1 border-0 text-center text-base font-semibold shadow-none focus-visible:ring-0"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-none rounded-r-2xl border-l border-border/70"
          onClick={() => updateQuantity(quantity + 1)}
          disabled={quantity >= product.inventory}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AddToCartButton
          product={product}
          locale={locale}
          quantity={quantity}
          className="w-full rounded-xl"
        />

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl"
          onClick={buyNow}
          disabled={product.inventory <= 0}
        >
          <ShoppingBag className="size-4" />
          {locale === "bn" ? "এখনই কিনুন" : "Buy now"}
        </Button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-muted/30 p-4 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          {locale === "bn"
            ? `SKU: ${product.sku} • ${getLocalizedValue(locale, product.categoryLabel)}`
            : `SKU: ${product.sku} • ${getLocalizedValue(locale, product.categoryLabel)}`}
        </p>
      </div>
    </div>
  );
}
