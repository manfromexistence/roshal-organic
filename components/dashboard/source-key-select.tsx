"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SourceKeyOption {
  value: string;
  label: string;
  description?: string;
}

export function DashboardSourceKeySelect({
  name,
  label,
  options,
  defaultValue,
  helperText,
}: {
  name: string;
  label: string;
  options: SourceKeyOption[];
  defaultValue?: string[];
  helperText?: string;
}) {
  const fallbackValue = defaultValue?.[0] || options[0]?.value || "";
  const [value, setValue] = useState(fallbackValue);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label>{label}</Label>
        {helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(value ? [value] : [])}
      />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select existing bucket" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
