import { ROSHAL_GATEWAY_PAYMENT_METHODS } from "@/lib/store-payment-methods";
import { getRoshalAbsoluteUrl } from "@/lib/store-site";
import type {
  RoshalPaymentGatewayProvider,
  RoshalPaymentGatewaySummary,
  RoshalPaymentMethod,
} from "@/lib/store-types";

interface AamarPayCheckoutSessionInput {
  amount: number;
  city: string;
  customerName: string;
  email?: string | null;
  orderId: string;
  orderNumber: string;
  paymentMethod: RoshalPaymentMethod;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  postalCode?: string | null;
}

export interface RoshalGatewayCheckoutSession {
  paymentUrl: string;
  provider: RoshalPaymentGatewayProvider;
}

export interface RoshalGatewayVerificationResult {
  amount: number | null;
  gatewayTransactionId: string;
  paymentType: string;
  payStatus: string;
  raw: Record<string, string>;
  statusCode: string;
}

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function parseSupportedGatewayMethods(value: string | undefined) {
  if (!value?.trim()) {
    return [...ROSHAL_GATEWAY_PAYMENT_METHODS];
  }

  const values = value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is RoshalPaymentMethod =>
      ROSHAL_GATEWAY_PAYMENT_METHODS.includes(item as RoshalPaymentMethod),
    );

  return values.length ? values : [...ROSHAL_GATEWAY_PAYMENT_METHODS];
}

function getRoshalGatewayProvider(): RoshalPaymentGatewayProvider | null {
  const value = (process.env.ROSHAL_PAYMENT_GATEWAY_PROVIDER || "aamarpay")
    .trim()
    .toLowerCase();

  return value === "aamarpay" ? "aamarpay" : null;
}

function getAamarPayEnvironment(): "sandbox" | "live" {
  return parseBoolean(
    process.env.AAMARPAY_SANDBOX,
    process.env.NODE_ENV !== "production",
  )
    ? "sandbox"
    : "live";
}

function getAamarPayBaseUrl() {
  const baseUrl = process.env.AAMARPAY_BASE_URL?.trim();

  if (baseUrl) {
    return trimTrailingSlash(baseUrl);
  }

  return getAamarPayEnvironment() === "sandbox"
    ? "https://sandbox.aamarpay.com"
    : "https://secure.aamarpay.com";
}

function getAamarPayConfig() {
  const provider = getRoshalGatewayProvider();
  const environment = provider ? getAamarPayEnvironment() : null;
  const storeId = process.env.AAMARPAY_STORE_ID?.trim() || "";
  const signatureKey = process.env.AAMARPAY_SIGNATURE_KEY?.trim() || "";
  const supportedMethods = parseSupportedGatewayMethods(
    process.env.ROSHAL_PAYMENT_GATEWAY_METHODS,
  );
  const missingEnvKeys: string[] = [];

  if (provider === "aamarpay") {
    if (!storeId) {
      missingEnvKeys.push("AAMARPAY_STORE_ID");
    }

    if (!signatureKey) {
      missingEnvKeys.push("AAMARPAY_SIGNATURE_KEY");
    }
  }

  return {
    baseUrl: provider ? getAamarPayBaseUrl() : "",
    configured: provider === "aamarpay" && missingEnvKeys.length === 0,
    environment,
    missingEnvKeys,
    provider,
    signatureKey,
    storeId,
    supportedMethods,
  };
}

function normalizeEmail(email: string | null | undefined, orderNumber: string) {
  const trimmed = email?.trim();
  return trimmed || `${orderNumber.toLowerCase()}@roshal-organic.local`;
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function numberFromUnknown(value: unknown) {
  const parsed = Number.parseFloat(String(value ?? "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function jsonToRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, String(entry ?? "")]),
  );
}

async function toGatewayPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return jsonToRecord(await request.json());
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();

    return Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        String(value),
      ]),
    );
  }

  const text = await request.text();

  if (!text.trim()) {
    return {};
  }

  try {
    return jsonToRecord(JSON.parse(text));
  } catch {
    return Object.fromEntries(new URLSearchParams(text).entries());
  }
}

export function getRoshalPaymentGatewaySummary(): RoshalPaymentGatewaySummary {
  const config = getAamarPayConfig();

  return {
    provider: config.provider,
    configured: config.configured,
    environment: config.environment,
    supportedMethods: config.supportedMethods,
    missingEnvKeys: config.missingEnvKeys,
    callbackUrls: {
      success: getRoshalAbsoluteUrl("/api/payments/aamarpay/success"),
      fail: getRoshalAbsoluteUrl("/api/payments/aamarpay/fail"),
      cancel: getRoshalAbsoluteUrl("/api/payments/aamarpay/cancel"),
      ipn: getRoshalAbsoluteUrl("/api/payments/aamarpay/ipn"),
    },
  };
}

export function hasRoshalGatewayIntegration(method: RoshalPaymentMethod) {
  const summary = getRoshalPaymentGatewaySummary();

  return summary.configured && summary.supportedMethods.includes(method);
}

export async function createRoshalGatewayCheckoutSession(
  input: AamarPayCheckoutSessionInput,
): Promise<RoshalGatewayCheckoutSession> {
  const config = getAamarPayConfig();

  if (config.provider !== "aamarpay" || !config.configured) {
    throw new Error("AamarPay is not configured.");
  }

  const callbackUrls = getRoshalPaymentGatewaySummary().callbackUrls;
  const response = await fetch(`${config.baseUrl}/jsonpost.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      store_id: config.storeId,
      signature_key: config.signatureKey,
      tran_id: input.orderNumber,
      amount: input.amount.toFixed(2),
      currency: "BDT",
      desc: `Roshal Organic order ${input.orderNumber}`,
      cus_name: input.customerName,
      cus_email: normalizeEmail(input.email, input.orderNumber),
      cus_phone: input.phone,
      cus_add1: input.addressLine1,
      cus_add2: normalizeOptionalText(input.addressLine2),
      cus_city: input.city,
      cus_state: input.city,
      cus_country: "Bangladesh",
      cus_postcode: normalizeOptionalText(input.postalCode),
      success_url: callbackUrls.success,
      fail_url: callbackUrls.fail,
      cancel_url: callbackUrls.cancel,
      type: "json",
      opt_a: input.orderId,
      opt_b: input.paymentMethod,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `AamarPay initiation failed with status ${response.status}.`,
    );
  }

  const payload = jsonToRecord(await response.json());
  const paymentUrl = payload.payment_url?.trim();

  if (!paymentUrl) {
    throw new Error("AamarPay did not return a payment URL.");
  }

  return {
    paymentUrl,
    provider: "aamarpay",
  };
}

export async function verifyRoshalGatewayTransaction(
  orderNumber: string,
): Promise<RoshalGatewayVerificationResult> {
  const config = getAamarPayConfig();

  if (config.provider !== "aamarpay" || !config.configured) {
    throw new Error("AamarPay is not configured.");
  }

  const url = new URL(`${config.baseUrl}/api/v1/trxcheck/request.php`);
  url.searchParams.set("request_id", orderNumber);
  url.searchParams.set("store_id", config.storeId);
  url.searchParams.set("signature_key", config.signatureKey);
  url.searchParams.set("type", "json");

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `AamarPay verification failed with status ${response.status}.`,
    );
  }

  const payload = jsonToRecord(await response.json());

  return {
    amount: numberFromUnknown(payload.amount_bdt || payload.amount),
    gatewayTransactionId:
      payload.bank_trxid || payload.bank_txn || payload.pg_txnid || "",
    paymentType: payload.payment_type || payload.card_type || "",
    payStatus: payload.pay_status || "",
    raw: payload,
    statusCode: payload.status_code || "",
  };
}

export async function readRoshalGatewayCallbackPayload(request: Request) {
  const payload = await toGatewayPayload(request);

  return {
    gatewayTransactionId:
      payload.bank_trxid || payload.bank_txn || payload.pg_txnid || "",
    orderId: payload.opt_a || "",
    orderNumber: payload.mer_txnid || "",
    paymentType: payload.payment_type || payload.card_type || "",
    payStatus: payload.pay_status || "",
    raw: payload,
    statusCode: payload.status_code || "",
  };
}
