"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
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
  getRoshalDeliveryType,
  getRoshalDeliveryTypeLabel,
  getRoshalOrderStatusBadgeVariant,
  getRoshalOrderStatusLabel,
  getRoshalPaymentMethodLabel,
  getRoshalPaymentStatusBadgeVariant,
  getRoshalPaymentStatusLabel,
} from "@/lib/store-orders";
import type {
  RoshalLocale,
  RoshalOrder,
  RoshalPaymentMethod,
} from "@/lib/store-types";

interface OrderRow {
  id: string;
  orderLookup: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  paymentMethod: string;
  paymentMethodKey: RoshalPaymentMethod;
  deliveryType: string;
  deliveryTypeKey: string;
  total: string;
  totalAmount: number;
  status: string;
  statusKey: string;
  paymentStatus: string;
  paymentStatusKey: string;
  createdAt: string;
}

const includesTextFilter: FilterFn<OrderRow> = (row, columnId, filterValue) => {
  const rawValue = String(row.getValue(columnId) ?? "").toLowerCase();
  const terms = Array.isArray(filterValue) ? filterValue : [filterValue];
  const normalizedTerms = terms
    .map((term) =>
      String(term ?? "")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean);

  return normalizedTerms.every((term) => rawValue.includes(term));
};

const selectFilter: FilterFn<OrderRow> = (row, columnId, filterValue) => {
  const values = Array.isArray(filterValue) ? filterValue : [filterValue];
  const normalizedValues = values.map((value) => String(value));

  if (normalizedValues.length === 0) {
    return true;
  }

  return normalizedValues.includes(String(row.getValue(columnId)));
};

const numberTextFilter: FilterFn<OrderRow> = (row, columnId, filterValue) => {
  const rawValue = String(row.getValue(columnId) ?? "");
  const terms = Array.isArray(filterValue) ? filterValue : [filterValue];
  const normalizedTerms = terms
    .map((term) => String(term ?? "").trim())
    .filter(Boolean);

  return normalizedTerms.every((term) => rawValue.includes(term));
};

function paymentMethodOptions(locale: RoshalLocale) {
  const methods: RoshalPaymentMethod[] = [
    "cash_on_delivery",
    "card",
    "bkash",
    "nagad",
  ];

  return methods.map((method) => ({
    value: method,
    label: getLocalizedValue(locale, getRoshalPaymentMethodLabel(method)),
  }));
}

function getColumns(locale: RoshalLocale): ColumnDef<OrderRow>[] {
  return [
    {
      id: "orderLookup",
      accessorKey: "orderLookup",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" label="Order" />
      ),
      meta: {
        label: "Order / mobile",
        placeholder: "Search order or mobile...",
        variant: "text",
      },
      enableColumnFilter: true,
      filterFn: includesTextFilter,
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.original.orderNumber}</p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.phone}
          </p>
        </div>
      ),
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
      meta: {
        label: "Customer",
        placeholder: "Search customer...",
        variant: "text",
      },
      enableColumnFilter: true,
      filterFn: includesTextFilter,
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mobile" label="Mobile" />
      ),
      meta: {
        label: "Mobile",
        placeholder: "Search mobile...",
        variant: "text",
      },
      enableColumnFilter: true,
      filterFn: includesTextFilter,
    },
    {
      id: "paymentMethodKey",
      accessorKey: "paymentMethodKey",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Method" label="Method" />
      ),
      meta: {
        label: "Payment method",
        variant: "multiSelect",
        options: paymentMethodOptions(locale),
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
      cell: ({ row }) => row.original.paymentMethod,
    },
    {
      id: "deliveryTypeKey",
      accessorKey: "deliveryTypeKey",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Delivery"
          label="Delivery"
        />
      ),
      meta: {
        label: "Delivery type",
        variant: "multiSelect",
        options: ["home", "office", "unknown"].map((type) => ({
          value: type,
          label: getLocalizedValue(locale, getRoshalDeliveryTypeLabel(type)),
        })),
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
      cell: ({ row }) => row.original.deliveryType,
    },
    {
      id: "totalAmount",
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" label="Total" />
      ),
      meta: {
        label: "Total",
        placeholder: "Amount",
        variant: "number",
        unit: "BDT",
      },
      enableColumnFilter: true,
      filterFn: numberTextFilter,
      cell: ({ row }) => row.original.total,
    },
    {
      id: "statusKey",
      accessorKey: "statusKey",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" label="Status" />
      ),
      meta: {
        label: "Order status",
        variant: "multiSelect",
        options: [
          "pending",
          "payment-review",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => ({
          value: status,
          label: getLocalizedValue(locale, getRoshalOrderStatusLabel(status)),
        })),
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
      cell: ({ row }) => (
        <Badge
          variant={getRoshalOrderStatusBadgeVariant(row.original.statusKey)}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "paymentStatusKey",
      accessorKey: "paymentStatusKey",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Payment"
          label="Payment"
        />
      ),
      meta: {
        label: "Payment status",
        variant: "multiSelect",
        options: ["pending", "under-review", "paid", "failed"].map(
          (status) => ({
            value: status,
            label: getLocalizedValue(
              locale,
              getRoshalPaymentStatusLabel(status),
            ),
          }),
        ),
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
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
      meta: {
        label: "Placed",
        placeholder: "Search date...",
        variant: "text",
      },
      enableColumnFilter: true,
      filterFn: includesTextFilter,
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
  const rows: OrderRow[] = orders.map((order) => {
    const paymentMethod = getLocalizedValue(
      locale,
      getRoshalPaymentMethodLabel(order.paymentMethod),
    );
    const deliveryTypeKey = getRoshalDeliveryType(order);

    return {
      id: order.id,
      orderLookup: `${order.orderNumber} ${order.phone}`,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: order.phone,
      paymentMethod,
      paymentMethodKey: order.paymentMethod,
      deliveryType: getLocalizedValue(
        locale,
        getRoshalDeliveryTypeLabel(deliveryTypeKey),
      ),
      deliveryTypeKey,
      total: formatBdt(order.total, locale),
      totalAmount: order.total,
      status: getLocalizedValue(
        locale,
        getRoshalOrderStatusLabel(order.status),
      ),
      statusKey: order.status,
      paymentStatus: getLocalizedValue(
        locale,
        getRoshalPaymentStatusLabel(order.paymentStatus),
      ),
      paymentStatusKey: order.paymentStatus,
      createdAt: formatOrderDate(order.createdAt, locale),
    };
  });

  const { table } = useDataTable({
    data: rows,
    columns: getColumns(locale),
    pageCount: Math.ceil(Math.max(rows.length, 1) / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "createdAt", desc: true }],
      columnVisibility: {
        phone: false,
      },
    },
    queryKeys: {
      filters: "ordersFilters",
      joinOperator: "ordersJoinOperator",
      page: "ordersPage",
      perPage: "ordersPerPage",
      sort: "ordersSort",
    },
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    getRowId: (row) => row.id,
  });

  return (
    <DashboardTableShell
      title="All orders"
      description="Filter by order number, mobile, payment method, delivery type, amount, status, payment state, and placed date."
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
                  <Badge variant="outline">
                    {getLocalizedValue(
                      locale,
                      getRoshalDeliveryTypeLabel(getRoshalDeliveryType(order)),
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
