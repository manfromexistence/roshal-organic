import { cookies } from "next/headers";
import { DashboardLayout } from "@/components/dashboard-layout";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalPages } from "@/lib/store-content";

export default async function RoshalDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cookieStore, sessionUser, marketingPages] = await Promise.all([
    cookies(),
    requireRoshalAdmin(),
    getRoshalPages(),
  ]);
  const navCookie = cookieStore.get("nav-main-expanded-Platform");

  let navInitialState: Record<string, boolean> = {};

  try {
    if (navCookie?.value) {
      navInitialState = JSON.parse(decodeURIComponent(navCookie.value));
    }
  } catch {
    navInitialState = {};
  }

  return (
    <DashboardLayout
      navInitialState={navInitialState}
      marketingPages={marketingPages}
      user={{
        name: sessionUser.name,
        email: sessionUser.email,
        avatar: sessionUser.image || undefined,
      }}
      organization={{
        name: "Roshal Organic",
        email: "info@roshalorganic.com",
        avatar: undefined,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
