import { eq, inArray } from "drizzle-orm";
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
import { technicalQueries, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Technical Query Details | Quadra EDMS",
};

export default async function TechnicalQueryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db
    .select()
    .from(technicalQueries)
    .where(eq(technicalQueries.id, id));
  const query = result[0];

  if (!query) {
    notFound();
  }

  const relatedUserIds = [query.raisedBy, query.assignedTo].filter(Boolean);
  const relatedUsers =
    relatedUserIds.length > 0
      ? await db
          .select({
            id: users.id,
            name: users.name,
          })
          .from(users)
          .where(inArray(users.id, relatedUserIds))
      : [];
  const userNameById = new Map(
    relatedUsers.map((user) => [user.id, user.name]),
  );

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/technical-queries">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Technical Queries
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{query.subject}</CardTitle>
            <CardDescription>TQ Number: {query.queryNumber}</CardDescription>
          </CardHeader>
        </Card>

        {/* Query Details */}
        <Card>
          <CardHeader>
            <CardTitle>Query Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {query.date
                    ? new Date(query.date).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Raised By</p>
                <p className="text-sm text-muted-foreground">
                  {userNameById.get(query.raisedBy) ||
                    query.raisedBy ||
                    "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assigned To</p>
                <p className="text-sm text-muted-foreground">
                  {userNameById.get(query.assignedTo) ||
                    query.assignedTo ||
                    "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {query.dueDate
                    ? new Date(query.dueDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Discipline</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {query.discipline || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Priority</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {query.priority || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {query.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {query.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{query.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Response */}
        {query.response && (
          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {query.response}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
