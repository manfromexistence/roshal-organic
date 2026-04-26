"use client";

import Image from "next/image";
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
  language: Language;
}

export function DealCard({
  title,
  description,
  image,
  discount,
  language,
}: DealCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow pb-8">
      <div className="relative h-48 md:h-64">
        <Image
          src={image}
          alt={title[language]}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
        <Badge
          className="absolute top-4 right-4 text-base px-3 py-1"
          variant="destructive"
        >
          {discount}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{title[language]}</CardTitle>
        <CardDescription className="text-base">
          {description[language]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" size="lg">
          {language === "bn" ? "অফারটি দেখুন" : "View Offer"}
        </Button>
      </CardContent>
    </Card>
  );
}
