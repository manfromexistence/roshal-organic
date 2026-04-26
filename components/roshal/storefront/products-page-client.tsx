"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RoshalProductCard } from "@/components/roshal/storefront/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLocalizedValue } from "@/lib/roshal/locale";
import type { RoshalLocale, RoshalProduct } from "@/lib/roshal/types";

type ProductSortKey = "featured" | "price-low" | "price-high" | "name";

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

export function ProductsPageClient({
  locale,
  products,
  initialSearchQuery,
  initialCategory,
  initialSortKey,
}: {
  locale: RoshalLocale;
  products: RoshalProduct[];
  initialSearchQuery: string;
  initialCategory: string;
  initialSortKey: ProductSortKey;
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
  const availableCategoryKeys = useMemo(
    () => new Set(categoryMap.keys()),
    [categoryMap],
  );
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [activeCategory, setActiveCategory] = useState(
    resolveCategoryKey(initialCategory, availableCategoryKeys),
  );
  const [sortKey, setSortKey] = useState<ProductSortKey>(initialSortKey);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedQuery = normalizeSearchValue(deferredSearchQuery);
  const trimmedSearchQuery = deferredSearchQuery.trim();
  const categoryOptions = [
    {
      key: "all",
      label: locale === "bn" ? "সব ক্যাটাগরি" : "All categories",
    },
    ...Array.from(categoryMap.entries()).map(([key, label]) => ({
      key,
      label,
    })),
  ];

  useEffect(() => {
    const nextQuery = parsedSearchParams.get("q") || "";
    const nextCategory = resolveCategoryKey(
      parsedSearchParams.get("category") || "all",
      availableCategoryKeys,
    );
    const nextSortKey = normalizeSortKey(parsedSearchParams.get("sort"));

    setSearchQuery((current) => (current === nextQuery ? current : nextQuery));
    setActiveCategory((current) =>
      current === nextCategory ? current : nextCategory,
    );
    setSortKey((current) => (current === nextSortKey ? current : nextSortKey));
  }, [availableCategoryKeys, parsedSearchParams]);

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
    pathname,
    router,
    searchParamsString,
    sortKey,
    trimmedSearchQuery,
  ]);

  const activeCategoryLabel =
    categoryOptions.find((category) => category.key === activeCategory)
      ?.label || categoryOptions[0].label;

  const filteredProducts = products
    .filter((product) => {
      if (activeCategory !== "all" && product.categoryKey !== activeCategory) {
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

      return left.sortOrder - right.sortOrder;
    });

  return (
    <div className="container mx-auto space-y-8 px-4 py-10">
      <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-background via-background to-muted/50">
        <CardContent className="space-y-5 p-8">
          {/* <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "স্টোরফ্রন্ট" : "Storefront"}
          </p> */}
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {locale === "bn"
                ? "Roshal Organic এর পণ্যসমূহ"
                : "Products from Roshal Organic"}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {locale === "bn"
                ? "মধু, ঘি, গুড়, তেল, ফল এবং আরও অনেক খাঁটি ও প্রাকৃতিক পণ্য এক জায়গায়।"
                : "Pure honey, ghee, jaggery, oils, fruits, and more natural essentials in one place."}
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr,14rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={
                  locale === "bn"
                    ? "পণ্য, ক্যাটাগরি বা সারাংশ খুঁজুন"
                    : "Search products, categories, or summaries"
                }
                className="pl-9"
              />
            </div>
            <Select
              value={sortKey}
              onValueChange={(value) => setSortKey(normalizeSortKey(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">
                  {locale === "bn" ? "ফিচারড আগে" : "Featured first"}
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

          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <Button
                key={category.key}
                type="button"
                variant={
                  activeCategory === category.key ? "default" : "outline"
                }
                size="sm"
                onClick={() => setActiveCategory(category.key)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {locale === "bn"
            ? `${filteredProducts.length}টি পণ্য পাওয়া গেছে`
            : `${filteredProducts.length} products found`}
        </p>
        <p className="text-sm text-muted-foreground">
          {locale === "bn"
            ? `ক্যাটাগরি: ${activeCategoryLabel}`
            : `Category: ${activeCategoryLabel}`}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="border-dashed border-border/70">
          <CardContent className="space-y-3 p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              {locale === "bn"
                ? "মিলে এমন কোনো পণ্য পাওয়া যায়নি"
                : "No matching products found"}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {locale === "bn"
                ? "ফিল্টার পরিবর্তন করুন অথবা অন্য কিওয়ার্ড দিয়ে খুঁজুন।"
                : "Change the filters or search with a different keyword."}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setSortKey("featured");
              }}
            >
              {locale === "bn" ? "ফিল্টার রিসেট" : "Reset filters"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
  );
}
