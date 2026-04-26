import { RoshalUsersTable } from "@/components/dashboard/users-table";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalUsers } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

export default async function DashboardUsersPage() {
  const [locale, users] = await Promise.all([
    getRoshalLocale(),
    getRoshalUsers(),
    requireRoshalAdmin(),
  ]);

  return (
    <div className="min-w-0 space-y-6 p-4 md:p-6">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "ব্যবহারকারী" : "Users"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "ব্যবহারকারী ম্যানেজমেন্ট" : "User management"}
        </h1>
      </div>

      <RoshalUsersTable users={users} locale={locale} />
    </div>
  );
}
