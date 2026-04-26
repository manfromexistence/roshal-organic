import { eq } from "drizzle-orm";
import { ArrowLeft, Calendar, DollarSign, FileText, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { changeOrders } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Change Order Details | Quadra EDMS",
};

export default async function ChangeOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db
    .select()
    .from(changeOrders)
    .where(eq(changeOrders.id, id));
  const changeOrder = result[0];

  if (!changeOrder) {
    notFound();
  }

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/change-orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Change Orders
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Change Order Details</CardTitle>
            <CardDescription>
              Change Order Number: {changeOrder.changeOrderNumber}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Change Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Change Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Approved At</p>
                <p className="text-sm text-muted-foreground">
                  {changeOrder.approvedAt
                    ? new Date(changeOrder.approvedAt).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Approved By</p>
                <p className="text-sm text-muted-foreground">
                  {changeOrder.approvedBy || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Approval Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {changeOrder.approvalStatus}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Original Contract Value</p>
                <p className="text-sm text-muted-foreground">
                  {changeOrder.originalContractValue
                    ? `$${(changeOrder.originalContractValue / 100).toLocaleString()}`
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Change Value</p>
                <p className="text-sm text-muted-foreground">
                  {changeOrder.changeValue
                    ? `$${(changeOrder.changeValue / 100).toLocaleString()}`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reason */}
        {changeOrder.reason && (
          <Card>
            <CardHeader>
              <CardTitle>Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {changeOrder.reason}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
