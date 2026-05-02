"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PurchaseOptionRow = {
  id: string;
  size: string;
  amount: string;
  price: string;
  compareAtPrice: string;
  inventory: string;
  isDefault: boolean;
};

function safeParseOptions(raw: string): PurchaseOptionRow[] {
  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item, index) => {
        const source = item as Partial<
          Record<keyof PurchaseOptionRow, unknown>
        >;

        return {
          id: String(source.id || `option-${index + 1}`),
          size: String(source.size || ""),
          amount: String(source.amount || ""),
          price: String(source.price ?? ""),
          compareAtPrice: String(source.compareAtPrice ?? ""),
          inventory: String(source.inventory ?? ""),
          isDefault: source.isDefault === true,
        };
      });
  } catch {
    return [];
  }
}

function createOption(index: number): PurchaseOptionRow {
  return {
    id: `option-${index + 1}`,
    size: "",
    amount: "",
    price: "",
    compareAtPrice: "",
    inventory: "",
    isDefault: index === 0,
  };
}

function toOptionalNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number.parseInt(value || "0", 10);

  return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
}

export function ProductPurchaseOptionsField({
  defaultValue,
  hasError = false,
  hint,
  label,
  name,
}: {
  defaultValue: string;
  hasError?: boolean;
  hint?: string;
  label: string;
  name: string;
}) {
  const [options, setOptions] = useState<PurchaseOptionRow[]>(() =>
    safeParseOptions(defaultValue),
  );
  const serializedValue = useMemo(() => {
    const cleanedOptions = options
      .map((option) => ({
        ...option,
        amount: option.amount.trim(),
        compareAtPrice: toOptionalNumber(option.compareAtPrice),
        id: option.id.trim(),
        inventory: toOptionalNumber(option.inventory),
        price: toOptionalNumber(option.price),
        size: option.size.trim(),
      }))
      .filter((option) => option.size || option.amount);
    const hasDefault = cleanedOptions.some((option) => option.isDefault);

    return JSON.stringify(
      cleanedOptions.map((option, index) => ({
        ...option,
        id: option.id || `option-${index + 1}`,
        isDefault: hasDefault ? option.isDefault : index === 0,
      })),
      null,
      2,
    );
  }, [options]);

  const updateOption = (
    index: number,
    key: keyof PurchaseOptionRow,
    value: string | boolean,
  ) => {
    setOptions((current) =>
      current.map((option, optionIndex) => {
        if (optionIndex !== index) {
          return key === "isDefault" && value === true
            ? { ...option, isDefault: false }
            : option;
        }

        return { ...option, [key]: value };
      }),
    );
  };

  const removeOption = (index: number) => {
    setOptions((current) => {
      const next = current.filter((_, optionIndex) => optionIndex !== index);

      if (next.length > 0 && !next.some((option) => option.isDefault)) {
        return next.map((option, optionIndex) =>
          optionIndex === 0 ? { ...option, isDefault: true } : option,
        );
      }

      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>{label}</Label>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>

      <input type="hidden" name={name} value={serializedValue} />

      <div
        className={cn(
          "space-y-3 rounded-xl border border-border/70 bg-muted/10 p-3",
          hasError && "border-destructive ring-2 ring-destructive/20",
        )}
      >
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No size or amount options yet. Add one when this product has
            variants such as 250g, 500g, 1kg, or 5L.
          </p>
        ) : (
          options.map((option, index) => (
            <div
              key={`${name}-${index}`}
              className="space-y-3 rounded-lg border border-border/60 bg-background/70 p-3"
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Size"
                  value={option.size}
                  placeholder="500g"
                  onChange={(value) => updateOption(index, "size", value)}
                />
                <Field
                  label="Amount"
                  value={option.amount}
                  placeholder="1 pack"
                  onChange={(value) => updateOption(index, "amount", value)}
                />
                <Field
                  label="Price"
                  hasError={hasError}
                  type="number"
                  value={option.price}
                  onChange={(value) => updateOption(index, "price", value)}
                />
                <Field
                  label="Compare price"
                  type="number"
                  value={option.compareAtPrice}
                  onChange={(value) =>
                    updateOption(index, "compareAtPrice", value)
                  }
                />
                <Field
                  label="Stock"
                  hasError={hasError}
                  type="number"
                  value={option.inventory}
                  onChange={(value) => updateOption(index, "inventory", value)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label
                  htmlFor={`${name}-${index}-default`}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Checkbox
                    id={`${name}-${index}-default`}
                    checked={option.isDefault}
                    onCheckedChange={(value) =>
                      updateOption(index, "isDefault", Boolean(value))
                    }
                  />
                  Default option
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="size-4" />
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() =>
            setOptions((current) => [...current, createOption(current.length)])
          }
        >
          <Plus className="size-4" />
          Add option
        </Button>
      </div>
    </div>
  );
}

function Field({
  hasError = false,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  hasError?: boolean;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        aria-invalid={hasError || undefined}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
