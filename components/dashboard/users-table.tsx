"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import {
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { removeRoshalUser } from "@/actions/admin";
import { DashboardTableShell } from "@/components/dashboard/dashboard-table-shell";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { bangladeshDistrictOptions } from "@/lib/bangladesh-locations";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import type { RoshalLocale } from "@/lib/store-types";

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  preferredLanguage: string;
  status: string;
  district: string;
  defaultAddress: string;
  createdAt: string;
}

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  preferredLanguage: string;
  isActive: boolean;
  defaultAddress: string | null;
  createdAt: Date;
}

const includesTextFilter: FilterFn<UserRow> = (row, columnId, filterValue) => {
  const rawValue = String(row.getValue(columnId) ?? "").toLowerCase();
  const terms = Array.isArray(filterValue) ? filterValue : [filterValue];
  const normalizedTerms = terms
    .map((term) =>
      String(term ?? "")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean);

  return normalizedTerms.every((term) => rawValue.includes(term));
};

const selectFilter: FilterFn<UserRow> = (row, columnId, filterValue) => {
  const values = Array.isArray(filterValue) ? filterValue : [filterValue];
  const normalizedValues = values.map((value) => String(value));

  if (normalizedValues.length === 0) {
    return true;
  }

  return normalizedValues.includes(String(row.getValue(columnId)));
};

const exportColumns = [
  { header: "Name", key: "name", width: 24 },
  { header: "Mobile", key: "phone", width: 18 },
  { header: "District", key: "district", width: 18 },
  { header: "Email", key: "email", width: 28 },
  { header: "Role", key: "role", width: 14 },
  { header: "Status", key: "status", width: 14 },
  { header: "Language", key: "preferredLanguage", width: 14 },
  { header: "Address", key: "defaultAddress", width: 38 },
  { header: "Joined", key: "createdAt", width: 20 },
];

function getDistrictFromAddress(address: string) {
  const chunks = address
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  const candidates = [...chunks].reverse();
  const match = candidates
    .map((candidate) =>
      bangladeshDistrictOptions.find(
        (district) =>
          district.value.toLowerCase() === candidate.toLowerCase() ||
          district.label.toLowerCase() === candidate.toLowerCase(),
      ),
    )
    .find(Boolean);

  return match?.label || "";
}

function formatUserDate(date: Date, locale: RoshalLocale) {
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getColumns({
  currentUserId,
  onDeleteRequest,
}: {
  currentUserId: string;
  onDeleteRequest: (user: UserRow) => void;
}): ColumnDef<UserRow>[] {
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
      filterFn: includesTextFilter,
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mobile" label="Mobile" />
      ),
      meta: {
        label: "Mobile",
        placeholder: "Search mobile...",
        variant: "text",
      },
      enableColumnFilter: true,
      filterFn: includesTextFilter,
    },
    {
      id: "district",
      accessorKey: "district",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="District"
          label="District"
        />
      ),
      meta: {
        label: "District",
        placeholder: "Select district...",
        variant: "multiSelect",
        options: bangladeshDistrictOptions.map((district) => ({
          value: district.label,
          label: district.label,
        })),
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
      cell: ({ row }) => row.original.district || "Not set",
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" label="Email" />
      ),
      meta: {
        label: "Email",
        placeholder: "Search email...",
        variant: "text",
      },
      enableColumnFilter: true,
      filterFn: includesTextFilter,
    },
    {
      id: "role",
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" label="Role" />
      ),
      meta: {
        label: "Role",
        variant: "multiSelect",
        options: [
          { value: "admin", label: "Admin" },
          { value: "user", label: "Customer" },
        ],
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
      cell: ({ row }) => (
        <Badge
          variant={row.original.role === "admin" ? "default" : "secondary"}
        >
          {row.original.role}
        </Badge>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" label="Status" />
      ),
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={row.original.id === currentUserId}
              onSelect={(event) => {
                event.preventDefault();
                onDeleteRequest(row.original);
              }}
            >
              <Trash2 className="size-4" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 80,
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
      meta: {
        label: "Language",
        variant: "multiSelect",
        options: [
          { value: "bn", label: "Bangla" },
          { value: "en", label: "English" },
        ],
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
    },
    {
      id: "defaultAddress",
      accessorKey: "defaultAddress",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Address"
          label="Address"
        />
      ),
      cell: ({ row }) => (
        <span className="block max-w-72 truncate">
          {row.original.defaultAddress || "Not set"}
        </span>
      ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Joined" label="Joined" />
      ),
    },
  ];
}

export function RoshalUsersTable({
  currentUserId,
  users,
  locale: _locale,
}: {
  currentUserId: string;
  users: DashboardUser[];
  locale: RoshalLocale;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const rows: UserRow[] = useMemo(
    () =>
      users.map((user) => {
        const defaultAddress = user.defaultAddress || "";
        const district = getDistrictFromAddress(defaultAddress);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          status: user.isActive ? "active" : "inactive",
          district,
          defaultAddress,
          createdAt: formatUserDate(user.createdAt, _locale),
        };
      }),
    [users, _locale],
  );

  const columns = useMemo(
    () =>
      getColumns({
        currentUserId,
        onDeleteRequest: setDeleteTarget,
      }),
    [currentUserId],
  );

  const { table } = useDataTable({
    data: rows,
    columns,
    pageCount: Math.ceil(Math.max(rows.length, 1) / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "name", desc: false }],
      columnVisibility: {
        email: false,
        defaultAddress: false,
      },
    },
    queryKeys: {
      filters: "usersFilters",
      joinOperator: "usersJoinOperator",
      page: "usersPage",
      perPage: "usersPerPage",
      sort: "usersSort",
    },
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    getRowId: (row) => row.id,
  });

  const exportRows = rows.map((row) => ({
    ...row,
    district: row.district || "Not set",
    phone: row.phone || "",
  }));

  const handleExportExcel = () => {
    void exportToExcel(exportRows, exportColumns, {
      filename: "roshal-users.xlsx",
      sheetName: "Users",
      title: "Roshal users",
    });
  };

  const handleExportPDF = () => {
    void exportToPDF(exportRows, exportColumns, {
      filename: "roshal-users.pdf",
      orientation: "landscape",
      title: "Roshal users",
      metadata: [{ label: "Total users", value: String(rows.length) }],
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <DashboardTableShell
        title="All users"
        description="Manage customer accounts, admin access, mobile numbers, districts, and exports."
      >
        <div className="p-4 text-sm text-muted-foreground">
          Loading user table...
        </div>
      </DashboardTableShell>
    );
  }

  return (
    <DashboardTableShell
      title="All users"
      description="Manage customer accounts, admin access, mobile numbers, districts, and exports."
    >
      <div className="min-w-0">
        <div className="flex flex-wrap justify-end gap-2 p-3 pt-0 sm:p-4 sm:pt-0 md:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
          >
            <FileSpreadsheet className="size-4" />
            Export Excel
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
          >
            <FileText className="size-4" />
            Export PDF
          </Button>
        </div>

        <div className="grid gap-3 p-3 pt-0 sm:p-4 sm:pt-0 md:hidden">
          {users.map((user) => {
            const row = rows.find((item) => item.id === user.id);
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
                        {user.phone || user.email}
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
                        {row?.district || "No district"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        <Link href={`/dashboard/users/${user.id}`}>Edit</Link>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8"
                        disabled={user.id === currentUserId || !row}
                        onClick={() => row && setDeleteTarget(row)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="hidden min-w-0 md:block">
          <DataTable table={table}>
            <DataTableToolbar table={table}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportExcel}
              >
                <FileSpreadsheet className="size-4" />
                Export Excel
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
              >
                <FileText className="size-4" />
                Export PDF
              </Button>
              <DataTableSortList table={table} align="end" />
            </DataTableToolbar>
          </DataTable>
        </div>
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {deleteTarget?.name || "this user"} from
              the dashboard. Orders linked to this account stay in the order
              history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={removeRoshalUser}>
              <input type="hidden" name="id" value={deleteTarget?.id || ""} />
              <Button type="submit" variant="destructive">
                Delete user
              </Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardTableShell>
  );
}
