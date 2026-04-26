"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type Language = "bn" | "en";

interface CategoryCardProps {
  name: { bn: string; en: string };
  icon: string;
  slug: string;
  href?: string;
  language: Language;
}

export function CategoryCard({
  name,
  icon,
  slug,
  href,
  language,
}: CategoryCardProps) {
  return (
    <Link href={href || `/products?category=${slug}`}>
      <div className="transition-transform duration-300 hover:-translate-y-2 hover:scale-105">
        <Card className="group cursor-pointer border-2 border-transparent transition-shadow hover:border-primary/20 hover:shadow-xl">
          <CardContent className="p-3 text-center">
            <div className="mx-auto mb-2 h-12 w-12 overflow-hidden rounded-full bg-muted ring-2 ring-primary/10 transition-all group-hover:ring-primary/30 md:h-14 md:w-14">
              <Image
                src={icon}
                alt={name[language]}
                width={56}
                height={56}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-125"
              />
            </div>
            <p className="text-[10px] font-semibold md:text-xs">
              {name[language]}
            </p>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
