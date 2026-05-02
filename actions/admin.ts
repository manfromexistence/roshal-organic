"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  type DashboardFormDraftScope,
  pickDashboardFormDraftValues,
  writeDashboardFormDraft,
} from "@/lib/dashboard-form-drafts";
import { requireRoshalAdmin, requireRoshalUser } from "@/lib/store-auth";
import { getRoshalPaymentSettings } from "@/lib/store-content";
import { safeJsonParse } from "@/lib/store-format";
import {
  createValidatedRoshalOrder,
  deleteRoshalCategory,
  deleteRoshalPage,
  deleteRoshalProduct,
  deleteRoshalSubcategory,
  deleteRoshalUser,
  RoshalCheckoutError,
  RoshalOrderStatusError,
  RoshalPageError,
  RoshalProductError,
  RoshalSectionError,
  RoshalTaxonomyError,
  RoshalUserProfileError,
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
import { normalizeRoshalPaymentMethodKey } from "@/lib/store-payment-methods";
import {
  mergeRoshalProductFeatureInput,
  normalizeRoshalProductPurchaseOptions,
} from "@/lib/store-product-options";
import {
  createRoshalProductReview,
  deleteRoshalProductReview,
  RoshalProductReviewError,
  updateRoshalProductReviewPublication,
} from "@/lib/store-product-reviews";
import { normalizeRoshalRouteSlug } from "@/lib/store-routes";
import type {
  RoshalPaymentMethod,
  RoshalPaymentOption,
  RoshalProductPurchaseOption,
} from "@/lib/store-types";

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

const categoryDraftKeys = [
  "key",
  "sortOrder",
  "labelEn",
  "labelBn",
  "sourceKeysJson",
  "imageUrl",
  "descriptionEn",
  "descriptionBn",
  "isEnabled",
  "showInNavigation",
  "showOnHomepage",
];

const subcategoryDraftKeys = [
  "categoryId",
  "key",
  "sortOrder",
  "labelEn",
  "labelBn",
  "sourceKeysJson",
  "imageUrl",
  "descriptionEn",
  "descriptionBn",
  "isEnabled",
  "showInNavigation",
];

const cmsPageDraftKeys = [
  "slug",
  "navigationLabelBn",
  "navigationLabelEn",
  "titleBn",
  "titleEn",
  "heroImage",
  "status",
  "descriptionBn",
  "descriptionEn",
  "showInNavigation",
];

const cmsSectionDraftKeys = [
  "id",
  "pageId",
  "pageSlug",
  "sectionKey",
  "type",
  "sortOrder",
  "layout",
  "variant",
  "isEnabled",
  "eyebrowBn",
  "eyebrowEn",
  "titleBn",
  "titleEn",
  "bodyBn",
  "bodyEn",
  "ctaLabelBn",
  "ctaLabelEn",
  "ctaHref",
  "imageUrl",
  "itemsJson",
  "stylesJson",
];

const productDraftKeys = [
  "nameBn",
  "nameEn",
  "slug",
  "sku",
  "heroImage",
  "galleryJson",
  "purchaseOptionsJson",
  "summaryEn",
  "summaryBn",
  "descriptionEn",
  "descriptionBn",
  "featuresEnJson",
  "featuresBnJson",
  "price",
  "compareAtPrice",
  "inventory",
  "categoryKey",
  "categoryLabelBn",
  "categoryLabelEn",
  "subcategoryKey",
  "badge",
  "sortOrder",
  "isFeatured",
  "isPublished",
];

async function preserveActionFormDraft(
  scope: DashboardFormDraftScope,
  formData: FormData,
  keys: string[],
) {
  writeDashboardFormDraft(
    await cookies(),
    scope,
    pickDashboardFormDraftValues(formData, keys),
  );
}

class AdminActionFormError extends Error {
  code: string;

  constructor(code: string) {
    super(code);
    this.name = "AdminActionFormError";
    this.code = code;
  }
}

function formError(code: string): never {
  throw new AdminActionFormError(code);
}

function hasText(formData: FormData, key: string) {
  return Boolean(textValue(formData, key));
}

function requireText(formData: FormData, key: string, code: string) {
  if (!hasText(formData, key)) {
    formError(code);
  }
}

function requireAnyText(formData: FormData, keys: string[], code: string) {
  if (!keys.some((key) => hasText(formData, key))) {
    formError(code);
  }
}

function requirePositiveNumber(formData: FormData, key: string, code: string) {
  const value = Number(textValue(formData, key));

  if (!Number.isFinite(value) || value <= 0) {
    formError(code);
  }
}

function requireNonNegativeNumber(
  formData: FormData,
  key: string,
  code: string,
) {
  const value = Number(textValue(formData, key));

  if (!Number.isFinite(value) || value < 0) {
    formError(code);
  }
}

function requireValidJson(
  value: string | null,
  expectedType: "array" | "object",
  code: string,
) {
  if (!value) {
    return;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    const isExpected =
      expectedType === "array"
        ? Array.isArray(parsed)
        : parsed !== null &&
          typeof parsed === "object" &&
          !Array.isArray(parsed);

    if (!isExpected) {
      formError(code);
    }
  } catch {
    formError(code);
  }
}

function getActionErrorCode(error: unknown) {
  if (
    error instanceof AdminActionFormError ||
    error instanceof RoshalCheckoutError ||
    error instanceof RoshalOrderStatusError ||
    error instanceof RoshalPageError ||
    error instanceof RoshalProductError ||
    error instanceof RoshalProductReviewError ||
    error instanceof RoshalSectionError ||
    error instanceof RoshalTaxonomyError ||
    error instanceof RoshalUserProfileError ||
    error instanceof RoshalUserRoleError
  ) {
    return error.code;
  }

  return "form-save-failed";
}

const actionFeedbackParams = [
  "actionId",
  "created",
  "deleted",
  "error",
  "key",
  "saved",
  "sectionId",
  "sectionKey",
  "sku",
  "slug",
  "subcategory",
];

function actionFeedbackId() {
  return Date.now().toString(36);
}

function replaceActionFeedback(
  path: string,
  params: Record<string, string | null | undefined> = {},
) {
  const url = new URL(path || "/", "https://roshal.local");

  for (const param of actionFeedbackParams) {
    url.searchParams.delete(param);
  }

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function appendActionError(
  path: string,
  code: string,
  params: Record<string, string | null | undefined> = {},
) {
  return replaceActionFeedback(path, {
    ...params,
    error: code,
  });
}

function errorRedirectPath(formData: FormData, fallbackPath: string) {
  return (
    textValue(formData, "errorRedirectTo") ||
    textValue(formData, "redirectTo") ||
    fallbackPath
  );
}

function redirectActionError(
  error: unknown,
  formData: FormData,
  fallbackPath: string,
  params: Record<string, string | null | undefined> = {},
): never {
  redirect(
    appendActionError(
      errorRedirectPath(formData, fallbackPath),
      getActionErrorCode(error),
      params,
    ),
  );
}

function hasSectionItemData(item: Record<string, unknown>) {
  return Boolean(
    item.title ||
      item.body ||
      item.label ||
      (typeof item.href === "string" && item.href.trim()) ||
      (typeof item.imageUrl === "string" && item.imageUrl.trim()) ||
      (typeof item.value === "string" && item.value.trim()),
  );
}

function normalizeSectionItemsJson(value: string | null) {
  if (!value) {
    return null;
  }

  const items = safeJsonParse<Record<string, unknown>[]>(value, []);

  if (!Array.isArray(items)) {
    return null;
  }

  const normalizedItems = items
    .map((item, index) => {
      const sortOrder = Number(item.sortOrder);

      return {
        index,
        item: {
          ...item,
          sortOrder: Number.isFinite(sortOrder) ? sortOrder : index,
        },
      };
    })
    .filter(({ item }) => hasSectionItemData(item))
    .sort((left, right) => {
      const leftSortOrder = Number(left.item.sortOrder);
      const rightSortOrder = Number(right.item.sortOrder);

      if (leftSortOrder !== rightSortOrder) {
        return leftSortOrder - rightSortOrder;
      }

      return left.index - right.index;
    })
    .map(({ item }) => item);

  return normalizedItems.length
    ? JSON.stringify(normalizedItems, null, 2)
    : null;
}

function buildPaymentOption(
  formData: FormData,
  key: RoshalPaymentMethod,
  sortOrder: number,
  fallback?: {
    enabled: boolean;
    mode: "manual" | "gateway";
    label: { bn: string; en: string };
    merchantLabel: { bn: string; en: string };
    accountType: string;
    accountNumber: string;
    instructions: { bn: string; en: string };
    guideImageUrl: string;
    requiresProof: boolean;
    sortOrder: number;
  },
) {
  return {
    key,
    enabled: formData.has(`${key}Enabled`)
      ? boolValue(formData, `${key}Enabled`)
      : (fallback?.enabled ?? false),
    mode: formData.has(`${key}Mode`)
      ? textValue(formData, `${key}Mode`) === "gateway"
        ? "gateway"
        : "manual"
      : (fallback?.mode ?? "manual"),
    label: {
      bn: formData.has(`${key}LabelBn`)
        ? textValue(formData, `${key}LabelBn`)
        : (fallback?.label.bn ?? ""),
      en: formData.has(`${key}LabelEn`)
        ? textValue(formData, `${key}LabelEn`)
        : (fallback?.label.en ?? ""),
    },
    merchantLabel: {
      bn: formData.has(`${key}MerchantLabelBn`)
        ? textValue(formData, `${key}MerchantLabelBn`)
        : (fallback?.merchantLabel.bn ?? ""),
      en: formData.has(`${key}MerchantLabelEn`)
        ? textValue(formData, `${key}MerchantLabelEn`)
        : (fallback?.merchantLabel.en ?? ""),
    },
    accountType: formData.has(`${key}AccountType`)
      ? textValue(formData, `${key}AccountType`) || "mobile-wallet"
      : (fallback?.accountType ?? "mobile-wallet"),
    accountNumber: formData.has(`${key}AccountNumber`)
      ? textValue(formData, `${key}AccountNumber`)
      : (fallback?.accountNumber ?? ""),
    instructions: {
      bn: formData.has(`${key}InstructionsBn`)
        ? textValue(formData, `${key}InstructionsBn`)
        : (fallback?.instructions.bn ?? ""),
      en: formData.has(`${key}InstructionsEn`)
        ? textValue(formData, `${key}InstructionsEn`)
        : (fallback?.instructions.en ?? ""),
    },
    guideImageUrl: formData.has(`${key}GuideImageUrl`)
      ? textValue(formData, `${key}GuideImageUrl`)
      : (fallback?.guideImageUrl ?? ""),
    requiresProof: false,
    sortOrder: formData.has(`${key}SortOrder`)
      ? numberValue(formData, `${key}SortOrder`) || sortOrder
      : (fallback?.sortOrder ?? sortOrder),
  } as const;
}

function normalizePaymentOptionsInput(
  options: Partial<RoshalPaymentOption>[],
  fallbackOptions: RoshalPaymentOption[],
) {
  const fallbackByKey = new Map(
    fallbackOptions.map((option) => [
      normalizeRoshalPaymentMethodKey(option.key),
      option,
    ]),
  );
  const seenKeys = new Set<string>();

  return options
    .map((option, index) => {
      const key = normalizeRoshalPaymentMethodKey(
        option.key,
        `payment_provider_${index + 1}`,
      );

      if (seenKeys.has(key)) {
        return null;
      }

      seenKeys.add(key);

      const fallback = fallbackByKey.get(key);
      const labelBn =
        option.label?.bn?.trim() ||
        fallback?.label.bn ||
        option.label?.en?.trim() ||
        key;
      const labelEn =
        option.label?.en?.trim() ||
        fallback?.label.en ||
        option.label?.bn?.trim() ||
        key;

      const normalizedOption: RoshalPaymentOption = {
        key,
        enabled: option.enabled !== false,
        mode: option.mode === "gateway" ? "gateway" : "manual",
        label: {
          bn: labelBn,
          en: labelEn,
        },
        merchantLabel: {
          bn:
            option.merchantLabel?.bn !== undefined
              ? option.merchantLabel.bn.trim()
              : (fallback?.merchantLabel.bn ?? ""),
          en:
            option.merchantLabel?.en !== undefined
              ? option.merchantLabel.en.trim()
              : (fallback?.merchantLabel.en ?? ""),
        },
        accountType:
          option.accountType?.trim() ||
          fallback?.accountType ||
          "mobile-wallet",
        accountNumber:
          option.accountNumber !== undefined
            ? option.accountNumber.trim()
            : (fallback?.accountNumber ?? ""),
        instructions: {
          bn:
            option.instructions?.bn !== undefined
              ? option.instructions.bn.trim()
              : (fallback?.instructions.bn ?? ""),
          en:
            option.instructions?.en !== undefined
              ? option.instructions.en.trim()
              : (fallback?.instructions.en ?? ""),
        },
        guideImageUrl:
          option.guideImageUrl !== undefined
            ? option.guideImageUrl.trim()
            : (fallback?.guideImageUrl ?? ""),
        requiresProof: false,
        sortOrder: Number.isFinite(Number(option.sortOrder))
          ? Number(option.sortOrder)
          : index,
      };

      return normalizedOption;
    })
    .filter((option): option is RoshalPaymentOption => option !== null)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

function validatePaymentOptions(options: RoshalPaymentOption[]) {
  if (options.length === 0) {
    formError("missing-payment-options");
  }

  for (const option of options) {
    if (!option.enabled) {
      continue;
    }

    if (!option.label.bn.trim() && !option.label.en.trim()) {
      formError("missing-payment-label");
    }

    const isManualWallet =
      option.mode === "manual" &&
      !["cash_on_delivery", "card"].includes(String(option.key));

    if (isManualWallet && !option.accountNumber.trim()) {
      formError("missing-payment-account");
    }
  }
}

function validatePurchaseOptions(options: RoshalProductPurchaseOption[]) {
  for (const option of options) {
    if (!option.size && !option.amount) {
      continue;
    }

    if (!Number.isFinite(Number(option.price)) || Number(option.price) <= 0) {
      formError("missing-product-price");
    }

    if (
      !Number.isFinite(Number(option.inventory)) ||
      Number(option.inventory) < 0
    ) {
      formError("invalid-product-inventory");
    }
  }
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

function finishActionWithFeedback(
  defaultPath: string,
  formData: FormData,
  revalidatePaths: string[],
  feedback: Record<string, string | null | undefined>,
) {
  for (const path of revalidatePaths) {
    revalidatePath(path);
  }

  redirect(
    replaceActionFeedback(textValue(formData, "redirectTo") || defaultPath, {
      ...feedback,
      actionId: actionFeedbackId(),
    }),
  );
}

export async function saveRoshalSiteSettings(formData: FormData) {
  await requireRoshalAdmin();

  try {
    requireText(formData, "brandName", "missing-site-brand-name");
    requireAnyText(
      formData,
      ["primaryCtaLabelBn", "primaryCtaLabelEn"],
      "missing-site-cta-label",
    );
    requireValidJson(
      optionalTextValue(formData, "deliveryZonesJson"),
      "array",
      "form-save-failed",
    );

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
      deliverySettings: {
        enableFreeDelivery: boolValue(formData, "enableFreeDelivery"),
        freeDeliveryThreshold: numberValue(formData, "freeDeliveryThreshold"),
      },
    });
  } catch (error) {
    redirectActionError(error, formData, "/dashboard/settings");
  }

  finishAction("/dashboard/theme", formData, [
    "/",
    "/about",
    "/contact",
    "/cart",
    "/checkout",
    "/dashboard/settings",
    "/dashboard/theme",
    "/dashboard/payments",
  ]);
}

export async function saveRoshalPaymentSettings(formData: FormData) {
  await requireRoshalAdmin();
  const paymentMethodOrder: RoshalPaymentMethod[] = [
    "cash_on_delivery",
    "card",
    "bkash",
    "nagad",
  ];

  try {
    const existingSettings = await getRoshalPaymentSettings();
    const submittedOptions = formData.has("paymentOptionsJson")
      ? normalizePaymentOptionsInput(
          jsonValue<Partial<RoshalPaymentOption>[]>(
            formData,
            "paymentOptionsJson",
            [],
          ),
          existingSettings.options,
        )
      : null;
    const options =
      submittedOptions !== null
        ? submittedOptions
        : paymentMethodOrder.map((key, index) =>
            buildPaymentOption(
              formData,
              key,
              index,
              existingSettings.options.find((option) => option.key === key),
            ),
          );

    validatePaymentOptions(options);

    await upsertRoshalPaymentSettings({
      id: textValue(formData, "id") || undefined,
      manualReviewNoticeBn: formData.has("manualReviewNoticeBn")
        ? textValue(formData, "manualReviewNoticeBn")
        : existingSettings.manualReviewNotice.bn,
      manualReviewNoticeEn: formData.has("manualReviewNoticeEn")
        ? textValue(formData, "manualReviewNoticeEn")
        : existingSettings.manualReviewNotice.en,
      supportMessageBn: formData.has("supportMessageBn")
        ? textValue(formData, "supportMessageBn")
        : existingSettings.supportMessage.bn,
      supportMessageEn: formData.has("supportMessageEn")
        ? textValue(formData, "supportMessageEn")
        : existingSettings.supportMessage.en,
      options,
    });
  } catch (error) {
    redirectActionError(error, formData, "/dashboard/settings");
  }

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
    requireText(formData, "key", "missing-category-key");
    requireAnyText(formData, ["labelBn", "labelEn"], "missing-category-label");

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
    await preserveActionFormDraft("category", formData, categoryDraftKeys);
    redirectActionError(error, formData, "/dashboard/categories", {
      key: textValue(formData, "key"),
    });
  }

  finishActionWithFeedback(
    "/dashboard/categories",
    formData,
    ["/", "/products", "/dashboard/categories"],
    { saved: categoryId ? "category" : "category-created" },
  );
}

export async function saveRoshalSubcategory(formData: FormData) {
  await requireRoshalAdmin();

  try {
    requireText(formData, "categoryId", "missing-subcategory-parent");
    requireText(formData, "key", "missing-subcategory-key");
    requireAnyText(
      formData,
      ["labelBn", "labelEn"],
      "missing-subcategory-label",
    );

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
    await preserveActionFormDraft(
      "subcategory",
      formData,
      subcategoryDraftKeys,
    );
    redirectActionError(error, formData, "/dashboard/categories", {
      subcategory: textValue(formData, "key"),
    });
  }

  finishActionWithFeedback(
    "/dashboard/categories",
    formData,
    ["/", "/products", "/dashboard/categories"],
    {
      saved: textValue(formData, "id") ? "subcategory" : "subcategory-created",
    },
  );
}

export async function removeRoshalCategory(formData: FormData) {
  await requireRoshalAdmin();

  try {
    requireText(formData, "id", "missing-delete-id");
    await deleteRoshalCategory(textValue(formData, "id"));
  } catch (error) {
    redirectActionError(error, formData, "/dashboard/categories");
  }

  finishActionWithFeedback(
    "/dashboard/categories",
    formData,
    ["/", "/products", "/dashboard/categories"],
    { deleted: "category" },
  );
}

export async function removeRoshalSubcategory(formData: FormData) {
  await requireRoshalAdmin();

  try {
    requireText(formData, "id", "missing-delete-id");
    await deleteRoshalSubcategory(textValue(formData, "id"));
  } catch (error) {
    redirectActionError(error, formData, "/dashboard/categories");
  }

  finishActionWithFeedback(
    "/dashboard/categories",
    formData,
    ["/", "/products", "/dashboard/categories"],
    { deleted: "subcategory" },
  );
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
    requireText(formData, "slug", "missing-page-slug");
    requireAnyText(
      formData,
      ["navigationLabelBn", "navigationLabelEn"],
      "missing-page-label",
    );
    requireAnyText(formData, ["titleBn", "titleEn"], "missing-page-title");

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
    await preserveActionFormDraft("cms-page", formData, cmsPageDraftKeys);
    redirectActionError(error, formData, pageEditorPath, {
      slug: pageSlug || rawPageSlug,
    });
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
  redirect(
    replaceActionFeedback(
      textValue(formData, "redirectTo") || `/dashboard/pages/${id}`,
      { saved: pageId ? "page" : "page-created" },
    ),
  );
}

export async function removeRoshalPage(formData: FormData) {
  await requireRoshalAdmin();
  let deletedPage: Awaited<ReturnType<typeof deleteRoshalPage>> = null;

  try {
    requireText(formData, "id", "missing-delete-id");
    deletedPage = await deleteRoshalPage(textValue(formData, "id"));
  } catch (error) {
    redirectActionError(error, formData, "/dashboard/pages");
  }
  const deletedPath =
    deletedPage?.slug === "home"
      ? "/"
      : deletedPage
        ? `/${deletedPage.slug}`
        : "";

  for (const path of [
    deletedPath,
    "/",
    "/about",
    "/contact",
    "/dashboard/pages",
  ]) {
    if (path) {
      revalidatePath(path);
    }
  }

  redirect(
    replaceActionFeedback(
      textValue(formData, "redirectTo") || "/dashboard/pages",
      {
        deleted: "page",
      },
    ),
  );
}

export async function saveRoshalSection(formData: FormData) {
  await requireRoshalAdmin();

  const pageId = textValue(formData, "pageId");
  const pageSlug = textValue(formData, "pageSlug");
  const sectionKey = textValue(formData, "sectionKey");

  try {
    requireText(formData, "pageId", "missing-section-page");
    requireText(formData, "sectionKey", "missing-section-key");
    requireText(formData, "type", "missing-section-type");
    requireValidJson(
      optionalTextValue(formData, "itemsJson"),
      "array",
      "invalid-section-items",
    );
    requireValidJson(
      optionalTextValue(formData, "stylesJson"),
      "object",
      "invalid-section-styles",
    );

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
      itemsJson: normalizeSectionItemsJson(
        optionalTextValue(formData, "itemsJson"),
      ),
      stylesJson: optionalTextValue(formData, "stylesJson"),
    });
  } catch (error) {
    await preserveActionFormDraft("cms-section", formData, cmsSectionDraftKeys);
    redirectActionError(error, formData, `/dashboard/pages/${pageId}`, {
      sectionId: textValue(formData, "id"),
      sectionKey,
    });
  }

  finishAction(
    `/dashboard/pages/${pageId}?saved=${textValue(formData, "id") ? "section" : "section-created"}`,
    formData,
    [
      pageSlug === "home" ? "/" : `/${pageSlug}`,
      "/",
      "/about",
      "/contact",
      `/dashboard/pages/${pageId}`,
    ],
  );
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
  const basePrice = numberValue(formData, "price");
  const baseCompareAtPrice = numberValue(formData, "compareAtPrice") || null;
  const baseInventory = numberValue(formData, "inventory");
  const normalizedPurchaseOptions = normalizeRoshalProductPurchaseOptions({
    fallbackCompareAtPrice: baseCompareAtPrice,
    fallbackInventory: baseInventory,
    fallbackPrice: basePrice,
    value: jsonValue<RoshalProductPurchaseOption[]>(
      formData,
      "purchaseOptionsJson",
      [],
    ),
  }).filter(
    (option) => option.id !== "default" || option.size || option.amount,
  );
  const mergedFeatures = mergeRoshalProductFeatureInput({
    featuresBn: stringArrayValue(formData, "featuresBnJson"),
    featuresEn: stringArrayValue(formData, "featuresEnJson"),
    sizeOptions: normalizedPurchaseOptions
      .map((option) => [option.size, option.amount].filter(Boolean).join(" "))
      .filter(Boolean),
  });
  let id = productId;

  try {
    requireAnyText(formData, ["nameBn", "nameEn"], "missing-product-name");
    requireText(formData, "slug", "missing-product-slug");
    requireText(formData, "sku", "missing-product-sku");
    requireText(formData, "categoryKey", "missing-product-category");
    requirePositiveNumber(formData, "price", "missing-product-price");
    requireNonNegativeNumber(
      formData,
      "inventory",
      "invalid-product-inventory",
    );
    validatePurchaseOptions(normalizedPurchaseOptions);

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
      price: basePrice,
      compareAtPrice: baseCompareAtPrice,
      inventory: baseInventory,
      badge: optionalTextValue(formData, "badge"),
      heroImage: textValue(formData, "heroImage"),
      galleryJson: optionalTextValue(formData, "galleryJson"),
      featuresBnJson: JSON.stringify(mergedFeatures.bn),
      featuresEnJson: JSON.stringify(mergedFeatures.en),
      purchaseOptionsJson: JSON.stringify(normalizedPurchaseOptions),
      isFeatured: boolValue(formData, "isFeatured"),
      isPublished: boolValue(formData, "isPublished"),
      sortOrder: numberValue(formData, "sortOrder"),
    });
  } catch (error) {
    await preserveActionFormDraft("product", formData, productDraftKeys);
    redirectActionError(error, formData, productEditorPath, {
      sku: productSku,
      slug: productSlug,
    });
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

  redirect(
    replaceActionFeedback(
      productId ? `/dashboard/products/${id}` : "/dashboard/products",
      productId
        ? { saved: "1", actionId: actionFeedbackId() }
        : { created: "1", actionId: actionFeedbackId() },
    ),
  );
}

export async function removeRoshalProduct(formData: FormData) {
  await requireRoshalAdmin();
  let deletedProduct: Awaited<ReturnType<typeof deleteRoshalProduct>> = null;

  try {
    requireText(formData, "id", "missing-delete-id");
    deletedProduct = await deleteRoshalProduct(textValue(formData, "id"));
  } catch (error) {
    redirectActionError(error, formData, "/dashboard/products");
  }

  for (const path of [
    "/",
    "/products",
    deletedProduct ? `/products/${deletedProduct.slug}` : "",
    "/dashboard/products",
    "/dashboard/reviews",
  ]) {
    if (path) {
      revalidatePath(path);
    }
  }

  redirect(
    replaceActionFeedback("/dashboard/products", {
      deleted: "1",
      actionId: actionFeedbackId(),
    }),
  );
}

export async function saveRoshalProductReview(formData: FormData) {
  await requireRoshalAdmin();

  let redirectTo = "/dashboard/reviews?saved=review-created";

  try {
    requireText(formData, "productId", "missing-review-product");
    requireText(formData, "reviewerName", "missing-reviewer");
    requireText(formData, "comment", "missing-review-comment");

    await createRoshalProductReview({
      productId: textValue(formData, "productId"),
      reviewerName: textValue(formData, "reviewerName"),
      reviewerEmail: optionalTextValue(formData, "reviewerEmail"),
      rating: numberValue(formData, "rating"),
      comment: textValue(formData, "comment"),
      isPublished: boolValue(formData, "isPublished"),
    });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/dashboard/reviews");
  } catch (error) {
    redirectTo = appendActionError(
      errorRedirectPath(formData, "/dashboard/reviews"),
      getActionErrorCode(error),
    );
  }

  redirect(redirectTo);
}

export async function saveRoshalProductReviewPublication(formData: FormData) {
  await requireRoshalAdmin();

  let redirectTo = "/dashboard/reviews?saved=review-updated";

  try {
    requireText(formData, "id", "missing-delete-id");
    await updateRoshalProductReviewPublication(
      textValue(formData, "id"),
      boolValue(formData, "isPublished"),
    );
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/dashboard/reviews");
  } catch (error) {
    redirectTo = appendActionError(
      errorRedirectPath(formData, "/dashboard/reviews"),
      getActionErrorCode(error),
    );
  }

  redirect(redirectTo);
}

export async function removeRoshalProductReview(formData: FormData) {
  await requireRoshalAdmin();

  let redirectTo = "/dashboard/reviews?saved=review-deleted";

  try {
    requireText(formData, "id", "missing-delete-id");
    await deleteRoshalProductReview(textValue(formData, "id"));
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/dashboard/reviews");
  } catch (error) {
    redirectTo = appendActionError(
      errorRedirectPath(formData, "/dashboard/reviews"),
      getActionErrorCode(error),
    );
  }

  redirect(redirectTo);
}

export async function saveRoshalOrderStatus(formData: FormData) {
  await requireRoshalAdmin();

  const id = textValue(formData, "id");

  try {
    requireText(formData, "id", "missing-order-id");
    await updateRoshalOrderStatus({
      id,
      status: textValue(formData, "status") || "pending",
      paymentStatus: textValue(formData, "paymentStatus") || "pending",
      trackingNote: optionalTextValue(formData, "trackingNote"),
      adminReviewNote: optionalTextValue(formData, "adminReviewNote"),
    });
  } catch (error) {
    redirectActionError(error, formData, `/dashboard/orders/${id}`);
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
    requireText(formData, "id", "missing-user-id");
    await updateRoshalUserRole({
      id,
      role: textValue(formData, "role") || "user",
      isActive: boolValue(formData, "isActive"),
      actorId: sessionUser.id,
    });
  } catch (error) {
    redirectActionError(error, formData, `/dashboard/users/${id}`);
  }

  finishAction(`/dashboard/users/${id}`, formData, [
    "/dashboard/users",
    `/dashboard/users/${id}`,
  ]);
}

export async function removeRoshalUser(formData: FormData) {
  const sessionUser = await requireRoshalAdmin();
  const id = textValue(formData, "id");

  try {
    requireText(formData, "id", "missing-user-id");
    await deleteRoshalUser({
      id,
      actorId: sessionUser.id,
    });
  } catch (error) {
    redirectActionError(error, formData, "/dashboard/users");
  }

  finishAction("/dashboard/users?deleted=1", formData, [
    "/dashboard",
    "/dashboard/users",
  ]);
}

export async function saveRoshalUserProfile(formData: FormData) {
  const sessionUser = await requireRoshalUser();
  const id = textValue(formData, "id") || sessionUser.id;

  if (sessionUser.role !== "admin" && sessionUser.id !== id) {
    redirect("/profile");
  }

  try {
    requireText(formData, "name", "missing-user-name");
    await updateRoshalUserProfile({
      id,
      email: optionalTextValue(formData, "email") || undefined,
      name: textValue(formData, "name"),
      phone: optionalTextValue(formData, "phone"),
      preferredLanguage: textValue(formData, "preferredLanguage") || "bn",
      defaultAddress: optionalTextValue(formData, "defaultAddress"),
    });
  } catch (error) {
    redirectActionError(error, formData, "/profile");
  }

  finishAction("/profile", formData, [
    "/profile",
    "/dashboard/users",
    `/dashboard/users/${id}`,
  ]);
}

export async function submitRoshalCheckoutOrder(formData: FormData) {
  const sessionUser = await requireRoshalUser();
  const items = safeJsonParse(textValue(formData, "itemsJson"), []);
  let result: Awaited<ReturnType<typeof createValidatedRoshalOrder>>;

  try {
    result = await createValidatedRoshalOrder({
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
        (textValue(formData, "paymentMethod") as RoshalPaymentMethod) ||
        "cash_on_delivery",
      paymentReference:
        optionalTextValue(formData, "paymentReference") || undefined,
      paymentSender: optionalTextValue(formData, "paymentSender") || undefined,
      items,
    });
  } catch (error) {
    redirectActionError(error, formData, "/checkout");
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${result.id}`);
  revalidatePath("/profile");

  if (result.paymentUrl) {
    redirect(result.paymentUrl);
  }

  redirect(`/orders/${result.id}`);
}
