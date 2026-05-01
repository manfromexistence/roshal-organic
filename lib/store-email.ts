import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { getRoshalSiteSettings } from "@/lib/store-content";
import { formatBdt } from "@/lib/store-format";
import { getRoshalAbsoluteUrl } from "@/lib/store-site";
import type { RoshalOrderItem, RoshalPaymentMethod } from "@/lib/store-types";

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const MAX_RESEND_RECIPIENTS = 50;

export interface RoshalNewOrderEmailInput {
  orderId: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  paymentMethod: RoshalPaymentMethod;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: RoshalOrderItem[];
}

function envValue(key: string) {
  return process.env[key]?.trim().replace(/^["']|["']$/g, "") || "";
}

function isDeliverableEmail(value: string) {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
    !value.toLowerCase().endsWith(".local")
  );
}

function parseEmailList(value: string) {
  return value
    .split(/[,\n;]/)
    .map((item) => item.trim())
    .filter(isDeliverableEmail);
}

function uniqueEmails(values: string[]) {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = value.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function paymentMethodLabel(method: RoshalPaymentMethod) {
  switch (method) {
    case "cash_on_delivery":
      return "Cash On Delivery (COD)";
    case "bkash":
      return "bKash";
    case "nagad":
      return "Nagad";
    case "card":
      return "Card";
    default:
      return method;
  }
}

async function getRoshalOrderNotificationRecipients() {
  const configuredRecipients = uniqueEmails(
    parseEmailList(
      envValue("ROSHAL_ORDER_NOTIFICATION_EMAILS") ||
        envValue("ROSHAL_ADMIN_EMAIL") ||
        envValue("ADMIN_EMAIL"),
    ),
  );

  if (configuredRecipients.length > 0) {
    return configuredRecipients.slice(0, MAX_RESEND_RECIPIENTS);
  }

  const fallbackRecipients: string[] = [];

  try {
    const siteSettings = await getRoshalSiteSettings();
    fallbackRecipients.push(siteSettings.contactEmail);
  } catch {
    // Keep checkout reliable even when settings cannot be read.
  }

  try {
    const adminRows = await db
      .select({
        email: users.email,
      })
      .from(users)
      .where(and(eq(users.role, "admin"), eq(users.isActive, true)));

    fallbackRecipients.push(...adminRows.map((admin) => admin.email));
  } catch {
    // Email notification is best-effort and must not block order creation.
  }

  return uniqueEmails(fallbackRecipients.filter(isDeliverableEmail)).slice(
    0,
    MAX_RESEND_RECIPIENTS,
  );
}

function buildOrderEmail(input: RoshalNewOrderEmailInput) {
  const dashboardUrl = getRoshalAbsoluteUrl(
    `/dashboard/orders/${input.orderId}`,
  );
  const orderUrl = getRoshalAbsoluteUrl(`/orders/${input.orderId}`);
  const address = [input.addressLine1, input.addressLine2, input.city]
    .filter(Boolean)
    .join(", ");
  const lineItemsText = input.items
    .map(
      (item) =>
        `- ${item.name.en} x${item.quantity} = ${formatBdt(
          item.price * item.quantity,
          "en",
        )}`,
    )
    .join("\n");
  const lineItemsHtml = input.items
    .map(
      (item) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(
          item.name.en,
        )}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">${
          item.quantity
        }</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${escapeHtml(
          formatBdt(item.price * item.quantity, "en"),
        )}</td></tr>`,
    )
    .join("");
  const text = [
    `New order: ${input.orderNumber}`,
    "",
    `Customer: ${input.customerName}`,
    `Phone: ${input.phone}`,
    input.email ? `Email: ${input.email}` : "",
    `Address: ${address}`,
    `Payment: ${paymentMethodLabel(input.paymentMethod)}`,
    "",
    "Items:",
    lineItemsText,
    "",
    `Subtotal: ${formatBdt(input.subtotal, "en")}`,
    `Delivery: ${formatBdt(input.shippingFee, "en")}`,
    `Total: ${formatBdt(input.total, "en")}`,
    "",
    `Manage order: ${dashboardUrl}`,
    `Customer order page: ${orderUrl}`,
  ]
    .filter(Boolean)
    .join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;color:#162116;line-height:1.5;">
      <h2 style="margin:0 0 12px;">New order ${escapeHtml(input.orderNumber)}</h2>
      <p style="margin:0 0 16px;">A customer placed a new Roshal Organic order.</p>
      <table style="border-collapse:collapse;width:100%;max-width:640px;margin-bottom:16px;">
        <tbody>
          <tr><td style="padding:6px 0;color:#5b665b;">Customer</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(
            input.customerName,
          )}</td></tr>
          <tr><td style="padding:6px 0;color:#5b665b;">Phone</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(
            input.phone,
          )}</td></tr>
          <tr><td style="padding:6px 0;color:#5b665b;">Email</td><td style="padding:6px 0;">${escapeHtml(
            input.email || "-",
          )}</td></tr>
          <tr><td style="padding:6px 0;color:#5b665b;">Payment</td><td style="padding:6px 0;">${escapeHtml(
            paymentMethodLabel(input.paymentMethod),
          )}</td></tr>
          <tr><td style="padding:6px 0;color:#5b665b;">Address</td><td style="padding:6px 0;">${escapeHtml(
            address,
          )}</td></tr>
        </tbody>
      </table>
      <table style="border-collapse:collapse;width:100%;max-width:640px;margin-bottom:16px;border:1px solid #e5e7eb;">
        <thead>
          <tr style="background:#f4f8f4;"><th style="padding:8px;text-align:left;">Product</th><th style="padding:8px;text-align:center;">Qty</th><th style="padding:8px;text-align:right;">Amount</th></tr>
        </thead>
        <tbody>${lineItemsHtml}</tbody>
      </table>
      <p style="margin:0 0 6px;">Subtotal: <strong>${escapeHtml(
        formatBdt(input.subtotal, "en"),
      )}</strong></p>
      <p style="margin:0 0 6px;">Delivery: <strong>${escapeHtml(
        formatBdt(input.shippingFee, "en"),
      )}</strong></p>
      <p style="margin:0 0 16px;">Total: <strong>${escapeHtml(
        formatBdt(input.total, "en"),
      )}</strong></p>
      <p style="margin:0;"><a href="${escapeHtml(
        dashboardUrl,
      )}" style="display:inline-block;background:#13391f;color:white;text-decoration:none;padding:10px 14px;border-radius:6px;">Manage order</a></p>
    </div>
  `;

  return { html, text };
}

export async function sendRoshalNewOrderEmail(input: RoshalNewOrderEmailInput) {
  const apiKey = envValue("RESEND_API_KEY");

  if (!apiKey) {
    return { reason: "missing-api-key", sent: false };
  }

  const to = await getRoshalOrderNotificationRecipients();

  if (to.length === 0) {
    return { reason: "missing-recipient", sent: false };
  }

  const from =
    envValue("ROSHAL_ORDER_EMAIL_FROM") ||
    "Roshal Organic <orders@roshalorganic.bd>";
  const { html, text } = buildOrderEmail(input);
  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    body: JSON.stringify({
      from,
      html,
      subject: `New order ${input.orderNumber} - ${formatBdt(
        input.total,
        "en",
      )}`,
      tags: [
        { name: "type", value: "new_order" },
        { name: "order", value: input.orderNumber.replaceAll("-", "_") },
      ],
      text,
      to,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `roshal-new-order-${input.orderNumber}`,
      "User-Agent": "roshal-organic/1.0",
    },
    method: "POST",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return {
      reason: `resend-${response.status}${detail ? `: ${detail}` : ""}`,
      sent: false,
    };
  }

  return { sent: true };
}
