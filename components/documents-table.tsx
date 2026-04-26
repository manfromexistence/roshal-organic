"use client";

import Link from "next/link";
import { EdmsStatusBadge } from "@/components/edms/status-badge";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  documentNumber: string;
  title: string;
  discipline: string | null;
  category: string | null;
  fileSize: string | null;
  revision: string | null;
  status: string;
  author: string | null;
  uploadedLabel: string;
  projectName: string | null;
}

interface DocumentsTableProps {
  documents: Document[];
  canManageContent: boolean;
}

export function DocumentsTable({
  documents,
  canManageContent,
}: DocumentsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">
                  Document Code
                </th>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Rev</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Author</th>
                <th className="px-4 py-3 text-left font-medium">Modified</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    {doc.documentNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.discipline ?? "General"} ·{" "}
                        {doc.category ?? "Document"} · {doc.fileSize ?? "—"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {doc.revision ?? "0"}
                  </td>
                  <td className="px-4 py-3">
                    <EdmsStatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {doc.author ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {doc.uploadedLabel}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/documents/${doc.id}`}>Open</Link>
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
