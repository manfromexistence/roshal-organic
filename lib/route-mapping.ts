/**
 * Route slug to display name mapping for the Roshal storefront and admin.
 */

export const ROUTE_NAMES: Record<string, string> = {
  "": "Home",
  about: "About",
  "about-us": "About",
  cart: "Cart",
  checkout: "Checkout",
  contact: "Contact",
  "contact-us": "Contact",
  dashboard: "Dashboard",
  login: "Login",
  orders: "Orders",
  payments: "Payments",
  pages: "Marketing Pages",
  products: "Products",
  profile: "Profile",
  theme: "Storefront Theme",
  users: "Users",
};

const DETAIL_ROUTE_NAMES: Record<string, string> = {
  orders: "Order",
  pages: "Page",
  products: "Product",
  users: "User",
};

function humanizeSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function normalizePath(path: string): string {
  const cleanPath = path.replace(/^\/|\/$/g, "");

  if (cleanPath === "dashboard") {
    return "";
  }

  if (cleanPath.startsWith("dashboard/")) {
    return cleanPath.slice("dashboard/".length);
  }

  return cleanPath;
}

export function getRouteName(path: string): string {
  const cleanPath = normalizePath(path);

  if (ROUTE_NAMES[cleanPath]) {
    return ROUTE_NAMES[cleanPath];
  }

  const parts = cleanPath.split("/").filter(Boolean);
  if (parts.length > 1) {
    const parentPath = parts.slice(0, -1).join("/");
    const lastPart = parts.at(-1) || "";

    if (lastPart.startsWith("[") && lastPart.endsWith("]")) {
      if (DETAIL_ROUTE_NAMES[parentPath]) {
        return DETAIL_ROUTE_NAMES[parentPath];
      }

      if (ROUTE_NAMES[parentPath]) {
        return ROUTE_NAMES[parentPath];
      }
    }

    if (DETAIL_ROUTE_NAMES[parentPath]) {
      return DETAIL_ROUTE_NAMES[parentPath];
    }

    if (ROUTE_NAMES[parentPath]) {
      return humanizeSegment(lastPart);
    }
  }

  if (cleanPath === "") {
    return "Dashboard";
  }

  return parts.length > 0 ? humanizeSegment(parts.at(-1) || "") : "Dashboard";
}
