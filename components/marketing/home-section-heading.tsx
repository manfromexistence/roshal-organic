import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeSectionHeading({
  title,
  description,
  ctaHref,
  ctaLabel,
  centered = false,
}: {
  title: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 border-b border-border/70 pb-4 ${
        centered
          ? "items-center text-center"
          : "justify-between md:flex-row md:items-end"
      }`}
    >
      <div className="space-y-3">
        <div className={centered ? "flex justify-center" : "flex"}>
          <span className="h-1.5 w-12 rounded-full bg-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {ctaHref && ctaLabel ? (
        <Button
          asChild
          variant="link"
          className="h-auto justify-start px-0 text-sm font-semibold text-foreground/70 hover:text-foreground"
        >
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
