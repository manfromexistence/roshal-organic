"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const customersData = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+880 1712-345678",
    orders: 5,
    totalSpent: "৳6,250",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+880 1812-345678",
    orders: 12,
    totalSpent: "৳15,400",
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+880 1912-345678",
    orders: 3,
    totalSpent: "৳2,850",
    status: "Active",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "+880 1612-345678",
    orders: 8,
    totalSpent: "৳10,200",
    status: "Inactive",
  },
];

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 min-w-0">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage customer accounts</p>
        </div>
      </div>
      <div className="min-w-0 max-w-full overflow-x-auto px-4 lg:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/customers/${customer.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
