"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { linkDocumentsToActivity } from "@/actions/schedule";
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

interface LinkDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: Array<{ id: string; name: string; wbs: string }>;
  documents: Array<{ code: string; title: string; rev: string }>;
  projectId: string;
}

export function LinkDocumentsDialog({
  open,
  onOpenChange,
  activities,
  documents,
  projectId,
}: LinkDocumentsDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      setSelectedActivityId("");
      setSelectedDocs(new Set());
      return;
    }

    if (activities.length === 1) {
      setSelectedActivityId(activities[0].id);
    }
  }, [activities, open]);

  const toggleDoc = (code: string) => {
    setSelectedDocs((previous) => {
      const next = new Set(previous);

      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }

      return next;
    });
  };

  const handleLink = () => {
    if (!selectedActivityId) {
      toast({
        title: "No activity selected",
        description: "Please select an activity to link documents to",
        variant: "destructive",
      });
      return;
    }

    if (selectedDocs.size === 0) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document to link",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await linkDocumentsToActivity({
        projectId,
        activityId: selectedActivityId,
        documentCodes: Array.from(selectedDocs),
      });

      if (!result.success) {
        toast({
          title: "Linking failed",
          description: result.error?.message || "Unknown error",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Documents linked",
        description: `${selectedDocs.size} document(s) linked to the selected activity.`,
      });
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Link
          </div>
          <DialogTitle>Link Documents to Activity</DialogTitle>
          <DialogDescription>
            Select documents to associate with a schedule activity for progress
            tracking.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4 pr-4">
            <div className="space-y-2">
              <Label>Target Activity</Label>
              <Select
                value={selectedActivityId}
                onValueChange={setSelectedActivityId}
                disabled={activities.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an activity..." />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id}>
                      {activity.id} - {activity.name} (WBS {activity.wbs})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No schedule activities found for this project.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">
                Select Documents to Link
              </Label>
              {documents.length === 0 ? (
                <div className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  No project documents found to link.
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto rounded-md border border-border">
                  {documents.map((doc) => (
                    <label
                      key={doc.code}
                      htmlFor={`doc-${doc.code}`}
                      className="flex cursor-pointer items-center gap-3 border-b border-border p-3 last:border-b-0 hover:bg-accent/50"
                    >
                      <Checkbox
                        id={`doc-${doc.code}`}
                        checked={selectedDocs.has(doc.code)}
                        onCheckedChange={() => toggleDoc(doc.code)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-xs font-medium">
                          {doc.code}
                        </div>
                        <div className="truncate text-sm">{doc.title}</div>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        Rev {doc.rev || "-"}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleLink}
            disabled={
              selectedDocs.size === 0 ||
              isPending ||
              activities.length === 0 ||
              documents.length === 0
            }
          >
            {isPending
              ? "Linking..."
              : `Link ${selectedDocs.size > 0 ? `${selectedDocs.size} ` : ""}Documents`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
