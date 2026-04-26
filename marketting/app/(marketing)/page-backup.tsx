"use client";

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Headphones,
  Heart,
  Leaf,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pointer } from "@/components/ui/pointer";

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
    title: { bn: "খাঁটি স্বাদের আসল ঠিকানা", en: "Authentic Taste, Real Quality" },
    subtitle: {
      bn: "১০০% প্রাকৃতিক ও অর্গানিক খাদ্য",
      en: "100% Natural & Organic Food",
    },
    image: "/fresh-fruit-basket.jpg",
  },
  {
    title: { bn: "মৌসুমী আম এখন স্টকে", en: "Seasonal Mangoes Now in Stock" },
    subtitle: { bn: "সরাসরি বাগান থেকে সংগ্রহ", en: "Directly from the Garden" },
    image: "/mango-2.jpg",
  },
  {
    title: { bn: "বিশেষ ছাড় - ২০% অফ", en: "Special Offer - 20% Off" },
    subtitle: { bn: "সব পণ্যের উপর", en: "On All Products" },
    image: "/organic-vegetables.jpg",
  },
  {
    title: { bn: "প্রিমিয়াম খেজুর", en: "Premium Dates" },
    subtitle: {
      bn: "সৌদি আরব থেকে সরাসরি আমদানি",
      en: "Directly Imported from Saudi Arabia",
    },
    image: "/dates-2.jpg",
  },
  {
    title: { bn: "অর্গানিক ঘি", en: "Organic Ghee" },
    subtitle: { bn: "খাঁটি গরুর দুধ থেকে তৈরি", en: "Made from Pure Cow Milk" },
    image: "/ghee-2.jpg",
  },
  {
    title: { bn: "তাজা দুগ্ধজাত পণ্য", en: "Fresh Dairy Products" },
    subtitle: { bn: "প্রতিদিন তাজা সরবরাহ", en: "Fresh Supply Every Day" },
    image: "/yogurt-2.jpg",
  },
  {
    title: { bn: "দেশি মশলা সমূহ", en: "Local Spices" },
    subtitle: { bn: "খাঁটি ও স্বাদে ভরা", en: "Authentic & Flavorful" },
    image: "/spices-2.jpg",
  },
];

export default function LandingPage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [language, setLanguage] = useState<Language>("bn");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Listen for language changes from header
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

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.image} className="min-w-full relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative py-32 md:py-48">
                <div className="container mx-auto px-4 text-center">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                    {banner.title[language]}
                  </h1>
                  <p className="text-xl md:text-2xl opacity-90 mb-8 text-white">
                    {banner.subtitle[language]}
                  </p>
                  <Link href="/products">
                    <Button size="lg" variant="secondary" className="text-lg">
                      {language === "bn" ? "এখনই কিনুন" : "Shop Now"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary text-primary-foreground p-2 rounded-full shadow-lg transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary text-primary-foreground p-2 rounded-full shadow-lg transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((banner) => (
            <button
              key={banner.image}
              onClick={() => setCurrentBanner(banners.indexOf(banner))}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentBanner === banners.indexOf(banner)
                  ? "bg-primary"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {language === "bn" ? "বিশেষ ক্যাটাগরি" : "Featured Categories"}
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-muted">
                      <img
                        src={category.icon}
                        alt={category.name[language]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <p className="text-xs font-medium">
                      {category.name[language]}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {language === "bn" ? "সেরা বিক্রিত পণ্য" : "Top Selling Products"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow group overflow-hidden"
              >
                <div className="h-[250px] overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={
                      typeof product.name === "string"
                        ? product.name
                        : product.name[language]
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold mb-2 line-clamp-2 text-sm">
                    {typeof product.name === "string"
                      ? product.name
                      : product.name[language]}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-primary">
                      {product.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <Button className="w-full" size="sm">
                      {language === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products">
              <Button size="lg" variant="outline">
                {language === "bn" ? "সব পণ্য দেখুন" : "View All Products"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Dates Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src="/dates.jpg"
                  alt="Premium Dates"
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
                    Cooking Essentials
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm font-semibold"
                  >
                    Organic Certified
                  </Badge>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Premium Dates
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                ১০০% প্রাকৃতিক ও অর্গানিক খেজুর, সরাসরি মরুভূমি থেকে সংগ্রহ। আমাদের প্রিমিয়াম
                খেজুর সমূহ সবচেয়ে উন্নতমানের এবং পুষ্টিগুণে ভরপুর।
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-foreground">১০০% প্রাকৃতিক ও অর্গানিক</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-foreground">
                    কোনো কেমিক্যাল বা প্রিজারভেটিভ নেই
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-foreground">উচ্চ পুষ্টিমান সমৃদ্ধ</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-foreground">
                    সরাসরি সৌদি আরব থেকে আমদানি
                  </span>
                </li>
              </ul>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">৳৪৫০</span>
                <span className="text-xl text-muted-foreground line-through">
                  ৳৫৫০
                </span>
                <Badge variant="destructive">২০% ছাড়</Badge>
              </div>
              <Link href="/products?category=dates">
                <Button size="lg" className="w-full md:w-auto">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  এখনই কিনুন
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Just For You Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {language === "bn" ? "আপনার জন্য" : "Just For You"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topProducts.map((product) => (
              <Card
                key={`just-for-you-${product.id}`}
                className="hover:shadow-lg transition-shadow group overflow-hidden"
              >
                <div className="h-[250px] overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={
                      typeof product.name === "string"
                        ? product.name
                        : product.name[language]
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold mb-2 line-clamp-2 text-sm">
                    {typeof product.name === "string"
                      ? product.name
                      : product.name[language]}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-primary">
                      {product.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <Button className="w-full" size="sm">
                      {language === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products">
              <Button size="lg" variant="outline">
                {language === "bn" ? "সব পণ্য দেখুন" : "View All Products"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Health Benefits Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
            {language === "bn"
              ? "অর্গানিক খাদ্যের স্বাস্থ্য উপকারিতা"
              : "Health Benefits of Organic Food"}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-[250px] overflow-hidden">
                <img
                  src="/healthy-food.jpg"
                  alt="Healthy Food"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  {language === "bn" ? "পুষ্টিকর" : "Nutrient Rich"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "bn"
                    ? "অর্গানিক খাবারে প্রয়োজনীয় পুষ্টি এবং অ্যান্টিঅক্সিডেন্ট বেশি থাকে।"
                    : "Organic foods contain higher levels of essential nutrients and antioxidants."}
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-[250px] overflow-hidden">
                <img
                  src="/organic-benefits.jpg"
                  alt="Organic Benefits"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  {language === "bn" ? "রাসায়নিক মুক্ত" : "Chemical Free"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "bn"
                    ? "উৎপাদনে ক্ষতিকর কীটনাশক বা সিন্থেটিক সার ব্যবহার করা হয় না।"
                    : "No harmful pesticides or synthetic fertilizers used in production."}
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-[250px] overflow-hidden">
                <img
                  src="/nutrition.jpg"
                  alt="Nutrition"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  {language === "bn" ? "ভালো স্বাদ" : "Better Taste"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "bn"
                    ? "প্রাকৃতিক চাষাবাদ পদ্ধতি স্বাদ এবং তাজাত্ব বাড়ায়।"
                    : "Natural growing methods enhance flavor and freshness."}
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-[250px] overflow-hidden">
                <img
                  src="/healthy-food.jpg"
                  alt="Sustainable"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  {language === "bn" ? "টেকসই" : "Sustainable"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "bn"
                    ? "ভবিষ্যতের জন্য পরিবেশবান্ধব চাষাবাদ পদ্ধতি।"
                    : "Environmentally friendly farming practices for a better future."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
            {language === "bn" ? "আমাদের প্রক্রিয়া" : "Our Process"}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-[250px] overflow-hidden">
                <img
                  src="/farming.jpg"
                  alt="Farming"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  {language === "bn" ? "১. অর্গানিক চাষাবাদ" : "1. Organic Farming"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "bn"
                    ? "আমরা স্থায়ী পদ্ধতি ব্যবহার করে প্রত্যয়িত অর্গানিক খামার থেকে উৎপাদন করি।"
                    : "We source from certified organic farms using sustainable practices."}
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-[250px] overflow-hidden">
                <img
                  src="/harvest.jpg"
                  alt="Harvest"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  {language === "bn" ? "২. তাজা ফসল" : "2. Fresh Harvest"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "bn"
                    ? "সর্বোত্তম মানের জন্য সর্বোচ্চ তাজাত্বায় ফসল সংগ্রহ করা হয়।"
                    : "Products are harvested at peak freshness for maximum quality."}
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-[250px] overflow-hidden">
                <img
                  src="/packaging.jpg"
                  alt="Packaging"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  {language === "bn"
                    ? "৩. মান সম্পন্ন প্যাকেজিং"
                    : "3. Quality Packaging"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "bn"
                    ? "তাজাত্বা এবং পুষ্টি সংরক্ষণের জন্য সাবধানে প্যাকেজ করা হয়।"
                    : "Carefully packaged to preserve freshness and nutrients."}
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-[250px] overflow-hidden">
                <img
                  src="/farming.jpg"
                  alt="Delivery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  {language === "bn" ? "৪. দ্রুত ডেলিভারি" : "4. Fast Delivery"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "bn"
                    ? "আপনার দরজায় দ্রুত এবং নির্ভরযোগ্য ডেলিভারি।"
                    : "Quick and reliable delivery to your doorstep."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="flex justify-center mb-2">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 text-foreground">
                100% Natural
              </h3>
              <p className="text-sm text-muted-foreground">
                Pure organic products
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 text-foreground">
                Fast Delivery
              </h3>
              <p className="text-sm text-muted-foreground">
                Quick & reliable shipping
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 text-foreground">
                Quality Assured
              </h3>
              <p className="text-sm text-muted-foreground">
                Premium quality products
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 text-foreground">
                24/7 Support
              </h3>
              <p className="text-sm text-muted-foreground">
                Always here to help
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="p-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-background hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="/customer-1.jpg"
                    alt="Customer"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">আহমেদ হাসান</h4>
                    <p className="text-sm text-muted-foreground">ঢাকা</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "রোশাল অর্গানিকের মধু সত্যিই অসাধারণ। এটি খুবই খাঁটি এবং স্বাদে অতুলনীয়।
                  আমি তাদের পণ্য নিয়মিত কিনি।"
                </p>
                <div className="flex gap-1 mt-4">
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="/customer-2.jpg"
                    alt="Customer"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">ফাতেমা আক্তার</h4>
                    <p className="text-sm text-muted-foreground">চট্টগ্রাম</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "তাদের খেজুর এবং ঘি খুবই ভালো মানের। ডেলিভারি সিস্টেমও খুব দ্রুত। সবাইকে
                  রোশাল অর্গানিক চেষ্টা করতে বলব।"
                </p>
                <div className="flex gap-1 mt-4">
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="/customer-3.jpg"
                    alt="Customer"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">রাজেশ কুমার</h4>
                    <p className="text-sm text-muted-foreground">সিলেট</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "অর্গানিক পণ্যের জন্য রোশাল অর্গানিক সেরা। দামও যুক্তিসঙ্গত এবং গুণমান
                  অসাধারণ।"
                </p>
                <div className="flex gap-1 mt-4">
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <BlurFade delay={0.3} inView>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {language === "bn" ? "বিশেষ অফার" : "Special Offers"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-[250px] overflow-hidden relative">
                  <img
                    src="/deal-1.jpg"
                    alt="Special Deal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    20% OFF
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground">
                    {language === "bn" ? "মধু কম্বো প্যাক" : "Honey Combo Pack"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === "bn"
                      ? "বিশেষ মূল্যে ৩টি প্রিমিয়াম মধুর জার"
                      : "Get 3 premium honey jars at special price"}
                  </p>
                  <Button className="w-full" size="sm">
                    {language === "bn" ? "কিনুন" : "Shop Now"}
                  </Button>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-[250px] overflow-hidden relative">
                  <img
                    src="/deal-2.jpg"
                    alt="Special Deal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    15% OFF
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground">
                    {language === "bn" ? "খেজুর সংগ্রহ" : "Dates Collection"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === "bn"
                      ? "প্রিমিয়াম সৌদি খেজুরের সংমিশ্রণ"
                      : "Premium Saudi dates assortment"}
                  </p>
                  <Button className="w-full" size="sm">
                    {language === "bn" ? "কিনুন" : "Shop Now"}
                  </Button>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-[250px] overflow-hidden relative">
                  <img
                    src="/deal-3.jpg"
                    alt="Special Deal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    25% OFF
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground">
                    {language === "bn" ? "ঘি বান্ডেল" : "Ghee Bundle"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === "bn"
                      ? "খাঁটি গরুর দুধ থেকে তৈরি পরিবারের প্যাক"
                      : "Pure cow ghee family pack"}
                  </p>
                  <Button className="w-full" size="sm">
                    {language === "bn" ? "কিনুন" : "Shop Now"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </BlurFade>

      {/* Bento Grid Section */}
      <BlurFade delay={0.4} inView>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
              {language === "bn" ? "কেন আমাদের বেছে নেবেন" : "Why Choose Us"}
            </h2>
            <Pointer>
              <BentoGrid>
                <BentoCard
                  name={language === "bn" ? "১০০% অর্গানিক" : "100% Organic"}
                  className="col-span-3 md:col-span-1"
                  background={
                    <div className="absolute inset-0">
                      <img
                        src="/healthy-food.jpg"
                        alt="Organic"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary/20" />
                    </div>
                  }
                  Icon={Sparkles}
                  description={
                    language === "bn"
                      ? "আমাদের সব পণ্য প্রত্যয়িত অর্গানিক এবং ক্ষতিকর রাসায়নিক মুক্ত।"
                      : "All our products are certified organic and free from harmful chemicals."
                  }
                  href="/products"
                  cta={language === "bn" ? "অর্গানিক কিনুন" : "Shop Organic"}
                />
                <BentoCard
                  name={language === "bn" ? "মান নিশ্চিত" : "Quality Assured"}
                  className="col-span-3 md:col-span-1"
                  background={
                    <div className="absolute inset-0">
                      <img
                        src="/organic-benefits.jpg"
                        alt="Quality"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary/20" />
                    </div>
                  }
                  Icon={ShieldCheck}
                  description={
                    language === "bn"
                      ? "আপনার কাছে পৌঁছানোর আগে প্রতিটি পণ্য কঠোর মান যাচাই করা হয়।"
                      : "Every product undergoes strict quality checks before reaching you."
                  }
                  href="/products"
                  cta={language === "bn" ? "আরও জানুন" : "Learn More"}
                />
                <BentoCard
                  name={language === "bn" ? "দ্রুত ডেলিভারি" : "Fast Delivery"}
                  className="col-span-3 md:col-span-1"
                  background={
                    <div className="absolute inset-0">
                      <img
                        src="/harvest.jpg"
                        alt="Delivery"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary/20" />
                    </div>
                  }
                  Icon={Clock}
                  description={
                    language === "bn"
                      ? "২৪-৪৮ ঘন্টার মধ্যে আপনার দরজায় দ্রুত এবং নির্ভরযোগ্য ডেলিভারি।"
                      : "Quick and reliable delivery to your doorstep within 24-48 hours."
                  }
                  href="/products"
                  cta={language === "bn" ? "অর্ডার করুন" : "Order Now"}
                />
                <BentoCard
                  name={language === "bn" ? "গ্রাহকের ভালোবাসা" : "Customer Love"}
                  className="col-span-3 md:col-span-1"
                  background={
                    <div className="absolute inset-0">
                      <img
                        src="/nutrition.jpg"
                        alt="Customers"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary/20" />
                    </div>
                  }
                  Icon={Heart}
                  description={
                    language === "bn"
                      ? "হাজার হাজার সন্তুষ্ট গ্রাহক যারা তাদের অর্গানিক প্রয়োজনের জন্য আমাদের উপর ভরসা করেন।"
                      : "Join thousands of happy customers who trust us for their organic needs."
                  }
                  href="/testimonials"
                  cta={language === "bn" ? "রিভিউ পড়ুন" : "Read Reviews"}
                />
              </BentoGrid>
            </Pointer>
          </div>
        </section>
      </BlurFade>

      {/* Brand Story Section */}
      <BlurFade delay={0.5} inView>
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  {language === "bn" ? "আমাদের গল্প" : "Our Story"}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {language === "bn"
                    ? "রোশাল অর্গানিক শুরু হয়েছিল একটি সাধারণ মিশন নিয়ে: বাংলাদেশের প্রতিটি ঘরে ১০০% খাঁটি, অর্গানিক খাদ্য পৌঁছে দেওয়া। আমরা সরাসরি প্রত্যয়িত অর্গানিক কৃষকদের সাথে কাজ করি যাতে সর্বোচ্চ মানের পণ্য আপনার টেবিলে পৌঁছায়।"
                    : "Roshal Organic started with a simple mission: to bring 100% pure, organic food to every home in Bangladesh. We work directly with certified organic farmers to ensure the highest quality products reach your table."}
                </p>
                <p className="text-muted-foreground mb-6">
                  {language === "bn"
                    ? "সুন্দরবনের সোনালী মধু থেকে শুরু করে সৌদি আরবের প্রিমিয়াম খেজুর পর্যন্ত, প্রতিটি পণ্য সাবধানে সংগ্রহ এবং বিশুদ্ধতার জন্য পরীক্ষা করা হয়। আমরা টেকসই চাষাবাদ পদ্ধতিতে বিশ্বাস করি যা আমাদের স্বাস্থ্য এবং পরিবেশ উভয়ই রক্ষা করে।"
                    : "From the golden honey of Sundarbans to the premium dates of Saudi Arabia, every product is carefully sourced and tested for purity. We believe in sustainable farming practices that protect both our health and our environment."}
                </p>
                <div className="flex gap-4">
                  <Button size="lg">
                    {language === "bn" ? "আরও জানুন" : "Learn More"}
                  </Button>
                  <Button size="lg" variant="outline">
                    {language === "bn" ? "ভিডিও দেখুন" : "Watch Video"}
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/brand-story.jpg"
                  alt="Our Story"
                  className="rounded-lg shadow-lg w-full"
                />
                <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold">10+</div>
                  <div className="text-sm">
                    {language === "bn" ? "বছরের বিশ্বাস" : "Years of Trust"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </BlurFade>

      {/* Newsletter Section */}
      <BlurFade delay={0.6} inView>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                {language === "bn" ? "আপডেট থাকুন" : "Stay Updated"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "bn"
                  ? "আমাদের নিউজলেটারে সাবস্ক্রাইব করুন এক্সক্লুসিভ অফার, নতুন পণ্য ঘোষণা এবং স্বাস্থ্যকর জীবনযাপন টিপসের জন্য।"
                  : "Subscribe to our newsletter for exclusive offers, new product announcements, and healthy living tips."}
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={
                    language === "bn" ? "আপনার ইমেইল লিখুন" : "Enter your email"
                  }
                  className="flex-1"
                />
                <Button size="lg">
                  {language === "bn" ? "সাবস্ক্রাইব" : "Subscribe"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                {language === "bn"
                  ? "সাবস্ক্রাইব করার মাধ্যমে, আপনি আমাদের গোপনীয়তা নীতি মেনে চলতে সম্মত হন এবং আপডেট পেতে সম্মতি দেন।"
                  : "By subscribing, you agree to our Privacy Policy and consent to receive updates."}
              </p>
            </div>
          </div>
        </section>
      </BlurFade>
    </div>
  );
}
