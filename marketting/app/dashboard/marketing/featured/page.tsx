"use client";

import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const featuredProductsData = [
  {
    id: "1",
    productName: "Organic Honey",
    productImage: "/honey.jpg",
    category: "Honey",
    price: "৳450",
    discount: "20%",
    section: "Top Selling",
    status: "Active",
  },
  {
    id: "2",
    productName: "Premium Ghee",
    productImage: "/ghee.jpg",
    category: "Ghee",
    price: "৳650",
    discount: "15%",
    section: "New Arrivals",
    status: "Active",
  },
  {
    id: "3",
    productName: "Fresh Dates",
    productImage: "/dates.jpg",
    category: "Dates",
    price: "৳320",
    discount: "10%",
    section: "Top Selling",
    status: "Active",
  },
];

const sections = ["Top Selling", "New Arrivals", "Special Deals"];

export default function FeaturedProductsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 min-w-0">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="text-muted-foreground">
            Manage products featured on the landing page
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Featured Product
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featuredProductsData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{product.productName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{product.discount} OFF</Badge>
                  </TableCell>
                  <TableCell>{product.section}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Featured Product Form */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Featured Product</CardTitle>
            <CardDescription>
              Add a product to be featured on the landing page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Select Product</Label>
              <Select>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Organic Honey</SelectItem>
                  <SelectItem value="2">Premium Ghee</SelectItem>
                  <SelectItem value="3">Fresh Dates</SelectItem>
                  <SelectItem value="4">Organic Spices</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Display Section</Label>
              <Select>
                <SelectTrigger id="section">
                  <SelectValue placeholder="Choose a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Percentage</Label>
              <Input id="discount" type="number" placeholder="20" />
            </div>
            <Button>Save Featured Product</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
