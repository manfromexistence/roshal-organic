import {
  saveRoshalPaymentSettings,
  saveRoshalSiteSettings,
} from "@/actions/admin";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardDeliveryZonesEditor } from "@/components/dashboard/delivery-zones-editor";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/store-auth";
import {
  getRoshalPaymentSettings,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import type {
  RoshalPaymentMethod,
  RoshalPaymentOption,
  RoshalSiteSettings,
} from "@/lib/store-types";

const paymentMethodOrder: RoshalPaymentMethod[] = [
  "cash_on_delivery",
  "card",
  "bkash",
  "nagad",
];

const saveMessages: Record<string, string> = {
  delivery: "Delivery charge settings saved successfully.",
  payment: "Payment settings saved successfully.",
};

export default async function DashboardPaymentsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    saved?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, paymentSettings, siteSettings] = await Promise.all([
    getRoshalLocale(),
    getRoshalPaymentSettings(),
    getRoshalSiteSettings(),
    requireRoshalAdmin(),
  ]);

  const getOption = (key: RoshalPaymentMethod): RoshalPaymentOption =>
    paymentSettings.options.find((option) => option.key === key) || {
      key,
      enabled: false,
      mode: "manual",
      label: { bn: key, en: key },
      merchantLabel: { bn: "", en: "" },
      accountType: "cash-on-delivery",
      accountNumber: "",
      instructions: { bn: "", en: "" },
      guideImageUrl: "",
      requiresProof: false,
      sortOrder: paymentMethodOrder.indexOf(key),
    };

  const visibleOptions = paymentMethodOrder.map((key) => getOption(key));
  const enabledCount = visibleOptions.filter((option) => option.enabled).length;
  const gatewayModeCount = visibleOptions.filter(
    (option) => option.enabled && option.mode === "gateway",
  ).length;
  const manualReviewCount = visibleOptions.filter(
    (option) =>
      option.enabled &&
      option.mode === "manual" &&
      option.key !== "cash_on_delivery",
  ).length;
  return (
    <div className="min-w-0 space-y-6 p-6 pb-0">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "পেমেন্ট সেটিংস" : "Payment settings"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "ক্যাশ অন ডেলিভারি সেটিংস" : "Payment settings"}
        </h1>
      </div>

      {resolvedSearchParams.saved ? (
        <Alert>
          <AlertDescription>
            {saveMessages[resolvedSearchParams.saved] ||
              "Settings saved successfully."}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          title={locale === "bn" ? "চালু অপশন" : "Enabled options"}
          value={enabledCount}
          hint={`${visibleOptions.length} supported methods`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "গেটওয়ে মোড" : "Gateway modes"}
          value={gatewayModeCount}
          hint="Card or provider-backed methods"
        />
        <DashboardMetricCard
          title={locale === "bn" ? "ম্যানুয়াল রিভিউ" : "Manual review"}
          value={manualReviewCount}
          hint="Wallet methods checked by admin"
        />
      </div>

      {/* Payment availability, mode distribution, and verification policy insight panels are intentionally hidden per client request. */}

      <form action={saveRoshalSiteSettings} className="min-w-0">
        <HiddenSiteSettingsInputs siteSettings={siteSettings} />
        <input
          type="hidden"
          name="redirectTo"
          value="/dashboard/payments?saved=delivery"
        />
        <Card className="border-none bg-card shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle>
              {locale === "bn" ? "ডেলিভারি চার্জ" : "Delivery charges"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === "bn"
                ? "Dhaka district হলে Inside Dhaka charge, অন্য district হলে Outside Dhaka charge checkout-এ বসবে।"
                : "Dhaka district uses the Inside Dhaka fee; every other district uses the Outside Dhaka fee at checkout."}
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="delivery-charges">
                <AccordionTrigger>
                  {locale === "bn"
                    ? "ডেলিভারি চার্জ এডিট করুন"
                    : "Edit delivery charges"}
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="space-y-5 data-[state=closed]:hidden"
                >
                  <DashboardDeliveryZonesEditor
                    locale={locale}
                    name="deliveryZonesJson"
                    value={siteSettings.deliveryZones}
                  />
                  <Button type="submit">
                    {locale === "bn"
                      ? "ডেলিভারি চার্জ সেভ করুন"
                      : "Save delivery charges"}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </form>

      <form action={saveRoshalPaymentSettings} className="min-w-0 space-y-6">
        <input type="hidden" name="id" value={paymentSettings.id} />
        <input
          type="hidden"
          name="redirectTo"
          value="/dashboard/payments?saved=payment"
        />

        <Card className="border-none bg-card shadow-sm">
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "পেমেন্ট মেথড" : "Payment methods"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === "bn"
                ? "প্রতিটি মেথড খুলে প্রয়োজনীয় সেটিংস আপডেট করুন।"
                : "Open only the method you need to update."}
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-3">
              {paymentMethodOrder.map((key) => {
                const option = getOption(key);

                return (
                  <AccordionItem
                    key={key}
                    value={key}
                    className="rounded-lg border border-border/70 bg-background/50 px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-3 text-left">
                        <span className="font-semibold">
                          {locale === "bn" ? option.label.bn : option.label.en}
                        </span>
                        <Badge
                          variant={option.enabled ? "secondary" : "outline"}
                        >
                          {option.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Badge variant="outline">{option.mode}</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent
                      forceMount
                      className="space-y-5 data-[state=closed]:hidden"
                    >
                      <div className="grid min-w-0 gap-5 md:grid-cols-2">
                        <DashboardFormCheckbox
                          name={`${key}Enabled`}
                          defaultChecked={option.enabled}
                          label={locale === "bn" ? "চালু" : "Enabled"}
                        />
                        <Field
                          name={`${key}LabelBn`}
                          label="Label (BN)"
                          defaultValue={option.label.bn}
                        />
                        <Field
                          name={`${key}LabelEn`}
                          label="Label (EN)"
                          defaultValue={option.label.en}
                        />
                        <Field
                          name={`${key}MerchantLabelBn`}
                          label="Merchant Label (BN)"
                          defaultValue={option.merchantLabel.bn}
                        />
                        <Field
                          name={`${key}MerchantLabelEn`}
                          label="Merchant Label (EN)"
                          defaultValue={option.merchantLabel.en}
                        />
                        <Field
                          name={`${key}AccountNumber`}
                          label="Optional internal note"
                          defaultValue={option.accountNumber}
                        />
                        <Field
                          name={`${key}AccountType`}
                          label="Account Type"
                          defaultValue={option.accountType}
                        />
                        <div className="space-y-2">
                          <Label>{locale === "bn" ? "মোড" : "Mode"}</Label>
                          <DashboardFormSelect
                            name={`${key}Mode`}
                            defaultValue={option.mode}
                            options={[
                              { value: "manual", label: "manual" },
                              { value: "gateway", label: "gateway" },
                            ]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>
                            {locale === "bn" ? "সোর্ট অর্ডার" : "Sort order"}
                          </Label>
                          <Input
                            name={`${key}SortOrder`}
                            type="number"
                            defaultValue={String(option.sortOrder)}
                          />
                        </div>
                      </div>

                      <div className="grid min-w-0 gap-5 md:grid-cols-2">
                        <TextField
                          name={`${key}InstructionsBn`}
                          label="Checkout note (BN)"
                          defaultValue={option.instructions.bn}
                          rows={4}
                        />
                        <TextField
                          name={`${key}InstructionsEn`}
                          label="Checkout note (EN)"
                          defaultValue={option.instructions.en}
                          rows={4}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        <Button type="submit">
          {locale === "bn" ? "পেমেন্ট সেটিংস সেভ করুন" : "Save payment settings"}
        </Button>
      </form>
    </div>
  );
}

function HiddenSiteSettingsInputs({
  siteSettings,
}: {
  siteSettings: RoshalSiteSettings;
}) {
  return (
    <>
      <input type="hidden" name="id" value={siteSettings.id} />
      <input type="hidden" name="brandName" value={siteSettings.brandName} />
      <input type="hidden" name="taglineBn" value={siteSettings.tagline.bn} />
      <input type="hidden" name="taglineEn" value={siteSettings.tagline.en} />
      <input
        type="hidden"
        name="contactPhone"
        value={siteSettings.contactPhone}
      />
      <input
        type="hidden"
        name="contactEmail"
        value={siteSettings.contactEmail}
      />
      <input
        type="hidden"
        name="whatsappPhone"
        value={siteSettings.whatsappPhone}
      />
      <input
        type="hidden"
        name="facebookUrl"
        value={siteSettings.facebookUrl}
      />
      <input type="hidden" name="addressBn" value={siteSettings.address.bn} />
      <input type="hidden" name="addressEn" value={siteSettings.address.en} />
      <input type="hidden" name="heroLayout" value={siteSettings.heroLayout} />
      <input type="hidden" name="cardStyle" value={siteSettings.cardStyle} />
      <input
        type="hidden"
        name="sectionSpacing"
        value={siteSettings.sectionSpacing}
      />
      <input
        type="hidden"
        name="primaryCtaHref"
        value={siteSettings.primaryCtaHref}
      />
      <input
        type="hidden"
        name="primaryCtaLabelBn"
        value={siteSettings.primaryCtaLabel.bn}
      />
      <input
        type="hidden"
        name="primaryCtaLabelEn"
        value={siteSettings.primaryCtaLabel.en}
      />
    </>
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

function TextField({
  name,
  label,
  defaultValue,
  rows,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} rows={rows} />
    </div>
  );
}
