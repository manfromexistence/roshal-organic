"use client";

import { useEffect } from "react";
import { toast as sonnerToast } from "sonner";
import { toast } from "@/hooks/use-toast";

type ProductCatalogToastStatus = "created" | "deleted";

const toastCopy: Record<
  ProductCatalogToastStatus,
  { description: string; title: string }
> = {
  created: {
    title: "New product added",
    description: "The product is now visible in the All Products list.",
  },
  deleted: {
    title: "Product deleted",
    description: "The product was removed from the storefront catalog.",
  },
};

export function ProductCreatedToast({
  status,
}: {
  status?: ProductCatalogToastStatus;
}) {
  useEffect(() => {
    if (!status) {
      return;
    }

    sonnerToast.dismiss();
    toast(toastCopy[status]);
  }, [status]);

  return null;
}
