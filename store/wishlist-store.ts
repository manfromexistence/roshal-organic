"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const GUEST_WISHLIST_OWNER = "guest";

export const EMPTY_WISHLIST_IDS: string[] = [];

interface WishlistState {
  favoritesByOwner: Record<string, string[]>;
  toggleFavorite: (ownerKey: string, productId: string) => void;
  clearFavorites: (ownerKey: string) => void;
  syncOwner: (ownerKey: string) => void;
  isFavorite: (ownerKey: string, productId: string) => boolean;
  favoriteCount: (ownerKey: string) => number;
}

function normalizeOwnerKey(ownerKey: string | null | undefined) {
  return ownerKey?.trim() || GUEST_WISHLIST_OWNER;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      favoritesByOwner: {},
      toggleFavorite: (ownerKey, productId) => {
        const normalizedOwnerKey = normalizeOwnerKey(ownerKey);
        const currentFavorites =
          get().favoritesByOwner[normalizedOwnerKey] || EMPTY_WISHLIST_IDS;
        const nextFavorites = currentFavorites.includes(productId)
          ? currentFavorites.filter((item) => item !== productId)
          : [productId, ...currentFavorites];

        set({
          favoritesByOwner: {
            ...get().favoritesByOwner,
            [normalizedOwnerKey]: nextFavorites,
          },
        });
      },
      clearFavorites: (ownerKey) => {
        const normalizedOwnerKey = normalizeOwnerKey(ownerKey);

        set({
          favoritesByOwner: {
            ...get().favoritesByOwner,
            [normalizedOwnerKey]: [],
          },
        });
      },
      syncOwner: (ownerKey) => {
        const normalizedOwnerKey = normalizeOwnerKey(ownerKey);

        if (normalizedOwnerKey === GUEST_WISHLIST_OWNER) {
          return;
        }

        const state = get();
        const guestFavorites =
          state.favoritesByOwner[GUEST_WISHLIST_OWNER] || EMPTY_WISHLIST_IDS;

        if (!guestFavorites.length) {
          return;
        }

        const userFavorites =
          state.favoritesByOwner[normalizedOwnerKey] || EMPTY_WISHLIST_IDS;
        const nextFavorites = Array.from(
          new Set([...guestFavorites, ...userFavorites]),
        );
        const nextFavoritesByOwner = {
          ...state.favoritesByOwner,
        };

        delete nextFavoritesByOwner[GUEST_WISHLIST_OWNER];

        set({
          favoritesByOwner: {
            ...nextFavoritesByOwner,
            [normalizedOwnerKey]: nextFavorites,
          },
        });
      },
      isFavorite: (ownerKey, productId) => {
        const normalizedOwnerKey = normalizeOwnerKey(ownerKey);
        return (
          get().favoritesByOwner[normalizedOwnerKey]?.includes(productId) ||
          false
        );
      },
      favoriteCount: (ownerKey) => {
        const normalizedOwnerKey = normalizeOwnerKey(ownerKey);
        return get().favoritesByOwner[normalizedOwnerKey]?.length || 0;
      },
    }),
    {
      name: "roshal-wishlist",
      version: 1,
    },
  ),
);
