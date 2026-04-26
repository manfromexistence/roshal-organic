"use client";

import { use, useState } from "react";

// TODO: Implement metrics components when available
// import { MetricsView } from "@/components/metrics/metrics-view";
// import type { ChartLayoutItem } from "@/components/metrics/utils/chart-types";
// import { DEFAULT_CHART_LAYOUT } from "@/components/metrics/utils/chart-types";
// import { WidgetsHeader } from "@/components/widgets/header";

type ChartLayoutItem = any;
const DEFAULT_CHART_LAYOUT: ChartLayoutItem[] = [];

interface MetricsContentProps {
  chartLayoutPromise: Promise<ChartLayoutItem[]>;
}

export function MetricsContent({ chartLayoutPromise }: MetricsContentProps) {
  const _initialLayout = chartLayoutPromise
    ? use(chartLayoutPromise)
    : DEFAULT_CHART_LAYOUT;

  const [_isEditing, _setIsEditing] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-end py-6">
        {/* <WidgetsHeader
          isEditing={isEditing}
          onToggleEditing={() => setIsEditing((prev) => !prev)}
        /> */}
        <div className="text-muted-foreground">Metrics view coming soon</div>
      </div>
      {/* <MetricsView initialLayout={initialLayout} isEditing={isEditing} /> */}
      <div className="p-4 border rounded-lg bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Metrics dashboard placeholder
        </p>
      </div>
    </div>
  );
}
