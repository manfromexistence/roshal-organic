"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Language = "bn" | "en";

interface DealCardProps {
  title: { bn: string; en: string };
  description: { bn: string; en: string };
  image: string;
  discount: string;
  href?: string;
  ctaLabel?: { bn: string; en: string };
  language: Language;
}

export function DealCard({
  title,
  description,
  image,
  discount,
  href,
  ctaLabel,
  language,
}: DealCardProps) {
  return (
    <Card className="overflow-hidden pb-4 transition-shadow hover:shadow-lg">
      <div className="relative h-48 md:h-64">
        <Image
          src={image}
          alt={title[language]}
          width={400}
          height={300}
          className="h-full w-full object-cover"
        />
        <Badge
          className="absolute top-4 right-4 px-3 py-1 text-base"
          variant="destructive"
        >
          {discount}
        </Badge>
      </div>
      <CardHeader className="px-4 pt-3 pb-2">
        <CardTitle className="text-xl md:text-2xl">{title[language]}</CardTitle>
        <CardDescription className="text-base">
          {description[language]}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-4">
        <Button asChild className="w-full" size="lg">
          <Link href={href || "/products"}>
            {ctaLabel
              ? ctaLabel[language]
              : language === "bn"
                ? "অফারটি দেখুন"
                : "View Offer"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
