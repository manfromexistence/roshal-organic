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
  sonnerToast(title, {
    description,
    ...(variant === "destructive" && {
      style: {
        background: "oklch(var(--destructive))",
        color: "oklch(var(--destructive-foreground))",
      },
    }),
  });
}
