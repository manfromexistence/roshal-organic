"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Suspense } from "react"

const parentCategories = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Meat & Fish",
  "Pantry"
]

function NewSubcategoryForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const defaultParent = searchParams.get("parent") || ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would save to Firestore here
    toast({
      title: "Subcategory Created",
      description: "Your new subcategory has been added successfully.",
    })
    router.push("/categories")
  }

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <Link href="/categories" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Categories
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Subcategory Details</CardTitle>
            <CardDescription>
              Assign this subcategory to a parent category and give it a name.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <Select defaultValue={defaultParent}>
                <SelectTrigger id="parent">
                  <SelectValue placeholder="Select a parent category" />
                </SelectTrigger>
                <SelectContent>
                  {parentCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Subcategory Name</Label>
              <Input id="name" placeholder="e.g., Citrus Fruits" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the products in this subcategory..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" type="button" onClick={() => router.push("/categories")}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Subcategory
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default function NewSubcategoryPage() {
  return (
    <>
      <DashboardHeader title="Create New Subcategory" />
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <NewSubcategoryForm />
      </Suspense>
    </>
  )
}
