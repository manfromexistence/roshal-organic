import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/projects") ||
    request.nextUrl.pathname.startsWith("/documents") ||
    request.nextUrl.pathname.startsWith("/workflows") ||
    request.nextUrl.pathname.startsWith("/transmittals") ||
    request.nextUrl.pathname.startsWith("/correspondence") ||
    request.nextUrl.pathname.startsWith("/queries") ||
    request.nextUrl.pathname.startsWith("/submittals") ||
    request.nextUrl.pathname.startsWith("/change-orders") ||
    request.nextUrl.pathname.startsWith("/schedule") ||
    request.nextUrl.pathname.startsWith("/commissioning") ||
    request.nextUrl.pathname.startsWith("/admin");

  // Redirect to login if no session and trying to access protected route
  if (!session && isProtectedRoute && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to home if already authenticated and on login page
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
