"use client";

import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

  if (!currentBanner) {
    return null;
  }

  const showPreviousBanner = () => {
    setActiveBanner((current) =>
      current === 0 ? banners.length - 1 : current - 1,
    );
  };

  const showNextBanner = () => {
    setActiveBanner((current) => (current + 1) % banners.length);
  };

  return (
    <section className="relative isolate overflow-hidden lg:min-h-[calc(100vh-80px)] min-h-[calc(100vh-120px)]">
      <Image
        key={currentBanner.image}
        src={currentBanner.image}
        alt={currentBanner.title[language]}
        fill
        priority
        loading="eager"
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

      <div className="relative flex min-h-[78vh] items-end md:min-h-[calc(100vh-100px)]">
        <div className="container mx-auto px-4 pb-24 pt-28 md:pb-20 md:pt-36">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-3xl font-bold text-white md:text-6xl">
              {currentBanner.title[language]}
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-white/90 md:text-2xl">
              {currentBanner.subtitle[language]}
            </p>
            <Link href={currentBanner.href || "/products"}>
              <Button
                size="lg"
                variant="secondary"
                className="text-base shadow-2xl transition-transform hover:scale-105 md:text-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {currentBanner.ctaLabel
                  ? currentBanner.ctaLabel[language]
                  : language === "bn"
                    ? "এখনই কিনুন"
                    : "Shop Now"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {banners.length > 1 ? (
        <>
          <div className="absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-between px-4 md:flex">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-12 rounded-full border-primary/20 bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90"
              onClick={showPreviousBanner}
            >
              <ArrowLeft className="size-5" />
              <span className="sr-only">Previous banner</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-12 rounded-full border-primary/20 bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90"
              onClick={showNextBanner}
            >
              <ArrowRight className="size-5" />
              <span className="sr-only">Next banner</span>
            </Button>
          </div>

          <div className="absolute inset-x-0 bottom-8 z-10">
            <div className="container mx-auto flex items-center justify-center gap-2 px-4 md:justify-end">
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
                      : "w-2.5 bg-white/55 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
