import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ROSHAL_LEGACY_ROUTE_PREFIXES = [
  "/admin",
  "/audit",
  "/bulk-upload",
  "/change-orders",
  "/commissioning",
  "/config",
  "/daily-reports",
  "/databook",
  "/documents",
  "/extension-of-time",
  "/inspections",
  "/letters",
  "/matrix",
  "/meetings",
  "/memos",
  "/notifications",
  "/projects",
  "/reports",
  "/rfis",
  "/safety-observations",
  "/schedule",
  "/settings",
  "/site-tech-queries",
  "/submittals",
  "/technical-queries",
  "/theme",
  "/transmittals",
  "/warranty",
  "/workflows",
] as const;

function getSafeCallbackUrl(value: string | null, fallback: string) {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return fallback;
}

function isLegacyRoshalRoute(pathname: string) {
  return ROSHAL_LEGACY_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role === "admin" ? "admin" : "user";

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isLegacyRoute = isLegacyRoshalRoute(request.nextUrl.pathname);
  const isProtectedRoute =
    isDashboardRoute ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname.startsWith("/orders") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/account");
  const callbackURL = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (!session && isProtectedRoute && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackURL", callbackURL);

    return NextResponse.redirect(loginUrl);
  }

  if (isLegacyRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackURL", "/dashboard");

      return NextResponse.redirect(loginUrl);
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
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
    "/account/:path*",
    "/admin/:path*",
    "/audit/:path*",
    "/bulk-upload/:path*",
    "/change-orders/:path*",
    "/commissioning/:path*",
    "/config/:path*",
    "/daily-reports/:path*",
    "/databook/:path*",
    "/documents/:path*",
    "/extension-of-time/:path*",
    "/inspections/:path*",
    "/letters/:path*",
    "/matrix/:path*",
    "/meetings/:path*",
    "/memos/:path*",
    "/notifications/:path*",
    "/projects/:path*",
    "/reports/:path*",
    "/rfis/:path*",
    "/safety-observations/:path*",
    "/schedule/:path*",
    "/settings/:path*",
    "/site-tech-queries/:path*",
    "/submittals/:path*",
    "/technical-queries/:path*",
    "/theme/:path*",
    "/transmittals/:path*",
    "/warranty/:path*",
    "/workflows/:path*",
  ],
};
