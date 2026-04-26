import { eq } from "drizzle-orm";
import { ArrowLeft, Calendar, FileText, Mail, User } from "lucide-react";
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
import { letters } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Letter Details | Quadra EDMS",
};

export default async function LetterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db.select().from(letters).where(eq(letters.id, id));
  const letter = result[0];

  if (!letter) {
    notFound();
  }

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/letters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Letters
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{letter.subject}</CardTitle>
            <CardDescription>
              Letter Number: {letter.letterNumber}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Letter Details */}
        <Card>
          <CardHeader>
            <CardTitle>Letter Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">From</p>
                <p className="text-sm text-muted-foreground">
                  {letter.from || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">To</p>
                <p className="text-sm text-muted-foreground">
                  {letter.to || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {letter.date
                    ? new Date(letter.date).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Direction</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {letter.direction || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {letter.category || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {letter.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reference */}
        {letter.ref && (
          <Card>
            <CardHeader>
              <CardTitle>Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{letter.ref}</p>
            </CardContent>
          </Card>
        )}

        {/* Author */}
        <Card>
          <CardHeader>
            <CardTitle>Author</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {letter.author || "Not specified"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
