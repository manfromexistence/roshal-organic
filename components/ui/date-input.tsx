"use client";

import { CalendarIcon, X } from "lucide-react";
import * as React from "react";
import type { Matcher } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

function parseDateValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function DateInput({
  value,
  onChange,
  placeholder = "Pick date",
  disabled,
  minValue,
  maxValue,
  className,
  clearLabel = "Clear date",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onChange" | "value"> & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minValue?: string;
  maxValue?: string;
  clearLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = React.useMemo(() => parseDateValue(value), [value]);
  const minDate = React.useMemo(
    () => (minValue ? parseDateValue(minValue) : undefined),
    [minValue],
  );
  const maxDate = React.useMemo(
    () => (maxValue ? parseDateValue(maxValue) : undefined),
    [maxValue],
  );
  const disabledDays = React.useMemo(() => {
    const days: Matcher[] = [];

    if (minDate) {
      days.push({ before: minDate });
    }

    if (maxDate) {
      days.push({ after: maxDate });
    }

    return days.length > 0 ? days : undefined;
  }, [maxDate, minDate]);

  return (
    <div
      data-slot="date-input"
      className={cn("flex min-w-0 items-center gap-2", className)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-9 min-w-0 flex-1 justify-start px-3 text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
            {...props}
          >
            <CalendarIcon className="size-4" />
            <span className="truncate">
              {selectedDate
                ? formatDate(selectedDate, { month: "short" })
                : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            captionLayout="dropdown"
            mode="single"
            selected={selectedDate}
            disabled={disabledDays}
            onSelect={(date) => {
              onChange(date ? formatDateValue(date) : "");
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {value ? (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={clearLabel}
          disabled={disabled}
          onClick={() => onChange("")}
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
