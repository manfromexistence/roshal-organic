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

const couponsData = [
  {
    id: "1",
    code: "FIRST20",
    description: "First order discount",
    discount: "20%",
    minOrder: "৳500",
    maxDiscount: "৳100",
    expiry: "2024-12-31",
    status: "Active",
    usage: 45,
  },
  {
    id: "2",
    code: "SUMMER10",
    description: "Summer special offer",
    discount: "10%",
    minOrder: "৳1000",
    maxDiscount: "৳200",
    expiry: "2024-06-30",
    status: "Active",
    usage: 128,
  },
  {
    id: "3",
    code: "ORGANIC15",
    description: "Organic products discount",
    discount: "15%",
    minOrder: "৳800",
    maxDiscount: "৳150",
    expiry: "2024-09-30",
    status: "Inactive",
    usage: 234,
  },
];

export default function CouponsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 min-w-0">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground">
            Manage discount coupons and promotional codes
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Max Discount</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {couponsData.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium font-mono">
                    {coupon.code}
                  </TableCell>
                  <TableCell>{coupon.description}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{coupon.discount}</Badge>
                  </TableCell>
                  <TableCell>{coupon.minOrder}</TableCell>
                  <TableCell>{coupon.maxDiscount}</TableCell>
                  <TableCell>{coupon.expiry}</TableCell>
                  <TableCell>{coupon.usage}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        coupon.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {coupon.status}
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

      {/* Add New Coupon Form */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Coupon</CardTitle>
            <CardDescription>Create a new discount coupon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input id="code" placeholder="FIRST20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="First order discount" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input id="discount" type="number" placeholder="20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-order">Minimum Order Amount</Label>
                <Input id="min-order" placeholder="৳500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-discount">Maximum Discount</Label>
                <Input id="max-discount" placeholder="৳100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Coupon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
