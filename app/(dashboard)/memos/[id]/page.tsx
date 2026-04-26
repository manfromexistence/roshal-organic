import { eq } from "drizzle-orm";
import { ArrowLeft, Calendar, FileText, User } from "lucide-react";
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
import { memos } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Memo Details | Quadra EDMS",
};

export default async function MemoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db.select().from(memos).where(eq(memos.id, id));
  const memo = result[0];

  if (!memo) {
    notFound();
  }

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/memos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Memos
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{memo.subject}</CardTitle>
            <CardDescription>Memo Number: {memo.memoNumber}</CardDescription>
          </CardHeader>
        </Card>

        {/* Memo Details */}
        <Card>
          <CardHeader>
            <CardTitle>Memo Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">From</p>
                <p className="text-sm text-muted-foreground">
                  {memo.from || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">To</p>
                <p className="text-sm text-muted-foreground">
                  {memo.to || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {memo.date
                    ? new Date(memo.date).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {memo.category || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {memo.status}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Urgent</p>
                <p className="text-sm text-muted-foreground">
                  {memo.urgent ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {memo.content && (
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {memo.content}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
