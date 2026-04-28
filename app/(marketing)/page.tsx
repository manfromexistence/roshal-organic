import { FeaturedProducts } from "@/components/marketing/featured-products";
import { FreshVegetables } from "@/components/marketing/fresh-vegetables";
import { HomeBrandStrip } from "@/components/marketing/home-brand-strip";
import { HomeCategoryStrip } from "@/components/marketing/home-category-strip";
import { HomeTestimonialCarousel } from "@/components/marketing/home-testimonial-carousel";
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
  getRoshalPageBundle,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { formatBdt } from "@/lib/store-format";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue, localizedValue } from "@/lib/store-locale";
import { buildHomepageCategories } from "@/lib/store-taxonomy";
import { getRoshalTaxonomy } from "@/lib/store-taxonomy-content";
import type {
  LocalizedValue,
  RoshalMarketingPage,
  RoshalMarketingSection,
  RoshalProduct,
  RoshalTaxonomyBundle,
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

interface LandingDeal {
  title: LocalizedValue;
  description: LocalizedValue;
  image: string;
  discount: string;
  href?: string;
  ctaLabel?: LocalizedValue;
}

interface LandingBrand {
  key: string;
  name: string;
  image: string;
  href: string;
}

interface LandingStat {
  number: string;
  label: LocalizedValue;
}

interface LandingTestimonial {
  key: string;
  quote: LocalizedValue;
  name: string;
  role: LocalizedValue;
  image?: string;
}

const fallbackBanners: LandingHeroBanner[] = [
  {
    title: localizedValue("তাজা সবজির সমাহার", "Fresh market essentials"),
    subtitle: localizedValue(
      "সরাসরি কৃষকের কাছ থেকে নিরাপদ ও খাঁটি পণ্য।",
      "Safe and authentic products sourced directly from growers.",
    ),
    image: "/special-offer.jpg",
    href: "/products",
    ctaLabel: localizedValue("এখনই কিনুন", "Shop now"),
  },
  {
    title: localizedValue("খাঁটি মধু ও ঘি", "Pure honey and ghee"),
    subtitle: localizedValue(
      "পরিবারের জন্য প্রতিদিনের স্বাস্থ্যকর পছন্দ।",
      "Everyday healthy staples for your family.",
    ),
    image: "/brand-story.jpg",
    href: "/products?category=honey",
    ctaLabel: localizedValue("বিস্তারিত দেখুন", "Explore"),
  },
  {
    title: localizedValue(
      "ঋতুভিত্তিক ফল ও বাজার",
      "Seasonal fruits and market picks",
    ),
    subtitle: localizedValue(
      "মৌসুমের সেরা সংগ্রহ এখন এক জায়গায়।",
      "The best of the season, collected in one storefront.",
    ),
    image: "/newsletter.jpg",
    href: "/products",
    ctaLabel: localizedValue("সব পণ্য", "View products"),
  },
];

const fallbackDeals: LandingDeal[] = [
  {
    title: localizedValue("মধু বান্ডেল অফার", "Honey bundle offer"),
    description: localizedValue("৩টি মধু কিনে ১টি ফ্রি", "Buy 3 and get 1 free"),
    image: "/deal-3.jpg",
    discount: "25% OFF",
    href: "/products/pure-honey",
  },
  {
    title: localizedValue("ঘি বান্ডেল অফার", "Ghee bundle offer"),
    description: localizedValue("২টি ঘি কিনে ১০% ছাড়", "Buy 2 and save 10%"),
    image: "/oil-2.jpg",
    discount: "10% OFF",
    href: "/products/organic-ghee",
  },
];

const fallbackBrands: LandingBrand[] = [
  {
    key: "roshal-organic",
    name: "Roshal Organic",
    image: "/logo.png",
    href: "/about",
  },
  {
    key: "signature-honey",
    name: "Signature Honey",
    image: "/honey.jpg",
    href: "/products?category=honey",
  },
  {
    key: "kitchen-ghee",
    name: "Kitchen Ghee",
    image: "/ghee.jpg",
    href: "/products?category=oil-ghee",
  },
  {
    key: "seasonal-dates",
    name: "Premium Dates",
    image: "/dates.jpg",
    href: "/products?category=jaggery-fruit",
  },
];

const fallbackStats: LandingStat[] = [
  {
    number: "10K+",
    label: localizedValue("সন্তুষ্ট গ্রাহক", "Happy customers"),
  },
  {
    number: "150+",
    label: localizedValue("দৈনিক অর্ডার", "Daily orders"),
  },
  {
    number: "50+",
    label: localizedValue("ক্যাটাগরি", "Categories"),
  },
  {
    number: "99%",
    label: localizedValue("খাঁটি মান", "Quality confidence"),
  },
];

const fallbackTestimonials: LandingTestimonial[] = [
  {
    key: "tumpa",
    quote: localizedValue(
      "এই অভিজ্ঞতার জগতে আস্থার একটি প্রতিষ্ঠিত নাম রোশাল অর্গানিক।",
      "Roshal Organic has become a dependable name for our household essentials.",
    ),
    name: "Fariha Akter Tumpa",
    role: localizedValue("উদ্যোক্তা", "Entrepreneur"),
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    key: "abir",
    quote: localizedValue(
      "ঘি আমি নিজে খুব একটা পছন্দ করতাম না, কিন্তু বাড়ির সবার জন্য কিনে বুঝলাম মানটা সত্যিই ভালো।",
      "I did not care much for ghee before, but buying it for my family made the quality obvious.",
    ),
    name: "Shahriar Khan Abir",
    role: localizedValue("সার্ভিস হোল্ডার", "Service holder"),
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    key: "kamran",
    quote: localizedValue(
      "বাজারের অনেক জায়গা থেকে কিনেছি, কিন্তু রোশালের পণ্যে ভরসা করা যায়।",
      "I have tried many stores, but Roshal is one of the few I can genuinely trust.",
    ),
    name: "Ahmod Al Kamran",
    role: localizedValue("শিক্ষার্থী", "Student"),
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
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
  page: RoshalMarketingPage | null,
  heroSection: RoshalMarketingSection | undefined,
  siteCtaHref: string,
  siteCtaLabel: LocalizedValue,
) {
  const primaryBanner: LandingHeroBanner = {
    image: page?.heroImage || heroSection?.imageUrl || fallbackBanners[0].image,
    title: {
      bn: firstNonEmptyValue(
        [page?.title.bn, heroSection?.title.bn, fallbackBanners[0].title.bn],
        fallbackBanners[0].title.bn,
      ),
      en: firstNonEmptyValue(
        [page?.title.en, heroSection?.title.en, fallbackBanners[0].title.en],
        fallbackBanners[0].title.en,
      ),
    },
    subtitle: {
      bn: firstNonEmptyValue(
        [
          page?.description.bn,
          heroSection?.body.bn,
          fallbackBanners[0].subtitle.bn,
        ],
        fallbackBanners[0].subtitle.bn,
      ),
      en: firstNonEmptyValue(
        [
          page?.description.en,
          heroSection?.body.en,
          fallbackBanners[0].subtitle.en,
        ],
        fallbackBanners[0].subtitle.en,
      ),
    },
    href: heroSection?.ctaHref || siteCtaHref,
    ctaLabel:
      heroSection?.ctaLabel.bn || heroSection?.ctaLabel.en
        ? heroSection.ctaLabel
        : siteCtaLabel,
  };

  if (heroSection?.items.length) {
    return heroSection.items.map((item, index) => {
      const fallbackBanner = fallbackBanners[index % fallbackBanners.length];

      return {
        image:
          item.imageUrl ||
          (index === 0 ? primaryBanner.image : fallbackBanner.image),
        title:
          item.title ||
          item.label ||
          (index === 0 ? primaryBanner.title : fallbackBanner.title),
        subtitle:
          item.body ||
          (index === 0 ? primaryBanner.subtitle : fallbackBanner.subtitle),
        href: item.href || (index === 0 ? primaryBanner.href : siteCtaHref),
        ctaLabel:
          item.label || (index === 0 ? primaryBanner.ctaLabel : siteCtaLabel),
      };
    });
  }

  return [primaryBanner, ...fallbackBanners.slice(1)];
}

function buildCategories(
  section: RoshalMarketingSection | undefined,
  taxonomy: RoshalTaxonomyBundle,
) {
  if (section?.items.length && section.styles.source === "manual") {
    return section.items.map((item, index) => ({
      key: `manual-${index + 1}`,
      name:
        item.title ||
        item.label ||
        localizedValue(`ক্যাটাগরি ${index + 1}`, `Category ${index + 1}`),
      image:
        item.imageUrl || fallbackBanners[index % fallbackBanners.length].image,
      href: item.href || "/products",
    }));
  }

  const homepageCategories = buildHomepageCategories(taxonomy);
  if (homepageCategories.length > 0) {
    return homepageCategories;
  }

  return [
    {
      key: "fallback-oil-ghee",
      name: localizedValue("তেল ও ঘি", "Oil & Ghee"),
      image: "/ghee.jpg",
      href: "/products?category=oil-ghee",
    },
    {
      key: "fallback-honey",
      name: localizedValue("মধু", "Honey"),
      image: "/honey.jpg",
      href: "/products?category=honey",
    },
    {
      key: "fallback-fruit",
      name: localizedValue("ফল ও গুড়", "Fruit & Jaggery"),
      image: "/mango-2.jpg",
      href: "/products?category=jaggery-fruit",
    },
    {
      key: "fallback-dairy",
      name: localizedValue("দুগ্ধজাত", "Dairy"),
      image: "/yogurt-2.jpg",
      href: "/products?category=dairy",
    },
  ];
}

function parseLimit(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function selectProducts(
  products: RoshalProduct[],
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
  const featuredProducts = products.filter((product) => product.isFeatured);

  const baseProducts =
    source === "featured"
      ? featuredProducts.length > 0
        ? featuredProducts
        : products
      : source === "reverse"
        ? [...products].reverse()
        : products;

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
) {
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

function buildBrands(
  section: RoshalMarketingSection | undefined,
  locale: Language,
) {
  if (section?.items.length) {
    return section.items.map((item, index) => ({
      key: `${section.sectionKey}-${index + 1}`,
      name: getLocalizedValue(
        locale,
        item.title ||
          item.label ||
          localizedValue(`ব্র্যান্ড ${index + 1}`, `Brand ${index + 1}`),
      ),
      image:
        item.imageUrl || fallbackBrands[index % fallbackBrands.length].image,
      href: item.href || "/products",
    }));
  }

  return fallbackBrands;
}

function buildTestimonials(section: RoshalMarketingSection | undefined) {
  if (section?.items.length) {
    return section.items.map((item, index) => ({
      key: `${section.sectionKey}-${index + 1}`,
      quote:
        item.body ||
        item.title ||
        fallbackTestimonials[index % fallbackTestimonials.length].quote,
      name:
        item.label?.en ||
        item.label?.bn ||
        fallbackTestimonials[index % fallbackTestimonials.length].name,
      role:
        item.title ||
        fallbackTestimonials[index % fallbackTestimonials.length].role,
      image:
        item.imageUrl ||
        fallbackTestimonials[index % fallbackTestimonials.length].image,
    }));
  }

  return fallbackTestimonials;
}

function buildStats(section: RoshalMarketingSection | undefined) {
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
  const [locale, siteSettings, pageBundle, products, taxonomy] =
    await Promise.all([
      getRoshalLocale(),
      getRoshalSiteSettings(),
      getRoshalPageBundle("home"),
      getRoshalProducts(),
      getRoshalTaxonomy(),
    ]);

  const language = locale as Language;
  const page = pageBundle?.page || null;
  const sections = pageBundle?.sections || [];
  const sectionsByKey = sectionMap(sections);

  const heroSection = sectionsByKey.get("hero");
  const categoriesSection = sectionsByKey.get("landing-categories");
  const featuredSection = sectionsByKey.get("featured-products");
  const topSellersSection = sectionsByKey.get("landing-top-sellers");
  const brandsSection = sectionsByKey.get("landing-brands");
  const newArrivalsSection = sectionsByKey.get("landing-new-arrivals");
  const specialOffersSection = sectionsByKey.get("landing-special-offers");
  const freshSection = sectionsByKey.get("landing-fresh-picks");
  const organicSection = sectionsByKey.get("landing-organic-picks");
  const seasonalSection = sectionsByKey.get("landing-seasonal-picks");
  const statsSection = sectionsByKey.get("landing-stats");
  const testimonialsSection = sectionsByKey.get("landing-testimonials");

  const heroBanners = buildHeroBanners(
    page,
    heroSection,
    siteSettings.primaryCtaHref,
    siteSettings.primaryCtaLabel,
  );
  const categories = buildCategories(categoriesSection, taxonomy);
  const featuredCards = selectProducts(products, featuredSection, {
    source: "featured",
    limit: 8,
  }).map((product, index) => toMarketingProduct(product, language, index));
  const topSellerCards = selectProducts(products, topSellersSection, {
    source: "featured",
    limit: 8,
  }).map((product, index) => toMarketingProduct(product, language, index + 4));
  const newArrivalCards = selectProducts(products, newArrivalsSection, {
    source: "reverse",
    limit: 8,
  }).map((product, index) => toMarketingProduct(product, language, index + 8));
  const freshCards = selectProducts(products, freshSection, {
    source: "all",
    limit: 10,
  }).map((product, index) => toMarketingProduct(product, language, index + 12));
  const organicCards = selectProducts(products, organicSection, {
    source: "featured",
    limit: 10,
  }).map((product, index) => toMarketingProduct(product, language, index + 24));
  const seasonalCards = selectProducts(products, seasonalSection, {
    source: "reverse",
    limit: 10,
  }).map((product, index) => toMarketingProduct(product, language, index + 36));
  const deals = buildDeals(
    specialOffersSection,
    siteSettings.primaryCtaHref,
    siteSettings.primaryCtaLabel,
  );
  const brands = buildBrands(brandsSection, language);
  const testimonials = buildTestimonials(testimonialsSection);
  const stats = buildStats(statsSection);
  const categoriesDescription = sectionDescription(categoriesSection);
  const brandsDescription = sectionDescription(brandsSection);
  const testimonialsDescription = sectionDescription(testimonialsSection);

  return (
    <div className="flex w-full min-w-0 flex-col overflow-hidden">
      <LandingHero banners={heroBanners} language={language} />

      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto space-y-8 px-4 sm:px-6 md:px-8">
          <ScrollReveal>
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {getLocalizedValue(
                  language,
                  sectionTitle(
                    categoriesSection,
                    localizedValue("বিশেষ ক্যাটাগরি", "Featured Categories"),
                  ),
                )}
              </h2>
              {categoriesDescription ? (
                <p className="mx-auto max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                  {getLocalizedValue(language, categoriesDescription)}
                </p>
              ) : null}
            </div>
          </ScrollReveal>

          <HomeCategoryStrip categories={categories} language={language} />
        </div>
      </section>

      <TopSellers
        products={topSellerCards}
        language={language}
        title={sectionTitle(
          topSellersSection,
          localizedValue("শীর্ষ বিক্রিত পণ্য", "Top Selling Products"),
        )}
        description={sectionDescription(topSellersSection)}
      />

      {brands.length > 0 ? (
        <section className="bg-background py-12 md:py-16">
          <div className="container mx-auto space-y-8 px-4 sm:px-6 md:px-8">
            <ScrollReveal>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {getLocalizedValue(
                    language,
                    sectionTitle(
                      brandsSection,
                      localizedValue("আমাদের ব্র্যান্ড", "Our Brands"),
                    ),
                  )}
                </h2>
                {brandsDescription ? (
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                    {getLocalizedValue(language, brandsDescription)}
                  </p>
                ) : null}
              </div>
            </ScrollReveal>

            <HomeBrandStrip brands={brands} />
          </div>
        </section>
      ) : null}

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
          localizedValue("সব নতুন পণ্য দেখুন", "View all new arrivals"),
        )}
      />

      <SpecialOffers
        deals={deals}
        language={language}
        title={sectionTitle(
          specialOffersSection,
          localizedValue("বিশেষ অফার", "Special Offers"),
        )}
        description={sectionDescription(specialOffersSection)}
      />

      <FreshVegetables
        language={language}
        products={freshCards}
        title={sectionTitle(
          freshSection,
          localizedValue("দৈনিক বাজার", "Daily Market Picks"),
        )}
        description={sectionDescription(freshSection)}
        ctaHref={sectionCtaHref(freshSection, "/products")}
        ctaLabel={sectionCtaLabel(
          freshSection,
          localizedValue("সব বাজার দেখুন", "View all market picks"),
        )}
      />

      <OrganicProducts
        language={language}
        products={organicCards}
        title={sectionTitle(
          organicSection,
          localizedValue("অর্গানিক পণ্য", "Organic Certified"),
        )}
        description={sectionDescription(organicSection)}
        ctaHref={sectionCtaHref(organicSection, "/products")}
        ctaLabel={sectionCtaLabel(
          organicSection,
          localizedValue("সব অর্গানিক পণ্য দেখুন", "View all organic items"),
        )}
      />

      <SeasonalProducts
        language={language}
        products={seasonalCards}
        title={sectionTitle(
          seasonalSection,
          localizedValue("মৌসুমি পছন্দ", "Premium Picks"),
        )}
        description={sectionDescription(seasonalSection)}
        ctaHref={sectionCtaHref(seasonalSection, "/products")}
        ctaLabel={sectionCtaLabel(
          seasonalSection,
          localizedValue("সব প্রিমিয়াম পণ্য দেখুন", "View all premium picks"),
        )}
      />

      <FeaturedProducts
        products={featuredCards}
        language={language}
        title={sectionTitle(
          featuredSection,
          localizedValue("শুধু আপনার জন্য", "Just For You"),
        )}
        description={sectionDescription(featuredSection)}
        ctaHref={sectionCtaHref(featuredSection, "/products")}
        ctaLabel={sectionCtaLabel(
          featuredSection,
          localizedValue("সব পণ্য দেখুন", "View all products"),
        )}
      />

      <section className="bg-muted/25 py-12 md:py-16">
        <div className="container mx-auto space-y-8 px-4">
          <ScrollReveal>
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {getLocalizedValue(
                  language,
                  sectionTitle(
                    statsSection,
                    localizedValue("আমাদের পরিসংখ্যান", "Our Numbers"),
                  ),
                )}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, index) => (
              <ScrollReveal
                key={`${stat.number}-${stat.label.en}`}
                delay={index * 0.08}
              >
                <Card className="border-border/70 bg-card shadow-sm">
                  <CardContent className="space-y-2 p-5 text-center md:p-6">
                    <p className="text-2xl font-semibold text-primary md:text-4xl">
                      {stat.number}
                    </p>
                    <p className="text-xs leading-6 text-muted-foreground md:text-sm">
                      {getLocalizedValue(language, stat.label)}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 ? (
        <section className="bg-background py-12 md:py-16">
          <div className="container mx-auto space-y-8 px-4">
            <ScrollReveal>
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {getLocalizedValue(
                    language,
                    sectionTitle(
                      testimonialsSection,
                      localizedValue("গ্রাহকের অভিজ্ঞতা", "What Customers Say"),
                    ),
                  )}
                </h2>
                {testimonialsDescription ? (
                  <p className="mx-auto max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                    {getLocalizedValue(language, testimonialsDescription)}
                  </p>
                ) : null}
              </div>
            </ScrollReveal>

            <HomeTestimonialCarousel
              language={language}
              testimonials={testimonials}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
