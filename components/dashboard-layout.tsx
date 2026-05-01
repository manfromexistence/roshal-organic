"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { RoshalMarketingPage } from "@/lib/store-types";

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
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset route scroll so long dashboard editors do not inherit another page's offset.
  useEffect(() => {
    if (!pathname) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [pathname]);

  return (
    <SidebarProvider
      className="h-svh w-full max-w-full overflow-hidden"
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
        user={user || undefined}
        organization={
          organization || {
            name: "Roshal Organic",
            email: "info@roshalorganic.com",
            avatar: undefined,
          }
        }
      />
      <SidebarInset className="dashboard-admin-surface relative flex h-svh min-h-0 min-w-0 max-w-full flex-col overflow-hidden md:w-[calc(100vw_-_var(--sidebar-width))] md:max-w-[calc(100vw_-_var(--sidebar-width))] md:flex-none group-has-data-[collapsible=icon]/sidebar-wrapper:md:w-[calc(100vw_-_var(--sidebar-width-icon))] group-has-data-[collapsible=icon]/sidebar-wrapper:md:max-w-[calc(100vw_-_var(--sidebar-width-icon))]">
        <SiteHeader user={user} />
        <ScrollArea
          type="always"
          scrollHideDelay={0}
          className="min-h-0 min-w-0 w-full flex-1"
          viewportRef={scrollRef}
          viewportProps={{
            className: "min-w-0 max-w-full overscroll-contain",
          }}
        >
          <div className="dashboard-page-shell min-w-0 max-w-full pt-[var(--header-height)]">
            {children}
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
