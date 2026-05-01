import { localizedValue } from "@/lib/store-locale";
import type {
  RoshalMarketingPage,
  RoshalMarketingSection,
} from "@/lib/store-types";

export const defaultRoshalExtendedPages: RoshalMarketingPage[] = [
  {
    id: "page-company-information",
    slug: "company-information",
    navigationLabel: localizedValue("কোম্পানি তথ্য", "Company Information"),
    title: localizedValue("কোম্পানি তথ্য", "Company Information"),
    description: localizedValue(
      "Roshal Organic-এর ব্যবসা, প্রতিশ্রুতি, যোগাযোগ এবং সাপোর্ট কাঠামো সম্পর্কে জানুন।",
      "Learn more about Roshal Organic's business, commitments, contact channels, and support structure.",
    ),
    heroImage: "/brand-story.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-support-center",
    slug: "support-center",
    navigationLabel: localizedValue("সাপোর্ট সেন্টার", "Support Center"),
    title: localizedValue("সাপোর্ট সেন্টার", "Support Center"),
    description: localizedValue(
      "অর্ডার, ডেলিভারি, পেমেন্ট বা অ্যাকাউন্ট-সংক্রান্ত সহায়তার জন্য আমাদের সাপোর্ট সেন্টারে আসুন।",
      "Reach our support center for help with orders, deliveries, payments, or your account.",
    ),
    heroImage: "/newsletter.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-how-to-order",
    slug: "how-to-order",
    navigationLabel: localizedValue("কিভাবে অর্ডার করবেন", "How to Order"),
    title: localizedValue("কিভাবে অর্ডার করবেন", "How to Order"),
    description: localizedValue(
      "পণ্য বাছাই থেকে চেকআউট এবং পেমেন্ট কনফার্মেশন পর্যন্ত পুরো অর্ডার প্রক্রিয়া বুঝে নিন।",
      "Understand the full order flow from product selection to checkout and payment confirmation.",
    ),
    heroImage: "/special-offer.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-faq",
    slug: "faq",
    navigationLabel: localizedValue("প্রশ্নোত্তর", "FAQ"),
    title: localizedValue("সাধারণ প্রশ্নোত্তর", "Frequently Asked Questions"),
    description: localizedValue(
      "অর্ডার, ডেলিভারি, রিটার্ন, পেমেন্ট এবং অ্যাকাউন্ট সংক্রান্ত সাধারণ প্রশ্নের উত্তর।",
      "Answers to common questions about orders, delivery, returns, payments, and accounts.",
    ),
    heroImage: "/brand-story.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-payment",
    slug: "payment",
    navigationLabel: localizedValue("পেমেন্ট", "Payment"),
    title: localizedValue("পেমেন্ট গাইড", "Payment Guide"),
    description: localizedValue(
      "Cash on Delivery, কার্ড, bKash এবং Nagad পেমেন্ট সম্পর্কে জানুন।",
      "Understand Cash on Delivery, card, bKash, and Nagad payment flows.",
    ),
    heroImage: "/oil-2.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-shipping",
    slug: "shipping",
    navigationLabel: localizedValue("শিপিং", "Shipping"),
    title: localizedValue("শিপিং ও ডেলিভারি", "Shipping & Delivery"),
    description: localizedValue(
      "ডেলিভারি সময়, এলাকা, চার্জ এবং অর্ডার গ্রহণের নির্দেশনা দেখুন।",
      "Review delivery timelines, coverage areas, charges, and order receiving guidance.",
    ),
    heroImage: "/special-offer.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-happy-return",
    slug: "happy-return",
    navigationLabel: localizedValue("হ্যাপি রিটার্ন", "Happy Return"),
    title: localizedValue("হ্যাপি রিটার্ন", "Happy Return"),
    description: localizedValue(
      "ভুল, ক্ষতিগ্রস্ত বা অমিল পণ্য হলে কীভাবে দ্রুত রিটার্ন রিকোয়েস্ট করবেন তা জানুন।",
      "Learn how to request a quick return if an item arrives damaged, incorrect, or mismatched.",
    ),
    heroImage: "/newsletter.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-refund-policy",
    slug: "refund-policy",
    navigationLabel: localizedValue("রিফান্ড নীতি", "Refund Policy"),
    title: localizedValue("রিফান্ড নীতি", "Refund Policy"),
    description: localizedValue(
      "রিফান্ড অনুমোদন, যাচাই এবং রিফান্ড প্রসেসিং-এর ধাপগুলো দেখুন।",
      "Review approval, verification, and processing steps for refunds.",
    ),
    heroImage: "/deal-3.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-cancellation",
    slug: "cancellation",
    navigationLabel: localizedValue("ক্যানসেলেশন", "Cancellation"),
    title: localizedValue("অর্ডার ক্যানসেলেশন", "Order Cancellation"),
    description: localizedValue(
      "অর্ডার ডিসপ্যাচের আগে কীভাবে পরিবর্তন বা বাতিলের অনুরোধ করবেন তা জানুন।",
      "Learn how to request changes or cancellation before an order is dispatched.",
    ),
    heroImage: "/newsletter.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-roshal-stories",
    slug: "roshal-stories",
    navigationLabel: localizedValue("রোশাল স্টোরিজ", "Roshal Stories"),
    title: localizedValue("রোশাল স্টোরিজ", "Roshal Stories"),
    description: localizedValue(
      "ব্র্যান্ডের গল্প, সংগ্রহ, মৌসুমি ক্যাম্পেইন এবং গ্রাহকের আস্থার গল্পগুলো এখানে সাজান।",
      "Share brand stories, sourcing highlights, seasonal campaigns, and customer trust signals here.",
    ),
    heroImage: "/brand-story.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-terms-and-conditions",
    slug: "terms-and-conditions",
    navigationLabel: localizedValue("শর্তাবলী", "Terms & Conditions"),
    title: localizedValue("শর্তাবলী", "Terms & Conditions"),
    description: localizedValue(
      "অর্ডার, পেমেন্ট, ডেলিভারি, রিটার্ন এবং স্টোরফ্রন্ট ব্যবহারের নীতিগুলো এক জায়গায় রাখুন।",
      "Keep order, payment, delivery, return, and storefront usage rules in one place.",
    ),
    heroImage: "/special-offer.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-privacy-policy",
    slug: "privacy-policy",
    navigationLabel: localizedValue("প্রাইভেসি পলিসি", "Privacy Policy"),
    title: localizedValue("প্রাইভেসি পলিসি", "Privacy Policy"),
    description: localizedValue(
      "গ্রাহকের তথ্য কীভাবে সংগ্রহ, ব্যবহার, সংরক্ষণ এবং সুরক্ষিত রাখা হয় তা এখানে ব্যাখ্যা করুন।",
      "Explain how customer data is collected, used, stored, and protected.",
    ),
    heroImage: "/newsletter.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-careers",
    slug: "careers",
    navigationLabel: localizedValue("ক্যারিয়ার", "Careers"),
    title: localizedValue("রোশাল অর্গানিকে ক্যারিয়ার", "Careers at Roshal Organic"),
    description: localizedValue(
      "দল, কাজের ধরন, এবং ভবিষ্যৎ ভূমিকার জন্য কোথায় যোগাযোগ করতে হবে তা এখানে দেখান।",
      "Outline the team, work style, and where future applicants should reach out.",
    ),
    heroImage: "/brand-story.jpg",
    status: "published",
    showInNavigation: false,
  },
  {
    id: "page-pre-order",
    slug: "pre-order",
    navigationLabel: localizedValue("প্রি-অর্ডার", "Pre-Order"),
    title: localizedValue("প্রি-অর্ডার গাইড", "Pre-Order Guide"),
    description: localizedValue(
      "প্রি-অর্ডার পণ্য, অগ্রিম পেমেন্ট, ডেলিভারি প্রত্যাশা এবং ক্যানসেলেশন নিয়ম এখানে রাখুন।",
      "Keep pre-order product rules, advance payment, delivery expectations, and cancellation guidance here.",
    ),
    heroImage: "/special-offer.jpg",
    status: "published",
    showInNavigation: false,
  },
];

const defaultRoshalExtendedPageEnhancements: RoshalMarketingSection[] = [
  {
    id: "section-support-center-resolution-flow",
    pageId: "page-support-center",
    sectionKey: "support-resolution-flow",
    type: "feature-grid",
    sortOrder: 2,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("রেজোলিউশন ফ্লো", "Resolution flow"),
    title: localizedValue(
      "সাপোর্ট রিকোয়েস্ট কীভাবে সমাধান হয়",
      "How a support request gets resolved",
    ),
    body: localizedValue(
      "গ্রাহক যেন বুঝতে পারেন একটি support issue submit করার পর কী কী ধাপ হয়।",
      "Show customers exactly what happens after they submit a support issue.",
    ),
    ctaLabel: localizedValue("Contact page", "Contact page"),
    ctaHref: "/contact",
    imageUrl: "",
    items: [
      {
        title: localizedValue("১. issue record", "1. Issue recorded"),
        body: localizedValue(
          "অর্ডার নম্বর, সমস্যা, payment reference বা receiving note সংগ্রহ করা হয়।",
          "The order number, issue summary, payment reference, or receiving note is collected first.",
        ),
      },
      {
        title: localizedValue("২. টিম রিভিউ", "2. Team review"),
        body: localizedValue(
          "support, payment review বা delivery coordination – যে টিম দরকার তারা case দেখে।",
          "Support, payment review, or delivery coordination teams review the case together when needed.",
        ),
      },
      {
        title: localizedValue("৩. সমাধান বা আপডেট", "3. Resolution or update"),
        body: localizedValue(
          "গ্রাহককে next step, replacement, refund, cancellation বা tracking update জানানো হয়।",
          "The customer receives the next step, replacement, refund, cancellation, or tracking update.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  {
    id: "section-support-center-service-story",
    pageId: "page-support-center",
    sectionKey: "support-service-story",
    type: "story",
    sortOrder: 0,
    layout: "split",
    variant: "muted",
    isEnabled: true,
    eyebrow: localizedValue("গ্রাহকসেবা", "Customer care"),
    title: localizedValue(
      "একটি জায়গা থেকে order, payment, delivery এবং returns coordination",
      "One support surface for orders, payments, delivery, and returns",
    ),
    body: localizedValue(
      "Roshal Organic support experience এমনভাবে সাজানো যে checkout-এর পরে customer journey ভেঙে না গিয়ে একটানা থাকে। তাই অর্ডার স্ট্যাটাস, payment review, delivery follow-up এবং return discussion আলাদা আলাদা টিমে আটকে না থেকে একটি coordinated flow-তে কাজ করে।",
      "The Roshal Organic support experience is designed so the post-checkout journey stays continuous. Order status, payment review, delivery follow-up, and return discussions are coordinated instead of feeling split across disconnected teams.",
    ),
    ctaLabel: localizedValue("Order Tracking", "Order Tracking"),
    ctaHref: "/orders",
    imageUrl: "/healthy-food.jpg",
    items: [],
    styles: {
      emphasis: "editorial",
    },
  },
  {
    id: "section-faq-escalation-routes",
    pageId: "page-faq",
    sectionKey: "faq-escalation-routes",
    type: "contact-cards",
    sortOrder: 1,
    layout: "grid",
    variant: "muted",
    isEnabled: true,
    eyebrow: localizedValue("পরবর্তী ধাপ", "Still need help?"),
    title: localizedValue(
      "উত্তর না পেলে যে রাস্তাগুলো ব্যবহার করবেন",
      "Where to go when the FAQ is not enough",
    ),
    body: localizedValue(
      "self-service page-এর পরে support escalation path স্পষ্ট রাখুন।",
      "Keep the escalation path clear after the self-service guidance ends.",
    ),
    ctaLabel: localizedValue("Support Center", "Support Center"),
    ctaHref: "/support-center",
    imageUrl: "",
    items: [
      {
        label: localizedValue("Payment", "Payment"),
        title: localizedValue("Payment Guide", "Payment Guide"),
        body: localizedValue(
          "wallet payment, transaction ID, admin verification বা gateway flow বুঝতে।",
          "For wallet payment, transaction ID, admin verification, or gateway guidance.",
        ),
        href: "/payment",
      },
      {
        label: localizedValue("Shipping", "Shipping"),
        title: localizedValue("Shipping & Delivery", "Shipping & Delivery"),
        body: localizedValue(
          "delivery fee, location coverage, dispatch timing বা receiving note-এর জন্য।",
          "For delivery fees, coverage, dispatch timing, or receiving guidance.",
        ),
        href: "/shipping",
      },
      {
        label: localizedValue("Returns", "Returns"),
        title: localizedValue("Happy Return", "Happy Return"),
        body: localizedValue(
          "damaged, wrong, incomplete বা mismatched item issue-এর জন্য।",
          "For damaged, wrong, incomplete, or mismatched item cases.",
        ),
        href: "/happy-return",
      },
      {
        label: localizedValue("Live Support", "Live Support"),
        title: localizedValue("Contact Us", "Contact Us"),
        body: localizedValue(
          "যদি issue order-specific হয়, phone/WhatsApp/email route ব্যবহার করুন।",
          "Use phone, WhatsApp, or email when the issue is specific to a live order.",
        ),
        href: "/contact",
      },
    ],
    styles: {
      columns: "2",
    },
  },
  {
    id: "section-payment-reference-checklist",
    pageId: "page-payment",
    sectionKey: "payment-reference-checklist",
    type: "contact-cards",
    sortOrder: 1,
    layout: "grid",
    variant: "soft",
    isEnabled: true,
    eyebrow: localizedValue("ম্যানুয়াল ভেরিফিকেশন", "Manual verification"),
    title: localizedValue(
      "wallet payment দিলে কী কী প্রস্তুত রাখবেন",
      "What to keep ready for wallet-payment verification",
    ),
    body: localizedValue(
      "bKash বা Nagad payment-এর ক্ষেত্রে admin review দ্রুত করতে প্রয়োজনীয় তথ্যগুলো আলাদা করে দেখান।",
      "Show the exact details customers should keep ready for faster admin review on bKash or Nagad payments.",
    ),
    ctaLabel: localizedValue("Checkout", "Checkout"),
    ctaHref: "/checkout",
    imageUrl: "",
    items: [
      {
        label: localizedValue("Transaction ID", "Transaction ID"),
        title: localizedValue("Reference required", "Reference required"),
        body: localizedValue(
          "লেনদেনের unique transaction ID বা reference number দিন।",
          "Provide the unique transaction ID or wallet reference number.",
        ),
      },
      {
        label: localizedValue("Sender number", "Sender number"),
        title: localizedValue("Used wallet number", "Used wallet number"),
        body: localizedValue(
          "যে নম্বর থেকে payment করা হয়েছে সেটি পরিষ্কারভাবে লিখুন।",
          "Share the number from which the payment was sent.",
        ),
      },
      {
        label: localizedValue("Amount", "Amount"),
        title: localizedValue("Paid amount", "Paid amount"),
        body: localizedValue(
          "payment amount, transaction ID এবং sender number প্রস্তুত রাখুন।",
          "Keep the paid amount available so support can match it with the order total.",
        ),
      },
      {
        label: localizedValue("Order number", "Order number"),
        title: localizedValue("Match the order", "Match the order"),
        body: localizedValue(
          "payment reference যেন সঠিক order-এর সঙ্গে review করা যায় সেই তথ্য দিন।",
          "Include enough detail so the payment reference can be matched to the correct order.",
        ),
      },
    ],
    styles: {
      columns: "2",
    },
  },
  {
    id: "section-payment-review-steps",
    pageId: "page-payment",
    sectionKey: "payment-review-steps",
    type: "feature-grid",
    sortOrder: 2,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("রিভিউ ধাপ", "Review steps"),
    title: localizedValue(
      "ম্যানুয়াল payment submit করার পর কী হয়",
      "What happens after a manual payment is submitted",
    ),
    body: localizedValue(
      "checkout experience-এর পরে verification flow স্পষ্ট করে দিন।",
      "Clarify the verification flow that begins right after checkout.",
    ),
    ctaLabel: localizedValue("Support Center", "Support Center"),
    ctaHref: "/support-center",
    imageUrl: "",
    items: [
      {
        title: localizedValue("অর্ডার তৈরি", "Order created"),
        body: localizedValue(
          "customer order submit করলে payment-review status-এ order সংরক্ষণ হয়।",
          "After checkout, the order is saved in payment-review status.",
        ),
      },
      {
        title: localizedValue("অ্যাডমিন যাচাই", "Admin verification"),
        body: localizedValue(
          "dashboard থেকে transaction ID, sender number, amount এবং order data মিলিয়ে দেখা হয়।",
          "The admin reviews the transaction ID, sender number, amount, and order details from the dashboard.",
        ),
      },
      {
        title: localizedValue("কনফার্মেশন", "Confirmation"),
        body: localizedValue(
          "যাচাই শেষ হলে order paid বা processing অবস্থায় এগোয়।",
          "Once verified, the order moves forward as paid or processing.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  {
    id: "section-shipping-zone-overview",
    pageId: "page-shipping",
    sectionKey: "shipping-zone-overview",
    type: "contact-cards",
    sortOrder: 1,
    layout: "grid",
    variant: "soft",
    isEnabled: true,
    eyebrow: localizedValue("ডেলিভারি জোন", "Delivery zones"),
    title: localizedValue(
      "লোকেশনভিত্তিক ডেলিভারি চার্জ",
      "Location-based delivery fees",
    ),
    body: localizedValue(
      "ড্যাশবোর্ড থেকে zone update করা যায়, তাই এখানে client-facing summary দেখান।",
      "These zones are dashboard-managed, so use this page to show the client-facing summary.",
    ),
    ctaLabel: localizedValue("Checkout", "Checkout"),
    ctaHref: "/checkout",
    imageUrl: "",
    items: [
      {
        label: localizedValue("Inside Dhaka", "Inside Dhaka"),
        title: localizedValue("ঢাকার ভেতরে", "Within Dhaka"),
        value: "BDT 60",
        body: localizedValue(
          "শহরের ভেতরের delivery-এর জন্য দ্রুততম standard charge।",
          "The standard fee for the fastest inner-city delivery zone.",
        ),
      },
      {
        label: localizedValue("Nearby Districts", "Nearby Districts"),
        title: localizedValue("আশেপাশের জেলা", "Nearby districts"),
        value: "BDT 100",
        body: localizedValue(
          "Gazipur, Narayanganj, Savar বা কাছাকাছি coverage-এর জন্য।",
          "For Gazipur, Narayanganj, Savar, and nearby district coverage.",
        ),
      },
      {
        label: localizedValue("Nationwide", "Nationwide"),
        title: localizedValue("সারা বাংলাদেশ", "Nationwide"),
        value: "BDT 130",
        body: localizedValue(
          "বাকী দেশের delivery request-এর জন্য default nationwide fee।",
          "The default nationwide fee for delivery requests across the country.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  {
    id: "section-shipping-process-story",
    pageId: "page-shipping",
    sectionKey: "shipping-process-story",
    type: "story",
    sortOrder: 0,
    layout: "split",
    variant: "muted",
    isEnabled: true,
    eyebrow: localizedValue("ডিসপ্যাচ থেকে রিসিভ", "Dispatch to delivery"),
    title: localizedValue(
      "যাচাই, প্যাকেজিং এবং লোকেশন মিলিয়ে ডেলিভারি সমন্বয় করা হয়",
      "Delivery is coordinated around verification, packaging, and location matching",
    ),
    body: localizedValue(
      "Roshal Organic checkout-এর পরে address match, payment review, stock confirmation এবং delivery zone অনুযায়ী dispatch planning করে। এজন্য delivery timing location ও payment status-এর ওপর নির্ভর করে পরিবর্তিত হতে পারে।",
      "After checkout, Roshal Organic coordinates address matching, payment review, stock confirmation, and dispatch planning based on the delivery zone. That means delivery timing can shift based on location and payment status.",
    ),
    ctaLabel: localizedValue("Track orders", "Track orders"),
    ctaHref: "/orders",
    imageUrl: "/packaging.jpg",
    items: [],
    styles: {
      emphasis: "balanced",
    },
  },
  {
    id: "section-terms-responsibilities",
    pageId: "page-terms-and-conditions",
    sectionKey: "terms-responsibilities",
    type: "feature-grid",
    sortOrder: 1,
    layout: "grid",
    variant: "muted",
    isEnabled: true,
    eyebrow: localizedValue("ব্যবহারের নিয়ম", "Usage responsibilities"),
    title: localizedValue(
      "গ্রাহক ও স্টোরফ্রন্ট ব্যবহারের মৌলিক দায়িত্ব",
      "Core customer and storefront responsibilities",
    ),
    body: localizedValue(
      "পলিসির পাশাপাশি সহজে পড়া যায় এমন responsibility blocks রাখুন।",
      "Keep the policy readable by summarizing responsibilities in practical blocks.",
    ),
    ctaLabel: localizedValue("Privacy Policy", "Privacy Policy"),
    ctaHref: "/privacy-policy",
    imageUrl: "",
    items: [
      {
        title: localizedValue("সঠিক তথ্য দিন", "Provide accurate details"),
        body: localizedValue(
          "customer name, phone, address এবং payment reference সঠিক হওয়া জরুরি।",
          "Customer name, phone, address, and payment references should be accurate.",
        ),
      },
      {
        title: localizedValue("রিসিভের সময় যাচাই", "Check at delivery"),
        body: localizedValue(
          "পণ্য, quantity এবং packaging issue থাকলে ডেলিভারির সময়ই জানানো ভালো।",
          "It is best to raise product, quantity, or packaging issues when receiving the order.",
        ),
      },
      {
        title: localizedValue("ওয়ালেট রেফারেন্স", "Wallet reference"),
        body: localizedValue(
          "ম্যানুয়াল wallet payment-এর ক্ষেত্রে transaction ID ও sender number দিতে হবে।",
          "Manual wallet payments require the transaction ID and sender number.",
        ),
      },
      {
        title: localizedValue("সাপোর্টের সঙ্গে সমন্বয়", "Coordinate with support"),
        body: localizedValue(
          "order-specific সমস্যা হলে dashboard status-এর পাশাপাশি support channel ব্যবহার করুন।",
          "For order-specific issues, use support channels in addition to checking dashboard status.",
        ),
      },
    ],
    styles: {
      columns: "2",
    },
  },
  {
    id: "section-privacy-rights",
    pageId: "page-privacy-policy",
    sectionKey: "privacy-rights",
    type: "contact-cards",
    sortOrder: 2,
    layout: "grid",
    variant: "soft",
    isEnabled: true,
    eyebrow: localizedValue("ডাটা-সংক্রান্ত অনুরোধ", "Data requests"),
    title: localizedValue(
      "তথ্য-সংক্রান্ত বিষয়ে কোথায় যোগাযোগ করবেন",
      "Where to send privacy-related requests",
    ),
    body: localizedValue(
      "গ্রাহক যেন বুঝতে পারেন profile data, order record বা language preference বিষয়ে কাকে জানাতে হবে।",
      "Make it clear where customers should reach out about profile data, order records, or language preferences.",
    ),
    ctaLabel: localizedValue("Contact page", "Contact page"),
    ctaHref: "/contact",
    imageUrl: "",
    items: [
      {
        label: localizedValue("Profile updates", "Profile updates"),
        title: localizedValue(
          "Account and profile corrections",
          "Account and profile corrections",
        ),
        body: localizedValue(
          "নাম, ফোন, email বা address correction-এর জন্য support-এ যোগাযোগ করুন।",
          "Contact support for name, phone, email, or address corrections.",
        ),
        href: "/contact",
      },
      {
        label: localizedValue("Order records", "Order records"),
        title: localizedValue(
          "Order-history clarification",
          "Order-history clarification",
        ),
        body: localizedValue(
          "পূর্বের order record, payment note বা delivery issue-র বিষয়ে প্রশ্ন থাকলে support team দেখবে।",
          "The support team can help with past order records, payment notes, or delivery issues.",
        ),
        href: "/support-center",
      },
      {
        label: localizedValue("Language preference", "Language preference"),
        title: localizedValue(
          "Bangla / English experience",
          "Bangla / English experience",
        ),
        body: localizedValue(
          "স্টোরফ্রন্ট ভাষা বা communication preference-এর feedback-ও নেওয়া হয়।",
          "Feedback about storefront language and communication preference is also accepted.",
        ),
        href: "/contact",
      },
      {
        label: localizedValue("Support email", "Support email"),
        title: localizedValue(
          "info@roshalorganic.com",
          "info@roshalorganic.com",
        ),
        body: localizedValue(
          "গোপনীয়তা বা data-related request লিখিতভাবে পাঠাতে চাইলে email ব্যবহার করুন।",
          "Use email for written privacy or data-related requests.",
        ),
        href: "mailto:info@roshalorganic.com",
      },
    ],
    styles: {
      columns: "2",
    },
  },
  {
    id: "section-privacy-security-story",
    pageId: "page-privacy-policy",
    sectionKey: "privacy-security-story",
    type: "story",
    sortOrder: 0,
    layout: "split",
    variant: "muted",
    isEnabled: false,
    eyebrow: localizedValue("সুরক্ষা প্রতিশ্রুতি", "Security commitment"),
    title: localizedValue(
      "অর্ডার ও payment-related তথ্যকে সীমিত ব্যবহার ও সুরক্ষার মধ্যে রাখা হয়",
      "Order and payment-related data is kept within a limited and protected workflow",
    ),
    body: localizedValue(
      "Roshal Organic storefront, checkout এবং admin review flow-এ শুধু প্রয়োজনীয় order, address, payment reference এবং support history ব্যবহার করা হয়।",
      "Across the storefront, checkout, and admin-review flow, Roshal Organic uses only the order, address, payment reference, and support history needed to complete the purchase.",
    ),
    ctaLabel: localizedValue("Support Center", "Support Center"),
    ctaHref: "/support-center",
    imageUrl: "/packaging.jpg",
    items: [],
    styles: {
      emphasis: "editorial",
    },
  },
];

export const defaultRoshalExtendedSections: RoshalMarketingSection[] = [
  {
    id: "section-home-brands",
    pageId: "page-home",
    sectionKey: "landing-brands",
    type: "feature-grid",
    sortOrder: 12,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("", ""),
    title: localizedValue("আমাদের ব্র্যান্ড", "Our Brands"),
    body: localizedValue(
      "Roshal Organic-এর স্টোরফ্রন্টে যেসব সিগনেচার লাইনের পণ্য আমরা সামনে আনতে চাই সেগুলো এখানে দেখান।",
      "Highlight the signature brand lines you want to surface on the storefront.",
    ),
    ctaLabel: localizedValue("ব্র্যান্ডের গল্প", "Brand Story"),
    ctaHref: "/about",
    imageUrl: "",
    items: [
      {
        title: localizedValue("Roshal Organic", "Roshal Organic"),
        imageUrl: "/logo.png",
        href: "/about",
      },
      {
        title: localizedValue("খাঁটি মধু", "Signature Honey"),
        imageUrl: "/honey.jpg",
        href: "/products?category=honey",
      },
      {
        title: localizedValue("প্রিমিয়াম ঘি", "Kitchen Ghee"),
        imageUrl: "/ghee.jpg",
        href: "/products?category=oil-ghee",
      },
      {
        title: localizedValue("মৌসুমি খেজুর", "Premium Dates"),
        imageUrl: "/dates.jpg",
        href: "/products?category=jaggery-fruit",
      },
    ],
    styles: {
      source: "manual",
    },
  },
  {
    id: "section-home-testimonials",
    pageId: "page-home",
    sectionKey: "landing-testimonials",
    type: "feature-grid",
    sortOrder: 19,
    layout: "grid",
    variant: "muted",
    isEnabled: true,
    eyebrow: localizedValue("", ""),
    title: localizedValue("গ্রাহকের অভিজ্ঞতা", "What Customers Say"),
    body: localizedValue(
      "গ্রাহকদের কাছ থেকে পাওয়া বাস্তব প্রতিক্রিয়া এখানে আপডেট করুন।",
      "Update this section with real customer feedback and testimonials.",
    ),
    ctaLabel: localizedValue("", ""),
    ctaHref: "",
    imageUrl: "",
    items: [
      {
        title: localizedValue("উদ্যোক্তা", "Entrepreneur"),
        body: localizedValue(
          "এই অভিজ্ঞতার জগতে আস্থার একটি প্রতিষ্ঠিত নাম রোশাল অর্গানিক।",
          "Roshal Organic has become a dependable name in our household.",
        ),
        label: localizedValue("Fariha Akter Tumpa", "Fariha Akter Tumpa"),
      },
      {
        title: localizedValue("সার্ভিস হোল্ডার", "Service Holder"),
        body: localizedValue(
          "বাড়ির জন্য ঘি কিনে বুঝলাম মানটা সত্যিই ভালো এবং নির্ভরযোগ্য।",
          "Buying ghee for my family made the quality obvious and dependable.",
        ),
        label: localizedValue("Shahriar Khan Abir", "Shahriar Khan Abir"),
      },
      {
        title: localizedValue("শিক্ষার্থী", "Student"),
        body: localizedValue(
          "বাজারের অনেক জায়গা থেকে কিনেছি, কিন্তু রোশালের পণ্যে ভরসা করা যায়।",
          "I have tried many stores, but Roshal is one of the few I genuinely trust.",
        ),
        label: localizedValue("Ahmod Al Kamran", "Ahmod Al Kamran"),
      },
    ],
    styles: {
      source: "manual",
    },
  },
  {
    id: "section-company-information-overview",
    pageId: "page-company-information",
    sectionKey: "company-overview",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("Roshal Organic", "Roshal Organic"),
    title: localizedValue(
      "আমাদের সম্পর্কে গুরুত্বপূর্ণ তথ্য",
      "Important facts about us",
    ),
    body: localizedValue(
      "ব্যবসার ধরন, সরবরাহ কাঠামো এবং গ্রাহক সহায়তার মূল স্তম্ভগুলো এখানে দেখান।",
      "Show the core facts around the business, sourcing model, and customer support structure.",
    ),
    ctaLabel: localizedValue("যোগাযোগ করুন", "Contact Us"),
    ctaHref: "/contact",
    imageUrl: "",
    items: [
      {
        title: localizedValue("খাঁটি ও অর্গানিক ফোকাস", "Pure and organic focus"),
        body: localizedValue(
          "আমাদের পণ্য তালিকার মূল ফোকাস খাঁটি, রাসায়নিকমুক্ত এবং বিশ্বস্ত খাদ্য।",
          "Our catalog centers on pure, chemical-free, and trustworthy food products.",
        ),
      },
      {
        title: localizedValue("সরাসরি উৎস সংগ্রহ", "Direct source collection"),
        body: localizedValue(
          "দেশি কৃষক, উৎপাদক এবং প্রাকৃতিক উৎস থেকে পণ্য সংগ্রহ করা হয়।",
          "Products are sourced from local farmers, producers, and natural sources.",
        ),
      },
      {
        title: localizedValue("দুই ভাষার সাপোর্ট", "Two-language support"),
        body: localizedValue(
          "Bangla এবং English – দুই ভাষাতেই মার্কেটিং ও চেকআউট অভিজ্ঞতা চালানো যায়।",
          "The storefront and checkout flow support both Bangla and English.",
        ),
      },
      {
        title: localizedValue(
          "ড্যাশবোর্ড-চালিত কনটেন্ট",
          "Dashboard-managed content",
        ),
        body: localizedValue(
          "মার্কেটিং পেজ, ক্যাটাগরি এবং সাপোর্ট কনটেন্ট ড্যাশবোর্ড থেকে আপডেট করা যায়।",
          "Marketing pages, categories, and support content are updated from the dashboard.",
        ),
      },
    ],
    styles: {
      columns: "4",
    },
  },
  {
    id: "section-company-information-contact",
    pageId: "page-company-information",
    sectionKey: "company-contact-cards",
    type: "contact-cards",
    sortOrder: 1,
    layout: "grid",
    variant: "muted",
    isEnabled: true,
    eyebrow: localizedValue("ব্যবসায়িক যোগাযোগ", "Business contact"),
    title: localizedValue(
      "যোগাযোগ ও অপারেশনাল তথ্য",
      "Contact and operational details",
    ),
    body: localizedValue(
      "ব্যবসায়িক যোগাযোগ, সাপোর্ট এবং অবস্থান সম্পর্কিত তথ্যগুলো এখানে রাখুন।",
      "Keep business contact, support, and location details here.",
    ),
    ctaLabel: localizedValue("", ""),
    ctaHref: "",
    imageUrl: "",
    items: [
      {
        label: localizedValue("অফিস লোকেশন", "Office location"),
        title: localizedValue("ঢাকা, বাংলাদেশ", "Dhaka, Bangladesh"),
      },
      {
        label: localizedValue("সাপোর্ট নম্বর", "Support phone"),
        title: localizedValue("+880 1719-403627", "+880 1719-403627"),
        href: "tel:+8801719403627",
      },
      {
        label: localizedValue("সাপোর্ট ইমেইল", "Support email"),
        title: localizedValue(
          "info@roshalorganic.com",
          "info@roshalorganic.com",
        ),
        href: "mailto:info@roshalorganic.com",
      },
      {
        label: localizedValue("হোয়াটসঅ্যাপ", "WhatsApp"),
        title: localizedValue("+880 1719-403627", "+880 1719-403627"),
        href: "https://wa.me/8801719403627",
      },
    ],
    styles: {
      columns: "4",
    },
  },
  {
    id: "section-support-center-topics",
    pageId: "page-support-center",
    sectionKey: "support-topics",
    type: "feature-grid",
    sortOrder: 1,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("সহায়তার ধরন", "Support topics"),
    title: localizedValue("যে ধরনের সহায়তা আমরা দিই", "The help we provide"),
    body: localizedValue(
      "অর্ডার, ডেলিভারি, পেমেন্ট বা অ্যাকাউন্ট-সংক্রান্ত সহায়তার জন্য নিচের গাইডগুলো ব্যবহার করুন।",
      "Use the guides below for help with orders, delivery, payments, or your account.",
    ),
    ctaLabel: localizedValue("FAQ দেখুন", "View FAQ"),
    ctaHref: "/faq",
    imageUrl: "",
    items: [
      {
        title: localizedValue("অর্ডার সাপোর্ট", "Order support"),
        body: localizedValue(
          "অর্ডার কনফার্মেশন, সংশোধন, বাতিল বা ডেলিভারি আপডেটের জন্য।",
          "For order confirmation, edits, cancellation, or delivery updates.",
        ),
      },
      {
        title: localizedValue("পেমেন্ট সাপোর্ট", "Payment support"),
        body: localizedValue(
          "কার্ড বা মোবাইল ওয়ালেট পেমেন্টের স্ট্যাটাস ও ম্যানুয়াল ভেরিফিকেশনের সহায়তা।",
          "Help with card or mobile-wallet payment status and manual verification.",
        ),
      },
      {
        title: localizedValue("অ্যাকাউন্ট সহায়তা", "Account assistance"),
        body: localizedValue(
          "লগইন, প্রোফাইল, ভাষা বা অর্ডার হিস্ট্রি-সংক্রান্ত সহায়তা।",
          "Help with login, profile, language, or order history questions.",
        ),
      },
      {
        title: localizedValue("রিটার্ন ও রিফান্ড", "Returns and refunds"),
        body: localizedValue(
          "ক্ষতিগ্রস্ত বা অমিল পণ্য হলে দ্রুত সাপোর্ট রুট জানুন।",
          "Learn the right support path for damaged or mismatched items.",
        ),
      },
    ],
    styles: {
      columns: "4",
    },
  },
  {
    id: "section-support-center-contacts",
    pageId: "page-support-center",
    sectionKey: "support-contact-cards",
    type: "contact-cards",
    sortOrder: 3,
    layout: "grid",
    variant: "muted",
    isEnabled: true,
    eyebrow: localizedValue("যোগাযোগ মাধ্যম", "Support channels"),
    title: localizedValue("যেভাবে দ্রুত সাপোর্ট পাবেন", "How to reach us quickly"),
    body: localizedValue(
      "গ্রাহকের সবচেয়ে প্রয়োজনীয় যোগাযোগ মাধ্যমগুলো এখানে রাখুন।",
      "Keep the most important customer-support channels here.",
    ),
    ctaLabel: localizedValue("", ""),
    ctaHref: "",
    imageUrl: "",
    items: [
      {
        label: localizedValue("ফোন", "Phone"),
        title: localizedValue("+880 1719-403627", "+880 1719-403627"),
        href: "tel:+8801719403627",
      },
      {
        label: localizedValue("ইমেইল", "Email"),
        title: localizedValue(
          "info@roshalorganic.com",
          "info@roshalorganic.com",
        ),
        href: "mailto:info@roshalorganic.com",
      },
      {
        label: localizedValue("হোয়াটসঅ্যাপ", "WhatsApp"),
        title: localizedValue(
          "লাইভ চ্যাট ও অর্ডার সাপোর্ট",
          "Live chat and order support",
        ),
        href: "https://wa.me/8801719403627",
      },
      {
        label: localizedValue("অর্ডার ট্র্যাকিং", "Order tracking"),
        title: localizedValue(
          "নিজে অর্ডারের স্ট্যাটাস দেখুন",
          "Check order status yourself",
        ),
        href: "/orders",
      },
    ],
    styles: {
      columns: "4",
    },
  },
  {
    id: "section-how-to-order-steps",
    pageId: "page-how-to-order",
    sectionKey: "order-steps",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("অর্ডার প্রসেস", "Order process"),
    title: localizedValue("অর্ডার করার ধাপ", "Steps to place an order"),
    body: localizedValue(
      "Roshal Organic স্টোরফ্রন্টে অর্ডার করার সবচেয়ে সাধারণ ধাপগুলো এখানে দেখান।",
      "Show the most common storefront ordering steps here.",
    ),
    ctaLabel: localizedValue("পণ্য দেখুন", "Browse products"),
    ctaHref: "/products",
    imageUrl: "",
    items: [
      {
        title: localizedValue("১. পণ্য বাছাই", "1. Choose products"),
        body: localizedValue(
          "ক্যাটাগরি, সাবক্যাটাগরি, সার্চ এবং ফিল্টার ব্যবহার করে পণ্য বাছাই করুন।",
          "Use categories, subcategories, search, and filters to pick your products.",
        ),
      },
      {
        title: localizedValue("২. কার্ট ও চেকআউট", "2. Cart and checkout"),
        body: localizedValue(
          "কার্টে পণ্য যোগ করে ঠিকানা, নোট এবং পেমেন্ট অপশনসহ চেকআউট সম্পন্ন করুন।",
          "Add items to cart and complete checkout with address, notes, and a payment option.",
        ),
      },
      {
        title: localizedValue("৩. পেমেন্ট রেফারেন্স", "3. Payment reference"),
        body: localizedValue(
          "ম্যানুয়াল পেমেন্ট হলে ট্রানজেকশন আইডি ও সেন্ডার নম্বর দিন।",
          "For manual payment, submit the transaction ID and sender number.",
        ),
      },
      {
        title: localizedValue(
          "৪. ভেরিফিকেশন ও ডেলিভারি",
          "4. Verification and delivery",
        ),
        body: localizedValue(
          "অ্যাডমিন ভেরিফিকেশনের পর অর্ডার প্রসেসিং ও ডেলিভারি ট্র্যাকিং শুরু হবে।",
          "After admin verification, order processing and delivery tracking will begin.",
        ),
      },
    ],
    styles: {
      columns: "4",
    },
  },
  {
    id: "section-faq-list",
    pageId: "page-faq",
    sectionKey: "faq-list",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("প্রশ্নোত্তর", "FAQ"),
    title: localizedValue("সাধারণ জিজ্ঞাসা", "Common questions"),
    body: localizedValue(
      "অর্ডার, পেমেন্ট, ডেলিভারি এবং রিটার্ন নিয়ে সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নগুলো এখানে রাখুন।",
      "Keep the most frequently asked questions about orders, payments, delivery, and returns here.",
    ),
    ctaLabel: localizedValue("সাপোর্ট সেন্টার", "Support Center"),
    ctaHref: "/support-center",
    imageUrl: "",
    items: [
      {
        title: localizedValue("কিভাবে অর্ডার করব?", "How do I place an order?"),
        body: localizedValue(
          "ওয়েবসাইট থেকে পণ্য বাছাই করে কার্টে যোগ করুন, তারপর চেকআউট সম্পন্ন করুন।",
          "Pick products from the website, add them to cart, and complete checkout.",
        ),
      },
      {
        title: localizedValue(
          "অর্ডার কীভাবে ট্র্যাক করব?",
          "How do I track my order?",
        ),
        body: localizedValue(
          "প্রোফাইল বা অর্ডার হিস্ট্রি থেকে নিজের অর্ডারের স্ট্যাটাস দেখতে পারবেন।",
          "You can check your order status from your profile or order history.",
        ),
      },
      {
        title: localizedValue(
          "কোন পেমেন্ট অপশন আছে?",
          "Which payment methods are available?",
        ),
        body: localizedValue(
          "Cash on Delivery, কার্ড, bKash এবং Nagad পেমেন্ট সমর্থিত।",
          "Cash on Delivery, card, bKash, and Nagad payments are supported.",
        ),
      },
      {
        title: localizedValue(
          "ডেলিভারি চার্জ কত?",
          "What is the delivery charge?",
        ),
        body: localizedValue(
          "ডেলিভারি চার্জ চেকআউট-এ দেখানো হবে এবং লোকেশনভেদে পরিবর্তিত হতে পারে।",
          "The delivery charge is shown at checkout and may vary by location.",
        ),
      },
      {
        title: localizedValue("রিফান্ড কীভাবে পাব?", "How do I get a refund?"),
        body: localizedValue(
          "যাচাই-সাপেক্ষে অ্যাডমিন রিফান্ড অনুমোদন দিলে নির্ধারিত পদ্ধতিতে রিফান্ড প্রসেস হবে।",
          "Once approved by the admin after review, the refund will be processed through the appropriate channel.",
        ),
      },
      {
        title: localizedValue(
          "ভুল পণ্য এলে কী করব?",
          "What if I receive the wrong item?",
        ),
        body: localizedValue(
          "সাপোর্ট সেন্টারে যোগাযোগ করুন এবং দ্রুত রিটার্ন/রিপ্লেসমেন্ট রিকোয়েস্ট দিন।",
          "Contact support and request a return or replacement as soon as possible.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  {
    id: "section-payment-options",
    pageId: "page-payment",
    sectionKey: "payment-options",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("চেকআউট পেমেন্ট", "Checkout payments"),
    title: localizedValue("সমর্থিত পেমেন্ট ফ্লো", "Supported payment flows"),
    body: localizedValue(
      "Cash on Delivery, কার্ড গেটওয়ে, bKash এবং Nagad wallet reference ফ্লো স্টোরফ্রন্ট থেকে চালানো যায়।",
      "Cash on Delivery, card gateway, bKash, and Nagad wallet-reference flows can run from the storefront.",
    ),
    ctaLabel: localizedValue("চেকআউট দেখুন", "Open checkout"),
    ctaHref: "/checkout",
    imageUrl: "",
    items: [
      {
        title: localizedValue("কার্ড গেটওয়ে", "Card gateway"),
        body: localizedValue(
          "গেটওয়ে মোড চালু থাকলে গ্রাহক নিরাপদ পেমেন্ট সেশনে রিডাইরেক্ট হবে।",
          "When gateway mode is enabled, the customer is redirected to a secure payment session.",
        ),
      },
      {
        title: localizedValue("bKash / Nagad", "bKash / Nagad"),
        body: localizedValue(
          "ম্যানুয়াল মোডে সেন্ডার নম্বর এবং ট্রানজেকশন আইডি সংরক্ষণ করা হয়।",
          "In manual mode, sender number and transaction ID are collected and stored.",
        ),
      },
      {
        title: localizedValue(
          "ড্যাশবোর্ড-কন্ট্রোলড অপশন",
          "Dashboard-controlled options",
        ),
        body: localizedValue(
          "কোন পেমেন্ট অপশন চালু থাকবে, কোনটি admin review লাগবে – সব ড্যাশবোর্ড থেকে নিয়ন্ত্রিত।",
          "Enabled methods and admin-review behavior are controlled from the dashboard.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  {
    id: "section-shipping-guide",
    pageId: "page-shipping",
    sectionKey: "shipping-guide",
    type: "feature-grid",
    sortOrder: 2,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("ডেলিভারি গাইড", "Delivery guide"),
    title: localizedValue(
      "শিপিং ও ডেলিভারি তথ্য",
      "Shipping and delivery details",
    ),
    body: localizedValue(
      "ডেলিভারি সময়, লোকেশন কভারেজ এবং অর্ডার রিসিভ করার নির্দেশনা এই ব্লকে রাখুন।",
      "Keep delivery timelines, coverage, and receiving guidance in this block.",
    ),
    ctaLabel: localizedValue("অর্ডার ট্র্যাকিং", "Track orders"),
    ctaHref: "/orders",
    imageUrl: "",
    items: [
      {
        title: localizedValue("নিয়মিত ডেলিভারি", "Standard delivery"),
        body: localizedValue(
          "সাধারণ অর্ডারগুলো যাচাইয়ের পর নির্ধারিত সময়ের মধ্যে ডেলিভারি করা হয়।",
          "Standard orders are delivered within the expected window after verification.",
        ),
      },
      {
        title: localizedValue("অর্ডার যাচাই", "Order verification"),
        body: localizedValue(
          "ম্যানুয়াল পেমেন্টের ক্ষেত্রে অ্যাডমিন ভেরিফিকেশনের পর প্রক্রিয়া শুরু হয়।",
          "Manual-payment orders begin processing after admin verification.",
        ),
      },
      {
        title: localizedValue("গ্রহণের সময়", "At delivery time"),
        body: localizedValue(
          "অর্ডার নেওয়ার সময় পণ্য, পরিমাণ এবং প্যাকেজিং মিলিয়ে নিন।",
          "Check the item, quantity, and packaging condition when receiving the order.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  {
    id: "section-happy-return-guide",
    pageId: "page-happy-return",
    sectionKey: "happy-return-guide",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("রিটার্ন প্রক্রিয়া", "Return process"),
    title: localizedValue("সহজ রিটার্ন ধাপ", "Simple return steps"),
    body: localizedValue(
      "ক্ষতিগ্রস্ত, ভুল বা অসম্পূর্ণ পণ্য এলে কীভাবে দ্রুত পদক্ষেপ নিতে হবে তা এখানে রাখুন।",
      "Keep the quick steps for damaged, wrong, or incomplete item returns here.",
    ),
    ctaLabel: localizedValue("সাপোর্ট সেন্টার", "Support Center"),
    ctaHref: "/support-center",
    imageUrl: "",
    items: [
      {
        title: localizedValue("১. সমস্যার প্রমাণ দিন", "1. Share the issue"),
        body: localizedValue(
          "অর্ডার নম্বর, ছবি এবং সমস্যার বিবরণ পাঠান।",
          "Send the order number, images, and a short issue summary.",
        ),
      },
      {
        title: localizedValue("২. সাপোর্ট যাচাই", "2. Support review"),
        body: localizedValue(
          "সাপোর্ট টিম রেকর্ড দেখে দ্রুত সিদ্ধান্ত নেবে।",
          "The support team reviews the record and responds quickly.",
        ),
      },
      {
        title: localizedValue(
          "৩. রিটার্ন বা রিপ্লেসমেন্ট",
          "3. Return or replacement",
        ),
        body: localizedValue(
          "পরিস্থিতি অনুযায়ী রিটার্ন, রিপ্লেসমেন্ট বা ক্রেডিট সমাধান দেওয়া হবে।",
          "A return, replacement, or credit resolution is provided based on the case.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  {
    id: "section-refund-policy-guide",
    pageId: "page-refund-policy",
    sectionKey: "refund-policy-guide",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("রিফান্ড গাইড", "Refund guide"),
    title: localizedValue("রিফান্ড কিভাবে কাজ করে", "How refunds work"),
    body: localizedValue(
      "রিফান্ডের অনুমোদন, যাচাই এবং সম্পন্ন হওয়ার ধাপগুলো এই সেকশনে রাখুন।",
      "Keep refund approval, verification, and completion steps in this section.",
    ),
    ctaLabel: localizedValue("রিটার্ন গাইড", "Return guide"),
    ctaHref: "/happy-return",
    imageUrl: "",
    items: [
      {
        title: localizedValue("যোগ্যতার যাচাই", "Eligibility review"),
        body: localizedValue(
          "রিফান্ডের আগে অর্ডার অবস্থা, সমস্যার ধরন এবং সাপোর্ট তথ্য যাচাই করা হবে।",
          "Order status, issue type, and support details are reviewed before refund approval.",
        ),
      },
      {
        title: localizedValue("অ্যাডমিন অনুমোদন", "Admin approval"),
        body: localizedValue(
          "যাচাই সম্পন্ন হলে অ্যাডমিন রিফান্ড স্ট্যাটাস আপডেট করতে পারবে।",
          "Once review is complete, the admin can update the refund outcome.",
        ),
      },
      {
        title: localizedValue("রিফান্ড সম্পন্ন", "Refund completion"),
        body: localizedValue(
          "অনুমোদিত রিফান্ড গ্রাহকের সাথে সমন্বয় করে সম্পন্ন করা হবে।",
          "Approved refunds are completed in coordination with the customer.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  {
    id: "section-cancellation-guide",
    pageId: "page-cancellation",
    sectionKey: "cancellation-guide",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("অর্ডার ক্যানসেলেশন", "Order cancellation"),
    title: localizedValue("কিভাবে অর্ডার বাতিল করবেন", "How to cancel an order"),
    body: localizedValue(
      "অর্ডার ডিসপ্যাচের আগে কীভাবে পরিবর্তন বা বাতিলের অনুরোধ করবেন তা এই সেকশনে রাখুন।",
      "Keep the process for requesting changes or cancellation before dispatch here.",
    ),
    ctaLabel: localizedValue("সাপোর্ট সেন্টার", "Support Center"),
    ctaHref: "/support-center",
    imageUrl: "",
    items: [
      {
        title: localizedValue("ডিসপ্যাচের আগে অনুরোধ", "Request before dispatch"),
        body: localizedValue(
          "অর্ডার প্রসেসিং শুরু হওয়ার আগেই সাপোর্টে যোগাযোগ করলে দ্রুত সমাধান হবে।",
          "Contact support before fulfillment starts for the fastest resolution.",
        ),
      },
      {
        title: localizedValue("পেমেন্ট-রিভিউ অর্ডার", "Payment-review orders"),
        body: localizedValue(
          "ম্যানুয়াল পেমেন্ট ভেরিফিকেশনের অপেক্ষায় থাকা অর্ডার তুলনামূলক সহজে সমন্বয় করা যায়।",
          "Orders awaiting manual payment verification are usually easier to adjust.",
        ),
      },
      {
        title: localizedValue("ডিসপ্যাচের পর", "After dispatch"),
        body: localizedValue(
          "ডিসপ্যাচ সম্পন্ন হলে ক্যানসেলেশনের বদলে রিটার্ন বা রিসিভ-পরবর্তী সমাধান প্রযোজ্য হতে পারে।",
          "Once dispatched, return or post-delivery resolution may apply instead of cancellation.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  {
    id: "section-roshal-stories-highlights",
    pageId: "page-roshal-stories",
    sectionKey: "stories-highlights",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("রোশাল স্টোরিজ", "Roshal Stories"),
    title: localizedValue(
      "ব্র্যান্ড, পণ্য এবং আস্থার গল্প",
      "Stories behind the brand, products, and trust",
    ),
    body: localizedValue(
      "এই পেজে সিজনাল ক্যাম্পেইন, সোর্সিং স্টোরি, গ্রাহকের আস্থা এবং ব্র্যান্ড আপডেটগুলোর ব্লক সাজান।",
      "Use this page for seasonal campaigns, sourcing stories, customer trust highlights, and brand updates.",
    ),
    ctaLabel: localizedValue("আমাদের সম্পর্কে", "About Roshal"),
    ctaHref: "/about",
    imageUrl: "",
    items: [
      {
        title: localizedValue("সোর্সিং স্টোরি", "Sourcing Story"),
        body: localizedValue(
          "দেশি কৃষক ও প্রাকৃতিক উৎস থেকে পণ্য সংগ্রহের গল্প এখানে তুলে ধরুন।",
          "Highlight how products are collected from local farmers and natural sources.",
        ),
      },
      {
        title: localizedValue("সিজনাল ক্যাম্পেইন", "Seasonal Campaigns"),
        body: localizedValue(
          "ঋতুভিত্তিক ফল, মধু বা অফার ক্যাম্পেইনের গল্পগুলো এ সেকশনে আপডেট রাখুন।",
          "Keep seasonal fruit, honey, or promotional campaign stories updated here.",
        ),
      },
      {
        title: localizedValue("গ্রাহকের আস্থা", "Customer Trust"),
        body: localizedValue(
          "যে প্রতিশ্রুতি ও মান নিয়ন্ত্রণ ব্র্যান্ডটিকে আলাদা করে তা এখানে দেখান।",
          "Show the promises and quality controls that set the brand apart.",
        ),
      },
      {
        title: localizedValue("ব্র্যান্ড আপডেট", "Brand Updates"),
        body: localizedValue(
          "নতুন পণ্য, উদ্যোগ বা ব্র্যান্ডের নতুন দিকনির্দেশনা এখানে যোগ করুন।",
          "Add new product launches, initiatives, or brand direction updates here.",
        ),
      },
    ],
    styles: {
      columns: "4",
    },
  },
  {
    id: "section-terms-and-conditions-guide",
    pageId: "page-terms-and-conditions",
    sectionKey: "terms-guide",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("স্টোর নীতিমালা", "Store policies"),
    title: localizedValue("অর্ডার ও ব্যবহারের শর্তাবলী", "Order and usage terms"),
    body: localizedValue(
      "অর্ডার, পেমেন্ট, ডেলিভারি, রিটার্ন এবং অ্যাকাউন্ট ব্যবহারের মৌলিক নীতিগুলো এই পেজে রাখুন।",
      "Keep the core rules around orders, payments, delivery, returns, and account usage on this page.",
    ),
    ctaLabel: localizedValue("সাপোর্ট সেন্টার", "Support Center"),
    ctaHref: "/support-center",
    imageUrl: "",
    items: [
      {
        title: localizedValue("অর্ডার কনফার্মেশন", "Order confirmation"),
        body: localizedValue(
          "অর্ডার সাবমিটের পর ভেরিফিকেশন বা পেমেন্ট রিভিউ অনুযায়ী কনফার্মেশন সম্পন্ন হবে।",
          "Order confirmation is completed after verification or payment review as needed.",
        ),
      },
      {
        title: localizedValue("পেমেন্ট শর্ত", "Payment terms"),
        body: localizedValue(
          "নির্বাচিত পেমেন্ট মোড অনুযায়ী ট্রানজ্যাকশন আইডি, সেন্ডার নম্বর বা গেটওয়ে কনফার্মেশন লাগতে পারে।",
          "Transaction ID, sender number, or gateway confirmation may be required based on the selected payment mode.",
        ),
      },
      {
        title: localizedValue("ডেলিভারি নিয়ম", "Delivery terms"),
        body: localizedValue(
          "লোকেশন, যাচাই এবং স্টক অনুযায়ী ডেলিভারি সময় পরিবর্তিত হতে পারে।",
          "Delivery timing can vary based on location, verification, and stock availability.",
        ),
      },
      {
        title: localizedValue("রিটার্ন ও বাতিল", "Returns and cancellation"),
        body: localizedValue(
          "ডিসপ্যাচের আগে ক্যানসেলেশন সহজ, পরে রিটার্ন বা রিফান্ড নীতিমালা প্রযোজ্য হতে পারে।",
          "Cancellation is easier before dispatch; after that, return or refund rules may apply.",
        ),
      },
    ],
    styles: {
      columns: "4",
    },
  },
  {
    id: "section-privacy-policy-guide",
    pageId: "page-privacy-policy",
    sectionKey: "privacy-guide",
    type: "feature-grid",
    sortOrder: 1,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("ডাটা প্রাইভেসি", "Data privacy"),
    title: localizedValue(
      "গ্রাহকের তথ্য কীভাবে ব্যবহৃত হয়",
      "How customer data is handled",
    ),
    body: localizedValue(
      "অর্ডার, সাপোর্ট, ভাষা পছন্দ, ডেলিভারি এবং পেমেন্ট যাচাইয়ের জন্য কোন তথ্য রাখা হয় তা এখানে দেখান।",
      "Show what data is retained for orders, support, language preference, delivery, and payment verification.",
    ),
    ctaLabel: localizedValue("যোগাযোগ করুন", "Contact us"),
    ctaHref: "/contact",
    imageUrl: "",
    items: [
      {
        title: localizedValue("সংগ্রহকৃত তথ্য", "Collected information"),
        body: localizedValue(
          "অর্ডার, প্রোফাইল, পেমেন্ট রেফারেন্স এবং ডেলিভারির জন্য প্রয়োজনীয় তথ্য সংগ্রহ করা হয়।",
          "Order, profile, payment reference, and delivery information is collected as needed.",
        ),
      },
      {
        title: localizedValue("ব্যবহারের উদ্দেশ্য", "Usage purpose"),
        body: localizedValue(
          "অর্ডার সম্পন্ন করা, সাপোর্ট দেওয়া, পেমেন্ট যাচাই করা এবং ভাষা/অ্যাকাউন্ট অভিজ্ঞতা উন্নত করতে তথ্য ব্যবহৃত হয়।",
          "Data is used to complete orders, provide support, verify payments, and improve account experience.",
        ),
      },
      {
        title: localizedValue("তথ্য সুরক্ষা", "Data protection"),
        body: localizedValue(
          "অ্যাকাউন্ট, অর্ডার এবং পেমেন্ট-সম্পর্কিত তথ্য সুরক্ষিতভাবে সংরক্ষণ করার প্রতিশ্রুতি এখানে উল্লেখ করুন।",
          "Document the commitment to keep account, order, and payment-related data protected.",
        ),
      },
      {
        title: localizedValue("সহায়তার অনুরোধ", "Support requests"),
        body: localizedValue(
          "গ্রাহক চাইলে সাপোর্ট চ্যানেলের মাধ্যমে তথ্য আপডেট বা সংশোধনের অনুরোধ করতে পারেন।",
          "Customers can request corrections or updates through the support channels when needed.",
        ),
      },
    ],
    styles: {
      columns: "4",
    },
  },
  {
    id: "section-careers-overview",
    pageId: "page-careers",
    sectionKey: "careers-overview",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("দল ও সংস্কৃতি", "Team and culture"),
    title: localizedValue(
      "রোশাল অর্গানিকের সঙ্গে কাজ করুন",
      "Work with Roshal Organic",
    ),
    body: localizedValue(
      "ভবিষ্যৎ টিম মেম্বারদের জন্য কাজের ধরন, অপারেশন, সাপোর্ট এবং মিশনের সারাংশ এখানে দিন।",
      "Give future team members an overview of the mission, operations, support culture, and work style.",
    ),
    ctaLabel: localizedValue("যোগাযোগ করুন", "Contact us"),
    ctaHref: "/contact",
    imageUrl: "",
    items: [
      {
        title: localizedValue("মিশন-চালিত কাজ", "Mission-driven work"),
        body: localizedValue(
          "খাঁটি ও স্বাস্থ্যসম্মত খাদ্য মানুষের ঘরে পৌঁছে দেওয়ার লক্ষ্য নিয়ে কাজ।",
          "Work around the mission of delivering pure and healthy food to households.",
        ),
      },
      {
        title: localizedValue("অপারেশন ও সাপোর্ট", "Operations and support"),
        body: localizedValue(
          "স্টোরফ্রন্ট, ডেলিভারি, সাপোর্ট ও কনটেন্ট অপারেশনের সমন্বিত টিমওয়ার্ক এখানে তুলে ধরুন।",
          "Highlight the teamwork behind storefront, delivery, support, and content operations.",
        ),
      },
      {
        title: localizedValue("বৃদ্ধির সুযোগ", "Growth opportunities"),
        body: localizedValue(
          "ব্র্যান্ড, ক্যাটালগ এবং গ্রাহক অভিজ্ঞতার সঙ্গে শেখা ও কাজের সুযোগের কথা এখানে লিখুন।",
          "Outline learning and growth opportunities tied to brand, catalog, and customer experience work.",
        ),
      },
      {
        title: localizedValue("আবেদন প্রক্রিয়া", "Application flow"),
        body: localizedValue(
          "চাকরির জন্য কোথায় সিভি পাঠাতে হবে বা কিভাবে আগ্রহ জানাতে হবে তা এই ব্লকে আপডেট রাখুন।",
          "Keep the application email or expression-of-interest flow updated in this block.",
        ),
      },
    ],
    styles: {
      columns: "4",
    },
  },
  {
    id: "section-pre-order-guide",
    pageId: "page-pre-order",
    sectionKey: "pre-order-guide",
    type: "feature-grid",
    sortOrder: 0,
    layout: "grid",
    variant: "default",
    isEnabled: true,
    eyebrow: localizedValue("প্রি-অর্ডার", "Pre-order"),
    title: localizedValue("প্রি-অর্ডার কীভাবে কাজ করে", "How pre-orders work"),
    body: localizedValue(
      "প্রি-অর্ডার পণ্য, অগ্রিম পেমেন্ট, আনুমানিক ডেলিভারি সময় এবং ক্যানসেলেশন নিয়ম এখানে স্পষ্ট করুন।",
      "Clarify pre-order items, advance payment, estimated delivery timing, and cancellation rules here.",
    ),
    ctaLabel: localizedValue("পেমেন্ট গাইড", "Payment Guide"),
    ctaHref: "/payment",
    imageUrl: "",
    items: [
      {
        title: localizedValue("প্রি-অর্ডার কী", "What is a pre-order?"),
        body: localizedValue(
          "যে পণ্য স্টকে আসার আগে বুকিং নেওয়া হয় বা সীমিত সরবরাহের জন্য আগাম নিশ্চিত করা হয়।",
          "Items booked before they arrive in stock or confirmed early for limited supply.",
        ),
      },
      {
        title: localizedValue("অগ্রিম পেমেন্ট", "Advance payment"),
        body: localizedValue(
          "উচ্চমূল্য বা সীমিত পণ্যের ক্ষেত্রে আংশিক বা পূর্ণ অগ্রিম পেমেন্ট লাগতে পারে।",
          "Partial or full advance payment may be required for limited or higher-value items.",
        ),
      },
      {
        title: localizedValue("ডেলিভারি ও বাতিল", "Delivery and cancellation"),
        body: localizedValue(
          "সাপ্লাই বা ডিসপ্যাচের আগে ক্যানসেলেশন নীতিমালা প্রযোজ্য, পরে আলাদা সাপোর্ট সমন্বয় লাগতে পারে।",
          "Cancellation rules apply before supplier confirmation or dispatch; afterward, support coordination may be needed.",
        ),
      },
    ],
    styles: {
      columns: "3",
    },
  },
  ...defaultRoshalExtendedPageEnhancements,
];
