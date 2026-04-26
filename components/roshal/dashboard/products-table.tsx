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
import { formatBdt } from "@/lib/roshal/format";
import { getLocalizedValue } from "@/lib/roshal/locale";
import type { RoshalLocale, RoshalProduct } from "@/lib/roshal/types";

interface ProductRow {
  id: string;
  name: string;
  category: string;
  price: string;
  inventory: number;
  inventoryStatus: string;
  inventoryStatusKey: "out-of-stock" | "low-stock" | "in-stock";
  status: string;
}

function getColumns(locale: RoshalLocale): ColumnDef<ProductRow>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Product"
          label="Product"
        />
      ),
      meta: {
        label: "Product",
        placeholder: "Search products...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Category"
          label="Category"
        />
      ),
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" label="Price" />
      ),
    },
    {
      id: "inventory",
      accessorKey: "inventory",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Inventory"
          label="Inventory"
        />
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.original.inventory}</p>
          <Badge
            variant={
              row.original.inventoryStatusKey === "out-of-stock"
                ? "destructive"
                : row.original.inventoryStatusKey === "low-stock"
                  ? "outline"
                  : "secondary"
            }
          >
            {row.original.inventoryStatus}
          </Badge>
        </div>
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
      id: "actions",
      cell: ({ row }) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/dashboard/products/${row.original.id}`}>
            {locale === "bn" ? "এডিট" : "Edit"}
          </Link>
        </Button>
      ),
      size: 80,
    },
  ];
}

export function RoshalProductsTable({
  products,
  locale,
}: {
  products: RoshalProduct[];
  locale: RoshalLocale;
}) {
  const rows: ProductRow[] = products.map((product) => ({
    id: product.id,
    name: getLocalizedValue(locale, product.name),
    category: getLocalizedValue(locale, product.categoryLabel),
    price: formatBdt(product.price, locale),
    inventory: product.inventory,
    inventoryStatus:
      product.inventory <= 0
        ? locale === "bn"
          ? "স্টক শেষ"
          : "Out of stock"
        : product.inventory <= 10
          ? locale === "bn"
            ? "লো স্টক"
            : "Low stock"
          : locale === "bn"
            ? "স্টকে আছে"
            : "In stock",
    inventoryStatusKey:
      product.inventory <= 0
        ? "out-of-stock"
        : product.inventory <= 10
          ? "low-stock"
          : "in-stock",
    status: product.isPublished ? "published" : "draft",
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
