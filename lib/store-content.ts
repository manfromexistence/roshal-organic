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
import { ensureRoshalCmsSchema } from "@/lib/store-cms-schema";
import {
  defaultRoshalPages,
  defaultRoshalPaymentSettings,
  defaultRoshalProducts,
  defaultRoshalSections,
  defaultRoshalSiteSettings,
} from "@/lib/store-defaults";
import {
  normalizeRoshalDeliverySettings,
  normalizeRoshalTwoZoneDeliveryZones,
} from "@/lib/store-delivery";
import { safeJsonParse } from "@/lib/store-format";
import {
  normalizeRoshalAssetPath,
  normalizeRoshalProductMedia,
} from "@/lib/store-media";
import { normalizeRoshalPaymentMethodKey } from "@/lib/store-payment-methods";
import { ensureRoshalPaymentSettingsSchema } from "@/lib/store-payment-settings-schema";
import {
  getRoshalProductSizeOptions,
  normalizeRoshalProductPurchaseOptions,
} from "@/lib/store-product-options";
import { ensureRoshalProductSchema } from "@/lib/store-product-schema";
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
  return normalizeRoshalPaymentMethodKey(value);
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
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mergeRoshalPages(pages: RoshalMarketingPage[]) {
  const pageBySlug = new Map(pages.map((page) => [page.slug, page]));
  const mergedPages: RoshalMarketingPage[] = [];
  const seenSlugs = new Set<string>();

  for (const defaultPage of defaultRoshalPages) {
    const page = pageBySlug.get(defaultPage.slug);

    if (page?.status === "deleted") {
      seenSlugs.add(defaultPage.slug);
      continue;
    }

    const mergedPage = page || defaultPage;
    mergedPages.push(mergedPage);
    seenSlugs.add(mergedPage.slug);
  }

  const customPages = pages
    .filter((page) => !seenSlugs.has(page.slug) && page.status !== "deleted")
    .sort((left, right) => left.slug.localeCompare(right.slug));

  return [...mergedPages, ...customPages];
}

function normalizeMarketingSectionItems(
  itemsJson: string | null | undefined,
): RoshalMarketingSection["items"] {
  const items = safeJsonParse<Record<string, unknown>[]>(itemsJson, []);

  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item, index) => {
      const parsedSortOrder = Number(item.sortOrder);

      return {
        index,
        item: {
          ...item,
          imageUrl: normalizeRoshalAssetPath(
            typeof item.imageUrl === "string" ? item.imageUrl : "",
            "",
          ),
          sortOrder: Number.isFinite(parsedSortOrder) ? parsedSortOrder : index,
        } as RoshalMarketingSection["items"][number],
      };
    })
    .sort((left, right) => {
      const leftSortOrder = Number.isFinite(Number(left.item.sortOrder))
        ? Number(left.item.sortOrder)
        : 0;
      const rightSortOrder = Number.isFinite(Number(right.item.sortOrder))
        ? Number(right.item.sortOrder)
        : 0;

      if (leftSortOrder !== rightSortOrder) {
        return leftSortOrder - rightSortOrder;
      }

      return left.index - right.index;
    })
    .map(({ item }) => item);
}

function localizedSectionItemTextHasContent(
  value: RoshalMarketingSection["items"][number]["title"],
) {
  return Boolean(value?.bn?.trim() || value?.en?.trim());
}

function sectionItemHasImage(item: RoshalMarketingSection["items"][number]) {
  return Boolean(normalizeRoshalAssetPath(item.imageUrl || "", "").trim());
}

function buildSeededHeroItems(
  storedItems: RoshalMarketingSection["items"],
  defaultItems: RoshalMarketingSection["items"],
) {
  if (defaultItems.length === 0) {
    return storedItems;
  }

  const maxItems = Math.max(storedItems.length, defaultItems.length);

  return Array.from({ length: maxItems })
    .map((_, index) => {
      const storedItem = storedItems[index];
      const defaultItem = defaultItems[index % defaultItems.length];
      const imageUrl = normalizeRoshalAssetPath(
        storedItem?.imageUrl || defaultItem?.imageUrl || "",
        "",
      );
      const parsedSortOrder = Number(storedItem?.sortOrder);

      return {
        ...defaultItem,
        ...storedItem,
        imageUrl,
        sortOrder: Number.isFinite(parsedSortOrder)
          ? parsedSortOrder
          : (defaultItem?.sortOrder ?? index),
        styles: {
          ...(defaultItem?.styles || {}),
          ...(storedItem?.styles || {}),
        },
      };
    })
    .filter(
      (item) =>
        sectionItemHasImage(item) ||
        localizedSectionItemTextHasContent(item.title) ||
        localizedSectionItemTextHasContent(item.body),
    );
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
    items: normalizeMarketingSectionItems(row.itemsJson),
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

let cmsDefaultsSeedPromise: Promise<void> | null = null;

const homeSectionDefaultEnableRepairDate = new Date("2026-05-03T00:00:00.000Z");

function isBeforeHomeSectionDefaultEnableRepair(date: Date | null) {
  return !date || date.getTime() < homeSectionDefaultEnableRepairDate.getTime();
}

async function enableDefaultHomeSectionsOnce(
  refreshedPages: (typeof roshalPages.$inferSelect)[],
  existingSections: (typeof roshalSections.$inferSelect)[],
  timestamp: Date,
) {
  const homePage = refreshedPages.find((page) => page.slug === "home");

  if (!homePage) {
    return;
  }

  const defaultHomeSectionKeys = new Set(
    defaultRoshalSections
      .filter((section) => section.pageId === "page-home")
      .map((section) => section.sectionKey),
  );
  const disabledDefaultHomeSections = existingSections.filter(
    (section) =>
      section.pageId === homePage.id &&
      defaultHomeSectionKeys.has(section.sectionKey) &&
      !section.isEnabled &&
      isBeforeHomeSectionDefaultEnableRepair(section.updatedAt),
  );

  for (const section of disabledDefaultHomeSections) {
    await db
      .update(roshalSections)
      .set({
        isEnabled: true,
        updatedAt: timestamp,
      })
      .where(eq(roshalSections.id, section.id));
  }
}

async function seedMissingHomeHeroSlides(
  refreshedPages: (typeof roshalPages.$inferSelect)[],
  existingSections: (typeof roshalSections.$inferSelect)[],
  timestamp: Date,
) {
  const defaultHomePage = defaultRoshalPages.find(
    (page) => page.id === "page-home",
  );
  const storedHomePage = defaultHomePage
    ? refreshedPages.find((page) => page.slug === defaultHomePage.slug)
    : null;
  const defaultHeroSection = defaultRoshalSections.find(
    (section) =>
      section.pageId === "page-home" && section.sectionKey === "hero",
  );

  if (!storedHomePage || !defaultHeroSection) {
    return;
  }

  const storedHeroSection = existingSections.find(
    (section) =>
      section.pageId === storedHomePage.id && section.sectionKey === "hero",
  );

  if (!storedHeroSection) {
    return;
  }

  const storedItems = normalizeMarketingSectionItems(
    storedHeroSection.itemsJson,
  );
  const hasImageBackedSlides = storedItems.some(sectionItemHasImage);
  const hasDefaultHeroTitle =
    !storedHeroSection.titleEn ||
    storedHeroSection.titleEn === defaultHeroSection.title.en;
  const shouldEnableDefaultHero =
    !storedHeroSection.isEnabled &&
    (hasDefaultHeroTitle || !hasImageBackedSlides);

  if (hasImageBackedSlides && !shouldEnableDefaultHero) {
    return;
  }

  const seededItems = hasImageBackedSlides
    ? storedItems
    : buildSeededHeroItems(storedItems, defaultHeroSection.items);

  if (!seededItems.some(sectionItemHasImage)) {
    return;
  }

  await db
    .update(roshalSections)
    .set({
      imageUrl:
        normalizeRoshalAssetPath(storedHeroSection.imageUrl || "", "") ||
        defaultHeroSection.imageUrl ||
        null,
      itemsJson: JSON.stringify(seededItems),
      stylesJson:
        storedHeroSection.stylesJson ||
        JSON.stringify(defaultHeroSection.styles || {}),
      isEnabled: shouldEnableDefaultHero ? true : storedHeroSection.isEnabled,
      updatedAt: timestamp,
    })
    .where(eq(roshalSections.id, storedHeroSection.id));
}

async function seedMissingRoshalCmsDefaults() {
  await ensureRoshalCmsSchema();

  const timestamp = new Date();
  const existingPages = await db.select().from(roshalPages);
  const pagesBySlug = new Map(existingPages.map((page) => [page.slug, page]));
  const pageIds = new Set(existingPages.map((page) => page.id));

  for (const page of defaultRoshalPages) {
    if (pagesBySlug.has(page.slug) || pageIds.has(page.id)) {
      continue;
    }

    await db.insert(roshalPages).values({
      id: page.id,
      slug: page.slug,
      navigationLabelBn: page.navigationLabel.bn,
      navigationLabelEn: page.navigationLabel.en,
      titleBn: page.title.bn,
      titleEn: page.title.en,
      descriptionBn: page.description.bn || null,
      descriptionEn: page.description.en || null,
      heroImage: page.heroImage || null,
      status: page.status,
      showInNavigation: page.showInNavigation,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    pagesBySlug.set(page.slug, {
      id: page.id,
      slug: page.slug,
      navigationLabelBn: page.navigationLabel.bn,
      navigationLabelEn: page.navigationLabel.en,
      titleBn: page.title.bn,
      titleEn: page.title.en,
      descriptionBn: page.description.bn || null,
      descriptionEn: page.description.en || null,
      heroImage: page.heroImage || null,
      status: page.status,
      showInNavigation: page.showInNavigation,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    pageIds.add(page.id);
  }

  const refreshedPages = await db.select().from(roshalPages);
  const pageByDefaultId = new Map(
    defaultRoshalPages.map((page) => {
      const storedPage =
        refreshedPages.find((item) => item.slug === page.slug) || null;

      return [page.id, storedPage];
    }),
  );
  const existingSections = await db.select().from(roshalSections);
  const sectionKeys = new Set(
    existingSections.map(
      (section) => `${section.pageId}:${section.sectionKey}`,
    ),
  );
  const sectionIds = new Set(existingSections.map((section) => section.id));

  for (const section of defaultRoshalSections) {
    const page = pageByDefaultId.get(section.pageId);

    if (!page || page.status === "deleted") {
      continue;
    }

    const sectionKey = `${page.id}:${section.sectionKey}`;

    if (sectionKeys.has(sectionKey)) {
      continue;
    }

    const sectionId = sectionIds.has(section.id)
      ? `${section.id}-${page.id}`
      : section.id;

    await db.insert(roshalSections).values({
      id: sectionId,
      pageId: page.id,
      sectionKey: section.sectionKey,
      type: section.type,
      sortOrder: section.sortOrder,
      layout: section.layout,
      variant: section.variant,
      isEnabled: section.isEnabled,
      eyebrowBn: section.eyebrow.bn || null,
      eyebrowEn: section.eyebrow.en || null,
      titleBn: section.title.bn || null,
      titleEn: section.title.en || null,
      bodyBn: section.body.bn || null,
      bodyEn: section.body.en || null,
      ctaLabelBn: section.ctaLabel.bn || null,
      ctaLabelEn: section.ctaLabel.en || null,
      ctaHref: section.ctaHref || null,
      imageUrl: section.imageUrl || null,
      itemsJson: JSON.stringify(section.items || []),
      stylesJson: JSON.stringify(section.styles || {}),
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    sectionKeys.add(sectionKey);
    sectionIds.add(sectionId);
  }

  await seedMissingHomeHeroSlides(refreshedPages, existingSections, timestamp);
  await enableDefaultHomeSectionsOnce(
    refreshedPages,
    existingSections,
    timestamp,
  );
}

async function ensureRoshalCmsDefaultsSeeded() {
  if (!cmsDefaultsSeedPromise) {
    cmsDefaultsSeedPromise = seedMissingRoshalCmsDefaults().catch((error) => {
      cmsDefaultsSeedPromise = null;
      throw error;
    });
  }

  return cmsDefaultsSeedPromise;
}

function mapProduct(row: typeof roshalProducts.$inferSelect): RoshalProduct {
  const features = safeJsonParse(row.featuresBnJson, []).map(
    (bnFeature: string, index: number) => ({
      bn: bnFeature,
      en: safeJsonParse<string[]>(row.featuresEnJson, [])[index] || bnFeature,
    }),
  );

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
    features,
    purchaseOptions: normalizeRoshalProductPurchaseOptions({
      fallbackCompareAtPrice: row.compareAtPrice,
      fallbackInventory: row.inventory,
      fallbackPrice: row.price,
      legacySizeOptions: getRoshalProductSizeOptions(features),
      value: row.purchaseOptionsJson,
    }),
    isFeatured: Boolean(row.isFeatured),
    isPublished: Boolean(row.isPublished),
    sortOrder: row.sortOrder,
    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function mergeRoshalProducts(products: RoshalProduct[]) {
  const deletedKeys = new Set<string>();
  const activeProducts = products.filter((product) => {
    if (product.deletedAt) {
      deletedKeys.add(product.id);
      deletedKeys.add(product.slug);
      return false;
    }

    return true;
  });
  const productBySlug = new Map(
    activeProducts.map((product) => [product.slug, product]),
  );
  const productById = new Map(
    activeProducts.map((product) => [product.id, product]),
  );
  const mergedProducts: RoshalProduct[] = [];
  const consumedKeys = new Set<string>();

  for (const defaultProduct of defaultRoshalProducts) {
    if (
      deletedKeys.has(defaultProduct.id) ||
      deletedKeys.has(defaultProduct.slug)
    ) {
      consumedKeys.add(defaultProduct.id);
      consumedKeys.add(defaultProduct.slug);
      continue;
    }

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
        !product.deletedAt &&
        !consumedKeys.has(product.id) &&
        !consumedKeys.has(product.slug),
    )
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.name.en.localeCompare(right.name.en);
    });

  return [...mergedProducts, ...customProducts];
}

const BLOCKED_PUBLIC_PRODUCT_SLUGS = new Set(["modern-executive-desk"]);

function isPublicStorefrontProduct(product: RoshalProduct) {
  if (
    product.id.startsWith("vegetable-") ||
    product.slug.startsWith("vegetable-")
  ) {
    return false;
  }

  return !BLOCKED_PUBLIC_PRODUCT_SLUGS.has(product.slug);
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
  const safeLabel = {
    bn: option.label?.bn?.trim() || option.label?.en?.trim() || key,
    en: option.label?.en?.trim() || option.label?.bn?.trim() || key,
  };
  const label =
    key === "cash_on_delivery" && !/cod/i.test(safeLabel.en)
      ? {
          bn: safeLabel.bn.includes("COD")
            ? safeLabel.bn
            : `${safeLabel.bn} (COD)`,
          en: `${safeLabel.en} (COD)`,
        }
      : safeLabel;

  return {
    ...option,
    key,
    label,
    merchantLabel: {
      bn: option.merchantLabel?.bn?.trim() || "",
      en: option.merchantLabel?.en?.trim() || "",
    },
    accountType: option.accountType?.trim() || "mobile-wallet",
    accountNumber: option.accountNumber?.trim() || "",
    instructions: {
      bn: option.instructions?.bn?.trim() || "",
      en: option.instructions?.en?.trim() || "",
    },
    guideImageUrl: option.guideImageUrl?.trim() || "",
    requiresProof: false,
  };
}

function mapPaymentSettings(
  row: typeof roshalPaymentSettings.$inferSelect,
): RoshalPaymentSettings {
  const parsedOptions = safeJsonParse<unknown>(row.optionsJson, null);
  const storedOptions = Array.isArray(parsedOptions)
    ? (parsedOptions as RoshalPaymentSettings["options"])
    : defaultRoshalPaymentSettings.options;
  const defaultOptionsByKey = new Map(
    defaultRoshalPaymentSettings.options.map((option) => [
      normalizePaymentMethod(option.key),
      sanitizePaymentOption(option),
    ]),
  );
  const options = storedOptions
    .map((option, index) => {
      const key = normalizePaymentMethod(option.key);
      const defaultOption = defaultOptionsByKey.get(key);

      return sanitizePaymentOption({
        ...(defaultOption || {}),
        ...option,
        key,
        label: option.label ||
          defaultOption?.label || {
            bn: key,
            en: key,
          },
        merchantLabel: option.merchantLabel ||
          defaultOption?.merchantLabel || {
            bn: "",
            en: "",
          },
        instructions: option.instructions ||
          defaultOption?.instructions || {
            bn: "",
            en: "",
          },
        guideImageUrl: normalizeRoshalAssetPath(option.guideImageUrl, ""),
        sortOrder: Number.isFinite(Number(option.sortOrder))
          ? Number(option.sortOrder)
          : index,
      });
    })
    .sort((left, right) => {
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
    deliveryZones: normalizeRoshalTwoZoneDeliveryZones(
      safeJsonParse(
        row.deliveryZonesJson,
        defaultRoshalSiteSettings.deliveryZones,
      ),
      defaultRoshalSiteSettings.deliveryZones,
    ),
    deliverySettings: normalizeRoshalDeliverySettings(
      {
        enableFreeDelivery: Boolean(row.freeDeliveryEnabled),
        freeDeliveryThreshold: row.freeDeliveryThreshold,
      },
      defaultRoshalSiteSettings.deliverySettings,
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
    await ensureRoshalPaymentSettingsSchema();
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
    await ensureRoshalCmsDefaultsSeeded();
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
    await ensureRoshalCmsDefaultsSeeded();
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
    await ensureRoshalCmsDefaultsSeeded();
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

export async function getRoshalPageBundle(
  slug: string,
  options: { includeDisabled?: boolean } = {},
) {
  const page = await getRoshalPageBySlug(slug);

  if (!page) {
    return null;
  }

  const sections = await getRoshalSectionsForPage(page.id);

  return {
    page,
    sections: options.includeDisabled
      ? sections
      : sections.filter((section) => section.isEnabled),
  };
}

export async function getRoshalProducts() {
  try {
    await ensureRoshalProductSchema();
    const products = await db
      .select()
      .from(roshalProducts)
      .orderBy(asc(roshalProducts.sortOrder), asc(roshalProducts.nameEn));

    return mergeRoshalProducts(products.map(mapProduct)).filter(
      (product) => product.isPublished && isPublicStorefrontProduct(product),
    );
  } catch {
    return defaultRoshalProducts.filter(isPublicStorefrontProduct);
  }
}

export async function getAllRoshalProducts() {
  try {
    await ensureRoshalProductSchema();
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
    await ensureRoshalProductSchema();
    const [product] = await db
      .select()
      .from(roshalProducts)
      .where(eq(roshalProducts.slug, slug))
      .limit(1);

    if (product) {
      if (product.deletedAt) {
        return null;
      }

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
      .orderBy(desc(users.createdAt), asc(users.name));

    return records
      .filter(
        (record) =>
          !(
            record.email.startsWith("deleted-") &&
            record.email.endsWith("@roshal-organic.local")
          ),
      )
      .map((record) => ({
        ...record,
        role: record.role === "admin" ? "admin" : "user",
      }));
  } catch {
    return [];
  }
}
