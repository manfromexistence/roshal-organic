"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/data/products";

export default function WatchlistPage() {
  const watchlistItems = products.slice(0, 5); // Mock data - in real app, fetch from user's watchlist

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              My Watchlist
            </h1>
            <p className="text-muted-foreground">
              {watchlistItems.length} items saved
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>

        {watchlistItems.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">
                Your watchlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Save items you love to view them later
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistItems.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.badge && (
                    <Badge
                      variant={
                        product.badge === "sale" ? "destructive" : "default"
                      }
                      className="absolute top-2 right-2"
                    >
                      {product.badge === "new" && "New"}
                      {product.badge === "bestseller" && "Bestseller"}
                      {product.badge === "sale" && "Sale"}
                    </Badge>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 left-2 bg-white/90 hover:bg-white"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.nameEn && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {product.nameEn}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-primary">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.stock && (
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          product.stock === "in-stock"
                            ? "bg-green-500"
                            : product.stock === "low-stock"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {product.stock === "in-stock" && "In Stock"}
                        {product.stock === "low-stock" && "Low Stock"}
                        {product.stock === "out-of-stock" && "Out of Stock"}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Button className="flex-1" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
