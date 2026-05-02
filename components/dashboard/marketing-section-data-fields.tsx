"use client";

import { Plus, Trash2 } from "lucide-react";
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
  href: string;
  imageUrl: string;
  labelBn: string;
  labelEn: string;
  titleBn: string;
  titleEn: string;
  value: string;
};

type StylePair = {
  key: string;
  value: string;
};

function localizedPart(
  value: RoshalMarketingSectionItem["title"],
  key: "bn" | "en",
) {
  if (!value) {
    return "";
  }

  return value[key] || "";
}

function toEditableItem(item: RoshalMarketingSectionItem): EditableSectionItem {
  return {
    bodyBn: localizedPart(item.body, "bn"),
    bodyEn: localizedPart(item.body, "en"),
    href: item.href || "",
    imageUrl: item.imageUrl || "",
    labelBn: localizedPart(item.label, "bn"),
    labelEn: localizedPart(item.label, "en"),
    titleBn: localizedPart(item.title, "bn"),
    titleEn: localizedPart(item.title, "en"),
    value: item.value || "",
  };
}

function createEmptyItem(): EditableSectionItem {
  return {
    bodyBn: "",
    bodyEn: "",
    href: "",
    imageUrl: "",
    labelBn: "",
    labelEn: "",
    titleBn: "",
    titleEn: "",
    value: "",
  };
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
  const title = localizedValue(item.titleBn, item.titleEn);
  const body = localizedValue(item.bodyBn, item.bodyEn);
  const label = localizedValue(item.labelBn, item.labelEn);

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
  defaultItems,
  name,
}: {
  defaultItems: RoshalMarketingSectionItem[];
  name: string;
}) {
  const [items, setItems] = useState<EditableSectionItem[]>(() =>
    defaultItems.length ? defaultItems.map(toEditableItem) : [],
  );
  const serializedValue = useMemo(
    () => JSON.stringify(items.map(serializeItem).filter(hasItemData), null, 2),
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

  return (
    <div className="min-w-0 space-y-3">
      <div className="space-y-1">
        <Label>Items</Label>
        <p className="text-xs text-muted-foreground">
          Edit only the CMS item fields used by the storefront.
        </p>
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
                <p className="text-sm font-medium">Item {index + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setItems((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <Trash2 className="size-4" />
                  Remove
                </Button>
              </div>

              <div className="grid min-w-0 gap-3 md:grid-cols-2">
                <ExactInput
                  label="Title (BN)"
                  value={item.titleBn}
                  onChange={(value) => updateItem(index, "titleBn", value)}
                />
                <ExactInput
                  label="Title (EN)"
                  value={item.titleEn}
                  onChange={(value) => updateItem(index, "titleEn", value)}
                />
                <ExactInput
                  label="Label (BN)"
                  value={item.labelBn}
                  onChange={(value) => updateItem(index, "labelBn", value)}
                />
                <ExactInput
                  label="Label (EN)"
                  value={item.labelEn}
                  onChange={(value) => updateItem(index, "labelEn", value)}
                />
                <ExactInput
                  label="Value"
                  value={item.value}
                  onChange={(value) => updateItem(index, "value", value)}
                />
                <ExactInput
                  label="Href"
                  value={item.href}
                  onChange={(value) => updateItem(index, "href", value)}
                />
                <div className="md:col-span-2">
                  <ExactTextarea
                    label="Body (BN)"
                    value={item.bodyBn}
                    onChange={(value) => updateItem(index, "bodyBn", value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <ExactTextarea
                    label="Body (EN)"
                    value={item.bodyEn}
                    onChange={(value) => updateItem(index, "bodyEn", value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUploadField
                    name={undefined}
                    label="Image URL"
                    value={item.imageUrl}
                    onChange={(value) => updateItem(index, "imageUrl", value)}
                    compact
                    previewClassName="w-full max-w-48"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border/70 bg-muted/10 p-3 text-sm text-muted-foreground">
          No items yet.
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setItems((current) => [...current, createEmptyItem()])}
      >
        <Plus className="size-4" />
        Add item
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
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
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
