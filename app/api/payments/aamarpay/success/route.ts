import { applyRoshalGatewayCallback } from "@/lib/store-mutations";

export async function POST(request: Request) {
  const result = await applyRoshalGatewayCallback({
    outcome: "success",
    request,
  });

  return Response.redirect(new URL(result.redirectPath, request.url), 303);
}
