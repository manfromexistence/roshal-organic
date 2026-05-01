import type { RoshalMarketingPage } from "@/lib/store-types";

export type DashboardNavIconKey =
  | "overview"
  | "products"
  | "categories"
  | "orders"
  | "payments"
  | "users"
  | "pages"
  | "settings"
  | "storefront";

export interface DashboardNavChildItem {
  title: string;
  url: string;
  keywords?: string[];
}

export interface DashboardNavItem {
  title: string;
  url: string;
  icon?: DashboardNavIconKey;
  items?: DashboardNavChildItem[];
  keywords?: string[];
}

export interface DashboardSearchPage {
  id: string;
  title: string;
  href: string;
  subtitle: string;
  keywords: string[];
}

const fallbackMarketingPageItems: DashboardNavChildItem[] = [
  {
    title: "Home",
    url: "/dashboard/pages/page-home",
    keywords: ["landing", "homepage", "front"],
  },
  {
    title: "About",
    url: "/dashboard/pages/page-about",
    keywords: ["about us", "company", "story"],
  },
  {
    title: "Contact",
    url: "/dashboard/pages/page-contact",
    keywords: ["contact us", "support", "help"],
  },
];

const primaryNavigationTemplate: DashboardNavItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: "overview",
    keywords: ["dashboard", "overview", "summary"],
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: "products",
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
    title: "Categories",
    url: "/dashboard/categories",
    icon: "categories",
    keywords: ["taxonomy", "subcategory", "navigation"],
    items: [
      {
        title: "All Categories",
        url: "/dashboard/categories",
        keywords: ["taxonomy", "navigation"],
      },
      {
        title: "New Category",
        url: "/dashboard/categories/new",
        keywords: ["create category", "add category"],
      },
      {
        title: "New Subcategory",
        url: "/dashboard/categories/sub/new",
        keywords: ["create subcategory", "add subcategory"],
      },
    ],
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: "orders",
    keywords: ["checkout", "purchases", "sales"],
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    icon: "payments",
    keywords: ["cash on delivery", "bkash", "nagad", "card"],
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: "users",
    keywords: ["accounts", "roles", "customers"],
  },
  {
    title: "Marketing",
    url: "/dashboard/marketing",
    icon: "pages",
    keywords: ["content", "cms", "landing pages"],
    items: [
      {
        title: "Marketing Center",
        url: "/dashboard/marketing",
        keywords: ["homepage", "cms", "sections"],
      },
      {
        title: "All Pages",
        url: "/dashboard/pages",
        keywords: ["list", "manage", "edit"],
      },
      ...fallbackMarketingPageItems,
    ],
  },
  {
    title: "System Settings",
    url: "/dashboard/settings",
    icon: "settings",
    keywords: ["settings", "delivery", "brand", "contact", "configuration"],
    items: [
      {
        title: "System Settings",
        url: "/dashboard/settings",
        keywords: ["delivery charges", "contact info", "brand"],
      },
      {
        title: "Payment Settings",
        url: "/dashboard/payments",
        keywords: ["cash on delivery", "bkash", "nagad", "card"],
      },
    ],
  },
];

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

function getMarketingPageTitle(page: RoshalMarketingPage) {
  return (
    page.navigationLabel.en ||
    page.title.en ||
    titleCaseFromSlug(page.slug) ||
    "Page"
  );
}

export function buildDashboardPrimaryNavigation(
  marketingPages: RoshalMarketingPage[] = [],
): DashboardNavItem[] {
  const marketingPageItems =
    marketingPages.length > 0
      ? marketingPages.map((page) => ({
          title: getMarketingPageTitle(page),
          url: `/dashboard/pages/${page.id}`,
          keywords: [
            page.slug,
            page.navigationLabel.en,
            page.navigationLabel.bn,
            page.title.en,
            page.title.bn,
            page.status,
          ].filter(Boolean),
        }))
      : fallbackMarketingPageItems;

  return primaryNavigationTemplate.map((item) =>
    item.title === "Marketing"
      ? {
          ...item,
          items: [
            {
              title: "Marketing Center",
              url: "/dashboard/marketing",
              keywords: ["homepage", "cms", "sections"],
            },
            {
              title: "All Pages",
              url: "/dashboard/pages",
              keywords: ["list", "manage", "edit"],
            },
            ...marketingPageItems,
          ],
        }
      : item,
  );
}

export const dashboardPrimaryNavigation: DashboardNavItem[] =
  buildDashboardPrimaryNavigation();

export const dashboardSectionNavigation: DashboardNavItem[] = [];

export const dashboardSecondaryNavigation: DashboardNavItem[] = [
  {
    title: "Storefront",
    url: "/",
    icon: "storefront",
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
      keywords: [
        item.title,
        sectionTitle || "",
        ...(item.keywords || []),
      ].filter(Boolean),
    });
  };

  for (const item of dashboardPrimaryNavigation) {
    pushPage(item);

    for (const child of item.items || []) {
      pushPage(
        {
          ...child,
          keywords: [item.title, ...(child.keywords || [])],
        },
        item.title,
      );
    }
  }

  for (const item of dashboardSectionNavigation) {
    pushPage(item);

    for (const child of item.items || []) {
      pushPage(
        {
          ...child,
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
