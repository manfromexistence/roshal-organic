"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

function getColumns(locale: RoshalLocale): ColumnDef<OrderRow>[] {
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
        <Button asChild variant="ghost" size="sm">
          <Link href={`/dashboard/orders/${row.original.id}`}>
            {locale === "bn" ? "এডিট" : "Edit"}
          </Link>
        </Button>
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
    columns: getColumns(locale),
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
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} align="end" />
      </DataTableToolbar>
    </DataTable>
  );
}
