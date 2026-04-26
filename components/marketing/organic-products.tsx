import { Leaf, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface OrganicProductsProps {
  language: "en" | "bn";
}

const organicProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  image: `/vegetables/vegetable-${(i % 75) + 1}.jpg`,
  name: {
    en: `Organic ${["Tomato", "Carrot", "Spinach", "Broccoli", "Cabbage", "Cauliflower", "Bell Pepper", "Cucumber", "Eggplant", "Onion", "Garlic", "Ginger", "Potato", "Sweet Potato", "Pumpkin", "Zucchini", "Green Beans", "Peas", "Corn", "Mushroom"][i % 20]}`,
    bn: `অর্গানিক ${["টমেটো", "গাজর", "পালং শাক", "ব্রোকলি", "বাঁধাকপি", "ফুলকপি", "বেল পেপার", "শসা", "বেগুন", "পেঁয়াজ", "রসুন", "আদা", "আলু", "মিষ্টি আলু", "লাউ", "জুকিনি", "শিম", "মটরশুঁটি", "ভুট্টা", "মাশরুম"][i % 20]}`,
  },
  price: 90 + ((i * 19) % 130),
  originalPrice: 170 + ((i * 11) % 140),
  rating: (3.6 + ((i * 5) % 12) / 10).toFixed(1),
  reviews: 30 + i * 11,
}));

export function OrganicProducts({ language }: OrganicProductsProps) {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mb-4 flex items-center justify-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <h2 className="text-center text-3xl font-bold md:text-4xl">
              {language === "bn" ? "অর্গানিক পণ্য" : "Organic Products"}
            </h2>
          </div>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            {language === "bn"
              ? "১০০% অর্গানিক প্রমাণিত পণ্য। কোনো কেমিক্যাল বা কীটনাশক ব্যবহার করা হয়নি।"
              : "100% certified organic products. No chemicals or pesticides used."}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {organicProducts.slice(0, 10).map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.05}>
              <Card className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name[language]}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      <Leaf className="mr-1 h-3 w-3" />
                      {language === "bn" ? "অর্গানিক" : "ORGANIC"}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="mb-2 line-clamp-1 text-sm font-semibold">
                      {product.name[language]}
                    </h3>
                    <div className="mb-2 flex items-center gap-1">
                      <span className="text-xs text-primary">★</span>
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold">
                          ৳{product.price}
                        </span>
                        {product.originalPrice > product.price ? (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            ৳{product.originalPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <Link href="/products">
                      <Button size="sm" className="w-full" variant="secondary">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {language === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" variant="outline">
                {language === "bn"
                  ? "সব অর্গানিক পণ্য দেখুন"
                  : "View All Organic Products"}
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
