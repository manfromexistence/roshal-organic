"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import type { ProductFilters } from "@/types/product";

interface ProductFilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

const categories = [
  { id: "honey", name: "মধু", nameEn: "Honey" },
  { id: "fruits", name: "ফলমূল", nameEn: "Fruits" },
  { id: "dairy", name: "দুগ্ধজাত পণ্য", nameEn: "Dairy" },
  { id: "oils", name: "তেল", nameEn: "Oils" },
  { id: "spices", name: "মশলা", nameEn: "Spices" },
  { id: "nuts", name: "নাটস ও সিডস", nameEn: "Nuts & Seeds" },
  { id: "dates", name: "খেজুর", nameEn: "Dates" },
  { id: "sweeteners", name: "মিষ্টি", nameEn: "Sweeteners" },
];

const ratingOptions = [
  { value: 4, label: "4 ★ & above" },
  { value: 3, label: "3 ★ & above" },
  { value: 2, label: "2 ★ & above" },
  { value: 1, label: "1 ★ & above" },
];

export function ProductFilterSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
}: ProductFilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    priceRange: true,
    ratings: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => {
      const newState = { ...prev };
      newState[section] = !prev[section];
      return newState;
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleRatingToggle = (rating: number) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    onFiltersChange({ ...filters, ratings: newRatings });
  };

  const handlePriceRangeChange = (values: number[]) => {
    onFiltersChange({ ...filters, priceRange: [values[0], values[1]] });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.ratings.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000 ||
    filters.searchQuery.length > 0;

  return (
    <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      <Collapsible
        open={expandedSections.categories}
        onOpenChange={() => toggleSection("categories")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-0 font-semibold"
          >
            Categories
            {expandedSections.categories ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {category.name}{" "}
                <span className="text-muted-foreground">
                  ({category.nameEn})
                </span>
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Price Range */}
      <Collapsible
        open={expandedSections.priceRange}
        onOpenChange={() => toggleSection("priceRange")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-0 font-semibold"
          >
            Price Range
            {expandedSections.priceRange ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-3">
          <Slider
            min={0}
            max={5000}
            step={100}
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              ৳{filters.priceRange[0]}
            </span>
            <span className="text-muted-foreground">
              ৳{filters.priceRange[1]}
            </span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Ratings */}
      <Collapsible
        open={expandedSections.ratings}
        onOpenChange={() => toggleSection("ratings")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-0 font-semibold"
          >
            Customer Ratings
            {expandedSections.ratings ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {ratingOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${option.value}`}
                checked={filters.ratings.includes(option.value)}
                onCheckedChange={() => handleRatingToggle(option.value)}
              />
              <Label
                htmlFor={`rating-${option.value}`}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
