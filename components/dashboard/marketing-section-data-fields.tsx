"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  showText: string;
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

const desktopSplitOptions = [
  { value: "carousel-heavy", label: "Large carousel, small right banner" },
  { value: "balanced", label: "Balanced carousel and banner" },
  { value: "banner-heavy", label: "Large right banner" },
];

const imageFitOptions = [
  { value: "cover", label: "Cover container" },
  { value: "contain", label: "Contain full image" },
  { value: "fill", label: "Fill container" },
];

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
    showText: stylePart(item, "showText") === "true" ? "true" : "false",
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
    showText: "false",
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

function serializeItem(
  item: EditableSectionItem,
  includeTextFields = true,
): RoshalMarketingSectionItem {
  const next: RoshalMarketingSectionItem = {};
  const styles: Record<string, string> = {};
  const title = includeTextFields
    ? localizedValue(item.titleBn, item.titleEn)
    : undefined;
  const body = includeTextFields
    ? localizedValue(item.bodyBn, item.bodyEn)
    : undefined;
  const label = includeTextFields
    ? localizedValue(item.labelBn, item.labelEn)
    : undefined;
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

  if (includeTextFields && item.href.trim()) {
    next.href = item.href.trim();
  }

  if (item.imageUrl.trim()) {
    next.imageUrl = item.imageUrl.trim();
  }

  if (includeTextFields && item.value.trim()) {
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

  if (includeTextFields && item.showText === "true") {
    styles.showText = "true";
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

function prepareItemForCopy(
  item: RoshalMarketingSectionItem,
  index: number,
  copy: Required<MarketingSectionItemsCopy>,
) {
  const editable = toEditableItem(item, index);

  if (!copy.showSlideDesignFields || editable.showText === "true") {
    return editable;
  }

  return {
    ...editable,
    bodyBn: "",
    bodyEn: "",
    href: "",
    labelBn: "",
    labelEn: "",
    titleBn: "",
    titleEn: "",
    value: "",
  };
}

function serializeItems(
  items: EditableSectionItem[],
  copy: Required<MarketingSectionItemsCopy>,
) {
  return items
    .map((item, index) => ({
      index,
      item: serializeItem(
        item,
        !copy.showSlideDesignFields || item.showText === "true",
      ),
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
    defaultItems.length
      ? defaultItems.map((item, index) => prepareItemForCopy(item, index, copy))
      : [],
  );
  const serializedValue = useMemo(
    () => JSON.stringify(serializeItems(items, copy), null, 2),
    [items, copy],
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
          {items.map((item, index) => {
            const showSlideText =
              !copy.showSlideDesignFields || item.showText === "true";

            return (
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
                            current.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
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
                  {copy.showSlideDesignFields ? (
                    <Button
                      type="button"
                      variant={showSlideText ? "default" : "outline"}
                      size="sm"
                      className="h-10 justify-start gap-2 self-end"
                      onClick={() =>
                        updateItem(
                          index,
                          "showText",
                          showSlideText ? "false" : "true",
                        )
                      }
                    >
                      {showSlideText ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                      {showSlideText ? "Hide text/button" : "Show text/button"}
                    </Button>
                  ) : null}
                  {copy.showSlideDesignFields ? null : (
                    <>
                      <ExactInput
                        label={copy.titleBnLabel}
                        value={item.titleBn}
                        onChange={(value) =>
                          updateItem(index, "titleBn", value)
                        }
                      />
                      <ExactInput
                        label={copy.titleEnLabel}
                        value={item.titleEn}
                        onChange={(value) =>
                          updateItem(index, "titleEn", value)
                        }
                      />
                      <ExactInput
                        label={copy.labelBnLabel}
                        value={item.labelBn}
                        onChange={(value) =>
                          updateItem(index, "labelBn", value)
                        }
                      />
                      <ExactInput
                        label={copy.labelEnLabel}
                        value={item.labelEn}
                        onChange={(value) =>
                          updateItem(index, "labelEn", value)
                        }
                      />
                      <ExactInput
                        label={copy.valueLabel}
                        value={item.value}
                        onChange={(value) => updateItem(index, "value", value)}
                      />
                    </>
                  )}
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
                  {copy.showSlideDesignFields && showSlideText ? (
                    <>
                      <ExactInput
                        label={copy.titleBnLabel}
                        value={item.titleBn}
                        onChange={(value) =>
                          updateItem(index, "titleBn", value)
                        }
                      />
                      <ExactInput
                        label={copy.titleEnLabel}
                        value={item.titleEn}
                        onChange={(value) =>
                          updateItem(index, "titleEn", value)
                        }
                      />
                      <div className="md:col-span-2">
                        <ExactTextarea
                          label={copy.bodyBnLabel}
                          value={item.bodyBn}
                          onChange={(value) =>
                            updateItem(index, "bodyBn", value)
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <ExactTextarea
                          label={copy.bodyEnLabel}
                          value={item.bodyEn}
                          onChange={(value) =>
                            updateItem(index, "bodyEn", value)
                          }
                        />
                      </div>
                    </>
                  ) : null}
                  {!copy.showSlideDesignFields ? (
                    <Accordion
                      type="single"
                      collapsible
                      className="md:col-span-2"
                    >
                      <AccordionItem
                        value={`item-details-${index}`}
                        className="rounded-md border border-border/60 px-3"
                      >
                        <AccordionTrigger className="py-3 text-left hover:no-underline">
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">
                              More item details
                            </span>
                            <span className="block text-xs font-normal text-muted-foreground">
                              Open only when this item needs paragraph text or a
                              custom link.
                            </span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent forceMount>
                          <div className="grid min-w-0 gap-3 pb-3 md:grid-cols-2">
                            <ExactInput
                              label={copy.hrefLabel}
                              value={item.href}
                              onChange={(value) =>
                                updateItem(index, "href", value)
                              }
                            />
                            <div className="md:col-span-2">
                              <ExactTextarea
                                label={copy.bodyBnLabel}
                                value={item.bodyBn}
                                onChange={(value) =>
                                  updateItem(index, "bodyBn", value)
                                }
                              />
                            </div>
                            <div className="md:col-span-2">
                              <ExactTextarea
                                label={copy.bodyEnLabel}
                                value={item.bodyEn}
                                onChange={(value) =>
                                  updateItem(index, "bodyEn", value)
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : null}
                  {copy.showSlideDesignFields ? (
                    <Accordion
                      type="single"
                      collapsible
                      className="md:col-span-2"
                    >
                      <AccordionItem
                        value={`slide-options-${index}`}
                        className="rounded-md border border-border/60 px-3"
                      >
                        <AccordionTrigger className="py-3 text-left hover:no-underline">
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">
                              Optional button and image settings
                            </span>
                            <span className="block text-xs font-normal text-muted-foreground">
                              Open only when this slide needs a button, custom
                              height, image fit, scale, or text color.
                            </span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent forceMount>
                          <div className="grid min-w-0 gap-3 pb-3 md:grid-cols-2">
                            {showSlideText ? (
                              <>
                                <ExactInput
                                  label={copy.labelBnLabel}
                                  value={item.labelBn}
                                  onChange={(value) =>
                                    updateItem(index, "labelBn", value)
                                  }
                                />
                                <ExactInput
                                  label={copy.labelEnLabel}
                                  value={item.labelEn}
                                  onChange={(value) =>
                                    updateItem(index, "labelEn", value)
                                  }
                                />
                                <ExactInput
                                  label={copy.valueLabel}
                                  value={item.value}
                                  onChange={(value) =>
                                    updateItem(index, "value", value)
                                  }
                                />
                                <ExactInput
                                  label={copy.hrefLabel}
                                  value={item.href}
                                  onChange={(value) =>
                                    updateItem(index, "href", value)
                                  }
                                />
                              </>
                            ) : null}
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
                              onChange={(value) =>
                                updateItem(index, "imageFit", value)
                              }
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
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : null}
                </div>
              </div>
            );
          })}
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

export function HeroSectionLayoutField({
  defaultStyles,
  name,
}: {
  defaultStyles: Record<string, string>;
  name: string;
}) {
  const [showSideBanner, setShowSideBanner] = useState(
    defaultStyles.showSideBanner !== "false",
  );
  const [sideShowText, setSideShowText] = useState(
    defaultStyles.sideShowText === "true",
  );
  const [desktopSplit, setDesktopSplit] = useState(
    defaultStyles.desktopSplit || "carousel-heavy",
  );
  const [containerHeight, setContainerHeight] = useState(
    defaultStyles.containerHeight || "",
  );
  const [imageFit, setImageFit] = useState(defaultStyles.imageFit || "cover");
  const [sideImageFit, setSideImageFit] = useState(
    defaultStyles.sideImageFit || defaultStyles.imageFit || "cover",
  );
  const [sideImageScale, setSideImageScale] = useState(
    defaultStyles.sideImageScale || "200",
  );
  const serializedValue = useMemo(() => {
    const next = { ...defaultStyles };

    next.showSideBanner = showSideBanner ? "true" : "false";
    next.sideShowText = sideShowText ? "true" : "false";
    next.desktopSplit = desktopSplit;
    next.imageFit = imageFit;
    next.sideImageFit = sideImageFit;
    next.sideImageScale = sideImageScale.trim() || "200";

    if (containerHeight.trim()) {
      next.containerHeight = containerHeight.trim();
    } else {
      delete next.containerHeight;
    }

    return JSON.stringify(next, null, 2);
  }, [
    containerHeight,
    defaultStyles,
    desktopSplit,
    imageFit,
    showSideBanner,
    sideImageFit,
    sideImageScale,
    sideShowText,
  ]);

  return (
    <div className="min-w-0 space-y-4">
      <input type="hidden" name={name} value={serializedValue} />
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
        Large screens show the carousel on the left and this desktop banner on
        the right. Smaller screens show only the carousel.
      </div>
      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <DashboardToggle
          checked={showSideBanner}
          label="Show right banner on desktop"
          onCheckedChange={setShowSideBanner}
        />
        <DashboardToggle
          checked={sideShowText}
          label="Show text/button on right banner"
          onCheckedChange={setSideShowText}
        />
        <ExactSelect
          label="Large-screen layout"
          options={desktopSplitOptions}
          value={desktopSplit}
          onChange={setDesktopSplit}
        />
        <ExactInput
          label="Hero height"
          value={containerHeight}
          onChange={setContainerHeight}
          placeholder="18rem, 320px, 45vh"
        />
        <ExactSelect
          label="Carousel image fit"
          options={imageFitOptions}
          value={imageFit}
          onChange={setImageFit}
        />
        <ExactSelect
          label="Right banner image fit"
          options={imageFitOptions}
          value={sideImageFit}
          onChange={setSideImageFit}
        />
        <ExactInput
          label="Right banner image scale %"
          value={sideImageScale}
          onChange={setSideImageScale}
          placeholder="200"
        />
      </div>
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

function ExactSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  value: string;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DashboardToggle({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (value: boolean) => void;
}) {
  const id = useId();

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-md border border-border/70 bg-background/60 p-3 text-sm font-medium">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
      <Label htmlFor={id} className="min-w-0">
        {label}
      </Label>
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
