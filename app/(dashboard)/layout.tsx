import { redirect } from "next/navigation";

export default async function DashboardLayoutWrapper({
  children: _children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  redirect("/dashboard");
}
