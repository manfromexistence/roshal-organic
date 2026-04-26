import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { DailyReportCreateForm } from "@/components/edms/daily-report-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import { getCurrentDate } from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Daily Report | Quadra EDMS",
};

export default async function NewDailyReportPage() {
  await getRequiredDashboardSessionUser();

  const projectRows = await db
    .select({
      id: projects.id,
      name: projects.name,
      projectNumber: projects.projectNumber,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt));

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            New Daily Report
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Log site progress, weather, completed activities, and field issues
            for the current reporting date.
          </p>
        </div>

        <DailyReportCreateForm
          projects={projectRows}
          initialValues={{
            activitiesCompleted: "",
            issues: "",
            projectId: projectRows[0]?.id || "",
            reportDate: getCurrentDate(),
            weather: "Clear",
          }}
        />
      </div>
    </ScrollableContent>
  );
}
