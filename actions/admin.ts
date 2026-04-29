"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRoshalAdmin, requireRoshalUser } from "@/lib/store-auth";
import { safeJsonParse } from "@/lib/store-format";
import {
  createValidatedRoshalOrder,
  deleteRoshalCategory,
  deleteRoshalSubcategory,
  RoshalOrderStatusError,
  RoshalPageError,
  RoshalProductError,
  RoshalSectionError,
  RoshalTaxonomyError,
  RoshalUserRoleError,
  updateRoshalOrderStatus,
  updateRoshalUserProfile,
  updateRoshalUserRole,
  upsertRoshalCategory,
  upsertRoshalPage,
  upsertRoshalPaymentSettings,
  upsertRoshalProduct,
  upsertRoshalSection,
  upsertRoshalSiteSettings,
  upsertRoshalSubcategory,
} from "@/lib/store-mutations";
import { normalizeRoshalRouteSlug } from "@/lib/store-routes";
import type { RoshalPaymentMethod } from "@/lib/store-types";

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

function stringArrayValue(formData: FormData, key: string) {
  return safeJsonParse<string[]>(textValue(formData, key), []).filter(Boolean);
}

function jsonValue<T>(formData: FormData, key: string, fallback: T) {
  return safeJsonParse<T>(textValue(formData, key), fallback);
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
    facebookUrl: optionalTextValue(formData, "facebookUrl"),
    addressBn: optionalTextValue(formData, "addressBn"),
    addressEn: optionalTextValue(formData, "addressEn"),
    heroLayout: textValue(formData, "heroLayout") || "split",
    cardStyle: textValue(formData, "cardStyle") || "soft",
    sectionSpacing: textValue(formData, "sectionSpacing") || "comfortable",
    primaryCtaHref: textValue(formData, "primaryCtaHref") || "/products",
    primaryCtaLabelBn: textValue(formData, "primaryCtaLabelBn"),
    primaryCtaLabelEn: textValue(formData, "primaryCtaLabelEn"),
    deliveryZones: jsonValue(formData, "deliveryZonesJson", []),
  });

  finishAction("/dashboard/theme", formData, [
    "/",
    "/about",
    "/contact",
    "/cart",
    "/checkout",
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

export async function saveRoshalCategory(formData: FormData) {
  await requireRoshalAdmin();

  const categoryId = textValue(formData, "id");

  try {
    await upsertRoshalCategory({
      id: categoryId || undefined,
      key: textValue(formData, "key"),
      labelBn: textValue(formData, "labelBn"),
      labelEn: textValue(formData, "labelEn"),
      descriptionBn: optionalTextValue(formData, "descriptionBn"),
      descriptionEn: optionalTextValue(formData, "descriptionEn"),
      imageUrl: optionalTextValue(formData, "imageUrl"),
      sourceKeys: stringArrayValue(formData, "sourceKeysJson"),
      isEnabled: boolValue(formData, "isEnabled"),
      showInNavigation: boolValue(formData, "showInNavigation"),
      showOnHomepage: boolValue(formData, "showOnHomepage"),
      sortOrder: numberValue(formData, "sortOrder"),
    });
  } catch (error) {
    if (error instanceof RoshalTaxonomyError) {
      redirect(
        `/dashboard/categories?error=${encodeURIComponent(error.code)}&key=${encodeURIComponent(textValue(formData, "key"))}`,
      );
    }

    throw error;
  }

  finishAction("/dashboard/categories", formData, [
    "/",
    "/products",
    "/dashboard/categories",
  ]);
}

export async function saveRoshalSubcategory(formData: FormData) {
  await requireRoshalAdmin();

  try {
    await upsertRoshalSubcategory({
      id: textValue(formData, "id") || undefined,
      categoryId: textValue(formData, "categoryId"),
      key: textValue(formData, "key"),
      labelBn: textValue(formData, "labelBn"),
      labelEn: textValue(formData, "labelEn"),
      descriptionBn: optionalTextValue(formData, "descriptionBn"),
      descriptionEn: optionalTextValue(formData, "descriptionEn"),
      imageUrl: optionalTextValue(formData, "imageUrl"),
      sourceKeys: stringArrayValue(formData, "sourceKeysJson"),
      isEnabled: boolValue(formData, "isEnabled"),
      showInNavigation: boolValue(formData, "showInNavigation"),
      sortOrder: numberValue(formData, "sortOrder"),
    });
  } catch (error) {
    if (error instanceof RoshalTaxonomyError) {
      redirect(
        `/dashboard/categories?error=${encodeURIComponent(error.code)}&subcategory=${encodeURIComponent(textValue(formData, "key"))}`,
      );
    }

    throw error;
  }

  finishAction("/dashboard/categories", formData, [
    "/",
    "/products",
    "/dashboard/categories",
  ]);
}

export async function removeRoshalCategory(formData: FormData) {
  await requireRoshalAdmin();

  await deleteRoshalCategory(textValue(formData, "id"));

  finishAction("/dashboard/categories", formData, [
    "/",
    "/products",
    "/dashboard/categories",
  ]);
}

export async function removeRoshalSubcategory(formData: FormData) {
  await requireRoshalAdmin();

  await deleteRoshalSubcategory(textValue(formData, "id"));

  finishAction("/dashboard/categories", formData, [
    "/",
    "/products",
    "/dashboard/categories",
  ]);
}

export async function saveRoshalPage(formData: FormData) {
  await requireRoshalAdmin();

  const rawPageSlug = textValue(formData, "slug");
  const pageSlug = normalizeRoshalRouteSlug(rawPageSlug);
  const previousSlug = normalizeRoshalRouteSlug(
    textValue(formData, "previousSlug"),
  );
  const pageId = textValue(formData, "id");
  const pageEditorPath = pageId
    ? `/dashboard/pages/${pageId}`
    : "/dashboard/pages";
  let id = pageId;

  try {
    id = await upsertRoshalPage({
      id: pageId || undefined,
      slug: rawPageSlug,
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
  } catch (error) {
    if (error instanceof RoshalPageError) {
      redirect(
        `${pageEditorPath}?error=${encodeURIComponent(error.code)}&slug=${encodeURIComponent(pageSlug || rawPageSlug)}`,
      );
    }

    throw error;
  }

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
  const sectionKey = textValue(formData, "sectionKey");

  try {
    await upsertRoshalSection({
      id: textValue(formData, "id") || undefined,
      pageId,
      sectionKey,
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
  } catch (error) {
    if (error instanceof RoshalSectionError) {
      redirect(
        `/dashboard/pages/${pageId}?error=${encodeURIComponent(error.code)}&sectionKey=${encodeURIComponent(sectionKey)}`,
      );
    }

    throw error;
  }

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

  const previousSlug = normalizeRoshalRouteSlug(
    textValue(formData, "previousSlug"),
  );
  const productId = textValue(formData, "id");
  const rawProductSlug = textValue(formData, "slug");
  const productSlug = normalizeRoshalRouteSlug(rawProductSlug);
  const productSku = textValue(formData, "sku");
  const productEditorPath = productId
    ? `/dashboard/products/${productId}`
    : "/dashboard/products/new";
  let id = productId;

  try {
    id = await upsertRoshalProduct({
      id: productId || undefined,
      slug: rawProductSlug,
      sku: productSku,
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
  } catch (error) {
    if (error instanceof RoshalProductError) {
      redirect(
        `${productEditorPath}?error=${encodeURIComponent(error.code)}&slug=${encodeURIComponent(productSlug)}&sku=${encodeURIComponent(productSku)}`,
      );
    }

    throw error;
  }

  const currentSlug = productSlug;
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
