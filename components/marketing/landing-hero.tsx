"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Language = "bn" | "en";

export interface LandingHeroBanner {
  image: string;
  title: { bn: string; en: string };
  subtitle: { bn: string; en: string };
  href?: string;
  ctaLabel?: { bn: string; en: string };
  containerHeight?: string;
  imageFit?: string;
  imageScale?: string;
  showText?: boolean;
  textColor?: string;
}

const desktopHeroGridClasses: Record<string, string> = {
  balanced: "lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.85fr)]",
  "banner-heavy": "lg:grid-cols-[minmax(0,1.05fr)_minmax(19rem,1fr)]",
  "carousel-heavy": "lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.85fr)]",
};

function safeCssLength(value: string | undefined) {
  const next = value?.trim();

  if (!next || next.length > 48 || /[;{}]/.test(next)) {
    return undefined;
  }

  if (
    /^(\d+|\d*\.\d+)(px|rem|em|vh|vw|%)$/.test(next) ||
    /^clamp\([0-9a-zA-Z.,%+\-*/\s]+\)$/.test(next)
  ) {
    return next;
  }

  return undefined;
}

function safeCssColor(value: string | undefined) {
  const next = value?.trim();

  if (!next || next.length > 48 || /[;{}]/.test(next)) {
    return undefined;
  }

  if (
    /^#[0-9a-fA-F]{3,8}$/.test(next) ||
    /^(rgb|rgba|hsl|hsla)\([0-9a-zA-Z.,%+\-\s]+\)$/.test(next) ||
    /^var\(--[a-zA-Z0-9-_]+\)$/.test(next) ||
    /^[a-zA-Z]+$/.test(next)
  ) {
    return next;
  }

  return undefined;
}

function safeImageFit(value: string | undefined): CSSProperties["objectFit"] {
  const next = value?.trim();

  if (
    next === "cover" ||
    next === "contain" ||
    next === "fill" ||
    next === "none" ||
    next === "scale-down"
  ) {
    return next;
  }

  return "cover";
}

function safeImageScale(value: string | undefined) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  const clamped = Math.min(200, Math.max(50, parsed));

  return clamped === 100 ? undefined : `scale(${clamped / 100})`;
}

function getBannerStyles(banner: LandingHeroBanner) {
  const minHeight = safeCssLength(banner.containerHeight);
  const textColor = safeCssColor(banner.textColor);
  const imageTransform = safeImageScale(banner.imageScale);
  const containerStyle: CSSProperties | undefined = minHeight
    ? { minHeight }
    : undefined;
  const textStyle: CSSProperties | undefined = textColor
    ? { color: textColor }
    : undefined;
  const imageStyle: CSSProperties = {
    objectFit: safeImageFit(banner.imageFit),
    ...(imageTransform ? { transform: imageTransform } : {}),
  };

  return { containerStyle, imageStyle, textStyle };
}

function HeroBannerCard({
  banner,
  className = "",
  language,
  priority = false,
  sizes,
}: {
  banner: LandingHeroBanner;
  className?: string;
  language: Language;
  priority?: boolean;
  sizes: string;
}) {
  const showText = Boolean(banner.showText);
  const title = showText ? banner.title[language]?.trim() || "" : "";
  const subtitle = showText ? banner.subtitle[language]?.trim() || "" : "";
  const buttonLabel = showText ? banner.ctaLabel?.[language]?.trim() || "" : "";
  const href = showText ? banner.href?.trim() || "" : "";
  const hasText = Boolean(title || subtitle || buttonLabel);
  const styles = getBannerStyles(banner);

  return (
    <Card
      className={`gap-0 overflow-hidden rounded-md border-border/70 bg-card p-0 shadow-sm ${className}`}
    >
      <CardContent
        className="relative min-h-[15rem] p-0 sm:min-h-[17rem] md:min-h-[20rem]"
        style={styles.containerStyle}
      >
        <Image
          key={banner.image}
          src={banner.image}
          alt={title || "Roshal Organic banner"}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="rounded-sm object-cover"
          sizes={sizes}
          style={styles.imageStyle}
        />
        <div
          className="relative flex min-h-[15rem] max-w-full flex-col justify-center gap-4 p-5 text-foreground sm:min-h-[17rem] sm:p-6 md:max-w-2xl md:min-h-[20rem] md:gap-5 md:p-8"
          style={{
            ...styles.containerStyle,
            ...styles.textStyle,
          }}
        >
          {hasText ? (
            <div className="space-y-3">
              {title ? (
                <h1 className="text-2xl font-bold tracking-tight text-current sm:text-3xl md:text-5xl">
                  {title}
                </h1>
              ) : null}
              {subtitle ? (
                <p className="max-w-full text-sm leading-6 text-current opacity-80 sm:leading-7 md:text-lg">
                  {subtitle}
                </p>
              ) : null}
              {buttonLabel && href ? (
                <Button
                  asChild
                  size="lg"
                  className="w-fit max-w-full rounded-md px-6"
                >
                  <Link href={href}>{buttonLabel}</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function LandingHero({
  banners,
  desktopSplit = "carousel-heavy",
  language,
  sideBanner,
}: {
  banners: LandingHeroBanner[];
  desktopSplit?: string;
  language: Language;
  sideBanner?: LandingHeroBanner | null;
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
  const syncedSideBanner = sideBanner
    ? {
        ...sideBanner,
        containerHeight:
          currentBanner?.containerHeight || sideBanner.containerHeight,
        imageFit: sideBanner.imageFit || "cover",
      }
    : null;
  const gridClass =
    desktopHeroGridClasses[desktopSplit] ||
    desktopHeroGridClasses["carousel-heavy"];

  if (!currentBanner) {
    return null;
  }

  return (
    <section className="w-full overflow-x-clip bg-background pt-6 pb-3 md:pt-8 md:pb-4">
      <div className="container mx-auto space-y-4 px-4 sm:px-6 md:px-8">
        <div
          className={`grid grid-cols-1 items-start gap-4 ${syncedSideBanner ? gridClass : ""}`}
        >
          <div className="space-y-4">
            <HeroBannerCard
              banner={currentBanner}
              language={language}
              priority
              sizes={
                syncedSideBanner
                  ? "(max-width: 1024px) 100vw, 68vw"
                  : "(max-width: 1024px) 100vw, 92vw"
              }
            />

            {banners.length > 1 ? (
              <div className="flex items-center justify-center gap-2">
                {banners.map((banner, index) => (
                  <Button
                    key={`${banner.image}-${index}`}
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

          {syncedSideBanner ? (
            <div className="hidden min-w-0 lg:block">
              <HeroBannerCard
                banner={syncedSideBanner}
                language={language}
                sizes="28vw"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
