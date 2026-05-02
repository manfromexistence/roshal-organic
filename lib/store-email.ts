import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { getRoshalSiteSettings } from "@/lib/store-content";
import { formatBdt } from "@/lib/store-format";
import { humanizeRoshalPaymentMethodKey } from "@/lib/store-payment-methods";
import { getRoshalAbsoluteUrl } from "@/lib/store-site";
import type { RoshalOrderItem, RoshalPaymentMethod } from "@/lib/store-types";

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const BREVO_EMAIL_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const MAX_RESEND_RECIPIENTS = 50;
const DEFAULT_ROSHAL_CLIENT_ORDER_EMAIL = "roshalorganic@gmail.com";

type BrevoEmailAddress = {
  email: string;
  name?: string;
};

type SmtpTransportConfig =
  | string
  | {
      auth?: {
        pass: string;
        user: string;
      };
      host?: string;
      maxConnections?: number;
      maxMessages?: number;
      pool?: boolean;
      port?: number;
      secure?: boolean;
      service?: string;
    };

type SmtpTransporter = {
  sendMail: (message: {
    from: string;
    headers?: Record<string, string>;
    html: string;
    subject: string;
    text: string;
    to: string[];
  }) => Promise<unknown>;
};

let smtpTransporter: SmtpTransporter | null = null;

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

export interface RoshalPasswordResetEmailInput {
  name?: string | null;
  to: string;
  url: string;
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

function isSyntheticRoshalCustomerEmail(value: string) {
  return /^customer\+\d+@roshalorganic\.app$/i.test(value);
}

function parseEmailList(value: string) {
  return value
    .split(/[,\n;]/)
    .map((item) => item.trim())
    .filter(isDeliverableEmail);
}

function envFlag(key: string) {
  return ["1", "true", "yes", "on"].includes(envValue(key).toLowerCase());
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
      return humanizeRoshalPaymentMethodKey(method);
  }
}

async function getRoshalOrderNotificationRecipients() {
  const configuredRecipients = parseEmailList(
    envValue("ROSHAL_ORDER_NOTIFICATION_EMAILS") ||
      envValue("ROSHAL_ADMIN_EMAIL") ||
      envValue("ADMIN_EMAIL"),
  );
  const fallbackRecipients = parseEmailList(
    envValue("ROSHAL_CLIENT_ORDER_EMAIL") || DEFAULT_ROSHAL_CLIENT_ORDER_EMAIL,
  );

  if (configuredRecipients.length === 0) {
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
  }

  return uniqueEmails(
    [...configuredRecipients, ...fallbackRecipients].filter(isDeliverableEmail),
  ).slice(0, MAX_RESEND_RECIPIENTS);
}

function getSmtpTransportConfig(): SmtpTransportConfig | null {
  const smtpUrl = envValue("SMTP_URL") || envValue("NODEMAILER_SMTP_URL");

  if (smtpUrl) {
    return smtpUrl;
  }

  const service = envValue("SMTP_SERVICE") || envValue("EMAIL_SERVICE");
  const host = envValue("SMTP_HOST") || envValue("EMAIL_HOST");

  if (!service && !host) {
    return null;
  }

  const user = envValue("SMTP_USER") || envValue("EMAIL_USER");
  const pass =
    envValue("SMTP_PASS") ||
    envValue("SMTP_PASSWORD") ||
    envValue("EMAIL_PASS") ||
    envValue("EMAIL_PASSWORD");
  const configuredPort = Number.parseInt(
    envValue("SMTP_PORT") || envValue("EMAIL_PORT"),
    10,
  );
  const secure = envFlag("SMTP_SECURE") || configuredPort === 465;
  const port = Number.isFinite(configuredPort)
    ? configuredPort
    : secure
      ? 465
      : 587;
  const config: Exclude<SmtpTransportConfig, string> = {
    maxConnections: 3,
    maxMessages: 100,
    pool: true,
    port,
    secure,
  };

  if (service) {
    config.service = service;
  }

  if (host) {
    config.host = host;
  }

  if (user && pass) {
    config.auth = { pass, user };
  }

  return config;
}

function getOrderEmailFromAddress() {
  const explicitFrom =
    envValue("ROSHAL_ORDER_EMAIL_FROM") ||
    envValue("SMTP_FROM") ||
    envValue("EMAIL_FROM");

  if (explicitFrom) {
    return explicitFrom;
  }

  const smtpUser = envValue("SMTP_USER") || envValue("EMAIL_USER");

  return smtpUser
    ? `Roshal Organic <${smtpUser}>`
    : "Roshal Organic <roshalorganic@gmail.com>";
}

function getResendEmailFromAddress() {
  return (
    envValue("ROSHAL_ORDER_EMAIL_FROM") ||
    envValue("RESEND_FROM") ||
    envValue("EMAIL_FROM") ||
    "Roshal Organic <onboarding@resend.dev>"
  );
}

function getBrevoApiKey() {
  return envValue("BREVO_API_KEY") || envValue("SENDINBLUE_API_KEY");
}

function getBrevoEmailFromAddress() {
  return (
    envValue("BREVO_EMAIL_FROM") ||
    envValue("BREVO_SENDER_EMAIL") ||
    envValue("ROSHAL_ORDER_EMAIL_FROM") ||
    envValue("EMAIL_FROM") ||
    envValue("SMTP_FROM") ||
    "Roshal Organic <roshalorganic@gmail.com>"
  );
}

function parseEmailAddress(value: string): BrevoEmailAddress | null {
  const trimmed = value.trim();
  const namedMatch = trimmed.match(/^(.*?)<([^>]+)>$/);

  if (namedMatch) {
    const name = namedMatch[1].trim().replace(/^["']|["']$/g, "");
    const email = namedMatch[2].trim();

    return isDeliverableEmail(email)
      ? {
          email,
          name: name || undefined,
        }
      : null;
  }

  return isDeliverableEmail(trimmed) ? { email: trimmed } : null;
}

async function getSmtpTransporter() {
  const config = getSmtpTransportConfig();

  if (!config) {
    return null;
  }

  if (!smtpTransporter) {
    const nodemailer = await import("nodemailer");
    smtpTransporter = nodemailer.createTransport(
      config,
    ) as unknown as SmtpTransporter;
  }

  return smtpTransporter;
}

async function sendOrderEmailViaSmtp(input: {
  from: string;
  html: string;
  orderNumber: string;
  subject: string;
  text: string;
  to: string[];
}) {
  const transporter = await getSmtpTransporter();

  if (!transporter) {
    return { reason: "missing-email-provider", sent: false };
  }

  await transporter.sendMail({
    from: input.from,
    headers: {
      "X-Roshal-Order": input.orderNumber,
    },
    html: input.html,
    subject: input.subject,
    text: input.text,
    to: input.to,
  });

  return { provider: "smtp", sent: true };
}

async function sendEmailViaBrevo(input: {
  apiKey: string;
  from: string;
  headers?: Record<string, string>;
  html: string;
  subject: string;
  text: string;
  to: string[];
}) {
  const sender = parseEmailAddress(input.from);
  const recipients = input.to
    .filter(isDeliverableEmail)
    .map((email) => ({ email }));

  if (!sender) {
    return { reason: "invalid-brevo-sender", sent: false };
  }

  if (recipients.length === 0) {
    return { reason: "missing-recipient", sent: false };
  }

  const response = await fetch(BREVO_EMAIL_ENDPOINT, {
    body: JSON.stringify({
      headers: input.headers,
      htmlContent: input.html,
      sender,
      subject: input.subject,
      textContent: input.text,
      to: recipients,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "roshal-organic/1.0",
      "api-key": input.apiKey,
    },
    method: "POST",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return {
      reason: `brevo-${response.status}${detail ? `: ${detail}` : ""}`,
      sent: false,
    };
  }

  return { provider: "brevo", sent: true };
}

async function sendOrderEmailViaResend(input: {
  apiKey: string;
  from: string;
  html: string;
  orderNumber: string;
  subject: string;
  text: string;
  to: string[];
}) {
  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    body: JSON.stringify({
      from: input.from,
      html: input.html,
      subject: input.subject,
      tags: [
        { name: "type", value: "new_order" },
        { name: "order", value: input.orderNumber.replaceAll("-", "_") },
      ],
      text: input.text,
      to: input.to,
    }),
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
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

  return { provider: "resend", sent: true };
}

async function sendPasswordResetEmailViaResend(input: {
  apiKey: string;
  from: string;
  html: string;
  subject: string;
  text: string;
  to: string;
}) {
  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    body: JSON.stringify({
      from: input.from,
      html: input.html,
      subject: input.subject,
      tags: [{ name: "type", value: "password_reset" }],
      text: input.text,
      to: [input.to],
    }),
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `roshal-password-reset-${input.to.toLowerCase()}`,
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

  return { provider: "resend", sent: true };
}

function formatRoshalOrderItemEmailName(item: RoshalOrderItem) {
  const optionLabel = [item.optionSize, item.optionAmount]
    .filter(Boolean)
    .join(" ");

  return optionLabel ? `${item.name.en} (${optionLabel})` : item.name.en;
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
        `- ${formatRoshalOrderItemEmailName(item)} x${item.quantity} = ${formatBdt(
          item.price * item.quantity,
          "en",
        )}`,
    )
    .join("\n");
  const lineItemsHtml = input.items
    .map(
      (item) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(
          formatRoshalOrderItemEmailName(item),
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
  const brevoApiKey = getBrevoApiKey();
  const resendApiKey = envValue("RESEND_API_KEY");
  const to = await getRoshalOrderNotificationRecipients();

  if (to.length === 0) {
    return { reason: "missing-recipient", sent: false };
  }

  const from = brevoApiKey
    ? getBrevoEmailFromAddress()
    : resendApiKey
      ? getResendEmailFromAddress()
      : getOrderEmailFromAddress();
  const { html, text } = buildOrderEmail(input);
  const subject = `New order ${input.orderNumber} - ${formatBdt(
    input.total,
    "en",
  )}`;

  if (brevoApiKey) {
    return sendEmailViaBrevo({
      apiKey: brevoApiKey,
      from,
      headers: {
        "X-Roshal-Email-Type": "new-order",
        "X-Roshal-Order": input.orderNumber,
      },
      html,
      subject,
      text,
      to,
    });
  }

  if (resendApiKey) {
    return sendOrderEmailViaResend({
      apiKey: resendApiKey,
      from,
      html,
      orderNumber: input.orderNumber,
      subject,
      text,
      to,
    });
  }

  return sendOrderEmailViaSmtp({
    from,
    html,
    orderNumber: input.orderNumber,
    subject,
    text,
    to,
  });
}

export async function sendRoshalPasswordResetEmail(
  input: RoshalPasswordResetEmailInput,
) {
  const to = input.to.trim();

  if (!isDeliverableEmail(to) || isSyntheticRoshalCustomerEmail(to)) {
    return { reason: "undeliverable-email", sent: false };
  }

  const brevoApiKey = getBrevoApiKey();
  const resendApiKey = envValue("RESEND_API_KEY");
  const from = brevoApiKey
    ? getBrevoEmailFromAddress()
    : resendApiKey
      ? getResendEmailFromAddress()
      : getOrderEmailFromAddress();
  const displayName = input.name?.trim() || "customer";
  const subject = "Reset your Roshal Organic password";
  const text = [
    `Hello ${displayName},`,
    "",
    "Use this link to reset your Roshal Organic password:",
    input.url,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;color:#162116;line-height:1.5;">
      <h2 style="margin:0 0 12px;">Reset your Roshal Organic password</h2>
      <p style="margin:0 0 16px;">Hello ${escapeHtml(displayName)}, use the button below to set a new password.</p>
      <p style="margin:0 0 16px;"><a href="${escapeHtml(
        input.url,
      )}" style="display:inline-block;background:#13391f;color:white;text-decoration:none;padding:10px 14px;border-radius:6px;">Reset password</a></p>
      <p style="margin:0;color:#5b665b;font-size:13px;">If the button does not work, copy this link into your browser:<br>${escapeHtml(
        input.url,
      )}</p>
      <p style="margin:16px 0 0;color:#5b665b;font-size:13px;">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  if (brevoApiKey) {
    return sendEmailViaBrevo({
      apiKey: brevoApiKey,
      from,
      headers: {
        "X-Roshal-Email-Type": "password-reset",
      },
      html,
      subject,
      text,
      to: [to],
    });
  }

  if (resendApiKey) {
    return sendPasswordResetEmailViaResend({
      apiKey: resendApiKey,
      from,
      html,
      subject,
      text,
      to,
    });
  }

  const transporter = await getSmtpTransporter();

  if (!transporter) {
    return { reason: "missing-email-provider", sent: false };
  }

  await transporter.sendMail({
    from,
    headers: {
      "X-Roshal-Email-Type": "password-reset",
    },
    html,
    subject,
    text,
    to: [to],
  });

  return { provider: "smtp", sent: true };
}
