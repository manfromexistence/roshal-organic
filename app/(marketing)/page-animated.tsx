"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  Leaf,
  Shield,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Marquee } from "@/components/ui/animated-marquee";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingElement } from "@/components/ui/floating-element";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

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
];

export default function LandingPage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [language, setLanguage] = useState<Language>("bn");
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

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

  // GSAP Scroll Animations
  useGSAP(() => {
    // Animate features on scroll
    gsap.from(".feature-icon", {
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      scale: 0,
      rotation: 180,
      duration: 0.6,
      stagger: 0.2,
      ease: "back.out(1.7)",
    });
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Banner Carousel with Parallax */}
      <motion.section
        ref={heroRef}
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={banner.image} className="min-w-full relative">
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image})` }}
                initial={{ scale: 1.1 }}
                animate={{ scale: currentBanner === index ? 1 : 1.1 }}
                transition={{ duration: 0.7 }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
              <div className="relative py-32 md:py-48">
                <div className="container mx-auto px-4 text-center">
                  <motion.h1
                    className="text-3xl md:text-6xl font-bold mb-4 text-white"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{
                      y: currentBanner === index ? 0 : 30,
                      opacity: currentBanner === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {banner.title[language]}
                  </motion.h1>
                  <motion.p
                    className="text-xl md:text-2xl opacity-90 mb-8 text-white"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{
                      y: currentBanner === index ? 0 : 30,
                      opacity: currentBanner === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {banner.subtitle[language]}
                  </motion.p>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{
                      y: currentBanner === index ? 0 : 30,
                      opacity: currentBanner === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
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
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary text-primary-foreground p-3 rounded-full shadow-2xl transition-all"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
        <motion.button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary text-primary-foreground p-3 rounded-full shadow-2xl transition-all"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((banner, index) => (
            <motion.button
              key={banner.image}
              onClick={() => setCurrentBanner(index)}
              className={`h-2 rounded-full transition-all ${
                currentBanner === index ? "w-8 bg-primary" : "w-2 bg-white/50"
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </motion.section>

      {/* Animated Marquee - Trust Badges */}
      <section className="py-6 bg-primary/5 border-y border-primary/10">
        <Marquee pauseOnHover className="[--duration:30s]">
          {[
            { icon: Leaf, text: "100% Organic" },
            { icon: Shield, text: "Quality Assured" },
            { icon: Truck, text: "Fast Delivery" },
            { icon: Headphones, text: "24/7 Support" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 mx-8 text-primary font-semibold"
            >
              <item.icon className="h-6 w-6" />
              <span>{item.text}</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* Featured Categories with Scroll Reveal */}
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
                <Link href={`/products?category=${category.slug}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="hover:shadow-xl transition-shadow cursor-pointer group border-2 border-transparent hover:border-primary/20">
                      <CardContent className="p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-muted ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                          <img
                            src={category.icon}
                            alt={category.name[language]}
                            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                          />
                        </div>
                        <p className="text-xs font-semibold">
                          {category.name[language]}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling Products with 3D Cards */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {language === "bn" ? "সেরা বিক্রিত পণ্য" : "Top Selling Products"}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {topProducts.slice(0, 4).map((product, index) => (
              <ScrollReveal
                key={product.id}
                delay={index * 0.15}
                direction="up"
              >
                <CardContainer className="inter-var">
                  <CardBody className="relative group/card hover:shadow-2xl w-full h-auto rounded-xl p-0 border border-border">
                    <CardItem translateZ="100" className="w-full">
                      <div className="h-[200px] md:h-[250px] overflow-hidden rounded-t-xl bg-muted relative">
                        <img
                          src={product.image}
                          alt={product.name[language]}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="destructive" className="shadow-lg">
                            20% OFF
                          </Badge>
                        </div>
                      </div>
                    </CardItem>
                    <CardItem translateZ="50" className="w-full p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 text-sm">
                        {product.name[language]}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-primary">
                          {product.price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">
                          {product.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>
                    </CardItem>
                    <CardItem translateZ="60" className="w-full px-4 pb-4">
                      <Link href={`/products/${product.id}`} className="block">
                        <Button
                          className="w-full shadow-lg hover:shadow-xl transition-shadow"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {language === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
                        </Button>
                      </Link>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.6}>
            <div className="text-center mt-12">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="shadow-lg hover:shadow-xl"
                >
                  {language === "bn" ? "সব পণ্য দেখুন" : "View All Products"}
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section with GSAP Animation */}
      <section ref={featuresRef} className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {language === "bn" ? "কেন আমাদের বেছে নিবেন" : "Why Choose Us"}
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "100% Natural",
                desc: "Pure organic products",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Quick & reliable shipping",
              },
              {
                icon: Shield,
                title: "Quality Assured",
                desc: "Premium quality products",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FloatingElement delay={index * 0.2} duration={3 + index * 0.5}>
                  <div className="flex justify-center mb-4">
                    <div className="feature-icon p-6 rounded-2xl bg-primary/10 text-primary">
                      <feature.icon className="h-10 w-10" />
                    </div>
                  </div>
                </FloatingElement>
                <h3 className="font-bold text-lg mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
