import { CategoryCard } from "@/components/marketing/category-card";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { FreshVegetables } from "@/components/marketing/fresh-vegetables";
import {
  LandingHero,
  type LandingHeroBanner,
} from "@/components/marketing/landing-hero";
import { NewArrivals } from "@/components/marketing/new-arrivals";
import { OrganicProducts } from "@/components/marketing/organic-products";
import { SeasonalProducts } from "@/components/marketing/seasonal-products";
import { SpecialOffers } from "@/components/marketing/special-offers";
import { TopSellers } from "@/components/marketing/top-sellers";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  getFeaturedRoshalProducts,
  getRoshalPageBundle,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { formatBdt } from "@/lib/store-format";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue, localizedValue } from "@/lib/store-locale";
import type {
  LocalizedValue,
  RoshalMarketingSection,
  RoshalProduct,
} from "@/lib/store-types";

type Language = "bn" | "en";

interface MarketingProductCard {
  id: string | number;
  href?: string;
  image: string;
  name: LocalizedValue;
  price: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  cartProduct?: RoshalProduct;
}

interface LandingCategory {
  name: LocalizedValue;
  icon: string;
  slug: string;
  href?: string;
}

interface LandingDeal {
  title: LocalizedValue;
  description: LocalizedValue;
  image: string;
  discount: string;
  href?: string;
  ctaLabel?: LocalizedValue;
}

interface LandingStat {
  number: string;
  label: LocalizedValue;
}

const fallbackBanners: LandingHeroBanner[] = [
  {
    title: localizedValue("তাজা সবজির সমাহার", "Fresh Vegetable Collection"),
    subtitle: localizedValue(
      "সরাসরি কৃষকদের কাছ থেকে সংগ্রহ",
      "Directly from Local Farmers",
    ),
    image: "/vegetables/vegetable-1.jpg",
    href: "/products",
    ctaLabel: localizedValue("এখনই কিনুন", "Shop Now"),
  },
  {
    title: localizedValue("অর্গানিক সবজি", "Organic Vegetables"),
    subtitle: localizedValue("১০০% প্রাকৃতিক ও স্বাস্থ্যকর", "100% Natural & Healthy"),
    image: "/vegetables/vegetable-2.jpg",
    href: "/products",
    ctaLabel: localizedValue("এখনই কিনুন", "Shop Now"),
  },
  {
    title: localizedValue("মৌসুমি সবজি", "Seasonal Vegetables"),
    subtitle: localizedValue("বর্তমান মৌসুমের সেরা সবজি", "Best of Current Season"),
    image: "/vegetables/vegetable-3.jpg",
    href: "/products",
    ctaLabel: localizedValue("এখনই কিনুন", "Shop Now"),
  },
];

const fallbackCategories: LandingCategory[] = [
  {
    name: localizedValue("তেল ও ঘি", "Oil & Ghee"),
    icon: "/ghee.jpg",
    slug: "oil-ghee",
    href: "/products?category=ghee",
  },
  {
    name: localizedValue("অর্গানিক", "Organic"),
    icon: "/honey.jpg",
    slug: "organic",
    href: "/products",
  },
  {
    name: localizedValue("মধু", "Honey"),
    icon: "/honey.jpg",
    slug: "honey",
    href: "/products?category=honey",
  },
  {
    name: localizedValue("খেজুর", "Dates"),
    icon: "/dates.jpg",
    slug: "dates",
    href: "/products?category=gur",
  },
  {
    name: localizedValue("মশলা", "Spices"),
    icon: "/spices.jpg",
    slug: "spices",
    href: "/products",
  },
  {
    name: localizedValue("বাদাম ও বীজ", "Nuts & Seeds"),
    icon: "/nuts.jpg",
    slug: "nuts-seeds",
    href: "/products",
  },
  {
    name: localizedValue("পানীয়", "Beverage"),
    icon: "/beverage.jpg",
    slug: "beverage",
    href: "/products",
  },
  {
    name: localizedValue("চাল", "Rice"),
    icon: "/rice.jpg",
    slug: "rice",
    href: "/products",
  },
];

const fallbackDeals: LandingDeal[] = [
  {
    title: localizedValue("মধু বান্ডেল অফার", "Honey Bundle Offer"),
    description: localizedValue("৩টি মধু কিনে ১টি ফ্রি", "Buy 3 Get 1 Free"),
    image: "/honey.jpg",
    discount: "25% OFF",
    href: "/products/pure-honey",
  },
  {
    title: localizedValue("ঘি বান্ডেল অফার", "Ghee Bundle Offer"),
    description: localizedValue("২টি ঘি কিনে ১০% ছাড়", "Buy 2 Get 10% Off"),
    image: "/ghee.jpg",
    discount: "10% OFF",
    href: "/products/organic-ghee",
  },
  {
    title: localizedValue("মশলা বান্ডেল অফার", "Spices Bundle Offer"),
    description: localizedValue("৫টি মশলা কিনে ১৫% ছাড়", "Buy 5 Get 15% Off"),
    image: "/spices.jpg",
    discount: "15% OFF",
    href: "/products",
  },
];

const fallbackStats: LandingStat[] = [
  {
    number: "10K+",
    label: localizedValue("সন্তুষ্ট গ্রাহক", "Happy Customers"),
  },
  {
    number: "500+",
    label: localizedValue("পণ্য", "Products"),
  },
  {
    number: "50+",
    label: localizedValue("ক্যাটাগরি", "Categories"),
  },
  {
    number: "99%",
    label: localizedValue("মান নিশ্চিত", "Quality Assured"),
  },
];

function sectionMap(sections: RoshalMarketingSection[]) {
  return new Map(sections.map((section) => [section.sectionKey, section]));
}

function firstNonEmptyValue(
  values: Array<string | null | undefined>,
  fallback: string,
) {
  return values.find((value) => value?.trim()) || fallback;
}

function buildHeroBanners(
  heroSection: RoshalMarketingSection | undefined,
  siteCtaHref: string,
  siteCtaLabel: LocalizedValue,
): LandingHeroBanner[] {
  if (heroSection?.items.length) {
    return heroSection.items.map((item, index) => ({
      image:
        item.imageUrl || fallbackBanners[index % fallbackBanners.length].image,
      title:
        item.title ||
        item.label ||
        fallbackBanners[index % fallbackBanners.length].title,
      subtitle:
        item.body || fallbackBanners[index % fallbackBanners.length].subtitle,
      href: item.href || siteCtaHref,
      ctaLabel: item.label || siteCtaLabel,
    }));
  }

  if (heroSection) {
    return [
      {
        image: heroSection.imageUrl || fallbackBanners[0].image,
        title: {
          bn: firstNonEmptyValue(
            [heroSection.title.bn, fallbackBanners[0].title.bn],
            fallbackBanners[0].title.bn,
          ),
          en: firstNonEmptyValue(
            [heroSection.title.en, fallbackBanners[0].title.en],
            fallbackBanners[0].title.en,
          ),
        },
        subtitle: {
          bn: firstNonEmptyValue(
            [heroSection.body.bn, fallbackBanners[0].subtitle.bn],
            fallbackBanners[0].subtitle.bn,
          ),
          en: firstNonEmptyValue(
            [heroSection.body.en, fallbackBanners[0].subtitle.en],
            fallbackBanners[0].subtitle.en,
          ),
        },
        href: heroSection.ctaHref || siteCtaHref,
        ctaLabel:
          heroSection.ctaLabel.bn || heroSection.ctaLabel.en
            ? heroSection.ctaLabel
            : siteCtaLabel,
      },
      ...fallbackBanners.slice(1),
    ];
  }

  return fallbackBanners;
}

function buildCategories(
  categoriesSection: RoshalMarketingSection | undefined,
  products: RoshalProduct[],
): LandingCategory[] {
  if (categoriesSection?.items.length) {
    return categoriesSection.items.map((item, index) => ({
      name:
        item.title ||
        item.label ||
        localizedValue(`ক্যাটাগরি ${index + 1}`, `Category ${index + 1}`),
      icon:
        item.imageUrl ||
        products[index % Math.max(products.length, 1)]?.heroImage ||
        fallbackCategories[index % fallbackCategories.length].icon,
      slug: `category-${index + 1}`,
      href: item.href || "/products",
    }));
  }

  if (!products.length) {
    return fallbackCategories;
  }

  return Array.from(
    new Map(
      products.map((product) => [
        product.categoryKey,
        {
          name: product.categoryLabel,
          icon: product.heroImage,
          slug: product.categoryKey,
          href: `/products?category=${product.categoryKey}`,
        },
      ]),
    ).values(),
  ).slice(0, 8);
}

function parseLimit(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function selectProducts(
  allProducts: RoshalProduct[],
  featuredProducts: RoshalProduct[],
  section: RoshalMarketingSection | undefined,
  fallback: {
    source?: "all" | "featured" | "reverse";
    limit: number;
    offset?: number;
  },
) {
  const source = section?.styles.source || fallback.source || "all";
  const limit = parseLimit(section?.styles.limit, fallback.limit);
  const offset = parseLimit(section?.styles.offset, fallback.offset || 0);

  const baseProducts =
    source === "featured"
      ? featuredProducts.length
        ? featuredProducts
        : allProducts
      : source === "reverse"
        ? [...allProducts].reverse()
        : allProducts;

  return baseProducts.slice(offset, offset + limit);
}

function toMarketingProduct(
  product: RoshalProduct,
  locale: Language,
  seed: number,
): MarketingProductCard {
  const discountPercentage = product.compareAtPrice
    ? Math.max(
        0,
        Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        ),
      )
    : 0;

  return {
    id: product.id,
    href: `/products/${product.slug}`,
    image: product.heroImage,
    name: product.name,
    price: formatBdt(product.price, locale),
    originalPrice: product.compareAtPrice
      ? formatBdt(product.compareAtPrice, locale)
      : undefined,
    rating: Number((4.4 + (seed % 5) * 0.1).toFixed(1)),
    reviews: 40 + seed * 17,
    badge:
      product.badge ||
      (discountPercentage > 0 ? `${discountPercentage}% OFF` : undefined),
    badgeVariant: product.badge ? "secondary" : "destructive",
    cartProduct: product,
  };
}

function buildDeals(
  section: RoshalMarketingSection | undefined,
  siteCtaHref: string,
  siteCtaLabel: LocalizedValue,
): LandingDeal[] {
  if (section?.items.length) {
    return section.items.map((item, index) => ({
      title:
        item.title ||
        item.label ||
        fallbackDeals[index % fallbackDeals.length].title,
      description:
        item.body || fallbackDeals[index % fallbackDeals.length].description,
      image: item.imageUrl || fallbackDeals[index % fallbackDeals.length].image,
      discount:
        item.value || fallbackDeals[index % fallbackDeals.length].discount,
      href: item.href || siteCtaHref,
      ctaLabel: item.label || siteCtaLabel,
    }));
  }

  return fallbackDeals;
}

function buildStats(
  section: RoshalMarketingSection | undefined,
): LandingStat[] {
  if (section?.items.length) {
    return section.items.map((item, index) => ({
      number: item.value || fallbackStats[index % fallbackStats.length].number,
      label:
        item.label ||
        item.title ||
        fallbackStats[index % fallbackStats.length].label,
    }));
  }

  return fallbackStats;
}

function sectionTitle(
  section: RoshalMarketingSection | undefined,
  fallback: LocalizedValue,
) {
  return section?.title.bn || section?.title.en ? section.title : fallback;
}

function sectionDescription(
  section: RoshalMarketingSection | undefined,
  fallback?: LocalizedValue,
) {
  if (section?.body.bn || section?.body.en) {
    return section.body;
  }

  return fallback;
}

function sectionCtaLabel(
  section: RoshalMarketingSection | undefined,
  fallback: LocalizedValue,
) {
  return section?.ctaLabel.bn || section?.ctaLabel.en
    ? section.ctaLabel
    : fallback;
}

function sectionCtaHref(
  section: RoshalMarketingSection | undefined,
  fallback: string,
) {
  return section?.ctaHref || fallback;
}

export default async function LandingPage() {
  const [locale, siteSettings, pageBundle, products, featuredProducts] =
    await Promise.all([
      getRoshalLocale(),
      getRoshalSiteSettings(),
      getRoshalPageBundle("home"),
      getRoshalProducts(),
      getFeaturedRoshalProducts(8),
    ]);

  const language = locale as Language;
  const sections = pageBundle?.sections || [];
  const sectionsByKey = sectionMap(sections);

  const heroSection = sectionsByKey.get("hero");
  const categoriesSection = sectionsByKey.get("landing-categories");
  const featuredSection = sectionsByKey.get("featured-products");
  const topSellersSection = sectionsByKey.get("landing-top-sellers");
  const newArrivalsSection = sectionsByKey.get("landing-new-arrivals");
  const specialOffersSection = sectionsByKey.get("landing-special-offers");
  const statsSection = sectionsByKey.get("landing-stats");
  const freshSection = sectionsByKey.get("landing-fresh-picks");
  const organicSection = sectionsByKey.get("landing-organic-picks");
  const seasonalSection = sectionsByKey.get("landing-seasonal-picks");

  const categories = buildCategories(categoriesSection, products);
  const heroBanners = buildHeroBanners(
    heroSection,
    siteSettings.primaryCtaHref,
    siteSettings.primaryCtaLabel,
  );
  const featuredCards = selectProducts(
    products,
    featuredProducts,
    featuredSection,
    {
      source: "featured",
      limit: 8,
    },
  ).map((product, index) => toMarketingProduct(product, language, index));
  const topSellerCards = selectProducts(
    products,
    featuredProducts,
    topSellersSection,
    {
      source: "featured",
      limit: 8,
    },
  ).map((product, index) => toMarketingProduct(product, language, index + 4));
  const newArrivalCards = selectProducts(
    products,
    featuredProducts,
    newArrivalsSection,
    {
      source: "reverse",
      limit: 8,
    },
  ).map((product, index) => toMarketingProduct(product, language, index + 8));
  const freshCards = selectProducts(products, featuredProducts, freshSection, {
    source: "all",
    limit: 10,
    offset: 0,
  }).map((product, index) => toMarketingProduct(product, language, index + 12));
  const organicCards = selectProducts(
    products,
    featuredProducts,
    organicSection,
    {
      source: "featured",
      limit: 10,
      offset: 0,
    },
  ).map((product, index) => toMarketingProduct(product, language, index + 24));
  const seasonalCards = selectProducts(
    products,
    featuredProducts,
    seasonalSection,
    {
      source: "reverse",
      limit: 10,
      offset: 0,
    },
  ).map((product, index) => ({
    ...toMarketingProduct(product, language, index + 36),
    season: (index % 2 === 0 ? "winter" : "summer") as "winter" | "summer",
  }));

  const deals = buildDeals(
    specialOffersSection,
    siteSettings.primaryCtaHref,
    siteSettings.primaryCtaLabel,
  );
  const stats = buildStats(statsSection);

  return (
    <div className="flex flex-col overflow-hidden pt-22">
      <LandingHero banners={heroBanners} language={language} />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              {getLocalizedValue(
                language,
                sectionTitle(
                  categoriesSection,
                  localizedValue("বিশেষ ক্যাটাগরি", "Featured Categories"),
                ),
              )}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {categories.map((category, index) => (
              <ScrollReveal
                key={`${category.slug}-${index}`}
                delay={index * 0.1}
              >
                <CategoryCard
                  name={category.name}
                  icon={category.icon}
                  slug={category.slug}
                  href={category.href}
                  language={language}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts
        products={featuredCards}
        language={language}
        title={sectionTitle(
          featuredSection,
          localizedValue("বিশেষ পণ্য", "Featured Products"),
        )}
        description={sectionDescription(featuredSection)}
        ctaHref={sectionCtaHref(featuredSection, "/products")}
        ctaLabel={sectionCtaLabel(
          featuredSection,
          localizedValue("সব পণ্য দেখুন", "View All Products"),
        )}
      />

      <TopSellers
        products={topSellerCards}
        language={language}
        title={sectionTitle(
          topSellersSection,
          localizedValue("সেরা বিক্রেতা", "Top Sellers"),
        )}
        description={sectionDescription(topSellersSection)}
        ctaHref={sectionCtaHref(topSellersSection, "/products")}
        ctaLabel={sectionCtaLabel(
          topSellersSection,
          localizedValue("আরও দেখুন", "View More"),
        )}
      />

      <NewArrivals
        products={newArrivalCards}
        language={language}
        title={sectionTitle(
          newArrivalsSection,
          localizedValue("নতুন আগমন", "New Arrivals"),
        )}
        description={sectionDescription(newArrivalsSection)}
        ctaHref={sectionCtaHref(newArrivalsSection, "/products")}
        ctaLabel={sectionCtaLabel(
          newArrivalsSection,
          localizedValue("সব নতুন পণ্য দেখুন", "View All New Arrivals"),
        )}
      />

      <SpecialOffers
        deals={deals}
        language={language}
        title={sectionTitle(
          specialOffersSection,
          localizedValue("বিশেষ ডিল", "Special Deals"),
        )}
        description={sectionDescription(specialOffersSection)}
      />

      <FreshVegetables
        language={language}
        products={freshCards}
        title={sectionTitle(
          freshSection,
          localizedValue("তাজা সবজি", "Fresh Vegetables"),
        )}
        description={sectionDescription(freshSection)}
        ctaHref={sectionCtaHref(freshSection, "/products")}
        ctaLabel={sectionCtaLabel(
          freshSection,
          localizedValue("সব সবজি দেখুন", "View All Vegetables"),
        )}
      />

      <OrganicProducts
        language={language}
        products={organicCards}
        title={sectionTitle(
          organicSection,
          localizedValue("অর্গানিক পণ্য", "Organic Products"),
        )}
        description={sectionDescription(organicSection)}
        ctaHref={sectionCtaHref(organicSection, "/products")}
        ctaLabel={sectionCtaLabel(
          organicSection,
          localizedValue("সব অর্গানিক পণ্য দেখুন", "View All Organic Products"),
        )}
      />

      <SeasonalProducts
        language={language}
        products={seasonalCards}
        title={sectionTitle(
          seasonalSection,
          localizedValue("মৌসুমি পণ্য", "Seasonal Products"),
        )}
        description={sectionDescription(seasonalSection)}
        ctaHref={sectionCtaHref(seasonalSection, "/products")}
        ctaLabel={sectionCtaLabel(
          seasonalSection,
          localizedValue("সব মৌসুমি পণ্য দেখুন", "View All Seasonal Products"),
        )}
      />

      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-4xl">
              {getLocalizedValue(
                language,
                sectionTitle(
                  statsSection,
                  localizedValue("আমাদের পরিসংখ্যান", "Our Numbers"),
                ),
              )}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {stats.map((stat) => (
              <ScrollReveal key={`${stat.number}-${stat.label.en}`} delay={0.1}>
                <Card className="border-2 border-transparent text-center transition-colors hover:border-primary/20">
                  <CardContent className="p-4 md:p-6">
                    <p className="mb-2 text-2xl font-bold text-primary md:text-4xl">
                      {stat.number}
                    </p>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      {getLocalizedValue(language, stat.label)}
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
