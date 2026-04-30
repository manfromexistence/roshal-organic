import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  roshalCategories,
  roshalSubcategories,
  roshalTaxonomyMeta,
} from "@/lib/schema";
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

function resolveSubcategories(
  subcategories: RoshalStoreSubcategory[],
  categories: RoshalStoreCategory[],
) {
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const categoryByKey = new Map(
    categories.map((category) => [category.key, category]),
  );

  return subcategories
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
}

const TAXONOMY_META_ID = "taxonomy-defaults";

async function ensureRoshalTaxonomySeeded() {
  const [metaRow] = await db
    .select()
    .from(roshalTaxonomyMeta)
    .where(eq(roshalTaxonomyMeta.id, TAXONOMY_META_ID))
    .limit(1);

  const existingCategories = await db
    .select({ id: roshalCategories.id })
    .from(roshalCategories)
    .limit(1);
  const existingSubcategories = await db
    .select({ id: roshalSubcategories.id })
    .from(roshalSubcategories)
    .limit(1);

  if (metaRow?.defaultsSeeded) {
    return;
  }

  if (existingCategories.length > 0 || existingSubcategories.length > 0) {
    const timestamp = new Date();

    await db
      .insert(roshalTaxonomyMeta)
      .values({
        id: TAXONOMY_META_ID,
        defaultsSeeded: true,
        createdAt: metaRow?.createdAt || timestamp,
        updatedAt: timestamp,
      })
      .onConflictDoUpdate({
        target: roshalTaxonomyMeta.id,
        set: {
          defaultsSeeded: true,
          updatedAt: timestamp,
        },
      });
    return;
  }

  const timestamp = new Date();

  await db.transaction(async (tx) => {
    await tx.insert(roshalCategories).values(
      defaultRoshalCategories.map((category) => ({
        id: category.id,
        key: category.key,
        labelBn: category.label.bn,
        labelEn: category.label.en,
        descriptionBn: category.description.bn || null,
        descriptionEn: category.description.en || null,
        imageUrl: category.imageUrl || null,
        sourceKeysJson: JSON.stringify(category.sourceKeys),
        isEnabled: category.isEnabled,
        showInNavigation: category.showInNavigation,
        showOnHomepage: category.showOnHomepage,
        sortOrder: category.sortOrder,
        createdAt: timestamp,
        updatedAt: timestamp,
      })),
    );

    await tx.insert(roshalSubcategories).values(
      defaultRoshalSubcategories.map((subcategory) => ({
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        key: subcategory.key,
        labelBn: subcategory.label.bn,
        labelEn: subcategory.label.en,
        descriptionBn: subcategory.description.bn || null,
        descriptionEn: subcategory.description.en || null,
        imageUrl: subcategory.imageUrl || null,
        sourceKeysJson: JSON.stringify(subcategory.sourceKeys),
        isEnabled: subcategory.isEnabled,
        showInNavigation: subcategory.showInNavigation,
        sortOrder: subcategory.sortOrder,
        createdAt: timestamp,
        updatedAt: timestamp,
      })),
    );

    await tx
      .insert(roshalTaxonomyMeta)
      .values({
        id: TAXONOMY_META_ID,
        defaultsSeeded: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .onConflictDoUpdate({
        target: roshalTaxonomyMeta.id,
        set: {
          defaultsSeeded: true,
          updatedAt: timestamp,
        },
      });
  });
}

export async function getRoshalTaxonomy(): Promise<RoshalTaxonomyBundle> {
  try {
    await ensureRoshalTaxonomySchema();
    await ensureRoshalTaxonomySeeded();

    const categoryRows = await db
      .select()
      .from(roshalCategories)
      .orderBy(asc(roshalCategories.sortOrder), asc(roshalCategories.labelEn));
    const categories = categoryRows.map(mapCategory);

    const subcategoryRows = await db
      .select()
      .from(roshalSubcategories)
      .orderBy(
        asc(roshalSubcategories.sortOrder),
        asc(roshalSubcategories.labelEn),
      );
    const subcategories = resolveSubcategories(
      subcategoryRows.map((row) => mapSubcategory(row, categories)),
      categories,
    );

    return {
      categories,
      subcategories,
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
