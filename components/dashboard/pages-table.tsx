"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { removeRoshalPage } from "@/actions/admin";
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
import {
  stripDashboardActionFeedback,
  submitDashboardDeleteAndReload,
} from "@/lib/dashboard-action-feedback";
import { getLocalizedValue } from "@/lib/store-locale";
import type { RoshalLocale, RoshalMarketingPage } from "@/lib/store-types";

interface PageRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  latestAt: number;
  navigation: string;
  storefrontPath: string;
}

interface PageDeleteTarget {
  id: string;
  title: string;
}

function storefrontPathFromSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

function getColumns({
  onDeleteRequest,
}: {
  onDeleteRequest: (target: PageDeleteTarget) => void;
}): ColumnDef<PageRow>[] {
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
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault();
                onDeleteRequest({
                  id: row.original.id,
                  title: row.original.title,
                });
              }}
            >
              <Trash2 className="size-4" />
              Delete page
            </DropdownMenuItem>
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<PageDeleteTarget | null>(
    null,
  );
  const currentListUrl = stripDashboardActionFeedback(
    `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
  );
  const sortedPages = [...pages].sort((left, right) => {
    const latestDelta =
      (right.updatedAt || right.createdAt || new Date(0)).getTime() -
      (left.updatedAt || left.createdAt || new Date(0)).getTime();

    if (latestDelta !== 0) {
      return latestDelta;
    }

    return getLocalizedValue(locale, left.title).localeCompare(
      getLocalizedValue(locale, right.title),
    );
  });
  const rows: PageRow[] = sortedPages.map((page) => ({
    id: page.id,
    title: getLocalizedValue(locale, page.title),
    slug: page.slug,
    status: page.status,
    latestAt: (page.updatedAt || page.createdAt || new Date(0)).getTime(),
    storefrontPath: storefrontPathFromSlug(page.slug),
    navigation: page.showInNavigation ? "Visible" : "Hidden",
  }));

  const { table } = useDataTable({
    data: rows,
    columns: getColumns({ onDeleteRequest: setDeleteTarget }),
    pageCount: Math.ceil(Math.max(rows.length, 1) / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "latestAt", desc: true }],
      columnVisibility: {
        latestAt: false,
      },
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
        <div className="grid grid-cols-2 gap-2.5 p-3 pt-0 sm:p-4 sm:pt-0 md:hidden">
          {sortedPages.map((page) => {
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
                  <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
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
                  <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
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
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-8"
                      onClick={() =>
                        setDeleteTarget({
                          id: page.id,
                          title: getLocalizedValue(locale, page.title),
                        })
                      }
                    >
                      Delete
                    </Button>
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
            <AlertDialogTitle>Delete marketing page?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {deleteTarget?.title || "this page"} from the
              dashboard page list and deletes its CMS sections. Default pages
              are hidden with a deletion marker so they do not immediately
              reappear from fallback content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {deleteTarget ? (
              <form
                action={removeRoshalPage}
                className="w-full sm:w-auto"
                onSubmit={submitDashboardDeleteAndReload}
              >
                <input type="hidden" name="id" value={deleteTarget.id} />
                <input type="hidden" name="redirectTo" value={currentListUrl} />
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
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
