import { ArrowRight, History } from "lucide-react";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import { Suspense } from "react";
import { CollapsibleSummary } from "@/components/collapsible-summary";
import { AuditFilters } from "@/components/edms/audit-filters";
import { EdmsDataState } from "@/components/edms/data-state";
import { EdmsMetricCard } from "@/components/edms/metric-card";
import { PrintButton } from "@/components/edms/print-button";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuditPageData } from "@/lib/edms/derived-pages";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Audit Trail | Quadra EDMS",
  description:
    "Live audit trail for EDMS project, document, workflow, and transmittal activity.",
};

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-500",
  created: "bg-emerald-500",
  update: "bg-blue-500",
  updated: "bg-blue-500",
  upload: "bg-blue-500",
  uploaded: "bg-blue-500",
  assign: "bg-amber-500",
  assigned: "bg-amber-500",
  approve: "bg-emerald-500",
  approved: "bg-emerald-500",
  send: "bg-rose-500",
  sent: "bg-rose-500",
  issue: "bg-slate-500",
  issued: "bg-slate-500",
  project_created: "bg-emerald-500",
  project_update: "bg-blue-500",
  document_uploaded: "bg-blue-500",
  document_submitted: "bg-blue-400",
  document_approved: "bg-emerald-500",
  workflow_created: "bg-amber-500",
  workflow_assigned: "bg-amber-500",
  transmittal_sent: "bg-rose-500",
  transmittal_received: "bg-rose-400",
};

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; entityType?: string }>;
}) {
  const sessionUser = await getRequiredDashboardSessionUser();
  const params = await searchParams;
  const auditData = await getAuditPageData(sessionUser, params);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8">
        <CollapsibleSummary>
          <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {auditData.metrics.map((metric) => (
              <div key={metric.label}>
                <EdmsMetricCard metric={metric} />
              </div>
            ))}
          </div>
        </CollapsibleSummary>

        <div className="flex flex-col gap-4 print:hidden md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Audit Trail
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Immutable activity stream from the live EDMS workspace. Audit
                records are pulled from the activity log and filtered to the
                active project scope.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PrintButton label="Export to PDF" variant="secondary" />
            <Button variant="outline" asChild>
              <Link href="/workflows">
                Workflow queue
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/reports">
                Reports
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <EdmsDataState
          isUsingFallbackData={auditData.isUsingFallbackData}
          message={auditData.statusMessage}
        />

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">
                Loading audit trail...
              </div>
            }
          >
            <section className="flex flex-col gap-4">
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="pt-6">
                  <AuditFilters
                    initialQuery={params.query}
                    initialEntityType={params.entityType}
                  />
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="size-4" />
                    Audit log
                  </CardTitle>
                  <CardDescription>
                    {auditData.entries.length} event
                    {auditData.entries.length !== 1 ? "s" : ""} shown
                    {params.query || params.entityType ? " (filtered)." : "."}{" "}
                    Immutable log of all document and configuration actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {auditData.entries.length === 0 ? (
                    <div className="px-6 pb-6 pt-2 text-sm text-muted-foreground">
                      No audit entries match your filter criteria.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {auditData.entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex gap-3 px-6 py-3 transition-colors hover:bg-accent/50"
                        >
                          <div className="min-w-[150px] shrink-0">
                            <span className="font-mono text-[10.5px] text-muted-foreground">
                              {entry.timestamp}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-1.5 shrink-0 rounded-full ${
                                  ACTION_COLORS[entry.action] ??
                                  "bg-muted-foreground"
                                }`}
                              />
                              <p className="text-sm">
                                <span className="font-medium">
                                  {entry.actor}
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  - {entry.actionLabel}
                                </span>
                              </p>
                            </div>
                            <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                              {entry.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Activity timeline</CardTitle>
                  <CardDescription>
                    Condensed chronological view of the latest visible audit
                    events.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {auditData.entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No timeline events available.
                    </p>
                  ) : (
                    <div className="relative">
                      <div className="absolute bottom-0 left-[11px] top-0 w-px bg-border" />
                      <div className="flex flex-col gap-0">
                        {auditData.entries.slice(0, 6).map((entry) => (
                          <div
                            key={`timeline-${entry.id}`}
                            className="relative flex gap-4 pb-5 last:pb-0"
                          >
                            <div
                              className={`relative z-10 mt-1 flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 border-background ${
                                ACTION_COLORS[entry.action] ??
                                "bg-muted-foreground"
                              }`}
                            />
                            <div className="min-w-0 flex-1 pt-0.5">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium">
                                    <span>{entry.actor}</span>{" "}
                                    <span className="font-normal text-muted-foreground">
                                      {entry.actionLabel.toLowerCase()}
                                    </span>
                                  </p>
                                  <p className="mt-0.5 text-sm text-muted-foreground">
                                    {entry.detail}
                                  </p>
                                </div>
                                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                                  {entry.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </Suspense>
        </ErrorBoundary>
      </div>
    </ScrollableContent>
  );
}
