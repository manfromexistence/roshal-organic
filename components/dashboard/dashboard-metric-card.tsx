import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const accentClasses = [
  "border-r-primary",
  "border-r-secondary",
  "border-r-accent",
  "border-r-muted-foreground",
  "border-r-destructive",
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

  return (
    <Card
      className={cn(
        "min-w-0 overflow-hidden border-none border-r-[6px] bg-card/50 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-card hover:shadow-md",
        getAccentClass(title),
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <CardTitle className="min-w-0 break-words text-sm font-medium leading-5 text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
          <span aria-hidden="true">{emoji}</span>
        </div>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="break-words text-2xl font-bold tracking-tight">
          {value}
        </div>
        {hint ? (
          <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
            {hint}
          </p>
        ) : (
          <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
            Live dashboard data
          </p>
        )}
      </CardContent>
    </Card>
  );
}
