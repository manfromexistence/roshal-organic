"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { removeRoshalCategory, removeRoshalSubcategory } from "@/actions/admin";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";

export interface CategoryTableRow {
  id: string;
  type: "category" | "subcategory";
  key: string;
  label: string;
  latestAt: number;
  parentLabel?: string;
  productCount: number;
  showInNavigation: boolean;
  showOnHomepage: boolean;
  sortOrder: number;
  status: "Enabled" | "Disabled";
  subcategoryCount: number;
}

function getColumns({
  onDeleteRequest,
}: {
  onDeleteRequest: (row: CategoryTableRow) => void;
}): ColumnDef<CategoryTableRow>[] {
  return [
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" label="Type" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      id: "label",
      accessorKey: "label",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Category"
          label="Category"
        />
      ),
      meta: {
        label: "Category",
        placeholder: "Search categories...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "latestAt",
      accessorKey: "latestAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Latest"
          label="Latest update"
        />
      ),
    },
    {
      id: "key",
      accessorKey: "key",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Key" label="Key" />
      ),
    },
    {
      id: "parentLabel",
      accessorKey: "parentLabel",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Parent"
          label="Parent category"
        />
      ),
      cell: ({ row }) => row.original.parentLabel || "-",
    },
    {
      id: "productCount",
      accessorKey: "productCount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Products"
          label="Products"
        />
      ),
    },
    {
      id: "subcategoryCount",
      accessorKey: "subcategoryCount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Subcategories"
          label="Subcategories"
        />
      ),
    },
    {
      id: "showInNavigation",
      accessorKey: "showInNavigation",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Navigation"
          label="Navigation"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.showInNavigation ? "secondary" : "outline"}
        >
          {row.original.showInNavigation ? "Visible" : "Hidden"}
        </Badge>
      ),
    },
    {
      id: "showOnHomepage",
      accessorKey: "showOnHomepage",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Home" label="Home" />
      ),
      cell: ({ row }) =>
        row.original.type === "category" ? (
          <Badge
            variant={row.original.showOnHomepage ? "secondary" : "outline"}
          >
            {row.original.showOnHomepage ? "Visible" : "Hidden"}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
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
          variant={row.original.status === "Enabled" ? "secondary" : "outline"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "sortOrder",
      accessorKey: "sortOrder",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Sort"
          label="Sort order"
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Category actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={
                  row.original.type === "category"
                    ? `/dashboard/categories/${row.original.id}`
                    : `/dashboard/categories/sub/${row.original.id}`
                }
              >
                <Pencil className="size-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            {row.original.type === "category" ? (
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/categories/sub/new?categoryId=${row.original.id}`}
                >
                  <Plus className="size-4" />
                  Add subcategory
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault();
                onDeleteRequest(row.original);
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 80,
    },
  ];
}

export function RoshalCategoriesTable({ rows }: { rows: CategoryTableRow[] }) {
  const [deleteTarget, setDeleteTarget] = useState<CategoryTableRow | null>(
    null,
  );
  const sortedRows = [...rows].sort((left, right) => {
    const latestDelta = right.latestAt - left.latestAt;

    if (latestDelta !== 0) {
      return latestDelta;
    }

    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.label.localeCompare(right.label);
  });
  const columns = getColumns({ onDeleteRequest: setDeleteTarget });
  const { table } = useDataTable({
    data: sortedRows,
    columns,
    pageCount: Math.ceil(Math.max(sortedRows.length, 1) / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "latestAt", desc: true }],
      columnVisibility: {
        latestAt: false,
        parentLabel: false,
      },
    },
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    getRowId: (row) => row.id,
  });

  return (
    <DashboardTableShell
      title="All categories"
      description="Add, edit, delete, search, and sort categories and subcategories from one compact table."
      action={
        <Button asChild size="sm">
          <Link href="/dashboard/categories/new">
            <Plus className="size-4" />
            New category
          </Link>
        </Button>
      }
    >
      <div className="min-w-0">
        <div className="grid gap-2.5 p-3 pt-0 sm:grid-cols-2 sm:p-4 sm:pt-0 md:hidden">
          {sortedRows.map((row) => (
            <Card
              key={row.id}
              className="min-w-0 border-none border-r-4 border-r-primary bg-background/70 p-0 shadow-sm"
            >
              <CardContent className="space-y-2.5 p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{row.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {row.type === "subcategory" && row.parentLabel
                      ? `${row.parentLabel} / ${row.key}`
                      : row.key}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="rounded-sm capitalize">
                    {row.type}
                  </Badge>
                  <Badge
                    variant={row.status === "Enabled" ? "secondary" : "outline"}
                    className="rounded-sm"
                  >
                    {row.status}
                  </Badge>
                  <Badge variant="outline" className="rounded-sm">
                    {row.productCount} products
                  </Badge>
                  <Badge variant="outline" className="rounded-sm">
                    {row.subcategoryCount} subcategories
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <Link
                      href={
                        row.type === "category"
                          ? `/dashboard/categories/${row.id}`
                          : `/dashboard/categories/sub/${row.id}`
                      }
                    >
                      Edit
                    </Link>
                  </Button>
                  {row.type === "category" ? (
                    <Button asChild variant="ghost" size="sm" className="h-8">
                      <Link
                        href={`/dashboard/categories/sub/new?categoryId=${row.id}`}
                      >
                        Add subcategory
                      </Link>
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8"
                    onClick={() => setDeleteTarget(row)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="hidden min-w-0 overflow-x-auto md:block">
          <DataTable table={table}>
            <DataTableToolbar table={table}>
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
            <AlertDialogTitle>
              Delete {deleteTarget?.type || "item"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {deleteTarget?.label || "this item"} from
              the storefront taxonomy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {deleteTarget ? (
              <form
                action={
                  deleteTarget.type === "category"
                    ? removeRoshalCategory
                    : removeRoshalSubcategory
                }
              >
                <input type="hidden" name="id" value={deleteTarget.id} />
                <Button type="submit" variant="destructive">
                  Delete
                </Button>
              </form>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardTableShell>
  );
}
