"use client";

import {
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/data/products";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");

  const product = products.find((p) => p.id === Number(params.id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => router.push("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", product.id, quantity);
    // TODO: Implement cart functionality
  };

  const handleBuyNow = () => {
    console.log("Buy now:", product.id, quantity);
    // TODO: Redirect to checkout
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Button
          variant="link"
          className="p-0 h-auto text-sm"
          onClick={() => router.push("/")}
        >
          Home
        </Button>
        <span>/</span>
        <Button
          variant="link"
          className="p-0 h-auto text-sm"
          onClick={() => router.push("/products")}
        >
          Products
        </Button>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        {/* Product Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              />
            </CardContent>
          </Card>
          {product.badge && (
            <Badge
              variant={product.badge === "sale" ? "destructive" : "default"}
              className="w-fit"
            >
              {product.badge === "new" && "New"}
              {product.badge === "bestseller" && "Bestseller"}
              {product.badge === "sale" && "Sale"}
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.nameEn && (
              <p className="text-muted-foreground text-lg">{product.nameEn}</p>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= (product.rating ?? 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              {product.reviews && (
                <span className="text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              )}
            </div>
          )}

          <Separator />

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
            {product.badge === "sale" && product.originalPrice && (
              <Badge variant="destructive">
                Save{" "}
                {Math.round(
                  ((parseFloat(product.originalPrice.replace(/[৳]/g, "")) -
                    parseFloat(product.price.replace(/[৳]/g, ""))) /
                    parseFloat(product.originalPrice.replace(/[৳]/g, ""))) *
                    100,
                )}
                %
              </Badge>
            )}
          </div>

          {/* Stock Status */}
          {product.stock && (
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  product.stock === "in-stock"
                    ? "bg-green-500"
                    : product.stock === "low-stock"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <span className="font-medium">
                {product.stock === "in-stock" && "In Stock"}
                {product.stock === "low-stock" && "Low Stock - Order Soon"}
                {product.stock === "out-of-stock" && "Out of Stock"}
              </span>
            </div>
          )}

          <Separator />

          {/* Quantity Selector */}
          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === "out-of-stock"}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={product.stock === "out-of-stock"}
            >
              Buy Now
            </Button>
          </div>

          {/* Wishlist & Share */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Delivery Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Free Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    On orders over ৳500 within Dhaka
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Quality Assured</p>
                  <p className="text-sm text-muted-foreground">
                    100% authentic products guaranteed
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Easy Returns</p>
                  <p className="text-sm text-muted-foreground">
                    7-day return policy for defective items
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-8 md:mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description" className="text-xs md:text-sm">
            Description
          </TabsTrigger>
          <TabsTrigger value="features" className="text-xs md:text-sm">
            Features
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs md:text-sm">
            Reviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">{product.description}</p>
              {product.descriptionEn && (
                <p className="text-muted-foreground mt-4">
                  {product.descriptionEn}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="features" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {product.reviews ? (
                <div>
                  <p className="font-semibold mb-4">Customer Reviews</p>
                  <p className="text-muted-foreground">
                    {product.reviews} reviews with an average rating of{" "}
                    {product.rating} stars
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products
            .filter(
              (p) => p.category === product.category && p.id !== product.id,
            )
            .slice(0, 4)
            .map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/products/${relatedProduct.id}`)}
              >
                <CardContent className="p-3 md:p-4">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-32 md:h-40 object-cover rounded-lg mb-2 md:mb-3"
                  />
                  <h3 className="font-semibold text-xs md:text-sm mb-1 md:mb-2 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="font-bold text-primary text-sm md:text-base">
                    {relatedProduct.price}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
