"use client";

import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function ProductCreatedToast({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    toast({
      title: "New product added",
      description: "The product is now visible in the All Products list.",
    });
  }, [enabled]);

  return null;
}
