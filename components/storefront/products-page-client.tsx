"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RoshalProductCard } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { formatBdt } from "@/lib/store-format";
import { getLocalizedValue } from "@/lib/store-locale";
import type { RoshalLocale, RoshalProduct } from "@/lib/store-types";

type ProductSortKey = "featured" | "price-low" | "price-high" | "name";

type PriceBounds = {
  min: number;
  max: number;
};

type CategoryOption = {
  key: string;
  label: string;
  count: number;
};

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase();
}

function normalizeSortKey(value: string | null | undefined): ProductSortKey {
  return value === "price-low" || value === "price-high" || value === "name"
    ? value
    : "featured";
}

function resolveCategoryKey(value: string, availableKeys: Set<string>) {
  return value !== "all" && availableKeys.has(value) ? value : "all";
}

function parsePriceValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function clampPrice(value: number, bounds: PriceBounds) {
  return Math.min(Math.max(value, bounds.min), bounds.max);
}

function resolvePriceRange(
  minPrice: number | null,
  maxPrice: number | null,
  bounds: PriceBounds,
): [number, number] {
  const resolvedMin = clampPrice(minPrice ?? bounds.min, bounds);
  const resolvedMax = clampPrice(maxPrice ?? bounds.max, bounds);

  if (resolvedMin > resolvedMax) {
    return [bounds.min, bounds.max];
  }

  return [resolvedMin, resolvedMax];
}

function areRangesEqual(
  left: readonly [number, number],
  right: readonly [number, number],
) {
  return left[0] === right[0] && left[1] === right[1];
}

function ProductFiltersPanel({
  locale,
  searchQuery,
  onSearchQueryChange,
  categoryOptions,
  activeCategory,
  onCategoryChange,
  priceBounds,
  priceRange,
  onPriceRangeChange,
  onReset,
}: {
  locale: RoshalLocale;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  categoryOptions: CategoryOption[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  priceBounds: PriceBounds;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="catalog-search">
          {locale === "bn" ? "পণ্য খুঁজুন" : "Search products"}
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="catalog-search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={
              locale === "bn"
                ? "নাম, সারাংশ বা ক্যাটাগরি দিয়ে খুঁজুন"
                : "Search by name, summary, or category"
            }
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{locale === "bn" ? "ক্যাটাগরি" : "Categories"}</Label>
          <span className="text-xs text-muted-foreground">
            {categoryOptions.length - 1} {locale === "bn" ? "ধরন" : "types"}
          </span>
        </div>
        <div className="space-y-2">
          {categoryOptions.map((category) => (
            <Button
              key={category.key}
              type="button"
              variant={activeCategory === category.key ? "secondary" : "ghost"}
              className="w-full justify-between rounded-xl px-3"
              onClick={() => onCategoryChange(category.key)}
            >
              <span>{category.label}</span>
              <Badge
                variant={
                  activeCategory === category.key ? "default" : "outline"
                }
                className="rounded-full"
              >
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{locale === "bn" ? "দামের সীমা" : "Price range"}</Label>
          <span className="text-xs text-muted-foreground">
            {formatBdt(priceBounds.min, locale)} -{" "}
            {formatBdt(priceBounds.max, locale)}
          </span>
        </div>

        <Slider
          value={priceRange}
          min={priceBounds.min}
          max={priceBounds.max}
          step={5}
          minStepsBetweenThumbs={1}
          onValueChange={(values) =>
            onPriceRangeChange(
              resolvePriceRange(
                values[0] ?? null,
                values[1] ?? null,
                priceBounds,
              ),
            )
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="min-price">
              {locale === "bn" ? "সর্বনিম্ন" : "Minimum"}
            </Label>
            <Input
              id="min-price"
              type="number"
              inputMode="numeric"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange[0]}
              onChange={(event) => {
                const nextValue = parsePriceValue(event.target.value);
                onPriceRangeChange(
                  resolvePriceRange(nextValue, priceRange[1], priceBounds),
                );
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-price">
              {locale === "bn" ? "সর্বোচ্চ" : "Maximum"}
            </Label>
            <Input
              id="max-price"
              type="number"
              inputMode="numeric"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange[1]}
              onChange={(event) => {
                const nextValue = parsePriceValue(event.target.value);
                onPriceRangeChange(
                  resolvePriceRange(priceRange[0], nextValue, priceBounds),
                );
              }}
            />
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onReset}
      >
        {locale === "bn" ? "সব ফিল্টার রিসেট করুন" : "Reset all filters"}
      </Button>
    </div>
  );
}

export function ProductsPageClient({
  locale,
  products,
  initialSearchQuery,
  initialCategory,
  initialSortKey,
  initialMinPrice,
  initialMaxPrice,
}: {
  locale: RoshalLocale;
  products: RoshalProduct[];
  initialSearchQuery: string;
  initialCategory: string;
  initialSortKey: ProductSortKey;
  initialMinPrice: number | null;
  initialMaxPrice: number | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const parsedSearchParams = useMemo(
    () => new URLSearchParams(searchParamsString),
    [searchParamsString],
  );
  const categoryMap = useMemo(
    () =>
      new Map(
        products.map((product) => [
          product.categoryKey,
          getLocalizedValue(locale, product.categoryLabel),
        ]),
      ),
    [locale, products],
  );
  const categoryCounts = useMemo(
    () =>
      products.reduce<Record<string, number>>((counts, product) => {
        counts[product.categoryKey] = (counts[product.categoryKey] ?? 0) + 1;
        return counts;
      }, {}),
    [products],
  );
  const availableCategoryKeys = useMemo(
    () => new Set(categoryMap.keys()),
    [categoryMap],
  );
  const priceBounds = useMemo<PriceBounds>(() => {
    if (products.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = products.map((product) => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);
  const categoryOptions = useMemo<CategoryOption[]>(
    () => [
      {
        key: "all",
        label: locale === "bn" ? "সব ক্যাটাগরি" : "All categories",
        count: products.length,
      },
      ...Array.from(categoryMap.entries()).map(([key, label]) => ({
        key,
        label,
        count: categoryCounts[key] ?? 0,
      })),
    ],
    [categoryCounts, categoryMap, locale, products.length],
  );
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [activeCategory, setActiveCategory] = useState(
    resolveCategoryKey(initialCategory, availableCategoryKeys),
  );
  const [sortKey, setSortKey] = useState<ProductSortKey>(initialSortKey);
  const [priceRange, setPriceRange] = useState<[number, number]>(() =>
    resolvePriceRange(initialMinPrice, initialMaxPrice, priceBounds),
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedQuery = normalizeSearchValue(deferredSearchQuery);
  const trimmedSearchQuery = deferredSearchQuery.trim();
  const defaultPriceRange = useMemo<[number, number]>(
    () => [priceBounds.min, priceBounds.max],
    [priceBounds.max, priceBounds.min],
  );

  useEffect(() => {
    const nextQuery = parsedSearchParams.get("q") || "";
    const nextCategory = resolveCategoryKey(
      parsedSearchParams.get("category") || "all",
      availableCategoryKeys,
    );
    const nextSortKey = normalizeSortKey(parsedSearchParams.get("sort"));
    const nextPriceRange = resolvePriceRange(
      parsePriceValue(parsedSearchParams.get("minPrice")),
      parsePriceValue(parsedSearchParams.get("maxPrice")),
      priceBounds,
    );

    setSearchQuery((current) => (current === nextQuery ? current : nextQuery));
    setActiveCategory((current) =>
      current === nextCategory ? current : nextCategory,
    );
    setSortKey((current) => (current === nextSortKey ? current : nextSortKey));
    setPriceRange((current) =>
      areRangesEqual(current, nextPriceRange) ? current : nextPriceRange,
    );
  }, [availableCategoryKeys, parsedSearchParams, priceBounds]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParamsString);

    if (trimmedSearchQuery) {
      nextParams.set("q", trimmedSearchQuery);
    } else {
      nextParams.delete("q");
    }

    if (activeCategory !== "all") {
      nextParams.set("category", activeCategory);
    } else {
      nextParams.delete("category");
    }

    if (sortKey !== "featured") {
      nextParams.set("sort", sortKey);
    } else {
      nextParams.delete("sort");
    }

    if (!areRangesEqual(priceRange, defaultPriceRange)) {
      nextParams.set("minPrice", priceRange[0].toString());
      nextParams.set("maxPrice", priceRange[1].toString());
    } else {
      nextParams.delete("minPrice");
      nextParams.delete("maxPrice");
    }

    const nextQueryString = nextParams.toString();

    if (searchParamsString === nextQueryString) {
      return;
    }

    startTransition(() => {
      router.replace(
        nextQueryString ? `${pathname}?${nextQueryString}` : pathname,
        {
          scroll: false,
        },
      );
    });
  }, [
    activeCategory,
    defaultPriceRange,
    pathname,
    priceRange,
    router,
    searchParamsString,
    sortKey,
    trimmedSearchQuery,
  ]);

  const activeCategoryLabel =
    categoryOptions.find((category) => category.key === activeCategory)
      ?.label || categoryOptions[0]?.label;

  const filteredProducts = products
    .filter((product) => {
      if (activeCategory !== "all" && product.categoryKey !== activeCategory) {
        return false;
      }

      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        product.name.bn,
        product.name.en,
        product.summary.bn,
        product.summary.en,
        product.categoryLabel.bn,
        product.categoryLabel.en,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .slice()
    .sort((left, right) => {
      if (sortKey === "price-low") {
        return left.price - right.price;
      }

      if (sortKey === "price-high") {
        return right.price - left.price;
      }

      if (sortKey === "name") {
        return getLocalizedValue(locale, left.name).localeCompare(
          getLocalizedValue(locale, right.name),
          locale === "en" ? "en" : "bn",
        );
      }

      if (left.isFeatured !== right.isFeatured) {
        return left.isFeatured ? -1 : 1;
      }

      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return getLocalizedValue(locale, left.name).localeCompare(
        getLocalizedValue(locale, right.name),
        locale === "en" ? "en" : "bn",
      );
    });

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSortKey("featured");
    setPriceRange(defaultPriceRange);
  };

  const activeFilterBadges = [
    trimmedSearchQuery
      ? locale === "bn"
        ? `খোঁজ: ${trimmedSearchQuery}`
        : `Search: ${trimmedSearchQuery}`
      : null,
    activeCategory !== "all"
      ? locale === "bn"
        ? `ক্যাটাগরি: ${activeCategoryLabel}`
        : `Category: ${activeCategoryLabel}`
      : null,
    !areRangesEqual(priceRange, defaultPriceRange)
      ? `${formatBdt(priceRange[0], locale)} - ${formatBdt(priceRange[1], locale)}`
      : null,
  ].filter(Boolean) as string[];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-8 md:grid-cols-[17rem,minmax(0,1fr)] xl:grid-cols-[18rem,minmax(0,1fr)]">
        <aside className="hidden self-start md:block">
          <div className="sticky top-24 space-y-6 rounded-3xl border border-border/70 bg-background/80 p-5 backdrop-blur supports-[backdrop-filter]:bg-background/65">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                {locale === "bn" ? "ফিল্টার" : "Filters"}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {locale === "bn" ? "পণ্য বাছাই করুন" : "Refine products"}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {locale === "bn"
                  ? "ক্যাটাগরি, সার্চ এবং দামের সীমা দিয়ে ফলাফল দ্রুত সংকুচিত করুন।"
                  : "Narrow the catalog quickly with category, search, and price controls."}
              </p>
            </div>
            <ProductFiltersPanel
              locale={locale}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              categoryOptions={categoryOptions}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              priceBounds={priceBounds}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onReset={resetFilters}
            />
          </div>
        </aside>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                  {locale === "bn" ? "রোশাল অর্গানিক" : "Roshal Organic"}
                </p>
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  {locale === "bn"
                    ? "সম্পূর্ণ পণ্য তালিকা"
                    : "Complete product catalog"}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                  {locale === "bn"
                    ? "মধু, ঘি, গুড়, তেল, ফল এবং সবজি মিলিয়ে পুরো লাইভ ক্যাটালগ এক জায়গায়।"
                    : "Browse the live catalog across honey, ghee, jaggery, oils, fruits, and vegetables in one place."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="md:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="size-4" />
                  {locale === "bn" ? "ফিল্টার" : "Filters"}
                </Button>

                <Select
                  value={sortKey}
                  onValueChange={(value) => setSortKey(normalizeSortKey(value))}
                >
                  <SelectTrigger className="min-w-[13rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">
                      {locale === "bn" ? "ফিচার্ড আগে" : "Featured first"}
                    </SelectItem>
                    <SelectItem value="price-low">
                      {locale === "bn" ? "কম দাম আগে" : "Price: low to high"}
                    </SelectItem>
                    <SelectItem value="price-high">
                      {locale === "bn" ? "বেশি দাম আগে" : "Price: high to low"}
                    </SelectItem>
                    <SelectItem value="name">
                      {locale === "bn" ? "নাম অনুযায়ী" : "Name"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {locale === "bn"
                  ? `${filteredProducts.length}টি পণ্য`
                  : `${filteredProducts.length} products`}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {locale === "bn"
                  ? `${categoryOptions.length - 1}টি ক্যাটাগরি`
                  : `${categoryOptions.length - 1} categories`}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {formatBdt(priceBounds.min, locale)} -{" "}
                {formatBdt(priceBounds.max, locale)}
              </Badge>
            </div>

            {activeFilterBadges.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilterBadges.map((filter) => (
                  <Badge
                    key={filter}
                    variant="outline"
                    className="rounded-full px-3 py-1"
                  >
                    {filter}
                  </Badge>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                >
                  <X className="size-4" />
                  {locale === "bn" ? "রিসেট" : "Clear"}
                </Button>
              </div>
            ) : null}
          </div>

          {filteredProducts.length === 0 ? (
            <Card className="border-dashed border-border/70">
              <CardContent className="space-y-3 p-8 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {locale === "bn"
                    ? "মিল পাওয়া যায়নি"
                    : "No matching products found"}
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {locale === "bn"
                    ? "সার্চ বা দামের সীমা পরিবর্তন করুন, অথবা সব ফিল্টার রিসেট করুন।"
                    : "Adjust your search or price range, or reset all filters."}
                </p>
                <Button type="button" variant="outline" onClick={resetFilters}>
                  {locale === "bn" ? "সব ফিল্টার রিসেট করুন" : "Reset all filters"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <RoshalProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full max-w-sm p-0">
          <SheetHeader className="border-b border-border/70 pb-4">
            <SheetTitle>
              {locale === "bn" ? "পণ্য ফিল্টার" : "Catalog filters"}
            </SheetTitle>
            <SheetDescription>
              {locale === "bn"
                ? "সার্চ, ক্যাটাগরি এবং দামের সীমা অনুযায়ী পণ্য ফিল্টার করুন।"
                : "Filter products by search, category, and price range."}
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <ProductFiltersPanel
              locale={locale}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              categoryOptions={categoryOptions}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              priceBounds={priceBounds}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onReset={() => {
                resetFilters();
                setMobileFiltersOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
