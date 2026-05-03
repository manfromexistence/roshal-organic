"use client";

import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { submitDashboardDeleteAndReload } from "@/lib/dashboard-action-feedback";
import { cn } from "@/lib/utils";

export function DeleteConfirmationButton({
  action,
  buttonLabel,
  className,
  description,
  id,
  redirectTo,
  title,
}: {
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
  className?: string;
  description: string;
  id: string;
  redirectTo: string;
  title: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          className={cn("w-fit", className)}
        >
          <Trash2 className="size-4" />
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form
            action={action}
            className="w-full sm:w-auto"
            onSubmit={submitDashboardDeleteAndReload}
          >
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Button
              type="submit"
              variant="destructive"
              className="w-full sm:w-auto"
            >
              Delete
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
