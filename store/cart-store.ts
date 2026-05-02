"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRoshalProductPurchaseOption } from "@/lib/store-product-options";
import type { LocalizedValue, RoshalProduct } from "@/lib/store-types";

export interface CartItem {
  selectionKey: string;
  productId: string;
  slug: string;
  name: LocalizedValue;
  image: string;
  price: number;
  quantity: number;
  inventory: number;
  optionId?: string;
  optionSize?: string;
  optionAmount?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (
    product: RoshalProduct,
    quantity?: number,
    optionId?: string,
  ) => void;
  updateQuantity: (selectionKey: string, quantity: number) => void;
  syncCatalog: (products: RoshalProduct[]) => {
    adjustedCount: number;
    removedCount: number;
  };
  removeItem: (selectionKey: string) => void;
  clearCart: () => void;
}

function getSelectionKey(productId: string, optionId?: string | null) {
  return `${productId}::${optionId?.trim() || "default"}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, optionId) => {
        const selectedOption = getRoshalProductPurchaseOption(
          product,
          optionId,
        );

        if (
          product.inventory <= 0 ||
          !product.isPublished ||
          !selectedOption ||
          selectedOption.inventory <= 0
        ) {
          return;
        }

        const selectionKey = getSelectionKey(product.id, selectedOption.id);
        const existing = get().items.find(
          (item) => item.selectionKey === selectionKey,
        );
        const nextInventory = Math.max(
          0,
          Math.min(product.inventory, selectedOption.inventory),
        );

        if (existing) {
          set({
            items: get().items.map((item) =>
              item.selectionKey === selectionKey
                ? {
                    ...item,
                    quantity: Math.min(
                      item.quantity + quantity,
                      Math.max(nextInventory, 1),
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
              selectionKey,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.heroImage,
              price: selectedOption.price,
              quantity: Math.min(quantity, Math.max(nextInventory, 1)),
              inventory: nextInventory,
              optionId: selectedOption.id,
              optionSize: selectedOption.size || undefined,
              optionAmount: selectedOption.amount || undefined,
            },
          ],
        });
      },
      updateQuantity: (selectionKey, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter(
              (item) =>
                item.selectionKey !== selectionKey &&
                item.productId !== selectionKey,
            ),
          });
          return;
        }

        set({
          items: get().items.map((item) =>
            item.selectionKey === selectionKey
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
          const selectedOption = product
            ? getRoshalProductPurchaseOption(product, item.optionId)
            : null;

          if (
            !product ||
            product.inventory <= 0 ||
            !product.isPublished ||
            !selectedOption ||
            selectedOption.inventory <= 0
          ) {
            removedCount += 1;
            return [];
          }

          const nextInventory = Math.max(
            0,
            Math.min(product.inventory, selectedOption.inventory),
          );
          const nextQuantity = Math.min(item.quantity, nextInventory);
          const nextSelectionKey = getSelectionKey(
            product.id,
            selectedOption.id,
          );

          if (
            nextQuantity !== item.quantity ||
            item.price !== selectedOption.price ||
            item.inventory !== nextInventory ||
            item.slug !== product.slug ||
            item.image !== product.heroImage ||
            item.name.bn !== product.name.bn ||
            item.name.en !== product.name.en ||
            item.optionId !== selectedOption.id ||
            item.optionSize !== (selectedOption.size || undefined) ||
            item.optionAmount !== (selectedOption.amount || undefined) ||
            item.selectionKey !== nextSelectionKey
          ) {
            adjustedCount += 1;
          }

          return [
            {
              selectionKey: nextSelectionKey,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.heroImage,
              price: selectedOption.price,
              quantity: nextQuantity,
              inventory: nextInventory,
              optionId: selectedOption.id,
              optionSize: selectedOption.size || undefined,
              optionAmount: selectedOption.amount || undefined,
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
      removeItem: (selectionKey) => {
        set({
          items: get().items.filter(
            (item) =>
              item.selectionKey !== selectionKey &&
              item.productId !== selectionKey,
          ),
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
