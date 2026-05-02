"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Eye, EyeOff, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  removeRoshalProductReview,
  saveRoshalProductReviewPublication,
} from "@/actions/admin";
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
import { useDataTable } from "@/hooks/use-data-table";
import type { RoshalLocale } from "@/lib/store-types";

export interface ReviewRow {
  id: string;
  productId: string;
  productName: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  status: "published" | "hidden";
  createdAt: string;
  createdAtValue: number;
}

const includesTextFilter: FilterFn<ReviewRow> = (
  row,
  columnId,
  filterValue,
) => {
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

const selectFilter: FilterFn<ReviewRow> = (row, columnId, filterValue) => {
  const values = Array.isArray(filterValue) ? filterValue : [filterValue];
  const normalizedValues = values.map((value) => String(value));

  if (normalizedValues.length === 0) {
    return true;
  }

  return normalizedValues.includes(String(row.getValue(columnId)));
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={
            star <= rating
              ? "size-3.5 fill-primary text-primary"
              : "size-3.5 text-muted-foreground/35"
          }
        />
      ))}
      <span className="ml-1 text-xs font-semibold">{rating}/5</span>
    </div>
  );
}

function ReviewStatusBadge({ status }: { status: ReviewRow["status"] }) {
  return (
    <Badge variant={status === "published" ? "secondary" : "outline"}>
      {status}
    </Badge>
  );
}

function ReviewPublicationForm({ row }: { row: ReviewRow }) {
  const nextPublished = row.status !== "published";

  return (
    <form action={saveRoshalProductReviewPublication}>
      <input type="hidden" name="id" value={row.id} />
      <input
        type="hidden"
        name="isPublished"
        value={nextPublished ? "true" : "false"}
      />
      <Button type="submit" variant="outline" size="sm" className="h-8">
        {nextPublished ? (
          <Eye className="size-3.5" />
        ) : (
          <EyeOff className="size-3.5" />
        )}
        {nextPublished ? "Publish" : "Hide"}
      </Button>
    </form>
  );
}

function getColumns({
  onDeleteRequest,
  productOptions,
}: {
  onDeleteRequest: (review: ReviewRow) => void;
  productOptions: Array<{ value: string; label: string }>;
}): ColumnDef<ReviewRow>[] {
  return [
    {
      id: "productName",
      accessorKey: "productName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Product"
          label="Product"
        />
      ),
      meta: {
        label: "Product",
        variant: "multiSelect",
        options: productOptions,
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
    },
    {
      id: "reviewerName",
      accessorKey: "reviewerName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Customer"
          label="Customer"
        />
      ),
      meta: {
        label: "Customer",
        placeholder: "Search customer...",
        variant: "text",
      },
      enableColumnFilter: true,
      filterFn: includesTextFilter,
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="font-medium">{row.original.reviewerName}</p>
          {row.original.reviewerEmail ? (
            <p className="text-xs text-muted-foreground">
              {row.original.reviewerEmail}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      id: "rating",
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" label="Rating" />
      ),
      meta: {
        label: "Rating",
        variant: "multiSelect",
        options: [5, 4, 3, 2, 1].map((rating) => ({
          value: String(rating),
          label: `${rating} star`,
        })),
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
      cell: ({ row }) => <RatingStars rating={row.original.rating} />,
    },
    {
      id: "comment",
      accessorKey: "comment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Review" label="Review" />
      ),
      meta: {
        label: "Review",
        placeholder: "Search review...",
        variant: "text",
      },
      enableColumnFilter: true,
      filterFn: includesTextFilter,
      cell: ({ row }) => (
        <p className="max-w-md whitespace-normal text-sm leading-5">
          {row.original.comment}
        </p>
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
          { value: "published", label: "Published" },
          { value: "hidden", label: "Hidden" },
        ],
      },
      enableColumnFilter: true,
      filterFn: selectFilter,
      cell: ({ row }) => <ReviewStatusBadge status={row.original.status} />,
    },
    {
      id: "createdAtValue",
      accessorKey: "createdAtValue",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Latest" label="Latest" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap justify-end gap-2">
          <ReviewPublicationForm row={row.original} />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-8"
            onClick={() => onDeleteRequest(row.original)}
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      ),
      size: 190,
    },
  ];
}

export function RoshalReviewsTable({
  rows,
  locale,
}: {
  rows: ReviewRow[];
  locale: RoshalLocale;
}) {
  const [deleteTarget, setDeleteTarget] = useState<ReviewRow | null>(null);
  const productOptions = useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.productName)))
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right))
        .map((productName) => ({
          value: productName,
          label: productName,
        })),
    [rows],
  );
  const columns = useMemo(
    () => getColumns({ onDeleteRequest: setDeleteTarget, productOptions }),
    [productOptions],
  );
  const { table } = useDataTable({
    data: rows,
    columns,
    pageCount: Math.ceil(Math.max(rows.length, 1) / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "createdAtValue", desc: true }],
      columnVisibility: {
        createdAtValue: false,
      },
    },
    queryKeys: {
      page: "reviewsPage",
      perPage: "reviewsPerPage",
      sort: "reviewsSort",
      filters: "reviewsFilters",
    },
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
    getRowId: (row) => row.id,
  });

  return (
    <DashboardTableShell
      title={locale === "bn" ? "প্রোডাক্ট রিভিউ" : "Product reviews"}
      description={
        locale === "bn"
          ? "পাবলিশ, হাইড বা ডিলিট করার আগে সব রিভিউ এখানে দেখা যাবে।"
          : "Review, publish, hide, or remove product ratings from one place."
      }
    >
      <div className="min-w-0">
        <div className="grid grid-cols-2 gap-2.5 p-3 pt-0 sm:p-4 sm:pt-0 md:hidden">
          {rows.map((row) => (
            <Card
              key={row.id}
              className="min-w-0 border-none border-r-4 border-r-primary bg-background/70 p-0 shadow-sm"
            >
              <CardContent className="min-w-0 space-y-2 p-2.5">
                <div className="min-w-0 space-y-1">
                  <p className="line-clamp-2 text-sm font-semibold">
                    {row.productName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {row.reviewerName}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <ReviewStatusBadge status={row.status} />
                  <RatingStars rating={row.rating} />
                </div>
                <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
                  {row.comment}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {row.createdAt}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <ReviewPublicationForm row={row} />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8"
                    onClick={() => setDeleteTarget(row)}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="hidden min-w-0 md:block">
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
            <AlertDialogTitle>Delete review?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the review from dashboard and storefront rating data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={removeRoshalProductReview}>
              <input type="hidden" name="id" value={deleteTarget?.id || ""} />
              <Button type="submit" variant="destructive">
                Delete review
              </Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardTableShell>
  );
}
