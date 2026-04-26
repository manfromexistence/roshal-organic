"use client";

/**
 * UsersTable Component
 *
 * This is the default data-table component for the Quadra EDMS project.
 * It displays user data with advanced filtering, sorting, and pagination capabilities.
 *
 * Features:
 * - Client-side filtering, sorting, and pagination
 * - Local storage caching with 5-minute expiration to prevent flashing on reload
 * - Column filters (name, email, role, created date)
 * - Multi-select filters for role
 * - Date range filter for created date
 * - Row selection with checkboxes
 * - Actions menu (Edit, Delete) with dropdown UI
 * - Responsive design with shadcn-ui components
 *
 * Data Source:
 * - Fetches user data from /api/users endpoint
 * - Caches data in localStorage with key "usersData" and "usersDataTime"
 * - Cache expires after 5 minutes (300000ms)
 *
 * UI Components Used:
 * - DataTable: Main table component from @/components/data-table/data-table
 * - DataTableColumnHeader: Column header with sorting
 * - DataTableToolbar: Toolbar with search and filters
 * - DataTableSortList: Sort options dropdown
 * - Badge: Display role badges
 * - Button: Action buttons
 * - Checkbox: Row selection
 * - DropdownMenu: Actions menu with Edit/Delete options
 *
 * @returns {JSX.Element} The users table component
 */

import type { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataTable } from "@/hooks/use-data-table";
import { capitalizeFirstLetter } from "@/lib/text-utils";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }: { table: any }) => (
      <Checkbox
        aria-label="Select all"
        className="translate-y-0.5"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }: { row: any }) => (
      <Checkbox
        aria-label="Select row"
        className="translate-y-0.5"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    size: 40,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title="Name" label="Name" />
    ),
    cell: ({ row }: { row: any }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    meta: {
      label: "Name",
      placeholder: "Search names...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title="Email" label="Email" />
    ),
    cell: ({ row }: { row: any }) => <div>{row.getValue("email")}</div>,
    meta: {
      label: "Email",
      placeholder: "Search emails...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "role",
    accessorKey: "role",
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title="Role" label="Role" />
    ),
    cell: ({ row }: { row: any }) => (
      <Badge variant="outline" className="py-1">
        <span className="capitalize">
          {capitalizeFirstLetter(row.getValue("role"))}
        </span>
      </Badge>
    ),
    meta: {
      label: "Role",
      variant: "multiSelect",
      options: [
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
        { label: "Client", value: "client" },
        { label: "PMC", value: "pmc" },
        { label: "Vendor", value: "vendor" },
        { label: "Subcontractor", value: "subcontractor" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title="Created" label="Created" />
    ),
    cell: ({ row }: { row: any }) => (
      <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    ),
    meta: {
      label: "Created",
      variant: "date",
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: function Cell({ row }: { row: any }) {
      return <ActionsCell user={row.original} />;
    },
    size: 40,
  },
];

function ActionsCell({ user }: { user: User }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email,
    name: user.name,
    role: user.role,
    password: "",
  });

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users?id=${user.id}`, { method: "DELETE" });
      if (res.ok) {
        // Clear cache
        localStorage.removeItem("usersData");
        localStorage.removeItem("usersDataTime");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      password: "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          ...formData,
        }),
      });

      if (res.ok) {
        setIsEditOpen(false);
        // Clear cache
        localStorage.removeItem("usersData");
        localStorage.removeItem("usersDataTime");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive focus:text-destructive"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details. Password is optional - leave blank to keep
              current password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="pmc">PMC</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="subcontractor">Subcontractor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="password">
                Password (leave blank to keep current)
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const cachedData = localStorage.getItem("usersData");
      const cachedTime = localStorage.getItem("usersDataTime");

      // Use cached data if less than 5 minutes old
      if (cachedData && cachedTime) {
        const timeDiff = Date.now() - parseInt(cachedTime, 10);
        if (timeDiff < 5 * 60 * 1000) {
          setUsers(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/users");
      const data = (await res.json()) as User[];
      setUsers(data);

      // Cache the data
      localStorage.setItem("usersData", JSON.stringify(data));
      localStorage.setItem("usersDataTime", Date.now().toString());
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const { table } = useDataTable({
    data: users,
    columns,
    pageCount: Math.ceil(users.length / 10),
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Users</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Users</h2>
      </div>
      <div>
        <DataTable table={table}>
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        </DataTable>
      </div>
    </div>
  );
}
