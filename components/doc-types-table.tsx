"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentType {
  id: string;
  code: string;
  name: string;
  docCount: number;
}

interface DocTypesTableProps {
  documentTypes: DocumentType[];
  onEdit: (docType: DocumentType) => void;
  onDelete: (id: string) => void;
}

export function DocTypesTable({
  documentTypes,
  onEdit,
  onDelete,
}: DocTypesTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Usage</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documentTypes.map((docType) => (
                <tr key={docType.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-sm font-medium">
                    {docType.code}
                  </td>
                  <td className="px-4 py-3">{docType.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {docType.docCount} docs
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(docType)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(docType.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
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
