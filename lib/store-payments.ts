import type {
  RoshalPaymentGatewayProvider,
  RoshalPaymentGatewaySummary,
  RoshalPaymentMethod,
} from "@/lib/store-types";

interface GatewayCheckoutSessionInput {
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

function gatewayNotConfiguredError() {
  return new Error("A live payment gateway is not configured for this store.");
}

export function getRoshalPaymentGatewaySummary(): RoshalPaymentGatewaySummary {
  return {
    provider: null,
    configured: false,
    environment: null,
    supportedMethods: [],
    missingEnvKeys: [],
    callbackUrls: {
      success: "",
      fail: "",
      cancel: "",
      ipn: "",
    },
  };
}

export function hasRoshalGatewayIntegration(_method: RoshalPaymentMethod) {
  return false;
}

export async function createRoshalGatewayCheckoutSession(
  _input: GatewayCheckoutSessionInput,
): Promise<RoshalGatewayCheckoutSession> {
  throw gatewayNotConfiguredError();
}

export async function verifyRoshalGatewayTransaction(
  _orderNumber: string,
): Promise<RoshalGatewayVerificationResult> {
  throw gatewayNotConfiguredError();
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
