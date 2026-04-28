"use client";

import {
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  Package,
  Shapes,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
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
  users: Users,
  pages: FileText,
  storefront: ExternalLink,
};

function NavIcon({ icon }: { icon?: DashboardNavIconKey }) {
  if (!icon) {
    return null;
  }

  const Icon = NAV_ICONS[icon];
  return <Icon />;
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
  const storageKey = `nav-main-expanded-${label}`;

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

  const _handleItemClick = (item: NavItem) => {
    if (item.items && item.items.length > 0) {
      // Navigate to first child
      window.location.href = item.items[0].url;
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
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
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <a
                      href={item.items[0]?.url || item.url}
                      onClick={(_e) => {
                        // Allow the default navigation to happen
                        // The href already points to the first child
                      }}
                    >
                      <NavIcon icon={item.icon} />
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto group-data-[state=open]/collapsible:rotate-90" />
                    </a>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent suppressHydrationWarning>
                  <SidebarMenuSub suppressHydrationWarning>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
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
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.url}>
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
