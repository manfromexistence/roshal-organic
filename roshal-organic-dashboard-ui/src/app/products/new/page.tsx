"use client"

import * as React from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X, Image as ImageIcon, Package, DollarSign, ListFilter } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Product Created",
        description: "Your new organic product has been added to the catalog.",
      })
      router.push("/products")
    }, 1000)
  }

  return (
    <>
      <DashboardHeader title="Add New Product" />
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <Link href="/products" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Product Information
                  </CardTitle>
                  <CardDescription>
                    Enter the basic details of your new organic product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" placeholder="e.g., Organic Honey Crisp Apples" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the product's taste, origin, and organic qualities..."
                      className="min-h-[150px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Product Media
                  </CardTitle>
                  <CardDescription>
                    Add an image URL to represent your product in the store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <div className="relative">
                      <Input id="image" placeholder="https://images.unsplash.com/..." required className="pl-9" />
                      <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Pricing & Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (BDT)</Label>
                    <div className="relative">
                      <Input id="price" type="number" step="0.01" placeholder="0.00" required className="pl-8" />
                      <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">৳</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" type="number" placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Availability Status</Label>
                    <Select defaultValue="in-stock">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <ListFilter className="h-5 w-5 text-primary" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="meat-fish">Meat & Fish</SelectItem>
                        <SelectItem value="pantry">Pantry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button variant="outline" type="button" onClick={() => router.push("/products")} disabled={loading}>
              <X className="h-4 w-4 mr-2" />
              Discard
            </Button>
            <Button type="submit" className="bg-primary text-white px-8" disabled={loading}>
              {loading ? "Saving..." : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Publish Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
