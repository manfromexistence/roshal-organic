"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { DashboardTableShell } from "@/components/dashboard/dashboard-table-shell";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import type { RoshalLocale } from "@/lib/store-types";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  preferredLanguage: string;
  status: string;
}

function getColumns(): ColumnDef<UserRow>[] {
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
      cell: ({ row }) => (
        <Badge
          variant={row.original.role === "admin" ? "default" : "secondary"}
        >
          {row.original.role}
        </Badge>
      ),
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
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "active" ? "secondary" : "outline"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">User actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/users/${row.original.id}`}>
                <Pencil className="size-4" />
                Edit user
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 80,
    },
  ];
}

export function RoshalUsersTable({
  users,
  locale: _locale,
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
    columns: getColumns(),
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
    <DashboardTableShell
      title="All users"
      description="Manage admin access, customer accounts, and profile records."
    >
      <div className="min-w-0">
        <div className="grid gap-3 p-3 pt-0 sm:p-4 sm:pt-0 md:hidden">
          {users.map((user) => {
            const Icon = user.role === "admin" ? ShieldCheck : UserRound;

            return (
              <Card
                key={user.id}
                className="min-w-0 border-none border-r-[6px] border-r-primary bg-background/70 shadow-sm"
              >
                <CardContent className="flex min-w-0 gap-3 p-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                        className="rounded-sm"
                      >
                        {user.role}
                      </Badge>
                      <Badge
                        variant={user.isActive ? "secondary" : "outline"}
                        className="rounded-sm"
                      >
                        {user.isActive ? "active" : "inactive"}
                      </Badge>
                      <Badge variant="outline" className="rounded-sm">
                        {user.preferredLanguage}
                      </Badge>
                    </div>
                    <Button asChild variant="outline" size="sm" className="h-8">
                      <Link href={`/dashboard/users/${user.id}`}>Edit</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="hidden min-w-0 md:block">
          <DataTable table={table}>
            <DataTableToolbar table={table}>
              <DataTableSortList table={table} align="end" />
            </DataTableToolbar>
          </DataTable>
        </div>
      </div>
    </DashboardTableShell>
  );
}
