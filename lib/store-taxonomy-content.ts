import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { roshalCategories, roshalSubcategories } from "@/lib/schema";
import { safeJsonParse } from "@/lib/store-format";
import { normalizeRoshalAssetPath } from "@/lib/store-media";
import {
  defaultRoshalCategories,
  defaultRoshalSubcategories,
} from "@/lib/store-taxonomy-defaults";
import { ensureRoshalTaxonomySchema } from "@/lib/store-taxonomy-schema";
import type {
  RoshalStoreCategory,
  RoshalStoreSubcategory,
  RoshalTaxonomyBundle,
} from "@/lib/store-types";

function normalizeSourceKeys(keys: string[], fallbackKey: string) {
  const normalized = Array.from(
    new Set(keys.map((value) => value.trim().toLowerCase()).filter(Boolean)),
  );

  return normalized.length > 0 ? normalized : [fallbackKey];
}

function mapCategory(
  row: typeof roshalCategories.$inferSelect,
): RoshalStoreCategory {
  return {
    id: row.id,
    key: row.key,
    label: {
      bn: row.labelBn,
      en: row.labelEn,
    },
    description: {
      bn: row.descriptionBn || "",
      en: row.descriptionEn || "",
    },
    imageUrl: normalizeRoshalAssetPath(row.imageUrl, ""),
    sourceKeys: normalizeSourceKeys(
      safeJsonParse<string[]>(row.sourceKeysJson, []),
      row.key,
    ),
    isEnabled: Boolean(row.isEnabled),
    showInNavigation: Boolean(row.showInNavigation),
    showOnHomepage: Boolean(row.showOnHomepage),
    sortOrder: row.sortOrder,
  };
}

function mapSubcategory(
  row: typeof roshalSubcategories.$inferSelect,
  categories: RoshalStoreCategory[],
): RoshalStoreSubcategory {
  const categoryKey =
    categories.find((category) => category.id === row.categoryId)?.key || "";

  return {
    id: row.id,
    categoryId: row.categoryId,
    categoryKey,
    key: row.key,
    label: {
      bn: row.labelBn,
      en: row.labelEn,
    },
    description: {
      bn: row.descriptionBn || "",
      en: row.descriptionEn || "",
    },
    imageUrl: normalizeRoshalAssetPath(row.imageUrl, ""),
    sourceKeys: normalizeSourceKeys(
      safeJsonParse<string[]>(row.sourceKeysJson, []),
      row.key,
    ),
    isEnabled: Boolean(row.isEnabled),
    showInNavigation: Boolean(row.showInNavigation),
    sortOrder: row.sortOrder,
  };
}

function mergeCategories(categories: RoshalStoreCategory[]) {
  const categoryByKey = new Map(
    categories.map((category) => [category.key, category]),
  );
  const merged: RoshalStoreCategory[] = [];
  const seenKeys = new Set<string>();

  for (const fallback of defaultRoshalCategories) {
    const category = categoryByKey.get(fallback.key) || fallback;
    merged.push(category);
    seenKeys.add(category.key);
  }

  const customCategories = categories
    .filter((category) => !seenKeys.has(category.key))
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.label.en.localeCompare(right.label.en);
    });

  return [...merged, ...customCategories];
}

function mergeSubcategories(
  subcategories: RoshalStoreSubcategory[],
  categories: RoshalStoreCategory[],
) {
  const subcategoryByKey = new Map(
    subcategories.map((subcategory) => [subcategory.key, subcategory]),
  );
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const categoryByKey = new Map(
    categories.map((category) => [category.key, category]),
  );
  const merged: RoshalStoreSubcategory[] = [];
  const seenKeys = new Set<string>();

  for (const fallback of defaultRoshalSubcategories) {
    const subcategory = subcategoryByKey.get(fallback.key) || fallback;
    const resolvedCategory =
      categoryById.get(subcategory.categoryId) ||
      categoryByKey.get(subcategory.categoryKey) ||
      categoryById.get(fallback.categoryId) ||
      categoryByKey.get(fallback.categoryKey);

    merged.push({
      ...subcategory,
      categoryId: resolvedCategory?.id || subcategory.categoryId,
      categoryKey: resolvedCategory?.key || subcategory.categoryKey,
    });
    seenKeys.add(subcategory.key);
  }

  const customSubcategories = subcategories
    .filter((subcategory) => !seenKeys.has(subcategory.key))
    .map((subcategory) => {
      const resolvedCategory =
        categoryById.get(subcategory.categoryId) ||
        categoryByKey.get(subcategory.categoryKey);

      return {
        ...subcategory,
        categoryId: resolvedCategory?.id || subcategory.categoryId,
        categoryKey: resolvedCategory?.key || subcategory.categoryKey,
      };
    })
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.label.en.localeCompare(right.label.en);
    });

  return [...merged, ...customSubcategories];
}

export async function getRoshalTaxonomy(): Promise<RoshalTaxonomyBundle> {
  try {
    await ensureRoshalTaxonomySchema();

    const categoryRows = await db
      .select()
      .from(roshalCategories)
      .orderBy(asc(roshalCategories.sortOrder), asc(roshalCategories.labelEn));
    const mergedCategories = mergeCategories(categoryRows.map(mapCategory));

    const subcategoryRows = await db
      .select()
      .from(roshalSubcategories)
      .orderBy(
        asc(roshalSubcategories.sortOrder),
        asc(roshalSubcategories.labelEn),
      );
    const mergedSubcategories = mergeSubcategories(
      subcategoryRows.map((row) => mapSubcategory(row, mergedCategories)),
      mergedCategories,
    );

    return {
      categories: mergedCategories,
      subcategories: mergedSubcategories,
    };
  } catch {
    return {
      categories: defaultRoshalCategories,
      subcategories: defaultRoshalSubcategories,
    };
  }
}

export async function getRoshalCategoryByKey(key: string) {
  const taxonomy = await getRoshalTaxonomy();
  return taxonomy.categories.find((category) => category.key === key) || null;
}

export async function getRoshalSubcategoriesForCategory(categoryId: string) {
  const taxonomy = await getRoshalTaxonomy();
  return taxonomy.subcategories.filter(
    (subcategory) => subcategory.categoryId === categoryId,
  );
}

export async function getRoshalSubcategoriesForCategoryKey(
  categoryKey: string,
) {
  const taxonomy = await getRoshalTaxonomy();
  return taxonomy.subcategories.filter(
    (subcategory) => subcategory.categoryKey === categoryKey,
  );
}
