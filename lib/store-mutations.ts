import { and, eq, gte, inArray, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  roshalCategories,
  roshalOrders,
  roshalPages,
  roshalPaymentSettings,
  roshalProducts,
  roshalSections,
  roshalSiteSettings,
  roshalSubcategories,
  users,
} from "@/lib/schema";
import { getRoshalPaymentSettings } from "@/lib/store-content";
import { defaultRoshalSiteSettings } from "@/lib/store-defaults";
import {
  normalizeRoshalDeliveryZones,
  resolveRoshalDeliveryEstimate,
} from "@/lib/store-delivery";
import { safeJsonParse } from "@/lib/store-format";
import {
  createRoshalGatewayCheckoutSession,
  hasRoshalGatewayIntegration,
  readRoshalGatewayCallbackPayload,
  verifyRoshalGatewayTransaction,
} from "@/lib/store-payments";
import {
  isRoshalReservedPageSlug,
  isValidRoshalRouteSlug,
  isValidRoshalSectionKey,
  normalizeRoshalRouteSlug,
  normalizeRoshalSectionKey,
} from "@/lib/store-routes";
import { ensureRoshalSiteSettingsSchema } from "@/lib/store-site-settings-schema";
import { ensureRoshalTaxonomySchema } from "@/lib/store-taxonomy-schema";
import type {
  RoshalDeliveryZone,
  RoshalOrderItem,
  RoshalPaymentGatewayProvider,
  RoshalPaymentMethod,
  RoshalPaymentOption,
  RoshalRole,
} from "@/lib/store-types";

function toOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeRole(role: string | null | undefined): RoshalRole {
  return role === "admin" ? "admin" : "user";
}

function nextId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nextRoshalOrderNumber(timestamp: Date) {
  const compactTimestamp = timestamp
    .toISOString()
    .replaceAll(/[-:TZ.]/g, "")
    .slice(0, 14);
  const randomSuffix = crypto.randomUUID().replaceAll("-", "").slice(0, 6);

  return `RO-${compactTimestamp}-${randomSuffix}`.toUpperCase();
}

type RoshalTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type RoshalDbClient = typeof db | RoshalTransaction;

const ROSHAL_CANCELLED_STATUS = "cancelled";

function normalizeSourceKeysInput(keys: string[], fallbackKey: string) {
  const normalized = Array.from(
    new Set(
      keys.map((value) => normalizeRoshalRouteSlug(value)).filter(Boolean),
    ),
  );

  return normalized.length > 0 ? normalized : [fallbackKey];
}

function getRoshalPaymentWorkflowState(
  option: Pick<RoshalPaymentOption, "key" | "mode" | "requiresProof">,
) {
  if (option.key === "cash_on_delivery") {
    return {
      requiresManualReview: false,
      status: "pending",
      paymentStatus: "pending",
      trackingNote:
        "Cash on delivery selected. Please keep the order amount ready at delivery.",
    };
  }

  const liveGatewayAvailable =
    option.mode === "gateway" && hasRoshalGatewayIntegration(option.key);

  if (option.mode === "gateway" && !liveGatewayAvailable) {
    return {
      requiresManualReview: true,
      status: "payment-review",
      paymentStatus: "pending",
      trackingNote:
        "Secure gateway payment is not configured yet. An admin will follow up to complete payment.",
    };
  }

  if (option.mode === "manual") {
    return {
      requiresManualReview: true,
      status: "payment-review",
      paymentStatus: "pending",
      trackingNote: "Waiting for admin payment confirmation.",
    };
  }

  return {
    requiresManualReview: false,
    status: "pending",
    paymentStatus: "pending",
    trackingNote: "Order placed successfully.",
  };
}

function shouldRequireRoshalPaymentProof(
  option: Pick<RoshalPaymentOption, "key" | "mode" | "requiresProof">,
) {
  if (option.key === "cash_on_delivery") {
    return false;
  }

  if (option.mode !== "gateway") {
    return false;
  }

  return false;
}

function toGatewayMetaJson(value: Record<string, string> | null | undefined) {
  return value && Object.keys(value).length > 0 ? JSON.stringify(value) : null;
}

function amountMatchesRoshalOrder(total: number, amount: number | null) {
  if (amount === null) {
    return false;
  }

  return Math.abs(amount - total) < 0.01;
}

function getRoshalItemQuantityMap(
  items: Array<{ productId: string; quantity: number }>,
) {
  const quantities = new Map<string, number>();

  for (const item of items) {
    quantities.set(
      item.productId,
      (quantities.get(item.productId) || 0) + item.quantity,
    );
  }

  return quantities;
}

async function reserveRoshalInventory(
  database: RoshalDbClient,
  items: RoshalOrderItem[],
) {
  const quantityMap = getRoshalItemQuantityMap(items);
  const productIds = Array.from(quantityMap.keys());

  if (productIds.length === 0) {
    return;
  }

  const products = await database
    .select({
      id: roshalProducts.id,
      inventory: roshalProducts.inventory,
      nameEn: roshalProducts.nameEn,
    })
    .from(roshalProducts)
    .where(inArray(roshalProducts.id, productIds));
  const productMap = new Map(products.map((product) => [product.id, product]));

  if (productMap.size !== productIds.length) {
    throw new RoshalCheckoutError(
      "product-unavailable",
      "One or more products are no longer available for checkout.",
    );
  }

  for (const [productId, quantity] of quantityMap.entries()) {
    const product = productMap.get(productId);

    if (!product) {
      throw new RoshalCheckoutError(
        "product-unavailable",
        "One or more products are no longer available for checkout.",
      );
    }

    if (quantity > product.inventory) {
      throw new RoshalCheckoutError(
        "insufficient-inventory",
        `${product.nameEn} does not have enough inventory for the requested quantity.`,
      );
    }
  }

  const timestamp = new Date();

  for (const [productId, quantity] of quantityMap.entries()) {
    const updatedRows = await database
      .update(roshalProducts)
      .set({
        inventory: sql`${roshalProducts.inventory} - ${quantity}`,
        updatedAt: timestamp,
      })
      .where(
        and(
          eq(roshalProducts.id, productId),
          gte(roshalProducts.inventory, quantity),
        ),
      )
      .returning({
        id: roshalProducts.id,
      });

    if (updatedRows.length === 0) {
      const product = productMap.get(productId);

      throw new RoshalCheckoutError(
        "insufficient-inventory",
        `${product?.nameEn || "A product"} does not have enough inventory for the requested quantity.`,
      );
    }
  }
}

async function restoreRoshalInventory(
  database: RoshalDbClient,
  items: RoshalOrderItem[],
) {
  const quantityMap = getRoshalItemQuantityMap(items);
  const timestamp = new Date();

  for (const [productId, quantity] of quantityMap.entries()) {
    await database
      .update(roshalProducts)
      .set({
        inventory: sql`${roshalProducts.inventory} + ${quantity}`,
        updatedAt: timestamp,
      })
      .where(eq(roshalProducts.id, productId));
  }
}

const roshalOrderItemRequestSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

const roshalCheckoutRequestSchema = z.object({
  userId: z.string().trim().min(1).nullable().optional(),
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  email: z
    .string()
    .trim()
    .email()
    .max(190)
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform((value) => value || undefined),
  addressLine1: z.string().trim().min(3).max(255),
  addressLine2: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform((value) => value || undefined),
  city: z.string().trim().min(2).max(120),
  postalCode: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform((value) => value || undefined),
  notes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform((value) => value || undefined),
  paymentMethod: z.enum([
    "cash_on_delivery",
    "card",
    "bkash",
    "nagad",
    "rocket",
    "upay",
  ]),
  paymentReference: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform((value) => value || undefined),
  paymentSender: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform((value) => value || undefined),
  paymentProofUrl: z
    .string()
    .trim()
    .url()
    .max(500)
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform((value) => value || undefined),
  items: z.array(roshalOrderItemRequestSchema).min(1).max(20),
});

export class RoshalCheckoutError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = "RoshalCheckoutError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class RoshalOrderStatusError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = "RoshalOrderStatusError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class RoshalUserRoleError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = "RoshalUserRoleError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class RoshalPageError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = "RoshalPageError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class RoshalTaxonomyError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = "RoshalTaxonomyError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class RoshalSectionError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = "RoshalSectionError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class RoshalProductError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = "RoshalProductError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export interface UpsertRoshalSiteSettingsInput {
  id?: string;
  brandName: string;
  taglineBn: string;
  taglineEn: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  whatsappPhone?: string | null;
  facebookUrl?: string | null;
  addressBn?: string | null;
  addressEn?: string | null;
  heroLayout: string;
  cardStyle: string;
  sectionSpacing: string;
  primaryCtaHref: string;
  primaryCtaLabelBn: string;
  primaryCtaLabelEn: string;
  deliveryZones: RoshalDeliveryZone[];
}

export async function upsertRoshalSiteSettings(
  input: UpsertRoshalSiteSettingsInput,
) {
  await ensureRoshalSiteSettingsSchema();

  const id = input.id || "site-settings";
  const timestamp = new Date();
  const deliveryZones = normalizeRoshalDeliveryZones(
    input.deliveryZones,
    defaultRoshalSiteSettings.deliveryZones,
  );

  await db
    .insert(roshalSiteSettings)
    .values({
      id,
      brandName: input.brandName,
      taglineBn: input.taglineBn,
      taglineEn: input.taglineEn,
      contactPhone: toOptionalText(input.contactPhone),
      contactEmail: toOptionalText(input.contactEmail),
      whatsappPhone: toOptionalText(input.whatsappPhone),
      facebookUrl: toOptionalText(input.facebookUrl),
      addressBn: toOptionalText(input.addressBn),
      addressEn: toOptionalText(input.addressEn),
      heroLayout: input.heroLayout,
      cardStyle: input.cardStyle,
      sectionSpacing: input.sectionSpacing,
      primaryCtaHref: input.primaryCtaHref,
      primaryCtaLabelBn: input.primaryCtaLabelBn,
      primaryCtaLabelEn: input.primaryCtaLabelEn,
      deliveryZonesJson: JSON.stringify(deliveryZones),
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: roshalSiteSettings.id,
      set: {
        brandName: input.brandName,
        taglineBn: input.taglineBn,
        taglineEn: input.taglineEn,
        contactPhone: toOptionalText(input.contactPhone),
        contactEmail: toOptionalText(input.contactEmail),
        whatsappPhone: toOptionalText(input.whatsappPhone),
        facebookUrl: toOptionalText(input.facebookUrl),
        addressBn: toOptionalText(input.addressBn),
        addressEn: toOptionalText(input.addressEn),
        heroLayout: input.heroLayout,
        cardStyle: input.cardStyle,
        sectionSpacing: input.sectionSpacing,
        primaryCtaHref: input.primaryCtaHref,
        primaryCtaLabelBn: input.primaryCtaLabelBn,
        primaryCtaLabelEn: input.primaryCtaLabelEn,
        deliveryZonesJson: JSON.stringify(deliveryZones),
        updatedAt: timestamp,
      },
    });
}

export interface UpsertRoshalPaymentSettingsInput {
  id?: string;
  manualReviewNoticeBn: string;
  manualReviewNoticeEn: string;
  supportMessageBn: string;
  supportMessageEn: string;
  options: RoshalPaymentOption[];
}

export async function upsertRoshalPaymentSettings(
  input: UpsertRoshalPaymentSettingsInput,
) {
  const id = input.id || "payment-settings";
  const timestamp = new Date();

  await db
    .insert(roshalPaymentSettings)
    .values({
      id,
      manualReviewNoticeBn: input.manualReviewNoticeBn,
      manualReviewNoticeEn: input.manualReviewNoticeEn,
      supportMessageBn: input.supportMessageBn,
      supportMessageEn: input.supportMessageEn,
      optionsJson: JSON.stringify(input.options),
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: roshalPaymentSettings.id,
      set: {
        manualReviewNoticeBn: input.manualReviewNoticeBn,
        manualReviewNoticeEn: input.manualReviewNoticeEn,
        supportMessageBn: input.supportMessageBn,
        supportMessageEn: input.supportMessageEn,
        optionsJson: JSON.stringify(input.options),
        updatedAt: timestamp,
      },
    });
}

export interface UpsertRoshalCategoryInput {
  id?: string;
  key: string;
  labelBn: string;
  labelEn: string;
  descriptionBn?: string | null;
  descriptionEn?: string | null;
  imageUrl?: string | null;
  sourceKeys?: string[];
  isEnabled: boolean;
  showInNavigation: boolean;
  showOnHomepage: boolean;
  sortOrder: number;
}

export async function upsertRoshalCategory(input: UpsertRoshalCategoryInput) {
  await ensureRoshalTaxonomySchema();

  const id = input.id || nextId("category");
  const timestamp = new Date();
  const key = normalizeRoshalRouteSlug(input.key);

  if (!key || !isValidRoshalRouteSlug(key)) {
    throw new RoshalTaxonomyError(
      "invalid-category-key",
      "Category keys must use lowercase letters, numbers, and hyphens only.",
    );
  }

  const [existingCategory] = await db
    .select({
      id: roshalCategories.id,
    })
    .from(roshalCategories)
    .where(and(eq(roshalCategories.key, key), ne(roshalCategories.id, id)))
    .limit(1);

  if (existingCategory) {
    throw new RoshalTaxonomyError(
      "duplicate-category-key",
      "Another category is already using this key.",
    );
  }

  const sourceKeys = normalizeSourceKeysInput(input.sourceKeys || [], key);

  await db
    .insert(roshalCategories)
    .values({
      id,
      key,
      labelBn: input.labelBn,
      labelEn: input.labelEn,
      descriptionBn: toOptionalText(input.descriptionBn),
      descriptionEn: toOptionalText(input.descriptionEn),
      imageUrl: toOptionalText(input.imageUrl),
      sourceKeysJson: JSON.stringify(sourceKeys),
      isEnabled: input.isEnabled,
      showInNavigation: input.showInNavigation,
      showOnHomepage: input.showOnHomepage,
      sortOrder: input.sortOrder,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: roshalCategories.id,
      set: {
        key,
        labelBn: input.labelBn,
        labelEn: input.labelEn,
        descriptionBn: toOptionalText(input.descriptionBn),
        descriptionEn: toOptionalText(input.descriptionEn),
        imageUrl: toOptionalText(input.imageUrl),
        sourceKeysJson: JSON.stringify(sourceKeys),
        isEnabled: input.isEnabled,
        showInNavigation: input.showInNavigation,
        showOnHomepage: input.showOnHomepage,
        sortOrder: input.sortOrder,
        updatedAt: timestamp,
      },
    });

  return id;
}

export interface UpsertRoshalSubcategoryInput {
  id?: string;
  categoryId: string;
  key: string;
  labelBn: string;
  labelEn: string;
  descriptionBn?: string | null;
  descriptionEn?: string | null;
  imageUrl?: string | null;
  sourceKeys?: string[];
  isEnabled: boolean;
  showInNavigation: boolean;
  sortOrder: number;
}

export async function upsertRoshalSubcategory(
  input: UpsertRoshalSubcategoryInput,
) {
  await ensureRoshalTaxonomySchema();

  const id = input.id || nextId("subcategory");
  const timestamp = new Date();
  const key = normalizeRoshalRouteSlug(input.key);

  if (!key || !isValidRoshalRouteSlug(key)) {
    throw new RoshalTaxonomyError(
      "invalid-subcategory-key",
      "Subcategory keys must use lowercase letters, numbers, and hyphens only.",
    );
  }

  const [existingCategory] = await db
    .select({
      id: roshalCategories.id,
    })
    .from(roshalCategories)
    .where(eq(roshalCategories.id, input.categoryId))
    .limit(1);

  if (!existingCategory) {
    throw new RoshalTaxonomyError(
      "category-not-found",
      "The selected parent category could not be found.",
      404,
    );
  }

  const [existingSubcategory] = await db
    .select({
      id: roshalSubcategories.id,
    })
    .from(roshalSubcategories)
    .where(
      and(eq(roshalSubcategories.key, key), ne(roshalSubcategories.id, id)),
    )
    .limit(1);

  if (existingSubcategory) {
    throw new RoshalTaxonomyError(
      "duplicate-subcategory-key",
      "Another subcategory is already using this key.",
    );
  }

  const sourceKeys = normalizeSourceKeysInput(input.sourceKeys || [], key);

  await db
    .insert(roshalSubcategories)
    .values({
      id,
      categoryId: input.categoryId,
      key,
      labelBn: input.labelBn,
      labelEn: input.labelEn,
      descriptionBn: toOptionalText(input.descriptionBn),
      descriptionEn: toOptionalText(input.descriptionEn),
      imageUrl: toOptionalText(input.imageUrl),
      sourceKeysJson: JSON.stringify(sourceKeys),
      isEnabled: input.isEnabled,
      showInNavigation: input.showInNavigation,
      sortOrder: input.sortOrder,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: roshalSubcategories.id,
      set: {
        categoryId: input.categoryId,
        key,
        labelBn: input.labelBn,
        labelEn: input.labelEn,
        descriptionBn: toOptionalText(input.descriptionBn),
        descriptionEn: toOptionalText(input.descriptionEn),
        imageUrl: toOptionalText(input.imageUrl),
        sourceKeysJson: JSON.stringify(sourceKeys),
        isEnabled: input.isEnabled,
        showInNavigation: input.showInNavigation,
        sortOrder: input.sortOrder,
        updatedAt: timestamp,
      },
    });

  return id;
}

export async function deleteRoshalCategory(id: string) {
  await ensureRoshalTaxonomySchema();

  await db.delete(roshalCategories).where(eq(roshalCategories.id, id));
}

export async function deleteRoshalSubcategory(id: string) {
  await ensureRoshalTaxonomySchema();

  await db.delete(roshalSubcategories).where(eq(roshalSubcategories.id, id));
}

export interface UpsertRoshalPageInput {
  id?: string;
  slug: string;
  navigationLabelBn: string;
  navigationLabelEn: string;
  titleBn: string;
  titleEn: string;
  descriptionBn?: string | null;
  descriptionEn?: string | null;
  heroImage?: string | null;
  status: string;
  showInNavigation: boolean;
}

export async function upsertRoshalPage(input: UpsertRoshalPageInput) {
  const id = input.id || nextId("page");
  const timestamp = new Date();
  const slug = normalizeRoshalRouteSlug(input.slug);

  if (!slug || !isValidRoshalRouteSlug(slug)) {
    throw new RoshalPageError(
      "invalid-slug",
      "Page slugs must use lowercase letters, numbers, and hyphens only.",
    );
  }

  if (isRoshalReservedPageSlug(slug)) {
    throw new RoshalPageError(
      "reserved-slug",
      "This page slug is reserved by the storefront and cannot be used.",
    );
  }

  const [existingPage] = await db
    .select({
      id: roshalPages.id,
    })
    .from(roshalPages)
    .where(and(eq(roshalPages.slug, slug), ne(roshalPages.id, id)))
    .limit(1);

  if (existingPage) {
    throw new RoshalPageError(
      "duplicate-slug",
      "Another marketing page is already using this slug.",
    );
  }

  await db
    .insert(roshalPages)
    .values({
      id,
      slug,
      navigationLabelBn: input.navigationLabelBn,
      navigationLabelEn: input.navigationLabelEn,
      titleBn: input.titleBn,
      titleEn: input.titleEn,
      descriptionBn: toOptionalText(input.descriptionBn),
      descriptionEn: toOptionalText(input.descriptionEn),
      heroImage: toOptionalText(input.heroImage),
      status: input.status,
      showInNavigation: input.showInNavigation,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: roshalPages.id,
      set: {
        slug,
        navigationLabelBn: input.navigationLabelBn,
        navigationLabelEn: input.navigationLabelEn,
        titleBn: input.titleBn,
        titleEn: input.titleEn,
        descriptionBn: toOptionalText(input.descriptionBn),
        descriptionEn: toOptionalText(input.descriptionEn),
        heroImage: toOptionalText(input.heroImage),
        status: input.status,
        showInNavigation: input.showInNavigation,
        updatedAt: timestamp,
      },
    });

  return id;
}

export interface UpsertRoshalSectionInput {
  id?: string;
  pageId: string;
  sectionKey: string;
  type: string;
  sortOrder: number;
  layout: string;
  variant: string;
  isEnabled: boolean;
  eyebrowBn?: string | null;
  eyebrowEn?: string | null;
  titleBn?: string | null;
  titleEn?: string | null;
  bodyBn?: string | null;
  bodyEn?: string | null;
  ctaLabelBn?: string | null;
  ctaLabelEn?: string | null;
  ctaHref?: string | null;
  imageUrl?: string | null;
  itemsJson?: string | null;
  stylesJson?: string | null;
}

export async function upsertRoshalSection(input: UpsertRoshalSectionInput) {
  const id = input.id || nextId("section");
  const timestamp = new Date();
  const sectionKey = normalizeRoshalSectionKey(input.sectionKey);

  if (!sectionKey || !isValidRoshalSectionKey(sectionKey)) {
    throw new RoshalSectionError(
      "invalid-section-key",
      "Section keys must use lowercase letters, numbers, and hyphens only.",
    );
  }

  const [existingSection] = await db
    .select({
      id: roshalSections.id,
    })
    .from(roshalSections)
    .where(
      and(
        eq(roshalSections.pageId, input.pageId),
        eq(roshalSections.sectionKey, sectionKey),
        ne(roshalSections.id, id),
      ),
    )
    .limit(1);

  if (existingSection) {
    throw new RoshalSectionError(
      "duplicate-section-key",
      "This page already has a section with the same key.",
    );
  }

  await db
    .insert(roshalSections)
    .values({
      id,
      pageId: input.pageId,
      sectionKey,
      type: input.type,
      sortOrder: input.sortOrder,
      layout: input.layout,
      variant: input.variant,
      isEnabled: input.isEnabled,
      eyebrowBn: toOptionalText(input.eyebrowBn),
      eyebrowEn: toOptionalText(input.eyebrowEn),
      titleBn: toOptionalText(input.titleBn),
      titleEn: toOptionalText(input.titleEn),
      bodyBn: toOptionalText(input.bodyBn),
      bodyEn: toOptionalText(input.bodyEn),
      ctaLabelBn: toOptionalText(input.ctaLabelBn),
      ctaLabelEn: toOptionalText(input.ctaLabelEn),
      ctaHref: toOptionalText(input.ctaHref),
      imageUrl: toOptionalText(input.imageUrl),
      itemsJson: toOptionalText(input.itemsJson),
      stylesJson: toOptionalText(input.stylesJson),
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: roshalSections.id,
      set: {
        pageId: input.pageId,
        sectionKey,
        type: input.type,
        sortOrder: input.sortOrder,
        layout: input.layout,
        variant: input.variant,
        isEnabled: input.isEnabled,
        eyebrowBn: toOptionalText(input.eyebrowBn),
        eyebrowEn: toOptionalText(input.eyebrowEn),
        titleBn: toOptionalText(input.titleBn),
        titleEn: toOptionalText(input.titleEn),
        bodyBn: toOptionalText(input.bodyBn),
        bodyEn: toOptionalText(input.bodyEn),
        ctaLabelBn: toOptionalText(input.ctaLabelBn),
        ctaLabelEn: toOptionalText(input.ctaLabelEn),
        ctaHref: toOptionalText(input.ctaHref),
        imageUrl: toOptionalText(input.imageUrl),
        itemsJson: toOptionalText(input.itemsJson),
        stylesJson: toOptionalText(input.stylesJson),
        updatedAt: timestamp,
      },
    });

  return id;
}

export interface UpsertRoshalProductInput {
  id?: string;
  slug: string;
  sku: string;
  nameBn: string;
  nameEn: string;
  summaryBn: string;
  summaryEn: string;
  descriptionBn: string;
  descriptionEn: string;
  categoryKey: string;
  categoryLabelBn: string;
  categoryLabelEn: string;
  price: number;
  compareAtPrice?: number | null;
  inventory: number;
  badge?: string | null;
  heroImage: string;
  galleryJson?: string | null;
  featuresBnJson?: string | null;
  featuresEnJson?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

export async function upsertRoshalProduct(input: UpsertRoshalProductInput) {
  const id = input.id || nextId("product");
  const timestamp = new Date();
  const slug = normalizeRoshalRouteSlug(input.slug);
  const sku = input.sku.trim().toUpperCase();

  if (!slug || !isValidRoshalRouteSlug(slug)) {
    throw new RoshalProductError(
      "invalid-product-slug",
      "Product slugs must use lowercase letters, numbers, and hyphens only.",
    );
  }

  if (!sku) {
    throw new RoshalProductError(
      "invalid-product-sku",
      "Product SKU is required.",
    );
  }

  if (input.price < 0) {
    throw new RoshalProductError(
      "invalid-product-price",
      "Product price cannot be negative.",
    );
  }

  if (input.inventory < 0) {
    throw new RoshalProductError(
      "invalid-product-inventory",
      "Product inventory cannot be negative.",
    );
  }

  const [existingSlug] = await db
    .select({
      id: roshalProducts.id,
    })
    .from(roshalProducts)
    .where(and(eq(roshalProducts.slug, slug), ne(roshalProducts.id, id)))
    .limit(1);

  if (existingSlug) {
    throw new RoshalProductError(
      "duplicate-product-slug",
      "Another product is already using this slug.",
    );
  }

  const [existingSku] = await db
    .select({
      id: roshalProducts.id,
    })
    .from(roshalProducts)
    .where(and(eq(roshalProducts.sku, sku), ne(roshalProducts.id, id)))
    .limit(1);

  if (existingSku) {
    throw new RoshalProductError(
      "duplicate-product-sku",
      "Another product is already using this SKU.",
    );
  }

  await db
    .insert(roshalProducts)
    .values({
      id,
      slug,
      sku,
      nameBn: input.nameBn,
      nameEn: input.nameEn,
      summaryBn: input.summaryBn,
      summaryEn: input.summaryEn,
      descriptionBn: input.descriptionBn,
      descriptionEn: input.descriptionEn,
      categoryKey: input.categoryKey,
      categoryLabelBn: input.categoryLabelBn,
      categoryLabelEn: input.categoryLabelEn,
      price: input.price,
      compareAtPrice: input.compareAtPrice ?? null,
      inventory: input.inventory,
      badge: toOptionalText(input.badge),
      heroImage: input.heroImage,
      galleryJson: toOptionalText(input.galleryJson),
      featuresBnJson: toOptionalText(input.featuresBnJson),
      featuresEnJson: toOptionalText(input.featuresEnJson),
      isFeatured: input.isFeatured,
      isPublished: input.isPublished,
      sortOrder: input.sortOrder,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: roshalProducts.id,
      set: {
        slug,
        sku,
        nameBn: input.nameBn,
        nameEn: input.nameEn,
        summaryBn: input.summaryBn,
        summaryEn: input.summaryEn,
        descriptionBn: input.descriptionBn,
        descriptionEn: input.descriptionEn,
        categoryKey: input.categoryKey,
        categoryLabelBn: input.categoryLabelBn,
        categoryLabelEn: input.categoryLabelEn,
        price: input.price,
        compareAtPrice: input.compareAtPrice ?? null,
        inventory: input.inventory,
        badge: toOptionalText(input.badge),
        heroImage: input.heroImage,
        galleryJson: toOptionalText(input.galleryJson),
        featuresBnJson: toOptionalText(input.featuresBnJson),
        featuresEnJson: toOptionalText(input.featuresEnJson),
        isFeatured: input.isFeatured,
        isPublished: input.isPublished,
        sortOrder: input.sortOrder,
        updatedAt: timestamp,
      },
    });

  return id;
}

export async function updateRoshalOrderStatus(input: {
  id: string;
  status: string;
  paymentStatus: string;
  trackingNote?: string | null;
  adminReviewNote?: string | null;
  paymentProvider?: RoshalPaymentGatewayProvider | null;
  gatewayTransactionId?: string | null;
  gatewayPaymentType?: string | null;
  gatewayMeta?: Record<string, string> | null;
  paymentReference?: string | null;
  paymentSender?: string | null;
}) {
  await db.transaction(async (tx) => {
    const [existingOrder] = await tx
      .select({
        id: roshalOrders.id,
        status: roshalOrders.status,
        itemsJson: roshalOrders.itemsJson,
      })
      .from(roshalOrders)
      .where(eq(roshalOrders.id, input.id))
      .limit(1);

    if (!existingOrder) {
      throw new RoshalOrderStatusError(
        "order-not-found",
        "The selected order could not be found.",
        404,
      );
    }

    const items = safeJsonParse<RoshalOrderItem[]>(existingOrder.itemsJson, []);
    const isCancelling =
      existingOrder.status !== ROSHAL_CANCELLED_STATUS &&
      input.status === ROSHAL_CANCELLED_STATUS;
    const isReactivating =
      existingOrder.status === ROSHAL_CANCELLED_STATUS &&
      input.status !== ROSHAL_CANCELLED_STATUS;

    if (isCancelling) {
      await restoreRoshalInventory(tx, items);
    }

    if (isReactivating) {
      try {
        await reserveRoshalInventory(tx, items);
      } catch (error) {
        if (error instanceof RoshalCheckoutError) {
          throw new RoshalOrderStatusError(
            error.code,
            error.message,
            error.statusCode,
          );
        }

        throw error;
      }
    }

    const orderUpdate: Partial<typeof roshalOrders.$inferInsert> = {
      status: input.status,
      paymentStatus: input.paymentStatus,
      trackingNote: toOptionalText(input.trackingNote),
      adminReviewNote: toOptionalText(input.adminReviewNote),
      verifiedAt: input.paymentStatus === "paid" ? new Date() : null,
      updatedAt: new Date(),
    };

    if (input.paymentProvider !== undefined) {
      orderUpdate.paymentProvider = toOptionalText(input.paymentProvider);
    }

    if (input.gatewayTransactionId !== undefined) {
      orderUpdate.gatewayTransactionId = toOptionalText(
        input.gatewayTransactionId,
      );
    }

    if (input.gatewayPaymentType !== undefined) {
      orderUpdate.gatewayPaymentType = toOptionalText(input.gatewayPaymentType);
    }

    if (input.gatewayMeta !== undefined) {
      orderUpdate.gatewayMetaJson = toGatewayMetaJson(input.gatewayMeta);
    }

    if (input.paymentReference !== undefined) {
      orderUpdate.paymentReference = toOptionalText(input.paymentReference);
    }

    if (input.paymentSender !== undefined) {
      orderUpdate.paymentSender = toOptionalText(input.paymentSender);
    }

    await tx
      .update(roshalOrders)
      .set(orderUpdate)
      .where(eq(roshalOrders.id, input.id));
  });
}

export async function updateRoshalUserRole(input: {
  id: string;
  role: string;
  isActive: boolean;
  actorId: string;
}) {
  const nextRole = normalizeRole(input.role);
  const [existingUser] = await db
    .select({
      id: users.id,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, input.id))
    .limit(1);

  if (!existingUser) {
    throw new RoshalUserRoleError(
      "user-not-found",
      "The selected user could not be found.",
      404,
    );
  }

  const removesActiveAdminAccess =
    existingUser.role === "admin" &&
    existingUser.isActive &&
    (nextRole !== "admin" || !input.isActive);

  if (input.actorId === input.id && removesActiveAdminAccess) {
    throw new RoshalUserRoleError(
      "self-admin-lockout",
      "You cannot remove your own active admin access from the dashboard.",
    );
  }

  if (removesActiveAdminAccess) {
    const activeAdmins = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(and(eq(users.role, "admin"), eq(users.isActive, true)));

    const hasAnotherActiveAdmin = activeAdmins.some(
      (admin) => admin.id !== input.id,
    );

    if (!hasAnotherActiveAdmin) {
      throw new RoshalUserRoleError(
        "last-admin-required",
        "At least one active admin must remain on the project.",
      );
    }
  }

  await db
    .update(users)
    .set({
      role: nextRole,
      isActive: input.isActive,
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.id));
}

export async function updateRoshalUserProfile(input: {
  id: string;
  name: string;
  phone?: string | null;
  preferredLanguage: string;
  defaultAddress?: string | null;
}) {
  await db
    .update(users)
    .set({
      name: input.name,
      phone: toOptionalText(input.phone),
      preferredLanguage: input.preferredLanguage === "en" ? "en" : "bn",
      defaultAddress: toOptionalText(input.defaultAddress),
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.id));
}

export interface CreateRoshalOrderInput {
  userId?: string | null;
  customerName: string;
  phone: string;
  email?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  postalCode?: string | null;
  notes?: string | null;
  paymentMethod: RoshalPaymentMethod;
  paymentReference?: string | null;
  paymentSender?: string | null;
  paymentProofUrl?: string | null;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  items: RoshalOrderItem[];
  paymentWorkflow: ReturnType<typeof getRoshalPaymentWorkflowState>;
  paymentProvider?: RoshalPaymentGatewayProvider | null;
  gatewayTransactionId?: string | null;
  gatewayPaymentType?: string | null;
  gatewayMeta?: Record<string, string> | null;
}

export interface RoshalOrderCreationResult {
  id: string;
  orderNumber: string;
  paymentMode: "manual" | "gateway";
  paymentProvider: RoshalPaymentGatewayProvider | "";
  paymentUrl?: string;
}

type RoshalGatewayCallbackOutcome = "success" | "failed" | "cancelled";

function getRoshalGatewayFailureMessage(
  outcome: RoshalGatewayCallbackOutcome,
  reason: string,
) {
  switch (outcome) {
    case "cancelled":
      return {
        payment: "cancelled",
        trackingNote: "Customer cancelled the secure gateway payment.",
        adminReviewNote: reason,
      };
    case "failed":
      return {
        payment: "failed",
        trackingNote: "Secure gateway payment failed before completion.",
        adminReviewNote: reason,
      };
    default:
      return {
        payment: "processing",
        trackingNote:
          "Payment was received by the gateway and is awaiting verification.",
        adminReviewNote: reason,
      };
  }
}

function toRoshalPaymentReturnPath(payment: string, orderId?: string | null) {
  const searchParams = new URLSearchParams();
  searchParams.set("payment", payment);

  if (orderId) {
    searchParams.set("orderId", orderId);
  }

  return `/payment-return?${searchParams.toString()}`;
}

async function getRoshalOrderForGatewayUpdate(input: {
  id?: string | null;
  orderNumber?: string | null;
}) {
  if (input.id) {
    const [order] = await db
      .select({
        id: roshalOrders.id,
        orderNumber: roshalOrders.orderNumber,
        paymentStatus: roshalOrders.paymentStatus,
        status: roshalOrders.status,
        total: roshalOrders.total,
      })
      .from(roshalOrders)
      .where(eq(roshalOrders.id, input.id))
      .limit(1);

    if (order) {
      return order;
    }
  }

  if (!input.orderNumber) {
    return null;
  }

  const [order] = await db
    .select({
      id: roshalOrders.id,
      orderNumber: roshalOrders.orderNumber,
      paymentStatus: roshalOrders.paymentStatus,
      status: roshalOrders.status,
      total: roshalOrders.total,
    })
    .from(roshalOrders)
    .where(eq(roshalOrders.orderNumber, input.orderNumber))
    .limit(1);

  return order || null;
}

async function createRoshalGatewayOrder(
  input: Omit<CreateRoshalOrderInput, "paymentWorkflow"> & {
    paymentMethod: RoshalPaymentMethod;
  },
): Promise<RoshalOrderCreationResult> {
  const order = await createRoshalOrder({
    ...input,
    paymentProvider: "aamarpay",
    paymentWorkflow: {
      requiresManualReview: false,
      status: "pending",
      paymentStatus: "pending",
      trackingNote:
        "Continue to the secure payment gateway to complete this order.",
    },
  });

  try {
    const session = await createRoshalGatewayCheckoutSession({
      amount: input.total,
      city: input.city,
      customerName: input.customerName,
      email: input.email,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentMethod: input.paymentMethod,
      phone: input.phone,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      postalCode: input.postalCode,
    });

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      paymentMode: "gateway",
      paymentProvider: session.provider,
      paymentUrl: session.paymentUrl,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not start the secure payment session.";

    await updateRoshalOrderStatus({
      id: order.id,
      status: "cancelled",
      paymentStatus: "failed",
      trackingNote:
        "The secure payment session could not be started. Inventory was restored.",
      adminReviewNote: message,
      paymentProvider: "aamarpay",
    });

    throw new RoshalCheckoutError(
      "gateway-init-failed",
      "Could not start secure payment. Please try again.",
      502,
    );
  }
}

export async function createValidatedRoshalOrder(
  input: unknown,
): Promise<RoshalOrderCreationResult> {
  const parsed = roshalCheckoutRequestSchema.parse(input);
  const quantityMap = getRoshalItemQuantityMap(parsed.items);
  const requestedProductIds = Array.from(quantityMap.keys());
  const publishedProducts = await db
    .select()
    .from(roshalProducts)
    .where(
      and(
        inArray(roshalProducts.id, requestedProductIds),
        eq(roshalProducts.isPublished, true),
      ),
    );
  const productMap = new Map(
    publishedProducts.map((product) => [product.id, product]),
  );

  if (productMap.size !== requestedProductIds.length) {
    throw new RoshalCheckoutError(
      "product-unavailable",
      "One or more products are no longer available for checkout.",
    );
  }

  const paymentSettings = await getRoshalPaymentSettings();
  const paymentOption = paymentSettings.options.find(
    (option) => option.key === parsed.paymentMethod && option.enabled,
  );

  if (!paymentOption) {
    throw new RoshalCheckoutError(
      "payment-method-unavailable",
      "The selected payment method is currently unavailable.",
    );
  }

  if (
    shouldRequireRoshalPaymentProof(paymentOption) &&
    (!parsed.paymentReference ||
      !parsed.paymentSender ||
      !parsed.paymentProofUrl)
  ) {
    throw new RoshalCheckoutError(
      "payment-proof-required",
      "Transaction ID, sender number, and payment proof are required for this payment method.",
    );
  }

  const items: RoshalOrderItem[] = requestedProductIds.map((productId) => {
    const product = productMap.get(productId);
    const quantity = quantityMap.get(productId) || 0;

    if (!product) {
      throw new RoshalCheckoutError(
        "product-unavailable",
        "One or more products are no longer available for checkout.",
      );
    }

    if (quantity > product.inventory) {
      throw new RoshalCheckoutError(
        "insufficient-inventory",
        `${product.nameEn} does not have enough inventory for the requested quantity.`,
      );
    }

    return {
      productId: product.id,
      slug: product.slug,
      name: {
        bn: product.nameBn,
        en: product.nameEn,
      },
      image: product.heroImage,
      price: product.price,
      quantity,
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  await ensureRoshalSiteSettingsSchema();
  let siteSettings: {
    deliveryZonesJson: string | null;
  } | null = null;

  try {
    const [siteSettingsRow] = await db
      .select({
        deliveryZonesJson: roshalSiteSettings.deliveryZonesJson,
      })
      .from(roshalSiteSettings)
      .limit(1);

    siteSettings = siteSettingsRow || null;
  } catch {}

  const deliveryZones = normalizeRoshalDeliveryZones(
    safeJsonParse(
      siteSettings?.deliveryZonesJson,
      defaultRoshalSiteSettings.deliveryZones,
    ),
    defaultRoshalSiteSettings.deliveryZones,
  );
  const shippingFee = resolveRoshalDeliveryEstimate({
    addressLine1: parsed.addressLine1,
    addressLine2: parsed.addressLine2,
    city: parsed.city,
    postalCode: parsed.postalCode,
    itemCount: items.length,
    zones: deliveryZones,
  }).fee;
  const paymentWorkflow = getRoshalPaymentWorkflowState(paymentOption);
  const total = subtotal + shippingFee;

  if (
    paymentOption.mode === "gateway" &&
    hasRoshalGatewayIntegration(paymentOption.key)
  ) {
    return createRoshalGatewayOrder({
      userId: parsed.userId,
      customerName: parsed.customerName,
      phone: parsed.phone,
      email: parsed.email,
      addressLine1: parsed.addressLine1,
      addressLine2: parsed.addressLine2,
      city: parsed.city,
      postalCode: parsed.postalCode,
      notes: parsed.notes,
      paymentMethod: paymentOption.key,
      paymentReference: null,
      paymentSender: null,
      paymentProofUrl: null,
      subtotal,
      shippingFee,
      discount: 0,
      total,
      items,
    });
  }

  return createRoshalOrder({
    userId: parsed.userId,
    customerName: parsed.customerName,
    phone: parsed.phone,
    email: parsed.email,
    addressLine1: parsed.addressLine1,
    addressLine2: parsed.addressLine2,
    city: parsed.city,
    postalCode: parsed.postalCode,
    notes: parsed.notes,
    paymentMethod: paymentOption.key,
    paymentReference: parsed.paymentReference,
    paymentSender: parsed.paymentSender,
    paymentProofUrl: parsed.paymentProofUrl,
    subtotal,
    shippingFee,
    discount: 0,
    total,
    items,
    paymentWorkflow,
  });
}

export async function createRoshalOrder(
  input: CreateRoshalOrderInput,
): Promise<RoshalOrderCreationResult> {
  const id = nextId("order");
  const timestamp = new Date();
  const orderNumber = nextRoshalOrderNumber(timestamp);

  await db.transaction(async (tx) => {
    await reserveRoshalInventory(tx, input.items);

    await tx.insert(roshalOrders).values({
      id,
      orderNumber,
      userId: input.userId || null,
      status: input.paymentWorkflow.status,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentWorkflow.paymentStatus,
      paymentProvider: toOptionalText(input.paymentProvider),
      gatewayTransactionId: toOptionalText(input.gatewayTransactionId),
      gatewayPaymentType: toOptionalText(input.gatewayPaymentType),
      gatewayMetaJson: toGatewayMetaJson(input.gatewayMeta),
      paymentReference: toOptionalText(input.paymentReference),
      paymentSender: toOptionalText(input.paymentSender),
      paymentProofUrl: toOptionalText(input.paymentProofUrl),
      trackingNote: input.paymentWorkflow.trackingNote,
      adminReviewNote: null,
      verifiedAt: null,
      subtotal: input.subtotal,
      shippingFee: input.shippingFee,
      discount: input.discount,
      total: input.total,
      currency: "BDT",
      customerName: input.customerName,
      phone: input.phone,
      email: toOptionalText(input.email),
      addressLine1: input.addressLine1,
      addressLine2: toOptionalText(input.addressLine2),
      city: input.city,
      postalCode: toOptionalText(input.postalCode),
      notes: toOptionalText(input.notes),
      itemsJson: JSON.stringify(input.items),
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  });

  return {
    id,
    orderNumber,
    paymentMode: "manual",
    paymentProvider: input.paymentProvider || "",
  };
}

export async function applyRoshalGatewayCallback(input: {
  outcome: RoshalGatewayCallbackOutcome;
  request: Request;
}) {
  const callbackPayload = await readRoshalGatewayCallbackPayload(input.request);
  const order = await getRoshalOrderForGatewayUpdate({
    id: callbackPayload.orderId,
    orderNumber: callbackPayload.orderNumber,
  });

  if (!order) {
    return {
      orderId: "",
      redirectPath: toRoshalPaymentReturnPath("failed"),
    };
  }

  if (input.outcome === "success") {
    try {
      const verification = await verifyRoshalGatewayTransaction(
        order.orderNumber,
      );
      const verifiedAsPaid =
        verification.statusCode === "2" &&
        amountMatchesRoshalOrder(order.total, verification.amount);

      if (verifiedAsPaid) {
        if (order.paymentStatus !== "paid" || order.status !== "confirmed") {
          await updateRoshalOrderStatus({
            id: order.id,
            status: "confirmed",
            paymentStatus: "paid",
            trackingNote:
              "Payment verified successfully via the secure gateway.",
            adminReviewNote: "Gateway payment verified automatically.",
            paymentProvider: "aamarpay",
            gatewayTransactionId: verification.gatewayTransactionId,
            gatewayPaymentType: verification.paymentType,
            gatewayMeta: verification.raw,
            paymentReference: verification.gatewayTransactionId,
          });
        }

        return {
          orderId: order.id,
          redirectPath: toRoshalPaymentReturnPath("success", order.id),
        };
      }

      await updateRoshalOrderStatus({
        id: order.id,
        status: "payment-review",
        paymentStatus: "under-review",
        trackingNote:
          "Gateway reported payment activity, but final verification is still pending.",
        adminReviewNote:
          "Gateway callback was received, but verification could not confirm a paid amount that matches the order total.",
        paymentProvider: "aamarpay",
        gatewayTransactionId:
          verification.gatewayTransactionId ||
          callbackPayload.gatewayTransactionId,
        gatewayPaymentType:
          verification.paymentType || callbackPayload.paymentType,
        gatewayMeta: verification.raw,
        paymentReference:
          verification.gatewayTransactionId ||
          callbackPayload.gatewayTransactionId,
      });
    } catch (error) {
      await updateRoshalOrderStatus({
        id: order.id,
        status: "payment-review",
        paymentStatus: "under-review",
        trackingNote:
          "Gateway reported payment activity, but verification is still pending.",
        adminReviewNote:
          error instanceof Error
            ? error.message
            : "Gateway verification could not be completed automatically.",
        paymentProvider: "aamarpay",
        gatewayTransactionId: callbackPayload.gatewayTransactionId,
        gatewayPaymentType: callbackPayload.paymentType,
        gatewayMeta: callbackPayload.raw,
        paymentReference: callbackPayload.gatewayTransactionId,
      });
    }

    return {
      orderId: order.id,
      redirectPath: toRoshalPaymentReturnPath("processing", order.id),
    };
  }

  if (order.paymentStatus === "paid") {
    return {
      orderId: order.id,
      redirectPath: toRoshalPaymentReturnPath("success", order.id),
    };
  }

  const failure = getRoshalGatewayFailureMessage(
    input.outcome,
    callbackPayload.raw.reason ||
      callbackPayload.payStatus ||
      "Gateway payment was not completed.",
  );

  await updateRoshalOrderStatus({
    id: order.id,
    status: "cancelled",
    paymentStatus: "failed",
    trackingNote: failure.trackingNote,
    adminReviewNote: failure.adminReviewNote,
    paymentProvider: "aamarpay",
    gatewayTransactionId: callbackPayload.gatewayTransactionId,
    gatewayPaymentType: callbackPayload.paymentType,
    gatewayMeta: callbackPayload.raw,
    paymentReference: callbackPayload.gatewayTransactionId,
  });

  return {
    orderId: order.id,
    redirectPath: toRoshalPaymentReturnPath(failure.payment, order.id),
  };
}
