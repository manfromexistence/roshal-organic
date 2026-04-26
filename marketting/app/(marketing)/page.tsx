"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryCard } from "@/components/marketing/category-card";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { FreshVegetables } from "@/components/marketing/fresh-vegetables";
import { NewArrivals } from "@/components/marketing/new-arrivals";
import { OrganicProducts } from "@/components/marketing/organic-products";
import { SeasonalProducts } from "@/components/marketing/seasonal-products";
import { SpecialOffers } from "@/components/marketing/special-offers";
import { TopSellers } from "@/components/marketing/top-sellers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type Language = "bn" | "en";

const categories = [
  {
    name: { bn: "তেল ও ঘি", en: "Oil & Ghee" },
    icon: "/ghee.jpg",
    slug: "oil-ghee",
  },
  {
    name: { bn: "অর্গানিক", en: "Organic" },
    icon: "/honey.jpg",
    slug: "organic",
  },
  { name: { bn: "মধু", en: "Honey" }, icon: "/honey.jpg", slug: "honey" },
  { name: { bn: "খেজুর", en: "Dates" }, icon: "/dates.jpg", slug: "dates" },
  { name: { bn: "মশলা", en: "Spices" }, icon: "/spices.jpg", slug: "spices" },
  {
    name: { bn: "বাদাম ও বীজ", en: "Nuts & Seeds" },
    icon: "/nuts.jpg",
    slug: "nuts-seeds",
  },
  {
    name: { bn: "পানীয়", en: "Beverage" },
    icon: "/beverage.jpg",
    slug: "beverage",
  },
  { name: { bn: "চাল", en: "Rice" }, icon: "/rice.jpg", slug: "rice" },
];

const topProducts = [
  {
    id: 1,
    name: { bn: "খাঁটি মধু", en: "Pure Honey" },
    image: "/honey-2.jpg",
    price: "৳৪৫০",
    originalPrice: "৳৫৫০",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: { bn: "মৌসুমী আম", en: "Seasonal Mango" },
    image: "/mango-2.jpg",
    price: "৳৩০০",
    originalPrice: "৳৩৫০",
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 3,
    name: { bn: "ফ্রেশ দই", en: "Fresh Yogurt" },
    image: "/yogurt-2.jpg",
    price: "৳১২০",
    originalPrice: "৳১৫০",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: { bn: "অর্গানিক ঘি", en: "Organic Ghee" },
    image: "/ghee-2.jpg",
    price: "৳৮০০",
    originalPrice: "৳৯৫০",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 5,
    name: { bn: "প্রিমিয়াম খেজুর", en: "Premium Dates" },
    image: "/dates-2.jpg",
    price: "৳৪৫০",
    originalPrice: "৳৫৫০",
    rating: 4.8,
    reviews: 178,
  },
  {
    id: 6,
    name: { bn: "মশলা সমূহ", en: "Spices Collection" },
    image: "/spices-2.jpg",
    price: "৳২৫০",
    originalPrice: "৳৩০০",
    rating: 4.6,
    reviews: 92,
  },
  {
    id: 7,
    name: { bn: "তেল", en: "Cooking Oil" },
    image: "/oil-2.jpg",
    price: "৳২৮০",
    originalPrice: "৳৩২০",
    rating: 4.5,
    reviews: 67,
  },
  {
    id: 8,
    name: { bn: "বাদাম", en: "Mixed Nuts" },
    image: "/nuts.jpg",
    price: "৳৩৫০",
    originalPrice: "৳৪০০",
    rating: 4.7,
    reviews: 145,
  },
];

const banners = [
  {
    title: { bn: "তাজা সবজির সমাহার", en: "Fresh Vegetable Collection" },
    subtitle: {
      bn: "সরাসরি কৃষকদের কাছ থেকে সংগ্রহ",
      en: "Directly from Local Farmers",
    },
    image: "/vegetables/vegetable-1.jpg",
  },
  {
    title: { bn: "অর্গানিক সবজি", en: "Organic Vegetables" },
    subtitle: { bn: "১০০% প্রাকৃতিক ও স্বাস্থ্যকর", en: "100% Natural & Healthy" },
    image: "/vegetables/vegetable-2.jpg",
  },
  {
    title: { bn: "মৌসুমি সবজি", en: "Seasonal Vegetables" },
    subtitle: { bn: "বর্তমান মৌসুমের সেরা সবজি", en: "Best of Current Season" },
    image: "/vegetables/vegetable-3.jpg",
  },
  {
    title: { bn: "তাজা সবজি", en: "Fresh Vegetables" },
    subtitle: { bn: "প্রতিদিন নতুন সবজি", en: "Fresh Vegetables Daily" },
    image: "/vegetables/vegetable-4.jpg",
  },
  {
    title: { bn: "মানসম্মত সবজি", en: "Quality Vegetables" },
    subtitle: { bn: "সেরা মানের নিশ্চিত", en: "Best Quality Assured" },
    image: "/vegetables/vegetable-5.jpg",
  },
  {
    title: { bn: "সবুজ সবজি", en: "Green Vegetables" },
    subtitle: { bn: "পুষ্টিকর সবুজ সবজি", en: "Nutritious Green Vegetables" },
    image: "/vegetables/vegetable-6.jpg",
  },
  {
    title: { bn: "বাগান থেকে সবজি", en: "Garden Fresh Vegetables" },
    subtitle: { bn: "সরাসরি বাগান থেকে", en: "Directly from Garden" },
    image: "/vegetables/vegetable-7.jpg",
  },
];

export default function LandingPage() {
  const [language, setLanguage] = useState<Language>("bn");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLanguage(e.detail);
    };

    window.addEventListener(
      "languageChange",
      handleLanguageChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "languageChange",
        handleLanguageChange as EventListener,
      );
    };
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden min-w-full w-full h-screen p-0 mt-32">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full h-full"
        >
          <CarouselContent className="min-w-full h-full">
            {banners.map((banner, index) => (
              <CarouselItem key={banner.image} className="w-full h-full">
                <div className="relative w-full h-screen">
                  <Image
                    src={banner.image}
                    alt={banner.title[language]}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="relative h-full flex flex-col justify-end p-10">
                    <div className="container mx-auto px-4 pb-16 pt-32">
                      <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-6xl font-bold mb-4 text-white">
                          {banner.title[language]}
                        </h1>
                        <p className="text-xl md:text-2xl opacity-90 mb-8 text-white">
                          {banner.subtitle[language]}
                        </p>
                        <Link href="/products">
                          <Button
                            size="lg"
                            variant="secondary"
                            className="text-lg shadow-2xl hover:scale-105 transition-transform"
                          >
                            <Sparkles className="mr-2 h-5 w-5" />
                            {language === "bn" ? "এখনই কিনুন" : "Shop Now"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="secondary"
            className="left-4 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-2xl size-12 border-primary"
          />
          <CarouselNext
            variant="secondary"
            className="right-4 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-2xl size-12 border-primary"
          />
        </Carousel>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {language === "bn" ? "বিশেষ ক্যাটাগরি" : "Featured Categories"}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <ScrollReveal key={category.slug} delay={index * 0.1}>
                <CategoryCard
                  name={category.name}
                  icon={category.icon}
                  slug={category.slug}
                  language={language}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts products={topProducts} language={language} />

      {/* Top Sellers */}
      <TopSellers products={topProducts} language={language} />

      {/* New Arrivals */}
      <NewArrivals products={topProducts} language={language} />

      {/* Special Deals */}
      <SpecialOffers
        deals={[
          {
            title: { bn: "মধু বান্ডেল অফার", en: "Honey Bundle Offer" },
            description: { bn: "৩টি মধু কিনে ১টি ফ্রি", en: "Buy 3 Get 1 Free" },
            image: "/honey.jpg",
            discount: "25% OFF",
          },
          {
            title: { bn: "ঘি বান্ডেল অফার", en: "Ghee Bundle Offer" },
            description: { bn: "২টি ঘি কিনে ১০% ছাড়", en: "Buy 2 Get 10% Off" },
            image: "/ghee.jpg",
            discount: "10% OFF",
          },
          {
            title: { bn: "মশলা বান্ডেল অফার", en: "Spices Bundle Offer" },
            description: { bn: "৫টি মশলা কিনে ১৫% ছাড়", en: "Buy 5 Get 15% Off" },
            image: "/spices.jpg",
            discount: "15% OFF",
          },
        ]}
        language={language}
      />

      {/* Fresh Vegetables - All 75 Images */}
      <FreshVegetables language={language} />

      {/* Organic Products */}
      <OrganicProducts language={language} />

      {/* Seasonal Products */}
      <SeasonalProducts language={language} />

      {/* Social Proof Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-center">
              {language === "bn" ? "আমাদের পরিসংখ্যান" : "Our Numbers"}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                number: "10K+",
                label: { bn: "সন্তুষ্ট গ্রাহক", en: "Happy Customers" },
              },
              { number: "500+", label: { bn: "পণ্য", en: "Products" } },
              { number: "50+", label: { bn: "ক্যাটাগরি", en: "Categories" } },
              {
                number: "99%",
                label: { bn: "মান নিশ্চিত", en: "Quality Assured" },
              },
            ].map((stat) => (
              <ScrollReveal key={stat.label.en} delay={0.1}>
                <Card className="text-center border-2 border-transparent hover:border-primary/20 transition-colors">
                  <CardContent className="p-4 md:p-6">
                    <p className="text-2xl md:text-4xl font-bold text-primary mb-2">
                      {stat.number}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {stat.label[language]}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
