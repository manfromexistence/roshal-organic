"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { DealCard } from "./deal-card";

type Language = "bn" | "en";

interface Deal {
  title: { bn: string; en: string };
  description: { bn: string; en: string };
  image: string;
  discount: string;
}

interface SpecialOffersProps {
  deals: Deal[];
  language: Language;
}

export function SpecialOffers({ deals, language }: SpecialOffersProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {language === "bn" ? "বিশেষ ডিল" : "Special Deals"}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {deals.map((deal, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <DealCard
                title={deal.title}
                description={deal.description}
                image={deal.image}
                discount={deal.discount}
                language={language}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
