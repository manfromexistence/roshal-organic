"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useState } from "react";

interface AccordionItemProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        {Icon && <Icon className="size-4" />}
        <span className="flex-1 text-left">{title}</span>
        <ChevronRight
          className={`size-4 transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-3 text-sm text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}
