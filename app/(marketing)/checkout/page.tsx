import { CheckoutPageClient } from "@/components/storefront/checkout-page-client";
import { requireRoshalUser } from "@/lib/store-auth";
import {
  getRoshalPaymentSettings,
  getRoshalProducts,
} from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";
import { getRoshalPaymentGatewaySummary } from "@/lib/store-payments";

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
