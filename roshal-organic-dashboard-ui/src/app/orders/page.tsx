"use client"

import * as React from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  MoreVertical, 
  ExternalLink, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Clock,
  ArrowRight
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { format, isWithinInterval, startOfDay, endOfDay, subDays, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

// Enhanced mock data with the new RO-YYMMDD123 system
const initialOrders = [
  { id: "RO-231024101", customer: "Alice Johnson", mobile: "01712345678", date: "2023-10-24", total: 84.50, status: "Delivered", items: 4, paymentMethod: "Card", isPaid: true },
  { id: "RO-231025102", customer: "Bob Smith", mobile: "01887654321", date: "2023-10-25", total: 126.20, status: "Processing", items: 7, paymentMethod: "bKash", isPaid: true },
  { id: "RO-231025103", customer: "Charlie Brown", mobile: "01911223344", date: "2023-10-25", total: 42.00, status: "Shipped", items: 2, paymentMethod: "Nagad", isPaid: true },
  { id: "RO-231026104", customer: "Diana Prince", mobile: "01555667788", date: "2023-10-26", total: 210.15, status: "Pending", items: 12, paymentMethod: "COD", isPaid: false },
  { id: "RO-231026105", customer: "Ethan Hunt", mobile: "01666778899", date: "2023-10-26", total: 12.99, status: "Cancelled", items: 1, paymentMethod: "Nagad", isPaid: false },
  { id: "RO-250212106", customer: "Fiona Gallagher", mobile: "01722334455", date: new Date().toISOString().split('T')[0], total: 350.00, status: "Processing", items: 3, paymentMethod: "bKash", isPaid: true },
  { id: "RO-250212107", customer: "George Miller", mobile: "01899887766", date: new Date().toISOString().split('T')[0], total: 55.20, status: "Pending", items: 2, paymentMethod: "COD", isPaid: false },
]

export default function OrdersPage() {
  const { toast } = useToast()
  
  // State for filters
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [paymentFilter, setPaymentFilter] = React.useState("all")
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isAllTime, setIsAllTime] = React.useState(true)

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Order ${orderId} has been marked as ${newStatus}.`,
    })
  }

  const handleCancelOrder = (orderId: string) => {
    toast({
      variant: "destructive",
      title: "Order Cancelled",
      description: `Order ${orderId} has been successfully cancelled.`,
    })
  }

  const handleViewDetails = (orderId: string) => {
    toast({
      title: "Order Details",
      description: `Opening full order history and manifest for ${orderId}...`,
    })
  }

  // Filter logic
  const filteredOrders = React.useMemo(() => {
    return initialOrders.filter((order) => {
      // Search by ID or Mobile
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.mobile.includes(searchTerm)
      
      // Filter by Status
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      
      // Filter by Payment Method
      const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter
      
      // Filter by Date Range
      let matchesDate = true
      if (!isAllTime && dateRange.from && dateRange.to) {
        const orderDate = parseISO(order.date)
        matchesDate = isWithinInterval(orderDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to),
        })
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate
    })
  }, [searchTerm, statusFilter, paymentFilter, dateRange, isAllTime])

  // Summary Card Calculations
  const totals = React.useMemo(() => {
    return filteredOrders.reduce((acc, order) => {
      if (order.isPaid) {
        acc.paid += order.total
      } else {
        acc.unpaid += order.total
      }
      return acc
    }, { paid: 0, unpaid: 0 })
  }, [filteredOrders])

  return (
    <>
      <DashboardHeader title="Order Processing" />
      <div className="p-6 space-y-6">
        
        {/* Date Range & Quick Presets */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal border-none shadow-sm bg-card",
                    !dateRange.from && "text-muted-foreground"
                  )}
                  onClick={() => setIsAllTime(false)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isAllTime ? (
                    "All Time"
                  ) : dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range: any) => setDateRange(range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button 
              variant={isAllTime ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => {
                setIsAllTime(true)
                setDateRange({ from: undefined, to: undefined })
              }}
            >
              All Time
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setIsAllTime(false)
                setDateRange({ from: subDays(new Date(), 7), to: new Date() })
              }}
            >
              Last 7 Days
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} orders
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Paid Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-primary-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">৳{totals.paid.toLocaleString()}</div>
              <p className="text-xs text-primary-foreground/80 mt-1">Confirmed revenue for selection</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-orange-50 dark:bg-orange-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Unpaid Amount</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline text-orange-600 dark:text-orange-400">
                ৳{totals.unpaid.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Pending collection (mostly COD)</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search Bar */}
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order # or Mobile..."
                  className="pl-9 bg-muted/30 border-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-muted/30 border-none">
                    <Filter className="h-3 w-3 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-[180px] bg-muted/30 border-none">
                    <DollarSign className="h-3 w-3 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="bKash">bKash</SelectItem>
                    <SelectItem value="Nagad">Nagad</SelectItem>
                    <SelectItem value="COD">COD</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setPaymentFilter("all")
                    setIsAllTime(true)
                  }}
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[140px]">Order ID</TableHead>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-primary">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">{order.customer}</span>
                          <span className="text-xs text-muted-foreground">{order.mobile}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{order.paymentMethod}</span>
                          <Badge variant="outline" className={cn(
                            "w-fit text-[10px] px-1.5 py-0 h-4 mt-1",
                            order.isPaid ? "bg-primary/10 text-primary border-primary/20" : "bg-orange-100 text-orange-700 border-orange-200"
                          )}>
                            {order.isPaid ? "Paid" : "Unpaid"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{order.date}</TableCell>
                      <TableCell className="font-semibold">৳{order.total}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "border-none px-2.5",
                            order.status === "Delivered" ? "bg-primary/10 text-primary" :
                            order.status === "Processing" ? "bg-accent/20 text-accent-foreground" :
                            order.status === "Cancelled" ? "bg-destructive/10 text-destructive" :
                            order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                            "bg-muted text-muted-foreground"
                          )}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleViewDetails(order.id)}
                            title="View Details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Order Management</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                                View Full Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "Processing")}>
                                    <Package className="mr-2 h-4 w-4" /> Processing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "Shipped")}>
                                    <Truck className="mr-2 h-4 w-4" /> Shipped
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "Delivered")}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Delivered
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No orders found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
