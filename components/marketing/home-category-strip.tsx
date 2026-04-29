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
      className="max-w-full overflow-x-clip px-4 sm:px-10 md:px-14"
    >
      <CarouselContent className="-ml-3 md:-ml-4">
        {categories.map((category) => (
          <CarouselItem
            key={category.key}
            className="basis-[78%] pl-3 min-[420px]:basis-[56%] sm:basis-1/3 md:pl-4 lg:basis-1/6"
          >
            <Link href={category.href} className="block h-full">
              <Card className="h-full border-border/70 bg-card shadow-sm transition-transform duration-200 hover:bg-accent">
                <CardContent className="flex flex-col items-center gap-4 text-center">
                  <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-2xl">
                    <Image
                      src={category.image}
                      alt={category.name[language]}
                      fill
                      className="object-contain"
                      sizes="96px"
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground">
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
