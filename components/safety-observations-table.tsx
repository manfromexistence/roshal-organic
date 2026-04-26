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

type SafetyObservationRow = {
  id: string;
  category?: string | null;
  description?: string | null;
  location?: string | null;
  observationNumber?: string | null;
  reportedAt?: Date | string | null;
  reportedBy?: string | null;
  severity?: string | null;
  status?: string | null;
  title?: string | null;
};

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

function getReference(row: SafetyObservationRow) {
  return row.observationNumber || row.id;
}

function getTitle(row: SafetyObservationRow) {
  return row.title || row.description || "Safety observation";
}

function getStatus(row: SafetyObservationRow) {
  return row.status || "open";
}

function getReporter(row: SafetyObservationRow) {
  return row.reportedBy || "Not assigned";
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not reported";
  }

  const parsedValue = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return "Not reported";
  }

  return parsedValue.toLocaleDateString();
}

const columns: ColumnDef<SafetyObservationRow>[] = [
  {
    id: "reference",
    accessorFn: getReference,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Observation" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-mono text-xs font-medium">
          {getReference(row.original)}
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.location || "Location not set"}
        </div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Observation",
      placeholder: "Filter by reference...",
    },
  },
  {
    id: "title",
    accessorFn: getTitle,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Title" />
    ),
    cell: ({ row }) => (
      <p className="max-w-xl text-sm">{getTitle(row.original)}</p>
    ),
    meta: {
      variant: "text",
      label: "Title",
      placeholder: "Filter by title...",
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Category" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.category || "General"}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Category",
      placeholder: "Filter by category...",
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
        {getStatus(row.original).replaceAll("_", " ")}
      </Badge>
    ),
    meta: {
      variant: "select",
      label: "Status",
      options: STATUS_OPTIONS,
    },
  },
  {
    id: "reportedAt",
    accessorFn: (row) => formatDate(row.reportedAt),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Reported" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1 text-sm text-muted-foreground">
        <div>{formatDate(row.original.reportedAt)}</div>
        <div className="text-xs">{getReporter(row.original)}</div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Reported",
      placeholder: "Filter by report date...",
    },
  },
];

export function SafetyObservationsTable({
  observations,
}: {
  observations: SafetyObservationRow[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: observations,
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
