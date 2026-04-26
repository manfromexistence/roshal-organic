import { SecondaryMenu } from "@/components/secondary-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[960px] space-y-8">
      <SecondaryMenu
        items={[
          { path: "/settings", label: "General" },
          { path: "/settings/accounts", label: "Connections" },
          { path: "/settings/members", label: "Members" },
          { path: "/settings/notifications", label: "Notifications" },
          { path: "/settings/developer", label: "Developer" },
        ]}
      />

      <main>{children}</main>
    </div>
  );
}
