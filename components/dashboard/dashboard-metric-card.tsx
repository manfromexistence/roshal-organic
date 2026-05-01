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
    <Card className="border-none bg-card/50 backdrop-blur shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-xs">📊</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {hint ? (
          <p className="text-xs text-muted-foreground mt-1">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
