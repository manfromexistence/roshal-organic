"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Language = "bn" | "en";

export interface LandingHeroBanner {
  image: string;
  title: { bn: string; en: string };
  subtitle: { bn: string; en: string };
  href?: string;
  ctaLabel?: { bn: string; en: string };
}

export function LandingHero({
  banners,
  language,
}: {
  banners: LandingHeroBanner[];
  language: Language;
}) {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) {
      return undefined;
    }

    const rotation = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 5000);

    return () => {
      window.clearInterval(rotation);
    };
  }, [banners.length]);

  const currentBanner = banners[activeBanner] || banners[0];
  const secondaryBanner =
    banners[(activeBanner + 1) % banners.length] || currentBanner;

  if (!currentBanner) {
    return null;
  }

  return (
    <section className="w-full overflow-x-clip bg-background pb-2 pt-22 lg:pt-32">
      <div className="container mx-auto space-y-5 px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.45fr_0.85fr]">
          <Card className="gap-0 overflow-hidden rounded-md border-border/70 bg-card p-0 shadow-sm">
            <CardContent className="relative min-h-[240px] p-0 sm:min-h-[12rem] md:min-h-[14rem]">
              <Image
                key={currentBanner.image}
                src={currentBanner.image}
                alt={currentBanner.title[language]}
                fill
                priority
                loading="eager"
                className="rounded-sm object-cover"
                sizes="(max-width: 1024px) 100vw, 68vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/60 to-transparent" />
              <div className="relative flex min-h-[8rem] max-w-full flex-col justify-center gap-4 p-5 sm:min-h-[16rem] sm:p-6 md:min-h-[20rem] md:max-w-xl md:gap-5 md:p-9">
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-5xl">
                    {currentBanner.title[language]}
                  </h1>
                  <p className="max-w-full text-sm leading-6 text-foreground/80 sm:leading-7 md:text-lg">
                    {currentBanner.subtitle[language]}
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-fit max-w-full rounded-md px-6"
                >
                  <Link href={currentBanner.href || "/products"}>
                    {currentBanner.ctaLabel
                      ? currentBanner.ctaLabel[language]
                      : language === "bn"
                        ? "এখনই কিনুন"
                        : "Shop now"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hidden gap-0 overflow-hidden rounded-md border-border/70 bg-card p-0 shadow-sm md:block">
            <CardContent className="relative min-h-[14rem] p-0 md:min-h-[14rem]">
              <Image
                src={secondaryBanner.image}
                alt={secondaryBanner.title[language]}
                fill
                className="rounded-sm object-cover"
                sizes="(max-width: 1024px) 100vw, 32vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/92 via-background/25 to-transparent" />
              <div className="relative flex min-h-[14rem] flex-col justify-end gap-3 p-5 md:min-h-[20rem] md:gap-4 md:p-8">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                    {secondaryBanner.title[language]}
                  </h2>
                  <p className="max-w-full text-sm leading-6 text-foreground/80 sm:leading-7">
                    {secondaryBanner.subtitle[language]}
                  </p>
                </div>
                <Button
                  asChild
                  variant="secondary"
                  className="w-fit rounded-md px-6"
                >
                  <Link href={secondaryBanner.href || "/products"}>
                    {secondaryBanner.ctaLabel
                      ? secondaryBanner.ctaLabel[language]
                      : language === "bn"
                        ? "বিস্তারিত দেখুন"
                        : "Explore"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {banners.length > 1 ? (
          <div className="flex items-center justify-center gap-2">
            {banners.map((banner, index) => (
              <Button
                key={banner.image}
                type="button"
                aria-label={`Go to banner ${index + 1}`}
                onClick={() => setActiveBanner(index)}
                variant="ghost"
                size="icon"
                className={`h-2.5 min-h-0 rounded-full p-0 transition-all ${
                  index === activeBanner
                    ? "w-10 bg-primary"
                    : "w-2.5 bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
