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

type ScheduleActivityRow = {
  activityCode: string;
  actual: number;
  end: string;
  id: string;
  linkedDocs: string[];
  name: string;
  phase: string;
  planned: number;
  start: string;
  wbs: string;
};

const PHASE_OPTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "procurement", label: "Procurement" },
  { value: "construction", label: "Construction" },
  { value: "commissioning", label: "Commissioning" },
];

const columns: ColumnDef<ScheduleActivityRow>[] = [
  {
    accessorKey: "activityCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Activity" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[14rem] space-y-1 whitespace-normal sm:max-w-[18rem]">
        <div className="font-mono text-xs font-medium">
          {row.original.activityCode}
        </div>
        <div className="break-words font-medium">{row.original.name}</div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Activity",
      placeholder: "Filter by activity...",
    },
  },
  {
    accessorKey: "phase",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Phase" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.phase}
      </Badge>
    ),
    meta: {
      variant: "select",
      label: "Phase",
      options: PHASE_OPTIONS,
    },
  },
  {
    accessorKey: "wbs",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="WBS" />
    ),
    meta: {
      variant: "text",
      label: "WBS",
      placeholder: "Filter by WBS...",
    },
  },
  {
    id: "dates",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Date Range" />
    ),
    accessorFn: (row) => `${row.start} ${row.end}`,
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {row.original.start} to {row.original.end}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Date Range",
      placeholder: "Filter by date...",
    },
  },
  {
    id: "progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Progress" />
    ),
    accessorFn: (row) => `${row.actual}/${row.planned}`,
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="text-sm font-medium">{row.original.actual}% actual</div>
        <div className="text-xs text-muted-foreground">
          {row.original.planned}% planned
        </div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Progress",
      placeholder: "Filter by progress...",
    },
  },
  {
    id: "linkedDocs",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Linked Documents" />
    ),
    accessorFn: (row) => row.linkedDocs.join(" "),
    cell: ({ row }) => (
      <div className="max-w-[14rem] space-y-1 whitespace-normal sm:max-w-[18rem]">
        <div className="text-sm font-medium">
          {row.original.linkedDocs.length} linked
        </div>
        <div className="break-words text-xs text-muted-foreground">
          {row.original.linkedDocs.length > 0
            ? row.original.linkedDocs.join(", ")
            : "No linked document codes"}
        </div>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Linked Documents",
      placeholder: "Filter by document...",
    },
  },
];

export function ScheduleTable({
  activities,
}: {
  activities: ScheduleActivityRow[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: activities,
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
