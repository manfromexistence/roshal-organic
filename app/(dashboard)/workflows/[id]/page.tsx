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
import { documentWorkflows } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Workflow Details | Quadra EDMS",
};

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db
    .select()
    .from(documentWorkflows)
    .where(eq(documentWorkflows.id, id));
  const workflow = result[0];

  if (!workflow) {
    notFound();
  }

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/workflows">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workflows
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {workflow.workflowName || "Workflow Details"}
            </CardTitle>
            <CardDescription>Workflow ID: {workflow.id}</CardDescription>
          </CardHeader>
        </Card>

        {/* Workflow Details */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Document ID</p>
                <p className="text-sm text-muted-foreground">
                  {workflow.documentId || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {workflow.status}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Current Step</p>
                <p className="text-sm text-muted-foreground">
                  {workflow.currentStep} / {workflow.totalSteps}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Started At</p>
                <p className="text-sm text-muted-foreground">
                  {workflow.startedAt
                    ? new Date(workflow.startedAt).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Completed At</p>
                <p className="text-sm text-muted-foreground">
                  {workflow.completedAt
                    ? new Date(workflow.completedAt).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">
                  {workflow.createdBy || "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
