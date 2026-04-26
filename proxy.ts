import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

function getSafeCallbackUrl(value: string | null, fallback: string) {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return fallback;
}

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role === "admin" ? "admin" : "user";

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isProtectedRoute =
    isDashboardRoute ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname.startsWith("/orders") ||
    request.nextUrl.pathname.startsWith("/profile");
  const callbackURL = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (!session && isProtectedRoute && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackURL", callbackURL);

    return NextResponse.redirect(loginUrl);
  }

  if (session && isDashboardRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session && isAuthPage) {
    const destination = getSafeCallbackUrl(
      request.nextUrl.searchParams.get("callbackURL"),
      role === "admin" ? "/dashboard" : "/",
    );

    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
  ],
};
