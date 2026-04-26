"use client";

import {
  ArrowRight,
  CheckCircle,
  Clock,
  Download,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-04-20",
      status: "delivered",
      total: "৳1,250",
      items: [
        { name: "খাঁটি মধু", quantity: 2, price: "৳৯০০" },
        { name: "ফ্রেশ দই", quantity: 1, price: "৳১২০" },
      ],
    },
    {
      id: "ORD-2024-002",
      date: "2024-04-18",
      status: "shipped",
      total: "৳৮০০",
      items: [{ name: "অর্গানিক ঘি", quantity: 1, price: "৳৮০০" }],
    },
    {
      id: "ORD-2024-003",
      date: "2024-04-15",
      status: "processing",
      total: "৳৫৫০",
      items: [{ name: "মশলা সমূহ", quantity: 2, price: "৳৫০০" }],
    },
    {
      id: "ORD-2024-004",
      date: "2024-04-10",
      status: "cancelled",
      total: "৳৪৫০",
      items: [{ name: "প্রিমিয়াম খেজুর", quantity: 1, price: "৳৪৫০" }],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-600">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-blue-600">Shipped</Badge>;
      case "processing":
        return <Badge className="bg-yellow-600">Processing</Badge>;
      case "cancelled":
        return <Badge className="bg-red-600">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="font-semibold text-sm md:text-base">
                          {order.id}
                        </span>
                      </div>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {order.date}
                      </span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      )}
                    </div>
                    <span className="font-bold text-lg">{order.total}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {orders
              .filter((order) => order.status === "processing")
              .map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold">{order.id}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {order.date}
                        </span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                      <span className="font-bold text-lg">{order.total}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="shipped" className="space-y-4">
            {orders
              .filter((order) => order.status === "shipped")
              .map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold">{order.id}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {order.date}
                        </span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                      <span className="font-bold text-lg">{order.total}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            {orders
              .filter((order) => order.status === "delivered")
              .map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold">{order.id}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {order.date}
                        </span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Link href={`/products/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Reorder
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      </div>
                      <span className="font-bold text-lg">{order.total}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {orders
              .filter((order) => order.status === "cancelled")
              .map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold">{order.id}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {order.date}
                        </span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <span className="font-bold text-base md:text-lg">
                        {order.total}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
