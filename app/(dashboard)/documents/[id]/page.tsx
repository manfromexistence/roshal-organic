import { eq } from "drizzle-orm";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Tag,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
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

export const metadata: Metadata = {
  title: "Document Details | Quadra EDMS",
};

import { db } from "@/lib/db";
import { documents } from "@/lib/schema";
import { resolveImageUrls } from "@/lib/storage-utils";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db.select().from(documents).where(eq(documents.id, id));
  const document = result[0];

  if (!document) {
    notFound();
  }

  const images = resolveImageUrls(document.images);
  const firstImage = images[0];

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/documents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{document.title}</CardTitle>
            <CardDescription>
              Document Number: {document.documentNumber}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Document Image */}
          {firstImage && (
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={firstImage}
                    alt={document.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document Details */}
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Discipline</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {document.discipline || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {document.category || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Document Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {document.documentType || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Version</p>
                  <p className="text-sm text-muted-foreground">
                    {document.version || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Revision</p>
                  <p className="text-sm text-muted-foreground">
                    {document.revision || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Uploaded At</p>
                  <p className="text-sm text-muted-foreground">
                    {document.uploadedAt
                      ? new Date(document.uploadedAt).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Uploaded By</p>
                  <p className="text-sm text-muted-foreground">
                    {document.uploadedBy || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {document.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{document.description}</p>
            </CardContent>
          </Card>
        )}

        {/* File Information */}
        <Card>
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">File Name</p>
              <p className="text-sm text-muted-foreground">
                {document.fileName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">File Type</p>
              <p className="text-sm text-muted-foreground">
                {document.fileType || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">File Size</p>
              <p className="text-sm text-muted-foreground">
                {document.fileSize
                  ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB`
                  : "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground capitalize">
                {document.status}
              </p>
            </div>
            {document.fileUrl && (
              <Button asChild className="w-full">
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Document
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        {document.tags && (
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {document.tags.split(",").map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Images */}
        {images.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Document Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={image}
                      alt={`${document.title} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
