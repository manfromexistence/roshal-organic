"use client";

import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-transparent border-t backdrop-blur-xl md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href="/products"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Link>
          <Link
            href="/favorites"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">Wishlist</span>
          </Link>
          <Link
            href="/cart"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs">Cart</span>
          </Link>
          <Link
            href="/account"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
