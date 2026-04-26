import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { SiteTechnicalQueryCreateForm } from "@/components/edms/site-technical-query-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import {
  generateSiteTechnicalQueryNumber,
  getCurrentDate,
  getFutureDate,
} from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Site Technical Query | Quadra EDMS",
};

export default async function NewSiteTechnicalQueryPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const [projectRows, assigneeRows] = await Promise.all([
    db
      .select({
        id: projects.id,
        name: projects.name,
        projectNumber: projects.projectNumber,
      })
      .from(projects)
      .orderBy(desc(projects.createdAt)),
    db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .orderBy(desc(users.createdAt)),
  ]);

  const firstProject = projectRows[0];

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            New Site Technical Query
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Create a new site technical query for clarification and resolution.
          </p>
        </div>

        <SiteTechnicalQueryCreateForm
          assignees={assigneeRows}
          projects={projectRows}
          initialValues={{
            assignedTo: assigneeRows[0]?.id || "",
            date: getCurrentDate(),
            description: "",
            discipline: "CIV",
            dueDate: getFutureDate(5),
            location: "",
            priority: "Medium",
            projectId: firstProject?.id || "",
            queryNumber: generateSiteTechnicalQueryNumber(
              firstProject?.projectNumber,
            ),
            raisedBy: sessionUser.name,
            subject: "",
          }}
        />
      </div>
    </ScrollableContent>
  );
}
