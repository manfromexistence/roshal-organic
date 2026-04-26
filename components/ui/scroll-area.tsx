"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { useComposedRefs } from "@/lib/compose-refs";
import { cn } from "@/lib/utils";

type ScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> & {
  showHorizontalScrollbar?: boolean;
  viewportClassName?: string;
  viewportProps?: React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.Viewport
  >;
  viewportRef?: React.Ref<HTMLDivElement>;
};

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      type = "hover",
      scrollHideDelay = 600,
      showHorizontalScrollbar = false,
      viewportClassName,
      viewportProps,
      viewportRef,
      ...props
    },
    ref,
  ) => {
    const { className: viewportPropsClassName, ...rest } = viewportProps ?? {};
    const composedViewportRef = useComposedRefs(viewportRef);

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        data-slot="scroll-area"
        type={type}
        scrollHideDelay={scrollHideDelay}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={composedViewportRef}
          data-slot="scroll-area-viewport"
          className={cn(
            "size-full min-w-0 rounded-[inherit]",
            viewportClassName,
            viewportPropsClassName,
          )}
          {...rest}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        {showHorizontalScrollbar ? (
          <ScrollBar orientation="horizontal" />
        ) : null}
        <ScrollAreaPrimitive.Corner
          data-slot="scroll-area-corner"
          className="z-[100]"
        />
      </ScrollAreaPrimitive.Root>
    );
  },
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    data-slot="scroll-area-scrollbar"
    className={cn(
      "z-[100] flex touch-none select-none rounded-full bg-border/30 p-px transition-[opacity,background-color] duration-150 ease-out data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100",
      orientation === "vertical" && "h-full w-3 border-l border-l-transparent",
      orientation === "horizontal" &&
        "h-3 flex-col border-t border-t-transparent",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      data-slot="scroll-area-thumb"
      className="relative flex-1 rounded-full bg-border/80 hover:bg-border"
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
