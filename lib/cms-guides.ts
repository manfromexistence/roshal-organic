import { localizedValue } from "@/lib/store-locale";
import type { LocalizedValue } from "@/lib/store-types";

export interface RoshalHomeSectionGuide {
  sectionKey: string;
  label: LocalizedValue;
  summary: LocalizedValue;
  contentHint: LocalizedValue;
  stylesHint: LocalizedValue;
  recommendedTypes: string[];
  styleKeys: string[];
}

export interface RoshalMarketingPageGuide {
  slug: string;
  label: LocalizedValue;
  summary: LocalizedValue;
  editingTips: LocalizedValue[];
}

export const roshalHomeSectionGuides: RoshalHomeSectionGuide[] = [
  {
    sectionKey: "hero",
    label: localizedValue("Hero banner", "Hero banner"),
    summary: localizedValue(
      "Controls the rotating landing banners without changing the storefront layout.",
      "Controls the rotating landing banners without changing the storefront layout.",
    ),
    contentHint: localizedValue(
      "Use items with title, body, label, href, and imageUrl for each slide.",
      "Use items with title, body, label, href, and imageUrl for each slide.",
    ),
    stylesHint: localizedValue(
      "Keep CTA routing in the page or site settings. This block is primarily content-driven.",
      "Keep CTA routing in the page or site settings. This block is primarily content-driven.",
    ),
    recommendedTypes: ["hero"],
    styleKeys: [],
  },
  {
    sectionKey: "landing-categories",
    label: localizedValue("Category shortcuts", "Category shortcuts"),
    summary: localizedValue(
      "Feeds the home category cards shown under the hero area.",
      "Feeds the home category cards shown under the hero area.",
    ),
    contentHint: localizedValue(
      "Use items with title, href, and imageUrl for each category card.",
      "Use items with title, href, and imageUrl for each category card.",
    ),
    stylesHint: localizedValue(
      "No special style keys are required. Item order controls the storefront order.",
      "No special style keys are required. Item order controls the storefront order.",
    ),
    recommendedTypes: ["feature-grid"],
    styleKeys: [],
  },
  {
    sectionKey: "featured-products",
    label: localizedValue("Featured products", "Featured products"),
    summary: localizedValue(
      "Controls the first product rail on the homepage.",
      "Controls the first product rail on the homepage.",
    ),
    contentHint: localizedValue(
      "This block usually reads from products instead of items. Use page title/body/CTA fields for copy.",
      "This block usually reads from products instead of items. Use page title/body/CTA fields for copy.",
    ),
    stylesHint: localizedValue(
      'Use stylesJson with source, limit, and offset. Example: {"source":"featured","limit":"8"}.',
      'Use stylesJson with source, limit, and offset. Example: {"source":"featured","limit":"8"}.',
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-top-sellers",
    label: localizedValue("Top sellers", "Top sellers"),
    summary: localizedValue(
      "Usually points to featured or priority products that should sell first.",
      "Usually points to featured or priority products that should sell first.",
    ),
    contentHint: localizedValue(
      "Leave items empty unless you are converting the block to a manual card list.",
      "Leave items empty unless you are converting the block to a manual card list.",
    ),
    stylesHint: localizedValue(
      "Use source=featured for featured catalog items or source=all for the full catalog.",
      "Use source=featured for featured catalog items or source=all for the full catalog.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-new-arrivals",
    label: localizedValue("New arrivals", "New arrivals"),
    summary: localizedValue(
      "Usually surfaces the newest or reverse-sorted products.",
      "Usually surfaces the newest or reverse-sorted products.",
    ),
    contentHint: localizedValue(
      "Use title/body/CTA fields for copy. Product cards are pulled from the catalog.",
      "Use title/body/CTA fields for copy. Product cards are pulled from the catalog.",
    ),
    stylesHint: localizedValue(
      "Use source=reverse plus optional limit and offset to change the slice.",
      "Use source=reverse plus optional limit and offset to change the slice.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-special-offers",
    label: localizedValue("Special offers", "Special offers"),
    summary: localizedValue(
      "Controls the deal cards between the catalog sections.",
      "Controls the deal cards between the catalog sections.",
    ),
    contentHint: localizedValue(
      "Use items with title, body, label, href, imageUrl, and value for the offer badge.",
      "Use items with title, body, label, href, imageUrl, and value for the offer badge.",
    ),
    stylesHint: localizedValue(
      "No required style keys. The items array drives the cards directly.",
      "No required style keys. The items array drives the cards directly.",
    ),
    recommendedTypes: ["feature-grid"],
    styleKeys: [],
  },
  {
    sectionKey: "landing-fresh-picks",
    label: localizedValue("Fresh picks", "Fresh picks"),
    summary: localizedValue(
      "Feeds the first large product grid farther down the homepage.",
      "Feeds the first large product grid farther down the homepage.",
    ),
    contentHint: localizedValue(
      "Use copy fields for heading text. Product rows are sourced from the catalog.",
      "Use copy fields for heading text. Product rows are sourced from the catalog.",
    ),
    stylesHint: localizedValue(
      "Use source=all unless you need a specific featured or reverse slice.",
      "Use source=all unless you need a specific featured or reverse slice.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-organic-picks",
    label: localizedValue("Organic picks", "Organic picks"),
    summary: localizedValue(
      "Feeds the second large product grid and usually highlights featured organic products.",
      "Feeds the second large product grid and usually highlights featured organic products.",
    ),
    contentHint: localizedValue(
      "Use the heading/body fields for section copy and keep items empty for catalog mode.",
      "Use the heading/body fields for section copy and keep items empty for catalog mode.",
    ),
    stylesHint: localizedValue(
      "Use source=featured for curated items. Limit and offset still apply.",
      "Use source=featured for curated items. Limit and offset still apply.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-seasonal-picks",
    label: localizedValue("Seasonal picks", "Seasonal picks"),
    summary: localizedValue(
      "Feeds the last large product grid, usually using reverse or offset catalog slices.",
      "Feeds the last large product grid, usually using reverse or offset catalog slices.",
    ),
    contentHint: localizedValue(
      "Keep content in the heading/body fields. The storefront assigns the visual season labels automatically.",
      "Keep content in the heading/body fields. The storefront assigns the visual season labels automatically.",
    ),
    stylesHint: localizedValue(
      "Use source=reverse with limit and offset to rotate the visible set.",
      "Use source=reverse with limit and offset to rotate the visible set.",
    ),
    recommendedTypes: ["featured-products"],
    styleKeys: ["source", "limit", "offset"],
  },
  {
    sectionKey: "landing-stats",
    label: localizedValue("Trust stats", "Trust stats"),
    summary: localizedValue(
      "Controls the compact trust metrics shown near the bottom of the landing page.",
      "Controls the compact trust metrics shown near the bottom of the landing page.",
    ),
    contentHint: localizedValue(
      "Use items with label/title plus value for each stat tile.",
      "Use items with label/title plus value for each stat tile.",
    ),
    stylesHint: localizedValue(
      "No special style keys are required for this block.",
      "No special style keys are required for this block.",
    ),
    recommendedTypes: ["feature-grid"],
    styleKeys: [],
  },
];

export const roshalMarketingPageGuides: RoshalMarketingPageGuide[] = [
  {
    slug: "about",
    label: localizedValue("About page", "About page"),
    summary: localizedValue(
      "ব্র্যান্ড পরিচিতি, সংগ্রহের গল্প, মান নিয়ন্ত্রণ এবং গ্রাহক আস্থার ব্লকগুলো এখানে সাজান।",
      "Use this page for the brand intro, sourcing story, quality standards, and customer trust signals.",
    ),
    editingTips: [
      localizedValue(
        "উপরে একটি story/hero ব্লক রাখুন, তারপর commitments বা quality feature-grid যোগ করুন।",
        "Lead with a story or hero block, then follow it with commitments and quality feature grids.",
      ),
      localizedValue(
        "সোর্সিং, প্যাকেজিং, মৌসুমি সংগ্রহ এবং পরিবার-কেন্দ্রিক আস্থার পয়েন্টগুলো আলাদা কার্ডে ভাঙুন।",
        "Break sourcing, packaging, seasonal freshness, and family trust points into separate cards.",
      ),
      localizedValue(
        "Company Information বা Contact পেজে যাওয়ার CTA রাখলে this page থেকে business trust flow স্পষ্ট হয়।",
        "A CTA to Company Information or Contact keeps the trust journey clear from this page.",
      ),
    ],
  },
  {
    slug: "contact",
    label: localizedValue("Contact page", "Contact page"),
    summary: localizedValue(
      "সাপোর্ট, পাইকারি, অর্ডার আপডেট এবং ব্যবসায়িক যোগাযোগের সব দ্রুত পথ এই পেজে রাখুন।",
      "Use this page to surface support, wholesale, order-update, and business-contact paths clearly.",
    ),
    editingTips: [
      localizedValue(
        "Contact cards-এ ফোন, WhatsApp, email, ঠিকানা এবং service hour রাখুন।",
        "Use contact cards for phone, WhatsApp, email, address, and service hours.",
      ),
      localizedValue(
        "একটি help-topics grid রাখুন যাতে retail order, wholesale, gifting, delivery follow-up আলাদা দেখা যায়।",
        "Add a help-topics grid so retail orders, wholesale, gifting, and delivery follow-up each have their own block.",
      ),
      localizedValue(
        "Response promise বা service-process story block রাখলে পেজটি বেশি বিশ্বাসযোগ্য দেখায়।",
        "A response-promise or service-process story block makes the page feel more credible.",
      ),
    ],
  },
  {
    slug: "support-center",
    label: localizedValue("Support Center", "Support Center"),
    summary: localizedValue(
      "টপিক, সমাধান-ধাপ এবং যোগাযোগ চ্যানেল – তিনটি স্তরেই সাপোর্ট ফ্লো সাজান।",
      "Structure this page around support topics, resolution steps, and live contact channels.",
    ),
    editingTips: [
      localizedValue(
        "একটি topics grid, একটি resolution flow grid এবং একটি contact-cards block রাখুন।",
        "Use one topics grid, one resolution-flow grid, and one contact-card block.",
      ),
      localizedValue(
        "FAQ, Payment, Happy Return বা Shipping-এর মতো deeper help routes-এ CTA দিন।",
        "Link out to deeper help routes like FAQ, Payment, Happy Return, or Shipping.",
      ),
      localizedValue(
        "Order tracking বা WhatsApp block আলাদা card হিসেবে রাখলে দ্রুত action পাওয়া যায়।",
        "Keep order tracking or WhatsApp as dedicated cards so customers can act quickly.",
      ),
    ],
  },
  {
    slug: "payment",
    label: localizedValue("Payment page", "Payment page"),
    summary: localizedValue(
      "Cash on Delivery, card gateway, bKash এবং Nagad reference flow-এর ব্যাখ্যা এখানে দিন।",
      "Use this page to explain Cash on Delivery, card gateway, bKash, and Nagad reference flows.",
    ),
    editingTips: [
      localizedValue(
        "একটি overview grid, একটি wallet reference checklist, এবং একটি support CTA block রাখুন।",
        "Use an overview grid, a wallet-reference checklist, and a support CTA block.",
      ),
      localizedValue(
        "Cash on Delivery, Card, bKash এবং Nagad – এগুলো আলাদা item হিসেবে রাখলে ক্লায়েন্ট update করতে সহজ হয়।",
        "Keep Cash on Delivery, Card, bKash, and Nagad as separate items so admins can update them clearly.",
      ),
      localizedValue(
        "Checkout CTA এবং support CTA দুইটিই রাখুন।",
        "Keep both a checkout CTA and a support CTA visible.",
      ),
    ],
  },
  {
    slug: "shipping",
    label: localizedValue("Shipping page", "Shipping page"),
    summary: localizedValue(
      "ডেলিভারি জোন, সময়, চার্জ এবং গ্রহণের নির্দেশনা এই পেজে পরিষ্কারভাবে দেখান।",
      "Use this page to explain delivery zones, timing, charges, and receiving guidance.",
    ),
    editingTips: [
      localizedValue(
        "ডেলিভারি zone cards-এ fee এবং coverage area আলাদা value হিসেবে দিন।",
        "Use delivery-zone cards with separate fee and coverage values.",
      ),
      localizedValue(
        "Receiving checklist বা dispatch story block যোগ করলে logistics flow বেশি professional দেখায়।",
        "A receiving checklist or dispatch story block makes the logistics flow feel more professional.",
      ),
      localizedValue(
        "Order tracking CTA রাখুন যাতে shipping page থেকে next action পাওয়া যায়।",
        "Keep an order-tracking CTA so the shipping page leads to the next action.",
      ),
    ],
  },
  {
    slug: "faq",
    label: localizedValue("FAQ page", "FAQ page"),
    summary: localizedValue(
      "সবচেয়ে সাধারণ প্রশ্ন, self-service links এবং escalation channel এই পেজে রাখুন।",
      "Use this page for the most common questions, self-service links, and escalation channels.",
    ),
    editingTips: [
      localizedValue(
        "প্রশ্নগুলো ছোট card-এ রাখুন এবং প্রয়োজন হলে support বা policy page-এ deep link দিন।",
        "Keep questions in short cards and deep-link to support or policy pages when needed.",
      ),
      localizedValue(
        "Order tracking, payment, returns, delivery এবং account flow কভার করুন।",
        "Cover order tracking, payment, returns, delivery, and account flows.",
      ),
      localizedValue(
        "শেষে contact/support block রাখলে unresolved প্রশ্নের জন্য fallback থাকে।",
        "End with a contact or support block so unresolved questions still have a fallback path.",
      ),
    ],
  },
  {
    slug: "privacy-policy",
    label: localizedValue("Privacy Policy", "Privacy Policy"),
    summary: localizedValue(
      "তথ্য সংগ্রহ, ব্যবহার, সুরক্ষা, শেয়ারিং এবং গ্রাহকের অধিকার – সব অংশই স্পষ্ট করুন।",
      "Use this page to explain data collection, usage, protection, sharing, and customer rights clearly.",
    ),
    editingTips: [
      localizedValue(
        "একটি overview grid-এর পরে rights/contact cards এবং security story block যোগ করুন।",
        "Follow the overview grid with rights/contact cards and a security-focused story block.",
      ),
      localizedValue(
        "Order, delivery, payment verification, support messages – কোন data কোথায় লাগে তা আলাদা করে বলুন।",
        "Explain separately how order, delivery, payment-verification, and support data is used.",
      ),
      localizedValue(
        "Contact or support CTA রাখুন যাতে users data-related request পাঠাতে পারে।",
        "Keep a contact or support CTA so users know where to send data-related requests.",
      ),
    ],
  },
  {
    slug: "terms-and-conditions",
    label: localizedValue("Terms page", "Terms page"),
    summary: localizedValue(
      "অর্ডার, পেমেন্ট, ডেলিভারি, cancellation এবং storefront usage rules এখানে সংক্ষেপে সাজান।",
      "Use this page to summarize order, payment, delivery, cancellation, and storefront usage rules.",
    ),
    editingTips: [
      localizedValue(
        "একটি policy overview grid এবং একটি responsibilities বা restrictions block রাখুন।",
        "Use a policy overview grid plus a responsibilities or restrictions block.",
      ),
      localizedValue(
        "Support Center, Payment বা Shipping page-এ reference CTA দিলে rule flow clearer হয়।",
        "Linking to Support Center, Payment, or Shipping keeps the policy flow clearer.",
      ),
      localizedValue(
        "জটিল legal copy-এর বদলে readable short blocks ব্যবহার করুন।",
        "Prefer readable short blocks over dense legal paragraphs.",
      ),
    ],
  },
];

export function getRoshalHomeSectionGuide(sectionKey: string) {
  return (
    roshalHomeSectionGuides.find((guide) => guide.sectionKey === sectionKey) ||
    null
  );
}

export function getRoshalMarketingPageGuide(slug: string) {
  return roshalMarketingPageGuides.find((guide) => guide.slug === slug) || null;
}
