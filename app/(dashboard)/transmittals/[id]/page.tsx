import { eq } from "drizzle-orm";
import { ArrowLeft, Calendar, FileText, Send, User } from "lucide-react";
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
import { db } from "@/lib/db";
import { transmittals } from "@/lib/schema";
import { resolveImageUrls } from "@/lib/storage-utils";

export const metadata: Metadata = {
  title: "Transmittal Details | Quadra EDMS",
};

export default async function TransmittalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db
    .select()
    .from(transmittals)
    .where(eq(transmittals.id, id));
  const transmittal = result[0];

  if (!transmittal) {
    notFound();
  }

  const images = resolveImageUrls(transmittal.images);
  const firstImage = images[0];

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/transmittals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transmittals
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{transmittal.subject}</CardTitle>
            <CardDescription>
              Transmittal Number: {transmittal.transmittalNumber}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Transmittal Image */}
          {firstImage && (
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={firstImage}
                    alt={transmittal.subject}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transmittal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Transmittal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Send className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Purpose</p>
                  <p className="text-sm text-muted-foreground uppercase">
                    {transmittal.purpose || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Sent To</p>
                  <p className="text-sm text-muted-foreground">
                    {transmittal.sentTo || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {transmittal.createdAt
                      ? new Date(transmittal.createdAt).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {transmittal.status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {transmittal.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{transmittal.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Additional Images */}
        {images.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Transmittal Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.slice(1, 5).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={image}
                      alt={`${transmittal.subject} - Image ${index + 2}`}
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
