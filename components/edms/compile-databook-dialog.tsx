"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface CompileDataBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: Array<{
    code: string;
    title: string;
    collected: number;
    docs: Array<{ code: string; title: string; status: string }>;
  }>;
  metadata: {
    title: string;
    revision: string;
    compiler: string;
    targetDate: string;
  };
}

function createCompiledMarkup(
  sections: CompileDataBookDialogProps["sections"],
  metadata: CompileDataBookDialogProps["metadata"],
) {
  const collectedSections = sections.map((section) => ({
    ...section,
    docs: section.docs.filter((doc) => doc.status === "collected"),
  }));

  const sectionBlocks = collectedSections
    .map(
      (section) => `
        <section class="section">
          <div class="section-header">
            <span>${section.code}</span>
            <span>${section.title}</span>
          </div>
          ${
            section.docs.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${section.docs
                  .map(
                    (doc) => `
                    <tr>
                      <td>${doc.code}</td>
                      <td>${doc.title}</td>
                      <td>${doc.status.toUpperCase()}</td>
                    </tr>
                  `,
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : '<p class="empty">No collected documents in this section.</p>'
          }
        </section>
      `,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${metadata.title} Data Book</title>
    <style>
      body {
        margin: 0;
        padding: 32px;
        font-family: "JetBrains Mono", monospace;
        background: #fff;
        color: #111;
      }
      h1, h2, h3, p {
        margin: 0;
      }
      .cover {
        border-bottom: 2px solid #111;
        padding-bottom: 24px;
        margin-bottom: 24px;
      }
      .eyebrow {
        font-size: 11px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #666;
        margin-bottom: 12px;
      }
      .title {
        font-size: 32px;
        line-height: 1.2;
        margin-bottom: 8px;
      }
      .meta {
        display: grid;
        gap: 4px;
        font-size: 12px;
        color: #555;
      }
      .toc {
        margin-bottom: 32px;
      }
      .toc h2,
      .content h2 {
        font-size: 14px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        margin-bottom: 12px;
      }
      .toc-row,
      .section-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        border-bottom: 1px solid #ddd;
        padding: 10px 0;
      }
      .section {
        margin-bottom: 28px;
        page-break-inside: avoid;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
        font-size: 12px;
        vertical-align: top;
      }
      th {
        background: #f4f4f4;
      }
      .empty {
        margin-top: 12px;
        color: #666;
        font-size: 12px;
      }
      @media print {
        body {
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <section class="cover">
      <div class="eyebrow">Final Project Data Book</div>
      <h1 class="title">${metadata.title}</h1>
      <div class="meta">
        <div>Revision ${metadata.revision}</div>
        <div>Compiled by ${metadata.compiler}</div>
        <div>Target date ${metadata.targetDate}</div>
      </div>
    </section>

    <section class="toc">
      <h2>Table of Contents</h2>
      ${collectedSections
        .map(
          (section, index) => `
            <div class="toc-row">
              <span>${section.code} - ${section.title}</span>
              <span>${String(index + 1).padStart(2, "0")}</span>
            </div>
          `,
        )
        .join("")}
    </section>

    <section class="content">
      <h2>Compiled Sections</h2>
      ${sectionBlocks}
    </section>
  </body>
</html>`;
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CompileDataBookDialog({
  open,
  onOpenChange,
  sections,
  metadata,
}: CompileDataBookDialogProps) {
  const totalCollected = sections.reduce(
    (sum, section) => sum + section.collected,
    0,
  );
  const compiledMarkup = createCompiledMarkup(sections, metadata);

  const handleGeneratePdf = () => {
    const printWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!printWindow) {
      toast({
        title: "Print window blocked",
        description: "Allow pop-ups to generate the databook PDF preview.",
        variant: "destructive",
      });
      return;
    }

    printWindow.document.open();
    printWindow.document.write(compiledMarkup);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleCompile = () => {
    const fileName = `${sanitizeFileName(metadata.title || "project-databook") || "project-databook"}-rev-${metadata.revision || "a"}.html`;
    const blob = new Blob([compiledMarkup], {
      type: "text/html;charset=utf-8",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(downloadUrl);

    toast({
      title: "Data book compiled",
      description: `${fileName} has been generated from the current collected sections.`,
    });
    onOpenChange(false);
  };

  let pageNumber = 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Compile
          </div>
          <DialogTitle>Compile Data Book</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="my-4 bg-muted/30 p-8 pr-4">
            <div className="mx-auto max-w-3xl border border-border bg-white p-12 shadow-sm">
              <div className="mb-6 border-b-2 border-foreground pb-6 text-center">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  FINAL PROJECT DATA BOOK
                </div>
                <h1 className="mb-2 text-4xl font-serif font-normal">
                  {metadata.title}
                </h1>
                <div className="text-sm text-muted-foreground">
                  Revision {metadata.revision}
                </div>
                <div className="mt-8 space-y-1 text-xs text-muted-foreground">
                  <div>Prepared by {metadata.compiler}</div>
                  <div className="mt-3 font-mono">{metadata.targetDate}</div>
                </div>
              </div>

              <div className="mb-4 text-sm font-semibold tracking-wide">
                TABLE OF CONTENTS
              </div>
              <div className="space-y-0">
                {sections.map((section) => {
                  const sectionPage = pageNumber;
                  const collectedDocs = section.docs.filter(
                    (doc) => doc.status === "collected",
                  );

                  const sectionContent = (
                    <div key={section.code}>
                      <div className="flex items-center justify-between border-b border-foreground py-2 font-semibold">
                        <span>
                          <span className="font-mono text-xs">
                            {section.code}
                          </span>
                          {"  "}
                          {section.title}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(sectionPage).padStart(3, "0")}
                        </span>
                      </div>
                      {collectedDocs.map((doc, index) => {
                        const docPage = sectionPage + index + 1;

                        return (
                          <div
                            key={doc.code}
                            className="flex items-center justify-between border-b border-dotted border-border py-1.5 pl-5 text-xs"
                          >
                            <span className="text-muted-foreground">
                              <span className="font-mono text-[10.5px]">
                                {doc.code}
                              </span>
                              {"  "}
                              {doc.title}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {String(docPage).padStart(3, "0")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );

                  pageNumber += collectedDocs.length + 3;
                  return sectionContent;
                })}
              </div>

              <div className="mt-8 flex justify-between border-t border-border pt-4 text-[10px] text-muted-foreground">
                <span>Generated by Quadra EDMS</span>
                <span className="font-mono">Page 1 of 1</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="secondary" onClick={handleGeneratePdf}>
            Generate PDF ({totalCollected} docs)
          </Button>
          <Button onClick={handleCompile}>Compile Data Book</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
