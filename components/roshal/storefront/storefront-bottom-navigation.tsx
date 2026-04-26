"use client";

import { Home, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { RoshalLocale } from "@/lib/roshal/types";
import { useCartStore } from "@/store/cart-store";

export function StorefrontBottomNavigation({
  locale,
}: {
  locale: RoshalLocale;
}) {
  const items = useCartStore((state) => state.items);
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

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
