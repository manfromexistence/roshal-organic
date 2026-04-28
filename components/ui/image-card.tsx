import Image from "next/image";
import type * as React from "react";

import { cn } from "@/lib/utils";

function ImageCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex min-w-0 flex-col gap-0 rounded-2xl border border-border/70 bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function ImageCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid min-w-0 auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-0 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function ImageCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function ImageCardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function ImageCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function ImageCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("min-w-0 px-6", className)}
      {...props}
    />
  );
}

function ImageCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex min-w-0 items-center px-6 [.border-t]:pt-6",
        className,
      )}
      {...props}
    />
  );
}

function ImageCardImage({
  className,
  src,
  alt,
  ...props
}: React.ComponentProps<typeof Image>) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      loading="lazy"
      decoding="async"
      className={cn(
        "object-cover transition-transform duration-300 group-hover:scale-105",
        className,
      )}
      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
      {...props}
    />
  );
}

export {
  ImageCard,
  ImageCardAction,
  ImageCardContent,
  ImageCardDescription,
  ImageCardFooter,
  ImageCardHeader,
  ImageCardImage,
  ImageCardTitle,
};
