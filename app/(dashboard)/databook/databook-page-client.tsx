"use client";

import {
  AlertTriangle,
  ChevronRight,
  FolderPlus,
  FolderSearch,
} from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DatabookTable } from "@/components/databook-table";
import { AddSectionDialog } from "@/components/edms/add-section-dialog";
import { CompileDataBookDialog } from "@/components/edms/compile-databook-dialog";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DatabookDoc = {
  code: string;
  href?: string;
  meta?: string;
  status: "collected" | "missing" | "pending";
  title: string;
};

type DatabookSection = {
  code: string;
  collected: number;
  docs: DatabookDoc[];
  required: number;
  rule?: string;
  title: string;
};

type DatabookRule = {
  pattern: string;
  section: string;
  trigger: string;
};

interface DatabookPageClientProps {
  autoPopulateRules: DatabookRule[];
  initialSections: DatabookSection[];
  metadata: {
    compiler: string;
    revision: string;
    targetDate: string;
    title: string;
  };
}

function getStatusBadgeVariant(status: DatabookDoc["status"]) {
  switch (status) {
    case "collected":
      return "default";
    case "missing":
      return "destructive";
    default:
      return "secondary";
  }
}

function getStatusLabel(status: DatabookDoc["status"]) {
  switch (status) {
    case "collected":
      return "Ready";
    case "missing":
      return "Action Needed";
    default:
      return "Pending";
  }
}

function normalizeSection(section: {
  code: string;
  collected: number;
  docs: Array<{ code: string; title: string; status: string }>;
  required: number;
  rule?: string;
  title: string;
}): DatabookSection {
  return {
    ...section,
    docs: section.docs.map((document) => ({
      code: document.code,
      status:
        document.status === "collected" ||
        document.status === "missing" ||
        document.status === "pending"
          ? document.status
          : "pending",
      title: document.title,
    })),
  };
}

export function DatabookPageClient({
  autoPopulateRules,
  initialSections,
  metadata,
}: DatabookPageClientProps) {
  const [sections, setSections] = useState(initialSections);
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(initialSections[0] ? [initialSections[0].code] : []),
  );
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [compileOpen, setCompileOpen] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);

  const nextSectionCode = `SEC-${String(sections.length + 1).padStart(2, "0")}`;
  const totalRequired = sections.reduce(
    (sum, section) => sum + section.required,
    0,
  );
  const totalCollected = sections.reduce(
    (sum, section) => sum + section.collected,
    0,
  );
  const coverage =
    totalRequired > 0 ? (totalCollected / totalRequired) * 100 : 0;
  const pendingItemCount = sections.reduce(
    (sum, section) =>
      sum +
      section.docs.filter((document) => document.status !== "collected").length,
    0,
  );

  const visibleSections = useMemo(() => {
    if (!pendingOnly) {
      return sections;
    }

    return sections
      .map((section) => ({
        ...section,
        docs: section.docs.filter(
          (document) => document.status !== "collected",
        ),
      }))
      .filter((section) => section.docs.length > 0);
  }, [pendingOnly, sections]);

  const toggleSection = (code: string) => {
    setOpenSections((previous) => {
      const next = new Set(previous);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  return (
    <ScrollableContent>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Data Book Compilation
                </h1>
                <p className="text-sm leading-6 text-muted-foreground md:text-base">
                  Build the final handover package directly from the live
                  document register and commissioning records. Add manual
                  sections where the project needs extra structure.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPendingOnly((previous) => !previous)}
              >
                <AlertTriangle className="mr-2 size-4" />
                {pendingOnly
                  ? "Show All Items"
                  : `Show Pending (${pendingItemCount})`}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setAddSectionOpen(true)}
              >
                <FolderPlus className="mr-2 size-4" />
                Add Section
              </Button>
              <Button onClick={() => setCompileOpen(true)}>
                Compile Data Book
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Data Book Structure</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Review sections sourced from the current project
                        records.
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="uppercase tracking-wider"
                    >
                      {visibleSections.length} Sections
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {visibleSections.length === 0 ? (
                    <div className="px-6 pb-6 text-sm text-muted-foreground">
                      {sections.length === 0
                        ? "No databook items are available yet. Upload documents or add a manual section to start building the handover package."
                        : "All databook items are currently marked ready."}
                    </div>
                  ) : (
                    <div className="border-t border-border">
                      {visibleSections.map((section) => {
                        const isOpen = openSections.has(section.code);
                        const pct =
                          section.required > 0
                            ? (section.collected / section.required) * 100
                            : 0;

                        return (
                          <div
                            key={section.code}
                            className="border-b border-border last:border-b-0"
                          >
                            <Button
                              variant="ghost"
                              className="flex h-auto w-full items-center justify-start gap-3 rounded-none px-4 py-4 text-left"
                              onClick={() => toggleSection(section.code)}
                            >
                              <ChevronRight
                                className={cn(
                                  "size-4 shrink-0 text-muted-foreground transition-transform",
                                  isOpen && "rotate-90",
                                )}
                              />
                              <Badge
                                variant="outline"
                                className="shrink-0 font-mono text-xs font-semibold"
                              >
                                {section.code}
                              </Badge>
                              <div className="min-w-0 flex-1">
                                <div className="truncate font-medium">
                                  {section.title}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs text-muted-foreground">
                                  {section.collected}/{section.required}
                                </span>
                              </div>
                            </Button>

                            {isOpen ? (
                              <div className="bg-muted/30">
                                {section.docs.length > 0 ? (
                                  section.docs.map((document) => (
                                    <div
                                      key={`${section.code}-${document.code}`}
                                      className="grid grid-cols-[140px_1fr_140px_120px] items-center gap-3 border-t border-border px-4 py-3 text-sm"
                                    >
                                      <div className="font-mono text-xs font-medium">
                                        {document.code}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="truncate">
                                          {document.title}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                          {document.meta ||
                                            "Linked project record"}
                                        </div>
                                      </div>
                                      <div>
                                        <Badge
                                          variant={getStatusBadgeVariant(
                                            document.status,
                                          )}
                                        >
                                          {getStatusLabel(document.status)}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-end">
                                        {document.href ? (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                          >
                                            <Link href={document.href}>
                                              Open
                                            </Link>
                                          </Button>
                                        ) : (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled
                                          >
                                            No detail
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                    No items in this section yet.
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Auto-Populate Rules</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  {autoPopulateRules.length === 0 ? (
                    <div className="px-6 pb-6 text-sm text-muted-foreground">
                      No automatic filing rules are available until documents
                      are uploaded or manual sections are added.
                    </div>
                  ) : (
                    <DatabookTable rules={autoPopulateRules} />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Coverage Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-semibold">
                        {Math.round(coverage)}%
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        {totalCollected} / {totalRequired}
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${coverage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Complete</span>
                      <span className="font-mono">
                        {
                          sections.filter(
                            (section) => section.collected === section.required,
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">In Progress</span>
                      <span className="font-mono">
                        {
                          sections.filter(
                            (section) =>
                              section.collected > 0 &&
                              section.collected < section.required,
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Pending Items
                      </span>
                      <span className="font-mono">{pendingItemCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Section Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sections.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FolderSearch className="size-4" />
                      No sections created yet.
                    </div>
                  ) : (
                    sections.map((section) => {
                      const pct =
                        section.required > 0
                          ? Math.round(
                              (section.collected / section.required) * 100,
                            )
                          : 0;

                      return (
                        <div
                          key={section.code}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="font-mono text-xs text-muted-foreground">
                            {section.code}
                          </span>
                          <div className="flex flex-1 items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-8 text-right font-mono text-xs text-muted-foreground">
                              {pct}%
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Data Book Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Title
                    </div>
                    <div className="text-sm">{metadata.title}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Revision
                      </div>
                      <div className="font-mono text-xs">
                        {metadata.revision}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Compiler
                      </div>
                      <div className="text-xs">{metadata.compiler}</div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Target Issue Date
                    </div>
                    <div className="font-mono text-xs">
                      {metadata.targetDate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <AddSectionDialog
            open={addSectionOpen}
            onOpenChange={setAddSectionOpen}
            nextCode={nextSectionCode}
            onCreateSection={(section) => {
              const nextSection = normalizeSection(section);
              setSections((previous) => [...previous, nextSection]);
              setOpenSections((previous) =>
                new Set(previous).add(section.code),
              );
            }}
          />
          <CompileDataBookDialog
            open={compileOpen}
            onOpenChange={setCompileOpen}
            sections={sections}
            metadata={metadata}
          />
        </div>
      </ErrorBoundary>
    </ScrollableContent>
  );
}
