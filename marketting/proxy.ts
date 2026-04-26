import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // Allow access to marketing pages, login, and API routes without authentication
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/collections") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // If user is not authenticated and tries to access dashboard, redirect to login
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and accessing root
  if (session && pathname === "/") {
    // Admin users redirect to dashboard
    const userRole = (session.user as any).role || "user";
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If user is authenticated and tries to access login, redirect based on role
  if (session && pathname.startsWith("/login")) {
    const userRole = (session.user as any).role || "user";
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
