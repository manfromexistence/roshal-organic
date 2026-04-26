import { CheckoutPageClient } from "@/components/roshal/storefront/checkout-page-client";
import { requireRoshalUser } from "@/lib/roshal/auth";
import {
  getRoshalPaymentSettings,
  getRoshalProducts,
} from "@/lib/roshal/content";
import { getRoshalLocale } from "@/lib/roshal/i18n";
import { getRoshalPaymentGatewaySummary } from "@/lib/roshal/payments";

export default async function CheckoutPage() {
  const [locale, sessionUser, paymentSettings, products, gatewaySummary] =
    await Promise.all([
      getRoshalLocale(),
      requireRoshalUser(),
      getRoshalPaymentSettings(),
      getRoshalProducts(),
      getRoshalPaymentGatewaySummary(),
    ]);

  return (
    <CheckoutPageClient
      gatewaySummary={gatewaySummary}
      locale={locale}
      paymentSettings={paymentSettings}
      products={products}
      user={{
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        phone: sessionUser.phone || "",
        defaultAddress: sessionUser.defaultAddress || "",
      }}
    />
  );
}
