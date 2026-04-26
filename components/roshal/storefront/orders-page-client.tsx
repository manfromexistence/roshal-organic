"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { OrderTrackingTimeline } from "@/components/roshal/storefront/order-tracking-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBdt, formatOrderDate } from "@/lib/roshal/format";
import {
  getRoshalOrderStatusBadgeVariant,
  getRoshalOrderStatusLabel,
  getRoshalPaymentMethodLabel,
  getRoshalPaymentStatusBadgeVariant,
  getRoshalPaymentStatusLabel,
} from "@/lib/roshal/orders";
import type { RoshalLocale, RoshalOrder } from "@/lib/roshal/types";

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function OrdersPageClient({
  locale,
  orders,
}: {
  locale: RoshalLocale;
  orders: RoshalOrder[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedQuery = normalizeSearchValue(deferredSearchQuery);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      order.orderNumber,
      order.customerName,
      order.phone,
      order.addressLine1,
      order.city,
      ...order.items.flatMap((item) => [item.name.bn, item.name.en]),
    ]
      .join(" ")
      .toLocaleLowerCase();

    return haystack.includes(normalizedQuery);
  });

  const openOrders = orders.filter((order) =>
    [
      "pending",
      "payment-review",
      "confirmed",
      "processing",
      "shipped",
    ].includes(order.status),
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;
  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "paid",
  ).length;

  const statusOptions = [
    {
      value: "all",
      label: locale === "bn" ? "সব স্ট্যাটাস" : "All statuses",
    },
    ...Array.from(new Set(orders.map((order) => order.status))).map(
      (status) => ({
        value: status,
        label:
          locale === "bn"
            ? getRoshalOrderStatusLabel(status).bn
            : getRoshalOrderStatusLabel(status).en,
      }),
    ),
  ];

  return (
    <div className="container mx-auto space-y-6 px-4 py-10">
      <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-background via-background to-muted/50">
        <CardContent className="space-y-5 p-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-primary">
              {locale === "bn" ? "আমার অর্ডার" : "My orders"}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              {locale === "bn" ? "অর্ডার ইতিহাস" : "Order history"}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {locale === "bn"
                ? "অর্ডারের বর্তমান অবস্থা, পেমেন্ট যাচাই, এবং ডেলিভারি অগ্রগতি এক জায়গা থেকে দেখুন।"
                : "Review order progress, payment verification, and delivery updates from one place."}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              title={locale === "bn" ? "মোট অর্ডার" : "Total orders"}
              value={String(orders.length)}
            />
            <MetricCard
              title={locale === "bn" ? "চলমান অর্ডার" : "Open orders"}
              value={String(openOrders)}
            />
            <MetricCard
              title={locale === "bn" ? "পেইড অর্ডার" : "Paid orders"}
              value={String(paidOrders)}
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr,14rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={
                  locale === "bn"
                    ? "অর্ডার নম্বর, পণ্য, ঠিকানা বা ফোন দিয়ে খুঁজুন"
                    : "Search by order number, product, address, or phone"
                }
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              {locale === "bn"
                ? `${filteredOrders.length}টি অর্ডার পাওয়া গেছে`
                : `${filteredOrders.length} orders found`}
            </p>
            <p>
              {locale === "bn"
                ? `${deliveredOrders}টি ডেলিভার হয়েছে`
                : `${deliveredOrders} delivered`}
            </p>
          </div>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 ? (
        <Card className="border-dashed border-border/70">
          <CardContent className="space-y-4 p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              {locale === "bn"
                ? "কোনো অর্ডার মেলেনি"
                : "No matching orders found"}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {locale === "bn"
                ? "সার্চ বা স্ট্যাটাস ফিল্টার পরিবর্তন করুন, অথবা নতুন অর্ডার করতে পণ্য পেইজে যান।"
                : "Change the search or status filter, or browse products to place a new order."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                {locale === "bn" ? "ফিল্টার রিসেট" : "Reset filters"}
              </Button>
              <Button asChild>
                <Link href="/products">
                  {locale === "bn" ? "পণ্য দেখুন" : "Browse products"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl">{order.orderNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatOrderDate(order.createdAt, locale)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}`}
                      className="rounded-xl border border-border/60 bg-muted/20 p-4"
                    >
                      <p className="font-medium">
                        {locale === "bn" ? item.name.bn : item.name.en}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === "bn" ? "পরিমাণ" : "Quantity"}:{" "}
                        {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
                <OrderTrackingTimeline order={order} locale={locale} />
                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-1 text-muted-foreground">
                    <p>
                      {order.addressLine1}, {order.city}
                    </p>
                    <p>
                      {locale === "bn" ? "পেমেন্ট" : "Payment"}:{" "}
                      {locale === "bn"
                        ? getRoshalPaymentMethodLabel(order.paymentMethod).bn
                        : getRoshalPaymentMethodLabel(order.paymentMethod).en}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold text-primary">
                      {formatBdt(order.total, locale)}
                    </p>
                    <Button asChild variant="outline">
                      <Link href={`/orders/${order.id}`}>
                        {locale === "bn" ? "অর্ডার ট্র্যাক করুন" : "Track order"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
