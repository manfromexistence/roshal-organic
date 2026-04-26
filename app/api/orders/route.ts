import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/handle-error";
import {
  createValidatedRoshalOrder,
  RoshalCheckoutError,
} from "@/lib/store-mutations";
import type { RoshalPaymentMethod } from "@/lib/store-types";

function normalizePaymentMethod(value: string): RoshalPaymentMethod {
  if (
    value === "card" ||
    value === "bkash" ||
    value === "nagad" ||
    value === "rocket" ||
    value === "upay"
  ) {
    return value;
  }

  return "bkash";
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = await createValidatedRoshalOrder({
      userId: session.user.id,
      customerName: body.customerName,
      phone: body.phone,
      email: body.email,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      city: body.city,
      postalCode: body.postalCode,
      notes: body.notes,
      paymentMethod: normalizePaymentMethod(String(body.paymentMethod || "")),
      paymentReference: body.paymentReference,
      paymentSender: body.paymentSender,
      paymentProofUrl: body.paymentProofUrl,
      items: Array.isArray(body.items) ? body.items : [],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to create Roshal order:", error);

    if (error instanceof RoshalCheckoutError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: getErrorMessage(error),
          code: "invalid-checkout-request",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Could not create order", code: "checkout-unavailable" },
      { status: 500 },
    );
  }
}
