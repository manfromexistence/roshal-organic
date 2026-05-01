import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const accentClasses = [
  "border-r-chart-1",
  "border-r-chart-2",
  "border-r-chart-3",
  "border-r-chart-4",
  "border-r-chart-5",
];

function getAccentClass(seed: string) {
  const hash = Array.from(seed).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );

  return accentClasses[hash % accentClasses.length] || accentClasses[0];
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
  return (
    <Card
      className={`border-border/70 border-r-4 bg-card/95 shadow-none transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 dark:bg-card/90 ${getAccentClass(title)}`}
    >
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
