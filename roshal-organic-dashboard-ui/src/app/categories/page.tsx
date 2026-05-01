"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, Pencil, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

const categories = [
  { name: "Fruits", count: 145, icon: "🍎", color: "bg-red-100", subcategories: ["Citrus", "Berries", "Tropical"] },
  { name: "Vegetables", count: 232, icon: "🥦", color: "bg-green-100", subcategories: ["Leafy Greens", "Root", "Brassicas"] },
  { name: "Dairy", count: 86, icon: "🥛", color: "bg-blue-100", subcategories: ["Milk", "Cheese", "Yogurt"] },
  { name: "Bakery", count: 42, icon: "🍞", color: "bg-yellow-100", subcategories: ["Bread", "Pastries"] },
  { name: "Meat & Fish", count: 28, icon: "🥩", color: "bg-orange-100", subcategories: ["Poultry", "Beef", "Seafood"] },
  { name: "Pantry", count: 112, icon: "🥫", color: "bg-amber-100", subcategories: ["Grains", "Spices", "Oil"] },
]

export default function CategoriesPage() {
  return (
    <>
      <DashboardHeader title="Category Management" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">Organize and manage your product catalog segments.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/categories/sub/new">
              <Button variant="secondary" className="shadow-sm bg-orange-100 hover:bg-orange-200 text-orange-800 border-none">
                <Plus className="h-4 w-4 mr-2" />
                New Subcategory
              </Button>
            </Link>
            <Link href="/categories/new">
              <Button className="bg-primary text-white shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.name} className="border-none shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className={`h-12 w-12 rounded-xl ${category.color} flex items-center justify-center text-2xl shadow-inner`}>
                    {category.icon}
                  </div>
                  <div className="flex gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link href={`/categories/sub/new?parent=${category.name}`}>
                            <Plus className="h-4 w-4" /> Add Subcategory
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="h-4 w-4" /> Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-headline">{category.name}</h3>
                    <Badge className="bg-secondary text-secondary-foreground font-normal">
                      {category.count} items
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <LayoutGrid className="h-3 w-3" />
                      Subcategories ({category.subcategories.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {category.subcategories.map(sub => (
                        <div key={sub} className="text-[11px] px-2 py-0.5 bg-muted rounded-full flex items-center gap-1 group/sub cursor-default">
                          {sub}
                          <ChevronRight className="h-2 w-2 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                        </div>
                      ))}
                      <Link href={`/categories/sub/new?parent=${category.name}`} className="text-[11px] px-2 py-0.5 border border-dashed border-muted-foreground/30 rounded-full text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1">
                        <Plus className="h-2 w-2" /> Add
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Link href="/categories/new" className="h-full min-h-[200px] border-dashed bg-transparent hover:bg-muted/50 transition-colors flex flex-col gap-2 items-center justify-center rounded-lg border">
            <Plus className="h-6 w-6 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">Add New Category</span>
          </Link>
        </div>
      </div>
    </>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}
