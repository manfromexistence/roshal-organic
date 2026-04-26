"use client";

import { Filter, Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const collections = [
  {
    id: 1,
    name: "খাঁটি মধু",
    image: "/honey-2.jpg",
    price: "৳৪৫০",
    originalPrice: "৳৫৫০",
    category: "honey",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "মৌসুমী আম",
    image: "/mango-2.jpg",
    price: "৳৩০০",
    originalPrice: "৳৩৫০",
    category: "fruits",
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 3,
    name: "ফ্রেশ দই",
    image: "/yogurt-2.jpg",
    price: "৳১২০",
    originalPrice: "৳১৫০",
    category: "dairy",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "অর্গানিক ঘি",
    image: "/ghee-2.jpg",
    price: "৳৮০০",
    originalPrice: "৳৯৫০",
    category: "dairy",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 5,
    name: "প্রিমিয়াম খেজুর",
    image: "/dates-2.jpg",
    price: "৳৪৫০",
    originalPrice: "৳৫৫০",
    category: "dates",
    rating: 4.8,
    reviews: 178,
  },
  {
    id: 6,
    name: "মশলা সমূহ",
    image: "/spices-2.jpg",
    price: "৳২৫০",
    originalPrice: "৳৩০০",
    category: "spices",
    rating: 4.6,
    reviews: 92,
  },
  {
    id: 7,
    name: "নাটস ও সিডস",
    image: "/nuts-2.jpg",
    price: "৳৩৫০",
    originalPrice: "৳৪০০",
    category: "nuts",
    rating: 4.7,
    reviews: 145,
  },
  {
    id: 8,
    name: "প্রাকৃতিক তেল",
    image: "/oil-2.jpg",
    price: "৳২৮০",
    originalPrice: "৳৩২০",
    category: "oil",
    rating: 4.5,
    reviews: 67,
  },
  {
    id: 9,
    name: "তাজা ফলমূল",
    image: "/fresh-fruit-basket.jpg",
    price: "৳৫০০",
    originalPrice: "৳৬০০",
    category: "fruits",
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 10,
    name: "অর্গানিক শাকসবজি",
    image: "/organic-vegetables.jpg",
    price: "৳৩৫০",
    originalPrice: "৳৪০০",
    category: "vegetables",
    rating: 4.6,
    reviews: 187,
  },
  {
    id: 11,
    name: "সারা চাল",
    image: "/rice-2.jpg",
    price: "৳২২০",
    originalPrice: "৳২৫০",
    category: "grains",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 12,
    name: "সবুজ চা",
    image: "/green-tea.jpg",
    price: "১৮০",
    originalPrice: "৳২০০",
    category: "beverage",
    rating: 4.5,
    reviews: 98,
  },
];

const categories = [
  { id: "all", name: "সব পণ্য" },
  { id: "honey", name: "মধু" },
  { id: "fruits", name: "ফলমূল" },
  { id: "dairy", name: "দুগ্ধজাত" },
  { id: "dates", name: "খেজুর" },
  { id: "spices", name: "মশলা" },
  { id: "nuts", name: "নাটস" },
  { id: "oil", name: "তেল" },
  { id: "vegetables", name: "শাকসবজি" },
  { id: "grains", name: "শস্য" },
  { id: "beverage", name: "পানীয়" },
];

const sortOptions = [
  { id: "featured", name: "জনপ্রিয়" },
  { id: "price-low", name: "দাম কম থেকে বেশি" },
  { id: "price-high", name: "দাম বেশি থেকে কম" },
  { id: "rating", name: "রেটিং" },
  { id: "newest", name: "নতুন" },
];

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = collections.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "price-low":
        return (
          parseInt(a.price.replace(/[^\d]/g, ""), 10) -
          parseInt(b.price.replace(/[^\d]/g, ""), 10)
        );
      case "price-high":
        return (
          parseInt(b.price.replace(/[^\d]/g, ""), 10) -
          parseInt(a.price.replace(/[^\d]/g, ""), 10)
        );
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-foreground">
          কালেকশন
        </h1>
        <p className="text-xl text-muted-foreground text-center">
          আমাদের সব পণ্যের কালেকশন থেকে আপনার পছন্দের পণ্য বেছে নিন
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            ফিল্টার
          </Button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">ক্যাটাগরি:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="md:hidden space-y-4 p-4 bg-muted rounded-lg">
            <div>
              <span className="text-sm font-medium text-foreground mb-2 block">
                ক্যাটাগরি
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">সর্ট:</span>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-3 py-2 rounded-md border bg-background text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {sortedProducts.length} টি পণ্য পাওয়া গেছে
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <Card
            key={product.id}
            className="hover:shadow-lg transition-shadow group overflow-hidden"
          >
            <div className="aspect-square overflow-hidden bg-muted relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 text-xs"
              >
                {Math.round(
                  ((parseInt(product.originalPrice.replace(/[^\d]/g, ""), 10) -
                    parseInt(product.price.replace(/[^\d]/g, ""), 10)) /
                    parseInt(product.originalPrice.replace(/[^\d]/g, ""), 10)) *
                    100,
                )}
                % ছাড়
              </Badge>
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold mb-2 line-clamp-2 text-sm text-foreground">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-primary">
                  {product.price}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-foreground">
                  {product.rating}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
              <Button className="w-full" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                কার্টে যোগ করুন
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            কোনো পণ্য পাওয়া যায়নি
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            ফিল্টার মুছুন
          </Button>
        </div>
      )}
    </div>
  );
}
