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
} from "@/components/ui/sidebar";
import {
  dashboardPrimaryNavigation,
  dashboardSecondaryNavigation,
  dashboardSectionNavigation,
} from "@/lib/dashboard-navigation";

const SCROLL_KEY = "sidebar-scroll";

interface AppSidebarProps
  extends Omit<React.ComponentProps<typeof Sidebar>, "navInitialState"> {
  navInitialState?: Record<string, boolean>;
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

export function AppSidebar({
  navInitialState = {},
  user,
  organization,
  ...sidebarProps
}: AppSidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRestored, setScrollRestored] = useState(false);

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

  return (
    <Sidebar {...sidebarProps}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg border border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground">
                  <Image
                    src="/logo.png"
                    alt="Roshal Organic"
                    width={24}
                    height={24}
                    priority
                    className="h-6 w-auto"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Roshal Organic</span>
                  {/* <span className="truncate text-xs">Storefront CMS</span> */}
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
          <div className="flex flex-col gap-0 px-3 group-data-[collapsible=icon]:px-0">
            <NavMain
              items={dashboardPrimaryNavigation}
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
