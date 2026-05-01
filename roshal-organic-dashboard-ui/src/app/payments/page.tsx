"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Wallet, Banknote, Landmark, CheckCircle2, Clock } from "lucide-react"

const transactions = [
  { id: "TXN-001", orderId: "RO-231024101", method: "Credit Card", amount: "$84.50", date: "2023-10-24 14:23", status: "Success", type: CreditCard },
  { id: "TXN-002", orderId: "RO-231025102", method: "PayPal", amount: "$126.20", date: "2023-10-25 09:12", status: "Success", type: Wallet },
  { id: "TXN-003", orderId: "RO-231025103", method: "Bank Transfer", amount: "$42.00", date: "2023-10-25 11:45", status: "Pending", type: Landmark },
  { id: "TXN-004", orderId: "RO-231026104", method: "Cash on Delivery", amount: "$210.15", date: "2023-10-26 16:30", status: "Awaiting", type: Banknote },
  { id: "TXN-005", orderId: "RO-231026105", method: "Credit Card", amount: "$12.99", date: "2023-10-26 18:05", status: "Failed", type: CreditCard },
]

export default function PaymentsPage() {
  return (
    <>
      <DashboardHeader title="Payment Tracking" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Daily Sales</CardTitle>
              <div className="text-3xl font-bold font-headline">$1,240.00</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs opacity-75">+12.5% from yesterday</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <div className="text-3xl font-bold font-headline">$425.50</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">8 transactions waiting</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
              <div className="text-3xl font-bold font-headline text-destructive">$12.99</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">1 failed today</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Recent Transactions</CardTitle>
            <CardDescription>A list of recent payments across your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                    <TableCell className="font-medium">{txn.orderId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <txn.type className="h-4 w-4 text-muted-foreground" />
                        {txn.method}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{txn.amount}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{txn.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {txn.status === "Success" ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : txn.status === "Pending" || txn.status === "Awaiting" ? (
                          <Clock className="h-4 w-4 text-amber-500" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-destructive" />
                        )}
                        <span className="text-sm">{txn.status}</span>
                      </div>
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
