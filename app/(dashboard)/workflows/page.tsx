import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import { Suspense } from "react";
import { CollapsibleSummary } from "@/components/collapsible-summary";
import { EdmsDataState } from "@/components/edms/data-state";
import { EdmsMetricCard } from "@/components/edms/metric-card";
import { PrintButton } from "@/components/edms/print-button";
import {
  EdmsStatusBadge,
  formatEdmsLabel,
} from "@/components/edms/status-badge";
import { WorkflowCreateSheet } from "@/components/edms/workflow-create-sheet";
import { WorkflowsDataTable } from "@/components/edms/workflows-data-table";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEdmsDashboardData } from "@/lib/edms/dashboard";
import { canManageEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { getWorkflowManagementData } from "@/lib/edms/workflows";

export const metadata: Metadata = {
  title: "Workflows | Quadra EDMS",
};

export default async function WorkflowsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const [summaryData, data] = await Promise.all([
    getEdmsDashboardData(sessionUser),
    getWorkflowManagementData(sessionUser),
  ]);
  const canManageContent = canManageEdmsContent(sessionUser.role || "user");
  const workflowStages = Array.from(
    data.steps
      .reduce(
        (map, step) => {
          const existing = map.get(step.stepNumber) || {
            stepNumber: step.stepNumber,
            label: step.stepName,
            assignedRole: step.assignedRole,
            total: 0,
            completed: 0,
            pending: 0,
            actionable: 0,
          };

          existing.total += 1;
          existing.completed += step.status === "completed" ? 1 : 0;
          existing.pending += step.status === "pending" ? 1 : 0;
          existing.actionable += step.isActionable ? 1 : 0;

          map.set(step.stepNumber, existing);
          return map;
        },
        new Map<
          number,
          {
            stepNumber: number;
            label: string;
            assignedRole: string;
            total: number;
            completed: number;
            pending: number;
            actionable: number;
          }
        >(),
      )
      .values(),
  ).sort((left, right) => left.stepNumber - right.stepNumber);

  return (
    <ScrollableContent>
      <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden px-4 sm:px-6 lg:px-8">
        <CollapsibleSummary>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
            {data.metrics.map((metric, index) => {
              const links = [
                "/workflows",
                "/documents",
                "/transmittals",
                "/notifications",
              ];
              return (
                <Link
                  key={metric.label}
                  href={links[index] || "/workflows"}
                  className="block h-full"
                >
                  <div className="group cursor-pointer transition-all hover:scale-[1.02] h-full">
                    <EdmsMetricCard metric={metric} />
                  </div>
                </Link>
              );
            })}
          </div>
        </CollapsibleSummary>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Workflow queue
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Multi-step review visibility for PMC, client, and vendor actions
                with comprehensive workflow tracking and management.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PrintButton label="Export to PDF" variant="secondary" />
            {canManageContent ? (
              <WorkflowCreateSheet
                documents={data.documents}
                assignees={data.assignees}
              />
            ) : null}
            <Button variant="outline" asChild>
              <Link href="/documents">
                Source documents
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/transmittals">
                Transmittals
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <EdmsDataState
          isUsingFallbackData={data.isUsingFallbackData}
          message={data.statusMessage}
        />

        {workflowStages.length ? (
          <Card className="min-w-0 overflow-hidden border-border bg-card shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Workflow route</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="flex min-w-max items-stretch gap-3 pb-1">
                {workflowStages.map((stage, index) => {
                  const isDone =
                    stage.completed === stage.total && stage.total > 0;
                  const isActive = !isDone && stage.pending > 0;

                  return (
                    <div
                      key={stage.stepNumber}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={[
                          "min-w-[180px] rounded-md border px-4 py-4",
                          isDone &&
                            "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                          isActive &&
                            "border-primary/40 bg-primary/10 text-foreground",
                          !isDone &&
                            !isActive &&
                            "border-border bg-muted/30 text-muted-foreground",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                          Step {stage.stepNumber}
                        </div>
                        <div className="mt-2 text-sm font-semibold">
                          {stage.label}
                        </div>
                        <div className="mt-1 text-xs capitalize text-muted-foreground">
                          {formatEdmsLabel(stage.assignedRole)}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                          <span className="rounded-full border border-border px-2 py-1">
                            {stage.total} total
                          </span>
                          <span className="rounded-full border border-border px-2 py-1">
                            {stage.completed} complete
                          </span>
                          <span className="rounded-full border border-border px-2 py-1">
                            {stage.pending} pending
                          </span>
                          {stage.actionable ? (
                            <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-primary">
                              {stage.actionable} mine
                            </span>
                          ) : null}
                        </div>
                      </div>
                      {index < workflowStages.length - 1 ? (
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">
                Loading workflows...
              </div>
            }
          >
            <section className="grid min-w-0 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className="min-w-0 border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Workflow steps</CardTitle>
                </CardHeader>
                <CardContent className="min-w-0 overflow-hidden px-6">
                  {data.steps.length === 0 ? (
                    <div className="pb-6 text-sm text-muted-foreground">
                      No workflow steps found.
                    </div>
                  ) : (
                    <WorkflowsDataTable steps={data.steps} />
                  )}
                </CardContent>
              </Card>

              <Card className="min-w-0 border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Alert stream</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {summaryData.notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No notifications available.
                    </p>
                  ) : (
                    summaryData.notifications.map((item) => (
                      <Link
                        key={item.id}
                        href={item.actionUrl || "/notifications"}
                        className="block"
                      >
                        <div className="group cursor-pointer border border-border bg-card p-4 transition-all hover:bg-accent hover:shadow-md">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium group-hover:text-primary">
                                {item.title}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground line-clamp-2">
                                {item.message}
                              </p>
                            </div>
                            {!item.isRead ? (
                              <EdmsStatusBadge status="unread" />
                            ) : null}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatEdmsLabel(item.type)}</span>
                            {(sessionUser.role || "user") === "admin" && (
                              <span>{item.projectName}</span>
                            )}
                            <span>{item.createdLabel}</span>
                          </div>
                        </div>
                      </Link>
                    ))
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
