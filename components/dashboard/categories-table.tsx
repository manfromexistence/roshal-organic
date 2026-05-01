"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
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

export interface CategoryTableRow {
  id: string;
  key: string;
  label: string;
  productCount: number;
  showInNavigation: boolean;
  showOnHomepage: boolean;
  sortOrder: number;
  status: "Enabled" | "Disabled";
  subcategoryCount: number;
}

function getColumns(): ColumnDef<CategoryTableRow>[] {
  return [
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
      id: "key",
      accessorKey: "key",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Key" label="Key" />
      ),
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
      cell: ({ row }) => (
        <Badge variant={row.original.showOnHomepage ? "secondary" : "outline"}>
          {row.original.showOnHomepage ? "Visible" : "Hidden"}
        </Badge>
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
                href={`/dashboard/categories/sub/new?categoryId=${row.original.id}`}
              >
                <Plus className="size-4" />
                Add subcategory
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 80,
    },
  ];
}

export function RoshalCategoriesTable({ rows }: { rows: CategoryTableRow[] }) {
  const { table } = useDataTable({
    data: rows,
    columns: getColumns(),
    pageCount: Math.ceil(Math.max(rows.length, 1) / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "sortOrder", desc: false }],
    },
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    getRowId: (row) => row.id,
  });

  return (
    <DashboardTableShell
      title="All categories"
      description="Only the category summary table is shown here while the larger taxonomy editor stays hidden."
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
          {rows.map((row) => (
            <Card
              key={row.id}
              className="min-w-0 border-none border-r-4 border-r-primary bg-background/70 p-0 shadow-sm"
            >
              <CardContent className="space-y-2.5 p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{row.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {row.key}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
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
                <Button asChild variant="outline" size="sm" className="h-8">
                  <Link
                    href={`/dashboard/categories/sub/new?categoryId=${row.id}`}
                  >
                    Add subcategory
                  </Link>
                </Button>
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
    </DashboardTableShell>
  );
}
