"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteToggleButton } from "@/components/storefront/favorite-toggle-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ImageCard,
  ImageCardContent,
  ImageCardDescription,
  ImageCardFooter,
  ImageCardHeader,
  ImageCardTitle,
} from "@/components/ui/image-card";

type Language = "bn" | "en";

interface ProductCardProps {
  id: string | number;
  href?: string;
  image: string;
  name: { bn: string; en: string };
  price: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  ctaLabel?: { bn: string; en: string };
  language: Language;
}

export function ProductCard({
  id,
  href,
  image,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  badgeVariant = "default",
  ctaLabel,
  language,
}: ProductCardProps) {
  const actionHref = href || `/products/${id}`;

  return (
    <ImageCard className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-40 md:h-48">
        <Image
          src={image}
          alt={name[language]}
          width={300}
          height={200}
          className="h-full w-full rounded-sm object-cover"
        />
        {badge ? (
          <Badge className="absolute top-2 right-2" variant={badgeVariant}>
            {badge}
          </Badge>
        ) : null}
        {typeof id === "string" ? (
          <FavoriteToggleButton
            productId={id}
            locale={language}
            className="absolute top-2 left-2 h-8 w-8 rounded-full bg-background/90 backdrop-blur"
          />
        ) : null}
      </div>
      <ImageCardHeader className="space-y-1 px-3 pt-0 pb-2">
        <ImageCardTitle className="line-clamp-2 text-sm">
          {name[language]}
        </ImageCardTitle>
        {typeof rating === "number" || typeof reviews === "number" ? (
          <ImageCardDescription className="flex items-center gap-1 text-xs">
            <span className="text-primary">★</span>
            {typeof rating === "number" ? <span>{rating}</span> : null}
            {typeof reviews === "number" ? (
              <span className="text-muted-foreground">({reviews})</span>
            ) : null}
          </ImageCardDescription>
        ) : null}
      </ImageCardHeader>
      <ImageCardContent className="px-3 pt-0 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-primary">{price}</span>
          {originalPrice ? (
            <span className="text-sm font-semibold text-muted-foreground line-through">
              {originalPrice}
            </span>
          ) : null}
        </div>
      </ImageCardContent>
      <ImageCardFooter className="px-3 pt-0 pb-2">
        <Link href={actionHref} className="w-full">
          <Button className="w-full" size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {ctaLabel
              ? ctaLabel[language]
              : language === "bn"
                ? "বিস্তারিত দেখুন"
                : "View details"}
          </Button>
        </Link>
      </ImageCardFooter>
    </ImageCard>
  );
}
