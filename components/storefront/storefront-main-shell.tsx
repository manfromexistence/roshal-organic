"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function StorefrontMainShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthUtilityPage =
    pathname === "/forgot-password" || pathname === "/reset-password";

  return (
    <main
      className={cn(
        "w-full min-w-0 overflow-x-clip",
        isAuthUtilityPage
          ? "shrink-0 grow-0 pb-0"
          : "min-h-[calc(100vh-18rem)] flex-1 pb-20 md:pb-0",
      )}
    >
      {children}
    </main>
  );
}
