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
import { EdmsStatusBadge } from "@/components/edms/status-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type DocumentData = {
  author: string | null;
  category: string | null;
  discipline: string | null;
  documentNumber: string;
  fileSize: string | null;
  id: string;
  projectName: string | null;
  revision: string | null;
  status: string;
  title: string;
  uploadedLabel: string;
};

const documentStatuses = [
  { value: "draft", label: "DRAFT" },
  { value: "A", label: "A - Approved for Construction" },
  { value: "B", label: "B - Approved for Design" },
  { value: "C", label: "C - Approved for Construction" },
  { value: "I", label: "I - Issued for Information" },
  { value: "R", label: "R - Revise and Resubmit" },
  { value: "rejected", label: "Rejected" },
];

const columns: ColumnDef<DocumentData>[] = [
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
    accessorKey: "documentNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Document Code" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs font-medium">
        {row.getValue("documentNumber")}
      </div>
    ),
    meta: {
      label: "Document Code",
      placeholder: "Filter by code...",
      variant: "text",
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Title" />
    ),
    cell: ({ row }) => {
      const discipline = row.original.discipline ?? "General";
      const category = row.original.category ?? "Document";
      const fileSize = row.original.fileSize ?? "N/A";

      return (
        <div className="max-w-[14rem] space-y-1 whitespace-normal sm:max-w-[18rem] lg:max-w-[22rem]">
          <p className="break-words font-medium">{row.getValue("title")}</p>
          <p className="break-words text-xs text-muted-foreground">
            {discipline} | {category} | {fileSize}
          </p>
        </div>
      );
    },
    meta: {
      label: "Title",
      placeholder: "Filter by title...",
      variant: "text",
    },
  },
  {
    accessorKey: "revision",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Rev" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("revision") ?? "0"}</div>
    ),
    meta: {
      label: "Rev",
      placeholder: "Filter by revision...",
      variant: "text",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ cell }) => <EdmsStatusBadge status={cell.getValue<string>()} />,
    meta: {
      label: "Status",
      options: documentStatuses,
      variant: "select",
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Author" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("author") ?? "N/A"}
      </div>
    ),
    meta: {
      label: "Author",
      placeholder: "Filter by author...",
      variant: "text",
    },
  },
  {
    accessorKey: "uploadedLabel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Modified" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {row.getValue("uploadedLabel")}
      </div>
    ),
    meta: {
      label: "Modified",
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
          <Link href={`/documents/${row.original.id}`}>View</Link>
        </Button>
      </div>
    ),
  },
];

interface DocumentsDataTableProps {
  documents: DocumentData[];
}

export function DocumentsDataTable({ documents }: DocumentsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    columns,
    data: documents,
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
