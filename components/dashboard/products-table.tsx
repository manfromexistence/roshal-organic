"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal, Pencil } from "lucide-react";
import Image from "next/image";
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
import { formatBdt } from "@/lib/store-format";
import { getLocalizedValue } from "@/lib/store-locale";
import type { RoshalLocale, RoshalProduct } from "@/lib/store-types";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: string;
  inventory: number;
  inventoryStatus: string;
  inventoryStatusKey: "out-of-stock" | "low-stock" | "in-stock";
  status: string;
}

function getColumns(): ColumnDef<ProductRow>[] {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Product actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/products/${row.original.id}`}>
                <Pencil className="size-4" />
                Edit product
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/products/${row.original.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-4" />
                Open storefront
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 80,
    },
  ];
}

function getInventoryState(product: RoshalProduct) {
  const key =
    product.inventory <= 0
      ? "out-of-stock"
      : product.inventory <= 10
        ? "low-stock"
        : "in-stock";

  return {
    key,
    label:
      key === "out-of-stock"
        ? "Out of stock"
        : key === "low-stock"
          ? "Low stock"
          : "In stock",
  } as const;
}

export function RoshalProductsTable({
  products,
  locale,
}: {
  products: RoshalProduct[];
  locale: RoshalLocale;
}) {
  const rows: ProductRow[] = products.map((product) => {
    const inventoryState = getInventoryState(product);

    return {
      id: product.id,
      slug: product.slug,
      name: getLocalizedValue(locale, product.name),
      category: getLocalizedValue(locale, product.categoryLabel),
      price: formatBdt(product.price, locale),
      inventory: product.inventory,
      inventoryStatus: inventoryState.label,
      inventoryStatusKey: inventoryState.key,
      status: product.isPublished ? "published" : "draft",
    };
  });

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
      title="All products"
      description="Search, sort, and edit the live storefront catalog."
    >
      <div className="min-w-0">
        <div className="grid gap-2.5 p-3 pt-0 sm:grid-cols-2 sm:p-4 sm:pt-0 md:hidden">
          {products.map((product) => {
            const name = getLocalizedValue(locale, product.name);
            const category = getLocalizedValue(locale, product.categoryLabel);
            const inventoryState = getInventoryState(product);

            return (
              <Card
                key={product.id}
                className="min-w-0 border-none border-r-4 border-r-primary bg-background/70 p-0 shadow-sm"
              >
                <CardContent className="flex min-w-0 gap-2.5 p-2.5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-background">
                    <Image
                      src={product.heroImage || "/logo.png"}
                      alt={name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {category}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="rounded-sm">
                        {formatBdt(product.price, locale)}
                      </Badge>
                      <Badge
                        variant={
                          inventoryState.key === "out-of-stock"
                            ? "destructive"
                            : inventoryState.key === "low-stock"
                              ? "outline"
                              : "secondary"
                        }
                        className="rounded-sm"
                      >
                        {inventoryState.label} {"\u00b7"} {product.inventory}
                      </Badge>
                      <Badge
                        variant={product.isPublished ? "secondary" : "outline"}
                        className="rounded-sm"
                      >
                        {product.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        <Link href={`/dashboard/products/${product.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="h-8">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </Link>
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
              <DataTableSortList table={table} align="end" />
            </DataTableToolbar>
          </DataTable>
        </div>
      </div>
    </DashboardTableShell>
  );
}
