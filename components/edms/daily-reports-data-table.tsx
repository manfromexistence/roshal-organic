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
import { Checkbox } from "@/components/ui/checkbox";

type DailyReportData = {
  activitiesCompleted: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  issues: string | null;
  projectId: string;
  reportDate: Date;
  updatedAt: Date;
  weather: string | null;
};

const columns: ColumnDef<DailyReportData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    maxSize: 5,
    size: 5,
  },
  {
    accessorKey: "reportDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Report Date" />
    ),
    cell: ({ row }) => {
      const reportDate = row.original.reportDate;
      const formattedDate =
        reportDate instanceof Date
          ? reportDate.toLocaleDateString()
          : new Date(reportDate).toLocaleDateString();

      return <div className="font-medium">{formattedDate}</div>;
    },
    meta: {
      label: "Report Date",
      placeholder: "Filter by date...",
      variant: "text",
    },
  },
  {
    accessorKey: "weather",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Weather" />
    ),
    cell: ({ row }) => <div>{row.getValue("weather") || "Not set"}</div>,
    meta: {
      label: "Weather",
      placeholder: "Filter by weather...",
      variant: "text",
    },
  },
  {
    accessorKey: "activitiesCompleted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Activities" />
    ),
    cell: ({ row }) => (
      <p className="line-clamp-2">
        {row.getValue("activitiesCompleted") || "No activities logged"}
      </p>
    ),
    meta: {
      label: "Activities",
      placeholder: "Filter by activities...",
      variant: "text",
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
    meta: {
      label: "Created",
      placeholder: "Filter by created date...",
      variant: "text",
    },
  },
];

interface DailyReportsDataTableProps {
  reports: DailyReportData[];
}

export function DailyReportsDataTable({ reports }: DailyReportsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    columns,
    data: reports,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
