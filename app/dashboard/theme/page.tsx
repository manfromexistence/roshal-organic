import { saveRoshalSiteSettings } from "@/actions/admin";
import { DashboardDeliveryZonesEditor } from "@/components/dashboard/delivery-zones-editor";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalSiteSettings } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function DashboardThemePage() {
  const [locale, siteSettings] = await Promise.all([
    getRoshalLocale(),
    getRoshalSiteSettings(),
    requireRoshalAdmin(),
  ]);

  return (
    <div className="min-w-0 space-y-6 p-4 md:p-6">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "স্টোরফ্রন্ট সেটিংস" : "Storefront settings"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "ব্র্যান্ড ও UI" : "Brand and UI"}
        </h1>
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
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} />
    </div>
  );
}
