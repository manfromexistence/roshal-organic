"use client";

import { GlobeIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as BasePhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  normalizeBangladeshPhoneInput,
  toBangladeshPhoneInputValue,
} from "@/lib/store-phone";
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

const PhoneInputContext = createContext<{
  size: PhoneInputSize;
}>({
  size: "default",
});

type RoshalPhoneInputProps = {
  "aria-invalid"?: boolean;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange?: (value: BasePhoneInput.Value) => void;
  placeholder?: string;
  required?: boolean;
  size?: PhoneInputSize;
  value?: BasePhoneInput.Value | BasePhoneInput.ExternalValue;
};

function RoshalPhoneInput({
  className,
  size = "default",
  onChange,
  value,
  ...props
}: RoshalPhoneInputProps) {
  return (
    <PhoneInputContext.Provider value={{ size }}>
      <BasePhoneInput.default
        className={cn(
          "flex w-full",
          props["aria-invalid"] &&
            "[&_*[data-slot=combobox-trigger]]:border-destructive [&_*[data-slot=combobox-trigger]]:ring-destructive/50",
          className,
        )}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        defaultCountry="BD"
        countries={["BD"]}
        countryCallingCodeEditable={false}
        value={value || undefined}
        onChange={(nextValue) =>
          onChange?.(nextValue || ("" as BasePhoneInput.Value))
        }
        {...props}
      />
    </PhoneInputContext.Provider>
  );
}

function InputComponent({ className, ...props }: ComponentProps<typeof Input>) {
  const { size } = useContext(PhoneInputContext);

  return (
    <Input
      className={cn(
        "rounded-s-none focus:z-10",
        size === "sm" && "h-8",
        size === "lg" && "h-10",
        className,
      )}
      {...props}
    />
  );
}

type CountryEntry = {
  label: string;
  value: BasePhoneInput.Country | undefined;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: BasePhoneInput.Country;
  options: CountryEntry[];
  onChange: (country: BasePhoneInput.Country) => void;
};

function CountrySelect({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) {
  const { size } = useContext(PhoneInputContext);
  const [searchValue, setSearchValue] = useState("");

  const filteredCountries = useMemo(() => {
    if (!searchValue) {
      return countryList;
    }

    return countryList.filter(({ label }) =>
      label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [countryList, searchValue]);

  return (
    <Combobox
      items={filteredCountries}
      value={selectedCountry || ""}
      onValueChange={(country: BasePhoneInput.Country | null) => {
        if (country) {
          onChange(country);
        }
      }}
    >
      <ComboboxTrigger
        render={
          <Button
            variant="outline"
            size={size === "default" ? "default" : size}
            className={cn(
              "flex gap-1 rounded-s-md rounded-e-none border-e-0 px-2.5 py-0 leading-none hover:bg-transparent focus:z-10 data-pressed:bg-transparent",
              disabled && "opacity-50",
            )}
            disabled={disabled}
          >
            <span className="sr-only">
              <ComboboxValue />
            </span>
            <FlagComponent
              country={selectedCountry}
              countryName={selectedCountry}
            />
          </Button>
        }
      />
      <ComboboxContent className="w-80 *:data-[slot=input-group]:bg-transparent">
        <ComboboxInput
          placeholder="Search country"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          showTrigger={false}
          className="rounded-none border-0 px-0 py-2.5 shadow-none outline-none focus-visible:border-0 focus-visible:ring-0"
        />
        <ComboboxSeparator />
        <ComboboxEmpty className="px-4 py-2.5 text-sm">
          No country found.
        </ComboboxEmpty>
        <ComboboxList className="max-h-80">
          {filteredCountries.map((item) =>
            item.value ? (
              <ComboboxItem
                key={item.value}
                value={item.value}
                className="flex items-center gap-2"
              >
                <FlagComponent country={item.value} countryName={item.label} />
                <span className="flex-1 text-sm">{item.label}</span>
                <span className="text-sm text-foreground/50">
                  +{BasePhoneInput.getCountryCallingCode(item.value)}
                </span>
              </ComboboxItem>
            ) : null,
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function FlagComponent({ country, countryName }: BasePhoneInput.FlagProps) {
  const Flag = country ? flags[country] : null;

  return (
    <span className="flex h-4 w-4 items-center justify-center [&_svg:not([class*='size-'])]:size-full [&_svg:not([class*='size-'])]:rounded-[5px]">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <GlobeIcon className="size-4 opacity-60" />
      )}
    </span>
  );
}

export function PhoneInput2({
  autoComplete = "tel",
  className,
  defaultValue,
  disabled = false,
  id,
  name,
  onChange,
  placeholder = "01805-767300",
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

  const normalizedValue = isControlled ? value || "" : internalValue;
  const phoneValue = useMemo(
    () => toBangladeshPhoneInputValue(normalizedValue),
    [normalizedValue],
  );

  return (
    <RoshalPhoneInput
      id={id}
      name={name}
      autoComplete={autoComplete}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      value={phoneValue || undefined}
      size={size}
      className={className}
      onChange={(nextValue) => {
        const normalized = normalizeBangladeshPhoneInput(nextValue || "");

        if (!isControlled) {
          setInternalValue(normalized);
        }

        onChange?.(normalized);
      }}
    />
  );
}
