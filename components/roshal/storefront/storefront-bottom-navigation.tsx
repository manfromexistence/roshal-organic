"use client";

import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { RoshalLocale } from "@/lib/roshal/types";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function StorefrontBottomNavigation({
  locale,
}: {
  locale: RoshalLocale;
}) {
  const items = useCartStore((state) => state.items);
  const { data: session } = authClient.useSession();
  const ownerKey = session?.user?.id || "guest";
  const [isHydrated, setIsHydrated] = useState(false);
  const syncOwner = useWishlistStore((state) => state.syncOwner);
  const favoriteIds = useWishlistStore(
    (state) => state.favoritesByOwner[ownerKey],
  );
  const favoriteCount = isHydrated ? (favoriteIds?.length ?? 0) : 0;
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      syncOwner(session.user.id);
    }
  }, [session?.user?.id, syncOwner]);

  const links = [
    {
      href: "/",
      label: locale === "bn" ? "হোম" : "Home",
      icon: Home,
    },
    {
      href: "/products",
      label: locale === "bn" ? "খুঁজুন" : "Search",
      icon: Search,
    },
    {
      href: "/favorites",
      label: locale === "bn" ? "পছন্দ" : "Favorites",
      icon: Heart,
      badge: favoriteCount,
    },
    {
      href: "/cart",
      label: locale === "bn" ? "কার্ট" : "Cart",
      icon: ShoppingBag,
      badge: cartCount,
    },
    {
      href: "/profile",
      label: locale === "bn" ? "প্রোফাইল" : "Profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t bg-background/80 backdrop-blur-xl md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{link.label}</span>
                {link.badge ? (
                  <span className="absolute -top-1 right-0 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
