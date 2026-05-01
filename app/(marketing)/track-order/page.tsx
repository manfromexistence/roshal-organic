import { Search } from "lucide-react";
import Link from "next/link";
import { OrderTrackingTimeline } from "@/components/storefront/order-tracking-timeline";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRoshalOrderByLookup } from "@/lib/store-content";
import { formatBdt, formatOrderDate } from "@/lib/store-format";
import { getRoshalLocale } from "@/lib/store-i18n";
import {
  getRoshalOrderStatusBadgeVariant,
  getRoshalOrderStatusLabel,
  getRoshalPaymentMethodLabel,
  getRoshalPaymentStatusBadgeVariant,
  getRoshalPaymentStatusLabel,
} from "@/lib/store-orders";

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams?: Promise<{
    orderNumber?: string;
  }>;
}) {
  const [locale, resolvedSearchParams] = await Promise.all([
    getRoshalLocale(),
    searchParams,
  ]);
  const orderNumber = resolvedSearchParams?.orderNumber?.trim() || "";
  const order = orderNumber ? await getRoshalOrderByLookup(orderNumber) : null;
  const searched = Boolean(orderNumber);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "পাবলিক ট্র্যাক অর্ডার" : "Public track order"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {locale === "bn"
            ? "লগইন ছাড়াই অর্ডার ট্র্যাক করুন"
            : "Track an order without login"}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          {locale === "bn"
            ? "শুধু অর্ডার নম্বর দিয়েই আপনি অর্ডারের বর্তমান অবস্থা, পেমেন্ট স্ট্যাটাস এবং ডেলিভারি অগ্রগতি দেখতে পারবেন।"
            : "Use only the order number to view the latest order, payment, and delivery status."}
        </p>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "ট্র্যাকিং তথ্য দিন" : "Enter tracking details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">
                {locale === "bn" ? "অর্ডার নম্বর" : "Order number"}
              </Label>
              <Input
                id="orderNumber"
                name="orderNumber"
                defaultValue={orderNumber}
                placeholder="RO-260430123"
                className="rounded-md"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full rounded-md md:w-auto">
                <Search className="size-4" />
                {locale === "bn" ? "ট্র্যাক করুন" : "Track order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {searched && !order ? (
        <Alert variant="destructive">
          <AlertDescription>
            {locale === "bn"
              ? "অর্ডার নম্বর মেলেনি। আবার চেষ্টা করুন।"
              : "The order number could not be matched. Please try again."}
          </AlertDescription>
        </Alert>
      ) : null}

      {order ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl">
                    {order.orderNumber}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatOrderDate(order.createdAt, locale)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={getRoshalOrderStatusBadgeVariant(order.status)}
                  >
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
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <OrderTrackingTimeline order={order} locale={locale} />

              <div className="grid gap-4 md:grid-cols-2">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="rounded-md border border-border/70 bg-muted/20 p-4"
                  >
                    <p className="font-medium">
                      {locale === "bn" ? item.name.bn : item.name.en}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {locale === "bn" ? "পরিমাণ" : "Quantity"}: {item.quantity}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {formatBdt(item.price * item.quantity, locale)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "bn" ? "অর্ডার সারাংশ" : "Order summary"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow
                label={locale === "bn" ? "গ্রাহক" : "Customer"}
                value={order.customerName}
              />
              <InfoRow
                label={locale === "bn" ? "ফোন" : "Phone"}
                value={order.phone}
              />
              <InfoRow
                label={locale === "bn" ? "ঠিকানা" : "Address"}
                value={[order.addressLine1, order.addressLine2, order.city]
                  .filter(Boolean)
                  .join(", ")}
              />
              <InfoRow
                label={locale === "bn" ? "পেমেন্ট" : "Payment"}
                value={
                  locale === "bn"
                    ? getRoshalPaymentMethodLabel(order.paymentMethod).bn
                    : getRoshalPaymentMethodLabel(order.paymentMethod).en
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
              <InfoRow
                label={locale === "bn" ? "মোট" : "Total"}
                value={formatBdt(order.total, locale)}
                emphasize
              />

              {order.trackingNote ? (
                <div className="rounded-md border border-border/70 bg-muted/20 p-4">
                  <p className="text-sm font-medium">
                    {locale === "bn" ? "ট্র্যাকিং নোট" : "Tracking note"}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {order.trackingNote}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" className="rounded-md">
          <Link href="/products">
            {locale === "bn" ? "পণ্য দেখুন" : "Browse products"}
          </Link>
        </Button>
        <Button asChild className="rounded-md">
          <Link href="/contact">
            {locale === "bn" ? "সাপোর্টে যোগাযোগ করুন" : "Contact support"}
          </Link>
        </Button>
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
