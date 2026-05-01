export type RoshalLocale = "bn" | "en";
export type RoshalRole = "admin" | "user";
export type RoshalKnownPaymentMethod =
  | "cash_on_delivery"
  | "card"
  | "bkash"
  | "nagad"
  | "rocket"
  | "upay";
export type RoshalPaymentMethod = RoshalKnownPaymentMethod | (string & {});
export type RoshalPaymentGatewayProvider = "aamarpay";

export interface LocalizedValue {
  bn: string;
  en: string;
}

export interface RoshalMarketingSectionItem {
  title?: LocalizedValue;
  body?: LocalizedValue;
  label?: LocalizedValue;
  href?: string;
  imageUrl?: string;
  value?: string;
}

export interface RoshalMarketingSection {
  id: string;
  pageId: string;
  sectionKey: string;
  type: string;
  sortOrder: number;
  layout: string;
  variant: string;
  isEnabled: boolean;
  eyebrow: LocalizedValue;
  title: LocalizedValue;
  body: LocalizedValue;
  ctaLabel: LocalizedValue;
  ctaHref: string;
  imageUrl: string;
  items: RoshalMarketingSectionItem[];
  styles: Record<string, string>;
}

export interface RoshalMarketingPage {
  id: string;
  slug: string;
  navigationLabel: LocalizedValue;
  title: LocalizedValue;
  description: LocalizedValue;
  heroImage: string;
  status: string;
  showInNavigation: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoshalStoreCategory {
  id: string;
  key: string;
  label: LocalizedValue;
  description: LocalizedValue;
  imageUrl: string;
  sourceKeys: string[];
  isEnabled: boolean;
  showInNavigation: boolean;
  showOnHomepage: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoshalStoreSubcategory {
  id: string;
  categoryId: string;
  categoryKey: string;
  key: string;
  label: LocalizedValue;
  description: LocalizedValue;
  imageUrl: string;
  sourceKeys: string[];
  isEnabled: boolean;
  showInNavigation: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoshalTaxonomyBundle {
  categories: RoshalStoreCategory[];
  subcategories: RoshalStoreSubcategory[];
}

export interface RoshalDeliveryZone {
  id: string;
  label: LocalizedValue;
  fee: number;
  cityPatterns: string[];
  postalCodes: string[];
  addressKeywords: string[];
  isEnabled: boolean;
  isDefault: boolean;
  sortOrder: number;
}

export interface RoshalDeliverySettings {
  enableFreeDelivery: boolean;
  freeDeliveryThreshold: number;
}

export interface RoshalSiteSettings {
  id: string;
  brandName: string;
  tagline: LocalizedValue;
  contactPhone: string;
  contactEmail: string;
  whatsappPhone: string;
  facebookUrl: string;
  address: LocalizedValue;
  heroLayout: string;
  cardStyle: string;
  sectionSpacing: string;
  primaryCtaHref: string;
  primaryCtaLabel: LocalizedValue;
  deliveryZones: RoshalDeliveryZone[];
  deliverySettings: RoshalDeliverySettings;
}

export interface RoshalPaymentOption {
  key: RoshalPaymentMethod;
  enabled: boolean;
  mode: "manual" | "gateway";
  label: LocalizedValue;
  merchantLabel: LocalizedValue;
  accountType: string;
  accountNumber: string;
  instructions: LocalizedValue;
  guideImageUrl: string;
  requiresProof: boolean;
  sortOrder: number;
}

export interface RoshalPaymentSettings {
  id: string;
  manualReviewNotice: LocalizedValue;
  supportMessage: LocalizedValue;
  options: RoshalPaymentOption[];
}

export interface RoshalPaymentGatewaySummary {
  provider: RoshalPaymentGatewayProvider | null;
  configured: boolean;
  environment: "sandbox" | "live" | null;
  supportedMethods: RoshalPaymentMethod[];
  missingEnvKeys: string[];
  callbackUrls: {
    success: string;
    fail: string;
    cancel: string;
    ipn: string;
  };
}

export interface RoshalProduct {
  id: string;
  slug: string;
  sku: string;
  name: LocalizedValue;
  summary: LocalizedValue;
  description: LocalizedValue;
  categoryKey: string;
  categoryLabel: LocalizedValue;
  price: number;
  compareAtPrice: number | null;
  inventory: number;
  badge: string | null;
  heroImage: string;
  gallery: string[];
  features: LocalizedValue[];
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoshalProductReview {
  id: string;
  productId: string;
  userId: string | null;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoshalProductReviewBundle {
  averageRating: number;
  reviewCount: number;
  ratingsBreakdown: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  reviews: RoshalProductReview[];
}

export interface RoshalOrderItem {
  productId: string;
  slug: string;
  name: LocalizedValue;
  image: string;
  price: number;
  quantity: number;
}

export interface RoshalOrder {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: string;
  paymentMethod: RoshalPaymentMethod;
  paymentStatus: string;
  paymentProvider: RoshalPaymentGatewayProvider | "";
  gatewayTransactionId: string;
  gatewayPaymentType: string;
  gatewayMeta: Record<string, string>;
  paymentReference: string;
  paymentSender: string;
  paymentProofUrl: string;
  trackingNote: string;
  adminReviewNote: string;
  verifiedAt: Date | null;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currency: string;
  customerName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  notes: string;
  items: RoshalOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoshalOrderTrackingStep {
  key: string;
  label: LocalizedValue;
  description: LocalizedValue;
  completed: boolean;
  highlighted?: boolean;
}

export interface RoshalDashboardSnapshot {
  productCount: number;
  publishedProductCount: number;
  lowStockProductCount: number;
  outOfStockProductCount: number;
  orderCount: number;
  pendingOrderCount: number;
  userCount: number;
  marketingPageCount: number;
  featuredProducts: RoshalProduct[];
  recentOrders: RoshalOrder[];
}
