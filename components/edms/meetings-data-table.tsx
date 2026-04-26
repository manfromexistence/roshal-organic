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

type MeetingData = {
  id: string;
  momNumber: string;
  title: string;
  meetingType: string;
  meetingDate: string;
  location: string;
  attendees: string;
  status: string;
  chairperson: string;
};

const meetingTypes = [
  { value: "site", label: "Site Meeting" },
  { value: "design", label: "Design Meeting" },
  { value: "progress", label: "Progress Meeting" },
  { value: "technical", label: "Technical Meeting" },
];

const meetingStatuses = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const columns: ColumnDef<MeetingData>[] = [
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
    size: 5,
    maxSize: 5,
  },
  {
    accessorKey: "momNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="MoM ID" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs font-medium">
        {row.getValue("momNumber")}
      </div>
    ),
    meta: {
      variant: "text",
      label: "MoM ID",
      placeholder: "Filter by ID...",
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Meeting Title" />
    ),
    cell: ({ row }) => {
      const chairperson = row.original.chairperson;

      return (
        <div className="space-y-1">
          <div className="max-w-md font-medium">{row.getValue("title")}</div>
          <div className="text-xs text-muted-foreground">
            Chair: {chairperson}
          </div>
        </div>
      );
    },
    meta: {
      variant: "text",
      label: "Meeting Title",
      placeholder: "Filter by title...",
    },
  },
  {
    accessorKey: "meetingType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Type" />
    ),
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue("meetingType")}</div>
    ),
    meta: {
      variant: "select",
      label: "Type",
      options: meetingTypes,
    },
  },
  {
    accessorKey: "meetingDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Meeting Date" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {row.getValue("meetingDate")}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Meeting Date",
      placeholder: "Filter by date...",
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Location" />
    ),
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue("location")}</div>
    ),
    meta: {
      variant: "text",
      label: "Location",
      placeholder: "Filter by location...",
    },
  },
  {
    accessorKey: "attendees",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Attendees" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("attendees")}</div>
    ),
    meta: {
      variant: "text",
      label: "Attendees",
      placeholder: "Filter by attendees...",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => <div className="text-xs">{row.getValue("status")}</div>,
    meta: {
      variant: "select",
      label: "Status",
      options: meetingStatuses,
    },
  },
  {
    id: "actions",
    enableHiding: false,
    size: 50,
    maxSize: 50,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Button asChild size="sm" variant="ghost">
            <Link href={`/meetings/${row.original.id}`}>View</Link>
          </Button>
        </div>
      );
    },
  },
];

interface MeetingsDataTableProps {
  meetings: MeetingData[];
}

export function MeetingsDataTable({ meetings }: MeetingsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: meetings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
