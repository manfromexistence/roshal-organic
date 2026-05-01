"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { DashboardTableShell } from "@/components/dashboard/dashboard-table-shell";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { formatBdt, formatOrderDate } from "@/lib/store-format";
import { getLocalizedValue } from "@/lib/store-locale";
import {
  getRoshalOrderStatusBadgeVariant,
  getRoshalOrderStatusLabel,
  getRoshalPaymentMethodLabel,
  getRoshalPaymentStatusBadgeVariant,
  getRoshalPaymentStatusLabel,
} from "@/lib/store-orders";
import type { RoshalLocale, RoshalOrder } from "@/lib/store-types";

interface OrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  paymentMethod: string;
  total: string;
  status: string;
  statusKey: string;
  paymentStatus: string;
  paymentStatusKey: string;
  createdAt: string;
}

function getColumns(): ColumnDef<OrderRow>[] {
  return [
    {
      id: "orderNumber",
      accessorKey: "orderNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" label="Order" />
      ),
      meta: {
        label: "Order",
        placeholder: "Search orders...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "customerName",
      accessorKey: "customerName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Customer"
          label="Customer"
        />
      ),
    },
    {
      id: "paymentMethod",
      accessorKey: "paymentMethod",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Method" label="Method" />
      ),
    },
    {
      id: "total",
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" label="Total" />
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" label="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getRoshalOrderStatusBadgeVariant(row.original.statusKey)}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "paymentStatus",
      accessorKey: "paymentStatus",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Payment"
          label="Payment"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getRoshalPaymentStatusBadgeVariant(
            row.original.paymentStatusKey,
          )}
        >
          {row.original.paymentStatus}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Placed" label="Placed" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Order actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/orders/${row.original.id}`}>
                <Pencil className="size-4" />
                Manage order
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/track-order?orderNumber=${row.original.orderNumber}`}
              >
                <ExternalLink className="size-4" />
                Public tracking
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 80,
    },
  ];
}

export function RoshalOrdersTable({
  orders,
  locale,
}: {
  orders: RoshalOrder[];
  locale: RoshalLocale;
}) {
  const rows: OrderRow[] = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    paymentMethod:
      locale === "bn"
        ? getRoshalPaymentMethodLabel(order.paymentMethod).bn
        : getRoshalPaymentMethodLabel(order.paymentMethod).en,
    total: formatBdt(order.total, locale),
    status: getLocalizedValue(locale, getRoshalOrderStatusLabel(order.status)),
    statusKey: order.status,
    paymentStatus: getLocalizedValue(
      locale,
      getRoshalPaymentStatusLabel(order.paymentStatus),
    ),
    paymentStatusKey: order.paymentStatus,
    createdAt: formatOrderDate(order.createdAt, locale),
  }));

  const { table } = useDataTable({
    data: rows,
    columns: getColumns(),
    pageCount: Math.ceil(Math.max(rows.length, 1) / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "createdAt", desc: true }],
    },
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    getRowId: (row) => row.id,
  });

  return (
    <DashboardTableShell
      title="All orders"
      description="Review checkout submissions, payment states, and fulfillment progress."
    >
      <div className="min-w-0">
        <div className="grid gap-3 p-3 pt-0 sm:p-4 sm:pt-0 md:hidden">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="min-w-0 border-none border-r-[6px] border-r-primary bg-background/70 shadow-sm"
            >
              <CardContent className="space-y-3 p-3">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {order.orderNumber}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.customerName} {"\u00b7"} {order.phone}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-primary">
                    {formatBdt(order.total, locale)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={getRoshalOrderStatusBadgeVariant(order.status)}
                  >
                    {getLocalizedValue(
                      locale,
                      getRoshalOrderStatusLabel(order.status),
                    )}
                  </Badge>
                  <Badge
                    variant={getRoshalPaymentStatusBadgeVariant(
                      order.paymentStatus,
                    )}
                  >
                    {getLocalizedValue(
                      locale,
                      getRoshalPaymentStatusLabel(order.paymentStatus),
                    )}
                  </Badge>
                  <Badge variant="outline">
                    {getLocalizedValue(
                      locale,
                      getRoshalPaymentMethodLabel(order.paymentMethod),
                    )}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    {formatOrderDate(order.createdAt, locale)}
                  </p>
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <Link href={`/dashboard/orders/${order.id}`}>Manage</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="hidden min-w-0 md:block">
          <DataTable table={table}>
            <DataTableToolbar table={table}>
              <DataTableSortList table={table} align="end" />
            </DataTableToolbar>
          </DataTable>
        </div>
      </div>
    </DashboardTableShell>
  );
}
