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

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  orgName: string | null;
};

const userRoles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "client", label: "Client" },
  { value: "pmc", label: "PMC" },
  { value: "vendor", label: "Vendor" },
  { value: "subcontractor", label: "Subcontractor" },
];

const columns: ColumnDef<UserData>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    meta: {
      variant: "text",
      label: "Name",
      placeholder: "Filter by name...",
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
    meta: {
      variant: "text",
      label: "Email",
      placeholder: "Filter by email...",
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Role" />
    ),
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
    meta: {
      variant: "select",
      label: "Role",
      options: userRoles,
    },
  },
  {
    accessorKey: "orgName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Organization" />
    ),
    cell: ({ row }) => <div>{row.getValue("orgName") || "None"}</div>,
    meta: {
      variant: "text",
      label: "Organization",
      placeholder: "Filter by organization...",
    },
  },
];

interface UsersDataTableProps {
  users: UserData[];
}

export function UsersDataTable({ users }: UsersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: users,
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
