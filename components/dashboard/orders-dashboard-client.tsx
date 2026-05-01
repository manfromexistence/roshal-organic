"use client";

import { useMemo, useState } from "react";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { RoshalOrdersTable } from "@/components/dashboard/orders-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBdt } from "@/lib/store-format";
import type { RoshalLocale, RoshalOrder } from "@/lib/store-types";

function getLocalBoundary(value: string, endOfDay = false) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`);
}

export function OrdersDashboardClient({
  locale,
  orders,
}: {
  locale: RoshalLocale;
  orders: RoshalOrder[];
}) {
  const [rangeMode, setRangeMode] = useState<"all" | "custom">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const visibleOrders = useMemo(() => {
    if (rangeMode === "all") {
      return orders;
    }

    const from = getLocalBoundary(fromDate);
    const to = getLocalBoundary(toDate, true);

    return orders.filter((order) => {
      const placedAt = new Date(order.createdAt).getTime();
      const afterStart = from ? placedAt >= from.getTime() : true;
      const beforeEnd = to ? placedAt <= to.getTime() : true;

      return afterStart && beforeEnd;
    });
  }, [fromDate, orders, rangeMode, toDate]);

  const paidAmount = visibleOrders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);
  const unpaidAmount = visibleOrders
    .filter((order) => order.paymentStatus !== "paid")
    .reduce((sum, order) => sum + order.total, 0);
  const totalAmount = visibleOrders.reduce(
    (sum, order) => sum + order.total,
    0,
  );
  const paymentReviewCount = visibleOrders.filter(
    (order) =>
      order.status === "payment-review" ||
      order.paymentStatus === "under-review",
  ).length;
  const activeFulfillmentCount = visibleOrders.filter((order) =>
    ["confirmed", "processing", "shipped"].includes(order.status),
  ).length;
  const deliveredCount = visibleOrders.filter(
    (order) => order.status === "delivered",
  ).length;
  return (
    <div className="min-w-0 space-y-6 p-4 sm:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {locale === "bn" ? "অর্ডার" : "Orders"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {locale === "bn" ? "অর্ডার ম্যানেজমেন্ট" : "Order management"}
          </h1>
        </div>

        <Card className="w-full min-w-0 border-none bg-card/70 shadow-sm xl:w-auto">
          <CardContent className="grid gap-3 p-4 sm:grid-cols-[180px_150px_150px]">
            <div className="space-y-2">
              <Label htmlFor="ordersRangeMode">Date range</Label>
              <Select
                value={rangeMode}
                onValueChange={(value) =>
                  setRangeMode(value === "custom" ? "custom" : "all")
                }
              >
                <SelectTrigger id="ordersRangeMode" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ordersFromDate">From</Label>
              <Input
                id="ordersFromDate"
                type="date"
                value={fromDate}
                disabled={rangeMode === "all"}
                onChange={(event) => setFromDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ordersToDate">To</Label>
              <Input
                id="ordersToDate"
                type="date"
                value={toDate}
                disabled={rangeMode === "all"}
                onChange={(event) => setToDate(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardMetricCard
          title="Total amount"
          value={formatBdt(totalAmount, locale)}
          hint={`${visibleOrders.length} orders in selected range`}
        />
        <DashboardMetricCard
          title="Paid amount"
          value={formatBdt(paidAmount, locale)}
          hint="Payment status is paid"
        />
        <DashboardMetricCard
          title="Unpaid amount"
          value={formatBdt(unpaidAmount, locale)}
          hint="Pending, review, or failed payments"
        />
        <DashboardMetricCard
          title="Payment review"
          value={paymentReviewCount}
          hint="Waiting for manual verification"
        />
        <DashboardMetricCard
          title="Active fulfillment"
          value={activeFulfillmentCount}
          hint={`${deliveredCount} delivered orders`}
        />
      </div>

      {/* Order status, payment method, and payment status insight panels are intentionally hidden per client request. */}

      <RoshalOrdersTable orders={visibleOrders} locale={locale} />
    </div>
  );
}
