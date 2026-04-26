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
import {
  EdmsStatusBadge,
  formatEdmsLabel,
} from "@/components/edms/status-badge";
import { WorkflowActionSheet } from "@/components/edms/workflow-action-sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type WorkflowStepData = {
  assignedRole: string;
  assignedToName: string;
  documentNumber: string;
  dueLabel: string;
  id: string;
  isActionable: boolean;
  projectId: string;
  projectName: string;
  status: string;
  stepName: string;
  stepNumber: number;
  title: string;
  totalSteps: number;
  workflowId: string;
  workflowName: string;
};

const workflowStatuses = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "overdue", label: "Overdue" },
];

const columns: ColumnDef<WorkflowStepData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableHiding: false,
    enableSorting: false,
    maxSize: 5,
    size: 5,
  },
  {
    accessorKey: "stepName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Step" />
    ),
    cell: ({ row }) => {
      const workflowName = row.original.workflowName;
      const stepNumber = row.original.stepNumber;
      const totalSteps = row.original.totalSteps;

      return (
        <div className="space-y-1">
          <p className="font-medium">{row.getValue("stepName")}</p>
          <p className="text-xs text-muted-foreground">
            {workflowName} | Step {stepNumber} of {totalSteps}
          </p>
        </div>
      );
    },
    meta: {
      label: "Step",
      placeholder: "Filter by step...",
      variant: "text",
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Document" />
    ),
    cell: ({ row }) => {
      const documentNumber = row.original.documentNumber;

      return (
        <div className="space-y-1">
          <p>{row.getValue("title")}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {documentNumber}
          </p>
        </div>
      );
    },
    meta: {
      label: "Document",
      placeholder: "Filter by document...",
      variant: "text",
    },
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Project" />
    ),
    cell: ({ row }) => <div>{row.getValue("projectName")}</div>,
    meta: {
      label: "Project",
      placeholder: "Filter by project...",
      variant: "text",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ cell }) => <EdmsStatusBadge status={cell.getValue<string>()} />,
    meta: {
      label: "Status",
      options: workflowStatuses,
      variant: "select",
    },
  },
  {
    accessorKey: "assignedToName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Assignee" />
    ),
    cell: ({ row }) => {
      const assignedToName = row.original.assignedToName;
      const assignedRole = row.original.assignedRole;

      return (
        <div className="space-y-1">
          <p>{assignedToName}</p>
          <p className="text-xs text-muted-foreground">
            {formatEdmsLabel(assignedRole)}
          </p>
        </div>
      );
    },
    meta: {
      label: "Assignee",
      placeholder: "Filter by assignee...",
      variant: "text",
    },
  },
  {
    accessorKey: "dueLabel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Due" />
    ),
    cell: ({ row }) => {
      const dueLabel = row.original.dueLabel;
      const isActionable = row.original.isActionable;
      const stepId = row.original.id;
      const title = `${row.original.documentNumber} - ${row.original.title}`;
      const projectId = row.original.projectId;

      return (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">{dueLabel}</span>
          <WorkflowActionSheet
            stepId={stepId}
            title={title}
            isActionable={isActionable}
            projectId={projectId}
          />
        </div>
      );
    },
    meta: {
      label: "Due",
      placeholder: "Filter by due date...",
      variant: "text",
    },
  },
  {
    id: "actions",
    enableHiding: false,
    maxSize: 50,
    size: 50,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button asChild size="sm" variant="ghost">
          <Link href={`/workflows/${row.original.workflowId}`}>View</Link>
        </Button>
      </div>
    ),
  },
];

interface WorkflowsDataTableProps {
  steps: WorkflowStepData[];
}

export function WorkflowsDataTable({ steps }: WorkflowsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    columns,
    data: steps,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
