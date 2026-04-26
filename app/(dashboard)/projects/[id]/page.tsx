import { eq } from "drizzle-orm";
import { ArrowLeft, Building2, Calendar, MapPin } from "lucide-react";
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
import { projects } from "@/lib/schema";
import { resolveImageUrls } from "@/lib/storage-utils";

export const metadata: Metadata = {
  title: "Project Details | Quadra EDMS",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db.select().from(projects).where(eq(projects.id, id));
  const project = result[0];

  if (!project) {
    notFound();
  }

  const images = resolveImageUrls(project.images);
  const firstImage = images[0];

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{project.name}</CardTitle>
            <CardDescription>
              Project Number: {project.projectNumber || "N/A"}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Image */}
          {firstImage && (
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={firstImage}
                    alt={project.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {project.location || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {project.status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {project.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Contract Details */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Contract Type</p>
              <p className="text-sm text-muted-foreground capitalize">
                {project.contractType || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Contract Number</p>
              <p className="text-sm text-muted-foreground">
                {project.contractNumber || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Contract Value</p>
              <p className="text-sm text-muted-foreground">
                {project.contractValue
                  ? `$${(project.contractValue / 100).toLocaleString()}`
                  : "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Client Name</p>
              <p className="text-sm text-muted-foreground">
                {project.clientName || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Notice to Proceed Date</p>
              <p className="text-sm text-muted-foreground">
                {project.noticeToProceedDate
                  ? new Date(project.noticeToProceedDate).toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Images */}
        {images.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Images</CardTitle>
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
                      alt={`${project.name} - Image ${index + 2}`}
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
