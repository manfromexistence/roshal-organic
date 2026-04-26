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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type LetterData = {
  date: string;
  id: string;
  letterNumber: string;
  status: string;
  subject: string;
};

const letterStatuses = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "received", label: "Received" },
  { value: "archived", label: "Archived" },
];

const columns: ColumnDef<LetterData>[] = [
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
    enableHiding: false,
    enableSorting: false,
    maxSize: 5,
    size: 5,
  },
  {
    accessorKey: "letterNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Letter Number" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("letterNumber")}</div>
    ),
    meta: {
      label: "Letter Number",
      placeholder: "Filter by number...",
      variant: "text",
    },
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Subject" />
    ),
    cell: ({ row }) => <div>{row.getValue("subject")}</div>,
    meta: {
      label: "Subject",
      placeholder: "Filter by subject...",
      variant: "text",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue("status")}</div>,
    meta: {
      label: "Status",
      options: letterStatuses,
      variant: "select",
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Date" />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {row.getValue("date")}
      </div>
    ),
    meta: {
      label: "Date",
      placeholder: "Filter by date...",
      variant: "text",
    },
  },
  {
    id: "actions",
    enableHiding: false,
    maxSize: 50,
    size: 50,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild size="sm" variant="ghost">
          <Link href={`/letters/${row.original.id}`}>View</Link>
        </Button>
      </div>
    ),
  },
];

interface LettersDataTableProps {
  letters: LetterData[];
}

export function LettersDataTable({ letters }: LettersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    columns,
    data: letters,
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
