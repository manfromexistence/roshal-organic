"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addProjectDocumentType,
  deleteProjectDocumentType,
} from "@/actions/project-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function ConfigDocTypes({
  projectId,
  documentTypes,
  canEdit,
  canDelete,
}: {
  projectId: string;
  documentTypes: Array<{
    id: string;
    code: string;
    name: string;
  }>;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState("");

  const add = () => {
    const nextCode = code.trim().toUpperCase();
    if (!nextCode) {
      return;
    }

    startTransition(async () => {
      const result = await addProjectDocumentType({
        projectId,
        code: nextCode,
        name: nextCode,
      });

      if (!result.success) {
        toast({
          title: "Document type add failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      setCode("");
      toast({
        title: "Document type added",
        description: `${nextCode} is now available for this project.`,
      });
      router.refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      const result = await deleteProjectDocumentType({ id, projectId });
      if (!result.success) {
        toast({
          title: "Delete failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Document type removed",
        description: "The document type entry was deleted.",
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Add new document type code..."
          value={code}
          disabled={!canEdit}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" onClick={add} disabled={isPending || !canEdit}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Adding
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Add
            </>
          )}
        </Button>
      </div>

      {documentTypes.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No document types configured yet.
        </div>
      ) : (
        <div className="grid gap-2">
          {documentTypes.map((documentType) => (
            <div
              key={documentType.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-medium">
                  {documentType.code}
                </p>
                <p className="text-xs text-muted-foreground">
                  {documentType.name}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!canDelete}
                onClick={() => remove(documentType.id)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
