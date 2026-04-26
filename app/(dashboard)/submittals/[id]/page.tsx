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
import { submittals } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Submittal Details | Quadra EDMS",
};

export default async function SubmittalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db
    .select()
    .from(submittals)
    .where(eq(submittals.id, id));
  const submittal = result[0];

  if (!submittal) {
    notFound();
  }

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/submittals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submittals
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Submittal Details</CardTitle>
            <CardDescription>
              Submittal Number: {submittal.submittalNumber}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Submittal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Submittal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Submitted At</p>
                <p className="text-sm text-muted-foreground">
                  {submittal.submittedAt
                    ? new Date(submittal.submittedAt).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {submittal.dueDate
                    ? new Date(submittal.dueDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Submitted By</p>
                <p className="text-sm text-muted-foreground">
                  {submittal.submittedBy || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Reviewed By</p>
                <p className="text-sm text-muted-foreground">
                  {submittal.reviewedBy || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Reviewed At</p>
                <p className="text-sm text-muted-foreground">
                  {submittal.reviewedAt
                    ? new Date(submittal.reviewedAt).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {submittal.type || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Specification Section</p>
                <p className="text-sm text-muted-foreground">
                  {submittal.specificationSection || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Revision</p>
                <p className="text-sm text-muted-foreground">
                  {submittal.revision || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Review Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {submittal.reviewStatus || "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
