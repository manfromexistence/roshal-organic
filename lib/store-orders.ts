import { localizedValue } from "@/lib/store-locale";
import type {
  LocalizedValue,
  RoshalOrder,
  RoshalOrderTrackingStep,
  RoshalPaymentMethod,
} from "@/lib/store-types";

export const ROSHAL_STANDARD_SHIPPING_FEE = 60;

export function getRoshalOrderStatusLabel(status: string): LocalizedValue {
  switch (status) {
    case "payment-review":
      return localizedValue("পেমেন্ট যাচাই", "Payment review");
    case "confirmed":
      return localizedValue("নিশ্চিত", "Confirmed");
    case "processing":
      return localizedValue("প্রসেসিং", "Processing");
    case "shipped":
      return localizedValue("পাঠানো হয়েছে", "Shipped");
    case "delivered":
      return localizedValue("ডেলিভার হয়েছে", "Delivered");
    case "cancelled":
      return localizedValue("বাতিল", "Cancelled");
    default:
      return localizedValue("অপেক্ষমাণ", "Pending");
  }
}

export function getRoshalPaymentStatusLabel(status: string): LocalizedValue {
  switch (status) {
    case "under-review":
      return localizedValue("যাচাই চলছে", "Under review");
    case "paid":
      return localizedValue("পরিশোধিত", "Paid");
    case "failed":
      return localizedValue("ব্যর্থ", "Failed");
    default:
      return localizedValue("অপেক্ষমাণ", "Pending");
  }
}

export function getRoshalOrderStatusBadgeVariant(status: string) {
  switch (status) {
    case "cancelled":
      return "destructive" as const;
    case "confirmed":
    case "processing":
    case "shipped":
      return "secondary" as const;
    case "delivered":
      return "default" as const;
    default:
      return "outline" as const;
  }
}

export function getRoshalPaymentStatusBadgeVariant(status: string) {
  switch (status) {
    case "failed":
      return "destructive" as const;
    case "paid":
      return "default" as const;
    case "under-review":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

export function getRoshalPaymentMethodLabel(
  method: RoshalPaymentMethod,
): LocalizedValue {
  switch (method) {
    case "cash_on_delivery":
      return localizedValue("ক্যাশ অন ডেলিভারি (COD)", "Cash On Delivery (COD)");
    case "card":
      return localizedValue("কার্ড", "Card");
    case "nagad":
      return localizedValue("নগদ", "Nagad");
    case "rocket":
      return localizedValue("রকেট", "Rocket");
    case "upay":
      return localizedValue("উপায়", "Upay");
    default:
      return localizedValue("বিকাশ", "bKash");
  }
}

export function getRoshalDeliveryType(order: Pick<RoshalOrder, "notes">) {
  const notes = order.notes.toLowerCase();
  const match = notes.match(/delivery\s*type:\s*(home|office)/i);

  if (match?.[1] === "office") {
    return "office";
  }

  if (match?.[1] === "home") {
    return "home";
  }

  return "unknown";
}

export function getRoshalDeliveryTypeLabel(type: string): LocalizedValue {
  switch (type) {
    case "office":
      return localizedValue("কুরিয়ার অফিস", "Office delivery");
    case "home":
      return localizedValue("হোম ডেলিভারি", "Home delivery");
    default:
      return localizedValue("সেট করা নেই", "Not set");
  }
}

function isOrderAtLeast(order: RoshalOrder, status: string) {
  const orderFlow = [
    "pending",
    "payment-review",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  return orderFlow.indexOf(order.status) >= orderFlow.indexOf(status);
}

export function getRoshalOrderTrackingSteps(
  order: RoshalOrder,
): RoshalOrderTrackingStep[] {
  if (order.status === "cancelled") {
    return [
      {
        key: "placed",
        label: localizedValue("অর্ডার করা হয়েছে", "Order placed"),
        description: localizedValue(
          "আপনার অর্ডার গ্রহণ করা হয়েছে।",
          "Your order was received.",
        ),
        completed: true,
      },
      {
        key: "cancelled",
        label: localizedValue("বাতিল", "Cancelled"),
        description: localizedValue(
          order.trackingNote || "অর্ডারটি বাতিল করা হয়েছে।",
          order.trackingNote || "The order was cancelled.",
        ),
        completed: true,
        highlighted: true,
      },
    ];
  }

  if (order.paymentMethod === "cash_on_delivery") {
    return [
      {
        key: "placed",
        label: localizedValue("অর্ডার করা হয়েছে", "Order placed"),
        description: localizedValue(
          "আমরা আপনার অর্ডারটি গ্রহণ করেছি।",
          "We have received your order.",
        ),
        completed: true,
      },
      {
        key: "payment",
        label: localizedValue("ক্যাশ অন ডেলিভারি (COD)", "Cash On Delivery (COD)"),
        description: localizedValue(
          order.paymentStatus === "paid"
            ? "ডেলিভারির সময় ক্যাশ পেমেন্ট সংগ্রহ করা হয়েছে।"
            : "অর্ডার পৌঁছালে ডেলিভারি ম্যানকে ক্যাশে পেমেন্ট করবেন।",
          order.paymentStatus === "paid"
            ? "Cash on delivery payment has been collected."
            : "Please pay in cash when the order reaches you.",
        ),
        completed: order.paymentStatus === "paid",
        highlighted:
          order.paymentStatus !== "paid" && order.status !== "cancelled",
      },
      {
        key: "confirmed",
        label: localizedValue("অর্ডার নিশ্চিত", "Order confirmed"),
        description: localizedValue(
          "অ্যাডমিন অর্ডারটি প্রসেসের জন্য অনুমোদন দিয়েছে।",
          "The admin has approved the order for processing.",
        ),
        completed: isOrderAtLeast(order, "confirmed"),
        highlighted: order.status === "confirmed",
      },
      {
        key: "processing",
        label: localizedValue("প্রসেসিং", "Processing"),
        description: localizedValue(
          "আপনার অর্ডার প্রস্তুত ও প্যাক করা হচ্ছে।",
          "Your order is being prepared and packed for delivery.",
        ),
        completed: isOrderAtLeast(order, "processing"),
        highlighted: order.status === "processing",
      },
      {
        key: "shipped",
        label: localizedValue("পাঠানো হয়েছে", "Shipped"),
        description: localizedValue(
          "অর্ডারটি ডেলিভারির জন্য পাঠানো হয়েছে।",
          "The order has been dispatched for delivery.",
        ),
        completed: isOrderAtLeast(order, "shipped"),
        highlighted: order.status === "shipped",
      },
      {
        key: "delivered",
        label: localizedValue("ডেলিভার হয়েছে", "Delivered"),
        description: localizedValue(
          "অর্ডারটি সফলভাবে ডেলিভার হয়েছে।",
          "The order has been delivered successfully.",
        ),
        completed: order.status === "delivered",
      },
    ];
  }

  return [
    {
      key: "placed",
      label: localizedValue("অর্ডার করা হয়েছে", "Order placed"),
      description: localizedValue(
        "আমরা আপনার অর্ডারটি গ্রহণ করেছি।",
        "We have received your order.",
      ),
      completed: true,
    },
    {
      key: "payment",
      label: localizedValue("পেমেন্ট যাচাই", "Payment review"),
      description: localizedValue(
        order.paymentStatus === "paid"
          ? "পেমেন্ট যাচাই সম্পন্ন হয়েছে।"
          : "পেমেন্ট যাচাই চলছে বা অপেক্ষমাণ।",
        order.paymentStatus === "paid"
          ? "Payment verification is complete."
          : "Payment is pending or under review.",
      ),
      completed: order.paymentStatus === "paid",
      highlighted:
        (order.paymentStatus !== "paid" && order.status === "pending") ||
        order.paymentStatus === "under-review" ||
        order.status === "payment-review",
    },
    {
      key: "confirmed",
      label: localizedValue("অর্ডার নিশ্চিত", "Order confirmed"),
      description: localizedValue(
        "অ্যাডমিন অর্ডারটি প্রসেসের জন্য অনুমোদন দিয়েছে।",
        "The admin has approved the order for processing.",
      ),
      completed: isOrderAtLeast(order, "confirmed"),
      highlighted: order.status === "confirmed",
    },
    {
      key: "processing",
      label: localizedValue("প্রসেসিং", "Processing"),
      description: localizedValue(
        "আপনার অর্ডার প্রস্তুত ও প্যাক করা হচ্ছে।",
        "Your order is being prepared and packed for delivery.",
      ),
      completed: isOrderAtLeast(order, "processing"),
      highlighted: order.status === "processing",
    },
    {
      key: "shipped",
      label: localizedValue("পাঠানো হয়েছে", "Shipped"),
      description: localizedValue(
        "অর্ডারটি ডেলিভারির জন্য পাঠানো হয়েছে।",
        "The order has been dispatched for delivery.",
      ),
      completed: isOrderAtLeast(order, "shipped"),
      highlighted: order.status === "shipped",
    },
    {
      key: "delivered",
      label: localizedValue("ডেলিভার হয়েছে", "Delivered"),
      description: localizedValue(
        "অর্ডারটি সফলভাবে ডেলিভার হয়েছে।",
        "The order has been delivered successfully.",
      ),
      completed: order.status === "delivered",
    },
  ];
}
