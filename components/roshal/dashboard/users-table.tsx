"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/use-data-table";
import type { RoshalLocale } from "@/lib/roshal/types";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  preferredLanguage: string;
  status: string;
}

function getColumns(locale: RoshalLocale): ColumnDef<UserRow>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" label="User" />
      ),
      meta: {
        label: "User",
        placeholder: "Search users...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" label="Email" />
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" label="Role" />
      ),
      cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>,
    },
    {
      id: "preferredLanguage",
      accessorKey: "preferredLanguage",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Language"
          label="Language"
        />
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" label="Status" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/dashboard/users/${row.original.id}`}>
            {locale === "bn" ? "এডিট" : "Edit"}
          </Link>
        </Button>
      ),
      size: 80,
    },
  ];
}

export function RoshalUsersTable({
  users,
  locale,
}: {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    preferredLanguage: string;
    isActive: boolean;
  }>;
  locale: RoshalLocale;
}) {
  const rows: UserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferredLanguage: user.preferredLanguage,
    status: user.isActive ? "active" : "inactive",
  }));

  const { table } = useDataTable({
    data: rows,
    columns: getColumns(locale),
    pageCount: Math.ceil(Math.max(rows.length, 1) / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "name", desc: false }],
    },
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    getRowId: (row) => row.id,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} align="end" />
      </DataTableToolbar>
    </DataTable>
  );
}
