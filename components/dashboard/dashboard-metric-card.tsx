import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardMetricCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <Card className="border-border/70 bg-card/95 shadow-none dark:bg-card/90">
      <CardHeader className="space-y-2">
        <CardTitle className="text-[0.75rem] font-medium uppercase tracking-[0.22em] text-foreground/70 dark:text-foreground/82">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        {hint ? (
          <p className="text-sm leading-6 text-foreground/65 dark:text-foreground/76">
            {hint}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
