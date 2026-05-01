import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DashboardInsightDatum {
  key: string;
  label: string;
  value: number;
}

function defaultValueFormatter(value: number) {
  return value.toLocaleString();
}

function getInsightEmoji(title: string) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("payment")) return "\u{1F4B3}";
  if (lowerTitle.includes("order")) return "\u{1F4E6}";
  if (lowerTitle.includes("product") || lowerTitle.includes("catalog")) {
    return "\u{1F6CD}\uFE0F";
  }
  if (lowerTitle.includes("user") || lowerTitle.includes("account")) {
    return "\u{1F465}";
  }
  if (lowerTitle.includes("category") || lowerTitle.includes("navigation")) {
    return "\u{1F5C2}\uFE0F";
  }
  if (lowerTitle.includes("delivery") || lowerTitle.includes("zone")) {
    return "\u{1F69A}";
  }

  return "\u2728";
}

export function DashboardInsightCard({
  title,
  description,
  data,
  totalLabel,
  valueFormatter = defaultValueFormatter,
  className,
}: {
  title: string;
  description?: string;
  data: DashboardInsightDatum[];
  totalLabel?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const emoji = getInsightEmoji(title);

  return (
    <Card
      className={cn(
        "border-none bg-card/50 p-0 shadow-sm backdrop-blur transition hover:bg-card hover:shadow-md",
        className,
      )}
    >
      <CardHeader className="flex flex-col gap-3 p-4 pb-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm"
            >
              {emoji}
            </span>
            <CardTitle className="text-base text-foreground">{title}</CardTitle>
          </div>
          {description ? (
            <CardDescription className="max-w-2xl leading-6 text-foreground/68 dark:text-foreground/78">
              {description}
            </CardDescription>
          ) : null}
        </div>
        <div className="space-y-1 text-left sm:text-right">
          <p className="text-xl font-semibold tracking-tight text-foreground">
            {valueFormatter(totalValue)}
          </p>
          {totalLabel ? (
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/62 dark:text-foreground/76">
              {totalLabel}
            </p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 p-4 pt-0">
        {data.length > 0 ? (
          data.map((item) => {
            const percentage =
              totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;

            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-md border bg-background/60 px-3 py-2 transition hover:bg-accent/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {percentage}% of total
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-sm font-mono">
                  {valueFormatter(item.value)}
                </Badge>
              </div>
            );
          })
        ) : (
          <div className="rounded-md border border-dashed bg-muted/25 p-4 text-sm text-muted-foreground">
            No data available for this view yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
