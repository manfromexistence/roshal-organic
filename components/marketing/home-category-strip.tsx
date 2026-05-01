"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Language = "bn" | "en";

interface HomeCategory {
  key: string;
  name: { bn: string; en: string };
  image: string;
  href: string;
}

export function HomeCategoryStrip({
  categories,
  language,
}: {
  categories: HomeCategory[];
  language: Language;
}) {
  return (
    <Carousel
      opts={{
        align: "start",
        dragFree: true,
      }}
      className="max-w-full overflow-x-clip px-2 sm:px-6 md:px-10"
    >
      <CarouselContent className="-ml-2 md:-ml-3">
        {categories.map((category) => (
          <CarouselItem
            key={category.key}
            className="basis-[30%] pl-2 min-[420px]:basis-[30%] sm:basis-1/4 md:basis-1/5 md:pl-3 lg:basis-[14.285%] xl:basis-[12.5%]"
          >
            <Link href={category.href} className="block h-full">
              <Card className="!py-2 h-full rounded-md border-border/70 bg-card shadow-sm transition-transform duration-200 hover:bg-accent/60">
                <CardContent className="flex flex-col items-center justify-center gap-1.5 p-2 text-center">
                  <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-md bg-muted/60 sm:size-12">
                    <Image
                      src={category.image}
                      alt={category.name[language]}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <p className="line-clamp-2 text-[10px] font-medium leading-3 text-foreground sm:text-xs">
                    {category.name[language]}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 hidden border-border/70 bg-background shadow-sm sm:inline-flex sm:left-4 md:left-6" />
      <CarouselNext className="right-0 hidden border-border/70 bg-background shadow-sm sm:inline-flex sm:right-4 md:right-6" />
    </Carousel>
  );
}
