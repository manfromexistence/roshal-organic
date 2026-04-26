import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import { Suspense } from "react";
import { CollapsibleSummary } from "@/components/collapsible-summary";
import { EdmsDataState } from "@/components/edms/data-state";
import { DocumentBulkImportSheet } from "@/components/edms/document-bulk-import-sheet";
import { DocumentBulkUploadSheet } from "@/components/edms/document-bulk-upload-sheet";
import { DocumentCreateSheet } from "@/components/edms/document-create-sheet";
import { DocumentsDataTable } from "@/components/edms/documents-data-table";
import { DocumentsSkeleton } from "@/components/edms/documents-skeleton";
import { ExportButton } from "@/components/edms/export-button";
import { EdmsMetricCard } from "@/components/edms/metric-card";
import { PrintButton } from "@/components/edms/print-button";
import { EdmsStatusBadge } from "@/components/edms/status-badge";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEdmsDashboardData } from "@/lib/edms/dashboard";
import { getDocumentControlData } from "@/lib/edms/documents";
import { canManageEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Documents | Quadra EDMS",
};

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    status?: string;
    discipline?: string;
    revision?: string;
  }>;
}) {
  const sessionUser = await getRequiredDashboardSessionUser();
  const params = await searchParams;
  const [summaryData, data] = await Promise.all([
    getEdmsDashboardData(sessionUser),
    getDocumentControlData(sessionUser),
  ]);
  const canManageContent = canManageEdmsContent(sessionUser.role || "user");

  // Prepare export data
  const exportData = data.documents.map((doc) => ({
    documentNumber: doc.documentNumber,
    title: doc.title,
    projectName: doc.projectName,
    discipline: doc.discipline,
    status: doc.status,
    revision: doc.revision,
    author: doc.author,
    modified: doc.uploadedLabel,
  }));

  const exportColumns = [
    { header: "Document Code", key: "documentNumber", width: 30 },
    { header: "Title", key: "title", width: 50 },
    { header: "Rev", key: "revision", width: 10 },
    { header: "Status", key: "status", width: 15 },
    { header: "Author", key: "author", width: 25 },
    { header: "Modified", key: "modified", width: 20 },
  ];

  return (
    <ScrollableContent>
      <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden px-4 sm:px-6 lg:px-8">
        <CollapsibleSummary>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
            {data.metrics.map((metric, index) => {
              const links = [
                "/documents",
                "/workflows",
                "/transmittals",
                "/notifications",
              ];
              return (
                <Link
                  key={metric.label}
                  href={links[index] || "/documents"}
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
            {/* <PageBreadcrumb /> */}
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Document Register
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Central index of all project documents with revision control,
                status, and metadata.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ExportButton
              data={exportData}
              columns={exportColumns}
              title="Documents"
              filename="documents_export"
              variant="secondary"
              metadata={[
                {
                  label: "Generated",
                  value: new Date().toLocaleDateString(),
                },
                {
                  label: "Total Records",
                  value: String(data.documents.length),
                },
                ...(params.query
                  ? [{ label: "Search Query", value: params.query }]
                  : []),
                ...(params.status
                  ? [{ label: "Status Filter", value: params.status }]
                  : []),
              ]}
            />
            <PrintButton label="Print" variant="outline" icon="print" />
            {canManageContent ? (
              <>
                <DocumentCreateSheet
                  projects={data.projects}
                  triggerLabel="+ New Document"
                />
                <DocumentBulkImportSheet projects={data.projects}>
                  <Button variant="outline">Bulk Import</Button>
                </DocumentBulkImportSheet>
                <DocumentBulkUploadSheet projects={data.projects}>
                  <Button variant="outline">Bulk Upload</Button>
                </DocumentBulkUploadSheet>
              </>
            ) : null}
          </div>
        </div>

        <EdmsDataState
          isUsingFallbackData={data.isUsingFallbackData}
          message={data.statusMessage}
        />

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<DocumentsSkeleton />}>
            <Card className="min-w-0 overflow-hidden border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Document Register</CardTitle>
              </CardHeader>

              <CardContent className="min-w-0 overflow-hidden px-4 sm:px-6">
                {data.documents.length === 0 ? (
                  <div className="pb-6 text-sm text-muted-foreground">
                    No documents found.
                  </div>
                ) : (
                  <DocumentsDataTable documents={data.documents} />
                )}
              </CardContent>
            </Card>

            <section className="grid min-w-0 gap-4 xl:grid-cols-2">
              <Card className="min-w-0 overflow-hidden border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Workflow watchlist</CardTitle>
                </CardHeader>
                <CardContent className="min-w-0 space-y-3">
                  {summaryData.workflowQueue.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No workflow items found.
                    </div>
                  ) : (
                    summaryData.workflowQueue.map((item) => (
                      <Link
                        key={item.id}
                        href={`/workflows/${item.id}`}
                        className="block"
                      >
                        <div className="group min-w-0 cursor-pointer border border-border bg-card p-4 transition-all hover:bg-accent hover:shadow-md">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="break-words font-medium group-hover:text-primary">
                                {item.stepName}
                              </p>
                              <p className="break-words text-sm text-muted-foreground">
                                {item.projectName}
                              </p>
                            </div>
                            <EdmsStatusBadge status={item.status} />
                          </div>
                          <p className="mt-3 break-words text-sm text-muted-foreground">
                            {item.documentNumber} | {item.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.dueLabel}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="min-w-0 overflow-hidden border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Recent transmittals</CardTitle>
                </CardHeader>
                <CardContent className="min-w-0 space-y-3">
                  {summaryData.transmittals.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No transmittals found.
                    </div>
                  ) : (
                    summaryData.transmittals.map((item) => (
                      <Link
                        key={item.id}
                        href={`/transmittals/${item.id}`}
                        className="block"
                      >
                        <div className="group min-w-0 cursor-pointer border border-border bg-card p-4 transition-all hover:bg-accent hover:shadow-md">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="break-words font-medium group-hover:text-primary">
                                {item.subject}
                              </p>
                              <p className="break-words text-sm text-muted-foreground">
                                {item.projectName}
                              </p>
                            </div>
                            <EdmsStatusBadge status={item.status} />
                          </div>
                          <p className="mt-3 font-mono text-xs text-muted-foreground">
                            {item.transmittalNumber}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.sentLabel}
                          </p>
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
