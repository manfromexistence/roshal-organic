"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Language = "bn" | "en";

interface ProductCardProps {
  id: string | number;
  image: string;
  name: { bn: string; en: string };
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  language: Language;
}

export function ProductCard({
  id,
  image,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  badgeVariant = "default",
  language,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 md:h-48">
        <Image
          src={image}
          alt={name[language]}
          width={300}
          height={200}
          className="w-full h-full object-cover"
        />
        {badge && (
          <Badge className="absolute top-2 right-2" variant={badgeVariant}>
            {badge}
          </Badge>
        )}
      </div>
      <CardHeader className="p-3">
        <CardTitle className="text-sm line-clamp-2">{name[language]}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <span className="text-yellow-500">★</span>
          <span>{rating}</span>
          <span className="text-muted-foreground">({reviews})</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-primary">{price}</span>
          <span className="text-lg font-semibold text-muted-foreground line-through">
            {originalPrice}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Link href={`/products/${id}`} className="w-full">
          <Button className="w-full" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {language === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
