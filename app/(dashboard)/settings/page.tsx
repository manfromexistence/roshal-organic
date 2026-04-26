import { desc } from "drizzle-orm";
import {
  ArrowRight,
  BellRing,
  Cable,
  Code2,
  FolderKanban,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { organizations, projects, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Settings | Quadra EDMS",
};

export default async function SettingsPage() {
  const [workspaceRows, memberRows, projectRows] = await Promise.all([
    db
      .select({
        id: organizations.id,
        name: organizations.name,
        email: organizations.email,
        createdAt: organizations.createdAt,
      })
      .from(organizations)
      .orderBy(desc(organizations.createdAt))
      .limit(1),
    db.select({ id: users.id }).from(users),
    db.select({ id: projects.id }).from(projects),
  ]);

  const workspace = workspaceRows[0];

  const cards = [
    {
      href: "/settings/accounts",
      title: "Connections",
      description: "Check database, uploads, and workspace integration status.",
      icon: Cable,
    },
    {
      href: "/settings/members",
      title: "Members",
      description:
        "Review the current users, roles, and organization coverage.",
      icon: Users,
    },
    {
      href: "/settings/notifications",
      title: "Notifications",
      description:
        "Tune inbox preferences for workflow and transmittal activity.",
      icon: BellRing,
    },
    {
      href: "/settings/developer",
      title: "Developer",
      description:
        "Inspect runtime capabilities, endpoints, and audit signals.",
      icon: Code2,
    },
    {
      href: "/theme",
      title: "Theme Editor",
      description:
        "Open the live theme editor for dashboard branding and tokens.",
      icon: FolderKanban,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Settings
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Workspace configuration, integration status, and operator controls
            for the active Quadra EDMS instance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {memberRows.length} workspace member
            {memberRows.length === 1 ? "" : "s"}
          </Badge>
          <Badge variant="secondary">
            {projectRows.length} project{projectRows.length === 1 ? "" : "s"}
          </Badge>
        </div>
      </header>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Workspace profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Workspace
            </p>
            <p className="text-base font-medium">
              {workspace?.name || "Quadra EDMS"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </p>
            <p className="text-base font-medium">
              {workspace?.email || "No workspace contact saved"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Workspace ID
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              {workspace?.id || "local-workspace"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.href}
              className="border-border bg-card shadow-sm transition-colors hover:bg-accent/30"
            >
              <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
                <div className="space-y-3">
                  <div className="rounded-md border border-border bg-muted/40 p-2 text-muted-foreground w-fit">
                    <Icon className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-medium">{card.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-between"
                >
                  <Link href={card.href}>
                    Open
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
