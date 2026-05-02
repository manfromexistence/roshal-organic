"use client";

import { useEffect } from "react";
import { toast as sonnerToast } from "sonner";
import { toast } from "@/hooks/use-toast";

const recentToastKeys = new Map<string, number>();
const toastDedupeWindowMs = 2000;

export function DashboardFormStatusToast({
  errorMessage,
  successMessage,
}: {
  errorMessage?: string;
  successMessage?: string;
}) {
  useEffect(() => {
    const message = errorMessage || successMessage;

    if (!message) {
      return;
    }

    const now = Date.now();
    const urlKey =
      typeof window === "undefined"
        ? "server"
        : `${window.location.pathname}${window.location.search}`;
    const toastKey = `${errorMessage ? "error" : "success"}:${message}:${urlKey}`;
    const lastShownAt = recentToastKeys.get(toastKey) ?? 0;

    if (now - lastShownAt < toastDedupeWindowMs) {
      return;
    }

    recentToastKeys.set(toastKey, now);
    sonnerToast.dismiss();

    for (const [key, timestamp] of recentToastKeys) {
      if (now - timestamp > toastDedupeWindowMs) {
        recentToastKeys.delete(key);
      }
    }

    toast({
      title: errorMessage ? "Form needs attention" : "Saved",
      description: message,
      variant: errorMessage ? "destructive" : "default",
    });
  }, [errorMessage, successMessage]);

  return null;
}
