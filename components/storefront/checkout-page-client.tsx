"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { HTMLAttributes, HTMLInputTypeAttribute } from "react";
import { useEffect, useId, useMemo, useState } from "react";
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
import { PhoneInput2 } from "@/components/ui/phone-input-2";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { bangladeshDistrictOptions } from "@/lib/bangladesh-locations";
import { parseRoshalDefaultAddress } from "@/lib/store-address";
import {
  getRoshalDeliveryMatchLabel,
  getRoshalDeliveryZoneLabel,
  resolveRoshalDeliveryEstimate,
} from "@/lib/store-delivery";
import { formatBdt } from "@/lib/store-format";
import { getLocalizedValue } from "@/lib/store-locale";
import { isRoshalManualPaymentReferenceRequired } from "@/lib/store-payment-methods";
import {
  isBangladeshPhoneComplete,
  normalizeBangladeshPhoneInput,
} from "@/lib/store-phone";
import type {
  RoshalDeliverySettings,
  RoshalDeliveryZone,
  RoshalLocale,
  RoshalPaymentGatewaySummary,
  RoshalPaymentMethod,
  RoshalPaymentSettings,
  RoshalProduct,
} from "@/lib/store-types";
import { useCartStore } from "@/store/cart-store";

function getDefaultCheckoutPaymentMethod(
  options: RoshalPaymentSettings["options"],
): RoshalPaymentMethod {
  const sortedOptions = [...options].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return (
    sortedOptions.find(
      (option) => option.enabled && option.key === "cash_on_delivery",
    )?.key ||
    sortedOptions.find((option) => option.enabled && option.mode === "manual")
      ?.key ||
    sortedOptions.find((option) => option.enabled)?.key ||
    "cash_on_delivery"
  );
}

const checkoutPaymentLogos: Partial<Record<RoshalPaymentMethod, string>> = {
  bkash: "/logos/bkash-com.png",
  nagad: "/logos/nagad-com-bd.png",
};

function sortCheckoutPaymentOptions(options: RoshalPaymentSettings["options"]) {
  return [...options]
    .filter((option) => option.enabled)
    .sort((left, right) => {
      if (left.key === "cash_on_delivery") {
        return -1;
      }

      if (right.key === "cash_on_delivery") {
        return 1;
      }

      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.key.localeCompare(right.key);
    });
}

function getCheckoutLocalizedValue(
  locale: RoshalLocale,
  value: { bn: string; en: string },
) {
  const primaryValue = getLocalizedValue(locale, value).trim();

  if (primaryValue) {
    return primaryValue;
  }

  return getLocalizedValue(locale === "bn" ? "en" : "bn", value).trim();
}

function isSyntheticCustomerEmail(value: string) {
  return /^customer\+\d+@roshalorganic\.app$/i.test(value.trim());
}

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function CheckoutPageClient({
  deliverySettings,
  deliveryZones,
  gatewaySummary,
  locale,
  paymentSettings,
  products,
  user,
}: {
  deliverySettings: RoshalDeliverySettings;
  deliveryZones: RoshalDeliveryZone[];
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
    () => sortCheckoutPaymentOptions(paymentSettings.options),
    [paymentSettings.options],
  );
  const defaultAddress = useMemo(
    () => parseRoshalDefaultAddress(user.defaultAddress),
    [user.defaultAddress],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<RoshalPaymentMethod>(
    getDefaultCheckoutPaymentMethod(paymentSettings.options),
  );
  const [deliveryType, setDeliveryType] = useState<"home" | "office">("home");
  const [formState, setFormState] = useState({
    customerName: user.name,
    phone: user.phone,
    email: user.email,
    addressLine1: defaultAddress.addressLine1,
    addressLine2: defaultAddress.thana,
    city: defaultAddress.district,
    postalCode: "",
    notes: "",
    paymentReference: "",
    paymentSender: "",
  });

  const selectedDistrict = useMemo(
    () =>
      bangladeshDistrictOptions.find(
        (option) => option.value === formState.city,
      ) || null,
    [formState.city],
  );

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
    if (
      formState.addressLine2 &&
      selectedDistrict &&
      !selectedDistrict.thanas.includes(formState.addressLine2)
    ) {
      setFormState((state) => ({ ...state, addressLine2: "" }));
    }
  }, [formState.addressLine2, selectedDistrict]);

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
  const selectedWalletNeedsVerification = Boolean(
    selectedOption && isRoshalManualPaymentReferenceRequired(selectedOption),
  );
  const showSelectedPaymentDetails = Boolean(
    selectedOption &&
      ((selectedOption.accountNumber &&
        selectedOption.key !== "cash_on_delivery") ||
        selectedWalletNeedsVerification),
  );
  const gatewayActiveForSelectedOption = Boolean(
    selectedOption &&
      selectedOption.mode === "gateway" &&
      gatewaySummary.configured &&
      gatewaySummary.supportedMethods.includes(selectedOption.key),
  );
  const subtotal = useMemo(
    () =>
      visibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [visibleItems],
  );
  const deliveryEstimate = useMemo(
    () =>
      resolveRoshalDeliveryEstimate({
        addressLine1: formState.addressLine1,
        addressLine2: formState.addressLine2,
        city: formState.city,
        deliverySettings,
        postalCode: formState.postalCode,
        itemCount: visibleItems.length,
        subtotal,
        zones: deliveryZones,
      }),
    [
      deliverySettings,
      deliveryZones,
      formState.addressLine1,
      formState.addressLine2,
      formState.city,
      formState.postalCode,
      subtotal,
      visibleItems.length,
    ],
  );
  const shippingFee = deliveryEstimate.fee;
  const total = subtotal + shippingFee;

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
      case "payment-reference-required":
        return locale === "bn"
          ? "ওয়ালেট পেমেন্টের জন্য সেন্ডার নম্বর ও ট্রানজেকশন আইডি দিন।"
          : "For wallet payment, please provide the sender number and transaction ID.";
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

    const normalizedPhone = normalizeBangladeshPhoneInput(formState.phone);
    const trimmedEmail = formState.email.trim();
    const orderEmail =
      trimmedEmail && !isSyntheticCustomerEmail(trimmedEmail)
        ? trimmedEmail
        : "";

    if (
      formState.customerName.trim().length < 2 ||
      !normalizedPhone ||
      formState.addressLine1.trim().length < 3 ||
      !selectedDistrict ||
      !formState.city ||
      !formState.addressLine2
    ) {
      showCheckoutError(
        locale === "bn"
          ? "নাম, ফোন, ঠিকানা, জেলা এবং থানা দিন।"
          : "Please provide your name, phone, address, district, and thana.",
      );
      return;
    }

    if (!isBangladeshPhoneComplete(normalizedPhone)) {
      showCheckoutError(
        locale === "bn"
          ? "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।"
          : "Please enter a valid 11 digit mobile number.",
      );
      return;
    }

    if (orderEmail && !isLikelyEmail(orderEmail)) {
      showCheckoutError(
        locale === "bn"
          ? "সঠিক ইমেইল দিন অথবা ইমেইল ঘর খালি রাখুন।"
          : "Please enter a valid email address or leave the email field empty.",
      );
      return;
    }

    if (
      selectedWalletNeedsVerification &&
      (!formState.paymentSender.trim() || !formState.paymentReference.trim())
    ) {
      showCheckoutError(
        locale === "bn"
          ? "ম্যানুয়াল পেমেন্টের জন্য সেন্ডার নাম্বার এবং ট্রানজাকশন আইডি দিন।"
          : "For wallet payment, please provide the sender number and transaction ID.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutItems = visibleItems.map((item) => {
        const legacyItem = item as typeof item & { id?: string };

        return {
          productId: item.productId || legacyItem.id || "",
          optionId: item.optionId,
          quantity: item.quantity,
        };
      });
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          customerName: formState.customerName.trim(),
          phone: normalizedPhone,
          email: orderEmail,
          addressLine1: formState.addressLine1.trim(),
          addressLine2: formState.addressLine2.trim(),
          city: formState.city.trim(),
          notes: [formState.notes.trim(), `Delivery type: ${deliveryType}`]
            .filter(Boolean)
            .join(" | "),
          paymentMethod,
          items: checkoutItems,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof payload?.error === "string" && payload.error.trim()
            ? payload.error
            : getCheckoutErrorMessage(payload?.code),
        );
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
    <div className="container mx-auto space-y-8 px-4 py-8 md:py-10">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            {locale === "bn" ? "নিরাপদ চেকআউট" : "Secure Checkout"}
          </p>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {locale === "bn" ? "চেকআউট" : "Checkout"}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                {locale === "bn"
                  ? "ঠিকানা, যোগাযোগের তথ্য এবং পেমেন্ট অপশন দিয়ে সহজে অর্ডার নিশ্চিত করুন।"
                  : "Confirm the order with your address, contact details, and preferred payment option."}
              </p>
            </div>
          </div>
        </div>
      </div>

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

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="order-last min-w-0 space-y-6 lg:order-2 lg:sticky lg:top-28">
          <Card className="h-fit rounded-md border-border/70 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">
                {locale === "bn" ? "অর্ডার সারাংশ" : "Order summary"}
              </CardTitle>
              <p className="text-sm leading-7 text-muted-foreground">
                {locale === "bn"
                  ? "কার্টে থাকা আইটেম, ডেলিভারি চার্জ, এবং মোট খরচ এখানে দেখুন।"
                  : "Review the cart items, delivery fee, and total order amount here."}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {visibleItems.map((item) => (
                <div
                  key={item.selectionKey || item.productId}
                  className="flex gap-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-border/60 bg-muted/20">
                    <Image
                      src={item.image}
                      alt={locale === "bn" ? item.name.bn : item.name.en}
                      fill
                      className="object-cover p-2"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-foreground">
                      {locale === "bn" ? item.name.bn : item.name.en}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {locale === "bn" ? "পরিমাণ" : "Quantity"}: {item.quantity}
                    </p>
                    {item.optionSize || item.optionAmount ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[item.optionSize, item.optionAmount]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatBdt(item.price * item.quantity, locale)}
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="shrink-0 text-muted-foreground">
                  {locale === "bn" ? "সাবটোটাল" : "Subtotal"}
                </span>
                <span className="truncate font-medium text-foreground">
                  {formatBdt(subtotal, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="shrink-0 text-muted-foreground">
                  {locale === "bn" ? "ডেলিভারি" : "Delivery"}
                </span>
                <span className="truncate font-medium text-foreground">
                  {formatBdt(shippingFee, locale)}
                </span>
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                {`${getRoshalDeliveryZoneLabel(locale, deliveryEstimate.zone)} • ${getLocalizedValue(locale, getRoshalDeliveryMatchLabel(deliveryEstimate.matchedBy))}`}
              </p>

              {deliveryEstimate.freeDeliveryApplied ? (
                <p className="text-xs font-medium text-primary">
                  {locale === "bn"
                    ? "Free delivery applied."
                    : `Free delivery applied from ${formatBdt(
                        deliveryEstimate.freeDeliveryThreshold,
                        locale,
                      )}.`}
                </p>
              ) : null}

              {selectedOption ? (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="shrink-0 text-muted-foreground">
                    {locale === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment"}
                  </span>
                  <span className="truncate text-right font-medium text-foreground">
                    {getLocalizedValue(locale, selectedOption.label)}
                  </span>
                </div>
              ) : null}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <div className="flex w-full items-center justify-between gap-2">
                <span className="shrink-0 text-lg font-semibold text-foreground">
                  {locale === "bn" ? "মোট" : "Total"}
                </span>
                <span className="truncate text-2xl font-semibold text-primary">
                  {formatBdt(total, locale)}
                </span>
              </div>

              <Button
                className="w-full rounded-sm"
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
                        ? "অর্ডার রিকোয়েস্ট পাঠানো হচ্ছে..."
                        : "Submitting order request..."
                      : locale === "bn"
                        ? "অর্ডার রিকোয়েস্ট পাঠান"
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

        <div className="order-first min-w-0 space-y-6 lg:order-1">
          <Card className="rounded-md border-border/70 shadow-sm">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1.5">
                <CardTitle className="text-2xl">
                  {locale === "bn" ? "ডেলিভারি তথ্য" : "Delivery details"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Field
                label={locale === "bn" ? "পূর্ণ নাম" : "Full name"}
                value={formState.customerName}
                onChange={(value) => updateFormValue("customerName", value)}
                autoComplete="name"
              />
              <Field
                label={locale === "bn" ? "ফোন" : "Phone"}
                value={formState.phone}
                onChange={(value) => updateFormValue("phone", value)}
                autoComplete="tel"
              />
              <Field
                label={locale === "bn" ? "ইমেইল" : "Email"}
                value={formState.email}
                onChange={(value) => updateFormValue("email", value)}
                autoComplete="email"
                inputMode="email"
                type="email"
              />
              <div className="col-span-1 md:col-span-2">
                <Field
                  label={locale === "bn" ? "ঠিকানা" : "Address"}
                  value={formState.addressLine1}
                  onChange={(value) => updateFormValue("addressLine1", value)}
                  autoComplete="address-line1"
                />
              </div>
              <div className="min-w-0 space-y-2">
                <Label className="block truncate">
                  {locale === "bn" ? "জেলা" : "District"}
                </Label>
                <Select
                  value={formState.city}
                  onValueChange={(value) => {
                    setSubmitError(null);
                    setFormState((state) => ({
                      ...state,
                      city: value,
                      addressLine2: "",
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {bangladeshDistrictOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 space-y-2">
                <Label className="block truncate">
                  {locale === "bn" ? "থানা" : "Thana"}
                </Label>
                <Select
                  value={formState.addressLine2}
                  onValueChange={(value) =>
                    updateFormValue("addressLine2", value)
                  }
                  disabled={!selectedDistrict}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select thana" />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedDistrict?.thanas || []).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 space-y-2 md:col-span-2">
                <Label className="block truncate">
                  {locale === "bn" ? "ডেলিভারি ধরন" : "Delivery type"}
                </Label>
                <RadioGroup
                  value={deliveryType}
                  onValueChange={(value) => {
                    setSubmitError(null);
                    setDeliveryType(value === "office" ? "office" : "home");
                  }}
                  className="grid gap-3 grid-cols-1 sm:grid-cols-2"
                >
                  <Label
                    htmlFor="delivery-home"
                    className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
                      deliveryType === "home"
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/70 hover:bg-muted/20"
                    }`}
                  >
                    <RadioGroupItem
                      value="home"
                      id="delivery-home"
                      className="mt-0.5 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {locale === "bn" ? "হোম ডেলিভারি" : "Home delivery"}
                      </p>
                      <p className="text-xs leading-5 text-muted-foreground">
                        {locale === "bn"
                          ? "বাড়ির ঠিকানায় ডেলিভারি দিন।"
                          : "Deliver to your home address."}
                      </p>
                    </div>
                  </Label>
                  <Label
                    htmlFor="delivery-office"
                    className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
                      deliveryType === "office"
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/70 hover:bg-muted/20"
                    }`}
                  >
                    <RadioGroupItem
                      value="office"
                      id="delivery-office"
                      className="mt-0.5 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {locale === "bn" ? "অফিস ডেলিভারি" : "Office delivery"}
                      </p>
                      <p className="text-xs leading-5 text-muted-foreground">
                        {locale === "bn"
                          ? "কুরিয়ার ব্রাঞ্চ অফিস থেকে পণ্য সংগ্রহ করতে হবে।"
                          : "Collect your product from the courier branch office."}
                      </p>
                    </div>
                  </Label>
                </RadioGroup>

                <div className="min-w-0 space-y-2 md:col-span-2">
                  <Label htmlFor="notes" className="block truncate">
                    {locale === "bn" ? "অর্ডার নোট" : "Order notes"}
                  </Label>
                  <Textarea
                    id="notes"
                    value={formState.notes}
                    onChange={(event) =>
                      updateFormValue("notes", event.target.value)
                    }
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md border-border/70 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">
                {locale === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment method"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => {
                  setSubmitError(null);
                  setPaymentMethod(value as RoshalPaymentMethod);
                }}
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {paymentOptions.map((option) => {
                  const isSelected = option.key === paymentMethod;
                  const logoSrc = checkoutPaymentLogos[option.key];

                  return (
                    <Label
                      key={option.key}
                      htmlFor={option.key}
                      className={`flex h-16 cursor-pointer items-center justify-center gap-2 rounded-sm border px-2 py-2 text-center transition-colors ${
                        isSelected
                          ? "border-primary/50 bg-primary/5"
                          : "border-border/70 hover:bg-muted/20"
                      }`}
                    >
                      <RadioGroupItem
                        value={option.key}
                        id={option.key}
                        className="mt-0.5 shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        {logoSrc ? (
                          <div className="flex items-center justify-center">
                            <Image
                              src={logoSrc}
                              alt={`${getLocalizedValue(locale, option.label)} logo`}
                              width={64}
                              height={20}
                              className="max-h-5 w-auto rounded-[4px] object-contain"
                            />
                          </div>
                        ) : null}
                        <span className="line-clamp-2 text-xs font-semibold leading-tight text-foreground">
                          {getLocalizedValue(locale, option.label)}
                        </span>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>

              {selectedOption && showSelectedPaymentDetails ? (
                <div className="space-y-3 rounded-md border border-border/70 bg-muted/20 p-3">
                  {selectedOption.accountNumber &&
                  selectedOption.key !== "cash_on_delivery" ? (
                    <div className="rounded-sm border border-border/60 bg-background px-3 py-2">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {getCheckoutLocalizedValue(
                          locale,
                          selectedOption.merchantLabel,
                        ) ||
                          (locale === "bn"
                            ? "Send Money (personal)"
                            : "Send Money (personal)")}
                      </p>
                      <p className="mt-1 break-all text-base font-semibold leading-tight text-foreground">
                        {selectedOption.accountNumber}
                      </p>
                    </div>
                  ) : null}

                  {selectedWalletNeedsVerification ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field
                        label={
                          locale === "bn"
                            ? "\u09b8\u09c7\u09a8\u09cd\u09a1\u09be\u09b0 \u09a8\u09be\u09ae\u09cd\u09ac\u09be\u09b0"
                            : "Sender number"
                        }
                        value={formState.paymentSender}
                        onChange={(value) =>
                          updateFormValue("paymentSender", value)
                        }
                        inputMode="tel"
                      />
                      <Field
                        label={
                          locale === "bn"
                            ? "\u099f\u09cd\u09b0\u09be\u09a8\u099c\u09be\u0995\u09b6\u09a8 \u0986\u0987\u09a1\u09bf"
                            : "Transaction ID"
                        }
                        value={formState.paymentReference}
                        onChange={(value) =>
                          updateFormValue("paymentReference", value)
                        }
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
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
      return "চেকআউটের আগে লাইভ স্টকের সঙ্গে মিলিয়ে কিছু পরিমাণ আপডেট করা হয়েছে এবং অনুপলভ্য পণ্য সরানো হয়েছে।";
    }

    if (removedCount > 0) {
      return "চেকআউটের আগে অনুপলভ্য বা স্টক শেষ হওয়া পণ্য সরানো হয়েছে।";
    }

    return "চেকআউটের আগে লাইভ স্টকের সঙ্গে মিলিয়ে কিছু পরিমাণ আপডেট করা হয়েছে।";
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
  autoComplete,
  inputMode,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  type?: HTMLInputTypeAttribute;
}) {
  const inputId = useId();
  const isPhoneField =
    type === "tel" || inputMode === "tel" || autoComplete === "tel";

  return (
    <div className="min-w-0 w-full space-y-2">
      <Label htmlFor={inputId} className="block truncate">
        {label}
      </Label>
      {isPhoneField ? (
        <PhoneInput2
          id={inputId}
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
        />
      ) : (
        <Input
          id={inputId}
          type={type}
          value={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="w-full"
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
