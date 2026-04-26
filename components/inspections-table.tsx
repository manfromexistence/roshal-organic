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

type InspectionRow = {
  id: string;
  description?: string | null;
  inspectionDate?: Date | string | null;
  inspectionNumber?: string | null;
  inspector?: string | null;
  location?: string | null;
  reference?: string | null;
  status?: string | null;
  subject?: string | null;
  title?: string | null;
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
  { value: "conditional", label: "Conditional" },
];

function getReference(row: InspectionRow) {
  return row.inspectionNumber || row.reference || row.id;
}

function getSubject(row: InspectionRow) {
  return row.subject || row.title || row.description || "Inspection record";
}

function getStatus(row: InspectionRow) {
  return row.status || "pending";
}

function getInspector(row: InspectionRow) {
  return row.inspector || "Unassigned";
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not scheduled";
  }

  const parsedValue = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return "Not scheduled";
  }

  return parsedValue.toLocaleDateString();
}

const columns: ColumnDef<InspectionRow>[] = [
  {
    id: "reference",
    accessorFn: getReference,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Inspection" />
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
      label: "Inspection",
      placeholder: "Filter by reference...",
    },
  },
  {
    id: "subject",
    accessorFn: getSubject,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Subject" />
    ),
    cell: ({ row }) => (
      <p className="max-w-xl text-sm">{getSubject(row.original)}</p>
    ),
    meta: {
      variant: "text",
      label: "Subject",
      placeholder: "Filter by subject...",
    },
  },
  {
    id: "inspector",
    accessorFn: getInspector,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Inspector" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {getInspector(row.original)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Inspector",
      placeholder: "Filter by inspector...",
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
    id: "inspectionDate",
    accessorFn: (row) => formatDate(row.inspectionDate),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Inspection Date" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.original.inspectionDate)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Inspection Date",
      placeholder: "Filter by date...",
    },
  },
];

export function InspectionsTable({
  inspections,
}: {
  inspections: InspectionRow[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: inspections,
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
