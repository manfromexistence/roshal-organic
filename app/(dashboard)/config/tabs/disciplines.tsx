"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addProjectDiscipline,
  deleteProjectDiscipline,
} from "@/actions/project-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function ConfigDisciplines({
  projectId,
  disciplines,
  canEdit,
  canDelete,
}: {
  projectId: string;
  disciplines: Array<{
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
      const result = await addProjectDiscipline({
        projectId,
        code: nextCode,
        name: nextCode,
      });

      if (!result.success) {
        toast({
          title: "Discipline add failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      setCode("");
      toast({
        title: "Discipline added",
        description: `${nextCode} is now available for this project.`,
      });
      router.refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      const result = await deleteProjectDiscipline({ id, projectId });
      if (!result.success) {
        toast({
          title: "Delete failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Discipline removed",
        description: "The discipline entry was deleted.",
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Add new discipline code..."
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

      {disciplines.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No disciplines configured yet.
        </div>
      ) : (
        <div className="grid gap-2">
          {disciplines.map((discipline) => (
            <div
              key={discipline.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-medium">
                  {discipline.code}
                </p>
                <p className="text-xs text-muted-foreground">
                  {discipline.name}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!canDelete}
                onClick={() => remove(discipline.id)}
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
