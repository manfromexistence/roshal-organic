"use client";

import { useEffect, useRef, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const SCROLL_KEY = "sidebar-inset-scroll";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRestored, setScrollRestored] = useState(false);

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

  // Save scroll position on scroll
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    try {
      localStorage.setItem(SCROLL_KEY, String(el.scrollTop));
    } catch {
      // ignore
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="overflow-hidden">
        <SiteHeader />
        <ScrollArea className="flex-1" ref={scrollRef} onScroll={handleScroll}>
          <div className="flex flex-1 flex-col min-w-0 pt-12">
            <div className="@container/main flex flex-1 flex-col gap-2 min-w-0">
              {children}
            </div>
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
