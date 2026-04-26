const roshalReservedPageSlugs = new Set([
  "products",
  "cart",
  "checkout",
  "orders",
  "profile",
  "login",
  "dashboard",
  "api",
  "_next",
  "collections",
  "payment-return",
]);

const roshalRouteSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeRoshalRouteSlug(value: string | null | undefined) {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");
}

export function isValidRoshalRouteSlug(value: string) {
  return roshalRouteSlugPattern.test(value);
}

export function isRoshalReservedPageSlug(value: string) {
  return roshalReservedPageSlugs.has(normalizeRoshalRouteSlug(value));
}

export function getRoshalReservedPageSlugs() {
  return Array.from(roshalReservedPageSlugs).sort((left, right) =>
    left.localeCompare(right),
  );
}

export function normalizeRoshalSectionKey(value: string | null | undefined) {
  return normalizeRoshalRouteSlug(value);
}

export function isValidRoshalSectionKey(value: string) {
  return isValidRoshalRouteSlug(value);
}
