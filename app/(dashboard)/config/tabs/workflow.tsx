"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addWorkflowTemplate,
  deleteWorkflowTemplate,
} from "@/actions/project-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function ConfigWorkflow({
  projectId,
  workflowSteps,
  canEdit,
  canDelete,
}: {
  projectId: string;
  workflowSteps: Array<{
    id: string;
    stepName: string;
    actor: string;
    duration: string;
  }>;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState({
    stepName: "",
    actor: "",
    duration: "",
  });

  const add = () => {
    startTransition(async () => {
      const result = await addWorkflowTemplate({
        projectId,
        ...values,
      });

      if (!result.success) {
        toast({
          title: "Workflow step add failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      setValues({
        stepName: "",
        actor: "",
        duration: "",
      });
      toast({
        title: "Workflow step added",
        description: "The approval workflow template was updated.",
      });
      router.refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      const result = await deleteWorkflowTemplate({ id, projectId });
      if (!result.success) {
        toast({
          title: "Delete failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Workflow step removed",
        description: "The workflow step was deleted.",
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="step-name">Step Name</Label>
          <Input
            id="step-name"
            placeholder="e.g., Draft Review"
            value={values.stepName}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                stepName: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee Role</Label>
          <Input
            id="assignee"
            placeholder="e.g., admin"
            value={values.actor}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                actor: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g., 3 working days"
            value={values.duration}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                duration: event.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={add} disabled={isPending || !canEdit}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Adding
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Add Step
            </>
          )}
        </Button>
      </div>

      {workflowSteps.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No workflow steps configured yet.
        </div>
      ) : (
        <div className="grid gap-2">
          {workflowSteps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {index + 1}. {step.stepName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.actor} | {step.duration}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!canDelete}
                onClick={() => remove(step.id)}
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
