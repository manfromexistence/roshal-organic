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
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto space-y-8 px-4 sm:px-6 md:px-8">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {deals.slice(0, 2).map((deal) => (
            <Card
              key={`${deal.title.en}-${deal.image}`}
              className="overflow-hidden border-border/70 bg-card shadow-sm"
            >
              <CardContent className="grid gap-0 p-0 md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-72 bg-muted/40">
                  <Image
                    src={deal.image}
                    alt={deal.title[language]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-between gap-6 p-6">
                  <div className="space-y-4">
                    <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {deal.discount}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {deal.title[language]}
                      </h3>
                      <p className="text-sm leading-7 text-muted-foreground md:text-base">
                        {deal.description[language]}
                      </p>
                    </div>
                  </div>

                  <Button asChild className="w-fit rounded-full px-6">
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
