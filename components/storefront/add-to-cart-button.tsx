"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { RoshalLocale, RoshalProduct } from "@/lib/store-types";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({
  product,
  locale,
  quantity = 1,
  optionId,
  disabled = false,
  className,
}: {
  product: RoshalProduct;
  locale: RoshalLocale;
  quantity?: number;
  optionId?: string;
  disabled?: boolean;
  className?: string;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  return (
    <Button
      className={className}
      onClick={() => {
        addItem(product, quantity, optionId);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      disabled={disabled || product.inventory <= 0}
    >
      <ShoppingBag className="size-4" />
      {disabled || product.inventory <= 0
        ? locale === "bn"
          ? "স্টক শেষ"
          : "Out of stock"
        : added
          ? locale === "bn"
            ? "কার্টে যোগ হয়েছে"
            : "Added"
          : locale === "bn"
            ? "কার্টে যোগ করুন"
            : "Add to cart"}
    </Button>
  );
}
