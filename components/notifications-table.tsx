"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { MarkNotificationReadButton } from "@/components/edms/notification-actions";
import {
  EdmsStatusBadge,
  formatEdmsLabel,
} from "@/components/edms/status-badge";
import { Button } from "@/components/ui/button";

export interface NotificationRow {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  projectName?: string;
  createdLabel: string;
  actionUrl?: string;
}

const STATUS_OPTIONS = [
  { value: "read", label: "Read" },
  { value: "unread", label: "Unread" },
];

const columns: ColumnDef<NotificationRow>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Notification" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.title}</div>
        <p className="max-w-xl text-sm text-muted-foreground">
          {row.original.message}
        </p>
      </div>
    ),
    meta: {
      variant: "text",
      label: "Notification",
      placeholder: "Filter by title...",
    },
  },
  {
    id: "type",
    accessorFn: (row) => formatEdmsLabel(row.type),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Type" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatEdmsLabel(row.original.type)}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Type",
      placeholder: "Filter by type...",
    },
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Project" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.projectName || "General"}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Project",
      placeholder: "Filter by project...",
    },
  },
  {
    id: "readState",
    accessorFn: (row) => (row.isRead ? "read" : "unread"),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => (
      <EdmsStatusBadge status={row.original.isRead ? "read" : "unread"} />
    ),
    meta: {
      variant: "select",
      label: "Status",
      options: STATUS_OPTIONS,
    },
  },
  {
    accessorKey: "createdLabel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {row.original.createdLabel}
      </div>
    ),
    meta: {
      variant: "text",
      label: "Created",
      placeholder: "Filter by date...",
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex flex-wrap justify-end gap-2">
        {row.original.actionUrl ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href={row.original.actionUrl}>Open</Link>
          </Button>
        ) : null}
        <MarkNotificationReadButton
          notificationId={row.original.id}
          disabled={row.original.isRead}
        />
      </div>
    ),
  },
];

export function NotificationsTable({
  notifications,
}: {
  notifications: NotificationRow[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: notifications,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
