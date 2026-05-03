import { getLocalizedValue, localizedValue } from "@/lib/store-locale";
import type {
  LocalizedValue,
  RoshalLocale,
  RoshalProduct,
  RoshalStoreCategory,
  RoshalStoreSubcategory,
  RoshalTaxonomyBundle,
} from "@/lib/store-types";

export interface StorefrontTaxonomyChild {
  key: string;
  label: LocalizedValue;
  href: string;
  description: LocalizedValue;
}

export interface StorefrontTaxonomyGroup {
  key: string;
  label: LocalizedValue;
  href: string;
  description: LocalizedValue;
  featuredImage: string;
  children: StorefrontTaxonomyChild[];
}

export interface StorefrontHomepageCategory {
  key: string;
  name: LocalizedValue;
  image: string;
  href: string;
}

export interface StorefrontFooterCategoryLink {
  key: string;
  href: string;
  label: LocalizedValue;
}

export interface TaxonomyCategoryOption {
  key: string;
  label: string;
  count: number;
}

export interface TaxonomySubcategoryOption {
  key: string;
  categoryKey: string;
  label: string;
  count: number;
}

const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  "dairy-breakfast": "/yogurt-2.jpg",
  "fresh-vegetables": "/vegetables.jpg",
  "fruits-dates": "/mango-2.jpg",
  honey: "/honey.jpg",
  "jaggery-sweeteners": "/deal-2.jpg",
  "kitchen-essentials": "/ghee.jpg",
  "oil-ghee": "/ghee.jpg",
  "organic-certified": "/brand-story.jpg",
  "wellness-picks": "/special-offer.jpg",
};

function getSourceKeys(
  value:
    | Pick<RoshalStoreCategory, "key" | "sourceKeys">
    | Pick<RoshalStoreSubcategory, "key" | "sourceKeys">,
) {
  return value.sourceKeys.length > 0 ? value.sourceKeys : [value.key];
}

function getCategoryImage(
  category: Pick<RoshalStoreCategory, "imageUrl" | "key">,
) {
  return (
    category.imageUrl || CATEGORY_IMAGE_FALLBACKS[category.key] || "/logo.png"
  );
}

function hasDisplayLabel(
  value:
    | Pick<RoshalStoreCategory, "label">
    | Pick<RoshalStoreSubcategory, "label">,
) {
  return Boolean(value.label.bn.trim() || value.label.en.trim());
}

function hasSourceKey(sourceKeys: string[], value: string) {
  const normalizedValue = value.trim().toLowerCase();
  return sourceKeys.some((sourceKey) => sourceKey === normalizedValue);
}

function buildCategoryFallbackChildren(
  category: RoshalStoreCategory,
  children: StorefrontTaxonomyChild[],
): StorefrontTaxonomyChild[] {
  if (category.key) {
    return children;
  }

  const categoryHref = `/products?category=${category.key}`;

  if (children.length === 0) {
    return [
      {
        key: `${category.key}-browse`,
        label: localizedValue(
          `${category.label.bn} দেখুন`,
          `Browse ${category.label.en}`,
        ),
        href: categoryHref,
        description: category.description,
      },
    ];
  }

  if (children.length === 1) {
    return [
      ...children,
      {
        key: `${category.key}-all`,
        label: localizedValue(
          `সব ${category.label.bn}`,
          `All ${category.label.en}`,
        ),
        href: categoryHref,
        description: category.description,
      },
    ];
  }

  return children;
}

export function productMatchesCategory(
  product: Pick<RoshalProduct, "categoryKey">,
  category: Pick<RoshalStoreCategory, "key" | "sourceKeys">,
) {
  return hasSourceKey(getSourceKeys(category), product.categoryKey);
}

export function productMatchesSubcategory(
  product: Pick<RoshalProduct, "categoryKey">,
  subcategory: Pick<RoshalStoreSubcategory, "key" | "sourceKeys">,
) {
  return hasSourceKey(getSourceKeys(subcategory), product.categoryKey);
}

export function resolveCategoryForProduct(
  product: Pick<RoshalProduct, "categoryKey">,
  categories: RoshalStoreCategory[],
) {
  return (
    categories.find((category) => productMatchesCategory(product, category)) ||
    null
  );
}

export function resolveSubcategoryForProduct(
  product: Pick<RoshalProduct, "categoryKey">,
  subcategories: RoshalStoreSubcategory[],
) {
  return (
    subcategories.find((subcategory) =>
      productMatchesSubcategory(product, subcategory),
    ) || null
  );
}

export function buildStorefrontTaxonomy({
  categories,
  subcategories,
}: RoshalTaxonomyBundle): StorefrontTaxonomyGroup[] {
  return categories
    .filter(
      (category) =>
        category.isEnabled &&
        category.showInNavigation &&
        hasDisplayLabel(category),
    )
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((category) => {
      const children = subcategories
        .filter(
          (subcategory) =>
            subcategory.isEnabled &&
            subcategory.showInNavigation &&
            subcategory.categoryKey === category.key &&
            hasDisplayLabel(subcategory),
        )
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((subcategory) => ({
          key: subcategory.key,
          label: subcategory.label,
          href: `/products?category=${category.key}&subcategory=${subcategory.key}`,
          description: subcategory.description,
        }));

      return {
        key: category.key,
        label: category.label,
        href: `/products?category=${category.key}`,
        description: category.description,
        featuredImage: getCategoryImage(category),
        children: buildCategoryFallbackChildren(category, children),
      };
    });
}

export function buildHomepageCategories({
  categories,
}: RoshalTaxonomyBundle): StorefrontHomepageCategory[] {
  return categories
    .filter(
      (category) =>
        category.isEnabled &&
        category.showOnHomepage &&
        hasDisplayLabel(category),
    )
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((category) => ({
      key: category.key,
      name: category.label,
      image: getCategoryImage(category),
      href: `/products?category=${category.key}`,
    }));
}

export function buildFooterCategoryLinks({
  categories,
}: RoshalTaxonomyBundle): StorefrontFooterCategoryLink[] {
  return categories
    .filter((category) => category.isEnabled && hasDisplayLabel(category))
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((category) => ({
      key: category.key,
      href: `/products?category=${category.key}`,
      label: category.label,
    }));
}

export function getTaxonomyCategoryOptions(
  locale: RoshalLocale,
  categories: RoshalStoreCategory[],
  products: RoshalProduct[],
): TaxonomyCategoryOption[] {
  return categories
    .filter((category) => category.isEnabled && hasDisplayLabel(category))
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((category) => ({
      key: category.key,
      label: getLocalizedValue(locale, category.label),
      count: products.filter((product) =>
        productMatchesCategory(product, category),
      ).length,
    }));
}

export function getTaxonomySubcategoryOptions(
  locale: RoshalLocale,
  categoryKey: string,
  categories: RoshalStoreCategory[],
  subcategories: RoshalStoreSubcategory[],
  products: RoshalProduct[],
): TaxonomySubcategoryOption[] {
  const enabledSubcategories = subcategories
    .filter((subcategory) => subcategory.isEnabled)
    .filter((subcategory) => hasDisplayLabel(subcategory))
    .filter((subcategory) =>
      categoryKey === "all" ? true : subcategory.categoryKey === categoryKey,
    )
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((subcategory) => ({
      key: subcategory.key,
      categoryKey: subcategory.categoryKey,
      label: getLocalizedValue(locale, subcategory.label),
      count: products.filter((product) =>
        productMatchesSubcategory(product, subcategory),
      ).length,
    }));

  if (categoryKey !== "all") {
    return enabledSubcategories;
  }

  const fallbackByCategory = new Map<string, string>();
  for (const category of categories) {
    fallbackByCategory.set(
      category.key,
      getLocalizedValue(locale, category.label),
    );
  }

  return enabledSubcategories.map((subcategory) => ({
    ...subcategory,
    label: `${subcategory.label} · ${fallbackByCategory.get(subcategory.categoryKey) || subcategory.categoryKey}`,
  }));
}

export function productMatchesTaxonomySelection(
  product: Pick<RoshalProduct, "categoryKey">,
  categories: RoshalStoreCategory[],
  subcategories: RoshalStoreSubcategory[],
  activeCategory: string,
  activeSubcategory: string,
) {
  if (activeCategory !== "all") {
    const category = categories.find((item) => item.key === activeCategory);
    if (!category || !productMatchesCategory(product, category)) {
      return false;
    }
  }

  if (activeSubcategory !== "all") {
    const subcategory = subcategories.find(
      (item) => item.key === activeSubcategory,
    );
    if (!subcategory || !productMatchesSubcategory(product, subcategory)) {
      return false;
    }
  }

  return true;
}

export function getCategoryHrefForProduct(
  product: Pick<RoshalProduct, "categoryKey">,
  categories: RoshalStoreCategory[],
) {
  const category = resolveCategoryForProduct(product, categories);
  return category
    ? `/products?category=${category.key}`
    : `/products?category=${product.categoryKey}`;
}

export function getSubcategoryHrefForProduct(
  product: Pick<RoshalProduct, "categoryKey">,
  categories: RoshalStoreCategory[],
  subcategories: RoshalStoreSubcategory[],
) {
  const category = resolveCategoryForProduct(product, categories);
  const subcategory = resolveSubcategoryForProduct(product, subcategories);

  if (category && subcategory) {
    return `/products?category=${category.key}&subcategory=${subcategory.key}`;
  }

  return getCategoryHrefForProduct(product, categories);
}

export function getEmptyTaxonomyBundle(): RoshalTaxonomyBundle {
  return {
    categories: [],
    subcategories: [],
  };
}

export function getFallbackTaxonomyDescription() {
  return localizedValue(
    "ড্যাশবোর্ড থেকে এই ক্যাটাগরিটি কাস্টমাইজ করুন।",
    "Customize this category from the dashboard.",
  );
}
