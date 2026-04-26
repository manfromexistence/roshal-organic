import Image from "next/image";
import { notFound } from "next/navigation";
import { saveRoshalOrderStatus } from "@/actions/roshal-admin";
import { DashboardFormSelect } from "@/components/roshal/dashboard/form-select";
import { OrderTrackingTimeline } from "@/components/roshal/storefront/order-tracking-timeline";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/roshal/auth";
import { getRoshalOrderById } from "@/lib/roshal/content";
import { formatBdt, formatOrderDate } from "@/lib/roshal/format";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import {
  getRoshalOrderStatusBadgeVariant,
  getRoshalOrderStatusLabel,
  getRoshalPaymentMethodLabel,
  getRoshalPaymentStatusBadgeVariant,
  getRoshalPaymentStatusLabel,
} from "@/lib/roshal/orders";
import { resolveImageUrl } from "@/lib/storage-utils";

export default async function DashboardOrderDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, locale, resolvedSearchParams] = await Promise.all([
    params,
    getRoshalLocale(),
    searchParams,
    requireRoshalAdmin(),
  ]);
  const order = await getRoshalOrderById(id);

  if (!order) {
    notFound();
  }

  const orderStatusErrorMessage = getOrderStatusErrorMessage(
    locale,
    resolvedSearchParams.error,
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "অর্ডার" : "Order"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {order.orderNumber}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Badge variant={getRoshalOrderStatusBadgeVariant(order.status)}>
            {locale === "bn"
              ? getRoshalOrderStatusLabel(order.status).bn
              : getRoshalOrderStatusLabel(order.status).en}
          </Badge>
          <Badge
            variant={getRoshalPaymentStatusBadgeVariant(order.paymentStatus)}
          >
            {locale === "bn"
              ? getRoshalPaymentStatusLabel(order.paymentStatus).bn
              : getRoshalPaymentStatusLabel(order.paymentStatus).en}
          </Badge>
        </div>
      </div>

      {orderStatusErrorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{orderStatusErrorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr,22rem]">
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "অর্ডার আইটেম" : "Order items"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {order.items.map((item) => (
              <div
                key={`${order.id}-${item.productId}`}
                className="flex items-center justify-between rounded-xl border border-border/70 p-4"
              >
                <div>
                  <p className="font-medium">
                    {locale === "bn" ? item.name.bn : item.name.en}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === "bn" ? "পরিমাণ" : "Quantity"}: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  {formatBdt(item.price * item.quantity, locale)}
                </p>
              </div>
            ))}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground">
                {order.customerName} · {order.phone} · {order.addressLine1},{" "}
                {order.city}
                <br />
                {formatOrderDate(order.createdAt, locale)}
              </div>
              <div className="rounded-xl border border-border/70 p-4 text-sm">
                <InfoRow
                  label={locale === "bn" ? "পেমেন্ট মাধ্যম" : "Payment method"}
                  value={
                    locale === "bn"
                      ? getRoshalPaymentMethodLabel(order.paymentMethod).bn
                      : getRoshalPaymentMethodLabel(order.paymentMethod).en
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
              </div>
            </div>

            {order.paymentProofUrl ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  {locale === "bn"
                    ? "পেমেন্ট স্ক্রিনশট"
                    : "Payment proof screenshot"}
                </p>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-muted">
                  <Image
                    src={resolveImageUrl(order.paymentProofUrl)}
                    alt="Payment proof"
                    fill
                    sizes="(max-width: 1280px) 100vw, 720px"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}

            <OrderTrackingTimeline order={order} locale={locale} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{locale === "bn" ? "স্ট্যাটাস" : "Status"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveRoshalOrderStatus} className="space-y-5">
              <input type="hidden" name="id" value={order.id} />
              <input
                type="hidden"
                name="redirectTo"
                value={`/dashboard/orders/${order.id}`}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {locale === "bn" ? "অর্ডার স্ট্যাটাস" : "Order status"}
                </p>
                <DashboardFormSelect
                  name="status"
                  defaultValue={order.status}
                  options={[
                    {
                      value: "pending",
                      label:
                        locale === "bn"
                          ? getRoshalOrderStatusLabel("pending").bn
                          : getRoshalOrderStatusLabel("pending").en,
                    },
                    {
                      value: "payment-review",
                      label:
                        locale === "bn"
                          ? getRoshalOrderStatusLabel("payment-review").bn
                          : getRoshalOrderStatusLabel("payment-review").en,
                    },
                    {
                      value: "confirmed",
                      label:
                        locale === "bn"
                          ? getRoshalOrderStatusLabel("confirmed").bn
                          : getRoshalOrderStatusLabel("confirmed").en,
                    },
                    {
                      value: "processing",
                      label:
                        locale === "bn"
                          ? getRoshalOrderStatusLabel("processing").bn
                          : getRoshalOrderStatusLabel("processing").en,
                    },
                    {
                      value: "shipped",
                      label:
                        locale === "bn"
                          ? getRoshalOrderStatusLabel("shipped").bn
                          : getRoshalOrderStatusLabel("shipped").en,
                    },
                    {
                      value: "delivered",
                      label:
                        locale === "bn"
                          ? getRoshalOrderStatusLabel("delivered").bn
                          : getRoshalOrderStatusLabel("delivered").en,
                    },
                    {
                      value: "cancelled",
                      label:
                        locale === "bn"
                          ? getRoshalOrderStatusLabel("cancelled").bn
                          : getRoshalOrderStatusLabel("cancelled").en,
                    },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {locale === "bn" ? "পেমেন্ট" : "Payment"}
                </p>
                <DashboardFormSelect
                  name="paymentStatus"
                  defaultValue={order.paymentStatus}
                  options={[
                    {
                      value: "pending",
                      label:
                        locale === "bn"
                          ? getRoshalPaymentStatusLabel("pending").bn
                          : getRoshalPaymentStatusLabel("pending").en,
                    },
                    {
                      value: "under-review",
                      label:
                        locale === "bn"
                          ? getRoshalPaymentStatusLabel("under-review").bn
                          : getRoshalPaymentStatusLabel("under-review").en,
                    },
                    {
                      value: "paid",
                      label:
                        locale === "bn"
                          ? getRoshalPaymentStatusLabel("paid").bn
                          : getRoshalPaymentStatusLabel("paid").en,
                    },
                    {
                      value: "failed",
                      label:
                        locale === "bn"
                          ? getRoshalPaymentStatusLabel("failed").bn
                          : getRoshalPaymentStatusLabel("failed").en,
                    },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackingNote">
                  {locale === "bn" ? "ট্র্যাকিং নোট" : "Tracking note"}
                </Label>
                <Textarea
                  id="trackingNote"
                  name="trackingNote"
                  defaultValue={order.trackingNote}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminReviewNote">
                  {locale === "bn" ? "অ্যাডমিন নোট" : "Admin review note"}
                </Label>
                <Textarea
                  id="adminReviewNote"
                  name="adminReviewNote"
                  defaultValue={order.adminReviewNote}
                  rows={4}
                />
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm">
                <InfoRow
                  label={locale === "bn" ? "মোট" : "Total"}
                  value={formatBdt(order.total, locale)}
                />
                <InfoRow
                  label={locale === "bn" ? "পেমেন্ট স্টেট" : "Payment state"}
                  value={
                    locale === "bn"
                      ? getRoshalPaymentStatusLabel(order.paymentStatus).bn
                      : getRoshalPaymentStatusLabel(order.paymentStatus).en
                  }
                />
                <InfoRow
                  label={locale === "bn" ? "যাচাই হয়েছে" : "Verified at"}
                  value={
                    order.verifiedAt
                      ? formatOrderDate(order.verifiedAt, locale)
                      : "-"
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                {locale === "bn" ? "আপডেট করুন" : "Update order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}

function getOrderStatusErrorMessage(
  locale: "bn" | "en",
  code: string | undefined,
) {
  switch (code) {
    case "insufficient-inventory":
      return locale === "bn"
        ? "এই অর্ডারটি আবার সক্রিয় করার মতো পর্যাপ্ত স্টক নেই। আগে পণ্যের স্টক আপডেট করুন।"
        : "There is not enough stock to reactivate this order. Update product inventory first.";
    case "product-unavailable":
      return locale === "bn"
        ? "অর্ডারের এক বা একাধিক পণ্য আর উপলভ্য নেই, তাই স্ট্যাটাস পরিবর্তন সম্পন্ন করা যায়নি।"
        : "One or more products in this order are no longer available, so the status change could not be completed.";
    case "order-not-found":
      return locale === "bn"
        ? "অর্ডারটি খুঁজে পাওয়া যায়নি।"
        : "The requested order could not be found.";
    default:
      return null;
  }
}
