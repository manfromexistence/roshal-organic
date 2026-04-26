"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EdmsStatusBadge } from "./status-badge";

interface ReportData {
  id: string;
  title: string;
  description: string;
  data: Array<Record<string, string>>;
  columns: Array<{ key: string; label: string }>;
  meta?: {
    project?: string;
    period?: string;
    generatedAt?: string;
  };
  summary?: Array<{
    label: string;
    value: string;
    tone?: "default" | "positive" | "warning" | "danger";
  }>;
  sections?: Array<{
    title: string;
    description?: string;
    columns: Array<{ key: string; label: string }>;
    data: Array<Record<string, string>>;
  }>;
  narrative?: string[];
}

interface ReportModalProps {
  report: ReportData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportModal({ report, open, onOpenChange }: ReportModalProps) {
  if (!report) return null;

  const meta = report.meta || {};
  const generatedLabel = meta.generatedAt || new Date().toLocaleDateString();
  const projectLabel = meta.project || "Current portfolio";
  const periodLabel = meta.period || "Current reporting window";

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (format: "pdf" | "excel") => {
    const exportSections = [
      {
        title: "Primary register",
        columns: report.columns,
        data: report.data,
      },
      ...(report.sections || []),
    ];

    if (format === "pdf") {
      window.print();
    } else {
      const csvContent = exportSections
        .map((section) => {
          const header = `${section.title}\n${section.columns
            .map((column) => column.label)
            .join(",")}`;
          const rows = section.data.map((row) =>
            section.columns
              .map((column) => JSON.stringify(row[column.key] || ""))
              .join(","),
          );

          return [header, ...rows].join("\n");
        })
        .join("\n\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${report.title.replace(/\s+/g, "_")}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95vh] max-h-[95vh] w-[96vw] max-w-[96vw] flex-col overflow-hidden p-0 xl:max-w-6xl 2xl:max-w-7xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-serif font-normal">
            {report.title}
          </DialogTitle>
          <DialogDescription>{report.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 border-y px-6 py-3 md:flex-row md:items-center">
          <div className="flex-1 text-sm text-muted-foreground">
            <span className="font-medium">Project:</span> {projectLabel}
            <span className="mx-2">|</span>
            <span className="font-medium">Period:</span> {periodLabel}
            <span className="mx-2">|</span>
            <span className="font-medium">Generated:</span> {generatedLabel}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 size-4" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("excel")}
            >
              <Download className="mr-2 size-4" />
              Excel
            </Button>
            <Button size="sm" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 size-4" />
              PDF
            </Button>
          </div>
        </div>

        <ScrollArea
          className="min-h-0 flex-1"
          type="always"
          showHorizontalScrollbar
          viewportClassName="h-full px-6"
        >
          <div className="my-4 w-[1400px] min-w-[1400px] max-w-none bg-white p-8 text-black shadow-sm md:p-10">
            <div className="mb-6 border-b-2 border-black pb-4">
              <h2 className="text-3xl font-serif font-normal">
                {report.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-gray-600">
                {report.description}
              </p>
            </div>

            <div className="mb-6 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                  Project
                </div>
                <div>{projectLabel}</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                  Period
                </div>
                <div>{periodLabel}</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                  Total Records
                </div>
                <div>{report.data.length}</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                  Generated
                </div>
                <div>{generatedLabel}</div>
              </div>
            </div>

            {report.summary?.length ? (
              <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {report.summary.map((item) => (
                  <div
                    key={item.label}
                    className="border border-gray-200 px-4 py-3"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                      {item.label}
                    </div>
                    <div
                      className={[
                        "mt-2 text-2xl font-semibold tracking-tight",
                        item.tone === "positive" && "text-emerald-700",
                        item.tone === "warning" && "text-amber-700",
                        item.tone === "danger" && "text-red-700",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {report.narrative?.length ? (
              <div className="mb-6 border border-gray-200 bg-gray-50 px-4 py-4">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Key observations
                </div>
                <div className="space-y-2 text-sm leading-6 text-gray-700">
                  {report.narrative.map((item, index) => (
                    <p key={`${item}-${index}`}>{item}</p>
                  ))}
                </div>
              </div>
            ) : null}

            {report.data.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500">
                No data found for this report.
              </div>
            ) : (
              <ReportSectionTable
                title="Primary register"
                columns={report.columns}
                data={report.data}
              />
            )}

            {report.sections?.map((section) => (
              <ReportSectionTable
                key={section.title}
                title={section.title}
                description={section.description}
                columns={section.columns}
                data={section.data}
                className="mt-6"
              />
            ))}

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 text-[11px] text-gray-500">
              <span>
                Generated by Quadra EDMS Demo document control workspace.
              </span>
              <span className="font-mono">Page 1 of 1</span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function ReportSectionTable({
  title,
  description,
  columns,
  data,
  className,
}: {
  title: string;
  description?: string;
  columns: Array<{ key: string; label: string }>;
  data: Array<Record<string, string>>;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-3 flex flex-col gap-1">
        <h3 className="text-base font-semibold text-black">{title}</h3>
        {description ? (
          <p className="text-sm text-gray-600">{description}</p>
        ) : null}
      </div>

      <div className="overflow-x-auto border border-gray-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-gray-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-600"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((row, index) => (
                <tr
                  key={`${title}-${index}`}
                  className="border-b border-gray-200"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-2 align-top">
                      {renderReportCell(column.key, row[column.key] || "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-6 text-center text-sm text-gray-500"
                >
                  No data found for this section.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function renderReportCell(columnKey: string, value: string) {
  if (columnKey === "status") {
    return <EdmsStatusBadge status={value || "unknown"} />;
  }

  if (
    columnKey.includes("number") ||
    columnKey.includes("date") ||
    columnKey.includes("Label")
  ) {
    return <span className="font-mono text-xs">{value}</span>;
  }

  return value;
}
