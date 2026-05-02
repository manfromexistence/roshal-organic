"use client";

import { useEffect } from "react";
import { toast as sonnerToast } from "sonner";
import { toast } from "@/hooks/use-toast";

const recentToastKeys = new Map<string, number>();
const toastDedupeWindowMs = 2000;

const cmsSaveMessages: Record<string, { description: string; title: string }> =
  {
    "page-created": {
      title: "Marketing page created",
      description: "The new page is ready for CMS section editing.",
    },
    page: {
      title: "Page settings saved",
      description: "The public page settings were updated successfully.",
    },
    "section-created": {
      title: "CMS section created",
      description: "The new content section was added successfully.",
    },
    section: {
      title: "CMS section saved",
      description: "The selected content section was updated successfully.",
    },
    "review-created": {
      title: "Review saved",
      description: "The product review was added successfully.",
    },
    "review-updated": {
      title: "Review updated",
      description: "The product review visibility was updated.",
    },
    "review-deleted": {
      title: "Review deleted",
      description: "The product review was removed from the dashboard.",
    },
  };

export function CmsSaveToast({ status }: { status?: string }) {
  useEffect(() => {
    if (!status) {
      return;
    }

    const now = Date.now();
    const urlKey =
      typeof window === "undefined"
        ? "server"
        : `${window.location.pathname}${window.location.search}`;
    const toastKey = `${status}:${urlKey}`;
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

    const message = cmsSaveMessages[status] || {
      title: "CMS changes saved",
      description: "The dashboard update completed successfully.",
    };

    toast(message);
  }, [status]);

  return null;
}
