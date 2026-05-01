import { saveRoshalSiteSettings } from "@/actions/admin";
import { DashboardInsightCard } from "@/components/dashboard/dashboard-insight-card";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardDeliveryZonesEditor } from "@/components/dashboard/delivery-zones-editor";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput2 } from "@/components/ui/phone-input-2";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalSiteSettings } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getLocalizedValue } from "@/lib/store-locale";

export default async function DashboardThemePage() {
  const [locale, siteSettings] = await Promise.all([
    getRoshalLocale(),
    getRoshalSiteSettings(),
    requireRoshalAdmin(),
  ]);
  const enabledZoneCount = siteSettings.deliveryZones.filter(
    (zone) => zone.isEnabled,
  ).length;
  const defaultZoneCount = siteSettings.deliveryZones.filter(
    (zone) => zone.isDefault,
  ).length;
  const highestFee = Math.max(
    0,
    ...siteSettings.deliveryZones.map((zone) => zone.fee),
  );
  const zoneStateData = [
    {
      key: "enabled",
      label: locale === "bn" ? "চালু জোন" : "Enabled zones",
      value: enabledZoneCount,
    },
    {
      key: "disabled",
      label: locale === "bn" ? "বন্ধ জোন" : "Disabled zones",
      value: siteSettings.deliveryZones.length - enabledZoneCount,
    },
  ];
  const deliveryFeeData = siteSettings.deliveryZones.map((zone) => ({
    key: zone.id,
    label: getLocalizedValue(locale, zone.label),
    value: zone.fee,
  }));

  return (
    <div className="min-w-0 space-y-6 p-6">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "স্টোরফ্রন্ট সেটিংস" : "Storefront settings"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "ব্র্যান্ড ও UI" : "Brand and UI"}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          title={locale === "bn" ? "ডেলিভারি জোন" : "Delivery zones"}
          value={siteSettings.deliveryZones.length}
          hint={`${defaultZoneCount} default zone configured`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "চালু জোন" : "Enabled zones"}
          value={enabledZoneCount}
          hint={`${siteSettings.deliveryZones.length - enabledZoneCount} disabled zones`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "সর্বোচ্চ ডেলিভারি ফি" : "Highest delivery fee"}
          value={`৳${highestFee}`}
          hint={
            defaultZoneCount
              ? locale === "bn"
                ? "ডিফল্ট জোন কনফিগার করা আছে"
                : "A default zone is configured"
              : locale === "bn"
                ? "এখনো ডিফল্ট জোন সেট নেই"
                : "No default zone is configured yet"
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardInsightCard
          title={locale === "bn" ? "জোন স্ট্যাটাস" : "Zone status"}
          description={
            locale === "bn"
              ? "কোন কোন ডেলিভারি জোন বর্তমানে লাইভ আছে।"
              : "See which delivery zones are currently live."
          }
          totalLabel={locale === "bn" ? "জোন" : "Zones"}
          data={zoneStateData}
        />
        <DashboardInsightCard
          title={locale === "bn" ? "ডেলিভারি ফি ম্যাপ" : "Delivery fee map"}
          description={
            locale === "bn"
              ? "অঞ্চলভিত্তিক ডেলিভারি চার্জ তুলনা করুন।"
              : "Compare the configured delivery charge across service zones."
          }
          totalLabel={locale === "bn" ? "ফি (BDT)" : "Fees (BDT)"}
          data={deliveryFeeData}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "bn" ? "সাইট থিম" : "Site theme"}</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0">
          <form
            action={saveRoshalSiteSettings}
            className="grid min-w-0 gap-5 md:grid-cols-2"
          >
            <input type="hidden" name="id" value={siteSettings.id} />
            <Field
              name="brandName"
              label="Brand Name"
              defaultValue={siteSettings.brandName}
            />
            <Field
              name="primaryCtaHref"
              label="Primary CTA Href"
              defaultValue={siteSettings.primaryCtaHref}
            />
            <Field
              name="taglineBn"
              label="Tagline (BN)"
              defaultValue={siteSettings.tagline.bn}
            />
            <Field
              name="taglineEn"
              label="Tagline (EN)"
              defaultValue={siteSettings.tagline.en}
            />
            <Field
              name="primaryCtaLabelBn"
              label="CTA Label (BN)"
              defaultValue={siteSettings.primaryCtaLabel.bn}
            />
            <Field
              name="primaryCtaLabelEn"
              label="CTA Label (EN)"
              defaultValue={siteSettings.primaryCtaLabel.en}
            />
            <Field
              name="contactPhone"
              label="Contact Phone"
              defaultValue={siteSettings.contactPhone}
            />
            <Field
              name="contactEmail"
              label="Contact Email"
              defaultValue={siteSettings.contactEmail}
            />
            <Field
              name="whatsappPhone"
              label="WhatsApp Phone"
              defaultValue={siteSettings.whatsappPhone}
            />
            <Field
              name="facebookUrl"
              label="Facebook URL"
              defaultValue={siteSettings.facebookUrl}
            />
            <Field
              name="addressBn"
              label="Address (BN)"
              defaultValue={siteSettings.address.bn}
            />
            <Field
              name="addressEn"
              label="Address (EN)"
              defaultValue={siteSettings.address.en}
            />
            <div className="space-y-2">
              <Label>Hero Layout</Label>
              <DashboardFormSelect
                name="heroLayout"
                defaultValue={siteSettings.heroLayout}
                options={[
                  { value: "split", label: "split" },
                  { value: "stacked", label: "stacked" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label>Card Style</Label>
              <DashboardFormSelect
                name="cardStyle"
                defaultValue={siteSettings.cardStyle}
                options={[
                  { value: "soft", label: "soft" },
                  { value: "sharp", label: "sharp" },
                  { value: "minimal", label: "minimal" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label>Section Spacing</Label>
              <DashboardFormSelect
                name="sectionSpacing"
                defaultValue={siteSettings.sectionSpacing}
                options={[
                  { value: "compact", label: "compact" },
                  { value: "comfortable", label: "comfortable" },
                  { value: "spacious", label: "spacious" },
                ]}
              />
            </div>
            <div className="md:col-span-2">
              <DashboardDeliveryZonesEditor
                locale={locale}
                name="deliveryZonesJson"
                value={siteSettings.deliveryZones}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">
                {locale === "bn" ? "সেটিংস সেভ করুন" : "Save settings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  const isPhoneField = name.toLowerCase().includes("phone");

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {isPhoneField ? (
        <PhoneInput2 id={name} name={name} defaultValue={defaultValue} />
      ) : (
        <Input id={name} name={name} defaultValue={defaultValue} />
      )}
    </div>
  );
}
