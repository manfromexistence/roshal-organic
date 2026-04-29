"use client";

import {
  Grid3X3,
  Heart,
  LayoutDashboard,
  Menu,
  PackageSearch,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { getLocalizedValue } from "@/lib/store-locale";
import type { StorefrontTaxonomyGroup } from "@/lib/store-taxonomy";
import type {
  RoshalLocale,
  RoshalMarketingPage,
  RoshalRole,
  RoshalSiteSettings,
} from "@/lib/store-types";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function StorefrontHeader({
  locale,
  pages = [],
  siteSettings,
  sessionUser,
  taxonomy = [],
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
  taxonomy?: StorefrontTaxonomyGroup[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const items = useCartStore((state) => state.items);
  const favoriteIds = useWishlistStore(
    (state) => state.favoritesByOwner[sessionUser?.id || "guest"],
  );
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const favoriteCount = isHydrated ? (favoriteIds?.length ?? 0) : 0;
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
  const activeCategory = searchParams.get("category") || "all";
  const activeSubcategory = searchParams.get("subcategory") || "all";

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

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

  const submitSearch = (value: string) => {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      router.push("/products");
      return;
    }

    router.push(`/products?q=${encodeURIComponent(normalizedValue)}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="border-b border-border/60">
        <div className="container mx-auto flex min-w-0 items-center gap-3 px-4 py-3 md:py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm">
              <Image
                src="/logo.png"
                alt={siteSettings.brandName}
                width={34}
                height={34}
                className="h-8 w-auto object-cover"
              />
            </div>
            <div className="hidden min-w-0 sm:block">
              <span className="block truncate text-lg font-bold text-foreground">
                {siteSettings.brandName}
              </span>
            </div>
          </Link>

          <form
            className="hidden min-w-0 flex-1 md:flex"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(searchQuery);
            }}
          >
            <div className="relative mx-auto flex min-w-0 w-full max-w-2xl items-center">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={
                  locale === "bn"
                    ? "পণ্য, ক্যাটাগরি বা প্রয়োজনীয় কিছু খুঁজুন"
                    : "Search products, categories, or essentials"
                }
                className="h-12 rounded-full border-border/70 bg-muted/35 px-5 pr-14 text-base shadow-none"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-2 h-9 w-9 rounded-full"
                aria-label={locale === "bn" ? "খুঁজুন" : "Search"}
              >
                <Search className="size-5" />
              </Button>
            </div>
          </form>

          <div className="ml-auto hidden items-center gap-1 lg:flex">
            <Button
              asChild
              variant="ghost"
              className="h-auto flex-col gap-1 rounded-xl px-3 py-2 text-xs"
            >
              <Link href="/orders">
                <PackageSearch className="size-5" />
                <span>{locale === "bn" ? "অর্ডার ট্র্যাক" : "Track Order"}</span>
              </Link>
            </Button>

            {sessionUser ? (
              <Button
                asChild
                variant="ghost"
                className="h-auto flex-col gap-1 rounded-xl px-3 py-2 text-xs"
              >
                <Link href="/profile">
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {sessionUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{locale === "bn" ? "প্রোফাইল" : "Account"}</span>
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="ghost"
                className="h-auto flex-col gap-1 rounded-xl px-3 py-2 text-xs"
              >
                <Link href="/login">
                  <User className="size-5" />
                  <span>{locale === "bn" ? "লগইন" : "Sign In"}</span>
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="ghost"
              className="relative h-auto flex-col gap-1 rounded-xl px-3 py-2 text-xs"
            >
              <Link href="/favorites">
                <Heart className="size-5" />
                <span>{locale === "bn" ? "পছন্দ" : "Wishlist"}</span>
                {favoriteCount > 0 ? (
                  <span className="absolute top-1 right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {favoriteCount}
                  </span>
                ) : null}
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="relative h-auto flex-col gap-1 rounded-xl px-3 py-2 text-xs"
            >
              <Link href="/cart">
                <ShoppingBag className="size-5" />
                <span>{locale === "bn" ? "কার্ট" : "Cart"}</span>
                {cartCount > 0 ? (
                  <span className="absolute top-1 right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto flex-col gap-1 rounded-xl px-3 py-2 text-xs"
                >
                  <Grid3X3 className="size-5" />
                  <span>{locale === "bn" ? "আরও" : "More"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>
                  {locale === "bn"
                    ? "দ্রুত সেটিংস ও লিংক"
                    : "Quick settings & links"}
                </DropdownMenuLabel>
                <div className="space-y-3 px-2 py-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                    <span className="text-sm font-medium">
                      {locale === "bn" ? "থিম" : "Theme"}
                    </span>
                    <StorefrontThemeToggle />
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                    <span className="text-sm font-medium">
                      {locale === "bn" ? "ভাষা" : "Language"}
                    </span>
                    <LocaleSwitcher locale={locale} />
                  </div>
                </div>
                <DropdownMenuSeparator />
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
                {sessionUser?.role === "admin" ? (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 size-4" />
                      {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                {sessionUser ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
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
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Link href="/cart" aria-label={locale === "bn" ? "কার্ট" : "Cart"}>
                <ShoppingBag className="size-5" />
                {cartCount > 0 ? (
                  <span className="absolute top-0 right-0 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={locale === "bn" ? "মেনু" : "Menu"}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-3 md:hidden">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(searchQuery);
            }}
          >
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={
                  locale === "bn"
                    ? "পণ্য বা ক্যাটাগরি খুঁজুন"
                    : "Search products or categories"
                }
                className="h-11 rounded-full border-border/70 bg-muted/35 px-4 pr-12"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
              >
                <Search className="size-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden sticky top-[4.5rem] border-b border-border/50 bg-primary text-primary-foreground lg:block z-40">
        <div className="container mx-auto px-4">
          <NavigationMenu viewport={false} className="max-w-none justify-start">
            <NavigationMenuList className="w-full flex-wrap justify-start gap-1.5 py-2">
              {taxonomy.map((group) => {
                if (group.children.length === 0) {
                  return (
                    <NavigationMenuItem key={group.key}>
                      <NavigationMenuLink
                        asChild
                        active={
                          pathname === "/products" &&
                          activeCategory === group.key &&
                          activeSubcategory === "all"
                        }
                        className="rounded-sm bg-transparent px-3 py-2 text-sm font-medium text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground focus:bg-primary-foreground/10 focus:text-primary-foreground data-[active=true]:bg-primary-foreground/14 data-[active=true]:text-primary-foreground"
                      >
                        <Link href={group.href}>
                          {getLocalizedValue(locale, group.label)}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                }

                const triggerActive =
                  pathname === "/products" && activeCategory === group.key;

                return (
                  <NavigationMenuItem key={group.key}>
                    <NavigationMenuTrigger className="h-10 rounded-sm bg-transparent px-3 text-sm font-medium text-primary-foreground/90 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                      {getLocalizedValue(locale, group.label)}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[22rem] rounded-sm border border-border/70 bg-background p-3 shadow-xl">
                      <div className="grid gap-1">
                        {group.children.map((child) => (
                          <NavigationMenuLink
                            key={child.key}
                            asChild
                            active={
                              pathname === "/products" &&
                              activeCategory === group.key &&
                              activeSubcategory === child.key
                            }
                            className="rounded-sm px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/45 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                          >
                            <Link href={child.href}>
                              {getLocalizedValue(locale, child.label)}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                    {triggerActive ? (
                      <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary-foreground/80" />
                    ) : null}
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-80 px-4 py-6">
          <SheetHeader className="sr-only">
            <SheetTitle>
              {locale === "bn" ? "মোবাইল মেনু" : "Mobile menu"}
            </SheetTitle>
            <SheetDescription>
              {locale === "bn"
                ? "à¦¦à§à¦°à§à¦¤ à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨, à¦­à¦¾à¦·à¦¾, à¦•à§à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦à¦¬à¦‚ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦…à¦ªà¦¶à¦¨ à¦¦à§‡à¦–à§à¦¨à¥¤"
                : "Browse quick navigation, language, category, and account actions."}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {locale === "bn" ? "দ্রুত নেভিগেশন" : "Quick navigation"}
              </span>
              <LocaleSwitcher locale={locale} />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4">
              <StorefrontThemeToggle />
              <div className="text-xs text-muted-foreground">
                {locale === "bn" ? "থিম টগল করুন" : "Toggle theme"}
              </div>
            </div>

            <div className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 hover:bg-muted/40"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-3">
              {taxonomy.map((group) => (
                <div
                  key={group.key}
                  className="rounded-2xl border border-border/60 bg-card p-4"
                >
                  <Link
                    href={group.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-foreground"
                  >
                    {getLocalizedValue(locale, group.label)}
                  </Link>
                  <div className="mt-3 grid gap-2">
                    {group.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl bg-muted/35 px-3 py-2 text-sm text-muted-foreground"
                      >
                        {getLocalizedValue(locale, child.label)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {sessionUser ? (
              <div className="grid gap-2">
                <Button asChild variant="outline" className="justify-start">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {locale === "bn" ? "প্রোফাইল" : "Profile"}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link
                    href="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {locale === "bn" ? "পছন্দের তালিকা" : "Wishlist"}
                  </Link>
                </Button>
                {sessionUser.role === "admin" ? (
                  <Button asChild className="justify-start">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                    </Link>
                  </Button>
                ) : null}
                <Button
                  variant="outline"
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
              <div className="grid gap-2">
                <Button asChild variant="outline">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    {locale === "bn" ? "লগইন" : "Login"}
                  </Link>
                </Button>
                <Button asChild>
                  <Link
                    href="/login?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {locale === "bn" ? "সাইন আপ" : "Sign Up"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  );
}
