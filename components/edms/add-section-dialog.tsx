"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextCode: string;
  onCreateSection: (section: {
    code: string;
    title: string;
    required: number;
    collected: number;
    docs: Array<{ code: string; title: string; status: string }>;
    rule: string;
  }) => void;
}

export function AddSectionDialog({
  open,
  onOpenChange,
  nextCode,
  onCreateSection,
}: AddSectionDialogProps) {
  const [code, setCode] = useState(nextCode);
  const [title, setTitle] = useState("");
  const [count, setCount] = useState("12");
  const [rule, setRule] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setCode(nextCode);
    setTitle("");
    setCount("12");
    setRule("");
  }, [nextCode, open]);

  const handleAdd = () => {
    if (!code || !title) {
      toast({
        title: "Missing required fields",
        description: "Section code and title are required",
        variant: "destructive",
      });
      return;
    }

    onCreateSection({
      code,
      title,
      required: Number.parseInt(count, 10) || 0,
      collected: 0,
      docs: [],
      rule,
    });

    toast({
      title: "Section added",
      description: `${code} is now part of the data book structure.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Data Book
          </div>
          <DialogTitle>Add Data Book Section</DialogTitle>
          <DialogDescription>
            Create a new section in the data book structure for organizing
            deliverables.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="grid gap-4 py-4 pr-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Section Code</Label>
              <Input
                className="font-mono"
                placeholder="SEC-09"
                value={code}
                onChange={(event) => setCode(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Document Count</Label>
              <Input
                type="number"
                placeholder="12"
                value={count}
                onChange={(event) => setCount(event.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Section Title</Label>
              <Input
                placeholder="e.g. HSE Records & Permits"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Auto-Populate Rule</Label>
              <Input
                className="font-mono"
                placeholder="e.g. *-HSE-* OR status=IFC"
                value={rule}
                onChange={(event) => setRule(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Documents matching this pattern will auto-file to this section.
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!code || !title}>
            Add Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
