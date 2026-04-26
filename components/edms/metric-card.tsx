import {
  BellRing,
  Building2,
  FileStack,
  GitPullRequestArrow,
  type LucideIcon,
  Send,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardMetric } from "@/lib/edms/dashboard";
import { cn } from "@/lib/utils";

const ICONS: Record<DashboardMetric["icon"], LucideIcon> = {
  projects: Building2,
  documents: FileStack,
  reviews: GitPullRequestArrow,
  transmittals: Send,
  notifications: BellRing,
};

const SURFACE_STYLES: Record<DashboardMetric["tone"], string> = {
  amber: "border-border bg-card transition-colors hover:bg-accent/30",
  blue: "border-border bg-card transition-colors hover:bg-accent/30",
  emerald: "border-border bg-card transition-colors hover:bg-accent/30",
  rose: "border-border bg-card transition-colors hover:bg-accent/30",
};

const ICON_SURFACES: Record<DashboardMetric["tone"], string> = {
  amber: "border-border bg-muted text-foreground",
  blue: "border-border bg-muted text-foreground",
  emerald: "border-border bg-muted text-foreground",
  rose: "border-border bg-muted text-foreground",
};

export function EdmsMetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = ICONS[metric.icon];

  return (
    <Card
      className={cn(
        "relative h-full min-w-0 overflow-hidden rounded-lg shadow-sm",
        SURFACE_STYLES[metric.tone],
      )}
    >
      <CardHeader className="min-w-0 gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <CardDescription className="text-[11px] font-semibold tracking-[0.22em] uppercase">
              {metric.label}
            </CardDescription>
            <CardTitle className="text-3xl tracking-tight">
              {metric.value}
            </CardTitle>
          </div>
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center border",
              ICON_SURFACES[metric.tone],
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-1 items-start pt-0">
        <p className="text-sm leading-6 text-muted-foreground">
          {metric.description}
        </p>
      </CardContent>
    </Card>
  );
}
