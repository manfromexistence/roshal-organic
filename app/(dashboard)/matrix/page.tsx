import { ArrowRight, Grid3X3, Info } from "lucide-react";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import { Suspense } from "react";
import { CollapsibleSummary } from "@/components/collapsible-summary";
import { EdmsDataState } from "@/components/edms/data-state";
import { DistributionMatrixTable } from "@/components/edms/distribution-matrix-table";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMatrixPageData } from "@/lib/edms/derived-pages";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Distribution Matrix | Quadra EDMS Demo",
  description:
    "Live distribution matrix derived from project stakeholders and transmittal issue history.",
};

export default async function MatrixPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const matrixData = await getMatrixPageData(sessionUser);

  const totalIssuedDocuments = matrixData.rows.reduce(
    (sum, row) => sum + row.issuedDocuments,
    0,
  );
  const matrixCoverage = matrixData.rows
    .map((row) => ({
      key: row.key,
      discipline: row.discipline,
      docType: row.docType,
      issuedDocuments: row.issuedDocuments,
      recipients: Object.values(row.distribution).filter((value) => value > 0)
        .length,
    }))
    .sort((left, right) => right.issuedDocuments - left.issuedDocuments)
    .slice(0, 8);

  const metrics = [
    {
      label: "Matrix entries",
      value: String(matrixData.rows.length),
      description:
        "Distinct discipline and document-type combinations found in the live EDMS register.",
      tone: "blue" as const,
      icon: "documents" as const,
    },
    {
      label: "Stakeholders",
      value: String(matrixData.stakeholders.length),
      description:
        "Project members participating in the live transmittal distribution graph.",
      tone: "emerald" as const,
      icon: "reviews" as const,
    },
    {
      label: "Issued documents",
      value: String(totalIssuedDocuments),
      description:
        "Controlled records that have been linked to outbound transmittals.",
      tone: "amber" as const,
      icon: "transmittals" as const,
    },
    {
      label: "Distribution links",
      value: String(matrixData.totalLinks),
      description:
        "Recipient hits derived from actual transmittal recipient and document mappings.",
      tone: "rose" as const,
      icon: "notifications" as const,
    },
  ];

  const liveRows = matrixData.rows.map((row) => ({
    key: row.key,
    discipline: row.discipline,
    docType: row.docType,
    purpose: "IFC",
    distribution: Object.fromEntries(
      matrixData.stakeholders.map((stakeholder) => [
        stakeholder.id,
        row.distribution[stakeholder.id] > 0 ? "I" : "",
      ]),
    ) as Record<string, "A" | "R" | "I" | "">,
  }));

  return (
    <ScrollableContent>
      <div className="flex w-full min-w-0 max-w-full flex-col gap-6 overflow-x-hidden px-4 sm:px-6 lg:px-8">
        <CollapsibleSummary>
          <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2 2xl:grid-cols-4 sm:gap-6">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-0">
                <EdmsMetricCard metric={metric} />
              </div>
            ))}
          </div>
        </CollapsibleSummary>

        <div className="flex max-w-full flex-col gap-4 print:hidden 2xl:flex-row 2xl:items-end 2xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Distribution Matrix
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Live matrix of who receives which document classes. Counts
                represent actual issue frequency from real transmittal packages,
                not mock approval codes.
              </p>
            </div>
          </div>

          <div className="flex max-w-full flex-wrap items-center gap-2 2xl:justify-end">
            <PrintButton label="Export to PDF" variant="secondary" />
            <Button variant="outline" asChild>
              <Link href="/transmittals">
                Transmittals
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/documents">
                Document register
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <EdmsDataState
          isUsingFallbackData={matrixData.isUsingFallbackData}
          message={matrixData.statusMessage}
        />

        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">
                Loading distribution matrix...
              </div>
            }
          >
            <section className="flex w-full min-w-0 max-w-full flex-col gap-4">
              <Card className="min-w-0 overflow-hidden border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Info className="size-4" />
                    Matrix rules
                  </CardTitle>
                  <CardDescription>
                    This matrix is now a live routing view derived from the
                    current document register and transmittal history. Cells
                    show active distribution coverage instead of demo-only local
                    edits.
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-w-0 overflow-hidden">
                  <div className="grid min-w-0 grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {matrixData.stakeholders.map((stakeholder) => (
                      <div
                        key={stakeholder.id}
                        className="min-w-0 rounded-md border border-border bg-muted/30 px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="min-w-0 break-words text-sm font-medium">
                            {stakeholder.name}
                          </p>
                          <span className="font-mono text-xs text-muted-foreground">
                            {stakeholder.short}
                          </span>
                        </div>
                        <p className="text-xs capitalize text-muted-foreground">
                          {stakeholder.role}
                        </p>
                        <p className="break-all text-xs text-muted-foreground">
                          {stakeholder.email}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {matrixData.rows.length === 0 ||
              matrixData.stakeholders.length === 0 ? (
                <Card className="min-w-0 border-border bg-card shadow-sm">
                  <CardContent className="pt-6 text-sm text-muted-foreground">
                    No live transmittal distribution data is available for the
                    current access scope.
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="min-w-0 overflow-hidden border-border bg-card shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Grid3X3 className="size-4" />
                        Live distribution matrix
                      </CardTitle>
                      <CardDescription>
                        {matrixData.rows.length} document classes | routing
                        coverage sourced from active project traffic
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="min-w-0 overflow-hidden">
                      <DistributionMatrixTable
                        stakeholders={matrixData.stakeholders}
                        rows={liveRows}
                      />
                    </CardContent>
                  </Card>

                  <Card className="min-w-0 overflow-hidden border-border bg-card shadow-sm">
                    <CardHeader>
                      <CardTitle>Routing coverage</CardTitle>
                      <CardDescription>
                        Highest-traffic document classes across the live
                        distribution graph.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="min-w-0 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="pr-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              Discipline
                            </TableHead>
                            <TableHead className="pr-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              Document Type
                            </TableHead>
                            <TableHead className="pr-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              Issued Docs
                            </TableHead>
                            <TableHead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              Recipients
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {matrixCoverage.map((row) => (
                            <TableRow key={row.key}>
                              <TableCell className="pr-4 font-medium whitespace-normal">
                                {row.discipline}
                              </TableCell>
                              <TableCell className="pr-4 text-muted-foreground whitespace-normal">
                                {row.docType}
                              </TableCell>
                              <TableCell className="pr-4 font-mono text-xs">
                                {row.issuedDocuments}
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {row.recipients}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </section>
          </Suspense>
        </ErrorBoundary>
      </div>
    </ScrollableContent>
  );
}
