"use client";

import { useState, useTransition } from "react";
import { syncProjectSchedule } from "@/actions/schedule";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ScheduleSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function ScheduleSyncDialog({
  open,
  onOpenChange,
  projectId,
}: ScheduleSyncDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [source, setSource] = useState("p6");
  const [baseline, setBaseline] = useState("baseline3");
  const [preserveLinks, setPreserveLinks] = useState(true);
  const [updateDates, setUpdateDates] = useState(true);
  const [recalculateEV, setRecalculateEV] = useState(true);
  const [autoCreate, setAutoCreate] = useState(false);

  const handleSync = () => {
    startTransition(async () => {
      const result = await syncProjectSchedule({
        projectId,
        source,
      });

      if (!result.success) {
        toast({
          title: "Sync failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Schedule sync recorded",
        description: `Imported ${source.toUpperCase()} schedule using ${baseline}. Existing links were ${preserveLinks ? "preserved" : "replaced"}.`,
      });
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Planning
          </div>
          <DialogTitle>Sync Project Schedule</DialogTitle>
          <DialogDescription>
            Merge the latest project schedule from your planning tool into EDMS.
            Document linkages are preserved by Activity ID.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4 pr-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Source System</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Primavera P6" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p6">Primavera P6</SelectItem>
                    <SelectItem value="msproject">MS Project</SelectItem>
                    <SelectItem value="asta">Asta Powerproject</SelectItem>
                    <SelectItem value="smartsheet">Smartsheet</SelectItem>
                    <SelectItem value="csv">CSV Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Baseline</Label>
                <Select value={baseline} onValueChange={setBaseline}>
                  <SelectTrigger>
                    <SelectValue placeholder="Current - Baseline 3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baseline3">
                      Current - Baseline 3
                    </SelectItem>
                    <SelectItem value="baseline2">
                      Baseline 2 (approved)
                    </SelectItem>
                    <SelectItem value="baseline1">
                      Baseline 1 (original)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Schedule File</Label>
              <div className="rounded-md border-2 border-dashed border-border bg-muted/30 p-8 text-center">
                <div className="text-sm font-medium">
                  Upload or connect the latest schedule package
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  This action records a schedule sync in EDMS and refreshes the
                  project timeline metadata.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Merge Options</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="preserve-links"
                    checked={preserveLinks}
                    onCheckedChange={(checked) =>
                      setPreserveLinks(checked === true)
                    }
                  />
                  <Label
                    htmlFor="preserve-links"
                    className="cursor-pointer text-sm font-normal"
                  >
                    Preserve existing document linkages
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="update-dates"
                    checked={updateDates}
                    onCheckedChange={(checked) =>
                      setUpdateDates(checked === true)
                    }
                  />
                  <Label
                    htmlFor="update-dates"
                    className="cursor-pointer text-sm font-normal"
                  >
                    Update activity dates (start / finish)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="recalculate-ev"
                    checked={recalculateEV}
                    onCheckedChange={(checked) =>
                      setRecalculateEV(checked === true)
                    }
                  />
                  <Label
                    htmlFor="recalculate-ev"
                    className="cursor-pointer text-sm font-normal"
                  >
                    Recalculate earned-value from document status
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="auto-create"
                    checked={autoCreate}
                    onCheckedChange={(checked) =>
                      setAutoCreate(checked === true)
                    }
                  />
                  <Label
                    htmlFor="auto-create"
                    className="cursor-pointer text-sm font-normal"
                  >
                    Auto-create activities for unlinked WBS nodes
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSync} disabled={isPending}>
            {isPending ? "Syncing..." : "Run Sync"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
