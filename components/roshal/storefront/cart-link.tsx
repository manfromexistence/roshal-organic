"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export function CartLink({ label }: { label: string }) {
  const items = useCartStore((state) => state.items);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  return (
    <Button asChild variant="outline" size="sm" className="gap-2">
      <Link href="/cart">
        <ShoppingBag className="size-4" />
        <span>{label}</span>
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {count}
        </span>
      </Link>
    </Button>
  );
}
