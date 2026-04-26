import type { Metadata } from "next";
import Link from "next/link";
import { DailyReportsDataTable } from "@/components/edms/daily-reports-data-table";
import { ScrollableContent } from "@/components/scrollable-content";
import { Button } from "@/components/ui/button";
import { getFirstAccessibleProjectId } from "@/lib/edms/access";
import { getDailyReports } from "@/lib/edms/daily-reports";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export const metadata: Metadata = {
  title: "Daily Reports | Quadra EDMS",
};

export default async function DailyReportsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectId = await getFirstAccessibleProjectId(sessionUser);

  if (!projectId) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Daily Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            No accessible projects found. Please contact your administrator.
          </p>
        </div>
      </ScrollableContent>
    );
  }

  const reports = await getDailyReports(projectId);

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Daily Reports
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Track daily site activities, manpower, equipment, and issues.
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href="/daily-reports/new">New Daily Report</Link>
          </Button>
        </div>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Daily Report Register
            </h2>
            <p className="text-sm text-muted-foreground">
              Site activity, weather, and issue tracking in the shared data
              table.
            </p>
          </div>

          {reports.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              <p>No daily reports found.</p>
              <Button asChild variant="outline">
                <Link href="/daily-reports/new">Create the first report</Link>
              </Button>
            </div>
          ) : (
            <DailyReportsDataTable reports={reports} />
          )}
        </section>
      </div>
    </ScrollableContent>
  );
}
