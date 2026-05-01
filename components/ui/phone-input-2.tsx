"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { normalizeBangladeshPhoneInput } from "@/lib/store-phone";
import { cn } from "@/lib/utils";

type PhoneInputSize = "sm" | "default" | "lg";

interface PhoneInput2Props {
  autoComplete?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  size?: PhoneInputSize;
  value?: string;
}

export function PhoneInput2({
  autoComplete = "tel",
  className,
  defaultValue,
  disabled = false,
  id,
  name,
  onChange,
  placeholder = "017XXXXXXXX",
  required = false,
  size = "default",
  value,
}: PhoneInput2Props) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue || "");
    }
  }, [defaultValue, isControlled]);

  const normalizedValue = useMemo(
    () =>
      normalizeBangladeshPhoneInput(isControlled ? value || "" : internalValue),
    [internalValue, isControlled, value],
  );

  const inputHeight = size === "sm" ? "h-8" : size === "lg" ? "h-10" : "h-9";

  return (
    <Input
      id={id}
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete={autoComplete}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      value={normalizedValue}
      maxLength={11}
      className={cn(inputHeight, className)}
      onChange={(event) => {
        const normalized = normalizeBangladeshPhoneInput(event.target.value);

        if (!isControlled) {
          setInternalValue(normalized);
        }

        onChange?.(normalized);
      }}
    />
  );
}
