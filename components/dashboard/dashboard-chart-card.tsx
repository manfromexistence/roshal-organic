"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export interface DashboardChartDatum {
  key: string;
  label: string;
  value: number;
  color?: string;
}

const chartPalette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function normalizeChartData(data: DashboardChartDatum[]) {
  return data.map((item, index) => ({
    ...item,
    fill: item.color || chartPalette[index % chartPalette.length],
  }));
}

function buildChartConfig(data: ReturnType<typeof normalizeChartData>) {
  return Object.fromEntries(
    data.map((item) => [
      item.key,
      {
        label: item.label,
        color: item.fill,
      },
    ]),
  );
}

function shortenLabel(value: string, maxLength = 12) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
}

function defaultValueFormatter(value: number) {
  return value.toLocaleString();
}

export function DashboardBarChartCard({
  title,
  description,
  data,
  totalLabel,
  valueFormatter = defaultValueFormatter,
  className,
}: {
  title: string;
  description?: string;
  data: DashboardChartDatum[];
  totalLabel?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}) {
  const chartData = normalizeChartData(data);
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const chartConfig = buildChartConfig(chartData);

  return (
    <Card
      className={cn(
        "border-none bg-card/50 backdrop-blur shadow-sm",
        className,
      )}
    >
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-base text-foreground">{title}</CardTitle>
          {description ? (
            <CardDescription className="max-w-2xl leading-6 text-foreground/68 dark:text-foreground/78">
              {description}
            </CardDescription>
          ) : null}
        </div>
        <div className="space-y-1 text-left sm:text-right">
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {valueFormatter(totalValue)}
          </p>
          {totalLabel ? (
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/62 dark:text-foreground/76">
              {totalLabel}
            </p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {totalValue > 0 ? (
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 16, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={16}
                tickFormatter={(value) => shortenLabel(String(value))}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => valueFormatter(Number(value))}
                  />
                }
              />
              <Bar dataKey="value" radius={8}>
                {chartData.map((item) => (
                  <Cell key={item.key} fill={item.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="rounded-md border border-dashed border-border/70 bg-muted/25 p-6 text-sm text-foreground/68 dark:text-foreground/78">
            No data available for this view yet.
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {chartData.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-muted/15 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium text-foreground/80 dark:text-foreground/88">
                  {item.label}
                </span>
              </div>
              <Badge variant="secondary" className="font-mono tabular-nums">
                {valueFormatter(item.value)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPieChartCard({
  title,
  description,
  data,
  totalLabel,
  valueFormatter = defaultValueFormatter,
  className,
}: {
  title: string;
  description?: string;
  data: DashboardChartDatum[];
  totalLabel?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}) {
  const chartData = normalizeChartData(data);
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const chartConfig = buildChartConfig(chartData);

  return (
    <Card
      className={cn(
        "border-none bg-card/50 backdrop-blur shadow-sm",
        className,
      )}
    >
      <CardHeader className="space-y-2">
        <CardTitle className="text-base text-foreground">{title}</CardTitle>
        {description ? (
          <CardDescription className="max-w-2xl leading-6 text-foreground/68 dark:text-foreground/78">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_15rem] xl:items-center">
        {totalValue > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-[320px] w-full max-w-[320px]"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => valueFormatter(Number(value))}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                innerRadius={72}
                outerRadius={102}
                paddingAngle={3}
                strokeWidth={0}
              >
                {chartData.map((item) => (
                  <Cell key={item.key} fill={item.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                      return null;
                    }

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-semibold"
                        >
                          {valueFormatter(totalValue)}
                        </tspan>
                        {totalLabel ? (
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy + 24}
                            className="fill-muted-foreground text-[11px] uppercase tracking-[0.2em]"
                          >
                            {totalLabel}
                          </tspan>
                        ) : null}
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="rounded-md border border-dashed border-border/70 bg-muted/25 p-6 text-sm text-foreground/68 dark:text-foreground/78">
            No data available for this view yet.
          </div>
        )}

        <div className="grid gap-3">
          {chartData.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-muted/15 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium text-foreground/80 dark:text-foreground/88">
                  {item.label}
                </span>
              </div>
              <Badge variant="secondary" className="font-mono tabular-nums">
                {valueFormatter(item.value)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
