"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MarketingPageOffset({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const needsHeaderOffset = pathname !== "/" && pathname !== "/products";

  return <div className={cn(needsHeaderOffset && "pt-22")}>{children}</div>;
}
