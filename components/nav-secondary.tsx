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
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

interface NavSecondaryItem {
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
  if (url === "/") {
    return pathname === url;
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

export function NavSecondary({
  items,
  ...props
}: {
  items: NavSecondaryItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const storageKey = "nav-secondary-expanded";
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate state from localStorage after mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setExpandedItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleItem = (title: string, isOpen: boolean) => {
    setExpandedItems((prev) => {
      const next = { ...prev, [title]: isOpen };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarMenu className="gap-1">
        {items.map((item) =>
          item.items ? (
            <Collapsible
              key={item.title}
              open={isMounted ? expandedItems[item.title] : false}
              onOpenChange={(isOpen) => toggleItem(item.title, isOpen)}
              className="group/collapsible"
              asChild
            >
              <SidebarMenuItem suppressHydrationWarning>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
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
                <CollapsibleContent suppressHydrationWarning>
                  <SidebarMenuSub suppressHydrationWarning>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild size="sm">
                          <a href={subItem.url} onClick={closeMobileSidebar}>
                            <span>{subItem.title}</span>
                          </a>
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
                asChild
                tooltip={item.title}
                isActive={isDashboardUrlActive(pathname, item.url)}
                className="h-10 cursor-pointer px-3 font-medium transition-colors duration-150 data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-sm"
              >
                <a href={item.url} onClick={closeMobileSidebar}>
                  <NavIcon icon={item.icon} />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
