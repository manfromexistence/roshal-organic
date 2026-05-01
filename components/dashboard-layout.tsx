"use client";

import { useEffect, useRef, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { RoshalMarketingPage } from "@/lib/store-types";

const SCROLL_KEY = "sidebar-inset-scroll";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navInitialState: Record<string, boolean>;
  marketingPages?: RoshalMarketingPage[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  organization?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function DashboardLayout({
  children,
  navInitialState,
  marketingPages,
  user,
  organization,
}: DashboardLayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRestored, setScrollRestored] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    try {
      localStorage.setItem(SCROLL_KEY, String(event.currentTarget.scrollTop));
    } catch {
      // ignore
    }
  };

  // Restore scroll position on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || scrollRestored) return;
    try {
      const saved = localStorage.getItem(SCROLL_KEY);
      if (saved) {
        el.scrollTop = Number.parseInt(saved, 10);
      }
    } catch {
      // ignore
    }
    setScrollRestored(true);
  }, [scrollRestored]);

  return (
    <SidebarProvider
      className="h-svh overflow-hidden"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--sidebar-width-icon": "calc(var(--spacing) * 16)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="sidebar"
        collapsible="icon"
        navInitialState={navInitialState}
        marketingPages={marketingPages}
        user={
          user
            ? {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
              }
            : {
                name: "Guest",
                email: "guest@example.com",
                avatar: undefined,
              }
        }
        organization={
          organization || {
            name: "Roshal Organic",
            email: "info@roshalorganic.com",
            avatar: undefined,
          }
        }
      />
      <SidebarInset className="dashboard-admin-surface relative flex h-svh min-h-0 flex-col overflow-hidden">
        <SiteHeader user={user} />
        <ScrollArea
          type="always"
          scrollHideDelay={0}
          className="min-h-0 min-w-0 flex-1 pt-16"
          viewportRef={scrollRef}
          viewportProps={{
            className: "min-w-0 overscroll-contain",
            onScroll: handleScroll,
          }}
        >
          {children}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
