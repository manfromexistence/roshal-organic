export function getDashboardErrorFields(code: string | null | undefined) {
  switch (code) {
    case "duplicate-category-key":
    case "missing-category-key":
      return new Set(["key"]);
    case "missing-category-label":
      return new Set(["labelBn", "labelEn"]);
    case "duplicate-subcategory-key":
    case "missing-subcategory-key":
      return new Set(["key"]);
    case "missing-subcategory-label":
      return new Set(["labelBn", "labelEn"]);
    case "missing-subcategory-parent":
      return new Set(["categoryId"]);
    case "missing-product-name":
      return new Set(["nameBn", "nameEn"]);
    case "duplicate-product-slug":
    case "invalid-product-slug":
    case "missing-product-slug":
      return new Set(["slug"]);
    case "duplicate-product-sku":
    case "invalid-product-sku":
    case "missing-product-sku":
      return new Set(["sku"]);
    case "missing-product-category":
      return new Set(["categoryKey"]);
    case "invalid-product-price":
    case "missing-product-price":
      return new Set(["price", "purchaseOptionsJson"]);
    case "invalid-product-inventory":
      return new Set(["inventory", "purchaseOptionsJson"]);
    default:
      return new Set<string>();
  }
}

export function hasDashboardFieldError(
  errorFields: ReadonlySet<string>,
  fieldNames: string | string[],
) {
  const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames];

  return names.some((name) => errorFields.has(name));
}
