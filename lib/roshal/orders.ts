import { localizedValue } from "./locale";
import type {
  LocalizedValue,
  RoshalOrder,
  RoshalOrderTrackingStep,
  RoshalPaymentMethod,
} from "./types";

export const ROSHAL_STANDARD_SHIPPING_FEE = 60;

export function getRoshalOrderStatusLabel(status: string): LocalizedValue {
  switch (status) {
    case "payment-review":
      return localizedValue(
        "à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ à¦¯à¦¾à¦šà¦¾à¦‡",
        "Payment review",
      );
    case "confirmed":
      return localizedValue("à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤", "Confirmed");
    case "processing":
      return localizedValue("à¦ªà§à¦°à¦¸à§‡à¦¸à¦¿à¦‚", "Processing");
    case "shipped":
      return localizedValue("à¦ªà¦¾à¦ à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡", "Shipped");
    case "delivered":
      return localizedValue(
        "à¦¡à§‡à¦²à¦¿à¦­à¦¾à¦° à¦¹à§Ÿà§‡à¦›à§‡",
        "Delivered",
      );
    case "cancelled":
      return localizedValue("à¦¬à¦¾à¦¤à¦¿à¦²", "Cancelled");
    default:
      return localizedValue("à¦…à¦ªà§‡à¦•à§à¦·à¦®à¦¾à¦£", "Pending");
  }
}

export function getRoshalPaymentStatusLabel(status: string): LocalizedValue {
  switch (status) {
    case "under-review":
      return localizedValue("à¦¯à¦¾à¦šà¦¾à¦‡ à¦šà¦²à¦›à§‡", "Under review");
    case "paid":
      return localizedValue("à¦ªà¦°à¦¿à¦¶à§‹à¦§à¦¿à¦¤", "Paid");
    case "failed":
      return localizedValue("à¦¬à§à¦¯à¦°à§à¦¥", "Failed");
    default:
      return localizedValue("à¦…à¦ªà§‡à¦•à§à¦·à¦®à¦¾à¦£", "Pending");
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
    case "card":
      return localizedValue("à¦•à¦¾à¦°à§à¦¡", "Card");
    case "nagad":
      return localizedValue("à¦¨à¦—à¦¦", "Nagad");
    case "rocket":
      return localizedValue("à¦°à¦•à§‡à¦Ÿ", "Rocket");
    case "upay":
      return localizedValue("à¦‰à¦ªà¦¾à§Ÿ", "Upay");
    default:
      return localizedValue("à¦¬à¦¿à¦•à¦¾à¦¶", "bKash");
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
        label: localizedValue(
          "à¦…à¦°à§à¦¡à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡",
          "Order placed",
        ),
        description: localizedValue(
          "à¦†à¦ªà¦¨à¦¾à¦° à¦…à¦°à§à¦¡à¦¾à¦° à¦—à§à¦°à¦¹à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤",
          "Your order was received.",
        ),
        completed: true,
      },
      {
        key: "cancelled",
        label: localizedValue("à¦¬à¦¾à¦¤à¦¿à¦²", "Cancelled"),
        description: localizedValue(
          order.trackingNote ||
            "à¦…à¦°à§à¦¡à¦¾à¦°à¦Ÿà¦¿ à¦¬à¦¾à¦¤à¦¿à¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤",
          order.trackingNote || "The order was cancelled.",
        ),
        completed: true,
        highlighted: true,
      },
    ];
  }

  return [
    {
      key: "placed",
      label: localizedValue(
        "à¦…à¦°à§à¦¡à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡",
        "Order placed",
      ),
      description: localizedValue(
        "à¦†à¦®à¦°à¦¾ à¦†à¦ªà¦¨à¦¾à¦° à¦…à¦°à§à¦¡à¦¾à¦°à¦Ÿà¦¿ à¦—à§à¦°à¦¹à¦£ à¦•à¦°à§‡à¦›à¦¿à¥¤",
        "We have received your order.",
      ),
      completed: true,
    },
    {
      key: "payment",
      label: localizedValue(
        "à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ à¦¯à¦¾à¦šà¦¾à¦‡",
        "Payment review",
      ),
      description: localizedValue(
        order.paymentStatus === "paid"
          ? "à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ à¦¯à¦¾à¦šà¦¾à¦‡ à¦¸à¦®à§à¦ªà¦¨à§à¦¨ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
          : "à¦ªà§‡à¦®à§‡à¦¨à§à¦Ÿ à¦¯à¦¾à¦šà¦¾à¦‡ à¦šà¦²à¦›à§‡ à¦¬à¦¾ à¦…à¦ªà§‡à¦•à§à¦·à¦®à¦¾à¦£à¥¤",
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
      label: localizedValue(
        "à¦…à¦°à§à¦¡à¦¾à¦° à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤",
        "Order confirmed",
      ),
      description: localizedValue(
        "à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦…à¦°à§à¦¡à¦¾à¦°à¦Ÿà¦¿ à¦ªà§à¦°à¦¸à§‡à¦¸à§‡à¦° à¦œà¦¨à§à¦¯ à¦…à¦¨à§à¦®à§‹à¦¦à¦¨ à¦¦à¦¿à§Ÿà§‡à¦›à§‡à¥¤",
        "The admin has approved the order for processing.",
      ),
      completed: isOrderAtLeast(order, "confirmed"),
      highlighted: order.status === "confirmed",
    },
    {
      key: "processing",
      label: localizedValue("à¦ªà§à¦°à¦¸à§‡à¦¸à¦¿à¦‚", "Processing"),
      description: localizedValue(
        "à¦†à¦ªà¦¨à¦¾à¦° à¦…à¦°à§à¦¡à¦¾à¦° à¦ªà§à¦°à¦¸à§‡à¦¸ à¦•à¦°à¦¾ à¦¹à¦šà§à¦›à§‡ à¦à¦¬à¦‚ à¦¡à§‡à¦²à¦¿à¦­à¦¾à¦°à¦¿à¦° à¦œà¦¨à§à¦¯ à¦ªà§à¦°à¦¸à§à¦¤à§à¦¤ à¦•à¦°à¦¾ à¦¹à¦šà§à¦›à§‡à¥¤",
        "Your order is being prepared and packed for delivery.",
      ),
      completed: isOrderAtLeast(order, "processing"),
      highlighted: order.status === "processing",
    },
    {
      key: "shipped",
      label: localizedValue("à¦ªà¦¾à¦ à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡", "Shipped"),
      description: localizedValue(
        "à¦…à¦°à§à¦¡à¦¾à¦°à¦Ÿà¦¿ à¦¡à§‡à¦²à¦¿à¦­à¦¾à¦°à¦¿à¦° à¦œà¦¨à§à¦¯ à¦ªà¦¾à¦ à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤",
        "The order has been dispatched for delivery.",
      ),
      completed: isOrderAtLeast(order, "shipped"),
      highlighted: order.status === "shipped",
    },
    {
      key: "delivered",
      label: localizedValue(
        "à¦¡à§‡à¦²à¦¿à¦­à¦¾à¦° à¦¹à§Ÿà§‡à¦›à§‡",
        "Delivered",
      ),
      description: localizedValue(
        "à¦…à¦°à§à¦¡à¦¾à¦°à¦Ÿà¦¿ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦¡à§‡à¦²à¦¿à¦­à¦¾à¦° à¦¹à§Ÿà§‡à¦›à§‡à¥¤",
        "The order has been delivered successfully.",
      ),
      completed: order.status === "delivered",
    },
  ];
}
