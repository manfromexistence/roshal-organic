"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal, Pencil } from "lucide-react";
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
import { getLocalizedValue } from "@/lib/store-locale";
import type { RoshalLocale, RoshalMarketingPage } from "@/lib/store-types";

interface PageRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  navigation: string;
  storefrontPath: string;
}

function storefrontPathFromSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

function getColumns(): ColumnDef<PageRow>[] {
  return [
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Page" label="Page" />
      ),
      meta: {
        label: "Page",
        placeholder: "Search pages...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "slug",
      accessorKey: "slug",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slug" label="Slug" />
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
          variant={
            row.original.status === "published" ? "secondary" : "outline"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "navigation",
      accessorKey: "navigation",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Navigation"
          label="Navigation"
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
              <span className="sr-only">Page actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/pages/${row.original.id}`}>
                <Pencil className="size-4" />
                Edit page
              </Link>
            </DropdownMenuItem>
            {row.original.status === "published" ? (
              <DropdownMenuItem asChild>
                <Link
                  href={row.original.storefrontPath}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="size-4" />
                  Open live page
                </Link>
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 80,
    },
  ];
}

export function RoshalPagesTable({
  pages,
  locale,
}: {
  pages: RoshalMarketingPage[];
  locale: RoshalLocale;
}) {
  const rows: PageRow[] = pages.map((page) => ({
    id: page.id,
    title: getLocalizedValue(locale, page.title),
    slug: page.slug,
    status: page.status,
    storefrontPath: storefrontPathFromSlug(page.slug),
    navigation: page.showInNavigation ? "Visible" : "Hidden",
  }));

  const { table } = useDataTable({
    data: rows,
    columns: getColumns(),
    pageCount: Math.ceil(Math.max(rows.length, 1) / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "title", desc: false }],
    },
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    getRowId: (row) => row.id,
  });

  return (
    <DashboardTableShell
      title="Marketing pages"
      description="Edit public pages, navigation labels, and CMS-managed sections."
    >
      <div className="min-w-0">
        <div className="grid gap-2.5 p-3 pt-0 sm:grid-cols-2 sm:p-4 sm:pt-0 md:hidden">
          {pages.map((page) => {
            const storefrontPath = storefrontPathFromSlug(page.slug);

            return (
              <Card
                key={page.id}
                className="min-w-0 border-none border-r-4 border-r-primary bg-background/70 p-0 shadow-sm"
              >
                <CardContent className="space-y-2.5 p-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {getLocalizedValue(locale, page.title)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      /{page.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant={
                        page.status === "published" ? "secondary" : "outline"
                      }
                      className="rounded-sm"
                    >
                      {page.status}
                    </Badge>
                    <Badge variant="outline" className="rounded-sm">
                      {page.showInNavigation ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Button asChild variant="outline" size="sm" className="h-8">
                      <Link href={`/dashboard/pages/${page.id}`}>Edit</Link>
                    </Button>
                    {page.status === "published" ? (
                      <Button asChild variant="ghost" size="sm" className="h-8">
                        <Link
                          href={storefrontPath}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
