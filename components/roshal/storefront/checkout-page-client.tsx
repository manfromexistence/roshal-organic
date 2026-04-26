"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ImageUploadField } from "@/components/roshal/shared/image-upload-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { formatBdt } from "@/lib/roshal/format";
import { getLocalizedValue } from "@/lib/roshal/locale";
import {
  getRoshalPaymentMethodLabel,
  ROSHAL_STANDARD_SHIPPING_FEE,
} from "@/lib/roshal/orders";
import type {
  RoshalLocale,
  RoshalPaymentGatewaySummary,
  RoshalPaymentMethod,
  RoshalPaymentSettings,
  RoshalProduct,
} from "@/lib/roshal/types";
import { resolveImageUrl } from "@/lib/storage-utils";
import { useCartStore } from "@/store/cart-store";

export function CheckoutPageClient({
  gatewaySummary,
  locale,
  paymentSettings,
  products,
  user,
}: {
  gatewaySummary: RoshalPaymentGatewaySummary;
  locale: RoshalLocale;
  paymentSettings: RoshalPaymentSettings;
  products: RoshalProduct[];
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    defaultAddress: string;
  };
}) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const syncCatalog = useCartStore((state) => state.syncCatalog);
  const visibleItems = isHydrated ? items : [];
  const paymentOptions = useMemo(
    () =>
      paymentSettings.options
        .filter((option) => option.enabled)
        .sort((left, right) => left.sortOrder - right.sortOrder),
    [paymentSettings.options],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<RoshalPaymentMethod>(
    paymentOptions[0]?.key || "bkash",
  );
  const [formState, setFormState] = useState({
    customerName: user.name,
    phone: user.phone,
    email: user.email,
    addressLine1: user.defaultAddress,
    addressLine2: "",
    city: "Dhaka",
    postalCode: "",
    notes: "",
    paymentReference: "",
    paymentSender: "",
    paymentProofUrl: "",
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (
      paymentOptions.length > 0 &&
      !paymentOptions.some((option) => option.key === paymentMethod)
    ) {
      setPaymentMethod(paymentOptions[0].key);
    }
  }, [paymentMethod, paymentOptions]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const result = syncCatalog(products);

    if (result.adjustedCount > 0 || result.removedCount > 0) {
      setSyncMessage(
        getCheckoutSyncMessage(
          locale,
          result.adjustedCount,
          result.removedCount,
        ),
      );
      return;
    }

    setSyncMessage(null);
  }, [isHydrated, locale, products, syncCatalog]);

  const selectedOption =
    paymentOptions.find((option) => option.key === paymentMethod) ||
    paymentOptions[0];
  const gatewayActiveForSelectedOption = Boolean(
    selectedOption &&
      selectedOption.mode === "gateway" &&
      gatewaySummary.configured &&
      gatewaySummary.supportedMethods.includes(selectedOption.key),
  );
  const shouldCapturePaymentDetails = Boolean(
    selectedOption &&
      (selectedOption.mode === "manual" ||
        (!gatewayActiveForSelectedOption && selectedOption.requiresProof)),
  );
  const subtotal = useMemo(
    () =>
      visibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [visibleItems],
  );
  const shippingFee =
    visibleItems.length > 0 ? ROSHAL_STANDARD_SHIPPING_FEE : 0;
  const total = subtotal + shippingFee;

  const gatewayModeMessage =
    selectedOption?.mode !== "gateway"
      ? null
      : gatewayActiveForSelectedOption
        ? locale === "bn"
          ? "অর্ডার নিশ্চিত করার পর আপনাকে সিকিউর aamarPay চেকআউট পেজে নেওয়া হবে, যেখানে কার্ড, bKash, Nagad ও Rocket দিয়ে পেমেন্ট সম্পন্ন করতে পারবেন।"
          : "After you confirm the order, you will be redirected to secure aamarPay checkout where cards, bKash, Nagad, Rocket, and Upay can be completed."
        : locale === "bn"
          ? "সিকিউর গেটওয়ে এখনো কনফিগার করা হয়নি। অর্ডার সাবমিট করলে অ্যাডমিন ফলো-আপ করে পেমেন্ট সম্পন্ন করবে।"
          : "The secure gateway is not configured yet. Submit the order request and an admin will follow up manually.";

  const updateFormValue = (field: keyof typeof formState, value: string) => {
    setSubmitError(null);
    setFormState((state) => ({ ...state, [field]: value }));
  };

  const showCheckoutError = (message: string) => {
    setSubmitError(message);
    toast({
      title: locale === "bn" ? "চেকআউট সমস্যা" : "Checkout issue",
      description: message,
      variant: "destructive",
    });
  };

  const getCheckoutErrorMessage = (code: string | null | undefined) => {
    switch (code) {
      case "cart-empty":
        return locale === "bn"
          ? "কার্ট খালি। অর্ডারের আগে পণ্য যোগ করুন।"
          : "Your cart is empty. Add products before placing the order.";
      case "payment-method-unavailable":
        return locale === "bn"
          ? "নির্বাচিত পেমেন্ট অপশনটি এখন উপলভ্য নয়। অন্য একটি অপশন বেছে নিন।"
          : "The selected payment option is not available right now. Please choose another one.";
      case "payment-proof-required":
        return locale === "bn"
          ? "এই পেমেন্ট অপশনের জন্য ট্রানজ্যাকশন আইডি, সেন্ডার নম্বর এবং স্ক্রিনশট প্রয়োজন।"
          : "This payment method requires a transaction ID, sender number, and payment screenshot.";
      case "product-unavailable":
        return locale === "bn"
          ? "কার্টের এক বা একাধিক পণ্য এখন আর উপলভ্য নেই।"
          : "One or more cart items are no longer available.";
      case "insufficient-inventory":
        return locale === "bn"
          ? "কার্টের এক বা একাধিক পণ্যের পর্যাপ্ত স্টক নেই।"
          : "One or more cart items no longer have enough stock.";
      case "invalid-checkout-request":
        return locale === "bn"
          ? "চেকআউট তথ্য অসম্পূর্ণ। ডেলিভারি ও পেমেন্ট তথ্য আবার যাচাই করুন।"
          : "The checkout information is incomplete. Please review your delivery and payment details.";
      case "gateway-init-failed":
        return locale === "bn"
          ? "সিকিউর পেমেন্ট সেশন চালু করা যায়নি। আবার চেষ্টা করুন।"
          : "Could not start the secure payment session. Please try again.";
      default:
        return locale === "bn"
          ? "অর্ডার সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।"
          : "Could not complete the order. Please try again.";
    }
  };

  const submitOrder = async () => {
    if (visibleItems.length === 0 || !selectedOption) {
      return;
    }

    setSubmitError(null);

    if (
      !formState.customerName ||
      !formState.phone ||
      !formState.addressLine1
    ) {
      showCheckoutError(
        locale === "bn"
          ? "নাম, ফোন এবং ঠিকানা দিন।"
          : "Please provide your name, phone number, and address.",
      );
      return;
    }

    if (
      shouldCapturePaymentDetails &&
      (!formState.paymentReference ||
        !formState.paymentSender ||
        !formState.paymentProofUrl)
    ) {
      showCheckoutError(
        locale === "bn"
          ? "ট্রানজ্যাকশন আইডি, পেমেন্ট নম্বর এবং স্ক্রিনশট দিন।"
          : "Please provide the transaction ID, sending number, and payment screenshot.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/roshal/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          paymentMethod,
          items: visibleItems,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getCheckoutErrorMessage(payload?.code));
      }

      setSubmitError(null);
      clearCart();

      if (typeof window !== "undefined" && payload?.paymentUrl) {
        window.location.assign(String(payload.paymentUrl));
        return;
      }

      router.push(payload?.id ? `/orders/${payload.id}` : "/orders");
      router.refresh();
    } catch (error) {
      console.error(error);
      showCheckoutError(
        error instanceof Error ? error.message : getCheckoutErrorMessage(null),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1fr,24rem]">
      <div className="space-y-8">
        {!isHydrated ? (
          <Alert>
            <AlertDescription>
              {locale === "bn"
                ? "আপনার সংরক্ষিত কার্ট লোড হচ্ছে..."
                : "Loading your saved cart..."}
            </AlertDescription>
          </Alert>
        ) : null}

        {syncMessage ? (
          <Alert>
            <AlertDescription>{syncMessage}</AlertDescription>
          </Alert>
        ) : null}

        {submitError ? (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "ডেলিভারি তথ্য" : "Delivery details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              label={locale === "bn" ? "পূর্ণ নাম" : "Full name"}
              value={formState.customerName}
              onChange={(value) => updateFormValue("customerName", value)}
            />
            <Field
              label={locale === "bn" ? "ফোন" : "Phone"}
              value={formState.phone}
              onChange={(value) => updateFormValue("phone", value)}
            />
            <Field
              label={locale === "bn" ? "ইমেইল" : "Email"}
              value={formState.email}
              onChange={(value) => updateFormValue("email", value)}
            />
            <Field
              label={locale === "bn" ? "ঠিকানা" : "Address"}
              value={formState.addressLine1}
              onChange={(value) => updateFormValue("addressLine1", value)}
            />
            <Field
              label={locale === "bn" ? "অতিরিক্ত ঠিকানা" : "Address line 2"}
              value={formState.addressLine2}
              onChange={(value) => updateFormValue("addressLine2", value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label={locale === "bn" ? "শহর" : "City"}
                value={formState.city}
                onChange={(value) => updateFormValue("city", value)}
              />
              <Field
                label={locale === "bn" ? "পোস্ট কোড" : "Postal code"}
                value={formState.postalCode}
                onChange={(value) => updateFormValue("postalCode", value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{locale === "bn" ? "নোট" : "Notes"}</Label>
              <Textarea
                id="notes"
                value={formState.notes}
                onChange={(event) =>
                  updateFormValue("notes", event.target.value)
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment method"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">
              {getLocalizedValue(locale, paymentSettings.manualReviewNotice)}
            </p>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => {
                setSubmitError(null);
                setPaymentMethod(value as RoshalPaymentMethod);
              }}
              className="grid gap-3"
            >
              {paymentOptions.map((option) => (
                <div
                  key={option.key}
                  className="flex items-center gap-3 rounded-xl border border-border/70 p-4"
                >
                  <RadioGroupItem value={option.key} id={option.key} />
                  <div className="space-y-1">
                    <Label htmlFor={option.key} className="font-medium">
                      {getLocalizedValue(locale, option.label)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {getLocalizedValue(locale, option.instructions)}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {selectedOption ? (
              <div className="space-y-5 rounded-2xl border border-border/70 bg-muted/20 p-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {getLocalizedValue(locale, selectedOption.label)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getLocalizedValue(locale, selectedOption.instructions)}
                  </p>
                </div>

                {selectedOption.accountNumber ? (
                  <div className="grid gap-3 rounded-xl border border-border/60 bg-background p-4 text-sm md:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">
                        {locale === "bn" ? "পেমেন্ট নম্বর" : "Payment number"}
                      </p>
                      <p className="font-medium">
                        {selectedOption.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {locale === "bn" ? "অ্যাকাউন্ট ধরন" : "Account type"}
                      </p>
                      <p className="font-medium">
                        {selectedOption.accountType}
                      </p>
                    </div>
                  </div>
                ) : null}

                {selectedOption.guideImageUrl ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {locale === "bn"
                        ? "পেমেন্ট গাইড স্ক্রিনশট"
                        : "Payment guide screenshot"}
                    </p>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-background">
                      <Image
                        src={resolveImageUrl(selectedOption.guideImageUrl)}
                        alt={getLocalizedValue(locale, selectedOption.label)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 720px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : null}

                {selectedOption.mode === "gateway" ? (
                  <div className="rounded-xl border border-border/60 bg-background p-4 text-sm text-muted-foreground">
                    {gatewayModeMessage}
                  </div>
                ) : null}

                {shouldCapturePaymentDetails ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label={
                        locale === "bn" ? "ট্রানজ্যাকশন আইডি" : "Transaction ID"
                      }
                      value={formState.paymentReference}
                      onChange={(value) =>
                        updateFormValue("paymentReference", value)
                      }
                    />
                    <Field
                      label={
                        locale === "bn"
                          ? "যে নম্বর থেকে পেমেন্ট করেছেন"
                          : "Sender number"
                      }
                      value={formState.paymentSender}
                      onChange={(value) =>
                        updateFormValue("paymentSender", value)
                      }
                    />
                    <div className="md:col-span-2">
                      <ImageUploadField
                        label={
                          locale === "bn"
                            ? "পেমেন্ট স্ক্রিনশট"
                            : "Payment proof screenshot"
                        }
                        helperText={
                          locale === "bn"
                            ? "নির্বাচিত পেমেন্টের স্ক্রিনশট বা কনফার্মেশন আপলোড করুন।"
                            : "Upload the screenshot or confirmation for the selected payment."
                        }
                        value={formState.paymentProofUrl}
                        onChange={(value) =>
                          updateFormValue("paymentProofUrl", value)
                        }
                      />
                    </div>
                  </div>
                ) : null}

                <p className="text-sm text-muted-foreground">
                  {getLocalizedValue(locale, paymentSettings.supportMessage)}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>
            {locale === "bn" ? "অর্ডার সারাংশ" : "Order summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="text-muted-foreground">
                {locale === "bn" ? item.name.bn : item.name.en} x{" "}
                {item.quantity}
              </span>
              <span>{formatBdt(item.price * item.quantity, locale)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {locale === "bn" ? "সাবটোটাল" : "Subtotal"}
            </span>
            <span>{formatBdt(subtotal, locale)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {locale === "bn" ? "ডেলিভারি" : "Delivery"}
            </span>
            <span>{formatBdt(shippingFee, locale)}</span>
          </div>
          {selectedOption ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {locale === "bn" ? "পেমেন্ট মাধ্যম" : "Payment"}
              </span>
              <span>
                {getLocalizedValue(
                  locale,
                  getRoshalPaymentMethodLabel(selectedOption.key),
                )}
              </span>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between text-lg font-semibold">
            <span>{locale === "bn" ? "মোট" : "Total"}</span>
            <span className="text-primary">{formatBdt(total, locale)}</span>
          </div>
          <Button
            className="w-full"
            onClick={submitOrder}
            disabled={
              !isHydrated ||
              isSubmitting ||
              visibleItems.length === 0 ||
              !selectedOption
            }
          >
            {selectedOption?.mode === "gateway"
              ? gatewayActiveForSelectedOption
                ? isSubmitting
                  ? locale === "bn"
                    ? "সিকিউর পেমেন্টে নেওয়া হচ্ছে..."
                    : "Redirecting to secure payment..."
                  : locale === "bn"
                    ? "সিকিউর পেমেন্টে এগিয়ে যান"
                    : "Continue to secure payment"
                : isSubmitting
                  ? locale === "bn"
                    ? "অর্ডার অনুরোধ পাঠানো হচ্ছে..."
                    : "Submitting order request..."
                  : locale === "bn"
                    ? "অর্ডার অনুরোধ পাঠান"
                    : "Submit order request"
              : isSubmitting
                ? locale === "bn"
                  ? "অর্ডার করা হচ্ছে..."
                  : "Placing order..."
                : locale === "bn"
                  ? "অর্ডার নিশ্চিত করুন"
                  : "Confirm order"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function getCheckoutSyncMessage(
  locale: RoshalLocale,
  adjustedCount: number,
  removedCount: number,
) {
  if (locale === "bn") {
    if (adjustedCount > 0 && removedCount > 0) {
      return "চেকআউটের আগে লাইভ স্টকের সাথে মিলিয়ে কিছু পরিমাণ আপডেট করা হয়েছে এবং অনুপলভ্য পণ্য সরানো হয়েছে।";
    }

    if (removedCount > 0) {
      return "চেকআউটের আগে অনুপলভ্য বা স্টক শেষ হওয়া পণ্য সরানো হয়েছে।";
    }

    return "চেকআউটের আগে লাইভ স্টকের সাথে মিলিয়ে কিছু পরিমাণ আপডেট করা হয়েছে।";
  }

  if (adjustedCount > 0 && removedCount > 0) {
    return "Before checkout, live stock was synced: some quantities were reduced and unavailable products were removed.";
  }

  if (removedCount > 0) {
    return "Before checkout, unavailable or sold-out products were removed.";
  }

  return "Before checkout, some quantities were updated to match live stock.";
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
