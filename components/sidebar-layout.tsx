import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ScrollableContent } from "@/components/scrollable-content";
import { auth } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout navInitialState={{}}>
      <ScrollableContent>{children}</ScrollableContent>
    </DashboardLayout>
  );
}
