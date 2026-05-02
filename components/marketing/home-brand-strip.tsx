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
      <CarouselContent className="-ml-2 md:-ml-3">
        {brands.map((brand) => (
          <CarouselItem
            key={brand.key}
            className="basis-[28%] pl-2 min-[420px]:basis-[22%] sm:basis-[16%] md:basis-[13%] md:pl-3 lg:basis-[10%]"
          >
            <Link href={brand.href} className="block h-full">
              <Card className="h-full overflow-hidden rounded-md border-border/70 bg-card p-0 shadow-sm hover:bg-accent/60">
                <CardContent className="h-14 p-0 sm:h-16">
                  <div className="relative h-full w-full overflow-hidden rounded-md bg-muted/40">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 38vw, (max-width: 1024px) 16vw, 12vw"
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
