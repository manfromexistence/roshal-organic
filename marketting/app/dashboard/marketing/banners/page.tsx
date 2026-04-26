"use client";

import { Plus, Trash2, Upload } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const bannersData = [
  {
    id: "1",
    title: "খাঁটি স্বাদের আসল ঠিকানা",
    subtitle: "১০০% প্রাকৃতিক ও অর্গানিক খাদ্য ব্র্যান্ড",
    image: "/brand-story.jpg",
    status: "Active",
    order: 1,
  },
  {
    id: "2",
    title: "Premium Organic Products",
    subtitle: "Fresh from farm to your doorstep",
    image: "/farming.jpg",
    status: "Active",
    order: 2,
  },
  {
    id: "3",
    title: "স্বাস্থ্যকর খাবার",
    subtitle: "আপনার পরিবারের জন্য সেরা পণ্য",
    image: "/healthy-food.jpg",
    status: "Active",
    order: 3,
  },
];

export default function BannersPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 min-w-0">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Marketing Banners
          </h2>
          <p className="text-muted-foreground">
            Manage hero carousel banners for the landing page
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title (BN)</TableHead>
                <TableHead>Subtitle (BN)</TableHead>
                <TableHead>Title (EN)</TableHead>
                <TableHead>Subtitle (EN)</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bannersData.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="h-16 w-24 rounded-md overflow-hidden bg-muted">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {banner.subtitle}
                  </TableCell>
                  <TableCell>Premium Organic Products</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    Fresh from farm to your doorstep
                  </TableCell>
                  <TableCell>{banner.order}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        banner.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {banner.status}
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

      {/* Add New Banner Form */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Banner</CardTitle>
            <CardDescription>
              Add a new banner to the hero carousel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title-bn">Title (Bengali)</Label>
                <Input id="title-bn" placeholder="খাঁটি স্বাদের আসল ঠিকানা" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title-en">Title (English)</Label>
                <Input id="title-en" placeholder="Premium Organic Products" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle-bn">Subtitle (Bengali)</Label>
                <Input
                  id="subtitle-bn"
                  placeholder="১০০% প্রাকৃতিক ও অর্গানিক খাদ্য ব্র্যান্ড"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle-en">Subtitle (English)</Label>
                <Input
                  id="subtitle-en"
                  placeholder="Fresh from farm to your doorstep"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Banner Image</Label>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <span className="text-sm text-muted-foreground">
                  Recommended size: 1920x600px
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input id="order" type="number" placeholder="1" />
            </div>
            <Button>Save Banner</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
