"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RoshalMarketingSectionItem } from "@/lib/store-types";

type EditableSectionItem = {
  bodyBn: string;
  bodyEn: string;
  containerHeight: string;
  href: string;
  imageFit: string;
  imageScale: string;
  imageUrl: string;
  labelBn: string;
  labelEn: string;
  sortOrder: string;
  textColor: string;
  titleBn: string;
  titleEn: string;
  value: string;
};

type StylePair = {
  key: string;
  value: string;
};

export type MarketingSectionItemsCopy = {
  addButtonLabel?: string;
  bodyBnLabel?: string;
  bodyEnLabel?: string;
  containerHeightLabel?: string;
  emptyText?: string;
  helperText?: string;
  hrefLabel?: string;
  imageFitLabel?: string;
  imageLabel?: string;
  imageScaleLabel?: string;
  itemLabel?: string;
  labelBnLabel?: string;
  labelEnLabel?: string;
  showSlideDesignFields?: boolean;
  sortLabel?: string;
  textColorLabel?: string;
  title?: string;
  titleBnLabel?: string;
  titleEnLabel?: string;
  valueLabel?: string;
};

const defaultItemsCopy: Required<MarketingSectionItemsCopy> = {
  addButtonLabel: "Add item",
  bodyBnLabel: "Body (BN)",
  bodyEnLabel: "Body (EN)",
  containerHeightLabel: "Container height",
  emptyText: "No items yet.",
  helperText:
    "Items render by Sort order. Hero items become slides; item-driven sections use these rows as cards or tiles.",
  hrefLabel: "Href",
  imageFitLabel: "Image fit",
  imageLabel: "Image URL",
  imageScaleLabel: "Image scale %",
  itemLabel: "Item",
  labelBnLabel: "Label (BN)",
  labelEnLabel: "Label (EN)",
  showSlideDesignFields: false,
  sortLabel: "Sort",
  textColorLabel: "Text color",
  title: "Items",
  titleBnLabel: "Title (BN)",
  titleEnLabel: "Title (EN)",
  valueLabel: "Value",
};

function resolveItemsCopy(
  overrides: MarketingSectionItemsCopy | undefined,
): Required<MarketingSectionItemsCopy> {
  return {
    ...defaultItemsCopy,
    ...(Object.fromEntries(
      Object.entries(overrides || {}).filter(
        ([, value]) => value !== undefined && value !== "",
      ),
    ) as MarketingSectionItemsCopy),
  };
}

function localizedPart(
  value: RoshalMarketingSectionItem["title"],
  key: "bn" | "en",
) {
  if (!value) {
    return "";
  }

  return value[key] || "";
}

function stylePart(item: RoshalMarketingSectionItem, key: string) {
  return item.styles?.[key] || "";
}

function toEditableItem(
  item: RoshalMarketingSectionItem,
  index: number,
): EditableSectionItem {
  return {
    bodyBn: localizedPart(item.body, "bn"),
    bodyEn: localizedPart(item.body, "en"),
    containerHeight: stylePart(item, "containerHeight"),
    href: item.href || "",
    imageFit: stylePart(item, "imageFit"),
    imageScale: stylePart(item, "imageScale"),
    imageUrl: item.imageUrl || "",
    labelBn: localizedPart(item.label, "bn"),
    labelEn: localizedPart(item.label, "en"),
    sortOrder: Number.isFinite(Number(item.sortOrder))
      ? String(Number(item.sortOrder))
      : String(index),
    textColor: stylePart(item, "textColor"),
    titleBn: localizedPart(item.title, "bn"),
    titleEn: localizedPart(item.title, "en"),
    value: item.value || "",
  };
}

function createEmptyItem(sortOrder: number): EditableSectionItem {
  return {
    bodyBn: "",
    bodyEn: "",
    containerHeight: "",
    href: "",
    imageFit: "",
    imageScale: "",
    imageUrl: "",
    labelBn: "",
    labelEn: "",
    sortOrder: String(sortOrder),
    textColor: "",
    titleBn: "",
    titleEn: "",
    value: "",
  };
}

function itemSortValue(value: string | number | undefined, fallback: number) {
  const parsed = Number.parseInt(String(value ?? ""), 10);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function localizedValue(bn: string, en: string) {
  const next = {
    bn: bn.trim(),
    en: en.trim(),
  };

  return next.bn || next.en ? next : undefined;
}

function serializeItem(item: EditableSectionItem): RoshalMarketingSectionItem {
  const next: RoshalMarketingSectionItem = {};
  const styles: Record<string, string> = {};
  const title = localizedValue(item.titleBn, item.titleEn);
  const body = localizedValue(item.bodyBn, item.bodyEn);
  const label = localizedValue(item.labelBn, item.labelEn);
  const sortOrder = itemSortValue(item.sortOrder, Number.NaN);

  if (title) {
    next.title = title;
  }

  if (body) {
    next.body = body;
  }

  if (label) {
    next.label = label;
  }

  if (item.href.trim()) {
    next.href = item.href.trim();
  }

  if (item.imageUrl.trim()) {
    next.imageUrl = item.imageUrl.trim();
  }

  if (item.value.trim()) {
    next.value = item.value.trim();
  }

  if (Number.isFinite(sortOrder)) {
    next.sortOrder = sortOrder;
  }

  if (item.containerHeight.trim()) {
    styles.containerHeight = item.containerHeight.trim();
  }

  if (item.imageFit.trim()) {
    styles.imageFit = item.imageFit.trim();
  }

  if (item.imageScale.trim()) {
    styles.imageScale = item.imageScale.trim();
  }

  if (item.textColor.trim()) {
    styles.textColor = item.textColor.trim();
  }

  if (Object.keys(styles).length) {
    next.styles = styles;
  }

  return next;
}

function hasItemData(item: RoshalMarketingSectionItem) {
  return Boolean(
    item.title ||
      item.body ||
      item.label ||
      item.href ||
      item.imageUrl ||
      item.value,
  );
}

function serializeItems(items: EditableSectionItem[]) {
  return items
    .map((item, index) => ({
      index,
      item: serializeItem(item),
      sortOrder: itemSortValue(item.sortOrder, index),
    }))
    .filter(({ item }) => hasItemData(item))
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.index - right.index;
    })
    .map(({ item }, index) => ({
      ...item,
      sortOrder: Number.isFinite(Number(item.sortOrder))
        ? Number(item.sortOrder)
        : index,
    }));
}

function resequenceItems(items: EditableSectionItem[]) {
  return items.map((item, index) => ({
    ...item,
    sortOrder: String(index),
  }));
}

function createStylePairs(styles: Record<string, string>): StylePair[] {
  return Object.entries(styles).map(([key, value]) => ({
    key,
    value: String(value ?? ""),
  }));
}

function serializeStylePairs(pairs: StylePair[]) {
  return pairs.reduce<Record<string, string>>((next, pair) => {
    const key = pair.key.trim();

    if (key) {
      next[key] = pair.value.trim();
    }

    return next;
  }, {});
}

export function MarketingSectionItemsField({
  copy: copyOverrides,
  defaultItems,
  name,
}: {
  copy?: MarketingSectionItemsCopy;
  defaultItems: RoshalMarketingSectionItem[];
  name: string;
}) {
  const copy = resolveItemsCopy(copyOverrides);
  const [items, setItems] = useState<EditableSectionItem[]>(() =>
    defaultItems.length ? defaultItems.map(toEditableItem) : [],
  );
  const serializedValue = useMemo(
    () => JSON.stringify(serializeItems(items), null, 2),
    [items],
  );

  const updateItem = (
    index: number,
    key: keyof EditableSectionItem,
    value: string,
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];

      return resequenceItems(next);
    });
  };

  return (
    <div className="min-w-0 space-y-3">
      <div className="space-y-1">
        <Label>{copy.title}</Label>
        <p className="text-xs text-muted-foreground">{copy.helperText}</p>
      </div>
      <input type="hidden" name={name} value={serializedValue} />

      {items.length ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`marketing-section-item-${index}`}
              className="space-y-4 rounded-lg border border-border/70 bg-muted/10 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">
                  {copy.itemLabel} {index + 1}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground"
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                  >
                    <ArrowUp className="size-4" />
                    <span className="sr-only">
                      Move {copy.itemLabel.toLowerCase()} up
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 1)}
                  >
                    <ArrowDown className="size-4" />
                    <span className="sr-only">
                      Move {copy.itemLabel.toLowerCase()} down
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setItems((current) =>
                        resequenceItems(
                          current.filter((_, itemIndex) => itemIndex !== index),
                        ),
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid min-w-0 gap-3 md:grid-cols-2">
                <ExactInput
                  label={copy.sortLabel}
                  value={item.sortOrder}
                  onChange={(value) => updateItem(index, "sortOrder", value)}
                />
                <ExactInput
                  label={copy.titleBnLabel}
                  value={item.titleBn}
                  onChange={(value) => updateItem(index, "titleBn", value)}
                />
                <ExactInput
                  label={copy.titleEnLabel}
                  value={item.titleEn}
                  onChange={(value) => updateItem(index, "titleEn", value)}
                />
                <ExactInput
                  label={copy.labelBnLabel}
                  value={item.labelBn}
                  onChange={(value) => updateItem(index, "labelBn", value)}
                />
                <ExactInput
                  label={copy.labelEnLabel}
                  value={item.labelEn}
                  onChange={(value) => updateItem(index, "labelEn", value)}
                />
                <ExactInput
                  label={copy.valueLabel}
                  value={item.value}
                  onChange={(value) => updateItem(index, "value", value)}
                />
                <ExactInput
                  label={copy.hrefLabel}
                  value={item.href}
                  onChange={(value) => updateItem(index, "href", value)}
                />
                <div className="md:col-span-2">
                  <ExactTextarea
                    label={copy.bodyBnLabel}
                    value={item.bodyBn}
                    onChange={(value) => updateItem(index, "bodyBn", value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <ExactTextarea
                    label={copy.bodyEnLabel}
                    value={item.bodyEn}
                    onChange={(value) => updateItem(index, "bodyEn", value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUploadField
                    name={undefined}
                    label={copy.imageLabel}
                    value={item.imageUrl}
                    onChange={(value) => updateItem(index, "imageUrl", value)}
                    compact
                    previewClassName="w-full max-w-48"
                  />
                </div>
                {copy.showSlideDesignFields ? (
                  <div className="grid min-w-0 gap-3 rounded-md border border-border/60 bg-background/70 p-3 md:col-span-2 md:grid-cols-2">
                    <ExactInput
                      label={copy.containerHeightLabel}
                      value={item.containerHeight}
                      onChange={(value) =>
                        updateItem(index, "containerHeight", value)
                      }
                      placeholder="18rem, 320px, 45vh"
                    />
                    <ExactInput
                      label={copy.imageFitLabel}
                      value={item.imageFit}
                      onChange={(value) => updateItem(index, "imageFit", value)}
                      placeholder="cover or contain"
                    />
                    <ExactInput
                      label={copy.imageScaleLabel}
                      value={item.imageScale}
                      onChange={(value) =>
                        updateItem(index, "imageScale", value)
                      }
                      placeholder="100"
                    />
                    <ExactInput
                      label={copy.textColorLabel}
                      value={item.textColor}
                      onChange={(value) =>
                        updateItem(index, "textColor", value)
                      }
                      placeholder="#0f3d24, white, var(--foreground)"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border/70 bg-muted/10 p-3 text-sm text-muted-foreground">
          {copy.emptyText}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() =>
          setItems((current) => {
            const nextSortOrder =
              current.reduce(
                (maxSortOrder, item, index) =>
                  Math.max(maxSortOrder, itemSortValue(item.sortOrder, index)),
                -1,
              ) + 1;

            return [...current, createEmptyItem(nextSortOrder)];
          })
        }
      >
        <Plus className="size-4" />
        {copy.addButtonLabel}
      </Button>
    </div>
  );
}

export function MarketingSectionStylesField({
  defaultStyles,
  name,
}: {
  defaultStyles: Record<string, string>;
  name: string;
}) {
  const [pairs, setPairs] = useState<StylePair[]>(() =>
    createStylePairs(defaultStyles),
  );
  const serializedValue = useMemo(
    () => JSON.stringify(serializeStylePairs(pairs), null, 2),
    [pairs],
  );

  const updatePair = (index: number, key: keyof StylePair, value: string) => {
    setPairs((current) =>
      current.map((pair, pairIndex) =>
        pairIndex === index ? { ...pair, [key]: value } : pair,
      ),
    );
  };

  return (
    <div className="min-w-0 space-y-3">
      <div className="space-y-1">
        <Label>Styles</Label>
        <p className="text-xs text-muted-foreground">
          Edit the exact style key and string value pairs saved for this
          section.
        </p>
      </div>
      <input type="hidden" name={name} value={serializedValue} />

      {pairs.length ? (
        <div className="space-y-3 rounded-lg border border-border/70 bg-muted/10 p-3">
          {pairs.map((pair, index) => (
            <div
              key={`marketing-section-style-${index}`}
              className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto]"
            >
              <ExactInput
                label="Key"
                value={pair.key}
                onChange={(value) => updatePair(index, "key", value)}
              />
              <ExactInput
                label="Value"
                value={pair.value}
                onChange={(value) => updatePair(index, "value", value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="self-end text-muted-foreground hover:text-destructive"
                onClick={() =>
                  setPairs((current) =>
                    current.filter((_, pairIndex) => pairIndex !== index),
                  )
                }
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Remove style</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border/70 bg-muted/10 p-3 text-sm text-muted-foreground">
          No styles yet.
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() =>
          setPairs((current) => [...current, { key: "", value: "" }])
        }
      >
        <Plus className="size-4" />
        Add style
      </Button>
    </div>
  );
}

function ExactInput({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function ExactTextarea({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label>{label}</Label>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
      />
    </div>
  );
}
