"use client";

import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    avatar: string;
  };
  organization?: {
    name: string;
    email: string;
    avatar: string;
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
  const [logoColor, setLogoColor] = useState("bg-sidebar-primary");

  const colors = useMemo(
    () => [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500",
    ],
    [],
  );

  const changeLogoColor = useCallback(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setLogoColor(randomColor);
  }, [colors]);

  useEffect(() => {
    const interval = setInterval(() => {
      changeLogoColor();
    }, 5000);
    return () => clearInterval(interval);
  }, [changeLogoColor]);

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
              <Link
                href="/projects"
                onMouseOver={changeLogoColor}
                onClick={changeLogoColor}
              >
                <div
                  className={`flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-background text-sidebar-primary-foreground transition-colors duration-1000 ${logoColor}`}
                >
                  <Image
                    src="/logo-light.svg"
                    alt="Quadra EDMS Demo"
                    width={16}
                    height={16}
                    priority
                    className="h-auto w-auto dark:hidden"
                  />
                  <Image
                    src="/logo-dark.svg"
                    alt="Quadra EDMS Demo"
                    width={16}
                    height={16}
                    priority
                    className="hidden h-auto w-auto dark:block"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    Quadra EDMS Demo
                  </span>
                  <span className="truncate text-xs">
                    Electronic Document Management System
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
              name: "Quadra Workspace",
              email: "workspace@quadra.local",
              avatar: "/evilrabbit.png",
            }
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
