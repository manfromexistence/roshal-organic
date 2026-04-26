import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { LinkDocumentsButton } from "@/components/edms/link-documents-button";
import { ScheduleSyncButton } from "@/components/edms/schedule-sync-button";
import { ErrorFallback } from "@/components/error-fallback";
import { ScheduleTable } from "@/components/schedule-table";
import { ScrollableContent } from "@/components/scrollable-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getDocuments } from "@/lib/edms/documents";
import { getSchedulePageData } from "@/lib/edms/schedule";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Schedule & Progress | Quadra EDMS",
  description:
    "Integrated view of the project schedule merged with the document register.",
};

const PHASE_COLORS = {
  engineering: "bg-blue-600",
  procurement: "bg-amber-600",
  construction: "bg-emerald-700",
  commissioning: "bg-red-600",
};

const PHASE_LABELS = {
  engineering: "Engineering",
  procurement: "Procurement",
  construction: "Construction",
  commissioning: "Commissioning",
};

function buildMonthLabels(projectStart: string, projectEnd: string) {
  const start = new Date(projectStart);
  const end = new Date(projectEnd);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  }

  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);
  const labels: string[] = [];

  while (current <= last && labels.length < 24) {
    labels.push(
      current.toLocaleString([], {
        month: "short",
      }),
    );
    current.setMonth(current.getMonth() + 1);
  }

  return labels.length > 0
    ? labels
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
}

function calculatePosition(
  startDate: string,
  endDate: string,
  projectStart: string,
  projectEnd: string,
) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const rangeStart = new Date(projectStart);
  const rangeEnd = new Date(projectEnd);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    Number.isNaN(rangeStart.getTime()) ||
    Number.isNaN(rangeEnd.getTime())
  ) {
    return { leftPct: 0, widthPct: 100 };
  }

  const totalDays = Math.max(
    1,
    Math.ceil(
      (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  const startDay = Math.max(
    0,
    Math.floor(
      (start.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  const endDay = Math.max(
    startDay + 1,
    Math.floor((end.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return {
    leftPct: (startDay / totalDays) * 100,
    widthPct: Math.max(((endDay - startDay) / totalDays) * 100, 1.5),
  };
}

export default async function SchedulePage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-4 p-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Schedule & Progress
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects were found for your account.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  return (
    <ScrollableContent>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              Loading schedule...
            </div>
          }
        >
          <ScheduleContent projectId={projectId} />
        </Suspense>
      </ErrorBoundary>
    </ScrollableContent>
  );
}

async function ScheduleContent({ projectId }: { projectId: string }) {
  const scheduleData = await getSchedulePageData(projectId);
  const monthLabels = buildMonthLabels(
    scheduleData.projectStart,
    scheduleData.projectEnd,
  );

  const activityCount = scheduleData.activities.length;
  const totalPlanned = activityCount
    ? scheduleData.activities.reduce(
        (sum, activity) => sum + activity.planned,
        0,
      ) / activityCount
    : 0;
  const totalActual = activityCount
    ? scheduleData.activities.reduce(
        (sum, activity) => sum + activity.actual,
        0,
      ) / activityCount
    : 0;
  const variance = totalActual - totalPlanned;
  const totalLinkedDocs = scheduleData.activities.reduce(
    (sum, activity) => sum + activity.linkedDocs.length,
    0,
  );

  const activities = scheduleData.activities.map((activity) => ({
    id: activity.id,
    name: activity.name,
    wbs: activity.wbs,
  }));

  const documents = await getDocuments(projectId);
  const transformedDocuments = documents.map((doc) => ({
    code: doc.documentNumber,
    title: doc.title,
    rev: doc.revision || "",
  }));

  return (
    <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Schedule & Progress
            </h1>
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              Integrated view of the project schedule merged with the document
              register. Link deliverables to WBS activities for earned-value
              tracking.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ScheduleSyncButton projectId={projectId} />
          <LinkDocumentsButton
            activities={activities}
            documents={transformedDocuments}
            projectId={projectId}
          />
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-1 border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0 bg-card p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Schedule Source
          </div>
          <div className="mt-1.5 text-base font-medium font-mono">
            Primavera P6
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Last sync: {scheduleData.lastSync}
          </div>
        </div>
        <div className="min-w-0 bg-card p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Planned Progress
          </div>
          <div className="text-3xl font-normal font-serif">
            {totalPlanned.toFixed(1)}
            <span className="text-base">%</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">As of today</div>
        </div>
        <div className="min-w-0 bg-card p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Actual Progress
          </div>
          <div className="text-3xl font-normal font-serif">
            {totalActual.toFixed(1)}
            <span className="text-base">%</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Badge
              variant={variance >= 0 ? "default" : "destructive"}
              className="font-mono text-[10px]"
            >
              {variance >= 0 ? "+" : ""}
              {variance.toFixed(1)}%
            </Badge>
            vs plan
          </div>
        </div>
        <div className="min-w-0 bg-card p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Linked Documents
          </div>
          <div className="text-3xl font-normal font-serif">
            {totalLinkedDocs}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Across {scheduleData.activities.length} activities
          </div>
        </div>
      </div>

      <Card className="min-w-0 overflow-hidden rounded-lg border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Gantt Overview</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {scheduleData.projectStart} to {scheduleData.projectEnd}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PHASE_LABELS).map(([key, label]) => (
                <Badge
                  key={key}
                  className={`${PHASE_COLORS[key as keyof typeof PHASE_COLORS]} border-0 text-white`}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden p-0">
          <div className="min-w-0 overflow-x-auto">
            <div className="min-w-[720px] sm:min-w-[800px]">
              <div className="grid grid-cols-[240px_1fr] border-b border-border bg-muted sm:grid-cols-[320px_1fr]">
                <div className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Activity
                </div>
                <div className="relative p-3">
                  <div
                    className="grid gap-0"
                    style={{
                      gridTemplateColumns: `repeat(${monthLabels.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {monthLabels.map((month, index) => (
                      <div
                        key={`month-header-${index}`}
                        className="border-r border-border text-center font-mono text-xs text-muted-foreground last:border-r-0"
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {scheduleData.activities.map((activity) => {
                const { leftPct, widthPct } = calculatePosition(
                  activity.start,
                  activity.end,
                  scheduleData.projectStart,
                  scheduleData.projectEnd,
                );
                const progress =
                  activity.planned > 0
                    ? (activity.actual / activity.planned) * 100
                    : 0;

                return (
                  <div
                    key={activity.id}
                    className="grid grid-cols-[240px_1fr] border-b border-border transition-colors hover:bg-accent/50 sm:grid-cols-[320px_1fr]"
                  >
                    <div className="border-r border-border p-3">
                      <div className="text-sm font-medium">{activity.name}</div>
                      <div className="mt-1 break-words font-mono text-xs text-muted-foreground">
                        {activity.activityCode} | WBS {activity.wbs} |{" "}
                        {activity.linkedDocs.length} docs linked
                      </div>
                    </div>
                    <div className="relative p-3">
                      <div
                        className="grid h-full gap-0"
                        style={{
                          gridTemplateColumns: `repeat(${monthLabels.length}, minmax(0, 1fr))`,
                        }}
                      >
                        {monthLabels.map((_, index) => (
                          <div
                            key={`month-grid-${activity.id}-${index}`}
                            className="border-r border-border/30 last:border-r-0"
                          />
                        ))}
                      </div>
                      <div
                        className={`absolute top-1/2 flex h-5 -translate-y-1/2 items-center overflow-hidden px-2 font-mono text-[10px] text-white ${
                          PHASE_COLORS[
                            activity.phase as keyof typeof PHASE_COLORS
                          ]
                        }`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        title={`${activity.actual}% complete`}
                      >
                        <div
                          className="absolute inset-0 bg-black/25"
                          style={{
                            width: `${100 - progress}%`,
                            right: 0,
                            left: "auto",
                          }}
                        />
                        <span className="relative z-10 truncate">
                          {activity.actual}% | {activity.name.slice(0, 20)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0 overflow-hidden rounded-lg border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Activity to Document Mapping</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Documents are progress indicators for WBS activities
              </p>
            </div>
            <Badge variant="secondary" className="uppercase tracking-wider">
              WBS Linkage
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden px-0">
          {scheduleData.activities.length === 0 ? (
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              No schedule activities found.
            </div>
          ) : (
            <ScheduleTable activities={scheduleData.activities} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
