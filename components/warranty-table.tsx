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
import { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";

type WarrantyRow = {
  id: string;
  expiryDate?: Date | string | null;
  provider?: string | null;
  reference?: string | null;
  status?: string | null;
  system?: string | null;
  title?: string | null;
  warrantyNumber?: string | null;
};

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "claimed", label: "Claimed" },
  { value: "expired", label: "Expired" },
];

function getReference(row: WarrantyRow) {
  return row.warrantyNumber || row.reference || row.id;
}

function getSystem(row: WarrantyRow) {
  return row.system || row.title || "Warranty item";
}

function getProvider(row: WarrantyRow) {
  return row.provider || "Provider not set";
}

function getStatus(row: WarrantyRow) {
  return row.status || "active";
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  const parsedValue = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return "Not set";
  }

  return parsedValue.toLocaleDateString();
}

const columns: ColumnDef<WarrantyRow>[] = [
  {
    id: "reference",
    accessorFn: getReference,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Warranty" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-mono text-xs font-medium">
          {getReference(row.original)}
        </div>
        <div className="text-xs text-muted-foreground">
          {getProvider(row.original)}
        </div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Warranty",
      placeholder: "Filter by reference...",
    },
  },
  {
    id: "system",
    accessorFn: getSystem,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="System" />
    ),
    cell: ({ row }) => (
      <p className="max-w-xl text-sm">{getSystem(row.original)}</p>
    ),
    meta: {
      variant: "text",
      label: "System",
      placeholder: "Filter by system...",
    },
  },
  {
    id: "provider",
    accessorFn: getProvider,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Provider" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {getProvider(row.original)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Provider",
      placeholder: "Filter by provider...",
    },
  },
  {
    id: "status",
    accessorFn: getStatus,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {getStatus(row.original)}
      </Badge>
    ),
    meta: {
      variant: "select",
      label: "Status",
      options: STATUS_OPTIONS,
    },
  },
  {
    id: "expiryDate",
    accessorFn: (row) => formatDate(row.expiryDate),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Expiry" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.original.expiryDate)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Expiry",
      placeholder: "Filter by expiry date...",
    },
  },
];

export function WarrantyTable({ warranties }: { warranties: WarrantyRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: warranties,
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
