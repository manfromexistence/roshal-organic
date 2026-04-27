"use client";

import { Sparkles } from "lucide-react";
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

  return (
    <section className="relative isolate overflow-hidden min-h-[46vh] lg:min-h-[52vh]">
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

      <div className="relative flex min-h-[46vh] items-end md:min-h-[52vh]">
        <div className="container mx-auto px-4 pb-14 pt-24 md:pb-14 md:pt-28">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
              {currentBanner.title[language]}
            </h1>
            <p className="mb-6 max-w-2xl text-base text-white/90 md:text-xl">
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
          {/* Hero previous/next controls are intentionally hidden for now. */}

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
