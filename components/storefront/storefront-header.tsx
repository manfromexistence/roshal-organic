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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { getLocalizedValue } from "@/lib/store-locale";
import type { StorefrontTaxonomyGroup } from "@/lib/store-taxonomy";
import type {
  RoshalLocale,
  RoshalMarketingPage,
  RoshalRole,
  RoshalSiteSettings,
} from "@/lib/store-types";
import { cn } from "@/lib/utils";
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
  const [hideDesktopTopBar, setHideDesktopTopBar] = useState(false);
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
  const visibleDesktopTaxonomy = taxonomy.slice(0, 7);
  const overflowDesktopTaxonomy = taxonomy.slice(7);
  const overflowCategoryKeys = new Set(
    overflowDesktopTaxonomy.map((group) => group.key),
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const isDesktop = window.innerWidth >= 1024;
      const currentScrollY = window.scrollY;

      if (!isDesktop) {
        setHideDesktopTopBar(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY < 72) {
        setHideDesktopTopBar(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY + 8) {
        setHideDesktopTopBar(true);
      } else if (currentScrollY < lastScrollY - 8) {
        setHideDesktopTopBar(false);
      }

      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

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
    <>
      <header className="fixed inset-x-0 top-0 z-[60] bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/88">
        <div
          className={cn(
            "h-15 lg:h-17 border-b border-border/60 transition-transform duration-300 ease-out lg:will-change-transform",
            hideDesktopTopBar && "lg:-translate-y-[calc(100%+1px)]",
          )}
        >
          <div className="container mx-auto flex min-w-0 items-center gap-3 px-4 py-2.5 md:py-3 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/60 bg-card shadow-sm">
                <Image
                  src="/logo.png"
                  alt={siteSettings.brandName}
                  width={42}
                  height={42}
                  className="h-9 w-auto object-contain dark:hidden"
                />
                <Image
                  src="/logo-light.png"
                  alt={siteSettings.brandName}
                  width={42}
                  height={42}
                  className="hidden h-9 w-auto object-contain dark:block rounded-md"
                />
              </div>
              <div className="hidden min-w-0 sm:block">
                <span className="font-wordmark block truncate text-[1.3rem] leading-none text-foreground sm:text-[1.4rem]">
                  {siteSettings.brandName}
                </span>
              </div>
            </Link>

            <form
              className="hidden min-w-0 flex-1 lg:flex lg:items-center"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch(searchQuery);
              }}
            >
              <div className="relative mx-auto flex min-w-0 w-full max-w-xl items-center">
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={
                    locale === "bn"
                      ? "পণ্য, ক্যাটাগরি, বা প্রয়োজনীয় কিছু খুঁজুন"
                      : "Search products, categories, or essentials"
                  }
                  className="h-10 rounded-full border-border/70 bg-muted/40 px-4 pr-12 text-sm shadow-none"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1.5 h-7 w-7 rounded-full"
                  aria-label={locale === "bn" ? "খুঁজুন" : "Search"}
                >
                  <Search className="size-4" />
                </Button>
              </div>
            </form>

            <div className="ml-auto hidden items-center justify-self-end gap-1 lg:flex">
              <Button
                asChild
                variant="ghost"
                className="h-auto flex-col items-center justify-center gap-0.5 rounded-md px-2.5 py-1.5 text-[11px] text-foreground"
              >
                <Link href="/track-order">
                  <PackageSearch className="size-5" />
                  <span>{locale === "bn" ? "ট্র্যাক অর্ডার" : "Track Order"}</span>
                </Link>
              </Button>

              {sessionUser ? (
                <Button
                  asChild
                  variant="ghost"
                  className="h-auto flex-col items-center justify-center gap-0.5 rounded-md px-2.5 py-1.5 text-[11px] text-foreground"
                >
                  <Link href="/profile">
                    <Avatar className="size-6 ring-1 ring-border/70">
                      <AvatarFallback className="themed-avatar-fallback border border-border/60 bg-primary/10 text-primary dark:border-border/70 dark:bg-[color:color-mix(in_oklch,var(--card)_58%,var(--primary)_42%)] dark:text-foreground">
                        {sessionUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{locale === "bn" ? "অ্যাকাউন্ট" : "Account"}</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  className="h-auto flex-col items-center justify-center gap-0.5 rounded-md px-2.5 py-1.5 text-[11px] text-foreground"
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
                className="relative h-auto flex-col items-center justify-center gap-0.5 rounded-md px-2.5 py-1.5 text-[11px] text-foreground"
              >
                <Link href="/favorites">
                  <Heart className="size-5" />
                  <span>{locale === "bn" ? "পছন্দ" : "Wishlist"}</span>
                  {favoriteCount > 0 ? (
                    <span className="absolute right-1 top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      {favoriteCount}
                    </span>
                  ) : null}
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="relative h-auto flex-col items-center justify-center gap-0.5 rounded-md px-2.5 py-1.5 text-[11px] text-foreground"
              >
                <Link href="/cart">
                  <ShoppingBag className="size-5" />
                  <span>{locale === "bn" ? "কার্ট" : "Cart"}</span>
                  {cartCount > 0 ? (
                    <span className="absolute right-1 top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto flex-col items-center justify-center gap-0.5 rounded-md px-2.5 py-1.5 text-[11px] text-foreground"
                  >
                    <Grid3X3 className="size-5" />
                    <span>{locale === "bn" ? "আরও" : "More"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>
                    {locale === "bn" ? "দ্রুত লিংক" : "Quick links"}
                  </DropdownMenuLabel>
                  <div className="space-y-3 px-2 py-2">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/30 p-3">
                      <span className="text-sm font-medium">
                        {locale === "bn" ? "থিম" : "Theme"}
                      </span>
                      <StorefrontThemeToggle />
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/30 p-3">
                      <span className="text-sm font-medium">
                        {locale === "bn" ? "à¦­à¦¾à¦·à¦¾" : "Language"}
                      </span>
                      <LocaleSwitcher locale={locale} className="h-8" />
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
              <LocaleSwitcher locale={locale} />
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative rounded-md"
              >
                <Link
                  href="/cart"
                  aria-label={locale === "bn" ? "কার্ট" : "Cart"}
                >
                  <ShoppingBag className="size-5" />
                  {cartCount > 0 ? (
                    <span className="absolute right-0 top-0 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md"
                onClick={() => setMobileMenuOpen(true)}
                aria-label={locale === "bn" ? "মেনু" : "Menu"}
              >
                <Menu className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-x-0 z-10 hidden bg-primary dark:bg-primary/90 shadow-sm backdrop-blur transition-[top] duration-300 lg:block",
          hideDesktopTopBar ? "top-0" : "top-[4.5rem]",
        )}
      >
        <div className="container mx-auto px-4">
          <NavigationMenu
            viewport={false}
            className="max-w-none justify-start overflow-visible"
          >
            <NavigationMenuList className="w-full flex-nowrap items-center justify-start gap-1 overflow-visible py-1.5">
              {visibleDesktopTaxonomy.map((group) => {
                if (group.children.length === 0) {
                  return (
                    <NavigationMenuItem
                      key={group.key}
                      className="flex shrink-0 items-center"
                    >
                      <NavigationMenuLink
                        asChild
                        active={
                          pathname === "/products" &&
                          activeCategory === group.key &&
                          activeSubcategory === "all"
                        }
                        className="inline-flex h-10 items-center rounded-sm px-3 text-sm font-medium whitespace-nowrap text-foreground/90 hover:bg-primary/10 hover:text-foreground focus:bg-primary/10 focus:text-foreground data-[active=true]:bg-primary/12 data-[active=true]:text-primary"
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
                  <NavigationMenuItem
                    key={group.key}
                    className="flex shrink-0 items-center"
                  >
                    <NavigationMenuTrigger
                      className={cn(
                        "h-10 rounded-sm bg-transparent px-3 text-sm font-medium whitespace-nowrap text-background dark:text-foreground hover:bg-primary/10 hover:text-foreground focus:bg-primary/10 focus:text-foreground data-[state=open]:bg-primary/12 data-[state=open]:text-primary",
                        triggerActive && "bg-primary/12 text-background",
                      )}
                    >
                      {getLocalizedValue(locale, group.label)}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[22rem] rounded-sm border border-border/70 bg-background p-2 shadow-xl">
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
                            className="rounded-sm px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                          >
                            <Link href={child.href}>
                              {getLocalizedValue(locale, child.label)}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}

              {overflowDesktopTaxonomy.length > 0 ? (
                <NavigationMenuItem className="flex shrink-0 items-center">
                  <NavigationMenuTrigger
                    className={cn(
                      "h-10 rounded-sm bg-transparent px-3 text-sm font-medium whitespace-nowrap text-background dark:text-foreground hover:bg-primary/10 hover:text-foreground focus:bg-primary/10 focus:text-foreground data-[state=open]:bg-primary/12 data-[state=open]:text-primary",
                      pathname === "/products" &&
                        overflowCategoryKeys.has(activeCategory) &&
                        "bg-primary/12 text-primary",
                    )}
                  >
                    {locale === "bn" ? "আরও" : "More"}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[30rem] max-w-[calc(100vw-7rem)] rounded-sm border border-border/70 bg-background p-3 shadow-xl">
                    <div className="grid gap-4 md:grid-cols-2">
                      {overflowDesktopTaxonomy.map((group) => (
                        <div key={group.key} className="space-y-2">
                          <Link
                            href={group.href}
                            className="block rounded-sm px-2 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                          >
                            {getLocalizedValue(locale, group.label)}
                          </Link>
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
                                className="rounded-sm px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                              >
                                <Link href={child.href}>
                                  {getLocalizedValue(locale, child.label)}
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : null}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-80 px-4 py-6 z-100">
          <SheetHeader className="sr-only">
            <SheetTitle>
              {locale === "bn" ? "মোবাইল মেনু" : "Mobile menu"}
            </SheetTitle>
            <SheetDescription>
              {locale === "bn"
                ? "দ্রুত নেভিগেশন, ক্যাটাগরি এবং অ্যাকাউন্ট অপশন দেখুন।"
                : "Browse quick navigation, categories, and account actions."}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  {locale === "bn" ? "দ্রুত নেভিগেশন" : "Quick navigation"}
                </span>
                <StorefrontThemeToggle />
              </div>

              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "rounded-sm border px-4 py-3 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/60 hover:bg-muted/40",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-sm border border-border/60 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/40"
                >
                  {locale === "bn" ? "ট্র্যাক অর্ডার" : "Track Order"}
                </Link>
              </div>

              <div className="space-y-3">
                {taxonomy.map((group) => (
                  <div
                    key={group.key}
                    className="rounded-sm border border-border/60 bg-card p-4"
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
                          className="rounded-sm bg-muted/35 px-3 py-2 text-sm text-foreground/90"
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
                  <Button
                    asChild
                    variant="outline"
                    className="justify-start rounded-md"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {locale === "bn" ? "প্রোফাইল" : "Profile"}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="justify-start rounded-md"
                  >
                    <Link
                      href="/favorites"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {locale === "bn" ? "পছন্দের তালিকা" : "Wishlist"}
                    </Link>
                  </Button>
                  {sessionUser.role === "admin" ? (
                    <Button asChild className="justify-start rounded-md">
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
                    className="rounded-md"
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
                  <Button asChild variant="outline" className="rounded-md">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {locale === "bn" ? "লগইন" : "Login"}
                    </Link>
                  </Button>
                  <Button asChild className="rounded-md">
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
    </>
  );
}
