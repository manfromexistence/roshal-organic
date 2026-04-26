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

type CommissioningChecklistRow = {
  id: string;
  checklistNumber: string;
  completedAt: Date | string | null;
  description: string;
  status: string;
  system: string;
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatCompletedAt(value: Date | string | null) {
  if (!value) {
    return "Not completed";
  }

  const completedAt = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(completedAt.getTime())) {
    return "Not completed";
  }

  return completedAt.toLocaleDateString();
}

const columns: ColumnDef<CommissioningChecklistRow>[] = [
  {
    accessorKey: "checklistNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Checklist" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-mono text-xs font-medium">
          {row.original.checklistNumber}
        </div>
        <div className="text-sm text-muted-foreground">
          {row.original.system}
        </div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Checklist",
      placeholder: "Filter by checklist...",
    },
  },
  {
    accessorKey: "system",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="System" />
    ),
    meta: {
      variant: "text",
      label: "System",
      placeholder: "Filter by system...",
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Description" />
    ),
    cell: ({ row }) => (
      <p className="max-w-xl text-sm text-muted-foreground">
        {row.original.description}
      </p>
    ),
    meta: {
      variant: "text",
      label: "Description",
      placeholder: "Filter by description...",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {formatStatus(row.original.status)}
      </Badge>
    ),
    meta: {
      variant: "select",
      label: "Status",
      options: STATUS_OPTIONS,
    },
  },
  {
    id: "completedAt",
    accessorFn: (row) => formatCompletedAt(row.completedAt),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Completed" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatCompletedAt(row.original.completedAt)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Completed",
      placeholder: "Filter by completion date...",
    },
  },
];

export function CommissioningTable({
  checklists,
}: {
  checklists: CommissioningChecklistRow[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: checklists,
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
