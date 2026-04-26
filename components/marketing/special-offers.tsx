"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { DealCard } from "./deal-card";

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
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            {title
              ? title[language]
              : language === "bn"
                ? "বিশেষ ডিল"
                : "Special Deals"}
          </h2>
          {description ? (
            <p className="-mt-8 mb-12 text-center text-base text-muted-foreground">
              {description[language]}
            </p>
          ) : null}
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {deals.map((deal, index) => (
            <ScrollReveal
              key={`${deal.title.en}-${index}`}
              delay={index * 0.15}
            >
              <DealCard
                title={deal.title}
                description={deal.description}
                image={deal.image}
                discount={deal.discount}
                href={deal.href}
                ctaLabel={deal.ctaLabel}
                language={language}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
