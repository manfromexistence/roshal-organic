"use client";

import { Loader2, LocateFixed } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { HTMLAttributes, HTMLInputTypeAttribute } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { resolveImageUrl } from "@/lib/storage-utils";
import {
  getRoshalDeliveryMatchLabel,
  getRoshalDeliveryZoneLabel,
  resolveRoshalDeliveryEstimate,
} from "@/lib/store-delivery";
import { formatBdt } from "@/lib/store-format";
import { getLocalizedValue } from "@/lib/store-locale";
import { getRoshalPaymentMethodLabel } from "@/lib/store-orders";
import type {
  RoshalDeliveryZone,
  RoshalLocale,
  RoshalPaymentGatewaySummary,
  RoshalPaymentMethod,
  RoshalPaymentOption,
  RoshalPaymentSettings,
  RoshalProduct,
} from "@/lib/store-types";
import { useCartStore } from "@/store/cart-store";

interface RoshalReverseGeocodeResponse {
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    village?: string;
    town?: string;
    city?: string;
    municipality?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
  };
}

function getCurrentBrowserPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 5 * 60 * 1000,
    });
  });
}

function joinUniqueValues(values: Array<string | undefined>) {
  const seen = new Set<string>();

  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .filter((value) => {
      const normalized = value.toLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
}

async function reverseGeocodeCurrentLocation(
  locale: RoshalLocale,
  latitude: number,
  longitude: number,
) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "18");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale === "bn" ? "bn,en" : "en,bn",
    },
  });

  if (!response.ok) {
    throw new Error("Could not reverse geocode the current location.");
  }

  const payload = (await response.json()) as RoshalReverseGeocodeResponse;
  const address = payload.address || {};
  const city =
    address.city ||
    address.town ||
    address.municipality ||
    address.county ||
    address.state_district ||
    address.state ||
    "";
  const addressLine1 =
    joinUniqueValues([
      [address.house_number, address.road].filter(Boolean).join(" ").trim(),
      address.road,
      address.neighbourhood,
      address.suburb,
      payload.display_name?.split(",")[0],
    ])[0] || "";
  const addressLine2 = joinUniqueValues([
    address.suburb,
    address.neighbourhood,
    address.quarter,
    address.village,
  ]).join(", ");

  return {
    addressLine1,
    addressLine2,
    city,
    postalCode: address.postcode || "",
  };
}

function getDefaultCheckoutPaymentMethod(
  options: RoshalPaymentSettings["options"],
): RoshalPaymentMethod {
  const sortedOptions = [...options].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return (
    sortedOptions.find(
      (option) =>
        option.enabled && (option.mode === "manual" || option.requiresProof),
    )?.key ||
    sortedOptions.find((option) => option.enabled)?.key ||
    "bkash"
  );
}

function getCheckoutPaymentModeLabel(
  locale: RoshalLocale,
  option: RoshalPaymentOption,
) {
  if (option.mode === "manual" || option.requiresProof) {
    return locale === "bn" ? "অ্যাডমিন ভেরিফাই" : "Admin verify";
  }

  return locale === "bn" ? "অনলাইন পেমেন্ট" : "Online payment";
}

function getCheckoutPaymentSummary(
  locale: RoshalLocale,
  option: RoshalPaymentOption,
  gatewayActive: boolean,
) {
  if (option.key === "bkash") {
    return locale === "bn"
      ? "বিকাশে পেমেন্ট করুন, ট্রানজ্যাকশন আইডি ও স্ক্রিনশট দিন, তারপর অ্যাডমিন টিম ভেরিফাই করে অর্ডার কনফার্ম করবে।"
      : "Pay with bKash, submit the transaction ID and screenshot, and the admin team will verify the payment before confirming the order.";
  }

  if (option.key === "nagad") {
    return locale === "bn"
      ? "নগদে পেমেন্ট করুন, ট্রানজ্যাকশন আইডি ও স্ক্রিনশট দিন, তারপর অ্যাডমিন টিম ভেরিফাই করে অর্ডার কনফার্ম করবে।"
      : "Pay with Nagad, submit the transaction ID and screenshot, and the admin team will verify the payment before confirming the order.";
  }

  if (option.key === "rocket") {
    return locale === "bn"
      ? "রকেটে পেমেন্ট করুন, ট্রানজ্যাকশন আইডি ও স্ক্রিনশট দিন, তারপর অ্যাডমিন টিম ভেরিফাই করে অর্ডার কনফার্ম করবে।"
      : "Pay with Rocket, submit the transaction ID and screenshot, and the admin team will verify the payment before confirming the order.";
  }

  if (option.key === "card") {
    return gatewayActive
      ? locale === "bn"
        ? "অর্ডার কনফার্ম করার পর নিরাপদ অনলাইন কার্ড পেমেন্টে নেওয়া হবে।"
        : "After confirming the order, you will continue to secure online card payment."
      : locale === "bn"
        ? "কার্ড পেমেন্টের জন্য অর্ডার রিকোয়েস্ট দিন, এরপর টিম আপনার সাথে পেমেন্ট কনফার্ম করবে।"
        : "Submit the order request for card payment and the team will confirm the payment flow with you.";
  }

  return gatewayActive
    ? locale === "bn"
      ? "অর্ডার কনফার্ম করার পর নিরাপদ অনলাইন পেমেন্টে নেওয়া হবে।"
      : "After confirming the order, you will continue to secure online payment."
    : locale === "bn"
      ? "অর্ডার রিকোয়েস্ট দিন, এরপর টিম আপনার সাথে পেমেন্ট কনফার্ম করবে।"
      : "Submit the order request and the team will confirm the payment flow with you.";
}

export function CheckoutPageClient({
  deliveryZones,
  gatewaySummary,
  locale,
  paymentSettings,
  products,
  user,
}: {
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
    () =>
      paymentSettings.options
        .filter((option) => option.enabled)
        .sort((left, right) => left.sortOrder - right.sortOrder),
    [paymentSettings.options],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
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
  const deliveryEstimate = useMemo(
    () =>
      resolveRoshalDeliveryEstimate({
        addressLine1: formState.addressLine1,
        addressLine2: formState.addressLine2,
        city: formState.city,
        postalCode: formState.postalCode,
        itemCount: visibleItems.length,
        zones: deliveryZones,
      }),
    [
      deliveryZones,
      formState.addressLine1,
      formState.addressLine2,
      formState.city,
      formState.postalCode,
      visibleItems.length,
    ],
  );
  const shippingFee = deliveryEstimate.fee;
  const total = subtotal + shippingFee;

  const updateFormValue = (field: keyof typeof formState, value: string) => {
    setSubmitError(null);
    setFormState((state) => ({ ...state, [field]: value }));
  };

  const useCurrentLocation = async () => {
    if (typeof window === "undefined") {
      return;
    }

    setSubmitError(null);
    setIsLocating(true);

    try {
      const position = await getCurrentBrowserPosition();
      const resolvedAddress = await reverseGeocodeCurrentLocation(
        locale,
        position.coords.latitude,
        position.coords.longitude,
      );

      setFormState((state) => ({
        ...state,
        addressLine1: resolvedAddress.addressLine1 || state.addressLine1,
        addressLine2: resolvedAddress.addressLine2 || state.addressLine2,
        city: resolvedAddress.city || state.city,
        postalCode: resolvedAddress.postalCode || state.postalCode,
      }));

      toast({
        title:
          locale === "bn"
            ? "বর্তমান লোকেশন ব্যবহার করা হয়েছে"
            : "Current location applied",
        description:
          locale === "bn"
            ? "ডেলিভারি ঠিকানা, শহর, এবং পোস্ট কোড আপডেট করা হয়েছে।"
            : "The delivery address, city, and postal code have been updated.",
      });
    } catch (error) {
      console.error("Current location autofill failed:", error);

      const message =
        error &&
        typeof error === "object" &&
        "code" in error &&
        typeof error.code === "number"
          ? error.code === 1
            ? locale === "bn"
              ? "লোকেশন পারমিশন দেওয়া হয়নি। ব্রাউজার থেকে লোকেশন অনুমতি দিন।"
              : "Location permission was denied. Please allow location access in the browser."
            : locale === "bn"
              ? "বর্তমান লোকেশন পাওয়া যায়নি। আবার চেষ্টা করুন।"
              : "Could not determine the current location. Please try again."
          : error instanceof Error
            ? error.message
            : locale === "bn"
              ? "বর্তমান লোকেশন পাওয়া যায়নি।"
              : "Could not determine the current location.";

      showCheckoutError(message);
    } finally {
      setIsLocating(false);
    }
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
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          notes: [formState.notes.trim(), `Delivery type: ${deliveryType}`]
            .filter(Boolean)
            .join(" | "),
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
    <div className="container mx-auto space-y-8 px-4 py-10">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          {locale === "bn" ? "নিরাপদ চেকআউট" : "Secure Checkout"}
        </p>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {locale === "bn"
                ? "ডেলিভারি ও পেমেন্ট সম্পন্ন করুন"
                : "Complete delivery and payment"}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              {locale === "bn"
                ? "ঠিকানা, যোগাযোগ, পেমেন্ট অপশন, এবং প্রয়োজনে স্ক্রিনশট প্রুফ দিয়ে অর্ডার নিশ্চিত করুন।"
                : "Confirm the order with your address, contact details, payment option, and proof screenshot when required."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {paymentOptions.map((option) => (
              <Badge
                key={option.key}
                variant="secondary"
                className="rounded-full px-3 py-1"
              >
                {getLocalizedValue(locale, option.label)}
              </Badge>
            ))}
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

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="space-y-6">
          <Card className="rounded-md border-border/70 shadow-sm">
            <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <CardTitle className="text-2xl">
                  {locale === "bn" ? "ডেলিভারি তথ্য" : "Delivery details"}
                </CardTitle>
                <p className="text-sm leading-6 text-muted-foreground">
                  {locale === "bn"
                    ? "à¦¬à§à¦°à¦¾à¦‰à¦œà¦¾à¦° à¦…à¦Ÿà§‹à¦«à¦¿à¦² à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨ à¦…à¦¥à¦¬à¦¾ à¦¬à¦°à§à¦¤à¦®à¦¾à¦¨ à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦†à¦¨à§‡ à¦ à¦¿à¦•à¦¾à¦¨à¦¾ à¦“ à¦¶à¦¹à¦° à¦¦à§à¦°à§à¦¤ à¦ªà§‚à¦°à¦£ à¦•à¦°à§à¦¨à¥¤"
                    : "Use browser autofill or pull your current location to quickly fill the address, city, and postal code."}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full shrink-0 sm:w-auto"
                onClick={useCurrentLocation}
                disabled={isLocating}
              >
                {isLocating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {locale === "bn"
                      ? "à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦†à¦¨à¦¾ à¦¹à¦šà§à¦›à§‡..."
                      : "Locating..."}
                  </>
                ) : (
                  <>
                    <LocateFixed className="size-4" />
                    {locale === "bn"
                      ? "à¦¬à¦°à§à¦¤à¦®à¦¾à¦¨ à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨"
                      : "Use current location"}
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
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
                inputMode="tel"
                type="tel"
              />
              <Field
                label={locale === "bn" ? "ইমেইল" : "Email"}
                value={formState.email}
                onChange={(value) => updateFormValue("email", value)}
                autoComplete="email"
                inputMode="email"
                type="email"
              />
              <Field
                label={locale === "bn" ? "পোস্ট কোড" : "Postal code"}
                value={formState.postalCode}
                onChange={(value) => updateFormValue("postalCode", value)}
                autoComplete="postal-code"
                inputMode="numeric"
              />
              <div className="md:col-span-2">
                <Field
                  label={locale === "bn" ? "ঠিকানা" : "Address"}
                  value={formState.addressLine1}
                  onChange={(value) => updateFormValue("addressLine1", value)}
                  autoComplete="address-line1"
                />
              </div>
              <div className="md:col-span-2">
                <Field
                  label={locale === "bn" ? "অতিরিক্ত ঠিকানা" : "Address line 2"}
                  value={formState.addressLine2}
                  onChange={(value) => updateFormValue("addressLine2", value)}
                  autoComplete="address-line2"
                />
              </div>
              <Field
                label={locale === "bn" ? "শহর" : "City"}
                value={formState.city}
                onChange={(value) => updateFormValue("city", value)}
                autoComplete="address-level2"
              />
              <div className="space-y-2 md:col-span-2">
                <Label>
                  {locale === "bn" ? "ডেলিভারি ধরন" : "Delivery type"}
                </Label>
                <RadioGroup
                  value={deliveryType}
                  onValueChange={(value) => {
                    setSubmitError(null);
                    setDeliveryType(value === "office" ? "office" : "home");
                  }}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <Label
                    htmlFor="delivery-home"
                    className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
                      deliveryType === "home"
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/70 hover:bg-muted/20"
                    }`}
                  >
                    <RadioGroupItem value="home" id="delivery-home" />
                    <div className="space-y-1">
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
                    <RadioGroupItem value="office" id="delivery-office" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {locale === "bn" ? "অফিস ডেলিভারি" : "Office delivery"}
                      </p>
                      <p className="text-xs leading-5 text-muted-foreground">
                        {locale === "bn"
                          ? "অফিস বা কর্মস্থলের ঠিকানায় ডেলিভারি দিন।"
                          : "Deliver to your office or workplace."}
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">
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
            </CardContent>
          </Card>

          <Card className="rounded-md border-border/70 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">
                {locale === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment method"}
              </CardTitle>
              <p className="text-sm leading-7 text-muted-foreground">
                {locale === "bn"
                  ? "যে পেমেন্ট অপশনটি সুবিধাজনক সেটি বেছে নিন এবং প্রয়োজন হলে প্রুফ আপলোড করুন।"
                  : "Choose the payment option that fits best and upload proof when it is required."}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => {
                  setSubmitError(null);
                  setPaymentMethod(value as RoshalPaymentMethod);
                }}
                className="grid gap-3 sm:grid-cols-2"
              >
                {paymentOptions.map((option) => {
                  const isSelected = option.key === paymentMethod;

                  return (
                    <Label
                      key={option.key}
                      htmlFor={option.key}
                      className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
                        isSelected
                          ? "border-primary/50 bg-primary/5"
                          : "border-border/70 hover:bg-muted/20"
                      }`}
                    >
                      <RadioGroupItem value={option.key} id={option.key} />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {getLocalizedValue(locale, option.label)}
                          </span>
                          <Badge variant="outline" className="rounded-sm">
                            {getCheckoutPaymentModeLabel(locale, option)}
                          </Badge>
                        </div>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {getCheckoutPaymentSummary(
                            locale,
                            option,
                            Boolean(
                              option.mode === "gateway" &&
                                gatewaySummary.configured &&
                                gatewaySummary.supportedMethods.includes(
                                  option.key,
                                ),
                            ),
                          )}
                        </p>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>

              {selectedOption ? (
                <div className="space-y-5 rounded-md border border-border/70 bg-muted/20 p-4">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {getLocalizedValue(locale, selectedOption.label)}
                          </h3>
                          <Badge variant="secondary" className="rounded-sm">
                            {getCheckoutPaymentModeLabel(
                              locale,
                              selectedOption,
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {getCheckoutPaymentSummary(
                            locale,
                            selectedOption,
                            gatewayActiveForSelectedOption,
                          )}
                        </p>
                      </div>

                      {selectedOption.accountNumber ? (
                        <div className="rounded-sm border border-border/60 bg-background p-4">
                          <p className="text-sm text-muted-foreground">
                            {locale === "bn" ? "পেমেন্ট নম্বর" : "Payment number"}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-foreground">
                            {selectedOption.accountNumber}
                          </p>
                        </div>
                      ) : null}

                      {selectedOption.mode === "gateway" &&
                      !gatewayActiveForSelectedOption ? (
                        <div className="rounded-sm border border-border/60 bg-background p-4 text-sm leading-7 text-muted-foreground">
                          {locale === "bn"
                            ? "অর্ডার রিকোয়েস্ট সাবমিট করার পর টিম পেমেন্ট সম্পন্ন করার জন্য আপনার সাথে যোগাযোগ করবে।"
                            : "After you submit the order request, the team will contact you to complete the payment."}
                        </div>
                      ) : null}
                    </div>

                    {selectedOption.guideImageUrl ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          {locale === "bn" ? "পেমেন্ট গাইড" : "Payment guide"}
                        </p>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border/60 bg-background">
                          <Image
                            src={resolveImageUrl(selectedOption.guideImageUrl)}
                            alt={getLocalizedValue(
                              locale,
                              selectedOption.label,
                            )}
                            fill
                            sizes="(max-width: 1024px) 100vw, 288px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {shouldCapturePaymentDetails ? (
                    <>
                      <Separator />
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
                                : "Upload the payment screenshot or confirmation for the selected method."
                            }
                            value={formState.paymentProofUrl}
                            onChange={(value) =>
                              updateFormValue("paymentProofUrl", value)
                            }
                          />
                        </div>
                      </div>
                    </>
                  ) : null}

                  <p className="text-sm leading-7 text-muted-foreground">
                    {locale === "bn"
                      ? "পেমেন্ট প্রুফ জমা দিলে অ্যাডমিন টিম যাচাই করে অর্ডারের পরবর্তী আপডেট দেবে।"
                      : "After you submit the payment proof, the admin team will verify it and share the next order update."}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit rounded-md border-border/70 shadow-sm lg:sticky lg:top-28">
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
              <div key={item.productId} className="flex gap-3">
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
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatBdt(item.price * item.quantity, locale)}
                  </p>
                </div>
              </div>
            ))}

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {locale === "bn" ? "সাবটোটাল" : "Subtotal"}
              </span>
              <span className="font-medium text-foreground">
                {formatBdt(subtotal, locale)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {locale === "bn" ? "ডেলিভারি" : "Delivery"}
              </span>
              <span className="font-medium text-foreground">
                {formatBdt(shippingFee, locale)}
              </span>
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              {`${getRoshalDeliveryZoneLabel(locale, deliveryEstimate.zone)} • ${getLocalizedValue(locale, getRoshalDeliveryMatchLabel(deliveryEstimate.matchedBy))}`}
            </p>

            {selectedOption ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {locale === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment"}
                </span>
                <span className="font-medium text-foreground">
                  {getLocalizedValue(
                    locale,
                    getRoshalPaymentMethodLabel(selectedOption.key),
                  )}
                </span>
              </div>
            ) : null}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <span className="text-lg font-semibold text-foreground">
                {locale === "bn" ? "মোট" : "Total"}
              </span>
              <span className="text-2xl font-semibold text-primary">
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

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
