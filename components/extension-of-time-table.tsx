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

type ExtensionOfTimeRow = {
  delayDays?: number | null;
  id: string;
  reason?: string | null;
  requestDate?: Date | string | null;
  requestNumber?: string | null;
  status?: string | null;
  title?: string | null;
};

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function getReference(row: ExtensionOfTimeRow) {
  return row.requestNumber || row.id;
}

function getReason(row: ExtensionOfTimeRow) {
  return row.reason || row.title || "Extension of time request";
}

function getDelay(row: ExtensionOfTimeRow) {
  if (typeof row.delayDays === "number") {
    return `${row.delayDays} days`;
  }

  return "Not assessed";
}

function getStatus(row: ExtensionOfTimeRow) {
  return row.status || "pending";
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not submitted";
  }

  const parsedValue = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return "Not submitted";
  }

  return parsedValue.toLocaleDateString();
}

const columns: ColumnDef<ExtensionOfTimeRow>[] = [
  {
    id: "reference",
    accessorFn: getReference,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Request" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-mono text-xs font-medium">
          {getReference(row.original)}
        </div>
        <div className="text-xs text-muted-foreground">
          Submitted {formatDate(row.original.requestDate)}
        </div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Request",
      placeholder: "Filter by request...",
    },
  },
  {
    id: "reason",
    accessorFn: getReason,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Reason" />
    ),
    cell: ({ row }) => (
      <p className="max-w-xl text-sm">{getReason(row.original)}</p>
    ),
    meta: {
      variant: "text",
      label: "Reason",
      placeholder: "Filter by reason...",
    },
  },
  {
    id: "delayDays",
    accessorFn: getDelay,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Delay" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {getDelay(row.original)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Delay",
      placeholder: "Filter by delay...",
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
];

export function ExtensionOfTimeTable({
  eotRequests,
}: {
  eotRequests: ExtensionOfTimeRow[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: eotRequests,
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
