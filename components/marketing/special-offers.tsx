"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HomeSectionHeading } from "@/components/marketing/home-section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Language = "bn" | "en";

interface Deal {
  title: { bn: string; en: string };
  description: { bn: string; en: string };
  image: string;
  discount: string;
  href?: string;
  ctaLabel?: { bn: string; en: string };
}

interface SpecialOffersProps {
  deals: Deal[];
  language: Language;
  title?: { bn: string; en: string };
  description?: { bn: string; en: string };
}

export function SpecialOffers({
  deals,
  language,
  title,
  description,
}: SpecialOffersProps) {
  return (
    <section className="bg-background py-4 md:py-5">
      <div className="container mx-auto space-y-3.5 px-4 sm:px-6 md:px-8">
        <HomeSectionHeading
          title={
            title
              ? title[language]
              : language === "bn"
                ? "বিশেষ অফার"
                : "Special Offers"
          }
          description={description?.[language]}
        />

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {deals.slice(0, 2).map((deal) => (
            <Card
              key={`${deal.title.en}-${deal.image}`}
              className="min-w-0 overflow-hidden border-border/70 bg-card p-0 shadow-sm"
            >
              <CardContent className="grid min-w-0 gap-0 p-0 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <div className="relative aspect-[16/10] min-w-0 overflow-hidden border-b border-border/70 bg-muted/40 sm:aspect-[16/9] xl:h-full xl:min-h-[10rem] xl:border-r xl:border-b-0">
                  <Image
                    src={deal.image}
                    alt={deal.title[language]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-between gap-2 p-2.5 sm:gap-2.5 sm:p-3.5 md:p-4">
                  <div className="min-w-0 space-y-2 sm:space-y-2.5">
                    <div className="inline-flex max-w-full rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:px-2.5 sm:py-1 sm:text-xs">
                      {deal.discount}
                    </div>
                    <div className="min-w-0 space-y-1 sm:space-y-1.5">
                      <h3 className="line-clamp-2 break-words text-sm font-semibold leading-4 tracking-tight sm:text-lg sm:leading-6">
                        {deal.title[language]}
                      </h3>
                      <p className="line-clamp-1 break-words text-[11px] leading-4 text-muted-foreground sm:line-clamp-2 sm:text-sm sm:leading-5">
                        {deal.description[language]}
                      </p>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="h-7 w-full rounded-full px-3 text-[11px] sm:h-8 sm:w-fit sm:px-4 sm:text-xs"
                    size="sm"
                  >
                    <Link href={deal.href || "/products"}>
                      {deal.ctaLabel
                        ? deal.ctaLabel[language]
                        : language === "bn"
                          ? "অফারটি দেখুন"
                          : "View offer"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
