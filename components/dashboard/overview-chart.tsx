"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: "Jan", total: 4000 },
  { name: "Feb", total: 3000 },
  { name: "Mar", total: 2000 },
  { name: "Apr", total: 2780 },
  { name: "May", total: 1890 },
  { name: "Jun", total: 2390 },
  { name: "Jul", total: 3490 },
  { name: "Aug", total: 4000 },
  { name: "Sep", total: 5000 },
  { name: "Oct", total: 6000 },
  { name: "Nov", total: 8000 },
  { name: "Dec", total: 10000 },
];

export function OverviewChart() {
  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>
          Monthly revenue overview for the year.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            total: {
              label: "Revenue",
              color: "var(--chart-1)",
            },
          }}
          className="h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
