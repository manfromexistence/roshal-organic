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
  badge,
  badgeVariant = "default",
  ctaLabel,
  language,
}: ProductCardProps) {
  const actionHref = href || `/products/${id}`;

  return (
    <ImageCard className="overflow-hidden rounded-sm transition-shadow hover:shadow-lg">
      <div className="relative h-36 md:h-44">
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
      <ImageCardHeader className="space-y-0.5 px-2 pt-2 pb-1">
        <ImageCardTitle className="line-clamp-2 text-[13px] leading-[1.2]">
          {name[language]}
        </ImageCardTitle>
      </ImageCardHeader>
      <ImageCardContent className="px-2 pt-0 pb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-primary">{price}</span>
          {originalPrice ? (
            <span className="text-[11px] font-semibold text-muted-foreground line-through">
              {originalPrice}
            </span>
          ) : null}
        </div>
      </ImageCardContent>
      <ImageCardFooter className="px-2 pt-0 pb-2">
        <Link href={actionHref} className="w-full">
          <Button className="w-full h-8 px-2 text-xs" size="sm">
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            {ctaLabel
              ? ctaLabel[language]
              : language === "bn"
                ? "বিস্তারিত"
                : "Details"}
          </Button>
        </Link>
      </ImageCardFooter>
    </ImageCard>
  );
}
