"use client";

import {
  ChevronDown,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  const [hideTopBar, setHideTopBar] = useState(false);
  const [visibleTaxonomyCount, setVisibleTaxonomyCount] = useState(7);
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
  const visibleDesktopTaxonomy = taxonomy.slice(0, visibleTaxonomyCount);
  const overflowDesktopTaxonomy = taxonomy.slice(visibleTaxonomyCount);
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
    const updateVisibleTaxonomyCount = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 360) {
        setVisibleTaxonomyCount(2);
        return;
      }

      if (screenWidth < 480) {
        setVisibleTaxonomyCount(3);
        return;
      }

      if (screenWidth < 640) {
        setVisibleTaxonomyCount(4);
        return;
      }

      if (screenWidth < 768) {
        setVisibleTaxonomyCount(5);
        return;
      }

      if (screenWidth < 1024) {
        setVisibleTaxonomyCount(6);
        return;
      }

      if (screenWidth < 1280) {
        setVisibleTaxonomyCount(7);
        return;
      }

      if (screenWidth < 1440) {
        setVisibleTaxonomyCount(8);
        return;
      }

      setVisibleTaxonomyCount(9);
    };

    updateVisibleTaxonomyCount();
    window.addEventListener("resize", updateVisibleTaxonomyCount);

    return () => {
      window.removeEventListener("resize", updateVisibleTaxonomyCount);
    };
  }, []);

  useEffect(() => {
    const getScrollY = () =>
      Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      );
    let lastScrollY = getScrollY();

    const handleScroll = () => {
      const currentScrollY = getScrollY();

      if (currentScrollY < 48) {
        setHideTopBar(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY + 8) {
        setHideTopBar(true);
      } else if (currentScrollY < lastScrollY - 8) {
        setHideTopBar(false);
      }

      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] bg-background shadow-sm transition-transform duration-300 ease-out will-change-transform",
          hideTopBar && "-translate-y-[calc(100%+1px)]",
        )}
      >
        <div className="h-14 border-b border-border/60 lg:h-[4.1rem]">
          <div className="container mx-auto flex h-full min-w-0 items-center gap-3 px-4 py-1 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4">
            <Link
              href="/"
              className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none"
            >
              <div className="flex min-w-0 items-center">
                <Image
                  src="/logo.png"
                  alt={siteSettings.brandName}
                  width={340}
                  height={110}
                  priority
                  className="h-[3.35rem] w-auto max-w-[min(13rem,calc(100vw-8.5rem))] object-contain object-left sm:max-w-[16rem] lg:h-[3.95rem] lg:max-w-none"
                />
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
              <LocaleSwitcher locale={locale} className="mr-1 h-8" />
              <Button
                asChild
                variant="ghost"
                className="h-auto flex-col items-center justify-center gap-0.5 rounded-sm px-2.5 py-1.5 text-[11px] text-foreground hover:bg-accent/60"
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
                  className="h-auto flex-col items-center justify-center gap-0.5 rounded-sm px-2.5 py-1.5 text-[11px] text-foreground hover:bg-accent/60"
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
                  className="h-auto flex-col items-center justify-center gap-0.5 rounded-sm px-2.5 py-1.5 text-[11px] text-foreground hover:bg-accent/60"
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
                className="relative h-auto flex-col items-center justify-center gap-0.5 rounded-sm px-2.5 py-1.5 text-[11px] text-foreground hover:bg-accent/60"
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
                className="relative h-auto flex-col items-center justify-center gap-0.5 rounded-sm px-2.5 py-1.5 text-[11px] text-foreground hover:bg-accent/60"
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
                    className="h-auto flex-col items-center justify-center gap-0.5 rounded-sm px-2.5 py-1.5 text-[11px] text-foreground hover:bg-accent/60"
                  >
                    <Grid3X3 className="size-5" />
                    <span>{locale === "bn" ? "আরও" : "More"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 max-w-[calc(100vw-2rem)]"
                >
                  <DropdownMenuLabel className="break-words [overflow-wrap:anywhere]">
                    {locale === "bn" ? "দ্রুত লিংক" : "Quick links"}
                  </DropdownMenuLabel>
                  <div className="space-y-3 px-2 py-2">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/30 p-3">
                      <span className="min-w-0 break-words text-sm font-medium [overflow-wrap:anywhere]">
                        {locale === "bn" ? "থিম" : "Theme"}
                      </span>
                      <StorefrontThemeToggle />
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {navLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.href}
                      asChild
                      className="h-auto whitespace-normal break-words leading-5 [overflow-wrap:anywhere]"
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                  {sessionUser?.role === "admin" ? (
                    <DropdownMenuItem
                      asChild
                      className="h-auto whitespace-normal break-words leading-5 [overflow-wrap:anywhere]"
                    >
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
                        className="h-auto whitespace-normal break-words leading-5 [overflow-wrap:anywhere]"
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
                className="relative hidden rounded-sm md:inline-flex"
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
                className="rounded-sm"
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
          "fixed inset-x-0 isolate z-40 border-b border-primary-foreground/10 bg-primary text-primary-foreground shadow-md transition-[top] duration-300",
          hideTopBar ? "top-0" : "top-14 lg:top-[4.1rem]",
        )}
      >
        <div className="container mx-auto min-w-0 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full flex-nowrap items-center justify-start gap-1 py-1.5">
            {visibleDesktopTaxonomy.map((group) => {
              const groupLabel = getLocalizedValue(locale, group.label);
              const triggerActive =
                pathname === "/products" && activeCategory === group.key;

              return (
                <DropdownMenu key={group.key}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className={cn(
                        "group h-10 shrink-0 rounded-sm bg-transparent px-3 text-sm font-medium whitespace-nowrap text-primary-foreground/90 opacity-100 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus:bg-primary-foreground/10 focus:text-primary-foreground data-[state=open]:bg-background data-[state=open]:text-primary data-[state=open]:shadow-sm data-[state=open]:opacity-100",
                        triggerActive &&
                          "bg-primary-foreground/10 text-primary-foreground",
                      )}
                    >
                      <span>{groupLabel}</span>
                      <ChevronDown className="size-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="z-[90] w-[min(20rem,calc(100vw-2rem))] rounded-sm border-border/70 p-2 shadow-xl"
                  >
                    <DropdownMenuLabel className="break-words px-2 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground [overflow-wrap:anywhere]">
                      {groupLabel}
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      asChild
                      className="h-auto cursor-pointer whitespace-normal break-words px-2.5 py-2 text-sm font-medium text-primary [overflow-wrap:anywhere]"
                    >
                      <Link href={group.href}>
                        {locale === "bn"
                          ? `${groupLabel} দেখুন`
                          : `Browse ${groupLabel}`}
                      </Link>
                    </DropdownMenuItem>
                    {group.children.length > 0 ? (
                      <DropdownMenuSeparator />
                    ) : null}
                    {group.children.map((child) => {
                      const childActive =
                        pathname === "/products" &&
                        activeCategory === group.key &&
                        activeSubcategory === child.key;

                      return (
                        <DropdownMenuItem
                          key={child.key}
                          asChild
                          className={cn(
                            "h-auto cursor-pointer whitespace-normal break-words px-2.5 py-2 text-sm font-medium [overflow-wrap:anywhere]",
                            childActive &&
                              "bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary",
                          )}
                        >
                          <Link href={child.href}>
                            {getLocalizedValue(locale, child.label)}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}

            {overflowDesktopTaxonomy.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                      "group h-10 shrink-0 rounded-sm bg-transparent px-3 text-sm font-medium whitespace-nowrap text-primary-foreground/90 opacity-100 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus:bg-primary-foreground/10 focus:text-primary-foreground data-[state=open]:bg-background data-[state=open]:text-primary data-[state=open]:shadow-sm",
                      pathname === "/products" &&
                        overflowCategoryKeys.has(activeCategory) &&
                        "bg-primary-foreground/10 text-primary-foreground",
                    )}
                  >
                    {locale === "bn" ? "আরও" : "More"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="z-[90] max-h-[min(70vh,34rem)] w-[min(24rem,calc(100vw-2rem))] rounded-sm border-border/70 p-2 shadow-xl"
                >
                  <Accordion type="multiple" className="w-full space-y-2">
                    {overflowDesktopTaxonomy.map((group) => (
                      <AccordionItem
                        key={group.key}
                        value={group.key}
                        className="rounded-sm border border-border/60 px-3"
                      >
                        <AccordionTrigger className="py-3 text-left text-sm font-semibold whitespace-normal break-words text-foreground hover:no-underline [overflow-wrap:anywhere]">
                          {getLocalizedValue(locale, group.label)}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-1 pb-3">
                          <Link
                            href={group.href}
                            className="block rounded-sm px-3 py-2 text-sm font-medium break-words text-primary transition-colors hover:bg-primary/10 [overflow-wrap:anywhere]"
                          >
                            {locale === "bn"
                              ? `${getLocalizedValue(locale, group.label)} দেখুন`
                              : `Browse ${getLocalizedValue(locale, group.label)}`}
                          </Link>
                          <div className="grid gap-1">
                            {group.children.map((child) => (
                              <DropdownMenuItem
                                key={child.key}
                                asChild
                                className={cn(
                                  "h-auto cursor-pointer whitespace-normal break-words px-2.5 py-2 text-sm font-medium [overflow-wrap:anywhere]",
                                  pathname === "/products" &&
                                    activeCategory === group.key &&
                                    activeSubcategory === child.key &&
                                    "bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary",
                                )}
                              >
                                <Link href={child.href}>
                                  {getLocalizedValue(locale, child.label)}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="right"
          className="z-100 min-w-0 w-[min(20rem,calc(100vw-1rem))] overflow-x-hidden px-4 py-6"
        >
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
          <ScrollArea className="h-full min-w-0 pr-4">
            <div className="min-w-0 space-y-6 pb-6">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="min-w-0 break-words text-lg font-semibold [overflow-wrap:anywhere]">
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
                      "rounded-sm border px-4 py-3 text-sm font-medium break-words transition-colors [overflow-wrap:anywhere]",
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
                  className="rounded-sm border border-border/60 px-4 py-3 text-sm font-medium break-words transition-colors hover:bg-muted/40 [overflow-wrap:anywhere]"
                >
                  {locale === "bn" ? "ট্র্যাক অর্ডার" : "Track Order"}
                </Link>
              </div>

              {sessionUser ? (
                <div className="grid gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto min-h-9 justify-start whitespace-normal rounded-md text-left leading-5 [overflow-wrap:anywhere]"
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
                    className="h-auto min-h-9 justify-start whitespace-normal rounded-md text-left leading-5 [overflow-wrap:anywhere]"
                  >
                    <Link
                      href="/favorites"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {locale === "bn" ? "পছন্দের তালিকা" : "Wishlist"}
                    </Link>
                  </Button>
                  {sessionUser.role === "admin" ? (
                    <Button
                      asChild
                      className="h-auto min-h-9 justify-start whitespace-normal rounded-md text-left leading-5 [overflow-wrap:anywhere]"
                    >
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
                    className="h-auto min-h-9 whitespace-normal rounded-md text-left leading-5 [overflow-wrap:anywhere]"
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
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto min-h-9 whitespace-normal rounded-md text-left leading-5 [overflow-wrap:anywhere]"
                  >
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {locale === "bn" ? "লগইন" : "Login"}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="h-auto min-h-9 whitespace-normal rounded-md text-left leading-5 [overflow-wrap:anywhere]"
                  >
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
