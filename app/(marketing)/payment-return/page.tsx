import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRoshalSessionUser } from "@/lib/store-auth";
import { getRoshalLocale } from "@/lib/store-i18n";

function normalizePaymentState(
  value: string | undefined,
): "success" | "failed" | "cancelled" | "processing" {
  if (
    value === "success" ||
    value === "failed" ||
    value === "cancelled" ||
    value === "processing"
  ) {
    return value;
  }

  return "processing";
}

function getPaymentReturnCopy(
  locale: "bn" | "en",
  payment: "success" | "failed" | "cancelled" | "processing",
) {
  switch (payment) {
    case "success":
      return {
        title:
          locale === "bn"
            ? "পেমেন্ট সফল হয়েছে"
            : "Payment completed successfully",
        description:
          locale === "bn"
            ? "আপনার পেমেন্ট গ্রহণ করা হয়েছে। লগইন করলে অর্ডার ট্র্যাকিং দেখতে পারবেন।"
            : "Your payment was received. Sign in to view the order tracking details.",
      };
    case "failed":
      return {
        title: locale === "bn" ? "পেমেন্ট ব্যর্থ হয়েছে" : "Payment failed",
        description:
          locale === "bn"
            ? "গেটওয়ে পেমেন্ট সম্পন্ন করতে পারেনি। চাইলে আবার চেষ্টা করুন অথবা বিকল্প পদ্ধতি বেছে নিন।"
            : "The gateway could not complete the payment. You can try again or use another method.",
      };
    case "cancelled":
      return {
        title:
          locale === "bn" ? "পেমেন্ট বাতিল করা হয়েছে" : "Payment was cancelled",
        description:
          locale === "bn"
            ? "আপনি গেটওয়ে পেমেন্ট বাতিল করেছেন। চাইলে আবার চেকআউট থেকে অর্ডার দিন।"
            : "You cancelled the gateway payment. You can place the order again from checkout.",
      };
    default:
      return {
        title:
          locale === "bn"
            ? "পেমেন্ট যাচাই চলছে"
            : "Payment verification is in progress",
        description:
          locale === "bn"
            ? "গেটওয়ে থেকে আপডেট পাওয়া গেছে, তবে চূড়ান্ত যাচাই এখনো বাকি। লগইন করলে অর্ডারের সর্বশেষ অবস্থা দেখতে পারবেন।"
            : "The gateway reported an update, but final verification is still pending. Sign in to see the latest order status.",
      };
  }
}

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; payment?: string }>;
}) {
  const [locale, sessionUser, resolvedSearchParams] = await Promise.all([
    getRoshalLocale(),
    getRoshalSessionUser(),
    searchParams,
  ]);
  const payment = normalizePaymentState(resolvedSearchParams.payment);
  const orderId = resolvedSearchParams.orderId?.trim() || "";

  if (sessionUser && orderId) {
    redirect(`/orders/${orderId}?payment=${payment}`);
  }

  const copy = getPaymentReturnCopy(locale, payment);
  const callbackUrl = orderId ? `/orders/${orderId}` : "/orders";

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl">{copy.title}</CardTitle>
          <CardDescription className="text-base leading-7">
            {copy.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link
              href={`/login?callbackURL=${encodeURIComponent(callbackUrl)}`}
            >
              {locale === "bn" ? "লগইন করে অর্ডার দেখুন" : "Sign in to view order"}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">
              {locale === "bn" ? "পণ্য দেখুন" : "Browse products"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
