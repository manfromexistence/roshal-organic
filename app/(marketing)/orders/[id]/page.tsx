import Image from "next/image";
import { notFound } from "next/navigation";
import { OrderTrackingTimeline } from "@/components/storefront/order-tracking-timeline";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveImageUrl } from "@/lib/storage-utils";
import { requireRoshalUser } from "@/lib/store-auth";
import { getRoshalOrderById } from "@/lib/store-content";
import { formatBdt, formatOrderDate } from "@/lib/store-format";
import { getRoshalLocale } from "@/lib/store-i18n";
import {
  getRoshalOrderStatusBadgeVariant,
  getRoshalOrderStatusLabel,
  getRoshalPaymentMethodLabel,
  getRoshalPaymentStatusBadgeVariant,
  getRoshalPaymentStatusLabel,
} from "@/lib/store-orders";

export default async function OrderTrackingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const [{ id }, locale, sessionUser, resolvedSearchParams] = await Promise.all(
    [params, getRoshalLocale(), requireRoshalUser(), searchParams],
  );
  const order = await getRoshalOrderById(id);

  if (!order || order.userId !== sessionUser.id) {
    notFound();
  }

  const paymentMessage = getOrderPaymentMessage(
    locale,
    resolvedSearchParams.payment,
  );

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "অর্ডার ট্র্যাকিং" : "Order tracking"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {order.orderNumber}
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatOrderDate(order.createdAt, locale)}
        </p>
      </div>

      {paymentMessage ? (
        <Alert>
          <AlertDescription>{paymentMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "ট্র্যাকিং স্ট্যাটাস" : "Tracking status"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={getRoshalOrderStatusBadgeVariant(order.status)}>
                {locale === "bn"
                  ? getRoshalOrderStatusLabel(order.status).bn
                  : getRoshalOrderStatusLabel(order.status).en}
              </Badge>
              <Badge
                variant={getRoshalPaymentStatusBadgeVariant(
                  order.paymentStatus,
                )}
              >
                {locale === "bn"
                  ? getRoshalPaymentStatusLabel(order.paymentStatus).bn
                  : getRoshalPaymentStatusLabel(order.paymentStatus).en}
              </Badge>
            </div>
            <OrderTrackingTimeline order={order} locale={locale} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "অর্ডার সারাংশ" : "Order overview"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <InfoRow
              label={locale === "bn" ? "পেমেন্ট মাধ্যম" : "Payment method"}
              value={
                locale === "bn"
                  ? getRoshalPaymentMethodLabel(order.paymentMethod).bn
                  : getRoshalPaymentMethodLabel(order.paymentMethod).en
              }
            />
            <InfoRow
              label={locale === "bn" ? "পেমেন্ট স্ট্যাটাস" : "Payment status"}
              value={
                locale === "bn"
                  ? getRoshalPaymentStatusLabel(order.paymentStatus).bn
                  : getRoshalPaymentStatusLabel(order.paymentStatus).en
              }
            />
            <InfoRow
              label={locale === "bn" ? "ট্রানজ্যাকশন আইডি" : "Transaction ID"}
              value={
                order.gatewayTransactionId || order.paymentReference || "-"
              }
            />
            <InfoRow
              label={locale === "bn" ? "সেন্ডার নম্বর" : "Sender number"}
              value={order.gatewayPaymentType || order.paymentSender || "-"}
            />
            <InfoRow
              label={locale === "bn" ? "যাচাই হয়েছে" : "Verified at"}
              value={
                order.verifiedAt
                  ? formatOrderDate(order.verifiedAt, locale)
                  : "-"
              }
            />
            <InfoRow
              label={locale === "bn" ? "সাবটোটাল" : "Subtotal"}
              value={formatBdt(order.subtotal, locale)}
            />
            <InfoRow
              label={locale === "bn" ? "ডেলিভারি" : "Delivery"}
              value={formatBdt(order.shippingFee, locale)}
            />
            {order.discount > 0 ? (
              <InfoRow
                label={locale === "bn" ? "ডিসকাউন্ট" : "Discount"}
                value={formatBdt(order.discount, locale)}
              />
            ) : null}
            <InfoRow
              label={locale === "bn" ? "মোট" : "Total"}
              value={formatBdt(order.total, locale)}
              emphasize
            />

            {order.notes ? (
              <NoteBlock
                title={locale === "bn" ? "আপনার নোট" : "Your note"}
                body={order.notes}
              />
            ) : null}
            {order.trackingNote ? (
              <NoteBlock
                title={locale === "bn" ? "ট্র্যাকিং নোট" : "Tracking note"}
                body={order.trackingNote}
              />
            ) : null}
            {order.adminReviewNote ? (
              <NoteBlock
                title={locale === "bn" ? "অ্যাডমিন নোট" : "Admin note"}
                body={order.adminReviewNote}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "অর্ডার আইটেম" : "Order items"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div
                key={`${order.id}-${item.productId}`}
                className="flex flex-col gap-4 rounded-2xl border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative size-16 overflow-hidden rounded-xl border border-border/70 bg-muted">
                    <Image
                      src={resolveImageUrl(item.image)}
                      alt={locale === "bn" ? item.name.bn : item.name.en}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {locale === "bn" ? item.name.bn : item.name.en}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">
                        {locale === "bn" ? "পরিমাণ" : "Qty"} {item.quantity}
                      </Badge>
                      <span>
                        {locale === "bn" ? "ইউনিট" : "Unit"}{" "}
                        {formatBdt(item.price, locale)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold text-primary">
                  {formatBdt(item.price * item.quantity, locale)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "bn" ? "ডেলিভারি তথ্য" : "Delivery details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <InfoRow
                label={locale === "bn" ? "গ্রাহক" : "Customer"}
                value={order.customerName}
              />
              <InfoRow
                label={locale === "bn" ? "ফোন" : "Phone"}
                value={order.phone}
              />
              <InfoRow
                label={locale === "bn" ? "ইমেইল" : "Email"}
                value={order.email || "-"}
              />
              <InfoRow
                label={locale === "bn" ? "ঠিকানা" : "Address"}
                value={formatDeliveryAddress(order)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          emphasize ? "text-right font-semibold" : "text-right font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}

function NoteBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function formatDeliveryAddress(order: {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
}) {
  return [
    order.addressLine1,
    order.addressLine2 || null,
    order.city,
    order.postalCode || null,
  ]
    .filter(Boolean)
    .join(", ");
}

function getOrderPaymentMessage(
  locale: "bn" | "en",
  payment: string | undefined,
) {
  switch (payment) {
    case "success":
      return locale === "bn"
        ? "পেমেন্ট সফলভাবে গ্রহণ করা হয়েছে।"
        : "Payment was received successfully.";
    case "failed":
      return locale === "bn"
        ? "পেমেন্ট ব্যর্থ হয়েছে। চাইলে আবার চেষ্টা করুন।"
        : "Payment failed. You can try again.";
    case "cancelled":
      return locale === "bn"
        ? "পেমেন্ট বাতিল করা হয়েছে।"
        : "Payment was cancelled.";
    case "processing":
      return locale === "bn"
        ? "পেমেন্ট যাচাই চলছে। সর্বশেষ অবস্থা এখানে আপডেট হবে।"
        : "Payment verification is in progress. The latest status will appear here.";
    default:
      return null;
  }
}
