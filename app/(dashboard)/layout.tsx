import { cookies } from "next/headers";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSessionUser } from "@/lib/edms/session";

export default async function DashboardLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const navCookie = cookieStore.get("nav-main-expanded-Platform");

  let navInitialState: Record<string, boolean> = {};
  try {
    if (navCookie?.value) {
      navInitialState = JSON.parse(decodeURIComponent(navCookie.value));
    }
  } catch {
    navInitialState = {};
  }

  const sessionUser = await getSessionUser();

  // Derive organization from user name (simple approach)
  const organization = sessionUser
    ? {
        name: sessionUser.name.split(" ")[0],
        email: sessionUser.email,
        avatar: "/evilrabbit.png",
      }
    : undefined;

  return (
    <DashboardLayout
      navInitialState={navInitialState}
      user={
        sessionUser
          ? {
              name: sessionUser.name,
              email: sessionUser.email,
              avatar: sessionUser.image || undefined,
            }
          : null
      }
      organization={organization}
    >
      {children}
    </DashboardLayout>
  );
}
