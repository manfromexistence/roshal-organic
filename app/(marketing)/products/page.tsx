"use client";

import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductFilterSidebar } from "@/components/product-filter-sidebar";
import { ProductSortBar } from "@/components/product-sort-bar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { products } from "@/data/products";
import type { ProductFilters, ViewMode } from "@/types/product";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    priceRange: [0, 5000],
    ratings: [],
    searchQuery: "",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.nameEn?.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.descriptionEn?.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category),
      );
    }

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.priceNumeric &&
        product.priceNumeric >= filters.priceRange[0] &&
        product.priceNumeric <= filters.priceRange[1],
    );

    // Apply rating filter
    if (filters.ratings.length > 0) {
      const minRating = Math.max(...filters.ratings);
      result = result.filter(
        (product) => product.rating && product.rating >= minRating,
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.priceNumeric ?? 0) - (b.priceNumeric ?? 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.priceNumeric ?? 0) - (a.priceNumeric ?? 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "bestseller":
        result.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return result;
  }, [filters, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 5000],
      ratings: [],
      searchQuery: "",
    });
    setSearchQuery("");
  };

  const handleAddToCart = (productId: number) => {
    console.log("Add to cart:", productId);
    // TODO: Implement cart functionality
  };

  const handleQuickView = (productId: number) => {
    console.log("Quick view:", productId);
    // TODO: Implement quick view modal
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          আমাদের পণ্যসমূহ
        </h1>
        <p className="text-xl text-muted-foreground text-center">
          ১০০% খাঁটি ও প্রাকৃতিক পণ্য—স্বাস্থ্যের জন্য সেরা পছন্দ
        </p>
      </div>

      {/* Sort Bar */}
      <ProductSortBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleFilters={() => setMobileFiltersOpen(true)}
        resultCount={filteredAndSortedProducts.length}
      />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block">
          <ProductFilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Filter Sidebar - Mobile */}
        {mobileFiltersOpen && (
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <ProductFilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </SheetContent>
          </Sheet>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">
                কোনো পণ্য পাওয়া যায়নি
              </p>
              <Button onClick={handleClearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Order CTA */}
      <div className="mt-16 bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">কাস্টম অর্ডার?</h2>
        <p className="text-muted-foreground mb-6">
          আপনার প্রয়োজন অনুযায়ী বিশেষ অর্ডারের জন্য আমাদের সাথে যোগাযোগ করুন।
        </p>
        <Link href="/contact">
          <Button size="lg">যোগাযোগ করুন</Button>
        </Link>
      </div>
    </div>
  );
}
