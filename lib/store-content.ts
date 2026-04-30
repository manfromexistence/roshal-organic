import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  roshalOrders,
  roshalPages,
  roshalPaymentSettings,
  roshalProducts,
  roshalSections,
  roshalSiteSettings,
  users,
} from "@/lib/schema";
import {
  defaultRoshalPages,
  defaultRoshalPaymentSettings,
  defaultRoshalProducts,
  defaultRoshalSections,
  defaultRoshalSiteSettings,
} from "@/lib/store-defaults";
import { normalizeRoshalDeliveryZones } from "@/lib/store-delivery";
import { safeJsonParse } from "@/lib/store-format";
import {
  normalizeRoshalAssetPath,
  normalizeRoshalProductMedia,
} from "@/lib/store-media";
import { ensureRoshalSiteSettingsSchema } from "@/lib/store-site-settings-schema";
import type {
  RoshalDashboardSnapshot,
  RoshalMarketingPage,
  RoshalMarketingSection,
  RoshalOrder,
  RoshalOrderItem,
  RoshalPaymentMethod,
  RoshalPaymentSettings,
  RoshalProduct,
  RoshalSiteSettings,
} from "@/lib/store-types";

function normalizePaymentMethod(
  value: string | null | undefined,
): RoshalPaymentMethod {
  if (
    value === "cash_on_delivery" ||
    value === "card" ||
    value === "bkash" ||
    value === "nagad" ||
    value === "rocket" ||
    value === "upay"
  ) {
    return value;
  }

  return "cash_on_delivery";
}

function mapPage(row: typeof roshalPages.$inferSelect): RoshalMarketingPage {
  return {
    id: row.id,
    slug: row.slug,
    navigationLabel: {
      bn: row.navigationLabelBn,
      en: row.navigationLabelEn,
    },
    title: {
      bn: row.titleBn,
      en: row.titleEn,
    },
    description: {
      bn: row.descriptionBn || "",
      en: row.descriptionEn || "",
    },
    heroImage: normalizeRoshalAssetPath(row.heroImage, ""),
    status: row.status,
    showInNavigation: Boolean(row.showInNavigation),
  };
}

function mergeRoshalPages(pages: RoshalMarketingPage[]) {
  const pageBySlug = new Map(pages.map((page) => [page.slug, page]));
  const mergedPages: RoshalMarketingPage[] = [];
  const seenSlugs = new Set<string>();

  for (const defaultPage of defaultRoshalPages) {
    const page = pageBySlug.get(defaultPage.slug) || defaultPage;
    mergedPages.push(page);
    seenSlugs.add(page.slug);
  }

  const customPages = pages
    .filter((page) => !seenSlugs.has(page.slug))
    .sort((left, right) => left.slug.localeCompare(right.slug));

  return [...mergedPages, ...customPages];
}

function mapSection(
  row: typeof roshalSections.$inferSelect,
): RoshalMarketingSection {
  return {
    id: row.id,
    pageId: row.pageId,
    sectionKey: row.sectionKey,
    type: row.type,
    sortOrder: row.sortOrder,
    layout: row.layout,
    variant: row.variant,
    isEnabled: Boolean(row.isEnabled),
    eyebrow: {
      bn: row.eyebrowBn || "",
      en: row.eyebrowEn || "",
    },
    title: {
      bn: row.titleBn || "",
      en: row.titleEn || "",
    },
    body: {
      bn: row.bodyBn || "",
      en: row.bodyEn || "",
    },
    ctaLabel: {
      bn: row.ctaLabelBn || "",
      en: row.ctaLabelEn || "",
    },
    ctaHref: row.ctaHref || "",
    imageUrl: normalizeRoshalAssetPath(row.imageUrl, ""),
    items: safeJsonParse(row.itemsJson, []).map(
      (item: Record<string, unknown>) => ({
        ...item,
        imageUrl: normalizeRoshalAssetPath(
          typeof item.imageUrl === "string" ? item.imageUrl : "",
          "",
        ),
      }),
    ),
    styles: safeJsonParse(row.stylesJson, {}),
  };
}

function mergeRoshalSections(
  defaultSections: RoshalMarketingSection[],
  sections: RoshalMarketingSection[],
) {
  const sectionByKey = new Map(
    defaultSections.map((section) => [section.sectionKey, section]),
  );

  for (const section of sections) {
    sectionByKey.set(section.sectionKey, section);
  }

  return Array.from(sectionByKey.values()).sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.sectionKey.localeCompare(right.sectionKey);
  });
}

function mapProduct(row: typeof roshalProducts.$inferSelect): RoshalProduct {
  return normalizeRoshalProductMedia({
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: {
      bn: row.nameBn,
      en: row.nameEn,
    },
    summary: {
      bn: row.summaryBn,
      en: row.summaryEn,
    },
    description: {
      bn: row.descriptionBn,
      en: row.descriptionEn,
    },
    categoryKey: row.categoryKey,
    categoryLabel: {
      bn: row.categoryLabelBn,
      en: row.categoryLabelEn,
    },
    price: row.price,
    compareAtPrice: row.compareAtPrice,
    inventory: row.inventory,
    badge: row.badge,
    heroImage: row.heroImage,
    gallery: safeJsonParse<string[]>(row.galleryJson, [row.heroImage]),
    features: safeJsonParse(row.featuresBnJson, []).map(
      (bnFeature: string, index: number) => ({
        bn: bnFeature,
        en: safeJsonParse<string[]>(row.featuresEnJson, [])[index] || bnFeature,
      }),
    ),
    isFeatured: Boolean(row.isFeatured),
    isPublished: Boolean(row.isPublished),
    sortOrder: row.sortOrder,
  });
}

function mergeRoshalProducts(products: RoshalProduct[]) {
  const productBySlug = new Map(
    products.map((product) => [product.slug, product]),
  );
  const productById = new Map(products.map((product) => [product.id, product]));
  const mergedProducts: RoshalProduct[] = [];
  const consumedKeys = new Set<string>();

  for (const defaultProduct of defaultRoshalProducts) {
    const product =
      productBySlug.get(defaultProduct.slug) ??
      productById.get(defaultProduct.id) ??
      defaultProduct;

    mergedProducts.push(product);
    consumedKeys.add(product.id);
    consumedKeys.add(product.slug);
  }

  const customProducts = products
    .filter(
      (product) =>
        !consumedKeys.has(product.id) && !consumedKeys.has(product.slug),
    )
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.name.en.localeCompare(right.name.en);
    });

  return [...mergedProducts, ...customProducts];
}

function mapOrder(row: typeof roshalOrders.$inferSelect): RoshalOrder {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    userId: row.userId,
    status: row.status,
    paymentMethod: normalizePaymentMethod(row.paymentMethod),
    paymentStatus: row.paymentStatus,
    paymentProvider: row.paymentProvider === "aamarpay" ? "aamarpay" : "",
    gatewayTransactionId: row.gatewayTransactionId || "",
    gatewayPaymentType: row.gatewayPaymentType || "",
    gatewayMeta: safeJsonParse<Record<string, string>>(row.gatewayMetaJson, {}),
    paymentReference: row.paymentReference || "",
    paymentSender: row.paymentSender || "",
    paymentProofUrl: row.paymentProofUrl || "",
    trackingNote: row.trackingNote || "",
    adminReviewNote: row.adminReviewNote || "",
    verifiedAt: row.verifiedAt || null,
    subtotal: row.subtotal,
    shippingFee: row.shippingFee,
    discount: row.discount,
    total: row.total,
    currency: row.currency,
    customerName: row.customerName,
    phone: row.phone,
    email: row.email || "",
    addressLine1: row.addressLine1,
    addressLine2: row.addressLine2 || "",
    city: row.city,
    postalCode: row.postalCode || "",
    notes: row.notes || "",
    items: safeJsonParse<RoshalOrderItem[]>(row.itemsJson, []),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function sanitizePaymentOption(
  option: RoshalPaymentSettings["options"][number],
): RoshalPaymentSettings["options"][number] {
  const key = normalizePaymentMethod(option.key);

  if (key !== "upay") {
    return {
      ...option,
      key,
    };
  }

  return {
    ...option,
    key,
    label: {
      bn: "উপায়",
      en: option.label.en || "Upay",
    },
    merchantLabel: {
      bn: "উপায় গেটওয়ে",
      en: option.merchantLabel.en || "Upay gateway",
    },
    instructions: {
      bn: "উপায় গেটওয়ে চালু থাকলে চেকআউটে aamarPay রিডাইরেক্ট হবে। প্রয়োজন হলে অ্যাডমিন ড্যাশবোর্ড থেকে এটিকে ম্যানুয়াল মোডে পরিবর্তন করতে পারবেন।",
      en:
        option.instructions.en ||
        "When Upay gateway checkout is enabled, customers will be redirected through aamarPay. Admins can switch this option to manual mode from the dashboard if needed.",
    },
  };
}

function mapPaymentSettings(
  row: typeof roshalPaymentSettings.$inferSelect,
): RoshalPaymentSettings {
  const storedOptions = safeJsonParse<RoshalPaymentSettings["options"]>(
    row.optionsJson,
    defaultRoshalPaymentSettings.options,
  );
  const defaultOptionsByKey = new Map(
    defaultRoshalPaymentSettings.options.map((option) => [
      normalizePaymentMethod(option.key),
      sanitizePaymentOption(option),
    ]),
  );
  const storedOptionsByKey = new Map(
    storedOptions.map((option) => [
      normalizePaymentMethod(option.key),
      sanitizePaymentOption({
        ...option,
        guideImageUrl: normalizeRoshalAssetPath(option.guideImageUrl, ""),
      }),
    ]),
  );
  const mergedOptions = Array.from(defaultOptionsByKey.entries()).map(
    ([key, defaultOption]) => {
      const storedOption = storedOptionsByKey.get(key);

      return sanitizePaymentOption({
        ...defaultOption,
        ...storedOption,
        key,
        label: storedOption?.label || defaultOption.label,
        merchantLabel:
          storedOption?.merchantLabel || defaultOption.merchantLabel,
        instructions: storedOption?.instructions || defaultOption.instructions,
        guideImageUrl:
          storedOption?.guideImageUrl || defaultOption.guideImageUrl,
      });
    },
  );
  const customOptions = Array.from(storedOptionsByKey.entries())
    .filter(([key]) => !defaultOptionsByKey.has(key))
    .map(([, option]) => option);
  const options = [...mergedOptions, ...customOptions].sort((left, right) => {
    if (left.key === "cash_on_delivery") {
      return -1;
    }

    if (right.key === "cash_on_delivery") {
      return 1;
    }

    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.key.localeCompare(right.key);
  });

  return {
    id: row.id,
    manualReviewNotice: {
      bn: row.manualReviewNoticeBn,
      en: row.manualReviewNoticeEn,
    },
    supportMessage: {
      bn: row.supportMessageBn,
      en: row.supportMessageEn,
    },
    options,
  };
}

function mapSiteSettings(
  row: typeof roshalSiteSettings.$inferSelect,
): RoshalSiteSettings {
  const normalizedContactPhone =
    row.contactPhone === "+880 1719-403627" ||
    row.contactPhone === "01719-403627" ||
    row.contactPhone === "01719403627"
      ? defaultRoshalSiteSettings.contactPhone
      : row.contactPhone || defaultRoshalSiteSettings.contactPhone;
  const normalizedContactEmail =
    row.contactEmail === "info@roshalorganic.com"
      ? defaultRoshalSiteSettings.contactEmail
      : row.contactEmail || defaultRoshalSiteSettings.contactEmail;
  const normalizedWhatsappPhone =
    row.whatsappPhone === "+880 1719-403627" ||
    row.whatsappPhone === "01719-403627" ||
    row.whatsappPhone === "01719403627"
      ? defaultRoshalSiteSettings.whatsappPhone
      : row.whatsappPhone || defaultRoshalSiteSettings.whatsappPhone;
  const normalizedAddressBn =
    row.addressBn === "ঢাকা, বাংলাদেশ"
      ? defaultRoshalSiteSettings.address.bn
      : row.addressBn || defaultRoshalSiteSettings.address.bn;
  const normalizedAddressEn =
    row.addressEn === "Dhaka, Bangladesh"
      ? defaultRoshalSiteSettings.address.en
      : row.addressEn || defaultRoshalSiteSettings.address.en;

  return {
    id: row.id,
    brandName: row.brandName,
    tagline: {
      bn: row.taglineBn,
      en: row.taglineEn,
    },
    contactPhone: normalizedContactPhone,
    contactEmail: normalizedContactEmail,
    whatsappPhone: normalizedWhatsappPhone,
    facebookUrl: row.facebookUrl || defaultRoshalSiteSettings.facebookUrl,
    address: {
      bn: normalizedAddressBn,
      en: normalizedAddressEn,
    },
    heroLayout: row.heroLayout,
    cardStyle: row.cardStyle,
    sectionSpacing: row.sectionSpacing,
    primaryCtaHref: row.primaryCtaHref,
    primaryCtaLabel: {
      bn: row.primaryCtaLabelBn,
      en: row.primaryCtaLabelEn,
    },
    deliveryZones: normalizeRoshalDeliveryZones(
      safeJsonParse(
        row.deliveryZonesJson,
        defaultRoshalSiteSettings.deliveryZones,
      ),
      defaultRoshalSiteSettings.deliveryZones,
    ),
  };
}

export async function getRoshalSiteSettings() {
  try {
    await ensureRoshalSiteSettingsSchema();
    const [settings] = await db.select().from(roshalSiteSettings).limit(1);
    return settings ? mapSiteSettings(settings) : defaultRoshalSiteSettings;
  } catch {
    return defaultRoshalSiteSettings;
  }
}

export async function getRoshalPaymentSettings() {
  try {
    const [settings] = await db.select().from(roshalPaymentSettings).limit(1);
    return settings
      ? mapPaymentSettings(settings)
      : {
          ...defaultRoshalPaymentSettings,
          options: defaultRoshalPaymentSettings.options.map(
            sanitizePaymentOption,
          ),
        };
  } catch {
    return {
      ...defaultRoshalPaymentSettings,
      options: defaultRoshalPaymentSettings.options.map(sanitizePaymentOption),
    };
  }
}

export async function getRoshalNavigationPages() {
  const pages = await getRoshalPages();
  return pages.filter(
    (page) => page.showInNavigation && page.status === "published",
  );
}

export async function getRoshalPages() {
  try {
    const pages = await db
      .select()
      .from(roshalPages)
      .orderBy(asc(roshalPages.slug));

    return mergeRoshalPages(pages.map(mapPage));
  } catch {
    return defaultRoshalPages;
  }
}

export async function getRoshalPageBySlug(slug: string) {
  try {
    const [page] = await db
      .select()
      .from(roshalPages)
      .where(eq(roshalPages.slug, slug))
      .limit(1);

    if (page) {
      return page.status === "published" ? mapPage(page) : null;
    }

    return defaultRoshalPages.find((item) => item.slug === slug) || null;
  } catch {
    return defaultRoshalPages.find((item) => item.slug === slug) || null;
  }
}

export async function getRoshalSectionsForPage(pageId: string) {
  let defaultPage =
    defaultRoshalPages.find((page) => page.id === pageId) || null;

  try {
    if (!defaultPage) {
      const [page] = await db
        .select({
          slug: roshalPages.slug,
        })
        .from(roshalPages)
        .where(eq(roshalPages.id, pageId))
        .limit(1);

      if (page?.slug) {
        defaultPage =
          defaultRoshalPages.find((item) => item.slug === page.slug) || null;
      }
    }

    const sections = await db
      .select()
      .from(roshalSections)
      .where(eq(roshalSections.pageId, pageId))
      .orderBy(asc(roshalSections.sortOrder));
    const mappedSections = sections.map(mapSection);

    if (!defaultPage) {
      return mappedSections;
    }

    const defaultPageId = defaultPage.id;

    return mergeRoshalSections(
      defaultRoshalSections.filter(
        (section) => section.pageId === defaultPageId,
      ),
      mappedSections,
    );
  } catch {
    if (!defaultPage) {
      return [];
    }

    const defaultPageId = defaultPage.id;

    return defaultRoshalSections.filter(
      (section) => section.pageId === defaultPageId,
    );
  }
}

export async function getRoshalPageBundle(slug: string) {
  const page = await getRoshalPageBySlug(slug);

  if (!page) {
    return null;
  }

  const sections = await getRoshalSectionsForPage(page.id);

  return { page, sections: sections.filter((section) => section.isEnabled) };
}

export async function getRoshalProducts() {
  try {
    const products = await db
      .select()
      .from(roshalProducts)
      .orderBy(asc(roshalProducts.sortOrder), asc(roshalProducts.nameEn));

    return mergeRoshalProducts(products.map(mapProduct)).filter(
      (product) => product.isPublished,
    );
  } catch {
    return defaultRoshalProducts;
  }
}

export async function getAllRoshalProducts() {
  try {
    const products = await db
      .select()
      .from(roshalProducts)
      .orderBy(asc(roshalProducts.sortOrder), asc(roshalProducts.nameEn));

    return products.length
      ? mergeRoshalProducts(products.map(mapProduct))
      : defaultRoshalProducts;
  } catch {
    return defaultRoshalProducts;
  }
}

export async function getFeaturedRoshalProducts(limit = 4) {
  const products = await getRoshalProducts();
  return products.filter((product) => product.isFeatured).slice(0, limit);
}

export async function getRoshalProductBySlug(slug: string) {
  try {
    const [product] = await db
      .select()
      .from(roshalProducts)
      .where(eq(roshalProducts.slug, slug))
      .limit(1);

    if (product) {
      return product.isPublished ? mapProduct(product) : null;
    }

    return (
      (await getAllRoshalProducts()).find((item) => item.slug === slug) || null
    );
  } catch {
    return defaultRoshalProducts.find((item) => item.slug === slug) || null;
  }
}

export async function getRoshalOrders() {
  try {
    const orders = await db
      .select()
      .from(roshalOrders)
      .orderBy(desc(roshalOrders.createdAt));

    return orders.length ? orders.map(mapOrder) : [];
  } catch {
    return [];
  }
}

export async function getRoshalOrdersForUser(userId: string) {
  try {
    const orders = await db
      .select()
      .from(roshalOrders)
      .where(eq(roshalOrders.userId, userId))
      .orderBy(desc(roshalOrders.createdAt));

    return orders.map(mapOrder);
  } catch {
    return [];
  }
}

export async function getRoshalOrderById(id: string) {
  try {
    const [order] = await db
      .select()
      .from(roshalOrders)
      .where(eq(roshalOrders.id, id))
      .limit(1);

    return order ? mapOrder(order) : null;
  } catch {
    return null;
  }
}

function _normalizeLookupPhone(value: string) {
  return value.replace(/\D/g, "");
}

export async function getRoshalOrderByLookup(orderNumber: string) {
  try {
    const [order] = await db
      .select()
      .from(roshalOrders)
      .where(eq(roshalOrders.orderNumber, orderNumber.trim().toUpperCase()))
      .limit(1);

    if (!order) {
      return null;
    }

    return mapOrder(order);
  } catch {
    return null;
  }
}

export async function getRoshalDashboardSnapshot(): Promise<RoshalDashboardSnapshot> {
  const [products, pages, orders, members] = await Promise.all([
    getAllRoshalProducts(),
    getRoshalPages(),
    getRoshalOrders(),
    getRoshalUsers(),
  ]);

  return {
    productCount: products.length,
    publishedProductCount: products.filter((product) => product.isPublished)
      .length,
    lowStockProductCount: products.filter(
      (product) => product.inventory > 0 && product.inventory <= 10,
    ).length,
    outOfStockProductCount: products.filter((product) => product.inventory <= 0)
      .length,
    orderCount: orders.length,
    pendingOrderCount: orders.filter((order) =>
      ["pending", "payment-review", "confirmed", "processing"].includes(
        order.status,
      ),
    ).length,
    userCount: members.length,
    marketingPageCount: pages.length,
    featuredProducts: products
      .filter((product) => product.isFeatured)
      .slice(0, 4),
    recentOrders: orders.slice(0, 5),
  };
}

export async function getRoshalUsers() {
  try {
    const records = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        phone: users.phone,
        preferredLanguage: users.preferredLanguage,
        isActive: users.isActive,
        image: users.image,
        defaultAddress: users.defaultAddress,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(asc(users.name));

    return records.map((record) => ({
      ...record,
      role: record.role === "admin" ? "admin" : "user",
    }));
  } catch {
    return [];
  }
}
