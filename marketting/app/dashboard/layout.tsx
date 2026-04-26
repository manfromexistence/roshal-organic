import { cookies } from "next/headers";
import { DashboardLayout } from "@/components/dashboard-layout";
import { NavStoreInitializer } from "@/components/nav-store-initializer";

export default async function DashboardLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const navState = cookieStore.get("nav-main-expanded-Platform");
  const initialState = navState ? JSON.parse(navState.value) : {};

  return (
    <div className="h-full overflow-hidden">
      <NavStoreInitializer initialState={initialState}>
        <DashboardLayout>{children}</DashboardLayout>
      </NavStoreInitializer>
    </div>
  );
}
