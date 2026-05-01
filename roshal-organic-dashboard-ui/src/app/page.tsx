"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package, 
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  DollarSign,
  Layers,
  Clock
} from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Today's Sales",
    value: "$1,240.00",
    change: "+12.5% from yesterday",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "New Orders",
    value: "2,350",
    change: "+180.1% from last month",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "Pending Orders",
    value: "18",
    change: "4 priority",
    trend: "up",
    icon: Clock,
  },
  {
    title: "Active Users",
    value: "12,234",
    change: "+19% from last month",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Products",
    value: "1,200",
    change: "-4.2% from last month",
    trend: "down",
    icon: Package,
  },
  {
    title: "Low Stock Items",
    value: "12",
    change: "Requires attention",
    trend: "down",
    icon: AlertCircle,
  },
  {
    title: "Total Categories",
    value: "12",
    change: "6 Main, 6 Sub",
    trend: "up",
    icon: Layers,
  },
]

const salesData = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 3200 },
  { name: "Apr", total: 4500 },
  { name: "May", total: 3800 },
  { name: "Jun", total: 5200 },
]

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-sm border-none bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-primary" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Revenue Growth</CardTitle>
              <CardDescription>Sales performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))', opacity: 0.4}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === salesData.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Recent Orders</CardTitle>
              <CardDescription>Latest customer transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center font-semibold text-xs text-accent-foreground">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Customer {i}</p>
                      <p className="text-xs text-muted-foreground">customer{i}@example.com</p>
                    </div>
                    <div className="font-medium text-sm">+$250.00</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
