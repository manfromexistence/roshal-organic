"use client";

import { Plus } from "lucide-react";
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

const productsData = [
  {
    id: "1",
    name: "Organic Honey",
    category: "Honey",
    price: "৳450",
    stock: 50,
    status: "Active",
  },
  {
    id: "2",
    name: "Premium Ghee",
    category: "Ghee",
    price: "৳650",
    stock: 30,
    status: "Active",
  },
  {
    id: "3",
    name: "Fresh Dates",
    category: "Dates",
    price: "৳320",
    stock: 100,
    status: "Active",
  },
  {
    id: "4",
    name: "Organic Spices",
    category: "Spices",
    price: "৳280",
    stock: 75,
    status: "Active",
  },
];

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 min-w-0">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      <div className="min-w-0 max-w-full overflow-x-auto px-4 lg:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
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
