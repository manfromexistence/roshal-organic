import { desc } from "drizzle-orm";
import {
  Activity,
  Database,
  FileSearch,
  MessagesSquare,
  UploadCloud,
} from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { activityLog, documents, transmittals } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Developer | Quadra EDMS",
};

export default async function DeveloperPage() {
  const [documentRows, transmittalRows, auditRows] = await Promise.all([
    db.select({ id: documents.id }).from(documents),
    db.select({ id: transmittals.id }).from(transmittals),
    db
      .select({ id: activityLog.id, createdAt: activityLog.createdAt })
      .from(activityLog)
      .orderBy(desc(activityLog.createdAt))
      .limit(10),
  ]);

  const services = [
    {
      title: "Database runtime",
      description:
        "Primary persistence for projects, documents, and workflow state.",
      icon: Database,
      badge: process.env.DATABASE_URL ? "Configured" : "Missing env",
    },
    {
      title: "Search API",
      description: "Route: /api/search for project and document retrieval.",
      icon: FileSearch,
      badge: "Available",
    },
    {
      title: "Chat API",
      description: "Route: /api/chat with project-aware context injection.",
      icon: MessagesSquare,
      badge: "Available",
    },
    {
      title: "Upload API",
      description: "Route: /api/edms/uploads for document file ingestion.",
      icon: UploadCloud,
      badge: "Available",
    },
    {
      title: "Audit stream",
      description: "Recent operator actions written to the activity log.",
      icon: Activity,
      badge: `${auditRows.length} recent`,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Developer
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Runtime status, endpoint coverage, and recent system activity for the
          dashboard.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <Card
              key={service.title}
              className="border-border bg-card shadow-sm"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-base">{service.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-2 text-muted-foreground">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{service.badge}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Current data footprint</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Documents
            </p>
            <p className="text-2xl font-semibold">{documentRows.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Transmittals
            </p>
            <p className="text-2xl font-semibold">{transmittalRows.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Recent audit events
            </p>
            <p className="text-2xl font-semibold">{auditRows.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
