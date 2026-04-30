"use client";

import { Quote } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type Language = "bn" | "en";

interface TestimonialItem {
  key: string;
  quote: { bn: string; en: string };
  name: string;
  role: { bn: string; en: string };
  image?: string;
}

export function HomeTestimonialCarousel({
  language,
  testimonials,
}: {
  language: Language;
  testimonials: TestimonialItem[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateSelectedIndex = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    updateSelectedIndex();
    api.on("select", updateSelectedIndex);
    api.on("reInit", updateSelectedIndex);

    return () => {
      api.off("select", updateSelectedIndex);
    };
  }, [api]);

  useEffect(() => {
    if (!api || testimonials.length <= 1) {
      return;
    }

    const rotation = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
        return;
      }

      api.scrollTo(0);
    }, 5000);

    return () => {
      window.clearInterval(rotation);
    };
  }, [api, testimonials.length]);

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="w-full max-w-full overflow-x-clip"
      setApi={setApi}
    >
      <CarouselContent className="-ml-4 md:-ml-6">
        {testimonials.map((testimonial) => (
          <CarouselItem
            key={testimonial.key}
            className="basis-[88%] pl-4 md:basis-1/2 md:pl-6 lg:basis-1/3"
          >
            <Card className="h-full rounded-md border-border/70 bg-card shadow-sm hover:bg-accent/60">
              <CardContent className="flex h-full flex-col justify-between gap-3.5 p-4 md:gap-4 md:p-[1.125rem]">
                <div className="space-y-3">
                  <div className="inline-flex rounded-sm bg-primary/10 p-1.5 text-primary">
                    <Quote className="size-3.5" />
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {testimonial.quote[language]}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative size-9 overflow-hidden rounded-full">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    ) : (
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {testimonial.name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role[language]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      {testimonials.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <Button
              key={testimonial.key}
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 min-h-0 rounded-full p-0 transition-all ${
                index === activeIndex
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </Carousel>
  );
}
