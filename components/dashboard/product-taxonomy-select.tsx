"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  RoshalStoreCategory,
  RoshalStoreSubcategory,
} from "@/lib/store-types";

const noSubcategoryValue = "__none";

function primarySourceKey(
  item: Pick<
    RoshalStoreCategory | RoshalStoreSubcategory,
    "key" | "sourceKeys"
  >,
) {
  return item.sourceKeys[0] || item.key;
}

export function ProductTaxonomySelect({
  categories,
  categoryHasError = false,
  subcategories,
  initialCategoryId,
  initialSubcategoryId,
}: {
  categories: RoshalStoreCategory[];
  categoryHasError?: boolean;
  subcategories: RoshalStoreSubcategory[];
  initialCategoryId: string;
  initialSubcategoryId: string;
}) {
  const enabledCategories = useMemo(
    () => categories.filter((category) => category.isEnabled),
    [categories],
  );
  const [categoryId, setCategoryId] = useState(
    initialCategoryId || enabledCategories[0]?.id || "",
  );
  const [subcategoryId, setSubcategoryId] = useState(
    initialSubcategoryId || noSubcategoryValue,
  );
  const selectedCategory =
    enabledCategories.find((category) => category.id === categoryId) ||
    enabledCategories[0] ||
    categories[0];
  const categorySubcategories = subcategories.filter(
    (subcategory) =>
      subcategory.isEnabled && subcategory.categoryId === selectedCategory?.id,
  );
  const selectedSubcategory =
    subcategoryId === noSubcategoryValue
      ? null
      : categorySubcategories.find(
          (subcategory) => subcategory.id === subcategoryId,
        ) || null;
  const source = selectedSubcategory || selectedCategory;
  const categoryKey = source ? primarySourceKey(source) : "";
  const categoryLabel = selectedCategory?.label || { bn: "", en: "" };

  return (
    <div className="grid min-w-0 gap-5 md:grid-cols-2">
      <input type="hidden" name="categoryKey" value={categoryKey} />
      <input type="hidden" name="categoryLabelBn" value={categoryLabel.bn} />
      <input type="hidden" name="categoryLabelEn" value={categoryLabel.en} />
      <input
        type="hidden"
        name="subcategoryKey"
        value={selectedSubcategory?.key || ""}
      />

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={selectedCategory?.id || ""}
          onValueChange={(value) => {
            setCategoryId(value);
            setSubcategoryId(noSubcategoryValue);
          }}
        >
          <SelectTrigger
            aria-invalid={categoryHasError || undefined}
            className="w-full"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {enabledCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Subcategory</Label>
        <Select value={subcategoryId} onValueChange={setSubcategoryId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={noSubcategoryValue}>No subcategory</SelectItem>
            {categorySubcategories.map((subcategory) => (
              <SelectItem key={subcategory.id} value={subcategory.id}>
                {subcategory.label.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
