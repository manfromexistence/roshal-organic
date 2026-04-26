"use client";

import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  fileName: string;
  fileSize: number;
  downloadCount: number;
  createdAt: string;
}

interface ProjectTemplatesTableProps {
  templates: ProjectTemplate[];
  formatFileSize: (bytes: number) => string;
}

export function ProjectTemplatesTable({
  templates,
  formatFileSize,
}: ProjectTemplatesTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">
                  Template Name
                </th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">File</th>
                <th className="px-4 py-3 text-left font-medium">Size</th>
                <th className="px-4 py-3 text-left font-medium">Downloads</th>
                <th className="px-4 py-3 text-left font-medium">Uploaded</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {template.description || "—"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-muted px-2 py-1 font-mono text-xs uppercase">
                      {template.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{template.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="text-sm">{template.fileName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {formatFileSize(template.fileSize)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {template.downloadCount}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {template.createdAt
                      ? new Date(template.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">
                      <Download className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
