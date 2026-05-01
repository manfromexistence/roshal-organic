"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const products = [
  {
    id: "PROD-1",
    name: "Organic Honey Crisp Apples",
    category: "Fruits",
    price: "$4.99",
    stock: 125,
    status: "In Stock",
    image: "https://picsum.photos/seed/roshal2/400/400"
  },
  {
    id: "PROD-2",
    name: "Farm Fresh Carrots",
    category: "Vegetables",
    price: "$2.50",
    stock: 450,
    status: "In Stock",
    image: "https://picsum.photos/seed/roshal3/400/400"
  },
  {
    id: "PROD-3",
    name: "Organic Whole Milk",
    category: "Dairy",
    price: "$5.20",
    stock: 20,
    status: "Low Stock",
    image: "https://picsum.photos/seed/roshal4/400/400"
  },
  {
    id: "PROD-4",
    name: "Pasture-Raised Eggs",
    category: "Dairy",
    price: "$6.99",
    stock: 0,
    status: "Out of Stock",
    image: "https://picsum.photos/seed/roshal5/400/400"
  },
  {
    id: "PROD-5",
    name: "Extra Virgin Olive Oil",
    category: "Pantry",
    price: "$18.50",
    stock: 85,
    status: "In Stock",
    image: "https://picsum.photos/seed/roshal6/400/400"
  }
]

export default function ProductsPage() {
  return (
    <>
      <DashboardHeader title="Product Management" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="bg-card pl-9 border-none shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1 shadow-sm border-none bg-card">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Link href="/products/new">
              <Button size="sm" className="h-9 gap-1 bg-primary text-white hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">All Products</CardTitle>
            <CardDescription>Manage your organic inventory and pricing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden border">
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill 
                          className="object-cover" 
                          data-ai-hint="organic product"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.id}</div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.status === "In Stock" ? "default" : product.status === "Low Stock" ? "secondary" : "destructive"}
                        className={product.status === "In Stock" ? "bg-primary/20 text-primary border-none" : ""}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
