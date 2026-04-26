"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { saveProjectNumbering } from "@/actions/project-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function ConfigNumbering({
  projectId,
  config,
  canEdit,
}: {
  projectId: string;
  config: {
    numberingPattern: string;
    separator: string;
    sequencePadding: number;
    revisionScheme: string;
  } | null;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState({
    numberingPattern: config?.numberingPattern ?? "PRJ-DISC-TYPE-SEQ",
    separator: config?.separator ?? "-",
    sequencePadding: String(config?.sequencePadding ?? 4),
    revisionScheme: config?.revisionScheme ?? "alpha-numeric",
  });

  useEffect(() => {
    setValues({
      numberingPattern: config?.numberingPattern ?? "PRJ-DISC-TYPE-SEQ",
      separator: config?.separator ?? "-",
      sequencePadding: String(config?.sequencePadding ?? 4),
      revisionScheme: config?.revisionScheme ?? "alpha-numeric",
    });
  }, [config]);

  const save = () => {
    startTransition(async () => {
      const result = await saveProjectNumbering({
        projectId,
        numberingPattern: values.numberingPattern,
        separator: values.separator,
        sequencePadding: Number(values.sequencePadding),
        revisionScheme: values.revisionScheme,
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
        title: "Numbering saved",
        description: "Numbering scheme settings were updated.",
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="numbering-pattern">Numbering Pattern</Label>
          <Input
            id="numbering-pattern"
            placeholder="e.g., PRJ-DISC-TYPE-SEQ"
            value={values.numberingPattern}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                numberingPattern: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="separator">Separator</Label>
          <Input
            id="separator"
            placeholder="e.g., -"
            value={values.separator}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                separator: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sequence-padding">Sequence Padding</Label>
          <Input
            id="sequence-padding"
            type="number"
            min={1}
            max={12}
            value={values.sequencePadding}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                sequencePadding: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="revision-scheme">Revision Scheme</Label>
          <Input
            id="revision-scheme"
            placeholder="e.g., alpha-numeric"
            value={values.revisionScheme}
            disabled={!canEdit}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                revisionScheme: event.target.value,
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
              Save Numbering Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
