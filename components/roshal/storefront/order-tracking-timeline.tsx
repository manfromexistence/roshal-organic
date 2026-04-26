import { CheckCircle2, CircleDashed, Clock3, XCircle } from "lucide-react";
import { getLocalizedValue } from "@/lib/roshal/locale";
import { getRoshalOrderTrackingSteps } from "@/lib/roshal/orders";
import type { RoshalLocale, RoshalOrder } from "@/lib/roshal/types";

export function OrderTrackingTimeline({
  order,
  locale,
}: {
  order: RoshalOrder;
  locale: RoshalLocale;
}) {
  const steps = getRoshalOrderTrackingSteps(order);

  return (
    <div className="grid gap-3">
      {steps.map((step) => {
        const Icon =
          order.status === "cancelled" && step.key === "cancelled"
            ? XCircle
            : step.completed
              ? CheckCircle2
              : step.highlighted
                ? Clock3
                : CircleDashed;

        return (
          <div
            key={step.key}
            className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4"
          >
            <Icon className="mt-0.5 size-5 text-primary" />
            <div className="space-y-1">
              <p className="font-medium">
                {getLocalizedValue(locale, step.label)}
              </p>
              <p className="text-sm text-muted-foreground">
                {getLocalizedValue(locale, step.description)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
