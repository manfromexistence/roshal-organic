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
    <section className="bg-background py-4 md:py-6">
      <div className="container mx-auto space-y-4 px-4 sm:px-6 md:space-y-5 md:px-8">
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

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-4">
          {deals.slice(0, 2).map((deal) => (
            <Card
              key={`${deal.title.en}-${deal.image}`}
              className="min-w-0 overflow-hidden border-border/70 bg-card p-0 shadow-sm"
            >
              <CardContent className="grid min-w-0 gap-0 p-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <div className="relative aspect-[16/10] min-w-0 overflow-hidden border-b border-border/70 bg-muted/40 lg:h-full lg:min-h-[13rem] lg:border-r lg:border-b-0">
                  <Image
                    src={deal.image}
                    alt={deal.title[language]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0 space-y-3">
                    <div className="inline-flex max-w-full rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {deal.discount}
                    </div>
                    <div className="min-w-0 space-y-2">
                      <h3 className="break-words text-lg font-semibold leading-6 tracking-tight sm:text-xl">
                        {deal.title[language]}
                      </h3>
                      <p className="break-words text-sm leading-6 text-muted-foreground">
                        {deal.description[language]}
                      </p>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full rounded-full px-5 sm:w-fit"
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
