"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { defaultRoshalDeliverySettings } from "@/lib/store-delivery";
import type {
  RoshalDeliverySettings,
  RoshalDeliveryZone,
  RoshalLocale,
} from "@/lib/store-types";

interface DeliveryZoneFormState {
  id: string;
  labelBn: string;
  labelEn: string;
  fee: string;
  cityPatterns: string;
  postalCodes: string;
  addressKeywords: string;
  isEnabled: boolean;
  isDefault: boolean;
  sortOrder: string;
}

function listToText(values: string[]) {
  return values.join(", ");
}

function textToList(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );
}

function toFormState(zone: RoshalDeliveryZone): DeliveryZoneFormState {
  return {
    id: zone.id,
    labelBn: zone.label.bn,
    labelEn: zone.label.en,
    fee: String(zone.fee),
    cityPatterns: listToText(zone.cityPatterns),
    postalCodes: listToText(zone.postalCodes),
    addressKeywords: listToText(zone.addressKeywords),
    isEnabled: zone.isEnabled,
    isDefault: zone.isDefault,
    sortOrder: String(zone.sortOrder),
  };
}

function normalizeFormState(zones: DeliveryZoneFormState[]) {
  const nextZones = zones.slice(0, 2).map((zone, index) => ({
    ...zone,
    isDefault: false,
    sortOrder: String(index),
  }));
  const enabledZones = nextZones.filter((zone) => zone.isEnabled);
  const defaultZoneId =
    enabledZones.find((zone) => zone.id === "delivery-outside-dhaka")?.id ||
    enabledZones[0]?.id ||
    "";

  return nextZones.map((zone) => ({
    ...zone,
    isDefault: zone.id === defaultZoneId,
  }));
}

export function DashboardDeliveryZonesEditor({
  locale,
  name,
  settings,
  value,
}: {
  locale: RoshalLocale;
  name: string;
  settings: RoshalDeliverySettings;
  value: RoshalDeliveryZone[];
}) {
  const [zones, setZones] = useState<DeliveryZoneFormState[]>(
    normalizeFormState(value.map(toFormState)),
  );
  const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(
    settings.enableFreeDelivery,
  );
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(
    String(settings.freeDeliveryThreshold),
  );

  const serializedValue = useMemo(
    () =>
      JSON.stringify(
        normalizeFormState(zones).map((zone, index) => ({
          id: zone.id,
          label: {
            bn: zone.labelBn.trim(),
            en: zone.labelEn.trim(),
          },
          fee: Math.max(0, Number(zone.fee) || 0),
          cityPatterns: textToList(zone.cityPatterns),
          postalCodes: textToList(zone.postalCodes),
          addressKeywords: textToList(zone.addressKeywords),
          isEnabled: zone.isEnabled,
          isDefault: zone.isDefault,
          sortOrder: Number(zone.sortOrder || index),
        })),
      ),
    [zones],
  );

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serializedValue} />
      <input
        type="hidden"
        name="enableFreeDelivery"
        value={freeDeliveryEnabled ? "true" : "false"}
      />
      <input
        type="hidden"
        name="freeDeliveryThreshold"
        value={String(Math.max(0, Number(freeDeliveryThreshold) || 0))}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            {locale === "bn" ? "ডেলিভারি জোন" : "Delivery zones"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === "bn"
              ? "Inside Dhaka এবং Outside Dhaka - এই দুই ডেলিভারি চার্জ এখান থেকে নিয়ন্ত্রণ করুন।"
              : "Edit the two checkout delivery charges: Inside Dhaka and Outside Dhaka. Dhaka district uses the inside charge; every other district uses the outside charge."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {zones.map((zone, index) => (
          <Card key={zone.id} className="border-border/70">
            <CardHeader className="gap-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle>
                    {zone.labelEn ||
                      zone.labelBn ||
                      `${locale === "bn" ? "জোন" : "Zone"} ${index + 1}`}
                  </CardTitle>
                  <CardDescription>
                    {locale === "bn"
                      ? "কমা দিয়ে একাধিক শহর, পোস্ট কোড, বা ঠিকানা কীওয়ার্ড আলাদা করুন।"
                      : "Separate multiple cities, postal codes, or address keywords with commas."}
                  </CardDescription>
                </div>

                <div className="rounded-md border bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {index === 0 ? "Dhaka district" : "All other districts"}
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field
                label={locale === "bn" ? "জোন নাম (BN)" : "Zone name (BN)"}
                value={zone.labelBn}
                onChange={(nextValue) =>
                  setZones((current) =>
                    current.map((currentZone) =>
                      currentZone.id === zone.id
                        ? { ...currentZone, labelBn: nextValue }
                        : currentZone,
                    ),
                  )
                }
              />
              <Field
                label={locale === "bn" ? "জোন নাম (EN)" : "Zone name (EN)"}
                value={zone.labelEn}
                onChange={(nextValue) =>
                  setZones((current) =>
                    current.map((currentZone) =>
                      currentZone.id === zone.id
                        ? { ...currentZone, labelEn: nextValue }
                        : currentZone,
                    ),
                  )
                }
              />
              <Field
                label={
                  locale === "bn" ? "ডেলিভারি ফি (BDT)" : "Delivery fee (BDT)"
                }
                type="number"
                value={zone.fee}
                onChange={(nextValue) =>
                  setZones((current) =>
                    current.map((currentZone) =>
                      currentZone.id === zone.id
                        ? { ...currentZone, fee: nextValue }
                        : currentZone,
                    ),
                  )
                }
              />
              <Field
                label={locale === "bn" ? "সোর্ট অর্ডার" : "Sort order"}
                type="number"
                value={zone.sortOrder}
                onChange={(nextValue) =>
                  setZones((current) =>
                    current.map((currentZone) =>
                      currentZone.id === zone.id
                        ? { ...currentZone, sortOrder: nextValue }
                        : currentZone,
                    ),
                  )
                }
              />
              <Field
                className="md:col-span-2"
                label={locale === "bn" ? "শহর / লোকেশন" : "Cities / locations"}
                value={zone.cityPatterns}
                onChange={(nextValue) =>
                  setZones((current) =>
                    current.map((currentZone) =>
                      currentZone.id === zone.id
                        ? { ...currentZone, cityPatterns: nextValue }
                        : currentZone,
                    ),
                  )
                }
              />
              <Field
                label={locale === "bn" ? "পোস্ট কোড" : "Postal codes"}
                value={zone.postalCodes}
                onChange={(nextValue) =>
                  setZones((current) =>
                    current.map((currentZone) =>
                      currentZone.id === zone.id
                        ? { ...currentZone, postalCodes: nextValue }
                        : currentZone,
                    ),
                  )
                }
              />
              <Field
                label={locale === "bn" ? "ঠিকানার কীওয়ার্ড" : "Address keywords"}
                value={zone.addressKeywords}
                onChange={(nextValue) =>
                  setZones((current) =>
                    current.map((currentZone) =>
                      currentZone.id === zone.id
                        ? { ...currentZone, addressKeywords: nextValue }
                        : currentZone,
                    ),
                  )
                }
              />

              <div className="flex flex-wrap gap-6 md:col-span-2">
                <ToggleField
                  label={locale === "bn" ? "জোন চালু" : "Zone enabled"}
                  checked={zone.isEnabled}
                  onCheckedChange={(checked) =>
                    setZones((current) =>
                      normalizeFormState(
                        current.map((currentZone) =>
                          currentZone.id === zone.id
                            ? { ...currentZone, isEnabled: checked }
                            : currentZone,
                        ),
                      ),
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <Card className="border-border/70">
        <CardHeader className="gap-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle>Free delivery threshold</CardTitle>
              <CardDescription>
                Waive delivery charge when the order subtotal reaches the
                configured amount.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 rounded-md border bg-muted/30 px-3 py-2">
              <Switch
                checked={freeDeliveryEnabled}
                onCheckedChange={setFreeDeliveryEnabled}
              />
              <Label>{freeDeliveryEnabled ? "Enabled" : "Disabled"}</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <Field
            label="Free delivery from subtotal (BDT)"
            type="number"
            value={freeDeliveryThreshold}
            onChange={setFreeDeliveryThreshold}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFreeDeliveryEnabled(
                defaultRoshalDeliverySettings.enableFreeDelivery,
              );
              setFreeDeliveryThreshold(
                String(defaultRoshalDeliverySettings.freeDeliveryThreshold),
              );
            }}
          >
            Reset defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  className,
  label,
  onChange,
  type = "text",
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <div className={className ? `space-y-2 ${className}` : "space-y-2"}>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function ToggleField({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      <Label>{label}</Label>
    </div>
  );
}
