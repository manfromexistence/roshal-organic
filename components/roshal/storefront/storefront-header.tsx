"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartLink } from "@/components/roshal/storefront/cart-link";
import { LocaleSwitcher } from "@/components/roshal/storefront/locale-switcher";
import { LogoutButton } from "@/components/roshal/storefront/logout-button";
import { StorefrontThemeToggle } from "@/components/roshal/storefront/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getLocalizedValue } from "@/lib/roshal/locale";
import type {
  RoshalLocale,
  RoshalMarketingPage,
  RoshalRole,
  RoshalSiteSettings,
} from "@/lib/roshal/types";

export function StorefrontHeader({
  locale,
  pages,
  siteSettings,
  sessionUser,
}: {
  locale: RoshalLocale;
  pages: RoshalMarketingPage[];
  siteSettings: RoshalSiteSettings;
  sessionUser: {
    name: string;
    email: string;
    role: RoshalRole;
  } | null;
}) {
  const [open, setOpen] = useState(false);

  const navigation = [
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
      label: locale === "bn" ? "পণ্য" : "Products",
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border bg-card shadow-sm">
            <Image
              src="/logo.png"
              alt={siteSettings.brandName}
              width={34}
              height={34}
              className="h-8 w-auto"
            />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">
              {siteSettings.brandName}
            </p>
            <p className="hidden text-sm text-muted-foreground md:block">
              {getLocalizedValue(locale, siteSettings.tagline)}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LocaleSwitcher locale={locale} />
          <StorefrontThemeToggle />
          <CartLink label={locale === "bn" ? "কার্ট" : "Cart"} />
          {sessionUser ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/orders">
                  {locale === "bn" ? "অর্ডার" : "Orders"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/profile">
                  {locale === "bn" ? "প্রোফাইল" : "Profile"}
                </Link>
              </Button>
              {sessionUser.role === "admin" ? (
                <Button asChild size="sm">
                  <Link href="/dashboard">
                    {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                  </Link>
                </Button>
              ) : null}
              <LogoutButton locale={locale} />
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">{locale === "bn" ? "লগইন" : "Login"}</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CartLink label={locale === "bn" ? "কার্ট" : "Cart"} />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex h-full flex-col gap-6 pt-8">
                <div className="flex items-center gap-2">
                  <LocaleSwitcher locale={locale} />
                  <StorefrontThemeToggle />
                </div>
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-base font-medium"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3">
                  {sessionUser ? (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/orders" onClick={() => setOpen(false)}>
                          {locale === "bn" ? "আমার অর্ডার" : "My orders"}
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/profile" onClick={() => setOpen(false)}>
                          {locale === "bn" ? "প্রোফাইল" : "Profile"}
                        </Link>
                      </Button>
                      {sessionUser.role === "admin" ? (
                        <Button asChild>
                          <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                          >
                            {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                          </Link>
                        </Button>
                      ) : null}
                      <LogoutButton
                        locale={locale}
                        onLoggedOut={() => setOpen(false)}
                      />
                    </>
                  ) : (
                    <Button asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        {locale === "bn" ? "লগইন" : "Login"}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
