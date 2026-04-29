import { saveRoshalPaymentSettings } from "@/actions/admin";
import {
  DashboardBarChartCard,
  DashboardPieChartCard,
} from "@/components/dashboard/dashboard-chart-card";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalPaymentSettings } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getRoshalPaymentGatewaySummary } from "@/lib/store-payments";
import type {
  RoshalPaymentMethod,
  RoshalPaymentOption,
} from "@/lib/store-types";

const paymentMethodOrder: RoshalPaymentMethod[] = [
  "card",
  "bkash",
  "nagad",
  "rocket",
  "upay",
];

export default async function DashboardPaymentsPage() {
  const [locale, paymentSettings, gatewaySummary] = await Promise.all([
    getRoshalLocale(),
    getRoshalPaymentSettings(),
    getRoshalPaymentGatewaySummary(),
    requireRoshalAdmin(),
  ]);

  const getOption = (key: RoshalPaymentMethod): RoshalPaymentOption =>
    paymentSettings.options.find((option) => option.key === key) || {
      key,
      enabled: false,
      mode: "manual",
      label: { bn: key, en: key },
      merchantLabel: { bn: "", en: "" },
      accountType: "mobile-wallet",
      accountNumber: "",
      instructions: { bn: "", en: "" },
      guideImageUrl: "",
      requiresProof: true,
      sortOrder: paymentMethodOrder.indexOf(key),
    };

  const enabledCount = paymentSettings.options.filter(
    (option) => option.enabled,
  ).length;
  const gatewayModeCount = paymentSettings.options.filter(
    (option) => option.enabled && option.mode === "gateway",
  ).length;
  const proofRequiredCount = paymentSettings.options.filter(
    (option) => option.enabled && option.requiresProof,
  ).length;
  const optionStateData = [
    {
      key: "enabled",
      label: locale === "bn" ? "চালু" : "Enabled",
      value: enabledCount,
    },
    {
      key: "disabled",
      label: locale === "bn" ? "বন্ধ" : "Disabled",
      value: paymentSettings.options.length - enabledCount,
    },
  ];
  const modeData = [
    {
      key: "manual",
      label: locale === "bn" ? "ম্যানুয়াল" : "Manual",
      value: paymentSettings.options.filter(
        (option) => option.mode === "manual",
      ).length,
    },
    {
      key: "gateway",
      label: locale === "bn" ? "গেটওয়ে" : "Gateway",
      value: paymentSettings.options.filter(
        (option) => option.mode === "gateway",
      ).length,
    },
  ];
  const proofData = [
    {
      key: "requires-proof",
      label: locale === "bn" ? "প্রুফ লাগে" : "Proof required",
      value: paymentSettings.options.filter((option) => option.requiresProof)
        .length,
    },
    {
      key: "no-proof",
      label: locale === "bn" ? "প্রুফ লাগে না" : "No proof",
      value: paymentSettings.options.filter((option) => !option.requiresProof)
        .length,
    },
  ];

  return (
    <div className="min-w-0 space-y-6 p-4 md:p-6">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "পেমেন্ট সেটিংস" : "Payment settings"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "পেমেন্ট অপশন ও গাইড" : "Payment options and guides"}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          title={locale === "bn" ? "চালু অপশন" : "Enabled options"}
          value={enabledCount}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "গেটওয়ে মোড" : "Gateway modes"}
          value={gatewayModeCount}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "প্রুফ প্রয়োজন" : "Proof required"}
          value={proofRequiredCount}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardPieChartCard
          title={
            locale === "bn"
              ? "পেমেন্ট অপশন অ্যাভেইলেবিলিটি"
              : "Payment option availability"
          }
          description={
            locale === "bn"
              ? "ড্যাশবোর্ডে কনফিগার করা অপশনগুলোর মধ্যে কোনগুলো লাইভ আছে।"
              : "Which configured payment options are currently live for customers."
          }
          totalLabel={locale === "bn" ? "অপশন" : "Options"}
          data={optionStateData}
        />
        <DashboardBarChartCard
          title={locale === "bn" ? "মোড ডিস্ট্রিবিউশন" : "Mode distribution"}
          description={
            locale === "bn"
              ? "ম্যানুয়াল ভেরিফিকেশন বনাম গেটওয়ে মোডের অনুপাত।"
              : "The balance between manual verification and gateway-managed payment modes."
          }
          totalLabel={locale === "bn" ? "মোড" : "Modes"}
          data={modeData}
        />
        <DashboardBarChartCard
          title={locale === "bn" ? "প্রুফ নীতি" : "Proof policy"}
          description={
            locale === "bn"
              ? "কোন পেমেন্ট চ্যানেলে প্রমাণপত্র চাইছেন তা দ্রুত বোঝা যায়।"
              : "Quickly see which payment channels require customer proof."
          }
          totalLabel={locale === "bn" ? "নীতি" : "Policy"}
          data={proofData}
          className="xl:col-span-2"
        />
      </div>

      <form action={saveRoshalPaymentSettings} className="min-w-0 space-y-6">
        <input type="hidden" name="id" value={paymentSettings.id} />
        <Alert>
          <AlertTitle>
            {locale === "bn"
              ? "লাইভ গেটওয়ে কনফিগারেশন"
              : "Live gateway configuration"}
          </AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              {gatewaySummary.configured
                ? locale === "bn"
                  ? `গেটওয়ে প্রস্তুত: ${gatewaySummary.provider} (${gatewaySummary.environment})`
                  : `Gateway ready: ${gatewaySummary.provider} (${gatewaySummary.environment})`
                : locale === "bn"
                  ? "গেটওয়ে এখনো সম্পূর্ণ কনফিগার হয়নি। নিচের env গুলো সেট করুন।"
                  : "The gateway is not fully configured yet. Set the env values below."}
            </p>
            <p className="break-all font-mono text-xs">
              ROSHAL_PAYMENT_GATEWAY_PROVIDER, AAMARPAY_STORE_ID,
              AAMARPAY_SIGNATURE_KEY, AAMARPAY_BASE_URL, AAMARPAY_SANDBOX,
              ROSHAL_PAYMENT_GATEWAY_METHODS
            </p>
            <p className="break-words text-xs text-muted-foreground">
              {`Missing env keys: ${
                gatewaySummary.missingEnvKeys.length
                  ? gatewaySummary.missingEnvKeys.join(", ")
                  : "none"
              }`}
            </p>
            <p className="break-words text-xs text-muted-foreground">
              {`Supported gateway methods: ${gatewaySummary.supportedMethods.join(", ")}`}
            </p>
            <p className="break-all text-xs text-muted-foreground">
              {locale === "bn"
                ? `কলে-ব্যাক URL: ${gatewaySummary.callbackUrls.success}, ${gatewaySummary.callbackUrls.fail}, ${gatewaySummary.callbackUrls.cancel}, ${gatewaySummary.callbackUrls.ipn}`
                : `Callback URLs: ${gatewaySummary.callbackUrls.success}, ${gatewaySummary.callbackUrls.fail}, ${gatewaySummary.callbackUrls.cancel}, ${gatewaySummary.callbackUrls.ipn}`}
            </p>
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "ম্যানুয়াল যাচাই মেসেজ" : "Manual verification copy"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <TextField
              name="manualReviewNoticeBn"
              label="Manual review notice (BN)"
              defaultValue={paymentSettings.manualReviewNotice.bn}
              rows={4}
            />
            <TextField
              name="manualReviewNoticeEn"
              label="Manual review notice (EN)"
              defaultValue={paymentSettings.manualReviewNotice.en}
              rows={4}
            />
            <TextField
              name="supportMessageBn"
              label="Support message (BN)"
              defaultValue={paymentSettings.supportMessage.bn}
              rows={3}
            />
            <TextField
              name="supportMessageEn"
              label="Support message (EN)"
              defaultValue={paymentSettings.supportMessage.en}
              rows={3}
            />
          </CardContent>
        </Card>

        {paymentMethodOrder.map((key) => {
          const option = getOption(key);

          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle>
                  {locale === "bn" ? option.label.bn : option.label.en}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <DashboardFormCheckbox
                    name={`${key}Enabled`}
                    defaultChecked={option.enabled}
                    label={locale === "bn" ? "চালু" : "Enabled"}
                  />
                  <DashboardFormCheckbox
                    name={`${key}RequiresProof`}
                    defaultChecked={option.requiresProof}
                    label={
                      locale === "bn"
                        ? "পেমেন্ট প্রুফ লাগবে"
                        : "Require payment proof"
                    }
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
                    label="Payment Number / Merchant ID"
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

                <div className="grid gap-5 md:grid-cols-2">
                  <TextField
                    name={`${key}InstructionsBn`}
                    label="Instructions (BN)"
                    defaultValue={option.instructions.bn}
                    rows={4}
                  />
                  <TextField
                    name={`${key}InstructionsEn`}
                    label="Instructions (EN)"
                    defaultValue={option.instructions.en}
                    rows={4}
                  />
                </div>

                <ImageUploadField
                  name={`${key}GuideImageUrl`}
                  label={locale === "bn" ? "গাইড স্ক্রিনশট" : "Guide screenshot"}
                  helperText={
                    locale === "bn"
                      ? "চেকআউটে দেখানোর জন্য স্ক্রিনশট বা গাইড ইমেজ আপলোড করুন।"
                      : "Upload the screenshot or guide image that should appear on checkout."
                  }
                  value={option.guideImageUrl}
                />
              </CardContent>
            </Card>
          );
        })}

        <Button type="submit">
          {locale === "bn" ? "পেমেন্ট সেটিংস সেভ করুন" : "Save payment settings"}
        </Button>
      </form>
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
