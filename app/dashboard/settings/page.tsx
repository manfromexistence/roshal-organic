import { MapPin, RefreshCcw, Save, Truck } from "lucide-react";
import Link from "next/link";
import { saveRoshalSiteSettings } from "@/actions/admin";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardDeliveryZonesEditor } from "@/components/dashboard/delivery-zones-editor";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput2 } from "@/components/ui/phone-input-2";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalSiteSettings } from "@/lib/store-content";
import { formatBdt } from "@/lib/store-format";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";

export default async function DashboardSystemSettingsPage() {
  const [locale, siteSettings] = await Promise.all([
    getRoshalLocale(),
    getRoshalSiteSettings(),
    requireRoshalAdmin(),
  ]);
  const enabledZoneCount = siteSettings.deliveryZones.filter(
    (zone) => zone.isEnabled,
  ).length;
  const defaultZone = siteSettings.deliveryZones.find((zone) => zone.isDefault);
  const highestFee = Math.max(
    0,
    ...siteSettings.deliveryZones.map((zone) => zone.fee),
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 pt-6 pb-0">
      <div className="min-w-0 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          System settings
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Store configuration
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Manage brand identity, contact channels, checkout delivery charges,
          and storefront defaults from one real settings page.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          title="Delivery zones"
          value={siteSettings.deliveryZones.length}
          hint={`${enabledZoneCount} zones enabled`}
        />
        <DashboardMetricCard
          title="Default zone"
          value={
            defaultZone ? getLocalizedValue(locale, defaultZone.label) : "-"
          }
          hint={
            defaultZone ? formatBdt(defaultZone.fee, locale) : "No default zone"
          }
        />
        <DashboardMetricCard
          title="Highest delivery fee"
          value={formatBdt(highestFee, locale)}
          hint="Applied by checkout location matching"
        />
      </div>

      <form action={saveRoshalSiteSettings} className="space-y-6">
        <input type="hidden" name="id" value={siteSettings.id} />
        <input type="hidden" name="redirectTo" value="/dashboard/settings" />

        <Accordion
          type="multiple"
          defaultValue={["delivery"]}
          className="space-y-3"
        >
          <AccordionItem
            value="delivery"
            className="rounded-lg border-none bg-card px-4 shadow-sm"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex min-w-0 items-start gap-3">
                <Truck className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block text-base font-semibold">
                    Delivery charge system
                  </span>
                  <span className="block text-sm font-normal text-muted-foreground">
                    Configure checkout fees by customer location.
                  </span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent forceMount>
              <DashboardDeliveryZonesEditor
                locale={locale}
                name="deliveryZonesJson"
                value={siteSettings.deliveryZones}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="contact"
            className="rounded-lg border-none bg-card px-4 shadow-sm"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex min-w-0 items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block text-base font-semibold">
                    Contact and brand
                  </span>
                  <span className="block text-sm font-normal text-muted-foreground">
                    Header, footer, checkout, and support contact values.
                  </span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent
              forceMount
              className="grid min-w-0 gap-5 md:grid-cols-2"
            >
              <Field
                name="brandName"
                label="Brand name"
                defaultValue={siteSettings.brandName}
              />
              <Field
                name="contactEmail"
                label="Contact email"
                defaultValue={siteSettings.contactEmail}
              />
              <Field
                name="contactPhone"
                label="Contact phone"
                defaultValue={siteSettings.contactPhone}
              />
              <Field
                name="whatsappPhone"
                label="WhatsApp phone"
                defaultValue={siteSettings.whatsappPhone}
              />
              <Field
                name="facebookUrl"
                label="Facebook URL"
                defaultValue={siteSettings.facebookUrl}
                className="md:col-span-2"
              />
              <Field
                name="addressEn"
                label="Address (EN)"
                defaultValue={siteSettings.address.en}
              />
              <Field
                name="addressBn"
                label="Address (BN)"
                defaultValue={siteSettings.address.bn}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="storefront"
            className="rounded-lg border-none bg-card px-4 shadow-sm"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="min-w-0">
                <span className="block text-base font-semibold">
                  Storefront defaults
                </span>
                <span className="block text-sm font-normal text-muted-foreground">
                  Shared homepage CTA, layout, card, and spacing defaults.
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent
              forceMount
              className="grid min-w-0 gap-5 md:grid-cols-2"
            >
              <Field
                name="taglineEn"
                label="Tagline (EN)"
                defaultValue={siteSettings.tagline.en}
              />
              <Field
                name="taglineBn"
                label="Tagline (BN)"
                defaultValue={siteSettings.tagline.bn}
              />
              <Field
                name="primaryCtaHref"
                label="Primary CTA href"
                defaultValue={siteSettings.primaryCtaHref}
              />
              <Field
                name="primaryCtaLabelEn"
                label="CTA label (EN)"
                defaultValue={siteSettings.primaryCtaLabel.en}
              />
              <Field
                name="primaryCtaLabelBn"
                label="CTA label (BN)"
                defaultValue={siteSettings.primaryCtaLabel.bn}
              />
              <SelectField
                name="heroLayout"
                label="Hero layout"
                defaultValue={siteSettings.heroLayout}
                options={[
                  { value: "split", label: "split" },
                  { value: "stacked", label: "stacked" },
                ]}
              />
              <SelectField
                name="cardStyle"
                label="Card style"
                defaultValue={siteSettings.cardStyle}
                options={[
                  { value: "soft", label: "soft" },
                  { value: "sharp", label: "sharp" },
                  { value: "minimal", label: "minimal" },
                ]}
              />
              <SelectField
                name="sectionSpacing"
                label="Section spacing"
                defaultValue={siteSettings.sectionSpacing}
                options={[
                  { value: "compact", label: "compact" },
                  { value: "comfortable", label: "comfortable" },
                  { value: "spacious", label: "spacious" },
                ]}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col-reverse gap-3 border-t bg-background pt-4 pb-0 sm:flex-row sm:justify-between">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <RefreshCcw className="size-4" />
              Back to dashboard
            </Link>
          </Button>
          <Button type="submit">
            <Save className="size-4" />
            Save system settings
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  className,
  defaultValue,
  label,
  name,
}: {
  className?: string;
  defaultValue: string;
  label: string;
  name: string;
}) {
  const isPhoneField = name.toLowerCase().includes("phone");

  return (
    <div className={className ? `space-y-2 ${className}` : "space-y-2"}>
      <Label htmlFor={name}>{label}</Label>
      {isPhoneField ? (
        <PhoneInput2 id={name} name={name} defaultValue={defaultValue} />
      ) : (
        <Input id={name} name={name} defaultValue={defaultValue} />
      )}
    </div>
  );
}

function SelectField({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue: string;
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <DashboardFormSelect
        name={name}
        defaultValue={defaultValue}
        options={options}
      />
    </div>
  );
}
