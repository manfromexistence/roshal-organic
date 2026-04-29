"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        className:
          "!border-border/80 !bg-background !text-foreground !shadow-xl",
        descriptionClassName: "!text-muted-foreground",
        classNames: {
          toast:
            "!rounded-md !border !border-border/80 !bg-background !text-foreground !shadow-xl",
          title: "!text-sm !font-semibold !text-foreground",
          description: "!text-sm !text-muted-foreground",
          content: "!gap-1.5",
          icon: "!text-current",
          closeButton:
            "!border-border/70 !bg-background !text-muted-foreground hover:!bg-muted hover:!text-foreground",
          success:
            "!border-primary/30 !bg-[color:color-mix(in_oklch,var(--background)_86%,var(--primary)_14%)] !text-foreground",
          error:
            "!border-destructive/40 !bg-destructive !text-destructive-foreground",
          warning:
            "!border-primary/25 !bg-[color:color-mix(in_oklch,var(--background)_84%,var(--primary)_16%)] !text-foreground",
          info: "!border-primary/25 !bg-[color:color-mix(in_oklch,var(--background)_88%,var(--primary)_12%)] !text-foreground",
          loading: "!border-border/80 !bg-card !text-foreground",
        },
      }}
      style={
        {
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
