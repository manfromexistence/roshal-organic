import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getEmojiForTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("product")) return "🛍️";
  if (lowerTitle.includes("stock") && lowerTitle.includes("low")) return "⚠️";
  if (lowerTitle.includes("stock") && lowerTitle.includes("out")) return "❌";
  if (lowerTitle.includes("order")) return "📦";
  if (lowerTitle.includes("user")) return "👥";
  if (lowerTitle.includes("marketing") || lowerTitle.includes("page")) return "📄";
  if (lowerTitle.includes("পণ্য")) return "🛍️";
  if (lowerTitle.includes("স্টক") && lowerTitle.includes("লো")) return "⚠️";
  if (lowerTitle.includes("স্টক") && lowerTitle.includes("শেষ")) return "❌";
  if (lowerTitle.includes("অর্ডার")) return "📦";
  if (lowerTitle.includes("ব্যবহারকারী")) return "👥";
  if (lowerTitle.includes("পেজ")) return "📄";
  return "📊";
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
    <Card className="border-none bg-card/50 backdrop-blur shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-xs">{emoji}</span>
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
