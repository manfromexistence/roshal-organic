"use client";

import {
  ChevronDown,
  Heart,
  Languages,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShoppingBag,
  Sun,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Language = "bn" | "en";

export function MarketingHeader() {
  const [session, setSession] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("bn");
  const [watchlistCount, _setWatchlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<
    typeof categoryLinks
  >([]);
  const [overflowCategories, setOverflowCategories] = useState<
    typeof categoryLinks
  >([]);
  const subheaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Check for session
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/get-session");
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      }
    };

    checkSession();
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent("languageChange", { detail: lang }));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { href: "/", label: language === "bn" ? "হোম" : "Home" },
    { href: "/about", label: language === "bn" ? "আমাদের সম্পর্কে" : "About" },
    { href: "/products", label: language === "bn" ? "পণ্যসমূহ" : "Products" },
    { href: "/contact", label: language === "bn" ? "যোগাযোগ" : "Contact" },
  ];

  const categoryLinks = useMemo(
    () => [
      {
        href: "/products?category=honey",
        label: language === "bn" ? "মধু" : "Honey",
      },
      {
        href: "/products?category=mango",
        label: language === "bn" ? "আম" : "Mango",
      },
      {
        href: "/products?category=ghee",
        label: language === "bn" ? "ঘি" : "Ghee",
      },
      {
        href: "/products?category=dates",
        label: language === "bn" ? "খেজুর" : "Dates",
      },
      {
        href: "/products?category=spices",
        label: language === "bn" ? "মশলা" : "Spices",
      },
      {
        href: "/products?category=nuts",
        label: language === "bn" ? "নাটস" : "Nuts",
      },
      {
        href: "/products?category=oil",
        label: language === "bn" ? "তেল" : "Oil",
      },
      {
        href: "/products?category=rice",
        label: language === "bn" ? "চাল" : "Rice",
      },
      {
        href: "/products?category=fruits",
        label: language === "bn" ? "ফলমূল" : "Fruits",
      },
      {
        href: "/products?category=vegetables",
        label: language === "bn" ? "শাকসবজি" : "Vegetables",
      },
      {
        href: "/products?category=dairy",
        label: language === "bn" ? "দুগ্ধজাত" : "Dairy",
      },
      {
        href: "/products?category=flour",
        label: language === "bn" ? "আটা" : "Flour",
      },
      {
        href: "/products?category=sugar",
        label: language === "bn" ? "চিনি" : "Sugar",
      },
      {
        href: "/products?category=salt",
        label: language === "bn" ? "লবণ" : "Salt",
      },
      {
        href: "/products?category=tea",
        label: language === "bn" ? "চা" : "Tea",
      },
      {
        href: "/products?category=coffee",
        label: language === "bn" ? "কফি" : "Coffee",
      },
      {
        href: "/products?category=juice",
        label: language === "bn" ? "জুস" : "Juice",
      },
      {
        href: "/products?category=snacks",
        label: language === "bn" ? "স্ন্যাকস" : "Snacks",
      },
      {
        href: "/products?category=bakery",
        label: language === "bn" ? "বেকারি" : "Bakery",
      },
      {
        href: "/products?category=beverages",
        label: language === "bn" ? "পানীয়" : "Beverages",
      },
      {
        href: "/products?category=fish",
        label: language === "bn" ? "মাছ" : "Fish",
      },
      {
        href: "/products?category=meat",
        label: language === "bn" ? "মাংস" : "Meat",
      },
      {
        href: "/products?category=eggs",
        label: language === "bn" ? "ডিম" : "Eggs",
      },
      {
        href: "/products?category=herbs",
        label: language === "bn" ? "ভেষজ" : "Herbs",
      },
      {
        href: "/products?category=seeds",
        label: language === "bn" ? "বীজ" : "Seeds",
      },
    ],
    [language],
  );

  // Detect overflow in subheader
  useEffect(() => {
    if (!subheaderRef.current || !mounted) return;

    const checkOverflow = () => {
      const container = subheaderRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const children = Array.from(container.children) as HTMLElement[];

      let totalWidth = 0;
      const moreButtonWidth = 120; // Estimated width for "More" button
      const visible: typeof categoryLinks = [];
      const overflow: typeof categoryLinks = [];

      children.forEach((child, index) => {
        if (child.classList.contains("more-button")) return;

        const childWidth = child.offsetWidth + 24; // gap-6 = 24px
        totalWidth += childWidth;

        if (totalWidth <= containerWidth - moreButtonWidth) {
          visible.push(categoryLinks[index]);
        } else {
          overflow.push(categoryLinks[index]);
        }
      });

      setVisibleCategories(visible);
      setOverflowCategories(overflow);
    };

    // Show all categories initially, then check for overflow
    setVisibleCategories(categoryLinks);

    const timeoutId = setTimeout(() => {
      checkOverflow();
    }, 200);

    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [categoryLinks, mounted]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 h-32">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Roshal Organic"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="font-bold text-lg text-foreground">
            Roshal Organic
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Toggler */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Language Switcher - Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleLanguageChange(language === "bn" ? "en" : "bn")
            }
            title={language === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
          >
            <Languages className="h-5 w-5" />
            <span className="sr-only">
              {language === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            </span>
          </Button>

          {session ? (
            <>
              {/* Watchlist Button */}
              <Link href="/watchlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {watchlistCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {watchlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart Button */}
              <Link href="/checkout">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    0
                  </Badge>
                </Button>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {session.user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {language === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {language === "bn" ? "প্রোফাইল" : "Profile"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      {language === "bn" ? "অর্ডারসমূহ" : "Orders"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/watchlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      {language === "bn" ? "ওয়াচলিস্ট" : "Watchlist"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {language === "bn" ? "লগআউট" : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Mobile Menu Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="flex flex-col gap-2 mt-4">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          {language === "bn" ? "লগইন" : "Login"}
                        </Button>
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full">
                          {language === "bn" ? "সাইন আপ" : "Sign Up"}
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    {language === "bn" ? "লগইন" : "Login"}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">
                    {language === "bn" ? "সাইন আপ" : "Sign Up"}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Secondary Category Navigation - Full width at bottom */}
      <div className="">
        <div className="container mx-auto px-4">
          <div
            ref={subheaderRef}
            className="flex items-center gap-6 py-3 overflow-x-auto"
          >
            {visibleCategories.map((link) => (
              <HoverCard key={link.href}>
                <HoverCardTrigger asChild>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary whitespace-nowrap transition-colors"
                  >
                    {link.label}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent side="bottom" align="center">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      {link.label}
                    </h4>
                    <div className="space-y-1">
                      <Link
                        href={`${link.href}&sort=popular`}
                        className="block text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {language === "bn" ? "জনপ্রিয়" : "Popular"}
                      </Link>
                      <Link
                        href={`${link.href}&sort=new`}
                        className="block text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {language === "bn" ? "নতুন" : "New Arrivals"}
                      </Link>
                      <Link
                        href={`${link.href}&sort=discount`}
                        className="block text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {language === "bn" ? "বিক্রয়ে" : "On Sale"}
                      </Link>
                      <Link
                        href={`${link.href}&sort=organic`}
                        className="block text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {language === "bn" ? "অর্গানিক" : "Organic"}
                      </Link>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}

            {overflowCategories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="more-button flex items-center gap-1"
                  >
                    {language === "bn" ? "আরও" : "More"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {overflowCategories.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="cursor-pointer">
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
