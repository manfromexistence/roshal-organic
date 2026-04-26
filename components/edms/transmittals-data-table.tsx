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

type TransmittalData = {
  documentCodes: string[] | null;
  dueDate: string | null;
  id: string;
  purpose: string | null;
  recipientName: string;
  sentLabel: string;
  status: string;
  subject: string;
  transmittalNumber: string;
};

const transmittalStatuses = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "rejected", label: "Rejected" },
];

const transmittalPurposes = [
  { value: "IFR", label: "Issued for Review" },
  { value: "IFC", label: "Issued for Construction" },
  { value: "IFI", label: "Issued for Information" },
  { value: "IFA", label: "Issued for Approval" },
];

const columns: ColumnDef<TransmittalData>[] = [
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
    accessorKey: "transmittalNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Transmittal ID" />
    ),
    cell: ({ row }) => {
      const transmittalNumber = row.original.transmittalNumber;
      const sentLabel = row.original.sentLabel;

      return (
        <div className="space-y-1">
          <p className="font-mono text-xs font-medium">{transmittalNumber}</p>
          <p className="text-xs text-muted-foreground">{sentLabel}</p>
        </div>
      );
    },
    meta: {
      label: "Transmittal ID",
      placeholder: "Filter by ID...",
      variant: "text",
    },
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Subject & Documents" />
    ),
    cell: ({ row }) => {
      const subject = row.original.subject;
      const documentCodes = row.original.documentCodes;

      return (
        <div className="space-y-2">
          <p className="font-medium">{subject}</p>
          <div className="flex flex-wrap gap-1">
            {documentCodes?.map((code) => (
              <span
                key={code}
                className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px]"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      );
    },
    meta: {
      label: "Subject",
      placeholder: "Filter by subject...",
      variant: "text",
    },
  },
  {
    accessorKey: "recipientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Recipient" />
    ),
    cell: ({ row }) => <div>{row.getValue("recipientName")}</div>,
    meta: {
      label: "Recipient",
      placeholder: "Filter by recipient...",
      variant: "text",
    },
  },
  {
    accessorKey: "purpose",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Purpose" />
    ),
    cell: ({ cell }) => (
      <EdmsStatusBadge status={cell.getValue<string>() || "IFR"} />
    ),
    meta: {
      label: "Purpose",
      options: transmittalPurposes,
      variant: "select",
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Due Date" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {row.getValue("dueDate") || "N/A"}
      </div>
    ),
    meta: {
      label: "Due Date",
      placeholder: "Filter by due date...",
      variant: "text",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("status")}</div>
    ),
    meta: {
      label: "Status",
      options: transmittalStatuses,
      variant: "select",
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
          <Link href={`/transmittals/${row.original.id}`}>View</Link>
        </Button>
      </div>
    ),
  },
];

interface TransmittalsDataTableProps {
  transmittals: TransmittalData[];
}

export function TransmittalsDataTable({
  transmittals,
}: TransmittalsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    columns,
    data: transmittals,
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
