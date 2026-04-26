import { eq } from "drizzle-orm";
import { ArrowLeft, Calendar, FileText, Tag, User } from "lucide-react";
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
import { rfis, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "RFI Details | Quadra EDMS",
};

export default async function RfiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [rfi] = await db
    .select({
      assignedToName: users.name,
      category: rfis.category,
      date: rfis.date,
      description: rfis.description,
      dueDate: rfis.dueDate,
      from: rfis.from,
      id: rfis.id,
      priority: rfis.priority,
      raisedBy: rfis.raisedBy,
      response: rfis.response,
      rfiNumber: rfis.rfiNumber,
      status: rfis.status,
      subject: rfis.subject,
    })
    .from(rfis)
    .leftJoin(users, eq(rfis.assignedTo, users.id))
    .where(eq(rfis.id, id));

  if (!rfi) {
    notFound();
  }

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/rfis">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to RFIs
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{rfi.subject}</CardTitle>
            <CardDescription>RFI Number: {rfi.rfiNumber}</CardDescription>
          </CardHeader>
        </Card>

        {/* RFI Details */}
        <Card>
          <CardHeader>
            <CardTitle>RFI Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {rfi.date
                    ? new Date(rfi.date).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">From</p>
                <p className="text-sm text-muted-foreground">
                  {rfi.from || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Raised By</p>
                <p className="text-sm text-muted-foreground">
                  {rfi.raisedBy || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assigned To</p>
                <p className="text-sm text-muted-foreground">
                  {rfi.assignedToName || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {rfi.dueDate
                    ? new Date(rfi.dueDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Priority</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {rfi.priority || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {rfi.category || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {rfi.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {rfi.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{rfi.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Response */}
        {rfi.response && (
          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {rfi.response}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
