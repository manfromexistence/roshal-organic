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
  textColor?: string;
}

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
  const secondaryBanner = banners[1] || null;
  const hasSecondaryBanner = Boolean(secondaryBanner);
  const currentTitle = currentBanner?.title[language]?.trim() || "";
  const currentSubtitle = currentBanner?.subtitle[language]?.trim() || "";
  const currentHasText = Boolean(currentTitle || currentSubtitle);
  const secondaryTitle = secondaryBanner?.title[language]?.trim() || "";
  const secondarySubtitle = secondaryBanner?.subtitle[language]?.trim() || "";
  const secondaryButtonLabel =
    secondaryBanner?.ctaLabel?.[language]?.trim() || "";
  const secondaryHref = secondaryBanner?.href?.trim() || "";
  const secondaryHasText = Boolean(
    secondaryTitle || secondarySubtitle || secondaryButtonLabel,
  );
  const currentStyles = getBannerStyles(currentBanner);
  const secondaryStyles = secondaryBanner
    ? getBannerStyles(secondaryBanner)
    : null;

  if (!currentBanner) {
    return null;
  }

  return (
    <section className="w-full overflow-x-clip bg-background pb-2 pt-32">
      <div className="container mx-auto space-y-5 px-4 sm:px-6 md:px-8">
        <div
          className={`grid grid-cols-1 gap-5 ${
            hasSecondaryBanner ? "md:grid-cols-[1.45fr_0.85fr]" : ""
          }`}
        >
          <Card className="gap-0 overflow-hidden rounded-md border-border/70 bg-card p-0 shadow-sm">
            <CardContent
              className="relative min-h-[16rem] p-0 sm:min-h-[18rem] md:min-h-[18rem]"
              style={currentStyles.containerStyle}
            >
              <Image
                key={currentBanner.image}
                src={currentBanner.image}
                alt={currentTitle || "Roshal Organic banner"}
                fill
                priority
                loading="eager"
                className="rounded-sm object-cover"
                sizes="(max-width: 1024px) 100vw, 68vw"
                style={currentStyles.imageStyle}
              />
              <div
                className="relative flex min-h-[16rem] max-w-full flex-col justify-center gap-4 p-5 text-foreground sm:min-h-[18rem] sm:p-6 md:max-w-xl md:min-h-[18rem] md:gap-5 md:p-8"
                style={{
                  ...currentStyles.containerStyle,
                  ...currentStyles.textStyle,
                }}
              >
                {currentHasText ? (
                  <div className="space-y-3">
                    {currentTitle ? (
                      <h1 className="text-2xl font-bold tracking-tight text-current sm:text-3xl md:text-5xl">
                        {currentTitle}
                      </h1>
                    ) : null}
                    {currentSubtitle ? (
                      <p className="max-w-full text-sm leading-6 text-current opacity-80 sm:leading-7 md:text-lg">
                        {currentSubtitle}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {/* <Button
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
                </Button> */}
              </div>
            </CardContent>
          </Card>

          {secondaryBanner ? (
            <Card className="hidden gap-0 overflow-hidden rounded-md border-border/70 bg-card p-0 shadow-sm md:block">
              <CardContent
                className="relative min-h-[18rem] p-0"
                style={secondaryStyles?.containerStyle}
              >
                <Image
                  src={secondaryBanner.image}
                  alt={secondaryTitle || "Roshal Organic banner"}
                  fill
                  className="rounded-sm object-cover"
                  sizes="(max-width: 1024px) 100vw, 32vw"
                  style={secondaryStyles?.imageStyle}
                />
                <div
                  className="relative flex min-h-[18rem] flex-col justify-end gap-3 p-5 text-foreground md:gap-4 md:p-7"
                  style={{
                    ...secondaryStyles?.containerStyle,
                    ...secondaryStyles?.textStyle,
                  }}
                >
                  {secondaryHasText ? (
                    <>
                      <div className="space-y-2">
                        {secondaryTitle ? (
                          <h2 className="text-xl font-semibold tracking-tight text-current sm:text-2xl md:text-3xl">
                            {secondaryTitle}
                          </h2>
                        ) : null}
                        {secondarySubtitle ? (
                          <p className="max-w-full text-sm leading-6 text-current opacity-80 sm:leading-7">
                            {secondarySubtitle}
                          </p>
                        ) : null}
                      </div>
                      {secondaryButtonLabel && secondaryHref ? (
                        <Button
                          asChild
                          variant="secondary"
                          className="w-fit rounded-md px-6"
                        >
                          <Link href={secondaryHref}>
                            {secondaryButtonLabel}
                          </Link>
                        </Button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

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
    </section>
  );
}
