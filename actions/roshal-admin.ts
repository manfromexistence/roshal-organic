"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRoshalAdmin, requireRoshalUser } from "@/lib/roshal/auth";
import { safeJsonParse } from "@/lib/roshal/format";
import {
  createValidatedRoshalOrder,
  RoshalOrderStatusError,
  RoshalUserRoleError,
  updateRoshalOrderStatus,
  updateRoshalUserProfile,
  updateRoshalUserRole,
  upsertRoshalPage,
  upsertRoshalPaymentSettings,
  upsertRoshalProduct,
  upsertRoshalSection,
  upsertRoshalSiteSettings,
} from "@/lib/roshal/mutations";
import type { RoshalPaymentMethod } from "@/lib/roshal/types";

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function optionalTextValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value || null;
}

function numberValue(formData: FormData, key: string) {
  return Number.parseInt(textValue(formData, key) || "0", 10) || 0;
}

function boolValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

function buildPaymentOption(
  formData: FormData,
  key: RoshalPaymentMethod,
  sortOrder: number,
) {
  return {
    key,
    enabled: boolValue(formData, `${key}Enabled`),
    mode:
      textValue(formData, `${key}Mode`) === "gateway" ? "gateway" : "manual",
    label: {
      bn: textValue(formData, `${key}LabelBn`),
      en: textValue(formData, `${key}LabelEn`),
    },
    merchantLabel: {
      bn: textValue(formData, `${key}MerchantLabelBn`),
      en: textValue(formData, `${key}MerchantLabelEn`),
    },
    accountType: textValue(formData, `${key}AccountType`) || "mobile-wallet",
    accountNumber: textValue(formData, `${key}AccountNumber`),
    instructions: {
      bn: textValue(formData, `${key}InstructionsBn`),
      en: textValue(formData, `${key}InstructionsEn`),
    },
    guideImageUrl: textValue(formData, `${key}GuideImageUrl`),
    requiresProof: boolValue(formData, `${key}RequiresProof`),
    sortOrder: numberValue(formData, `${key}SortOrder`) || sortOrder,
  } as const;
}

function finishAction(
  defaultPath: string,
  formData: FormData,
  revalidatePaths: string[],
) {
  for (const path of revalidatePaths) {
    revalidatePath(path);
  }

  const redirectTo = textValue(formData, "redirectTo") || defaultPath;
  redirect(redirectTo);
}

export async function saveRoshalSiteSettings(formData: FormData) {
  await requireRoshalAdmin();

  await upsertRoshalSiteSettings({
    id: textValue(formData, "id") || undefined,
    brandName: textValue(formData, "brandName"),
    taglineBn: textValue(formData, "taglineBn"),
    taglineEn: textValue(formData, "taglineEn"),
    contactPhone: optionalTextValue(formData, "contactPhone"),
    contactEmail: optionalTextValue(formData, "contactEmail"),
    whatsappPhone: optionalTextValue(formData, "whatsappPhone"),
    addressBn: optionalTextValue(formData, "addressBn"),
    addressEn: optionalTextValue(formData, "addressEn"),
    heroLayout: textValue(formData, "heroLayout") || "split",
    cardStyle: textValue(formData, "cardStyle") || "soft",
    sectionSpacing: textValue(formData, "sectionSpacing") || "comfortable",
    primaryCtaHref: textValue(formData, "primaryCtaHref") || "/products",
    primaryCtaLabelBn: textValue(formData, "primaryCtaLabelBn"),
    primaryCtaLabelEn: textValue(formData, "primaryCtaLabelEn"),
  });

  finishAction("/dashboard/theme", formData, [
    "/",
    "/about",
    "/contact",
    "/dashboard/theme",
  ]);
}

export async function saveRoshalPaymentSettings(formData: FormData) {
  await requireRoshalAdmin();

  await upsertRoshalPaymentSettings({
    id: textValue(formData, "id") || undefined,
    manualReviewNoticeBn: textValue(formData, "manualReviewNoticeBn"),
    manualReviewNoticeEn: textValue(formData, "manualReviewNoticeEn"),
    supportMessageBn: textValue(formData, "supportMessageBn"),
    supportMessageEn: textValue(formData, "supportMessageEn"),
    options: [
      buildPaymentOption(formData, "card", 0),
      buildPaymentOption(formData, "bkash", 1),
      buildPaymentOption(formData, "nagad", 2),
      buildPaymentOption(formData, "rocket", 3),
      buildPaymentOption(formData, "upay", 4),
    ],
  });

  finishAction("/dashboard/payments", formData, [
    "/checkout",
    "/orders",
    "/dashboard/orders",
    "/dashboard/payments",
  ]);
}

export async function saveRoshalPage(formData: FormData) {
  await requireRoshalAdmin();

  const pageSlug = textValue(formData, "slug");
  const previousSlug = textValue(formData, "previousSlug");
  const reservedSlugs = new Set([
    "products",
    "cart",
    "checkout",
    "orders",
    "profile",
    "login",
    "dashboard",
    "api",
    "_next",
  ]);

  if (reservedSlugs.has(pageSlug)) {
    redirect(
      `/dashboard/pages?error=reserved-slug&slug=${encodeURIComponent(pageSlug)}`,
    );
  }

  const id = await upsertRoshalPage({
    id: textValue(formData, "id") || undefined,
    slug: pageSlug,
    navigationLabelBn: textValue(formData, "navigationLabelBn"),
    navigationLabelEn: textValue(formData, "navigationLabelEn"),
    titleBn: textValue(formData, "titleBn"),
    titleEn: textValue(formData, "titleEn"),
    descriptionBn: optionalTextValue(formData, "descriptionBn"),
    descriptionEn: optionalTextValue(formData, "descriptionEn"),
    heroImage: optionalTextValue(formData, "heroImage"),
    status: textValue(formData, "status") || "published",
    showInNavigation: boolValue(formData, "showInNavigation"),
  });

  const storefrontPaths = new Set<string>([
    pageSlug === "home" ? "/" : `/${pageSlug}`,
    previousSlug ? (previousSlug === "home" ? "/" : `/${previousSlug}`) : "",
    "/",
    "/about",
    "/contact",
  ]);

  for (const path of storefrontPaths) {
    revalidatePath(path);
  }

  revalidatePath("/dashboard/pages");
  redirect(`/dashboard/pages/${id}`);
}

export async function saveRoshalSection(formData: FormData) {
  await requireRoshalAdmin();

  const pageId = textValue(formData, "pageId");
  const pageSlug = textValue(formData, "pageSlug");

  await upsertRoshalSection({
    id: textValue(formData, "id") || undefined,
    pageId,
    sectionKey: textValue(formData, "sectionKey"),
    type: textValue(formData, "type"),
    sortOrder: numberValue(formData, "sortOrder"),
    layout: textValue(formData, "layout") || "stacked",
    variant: textValue(formData, "variant") || "default",
    isEnabled: boolValue(formData, "isEnabled"),
    eyebrowBn: optionalTextValue(formData, "eyebrowBn"),
    eyebrowEn: optionalTextValue(formData, "eyebrowEn"),
    titleBn: optionalTextValue(formData, "titleBn"),
    titleEn: optionalTextValue(formData, "titleEn"),
    bodyBn: optionalTextValue(formData, "bodyBn"),
    bodyEn: optionalTextValue(formData, "bodyEn"),
    ctaLabelBn: optionalTextValue(formData, "ctaLabelBn"),
    ctaLabelEn: optionalTextValue(formData, "ctaLabelEn"),
    ctaHref: optionalTextValue(formData, "ctaHref"),
    imageUrl: optionalTextValue(formData, "imageUrl"),
    itemsJson: optionalTextValue(formData, "itemsJson"),
    stylesJson: optionalTextValue(formData, "stylesJson"),
  });

  finishAction(`/dashboard/pages/${pageId}`, formData, [
    pageSlug === "home" ? "/" : `/${pageSlug}`,
    "/",
    "/about",
    "/contact",
    `/dashboard/pages/${pageId}`,
  ]);
}

export async function saveRoshalProduct(formData: FormData) {
  await requireRoshalAdmin();

  const previousSlug = textValue(formData, "previousSlug");
  const id = await upsertRoshalProduct({
    id: textValue(formData, "id") || undefined,
    slug: textValue(formData, "slug"),
    sku: textValue(formData, "sku"),
    nameBn: textValue(formData, "nameBn"),
    nameEn: textValue(formData, "nameEn"),
    summaryBn: textValue(formData, "summaryBn"),
    summaryEn: textValue(formData, "summaryEn"),
    descriptionBn: textValue(formData, "descriptionBn"),
    descriptionEn: textValue(formData, "descriptionEn"),
    categoryKey: textValue(formData, "categoryKey"),
    categoryLabelBn: textValue(formData, "categoryLabelBn"),
    categoryLabelEn: textValue(formData, "categoryLabelEn"),
    price: numberValue(formData, "price"),
    compareAtPrice: numberValue(formData, "compareAtPrice") || null,
    inventory: numberValue(formData, "inventory"),
    badge: optionalTextValue(formData, "badge"),
    heroImage: textValue(formData, "heroImage"),
    galleryJson: optionalTextValue(formData, "galleryJson"),
    featuresBnJson: optionalTextValue(formData, "featuresBnJson"),
    featuresEnJson: optionalTextValue(formData, "featuresEnJson"),
    isFeatured: boolValue(formData, "isFeatured"),
    isPublished: boolValue(formData, "isPublished"),
    sortOrder: numberValue(formData, "sortOrder"),
  });

  const currentSlug = textValue(formData, "slug");
  const productPaths = new Set<string>([
    "/",
    "/products",
    `/products/${currentSlug}`,
    previousSlug ? `/products/${previousSlug}` : "",
    "/dashboard/products",
  ]);

  for (const path of productPaths) {
    if (path) {
      revalidatePath(path);
    }
  }

  redirect(`/dashboard/products/${id}`);
}

export async function saveRoshalOrderStatus(formData: FormData) {
  await requireRoshalAdmin();

  const id = textValue(formData, "id");

  try {
    await updateRoshalOrderStatus({
      id,
      status: textValue(formData, "status") || "pending",
      paymentStatus: textValue(formData, "paymentStatus") || "pending",
      trackingNote: optionalTextValue(formData, "trackingNote"),
      adminReviewNote: optionalTextValue(formData, "adminReviewNote"),
    });
  } catch (error) {
    if (error instanceof RoshalOrderStatusError) {
      redirect(
        `/dashboard/orders/${id}?error=${encodeURIComponent(error.code)}`,
      );
    }

    throw error;
  }

  finishAction(`/dashboard/orders/${id}`, formData, [
    "/dashboard",
    "/dashboard/orders",
    "/orders",
    `/orders/${id}`,
    "/profile",
    `/dashboard/orders/${id}`,
  ]);
}

export async function saveRoshalUserRole(formData: FormData) {
  const sessionUser = await requireRoshalAdmin();

  const id = textValue(formData, "id");

  try {
    await updateRoshalUserRole({
      id,
      role: textValue(formData, "role") || "user",
      isActive: boolValue(formData, "isActive"),
      actorId: sessionUser.id,
    });
  } catch (error) {
    if (error instanceof RoshalUserRoleError) {
      redirect(
        `/dashboard/users/${id}?error=${encodeURIComponent(error.code)}`,
      );
    }

    throw error;
  }

  finishAction(`/dashboard/users/${id}`, formData, [
    "/dashboard/users",
    `/dashboard/users/${id}`,
  ]);
}

export async function saveRoshalUserProfile(formData: FormData) {
  const sessionUser = await requireRoshalUser();
  const id = textValue(formData, "id") || sessionUser.id;

  if (sessionUser.role !== "admin" && sessionUser.id !== id) {
    redirect("/profile");
  }

  await updateRoshalUserProfile({
    id,
    name: textValue(formData, "name"),
    phone: optionalTextValue(formData, "phone"),
    preferredLanguage: textValue(formData, "preferredLanguage") || "bn",
    defaultAddress: optionalTextValue(formData, "defaultAddress"),
  });

  finishAction("/profile", formData, [
    "/profile",
    "/dashboard/users",
    `/dashboard/users/${id}`,
  ]);
}

export async function submitRoshalCheckoutOrder(formData: FormData) {
  const sessionUser = await requireRoshalUser();
  const items = safeJsonParse(textValue(formData, "itemsJson"), []);

  const result = await createValidatedRoshalOrder({
    userId: sessionUser.id,
    customerName: textValue(formData, "customerName"),
    phone: textValue(formData, "phone"),
    email: optionalTextValue(formData, "email") || undefined,
    addressLine1: textValue(formData, "addressLine1"),
    addressLine2: optionalTextValue(formData, "addressLine2") || undefined,
    city: textValue(formData, "city"),
    postalCode: optionalTextValue(formData, "postalCode") || undefined,
    notes: optionalTextValue(formData, "notes") || undefined,
    paymentMethod:
      (textValue(formData, "paymentMethod") as RoshalPaymentMethod) || "bkash",
    paymentReference:
      optionalTextValue(formData, "paymentReference") || undefined,
    paymentSender: optionalTextValue(formData, "paymentSender") || undefined,
    paymentProofUrl:
      optionalTextValue(formData, "paymentProofUrl") || undefined,
    items,
  });

  revalidatePath("/orders");
  revalidatePath(`/orders/${result.id}`);
  revalidatePath("/profile");

  if (result.paymentUrl) {
    redirect(result.paymentUrl);
  }

  redirect(`/orders/${result.id}`);
}
