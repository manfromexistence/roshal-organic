import { saveRoshalPaymentSettings } from "@/actions/admin";
import { DashboardInsightCard } from "@/components/dashboard/dashboard-insight-card";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardFormCheckbox } from "@/components/dashboard/form-checkbox";
import { DashboardFormSelect } from "@/components/dashboard/form-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalPaymentSettings } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import type {
  RoshalPaymentMethod,
  RoshalPaymentOption,
} from "@/lib/store-types";

const paymentMethodOrder: RoshalPaymentMethod[] = [
  "cash_on_delivery",
  "card",
  "bkash",
  "nagad",
];

export default async function DashboardPaymentsPage() {
  const [locale, paymentSettings] = await Promise.all([
    getRoshalLocale(),
    getRoshalPaymentSettings(),
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
  const proofRequiredCount = visibleOptions.filter(
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
      value: visibleOptions.length - enabledCount,
    },
  ];
  const modeData = [
    {
      key: "manual",
      label: locale === "bn" ? "ম্যানুয়াল" : "Manual",
      value: visibleOptions.filter((option) => option.mode === "manual").length,
    },
    {
      key: "gateway",
      label: locale === "bn" ? "গেটওয়ে" : "Gateway",
      value: visibleOptions.filter((option) => option.mode === "gateway")
        .length,
    },
  ];
  const proofData = [
    {
      key: "requires-proof",
      label: locale === "bn" ? "প্রুফ লাগে" : "Proof required",
      value: visibleOptions.filter((option) => option.requiresProof).length,
    },
    {
      key: "no-proof",
      label: locale === "bn" ? "প্রুফ লাগে না" : "No proof",
      value: visibleOptions.filter((option) => !option.requiresProof).length,
    },
  ];

  return (
    <div className="min-w-0 space-y-6 px-6 pt-6 pb-0">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "পেমেন্ট সেটিংস" : "Payment settings"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "ক্যাশ অন ডেলিভারি সেটিংস" : "Payment settings"}
        </h1>
      </div>

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
          title={locale === "bn" ? "প্রুফ প্রয়োজন" : "Proof required"}
          value={proofRequiredCount}
          hint="Manual verification inputs"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardInsightCard
          title={
            locale === "bn"
              ? "পেমেন্ট অপশন অ্যাভেইলেবিলিটি"
              : "Payment option availability"
          }
          description={
            locale === "bn"
              ? "চেকআউটে গ্রাহকের জন্য দৃশ্যমান অপশন এখন কোন অবস্থায় আছে তা দেখুন।"
              : "See whether the customer-facing checkout payment option is live."
          }
          totalLabel={locale === "bn" ? "অপশন" : "Options"}
          data={optionStateData}
        />
        <DashboardInsightCard
          title={locale === "bn" ? "মোড ডিস্ট্রিবিউশন" : "Mode distribution"}
          description={
            locale === "bn"
              ? "বর্তমান গ্রাহক-দৃশ্যমান পেমেন্ট অপশনটি ম্যানুয়াল নাকি গেটওয়ে তা দেখায়।"
              : "Shows whether the visible customer payment method is manual or gateway based."
          }
          totalLabel={locale === "bn" ? "মোড" : "Modes"}
          data={modeData}
        />
        <DashboardInsightCard
          title={locale === "bn" ? "প্রুফ নীতি" : "Proof policy"}
          description={
            locale === "bn"
              ? "চেকআউটে প্রুফ চাওয়া হচ্ছে কি না তা এক নজরে দেখুন।"
              : "Check whether the customer-facing checkout flow asks for proof."
          }
          totalLabel={locale === "bn" ? "নীতি" : "Policy"}
          data={proofData}
          className="xl:col-span-2"
        />
      </div>

      <form action={saveRoshalPaymentSettings} className="min-w-0 space-y-6">
        <input type="hidden" name="id" value={paymentSettings.id} />

        {paymentMethodOrder.map((key) => {
          const option = getOption(key);

          return (
            <Card key={key} className="border-none bg-card shadow-sm">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle>
                    {locale === "bn" ? option.label.bn : option.label.en}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {option.mode === "gateway"
                      ? "Gateway-backed checkout method"
                      : "Manual checkout method"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={option.enabled ? "secondary" : "outline"}>
                    {option.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Badge variant="outline">{option.mode}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid min-w-0 gap-5 md:grid-cols-2">
                  <DashboardFormCheckbox
                    name={`${key}Enabled`}
                    defaultChecked={option.enabled}
                    label={locale === "bn" ? "চালু" : "Enabled"}
                  />
                  <DashboardFormCheckbox
                    name={`${key}RequiresProof`}
                    defaultChecked={option.requiresProof}
                    label={
                      locale === "bn" ? "প্রুফ লাগবে" : "Require payment proof"
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
