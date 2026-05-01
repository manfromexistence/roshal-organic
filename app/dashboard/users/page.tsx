import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { RoshalUsersTable } from "@/components/dashboard/users-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requireRoshalAdmin } from "@/lib/store-auth";
import { getRoshalUsers } from "@/lib/store-content";
import { getRoshalLocale } from "@/lib/store-i18n";

const userErrorCopy: Record<string, string> = {
  "last-admin-required": "At least one active admin must remain.",
  "self-delete-blocked": "You cannot delete your own account.",
  "user-not-found": "The selected user could not be found.",
};

export default async function DashboardUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    deleted?: string;
    error?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [locale, users, sessionUser] = await Promise.all([
    getRoshalLocale(),
    getRoshalUsers(),
    requireRoshalAdmin(),
  ]);
  const adminCount = users.filter((user) => user.role === "admin").length;
  const activeCount = users.filter((user) => user.isActive).length;
  return (
    <div className="min-w-0 space-y-6 p-6">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">
          {locale === "bn" ? "ব্যবহারকারী" : "Users"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "bn" ? "ব্যবহারকারী ম্যানেজমেন্ট" : "User management"}
        </h1>
      </div>

      {resolvedSearchParams.error ? (
        <Alert variant="destructive">
          <AlertDescription>
            {userErrorCopy[resolvedSearchParams.error] ||
              "Could not complete the user action."}
          </AlertDescription>
        </Alert>
      ) : null}
      {resolvedSearchParams.deleted ? (
        <Alert>
          <AlertDescription>User deleted successfully.</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          title={locale === "bn" ? "মোট ব্যবহারকারী" : "Total users"}
          value={users.length}
          hint={`${activeCount} active accounts`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "অ্যাডমিন" : "Admins"}
          value={adminCount}
          hint={`${users.length - adminCount} customer accounts`}
        />
        <DashboardMetricCard
          title={locale === "bn" ? "সক্রিয় অ্যাকাউন্ট" : "Active accounts"}
          value={activeCount}
          hint={`${users.length - activeCount} inactive accounts`}
        />
      </div>

      {/* Role, language, and account-status insight panels are intentionally hidden per client request. */}

      <RoshalUsersTable
        users={users}
        locale={locale}
        currentUserId={sessionUser.id}
      />
    </div>
  );
}
