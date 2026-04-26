import { Database, Images, ShieldCheck, UploadCloud } from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Connections | Quadra EDMS",
};

export default async function ConnectionsPage() {
  const services = [
    {
      title: "Database",
      description: "Primary Turso / libSQL connection for EDMS records.",
      configured: Boolean(process.env.DATABASE_URL),
      icon: Database,
    },
    {
      title: "Authentication",
      description:
        "Better Auth runtime for dashboard sign-in and sign-out flows.",
      configured: Boolean(process.env.BETTER_AUTH_SECRET),
      icon: ShieldCheck,
    },
    {
      title: "Document uploads",
      description:
        "File pipeline used by the EDMS upload and bulk import flows.",
      configured: true,
      icon: UploadCloud,
    },
    {
      title: "Image uploads",
      description: "Image storage used for avatar and dashboard media uploads.",
      configured: Boolean(process.env.IMGBB_API_KEY),
      icon: Images,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Connections
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Current runtime integrations and service availability for the
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
                <Badge variant={service.configured ? "secondary" : "outline"}>
                  {service.configured ? "Configured" : "Not configured"}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>External connectors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            No finance, ERP, or third-party account connectors are enabled in
            this workspace.
          </p>
          <p>
            The dashboard is currently operating with its built-in EDMS services
            only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
