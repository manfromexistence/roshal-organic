"use client";

import {
  Heart,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LocaleSwitcher } from "@/components/storefront/locale-switcher";
import { StorefrontThemeToggle } from "@/components/storefront/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { getLocalizedValue } from "@/lib/store-locale";
import type {
  RoshalLocale,
  RoshalMarketingPage,
  RoshalRole,
  RoshalSiteSettings,
} from "@/lib/store-types";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

interface StorefrontCategoryLink {
  href: string;
  label: string;
}

export function StorefrontHeader({
  locale,
  pages = [],
  siteSettings,
  sessionUser,
  categories = [],
}: {
  locale: RoshalLocale;
  pages?: RoshalMarketingPage[];
  siteSettings: RoshalSiteSettings;
  sessionUser: {
    id: string;
    name: string;
    email: string;
    role: RoshalRole;
  } | null;
  categories?: StorefrontCategoryLink[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const items = useCartStore((state) => state.items);
  const favoriteIds = useWishlistStore(
    (state) => state.favoritesByOwner[sessionUser?.id || "guest"],
  );
  const favoriteCount = isHydrated ? (favoriteIds?.length ?? 0) : 0;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const navLinks = [
    {
      href: "/",
      label: getLocalizedValue(
        locale,
        pages.find((page) => page.slug === "home")?.navigationLabel || {
          bn: "হোম",
          en: "Home",
        },
      ),
    },
    ...pages
      .filter((page) => page.slug !== "home")
      .map((page) => ({
        href: `/${page.slug}`,
        label: getLocalizedValue(locale, page.navigationLabel),
      })),
    {
      href: "/products",
      label: locale === "bn" ? "পণ্যসমূহ" : "Products",
    },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.replace("/login");
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="border-b">
        <div className="relative container mx-auto flex items-center justify-between gap-2 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2 md:gap-3">
            <Image
              src="/logo.png"
              alt={siteSettings.brandName}
              width={40}
              height={40}
              className="h-10 w-auto rounded-md"
            />
            <div className="min-w-0">
              <span className="block truncate text-base font-bold text-foreground md:text-lg">
                {siteSettings.brandName}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 pr-10 md:pr-0 md:gap-2">
            <div className="hidden sm:block">
              <StorefrontThemeToggle />
            </div>
            <LocaleSwitcher locale={locale} />

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative hidden sm:inline-flex"
            >
              <Link
                href="/favorites"
                aria-label={locale === "bn" ? "পছন্দের তালিকা" : "Favorites"}
              >
                <Heart className="size-5" />
                <span className="sr-only">
                  {locale === "bn" ? "পছন্দের তালিকা" : "Favorites"}
                </span>
                {favoriteCount > 0 ? (
                  <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {favoriteCount}
                  </span>
                ) : null}
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative hidden sm:inline-flex"
            >
              <Link href="/cart" aria-label={locale === "bn" ? "কার্ট" : "Cart"}>
                <ShoppingBag className="size-5" />
                <span className="sr-only">
                  {locale === "bn" ? "কার্ট" : "Cart"}
                </span>
                {cartCount > 0 ? (
                  <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            </Button>

            {sessionUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {sessionUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{sessionUser.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sessionUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sessionUser.role === "admin" ? (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {locale === "bn" ? "প্রোফাইল" : "Profile"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      {locale === "bn" ? "পছন্দের তালিকা" : "Favorites"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      {locale === "bn" ? "অর্ডার" : "Orders"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="cursor-pointer"
                  >
                    {isLoggingOut
                      ? locale === "bn"
                        ? "লগআউট হচ্ছে..."
                        : "Logging out..."
                      : locale === "bn"
                        ? "লগআউট"
                        : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    {locale === "bn" ? "লগইন" : "Login"}
                  </Button>
                </Link>
                <Link href="/login?mode=signup">
                  <Button size="sm">
                    {locale === "bn" ? "সাইন আপ" : "Sign Up"}
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-4 -translate-y-1/2 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="right" className="w-72 p-4 pt-0">
                <div className="mt-8 flex flex-col gap-6">
                  <div className="flex items-center gap-2 sm:hidden">
                    <StorefrontThemeToggle />
                  </div>
                  <nav className="flex flex-col gap-4 px-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {sessionUser ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/favorites"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {locale === "bn" ? "পছন্দের তালিকা" : "Favorites"}
                        </Button>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {locale === "bn" ? "আমার অর্ডার" : "My orders"}
                        </Button>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {locale === "bn" ? "প্রোফাইল" : "Profile"}
                        </Button>
                      </Link>
                      {sessionUser.role === "admin" ? (
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button className="w-full justify-start">
                            {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                          </Button>
                        </Link>
                      ) : null}
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut
                          ? locale === "bn"
                            ? "লগআউট হচ্ছে..."
                            : "Logging out..."
                          : locale === "bn"
                            ? "লগআউট"
                            : "Logout"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          {locale === "bn" ? "লগইন" : "Login"}
                        </Button>
                      </Link>
                      <Link
                        href="/login?mode=signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full">
                          {locale === "bn" ? "সাইন আপ" : "Sign Up"}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="min-w-full border-b">
        <div className="container mx-auto overflow-hidden px-4">
          <nav
            aria-label={locale === "bn" ? "দ্রুত ক্যাটাগরি" : "Quick categories"}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3 md:flex-nowrap md:gap-x-6 md:overflow-hidden"
          >
            {categories.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
