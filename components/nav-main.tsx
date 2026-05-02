"use client";

import {
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  Package,
  Settings,
  Shapes,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { DashboardNavIconKey } from "@/lib/dashboard-navigation";

interface NavItem {
  title: string;
  url: string;
  icon?: DashboardNavIconKey;
  items?: { title: string; url: string }[];
}

const NAV_ICONS: Record<DashboardNavIconKey, LucideIcon> = {
  overview: LayoutDashboard,
  products: Package,
  categories: Shapes,
  orders: ShoppingCart,
  payments: CreditCard,
  reviews: Star,
  users: Users,
  pages: FileText,
  settings: Settings,
  storefront: ExternalLink,
};

function NavIcon({ icon }: { icon?: DashboardNavIconKey }) {
  if (!icon) {
    return null;
  }

  const Icon = NAV_ICONS[icon];
  return <Icon />;
}

function isDashboardUrlActive(pathname: string, url: string) {
  if (url === "/dashboard") {
    return pathname === url;
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

function isDashboardUrlExact(pathname: string, url: string) {
  return pathname === url;
}

interface NavMainProps {
  items: NavItem[];
  label?: string;
  initialState?: Record<string, boolean>;
}

export function NavMain({
  items,
  label = "Platform",
  initialState = {},
}: NavMainProps) {
  const pathname = usePathname();
  const storageKey = `nav-main-expanded-${label}`;
  const { isMobile, setOpenMobile } = useSidebar();

  // CRITICAL: initialState comes from props (server-rendered from cookie).
  // Server and client both use this exact value → identical HTML → no mismatch.
  const [expandedItems, setExpandedItems] =
    useState<Record<string, boolean>>(initialState);

  const toggleItem = (title: string, isOpen: boolean) => {
    setExpandedItems((prev) => {
      const next = { ...prev, [title]: isOpen };
      const serialized = JSON.stringify(next);
      try {
        localStorage.setItem(storageKey, serialized);
      } catch {}
      // biome-ignore lint/suspicious/noDocumentCookie: needed for SSR
      document.cookie = `${storageKey}=${encodeURIComponent(
        serialized,
      )}; path=/; max-age=31536000; SameSite=Lax`;
      return next;
    });
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-1">
        {items.map((item) =>
          item.items ? (
            <Collapsible
              key={item.title}
              open={expandedItems[item.title] || false}
              onOpenChange={(isOpen) => toggleItem(item.title, isOpen)}
              className="group/collapsible"
              asChild
            >
              <SidebarMenuItem suppressHydrationWarning>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    type="button"
                    tooltip={item.title}
                    isActive={
                      isDashboardUrlActive(pathname, item.url) ||
                      item.items.some((subItem) =>
                        isDashboardUrlActive(pathname, subItem.url),
                      )
                    }
                    className="h-10 cursor-pointer px-3 font-medium transition-colors duration-150 data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-sm"
                  >
                    <NavIcon icon={item.icon} />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent suppressHydrationWarning className="pt-1">
                  <SidebarMenuSub
                    suppressHydrationWarning
                    className="ml-4 gap-1 border-sidebar-primary/30"
                  >
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isDashboardUrlExact(pathname, subItem.url)}
                          className="h-8 cursor-pointer transition-colors data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-sm"
                        >
                          <Link href={subItem.url} onClick={closeMobileSidebar}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={isDashboardUrlActive(pathname, item.url)}
                className="h-10 cursor-pointer px-3 font-medium transition-colors duration-150 data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-sm"
              >
                <Link href={item.url} onClick={closeMobileSidebar}>
                  <NavIcon icon={item.icon} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
