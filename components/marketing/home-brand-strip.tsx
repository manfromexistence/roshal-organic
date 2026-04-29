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
      className="max-w-full overflow-x-clip px-4 sm:px-10 md:px-14"
    >
      <CarouselContent className="-ml-3 md:-ml-4">
        {brands.map((brand) => (
          <CarouselItem
            key={brand.key}
            className="basis-[88%] pl-3 min-[420px]:basis-[72%] sm:basis-1/2 md:pl-4 lg:basis-1/4"
          >
            <Link href={brand.href} className="block h-full">
              <Card className="h-full border-border/70 bg-card shadow-sm hover:bg-accent">
                <CardContent className="flex h-24 items-center justify-center p-4 sm:h-28 sm:p-6">
                  <div className="relative flex h-12 w-auto items-center justify-center rounded-lg bg-muted/40 sm:h-14">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      width={220}
                      height={72}
                      className="h-full w-auto object-cover"
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
