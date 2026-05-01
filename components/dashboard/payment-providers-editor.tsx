"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { normalizeRoshalPaymentMethodKey } from "@/lib/store-payment-methods";
import type { RoshalLocale, RoshalPaymentOption } from "@/lib/store-types";

interface PaymentProviderFormState {
  key: string;
  enabled: boolean;
  mode: "manual" | "gateway";
  labelBn: string;
  labelEn: string;
  merchantLabelBn: string;
  merchantLabelEn: string;
  accountType: string;
  accountNumber: string;
  instructionsBn: string;
  instructionsEn: string;
  guideImageUrl: string;
  sortOrder: string;
}

function toFormState(option: RoshalPaymentOption): PaymentProviderFormState {
  return {
    key: option.key,
    enabled: option.enabled,
    mode: option.mode,
    labelBn: option.label.bn,
    labelEn: option.label.en,
    merchantLabelBn: option.merchantLabel.bn,
    merchantLabelEn: option.merchantLabel.en,
    accountType: option.accountType,
    accountNumber: option.accountNumber,
    instructionsBn: option.instructions.bn,
    instructionsEn: option.instructions.en,
    guideImageUrl: option.guideImageUrl,
    sortOrder: String(option.sortOrder),
  };
}

function normalizeProviderState(
  provider: PaymentProviderFormState,
  index: number,
): RoshalPaymentOption {
  const key = normalizeRoshalPaymentMethodKey(
    provider.key,
    `payment_provider_${index + 1}`,
  );
  const labelEn = provider.labelEn.trim() || key;
  const labelBn = provider.labelBn.trim() || labelEn;

  return {
    key,
    enabled: provider.enabled,
    mode: provider.mode,
    label: {
      bn: labelBn,
      en: labelEn,
    },
    merchantLabel: {
      bn: provider.merchantLabelBn.trim(),
      en: provider.merchantLabelEn.trim(),
    },
    accountType: provider.accountType.trim() || "mobile-wallet",
    accountNumber: provider.accountNumber.trim(),
    instructions: {
      bn: provider.instructionsBn.trim(),
      en: provider.instructionsEn.trim(),
    },
    guideImageUrl: provider.guideImageUrl.trim(),
    requiresProof: false,
    sortOrder: Number.isFinite(Number(provider.sortOrder))
      ? Number(provider.sortOrder)
      : index,
  };
}

function nextProviderKey(providers: PaymentProviderFormState[]) {
  const existingKeys = new Set(providers.map((provider) => provider.key));

  for (let index = 1; index <= 50; index += 1) {
    const key = `custom_payment_${index}`;

    if (!existingKeys.has(key)) {
      return key;
    }
  }

  return `custom_payment_${Date.now()}`;
}

function createNewProvider(
  providers: PaymentProviderFormState[],
): PaymentProviderFormState {
  const key = nextProviderKey(providers);

  return {
    key,
    enabled: true,
    mode: "manual",
    labelBn: "New payment provider",
    labelEn: "New payment provider",
    merchantLabelBn: "",
    merchantLabelEn: "",
    accountType: "mobile-wallet",
    accountNumber: "",
    instructionsBn: "",
    instructionsEn: "",
    guideImageUrl: "",
    sortOrder: String(providers.length),
  };
}

export function DashboardPaymentProvidersEditor({
  locale,
  name,
  value,
}: {
  locale: RoshalLocale;
  name: string;
  value: RoshalPaymentOption[];
}) {
  const [providers, setProviders] = useState<PaymentProviderFormState[]>(
    value.map(toFormState),
  );

  const serializedValue = useMemo(() => {
    const seenKeys = new Set<string>();

    return JSON.stringify(
      providers.map(normalizeProviderState).filter((provider) => {
        if (seenKeys.has(provider.key)) {
          return false;
        }

        seenKeys.add(provider.key);
        return true;
      }),
    );
  }, [providers]);

  const updateProvider = (
    key: string,
    updater: (provider: PaymentProviderFormState) => PaymentProviderFormState,
  ) => {
    setProviders((current) =>
      current.map((provider) =>
        provider.key === key ? updater(provider) : provider,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serializedValue} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            {locale === "bn" ? "পেমেন্ট প্রোভাইডার" : "Payment providers"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === "bn"
              ? "Checkout payment option যোগ, remove, চালু/বন্ধ বা reorder করুন।"
              : "Add, remove, enable, or reorder the checkout payment options."}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            setProviders((current) => [...current, createNewProvider(current)])
          }
        >
          <Plus className="size-4" />
          {locale === "bn" ? "প্রোভাইডার যোগ করুন" : "Add provider"}
        </Button>
      </div>

      {providers.length > 0 ? (
        <Accordion type="multiple" className="space-y-3">
          {providers.map((provider, index) => (
            <AccordionItem
              key={provider.key}
              value={provider.key}
              className="rounded-lg border border-border/70 bg-background/50 px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex min-w-0 flex-1 flex-wrap items-center gap-3 text-left">
                  <span className="font-semibold">
                    {provider.labelEn || provider.labelBn || provider.key}
                  </span>
                  <Badge variant={provider.enabled ? "secondary" : "outline"}>
                    {provider.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Badge variant="outline">{provider.mode}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent
                forceMount
                className="space-y-5 data-[state=closed]:hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={(checked) =>
                        updateProvider(provider.key, (current) => ({
                          ...current,
                          enabled: checked,
                        }))
                      }
                    />
                    <Label>
                      {locale === "bn"
                        ? "Checkout-এ দেখাবে"
                        : "Visible at checkout"}
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setProviders((current) =>
                        current.filter((item) => item.key !== provider.key),
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                    {locale === "bn" ? "রিমুভ" : "Remove"}
                  </Button>
                </div>

                <div className="grid min-w-0 gap-5 md:grid-cols-2">
                  <Field
                    label="Provider key"
                    value={provider.key}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        key: normalizeRoshalPaymentMethodKey(
                          nextValue,
                          current.key,
                        ),
                      }))
                    }
                  />
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <Select
                      value={provider.mode}
                      onValueChange={(nextValue) =>
                        updateProvider(provider.key, (current) => ({
                          ...current,
                          mode: nextValue === "gateway" ? "gateway" : "manual",
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">manual</SelectItem>
                        <SelectItem value="gateway">gateway</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Field
                    label="Label (BN)"
                    value={provider.labelBn}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        labelBn: nextValue,
                      }))
                    }
                  />
                  <Field
                    label="Label (EN)"
                    value={provider.labelEn}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        labelEn: nextValue,
                      }))
                    }
                  />
                  <Field
                    label="Merchant Label (BN)"
                    value={provider.merchantLabelBn}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        merchantLabelBn: nextValue,
                      }))
                    }
                  />
                  <Field
                    label="Merchant Label (EN)"
                    value={provider.merchantLabelEn}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        merchantLabelEn: nextValue,
                      }))
                    }
                  />
                  <Field
                    label="Payment number / internal note"
                    value={provider.accountNumber}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        accountNumber: nextValue,
                      }))
                    }
                  />
                  <Field
                    label="Account type"
                    value={provider.accountType}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        accountType: nextValue,
                      }))
                    }
                  />
                  <Field
                    label="Sort order"
                    type="number"
                    value={provider.sortOrder || String(index)}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        sortOrder: nextValue,
                      }))
                    }
                  />
                  <Field
                    label="Guide image URL"
                    value={provider.guideImageUrl}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        guideImageUrl: nextValue,
                      }))
                    }
                  />
                </div>

                <div className="grid min-w-0 gap-5 md:grid-cols-2">
                  <TextField
                    label="Checkout note (BN)"
                    value={provider.instructionsBn}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        instructionsBn: nextValue,
                      }))
                    }
                  />
                  <TextField
                    label="Checkout note (EN)"
                    value={provider.instructionsEn}
                    onChange={(nextValue) =>
                      updateProvider(provider.key, (current) => ({
                        ...current,
                        instructionsEn: nextValue,
                      }))
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
          {locale === "bn"
            ? "কোনো পেমেন্ট প্রোভাইডার সেট করা নেই। Checkout order নেওয়ার আগে অন্তত একটি provider যোগ করুন।"
            : "No payment providers are configured. Add at least one provider before accepting checkout orders."}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function TextField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
