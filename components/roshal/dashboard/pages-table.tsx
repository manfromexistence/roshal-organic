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
import { getLocalizedValue } from "@/lib/roshal/locale";
import type { RoshalLocale, RoshalMarketingPage } from "@/lib/roshal/types";

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

function getColumns(locale: RoshalLocale): ColumnDef<PageRow>[] {
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
        <Badge variant="secondary">{row.original.status}</Badge>
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
        <div className="flex items-center gap-2">
          {row.original.status === "published" ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={row.original.storefrontPath}
                target="_blank"
                rel="noreferrer"
              >
                {locale === "bn" ? "লাইভ" : "Live"}
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/pages/${row.original.id}`}>
              {locale === "bn" ? "এডিট" : "Edit"}
            </Link>
          </Button>
        </div>
      ),
      size: 160,
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
    navigation: page.showInNavigation
      ? locale === "bn"
        ? "দেখাবে"
        : "Visible"
      : locale === "bn"
        ? "লুকানো"
        : "Hidden",
  }));

  const { table } = useDataTable({
    data: rows,
    columns: getColumns(locale),
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
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} align="end" />
      </DataTableToolbar>
    </DataTable>
  );
}
