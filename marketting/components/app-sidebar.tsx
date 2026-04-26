"use client";

import {
  Activity,
  Cog,
  HelpCircle,
  Info,
  LayoutDashboard,
  Package,
  Palette,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Store,
  Tag,
  Users,
} from "lucide-react";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
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

const SCROLL_KEY = "sidebar-scroll";

const data = {
  user: {
    name: "Admin",
    email: "admin@roshal-organic.com",
    avatar: "/logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Tag,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: Activity,
    },
    {
      title: "Theme",
      url: "/dashboard/theme",
      icon: Palette,
    },
    {
      title: "About",
      url: "/dashboard/about",
      icon: Info,
    },
    {
      title: "Terms of Service",
      url: "/dashboard/terms",
      icon: Shield,
    },
    {
      title: "Privacy Policy",
      url: "/dashboard/privacy",
      icon: Shield,
    },
  ],
  navClouds: [
    {
      title: "Store Management",
      icon: Store,
      url: "/dashboard/store",
      items: [
        {
          title: "Store Settings",
          url: "/dashboard/store/settings",
        },
        {
          title: "Payment Methods",
          url: "/dashboard/store/payments",
        },
        {
          title: "Shipping",
          url: "/dashboard/store/shipping",
        },
        {
          title: "Tax Settings",
          url: "/dashboard/store/tax",
        },
      ],
    },
    {
      title: "Marketing",
      icon: HelpCircle,
      url: "/dashboard/marketing",
      items: [
        {
          title: "Coupons",
          url: "/dashboard/marketing/coupons",
        },
        {
          title: "Banners",
          url: "/dashboard/marketing/banners",
        },
        {
          title: "Featured Products",
          url: "/dashboard/marketing/featured",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
        {
          title: "Account",
          url: "/dashboard/settings/account",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
        {
          title: "Security",
          url: "/dashboard/settings/security",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRestored, setScrollRestored] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [_contextMenuOpen, _setContextMenuOpen] = useState(false);

  const handleSearchInContext = () => {
    setSearchQuery("");
    const searchInput = document.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
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

  // Filter nav items based on search query
  const filterNavItems = (items: typeof data.navMain) => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const itemsMatch =
        "items" in item &&
        Array.isArray(item.items) &&
        item.items.some((subItem) =>
          subItem.title.toLowerCase().includes(query),
        );
      return titleMatch || itemsMatch;
    });
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <rect width="7" height="7" rx="1" fill="currentColor" />
                    <rect
                      x="9"
                      width="7"
                      height="7"
                      rx="1"
                      fill="currentColor"
                      fillOpacity="0.5"
                    />
                    <rect
                      y="9"
                      width="7"
                      height="7"
                      rx="1"
                      fill="currentColor"
                      fillOpacity="0.5"
                    />
                    <rect
                      x="9"
                      y="9"
                      width="7"
                      height="7"
                      rx="1"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Roshal Organic</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <ScrollArea
              ref={scrollRef}
              className="flex-1"
              onScroll={handleScroll}
            >
              <div className="flex flex-col gap-0 px-3 group-data-[collapsible=icon]:px-0">
                <NavMain items={filterNavItems(data.navMain)} />
                <NavMain items={filterNavItems(data.navClouds)} />
                <NavSecondary
                  items={filterNavItems(data.navSecondary)}
                  className="mt-auto"
                />
              </div>
            </ScrollArea>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={handleSearchInContext}>
              <Search className="mr-2 size-4" />
              Search
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
