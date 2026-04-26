"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { RoshalLocale } from "@/lib/roshal/types";
import { cn } from "@/lib/utils";
import { EMPTY_WISHLIST_IDS, useWishlistStore } from "@/store/wishlist-store";

interface FavoriteToggleButtonProps {
  productId: string;
  locale: RoshalLocale;
  className?: string;
  iconClassName?: string;
  showLabel?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "sm" | "default" | "icon";
}

export function FavoriteToggleButton({
  productId,
  locale,
  className,
  iconClassName,
  showLabel = false,
  variant = "outline",
  size = showLabel ? "default" : "icon",
}: FavoriteToggleButtonProps) {
  const { data: session } = authClient.useSession();
  const ownerKey = session?.user?.id || "guest";
  const [isHydrated, setIsHydrated] = useState(false);
  const syncOwner = useWishlistStore((state) => state.syncOwner);
  const favoriteIds = useWishlistStore(
    (state) => state.favoritesByOwner[ownerKey],
  );
  const toggleFavorite = useWishlistStore((state) => state.toggleFavorite);
  const isFavorite = isHydrated
    ? (favoriteIds ?? EMPTY_WISHLIST_IDS).includes(productId)
    : false;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      syncOwner(session.user.id);
    }
  }, [session?.user?.id, syncOwner]);

  const label = isFavorite
    ? locale === "bn"
      ? "পছন্দের তালিকায় আছে"
      : "Saved"
    : locale === "bn"
      ? "পছন্দে রাখুন"
      : "Save";

  return (
    <Button
      type="button"
      variant={isFavorite ? "default" : variant}
      size={size}
      className={className}
      onClick={() => toggleFavorite(ownerKey, productId)}
      aria-pressed={isFavorite}
      aria-label={label}
    >
      <Heart
        className={cn("size-4", isFavorite && "fill-current", iconClassName)}
      />
      {showLabel ? label : null}
    </Button>
  );
}
