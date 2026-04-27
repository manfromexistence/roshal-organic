import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

export interface DashboardNavChildItem {
  title: string;
  url: string;
  keywords?: string[];
}

export interface DashboardNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: DashboardNavChildItem[];
  keywords?: string[];
}

export interface DashboardSearchPage {
  id: string;
  title: string;
  href: string;
  subtitle: string;
  icon?: LucideIcon;
  keywords: string[];
}

export const dashboardPrimaryNavigation: DashboardNavItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    keywords: ["dashboard", "overview", "summary"],
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
    keywords: ["catalog", "inventory", "shop"],
    items: [
      {
        title: "All Products",
        url: "/dashboard/products",
        keywords: ["catalog", "inventory"],
      },
      {
        title: "New Product",
        url: "/dashboard/products/new",
        keywords: ["create product", "add product"],
      },
    ],
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
    keywords: ["checkout", "purchases", "sales"],
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    icon: CreditCard,
    keywords: ["bkash", "nagad", "rocket", "upay", "card"],
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
    keywords: ["accounts", "roles", "customers"],
  },
  {
    title: "Marketing Pages",
    url: "/dashboard/pages",
    icon: FileText,
    keywords: ["content", "cms", "landing pages"],
  },
];

export const dashboardSectionNavigation: DashboardNavItem[] = [];

export const dashboardSecondaryNavigation: DashboardNavItem[] = [
  {
    title: "Storefront",
    url: "/",
    icon: ExternalLink,
    keywords: ["home", "shop", "website"],
  },
];

export function getDashboardSearchPages(): DashboardSearchPage[] {
  const pages: DashboardSearchPage[] = [
    {
      id: "/dashboard",
      title: "Dashboard",
      href: "/dashboard",
      subtitle: "Admin overview",
      keywords: ["home", "summary", "overview"],
    },
  ];
  const seen = new Set<string>(["/dashboard"]);

  const pushPage = (
    item: {
      title: string;
      url: string;
      icon?: LucideIcon;
      keywords?: string[];
    },
    sectionTitle?: string,
  ) => {
    if (seen.has(item.url)) {
      return;
    }

    seen.add(item.url);
    pages.push({
      id: item.url,
      title: item.title,
      href: item.url,
      subtitle: sectionTitle
        ? `${sectionTitle} workspace`
        : "Primary workspace page",
      icon: item.icon,
      keywords: [
        item.title,
        sectionTitle || "",
        ...(item.keywords || []),
      ].filter(Boolean),
    });
  };

  for (const item of dashboardPrimaryNavigation) {
    pushPage(item);
  }

  for (const item of dashboardSectionNavigation) {
    pushPage(item);

    for (const child of item.items || []) {
      pushPage(
        {
          ...child,
          icon: item.icon,
          keywords: [item.title, ...(child.keywords || [])],
        },
        item.title,
      );
    }
  }

  for (const item of dashboardSecondaryNavigation) {
    pushPage(item);
  }

  return pages;
}
