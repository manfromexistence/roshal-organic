"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MarketingPageOffset({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthUtilityPage =
    pathname === "/forgot-password" || pathname === "/reset-password";
  const needsHeaderOffset = pathname !== "/products";

  return (
    <div
      className={cn(
        isAuthUtilityPage
          ? "flex min-h-full flex-1 flex-col pt-32"
          : needsHeaderOffset && "pt-[6.5rem] md:pt-[7.4rem]",
      )}
    >
      {children}
    </div>
  );
}
