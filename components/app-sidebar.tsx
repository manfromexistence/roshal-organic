"use client";

import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { NavMain } from "@/components/nav-main";
import { NavOrganization } from "@/components/nav-organization";
import { NavSecondary } from "@/components/nav-secondary";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  buildDashboardPrimaryNavigation,
  type DashboardNavItem,
  dashboardPrimaryNavigation,
  dashboardSecondaryNavigation,
  dashboardSectionNavigation,
} from "@/lib/dashboard-navigation";
import type { RoshalMarketingPage } from "@/lib/store-types";

const SCROLL_KEY = "sidebar-scroll";
const HIDDEN_SIDEBAR_URLS = new Set([
  "/dashboard/theme",
  "/dashboard/payments",
  "/dashboard/settings/payment",
]);
const HIDDEN_SIDEBAR_TITLES = new Set(["Storefront Theme", "Payments"]);

interface AppSidebarProps
  extends Omit<React.ComponentProps<typeof Sidebar>, "navInitialState"> {
  navInitialState?: Record<string, boolean>;
  marketingPages?: RoshalMarketingPage[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  organization?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

function shouldHideSidebarItem(item: { title: string; url: string }) {
  return (
    HIDDEN_SIDEBAR_URLS.has(item.url) || HIDDEN_SIDEBAR_TITLES.has(item.title)
  );
}

function stripHiddenSidebarItems(
  items: DashboardNavItem[],
): DashboardNavItem[] {
  return items
    .filter((item) => !shouldHideSidebarItem(item))
    .map((item) => {
      if (!item.items) {
        return item;
      }

      const visibleItems = item.items.filter(
        (subItem) => !shouldHideSidebarItem(subItem),
      );

      return {
        ...item,
        items: visibleItems.length > 0 ? visibleItems : undefined,
      };
    });
}

export function AppSidebar({
  navInitialState = {},
  marketingPages,
  user,
  organization,
  ...sidebarProps
}: AppSidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRestored, setScrollRestored] = useState(false);
  const { isMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || scrollRestored) {
      return;
    }

    try {
      const saved = localStorage.getItem(SCROLL_KEY);
      if (saved) {
        element.scrollTop = Number.parseInt(saved, 10);
      }
    } catch {
      // Ignore localStorage access failures in restricted contexts.
    }

    setScrollRestored(true);
  }, [scrollRestored]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    try {
      localStorage.setItem(SCROLL_KEY, String(event.currentTarget.scrollTop));
    } catch {
      // Ignore localStorage access failures in restricted contexts.
    }
  };

  const resolvedPrimaryNavigation = stripHiddenSidebarItems(
    marketingPages && marketingPages.length > 0
      ? buildDashboardPrimaryNavigation(marketingPages)
      : dashboardPrimaryNavigation,
  );
  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar {...sidebarProps} className="dashboard-primary-sidebar">
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-14 rounded-md border border-sidebar-border/80 bg-sidebar-accent/70 px-3 shadow-sm transition-all duration-200 hover:bg-sidebar-accent"
            >
              <Link href="/dashboard" onClick={closeMobileSidebar}>
                <div className="flex aspect-square size-10 items-center justify-center overflow-hidden rounded-md border border-sidebar-primary/20 bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Roshal Organic"
                    width={34}
                    height={34}
                    priority
                    className="h-8 w-auto"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="font-wordmark truncate text-[1rem] text-sidebar-foreground">
                    Roshal Organic
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    Storefront admin
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea
          type="always"
          scrollHideDelay={0}
          className="min-h-0 flex-1"
          viewportRef={scrollRef}
          viewportProps={{
            className: "overscroll-contain",
            onScroll: handleScroll,
          }}
        >
          <div className="flex flex-col gap-2 px-3 group-data-[collapsible=icon]:px-0">
            <NavMain
              items={resolvedPrimaryNavigation}
              initialState={navInitialState}
            />
            <NavMain
              items={dashboardSectionNavigation}
              initialState={navInitialState}
            />
            <NavSecondary
              items={dashboardSecondaryNavigation}
              className="mt-auto"
            />
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavOrganization
          organization={
            organization || {
              name: "Roshal Organic",
              email: "info@roshalorganic.com",
              avatar: undefined,
            }
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
