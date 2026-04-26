import { NextResponse } from "next/server";
import { applyRoshalGatewayCallback } from "@/lib/store-mutations";

export async function POST(request: Request) {
  const result = await applyRoshalGatewayCallback({
    outcome: "success",
    request,
  });

  return NextResponse.json({
    ok: true,
    orderId: result.orderId,
  });
}
