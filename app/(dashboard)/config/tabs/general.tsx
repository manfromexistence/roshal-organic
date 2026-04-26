"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { saveProjectGeneral } from "@/actions/project-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function ConfigGeneral({
  projectId,
  project,
  canEdit,
}: {
  projectId: string;
  project: {
    name: string | null;
    projectNumber: string | null;
    location: string | null;
    description: string | null;
  } | null;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState({
    name: project?.name ?? "",
    projectNumber: project?.projectNumber ?? "",
    location: project?.location ?? "",
    description: project?.description ?? "",
  });

  useEffect(() => {
    setValues({
      name: project?.name ?? "",
      projectNumber: project?.projectNumber ?? "",
      location: project?.location ?? "",
      description: project?.description ?? "",
    });
  }, [project]);

  const save = () => {
    startTransition(async () => {
      const result = await saveProjectGeneral({
        projectId,
        ...values,
      });

      if (!result.success) {
        toast({
          title: "Save failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "General settings saved",
        description: "Project details were updated successfully.",
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input
            id="project-name"
            placeholder="Enter project name"
            value={values.name}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                name: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-code">Project Code</Label>
          <Input
            id="project-code"
            placeholder="Enter project code"
            value={values.projectNumber}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                projectNumber: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-location">Location</Label>
          <Input
            id="project-location"
            placeholder="Enter project location"
            value={values.location}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                location: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-description">Description</Label>
          <Input
            id="project-description"
            placeholder="Enter project description"
            value={values.description}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                description: event.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={save} disabled={isPending || !canEdit}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save General Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
