import {
  saveRoshalPaymentSettings,
  saveRoshalSiteSettings,
} from "@/actions/admin";
import { DashboardFormStatusToast } from "@/components/dashboard/dashboard-form-status-toast";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { DashboardDeliveryZonesEditor } from "@/components/dashboard/delivery-zones-editor";
import { DashboardPaymentProvidersEditor } from "@/components/dashboard/payment-providers-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardActionErrorMessage } from "@/lib/dashboard-action-errors";
import { requireRoshalAdmin } from "@/lib/store-auth";
import {
  getRoshalPaymentSettings,
  getRoshalSiteSettings,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import type { RoshalSiteSettings } from "@/lib/store-types";

const saveMessages: Record<string, string> = {
  delivery: "Delivery settings saved successfully.",
  payment: "Payment providers saved successfully.",
};

export default async function DashboardPaymentsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorMessage = getDashboardActionErrorMessage(
    resolvedSearchParams.error,
  );
  const [locale, paymentSettings, siteSettings] = await Promise.all([
    getRoshalLocale(),
    getRoshalPaymentSettings(),
    getRoshalSiteSettings(),
    requireRoshalAdmin(),
  ]);

  const visibleOptions = paymentSettings.options;
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
    <div className="min-w-0 space-y-6 px-6 pt-6 pb-4">
      <DashboardFormStatusToast
        errorMessage={errorMessage || undefined}
        successMessage={
          resolvedSearchParams.saved
            ? saveMessages[resolvedSearchParams.saved] ||
              "Settings saved successfully."
            : undefined
        }
      />
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "পেমেন্ট সেটিংস" : "Payment settings"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn"
            ? "পেমেন্ট ও ডেলিভারি সেটিংস"
            : "Payment and delivery settings"}
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

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <DashboardMetricCard
          title={locale === "bn" ? "চালু পেমেন্ট" : "Enabled providers"}
          value={enabledCount}
          hint={
            locale === "bn"
              ? `${visibleOptions.length}টি কনফিগার করা অপশন`
              : `${visibleOptions.length} configured providers`
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "গেটওয়ে মোড" : "Gateway modes"}
          value={gatewayModeCount}
          hint={
            locale === "bn"
              ? "কার্ড বা প্রোভাইডার-ব্যাকড পেমেন্ট"
              : "Card or provider-backed methods"
          }
        />
        <DashboardMetricCard
          title={locale === "bn" ? "ম্যানুয়াল রিভিউ" : "Manual review"}
          value={manualReviewCount}
          hint={
            locale === "bn"
              ? "অ্যাডমিন যাচাই করবে"
              : "Manual payment methods checked by admin"
          }
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
              {locale === "bn" ? "ডেলিভারি সেটিংস" : "Delivery settings"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === "bn"
                ? "Dhaka district হলে Inside Dhaka fee, অন্য district হলে Outside Dhaka fee checkout-এ বসবে। Free delivery rule একই সেটিংস থেকে কাজ করবে।"
                : "Dhaka district uses the Inside Dhaka fee; every other district uses the Outside Dhaka fee at checkout. Free delivery rules are applied from the same saved settings."}
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="delivery-charges">
                <AccordionTrigger>
                  {locale === "bn"
                    ? "ডেলিভারি নিয়ম এডিট করুন"
                    : "Edit delivery rules"}
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="space-y-5 data-[state=closed]:hidden"
                >
                  <DashboardDeliveryZonesEditor
                    locale={locale}
                    name="deliveryZonesJson"
                    settings={siteSettings.deliverySettings}
                    value={siteSettings.deliveryZones}
                  />
                  <Button type="submit">
                    {locale === "bn"
                      ? "ডেলিভারি সেটিংস সেভ করুন"
                      : "Save delivery settings"}
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
              {locale === "bn" ? "পেমেন্ট প্রোভাইডার" : "Payment providers"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === "bn"
                ? "Checkout payment provider যোগ, remove, চালু/বন্ধ এবং reorder করুন।"
                : "Add, remove, enable, and reorder checkout payment providers from one compact editor."}
            </p>
          </CardHeader>
          <CardContent>
            <DashboardPaymentProvidersEditor
              locale={locale}
              name="paymentOptionsJson"
              value={paymentSettings.options}
            />
          </CardContent>
        </Card>

        <Button type="submit">
          {locale === "bn"
            ? "পেমেন্ট প্রোভাইডার সেভ করুন"
            : "Save payment providers"}
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
