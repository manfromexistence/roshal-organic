import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const accentClasses = [
  "border-r-primary bg-primary/10",
  "border-r-secondary bg-secondary/80",
  "border-r-accent bg-accent/80",
  "border-r-muted-foreground bg-muted/70",
  "border-r-destructive bg-destructive/10",
];

function getEmojiForTitle(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("revenue") || lowerTitle.includes("sales")) {
    return "\u{1F4B0}";
  }
  if (lowerTitle.includes("product")) return "\u{1F6CD}\uFE0F";
  if (lowerTitle.includes("stock") && lowerTitle.includes("low")) {
    return "\u26A0\uFE0F";
  }
  if (lowerTitle.includes("stock") && lowerTitle.includes("out")) {
    return "\u274C";
  }
  if (lowerTitle.includes("order") || lowerTitle.includes("delivery")) {
    return "\u{1F4E6}";
  }
  if (lowerTitle.includes("user") || lowerTitle.includes("customer")) {
    return "\u{1F465}";
  }
  if (lowerTitle.includes("marketing") || lowerTitle.includes("page")) {
    return "\u{1F4C4}";
  }
  if (lowerTitle.includes("category")) return "\u{1F5C2}\uFE0F";
  if (lowerTitle.includes("payment")) return "\u{1F4B3}";
  if (lowerTitle.includes("zone") || lowerTitle.includes("fee")) {
    return "\u{1F69A}";
  }

  return "\u2728";
}

function getAccentClass(title: string) {
  const index =
    Array.from(title).reduce((sum, character) => {
      return sum + character.charCodeAt(0);
    }, 0) % accentClasses.length;

  return accentClasses[index];
}

export function DashboardMetricCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: number | string;
  hint?: string;
}) {
  const emoji = getEmojiForTitle(title);
  const displayValue = String(value);
  const displayHint = hint || "Live dashboard data";

  return (
    <Card
      className={cn(
        "min-w-0 overflow-hidden border-none border-r-[5px] p-0 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        getAccentClass(title),
      )}
    >
      <CardContent className="min-w-0 p-2.5 sm:p-3">
        <div className="flex min-w-0 items-start justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0 max-w-full flex-1 space-y-1">
            <p
              className="max-w-full truncate text-xs font-semibold leading-4 text-foreground sm:text-sm"
              title={title}
            >
              {title}
            </p>
            <div
              className="max-w-full truncate text-xl font-extrabold leading-tight tracking-tight text-foreground sm:text-2xl"
              title={displayValue}
            >
              {displayValue}
            </div>
            <p
              className="max-w-full truncate text-[11px] leading-4 text-muted-foreground sm:text-xs"
              title={displayHint}
            >
              {displayHint}
            </p>
          </div>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs sm:h-7 sm:w-7 sm:text-sm">
            <span aria-hidden="true">{emoji}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
