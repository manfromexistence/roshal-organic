import { DashboardInsightCard } from "@/components/dashboard/dashboard-insight-card";
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
  const banglaCount = users.filter(
    (user) => (user.preferredLanguage || "en") === "bn",
  ).length;
  const roleData = [
    {
      key: "admin",
      label: locale === "bn" ? "অ্যাডমিন" : "Admins",
      value: adminCount,
    },
    {
      key: "user",
      label: locale === "bn" ? "গ্রাহক" : "Customers",
      value: users.length - adminCount,
    },
  ];
  const languageData = [
    {
      key: "en",
      label: locale === "bn" ? "ইংরেজি" : "English",
      value: users.length - banglaCount,
    },
    {
      key: "bn",
      label: locale === "bn" ? "বাংলা" : "Bangla",
      value: banglaCount,
    },
  ];
  const activityData = [
    {
      key: "active",
      label: locale === "bn" ? "সক্রিয়" : "Active",
      value: activeCount,
    },
    {
      key: "inactive",
      label: locale === "bn" ? "নিষ্ক্রিয়" : "Inactive",
      value: users.length - activeCount,
    },
  ];

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

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardInsightCard
          title={locale === "bn" ? "রোল স্প্লিট" : "Role split"}
          description={
            locale === "bn"
              ? "অ্যাডমিন বনাম গ্রাহক অনুপাত।"
              : "The current balance between admins and customer accounts."
          }
          totalLabel={locale === "bn" ? "অ্যাকাউন্ট" : "Accounts"}
          data={roleData}
        />
        <DashboardInsightCard
          title={locale === "bn" ? "ভাষা পছন্দ" : "Language preference"}
          description={
            locale === "bn"
              ? "বাংলা ও ইংরেজি পছন্দের ব্যবহারকারী অনুপাত।"
              : "How the user base currently splits between Bangla and English."
          }
          totalLabel={locale === "bn" ? "ইউজার" : "Users"}
          data={languageData}
        />
        <DashboardInsightCard
          title={locale === "bn" ? "অ্যাকাউন্ট অবস্থা" : "Account status"}
          description={
            locale === "bn"
              ? "সক্রিয় ও নিষ্ক্রিয় অ্যাকাউন্টের বর্তমান অবস্থা।"
              : "Current split between active and inactive accounts."
          }
          totalLabel={locale === "bn" ? "স্ট্যাটাস" : "Status"}
          data={activityData}
          className="xl:col-span-2"
        />
      </div>

      <RoshalUsersTable
        users={users}
        locale={locale}
        currentUserId={sessionUser.id}
      />
    </div>
  );
}
