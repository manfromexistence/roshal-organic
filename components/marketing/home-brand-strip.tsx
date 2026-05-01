"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface BrandItem {
  key: string;
  name: string;
  image: string;
  href: string;
}

export function HomeBrandStrip({ brands }: { brands: BrandItem[] }) {
  return (
    <Carousel
      opts={{ align: "start", dragFree: true, loop: brands.length > 4 }}
      className="max-w-full overflow-x-clip"
    >
      <CarouselContent className="-ml-3 md:-ml-4">
        {brands.map((brand) => (
          <CarouselItem
            key={brand.key}
            className="basis-[30%] pl-3 min-[420px]:basis-[30%] sm:basis-1/4 md:pl-6 lg:basis-1/8"
          >
            <Link href={brand.href} className="block h-full">
              <Card className="py-2 h-full rounded-md border-border/70 bg-card shadow-sm hover:bg-accent/60">
                <CardContent className="flex h-16 items-center justify-center p-2 sm:h-20 sm:p-3">
                  <div className="relative flex h-10 w-auto items-center justify-center rounded-md bg-muted/40 sm:h-12">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      width={180}
                      height={60}
                      className="h-full w-auto object-cover rounded-md"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
