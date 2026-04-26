"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SecondaryMenuItem {
  label: string;
  path: string;
}

function isActivePath(pathname: string, itemPath: string) {
  if (itemPath === "/settings") {
    return pathname === itemPath;
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

export function SecondaryMenu({
  children,
  items = [],
}: {
  children?: React.ReactNode;
  items?: SecondaryMenuItem[];
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        <nav className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Button
              key={item.path}
              variant={
                isActivePath(pathname, item.path) ? "secondary" : "ghost"
              }
              asChild
            >
              <Link href={item.path}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      ) : null}
      {children}
    </div>
  );
}
