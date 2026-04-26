import { cookies } from "next/headers";
import { DashboardLayout } from "@/components/dashboard-layout";
import { requireRoshalAdmin } from "@/lib/roshal/auth";

export default async function RoshalDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cookieStore, sessionUser] = await Promise.all([
    cookies(),
    requireRoshalAdmin(),
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
      user={{
        name: sessionUser.name,
        email: sessionUser.email,
        avatar: sessionUser.image || undefined,
      }}
      organization={{
        name: "Roshal Organic",
        email: "info@roshalorganic.com",
        avatar: "/logo.png",
      }}
    >
      {children}
    </DashboardLayout>
  );
}
