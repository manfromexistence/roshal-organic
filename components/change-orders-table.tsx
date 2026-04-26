"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ChangeOrderRow = {
  approvalStatus: string;
  changeOrderNumber: string;
  changeValue: number;
  createdAt: Date | string;
  id: string;
  originalContractValue: number | null;
  reason: string;
  updatedAt: Date | string;
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "Not set";
  }

  return currencyFormatter.format(value / 100);
}

function formatDate(value: Date | string) {
  const dateValue = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(dateValue.getTime())) {
    return "Not available";
  }

  return dateValue.toLocaleDateString();
}

const columns: ColumnDef<ChangeOrderRow>[] = [
  {
    accessorKey: "changeOrderNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Change Order" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-mono text-xs font-medium">
          {row.original.changeOrderNumber}
        </div>
        <div className="text-xs text-muted-foreground">
          Updated {formatDate(row.original.updatedAt)}
        </div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Change Order",
      placeholder: "Filter by number...",
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Reason" />
    ),
    cell: ({ row }) => (
      <p className="max-w-xl text-sm">{row.original.reason}</p>
    ),
    meta: {
      variant: "text",
      label: "Reason",
      placeholder: "Filter by reason...",
    },
  },
  {
    id: "originalContractValue",
    accessorFn: (row) => formatCurrency(row.originalContractValue),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Original Contract" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {formatCurrency(row.original.originalContractValue)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Original Contract",
      placeholder: "Filter by contract value...",
    },
  },
  {
    id: "changeValue",
    accessorFn: (row) => formatCurrency(row.changeValue),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Change Value" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs font-medium">
        {formatCurrency(row.original.changeValue)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Change Value",
      placeholder: "Filter by value...",
    },
  },
  {
    accessorKey: "approvalStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.approvalStatus}
      </Badge>
    ),
    meta: {
      variant: "select",
      label: "Status",
      options: STATUS_OPTIONS,
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/change-orders/${row.original.id}`}>Open</Link>
        </Button>
      </div>
    ),
  },
];

export function ChangeOrdersTable({
  changeOrders,
}: {
  changeOrders: ChangeOrderRow[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: changeOrders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
