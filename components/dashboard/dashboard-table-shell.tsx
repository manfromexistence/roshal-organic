import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardTableShell({
  title,
  description,
  children,
  action,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "w-full min-w-0 max-w-none overflow-hidden border-none bg-card p-0 shadow-sm",
        className,
      )}
    >
      <CardHeader className="flex flex-col gap-2 p-4 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <CardTitle className="font-headline text-base">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-sm leading-5">
              {description}
            </CardDescription>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="min-w-0 p-0">{children}</CardContent>
    </Card>
  );
}
