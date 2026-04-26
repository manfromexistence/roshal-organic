"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocalizedValue, RoshalProduct } from "@/lib/store-types";

export interface CartItem {
  productId: string;
  slug: string;
  name: LocalizedValue;
  image: string;
  price: number;
  quantity: number;
  inventory: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: RoshalProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  syncCatalog: (products: RoshalProduct[]) => {
    adjustedCount: number;
    removedCount: number;
  };
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const existing = get().items.find(
          (item) => item.productId === product.id,
        );

        if (existing) {
          set({
            items: get().items.map((item) =>
              item.productId === product.id
                ? {
                    ...item,
                    quantity: Math.min(
                      item.quantity + quantity,
                      Math.max(product.inventory, 1),
                    ),
                  }
                : item,
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.heroImage,
              price: product.price,
              quantity: Math.min(quantity, Math.max(product.inventory, 1)),
              inventory: product.inventory,
            },
          ],
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter((item) => item.productId !== productId),
          });
          return;
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: Math.min(quantity, Math.max(item.inventory, 1)),
                }
              : item,
          ),
        });
      },
      syncCatalog: (products) => {
        const productMap = new Map(
          products.map((product) => [product.id, product]),
        );
        let adjustedCount = 0;
        let removedCount = 0;

        const nextItems = get().items.flatMap((item) => {
          const product = productMap.get(item.productId);

          if (!product || product.inventory <= 0 || !product.isPublished) {
            removedCount += 1;
            return [];
          }

          const nextQuantity = Math.min(item.quantity, product.inventory);

          if (
            nextQuantity !== item.quantity ||
            item.price !== product.price ||
            item.inventory !== product.inventory ||
            item.slug !== product.slug ||
            item.image !== product.heroImage ||
            item.name.bn !== product.name.bn ||
            item.name.en !== product.name.en
          ) {
            adjustedCount += 1;
          }

          return [
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.heroImage,
              price: product.price,
              quantity: nextQuantity,
              inventory: product.inventory,
            },
          ];
        });

        const hasChanges =
          removedCount > 0 ||
          adjustedCount > 0 ||
          nextItems.length !== get().items.length;

        if (hasChanges) {
          set({ items: nextItems });
        }

        return { adjustedCount, removedCount };
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "roshal-cart",
    },
  ),
);
