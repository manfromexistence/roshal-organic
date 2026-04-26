export interface Product {
  id: number;
  name: string;
  nameEn?: string;
  image: string;
  description: string;
  descriptionEn?: string;
  price: string;
  priceNumeric?: number;
  category: string;
  rating?: number;
  reviews?: number;
  badge?: "new" | "bestseller" | "sale" | null;
  originalPrice?: string;
  stock?: "in-stock" | "low-stock" | "out-of-stock";
  features: string[];
}

export interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  ratings: number[];
  searchQuery: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export type ViewMode = "grid" | "list";
