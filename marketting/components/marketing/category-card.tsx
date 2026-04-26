"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type Language = "bn" | "en";

interface CategoryCardProps {
  name: { bn: string; en: string };
  icon: string;
  slug: string;
  language: Language;
}

export function CategoryCard({
  name,
  icon,
  slug,
  language,
}: CategoryCardProps) {
  return (
    <Link href={`/products?category=${slug}`}>
      <div className="hover:-translate-y-2 hover:scale-105 transition-transform duration-300">
        <Card className="hover:shadow-xl transition-shadow cursor-pointer group border-2 border-transparent hover:border-primary/20">
          <CardContent className="p-3 text-center">
            <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-full overflow-hidden bg-muted ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
              <Image
                src={icon}
                alt={name[language]}
                width={56}
                height={56}
                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
              />
            </div>
            <p className="text-[10px] md:text-xs font-semibold">
              {name[language]}
            </p>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
