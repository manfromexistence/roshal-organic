"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function NewCategoryPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would save to Firestore here
    toast({
      title: "Category Created",
      description: "Your new category has been added successfully.",
    })
    router.push("/categories")
  }

  return (
    <>
      <DashboardHeader title="Create New Category" />
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
              <CardTitle className="font-headline">Category Details</CardTitle>
              <CardDescription>
                Define the name, image, and visual style for your new product category.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input id="name" placeholder="e.g., Seasonal Greens" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Category Image URL</Label>
                  <div className="relative">
                    <Input id="image" placeholder="https://..." required className="pl-9" />
                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Accent Color Theme</Label>
                <Select defaultValue="bg-green-100">
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-green-100">Natural Green</SelectItem>
                    <SelectItem value="bg-red-100">Berry Red</SelectItem>
                    <SelectItem value="bg-blue-100">Sky Blue</SelectItem>
                    <SelectItem value="bg-yellow-100">Harvest Yellow</SelectItem>
                    <SelectItem value="bg-orange-100">Citrus Orange</SelectItem>
                    <SelectItem value="bg-purple-100">Plum Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what kind of products belong in this category..."
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
                Save Category
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  )
}
