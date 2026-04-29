"use client";

import { toast as sonnerToast } from "sonner";

export function toast({
  title,
  description,
  variant = "default",
}: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}) {
  if (variant === "destructive") {
    sonnerToast.error(title, {
      description,
      className:
        "!border-destructive/40 !bg-destructive !text-destructive-foreground",
      descriptionClassName: "!text-destructive-foreground/90",
    });
    return;
  }

  sonnerToast(title, {
    description,
    className: "!border-border/80 !bg-background !text-foreground",
    descriptionClassName: "!text-muted-foreground",
  });
}
