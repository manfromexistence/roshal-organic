"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addProjectStakeholder,
  deleteProjectStakeholder,
} from "@/actions/project-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function ConfigStakeholders({
  projectId,
  stakeholders,
  canEdit,
  canDelete,
}: {
  projectId: string;
  stakeholders: Array<{
    id: string;
    stakeholderId: string;
    name: string;
    role: string;
    contact: string | null;
  }>;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState({
    stakeholderId: "",
    name: "",
    role: "",
    contact: "",
  });

  const add = () => {
    startTransition(async () => {
      const result = await addProjectStakeholder({
        projectId,
        ...values,
      });

      if (!result.success) {
        toast({
          title: "Stakeholder add failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      setValues({
        stakeholderId: "",
        name: "",
        role: "",
        contact: "",
      });
      toast({
        title: "Stakeholder added",
        description: "The stakeholder entry is now available in project setup.",
      });
      router.refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      const result = await deleteProjectStakeholder({ id, projectId });
      if (!result.success) {
        toast({
          title: "Delete failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Stakeholder removed",
        description: "The stakeholder entry was deleted.",
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <Input
          placeholder="Stakeholder ID"
          value={values.stakeholderId}
          disabled={!canEdit}
          onChange={(event) =>
            setValues((previous) => ({
              ...previous,
              stakeholderId: event.target.value,
            }))
          }
        />
        <Input
          placeholder="Organization name"
          value={values.name}
          disabled={!canEdit}
          onChange={(event) =>
            setValues((previous) => ({
              ...previous,
              name: event.target.value,
            }))
          }
        />
        <Input
          placeholder="Role"
          value={values.role}
          disabled={!canEdit}
          onChange={(event) =>
            setValues((previous) => ({
              ...previous,
              role: event.target.value,
            }))
          }
        />
        <Input
          placeholder="Contact email or person"
          value={values.contact}
          disabled={!canEdit}
          onChange={(event) =>
            setValues((previous) => ({
              ...previous,
              contact: event.target.value,
            }))
          }
        />
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
              Add Stakeholder
            </>
          )}
        </Button>
      </div>

      {stakeholders.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No stakeholders configured yet.
        </div>
      ) : (
        <div className="grid gap-2">
          {stakeholders.map((stakeholder) => (
            <div
              key={stakeholder.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-medium">
                  {stakeholder.stakeholderId}
                </p>
                <p className="text-sm">{stakeholder.name}</p>
                <p className="text-xs text-muted-foreground">
                  {stakeholder.role}
                  {stakeholder.contact ? ` | ${stakeholder.contact}` : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!canDelete}
                onClick={() => remove(stakeholder.id)}
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
