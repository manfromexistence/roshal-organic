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
import {
  EdmsStatusBadge,
  formatEdmsLabel,
} from "@/components/edms/status-badge";
import { Button } from "@/components/ui/button";

interface Submittal {
  id: string;
  submittalNumber: string;
  type: string;
  specificationSection: string | null;
  revision: string;
  reviewStatus: string;
  dueDate: string | null;
  submittedAt: string;
  submittedBy: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  comments: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "returned", label: "Returned" },
];

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  const parsedValue = new Date(value);
  if (Number.isNaN(parsedValue.getTime())) {
    return "Not set";
  }

  return parsedValue.toLocaleDateString();
}

const columns: ColumnDef<Submittal>[] = [
  {
    accessorKey: "submittalNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Submittal" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-mono text-xs font-medium">
          {row.original.submittalNumber}
        </div>
        <div className="text-xs text-muted-foreground">
          Rev {row.original.revision || "-"}
        </div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Submittal",
      placeholder: "Filter by submittal...",
    },
  },
  {
    id: "type",
    accessorFn: (row) => formatEdmsLabel(row.type),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Type" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{formatEdmsLabel(row.original.type)}</div>
    ),
    meta: {
      variant: "text",
      label: "Type",
      placeholder: "Filter by type...",
    },
  },
  {
    accessorKey: "specificationSection",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Spec Section" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {row.original.specificationSection || "Not assigned"}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Spec Section",
      placeholder: "Filter by spec...",
    },
  },
  {
    accessorKey: "reviewStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => <EdmsStatusBadge status={row.original.reviewStatus} />,
    meta: {
      variant: "select",
      label: "Status",
      options: STATUS_OPTIONS,
    },
  },
  {
    id: "submittedAt",
    accessorFn: (row) => formatDate(row.submittedAt),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Submitted" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">
          {formatDate(row.original.submittedAt)}
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.submittedBy}
        </div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Submitted",
      placeholder: "Filter by submitted date...",
    },
  },
  {
    id: "dueDate",
    accessorFn: (row) => formatDate(row.dueDate),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Due Date" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.original.dueDate)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Due Date",
      placeholder: "Filter by due date...",
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/submittals/${row.original.id}`}>Open</Link>
        </Button>
      </div>
    ),
  },
];

export function SubmittalsTable({ submittals }: { submittals: Submittal[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: submittals,
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
