import { Eye, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product, ViewMode } from "@/types/product";

interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
  onAddToCart?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
}

export function ProductCard({
  product,
  viewMode,
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  const isGrid = viewMode === "grid";

  const getBadgeColor = (badge: Product["badge"]) => {
    switch (badge) {
      case "new":
        return "bg-green-500 hover:bg-green-600";
      case "bestseller":
        return "bg-amber-500 hover:bg-amber-600";
      case "sale":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "";
    }
  };

  const getStockColor = (stock: Product["stock"]) => {
    switch (stock) {
      case "in-stock":
        return "text-green-600";
      case "low-stock":
        return "text-amber-600";
      case "out-of-stock":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getStockText = (stock: Product["stock"]) => {
    switch (stock) {
      case "in-stock":
        return "In Stock";
      case "low-stock":
        return "Only a few left";
      case "out-of-stock":
        return "Out of Stock";
      default:
        return "";
    }
  };

  return (
    <Card
      className={`group overflow-hidden transition-all hover:shadow-lg ${
        isGrid ? "flex flex-col" : "flex flex-col md:flex-row"
      }`}
    >
      {/* Product Image */}
      <div
        className={`relative overflow-hidden bg-muted ${
          isGrid ? "aspect-square" : "aspect-square md:w-48 md:aspect-auto"
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <Badge
            className={`absolute top-2 left-2 ${getBadgeColor(product.badge)}`}
          >
            {product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
          </Badge>
        )}

        {/* Quick View Button (Desktop) */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onQuickView && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onQuickView(product.id)}
              className="bg-white hover:bg-white/90"
            >
              <Eye className="h-4 w-4 mr-1" />
              Quick View
            </Button>
          )}
        </div>
      </div>

      {/* Product Content */}
      <CardContent className={`flex-1 p-4 ${isGrid ? "flex flex-col" : ""}`}>
        <div className={`${isGrid ? "flex-1" : "flex-1 md:ml-4"}`}>
          {/* Category */}
          <p className="text-xs text-muted-foreground mb-1">
            {product.category}
          </p>

          {/* Product Name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= (product.rating ?? 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              {product.reviews && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviews.toLocaleString()})
                </span>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Stock Status */}
          {product.stock && (
            <p
              className={`text-xs font-medium mb-3 ${getStockColor(product.stock)}`}
            >
              {getStockText(product.stock)}
            </p>
          )}

          {/* Features (Grid View Only) */}
          {isGrid && product.features.length > 0 && (
            <ul className="space-y-1 mb-3">
              {product.features.slice(0, 2).map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span className="text-primary">✓</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price and Actions */}
        <div
          className={`${isGrid ? "mt-auto pt-3" : "mt-3 md:mt-0 md:ml-4 md:pt-0"}`}
        >
          {/* Price */}
          <div className="mb-3">
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                {product.originalPrice}
              </span>
            )}
            <span className="text-xl font-bold">{product.price}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onAddToCart && (
              <Button
                className="flex-1"
                onClick={() => onAddToCart(product.id)}
                disabled={product.stock === "out-of-stock"}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
            {!isGrid && onQuickView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuickView(product.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
