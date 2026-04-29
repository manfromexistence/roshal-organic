import { CheckoutPageClient } from "@/components/storefront/checkout-page-client";
import { requireRoshalUser } from "@/lib/store-auth";
import {
  getRoshalPageBundle,
  getRoshalPaymentSettings,
  getRoshalProducts,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { localizedValue } from "@/lib/store-locale";
import { getRoshalPaymentGatewaySummary } from "@/lib/store-payments";
import type { LocalizedValue, RoshalMarketingSection } from "@/lib/store-types";

interface CheckoutTestimonial {
  key: string;
  quote: LocalizedValue;
  name: string;
  role: LocalizedValue;
  image?: string;
}

const fallbackTestimonials: CheckoutTestimonial[] = [
  {
    key: "checkout-tumpa",
    quote: localizedValue(
      "ডেলিভারির আগে কল কনফার্ম করে এবং প্রুফ দেখে অর্ডার ধরে রাখে, তাই আমার কাছে চেকআউটটা ভরসার লাগে।",
      "They confirm the order before delivery and verify the payment proof, so the checkout feels trustworthy.",
    ),
    name: "Fariha Akter Tumpa",
    role: localizedValue("উদ্যোক্তা", "Entrepreneur"),
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    key: "checkout-abir",
    quote: localizedValue(
      "লোকেশন অনুযায়ী ডেলিভারি চার্জ দেখিয়ে দেয়, তাই অর্ডার দেওয়ার সময় হিসাব পরিষ্কার থাকে।",
      "The checkout shows delivery charges based on location, so the final amount stays clear before ordering.",
    ),
    name: "Shahriar Khan Abir",
    role: localizedValue("সার্ভিস হোল্ডার", "Service holder"),
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    key: "checkout-kamran",
    quote: localizedValue(
      "বিকাশের স্ক্রিনশট দিয়ে অর্ডার করেছি, তারপর অ্যাডমিন ভেরিফাই করে আপডেট দিয়েছে। প্রসেসটা সহজ ছিল।",
      "I ordered with a bKash screenshot and the admin verified it quickly. The process felt simple and clear.",
    ),
    name: "Ahmod Al Kamran",
    role: localizedValue("শিক্ষার্থী", "Student"),
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
];

function buildCheckoutTestimonials(
  section: RoshalMarketingSection | undefined,
): CheckoutTestimonial[] {
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

export default async function CheckoutPage() {
  const [
    locale,
    pageBundle,
    sessionUser,
    paymentSettings,
    products,
    gatewaySummary,
    siteSettings,
  ] = await Promise.all([
    getRoshalLocale(),
    getRoshalPageBundle("home"),
    requireRoshalUser(),
    getRoshalPaymentSettings(),
    getRoshalProducts(),
    getRoshalPaymentGatewaySummary(),
    getRoshalSiteSettings(),
  ]);
  const testimonials = buildCheckoutTestimonials(
    pageBundle?.sections.find(
      (section) => section.sectionKey === "landing-testimonials",
    ),
  );

  return (
    <CheckoutPageClient
      deliveryZones={siteSettings.deliveryZones}
      gatewaySummary={gatewaySummary}
      locale={locale}
      paymentSettings={paymentSettings}
      products={products}
      siteSupport={{
        address: siteSettings.address,
        brandName: siteSettings.brandName,
        contactEmail: siteSettings.contactEmail,
        contactPhone: siteSettings.contactPhone,
        manualReviewNotice: paymentSettings.manualReviewNotice,
        supportMessage: paymentSettings.supportMessage,
        whatsappPhone: siteSettings.whatsappPhone,
      }}
      testimonials={testimonials}
      user={{
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        phone: sessionUser.phone || "",
        defaultAddress: sessionUser.defaultAddress || "",
      }}
    />
  );
}
