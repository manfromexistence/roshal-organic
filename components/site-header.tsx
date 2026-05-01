"use client";

import { LogOut, Moon, Search, Sun, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Fragment, useEffect, useMemo, useState } from "react";
import { SearchCommand } from "@/components/dashboard/search-command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { getRouteName } from "@/lib/route-mapping";

interface BreadcrumbItemData {
  title: string;
  path: string;
  isLast: boolean;
  isDynamic?: boolean;
  parentRoute?: string;
  id?: string;
}

interface SiteHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

function AvatarDropdown({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/login");
            router.refresh();
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

  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full p-0"
        >
          <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-80">
            <AvatarFallback className="themed-avatar-fallback border border-border/60 bg-primary/10 font-medium text-primary dark:border-border/70 dark:bg-[color:color-mix(in_oklch,var(--card)_58%,var(--primary)_42%)] dark:text-foreground">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 rounded-lg"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="themed-avatar-fallback border border-border/60 bg-primary/10 font-medium text-primary dark:border-border/70 dark:bg-[color:color-mix(in_oklch,var(--card)_58%,var(--primary)_42%)] dark:text-foreground">
                {fallback}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 size-4" />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isLoggingOut}
          onClick={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dynamicTitles, setDynamicTitles] = useState<Record<string, string>>(
    {},
  );
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((currentOpen) => !currentOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Generate breadcrumb items from pathname
  const breadcrumbItems: BreadcrumbItemData[] = useMemo(() => {
    const dashboardPath = pathname.startsWith("/dashboard")
      ? pathname.slice("/dashboard".length) || "/"
      : pathname;

    const pathSegments = dashboardPath
      .replace(/^\//, "")
      .split("/")
      .filter(
        (segment) =>
          segment !== "[locale]" &&
          segment !== "(app)" &&
          segment !== "(sidebar)" &&
          segment !== "dashboard",
      );

    return pathSegments.map((segment, index) => {
      const path = `/dashboard/${pathSegments.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSegments.length - 1;
      const title = getRouteName(path);

      // Check if this is a dynamic segment (looks like an ID)
      const isDynamic = /^[a-f0-9-]{36}$/.test(segment) || segment.length > 20;
      const parentRoute = index > 0 ? pathSegments[index - 1] : undefined;

      return { title, path, isLast, isDynamic, parentRoute, id: segment };
    });
  }, [pathname]);

  // Fetch dynamic titles for ID segments
  useEffect(() => {
    const fetchDynamicTitles = async () => {
      const newTitles: Record<string, string> = {};

      const fetchPromises = breadcrumbItems
        .filter((item) => item.isDynamic && item.parentRoute && item.id)
        .map(async (item) => {
          try {
            const response = await fetch(
              `/api/breadcrumb/${item.parentRoute}/${item.id}`,
            );
            if (response.ok) {
              const data = await response.json();
              if (data.title) {
                return { id: item.id, title: data.title };
              }
            }
          } catch (error) {
            console.error("Error fetching breadcrumb title:", error);
          }
          return null;
        });

      const results = await Promise.all(fetchPromises);
      results.forEach((result) => {
        if (result?.id) {
          newTitles[result.id] = result.title;
        }
      });

      setDynamicTitles(newTitles);
    };

    fetchDynamicTitles();
  }, [breadcrumbItems]);

  const currentPageTitle = useMemo(() => {
    const currentItem = breadcrumbItems.at(-1);

    if (!currentItem) {
      return "Dashboard";
    }

    return currentItem.isDynamic &&
      currentItem.id &&
      dynamicTitles[currentItem.id]
      ? dynamicTitles[currentItem.id]
      : currentItem.title;
  }, [breadcrumbItems, dynamicTitles]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex h-(--header-height) shrink-0 items-center gap-0 border-b border-border/70 bg-background/90 bg-clip-padding shadow-sm backdrop-filter backdrop-blur-xl transition-[width,height] ease-linear md:left-[var(--sidebar-width)] group-has-data-[collapsible=icon]/sidebar-wrapper:md:left-[var(--sidebar-width-icon)]">
        <div className="flex w-full items-center gap-1 px-4 md:gap-2 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="min-w-0 flex-1 md:hidden">
            <p className="truncate text-sm font-medium">{currentPageTitle}</p>
          </div>
          <div className="hidden min-w-0 flex-1 md:block">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.map((item) => {
                  const displayTitle =
                    item.isDynamic && item.id && dynamicTitles[item.id]
                      ? dynamicTitles[item.id]
                      : item.title;
                  return (
                    <Fragment key={item.path}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {item.isLast ? (
                          <BreadcrumbPage>{displayTitle}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={item.path}>
                            {displayTitle}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex min-w-0 items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-9 min-w-0 flex-1 items-center justify-between gap-3 border-border/70 bg-card/70 px-3 text-muted-foreground shadow-sm xl:flex xl:max-w-sm"
              onClick={() => setSearchOpen(true)}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Search className="size-4 shrink-0" />
                <span className="truncate text-sm">
                  Search products, orders, and pages...
                </span>
              </span>
              <span className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Ctrl K
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-5" />
              <span className="sr-only">Open search</span>
            </Button>

            {/* Theme toggle */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}

            {user ? (
              <AvatarDropdown user={user} />
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
