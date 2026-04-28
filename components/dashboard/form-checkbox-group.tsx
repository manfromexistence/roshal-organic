"use client";

import { useId, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupOption {
  value: string;
  label: string;
  description?: string;
}

export function DashboardFormCheckboxGroup({
  name,
  label,
  options,
  defaultValue,
  helperText,
}: {
  name: string;
  label: string;
  options: CheckboxGroupOption[];
  defaultValue: string[];
  helperText?: string;
}) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);
  const groupId = useId();
  const selectedLookup = useMemo(
    () => new Set(selectedValues),
    [selectedValues],
  );

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>{label}</Label>
        {helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
      <input type="hidden" name={name} value={JSON.stringify(selectedValues)} />
      <div className="grid gap-3 rounded-xl border border-border/70 bg-muted/15 p-4 md:grid-cols-2">
        {options.map((option) => {
          const checked = selectedLookup.has(option.value);
          const checkboxId = `${groupId}-${option.value}`;

          return (
            <div
              key={option.value}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/70 p-3 text-sm"
            >
              <Checkbox
                id={checkboxId}
                checked={checked}
                onCheckedChange={(value) => {
                  setSelectedValues((current) => {
                    if (value) {
                      return current.includes(option.value)
                        ? current
                        : [...current, option.value];
                    }

                    return current.filter(
                      (currentValue) => currentValue !== option.value,
                    );
                  });
                }}
              />
              <span className="space-y-1">
                <Label htmlFor={checkboxId} className="block font-medium">
                  {option.label}
                </Label>
                {option.description ? (
                  <span className="block text-xs text-muted-foreground">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
