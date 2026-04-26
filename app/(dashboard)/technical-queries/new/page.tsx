import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { TechnicalQueryCreateForm } from "@/components/edms/technical-query-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import {
  generateTechnicalQueryNumber,
  getCurrentDate,
  getFutureDate,
} from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Technical Query | Quadra EDMS",
};

export default async function NewTechnicalQueryPage() {
  await getRequiredDashboardSessionUser();

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
  const firstAssignee = assigneeRows[0];

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            New Technical Query
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Raise a new technical query for design clarification, conflicts, or
            missing information.
          </p>
        </div>

        <TechnicalQueryCreateForm
          projects={projectRows}
          assignees={assigneeRows}
          initialValues={{
            projectId: firstProject?.id || "",
            queryNumber: generateTechnicalQueryNumber(
              firstProject?.projectNumber,
            ),
            date: getCurrentDate(),
            discipline: "CIV",
            subject: "",
            description: "",
            priority: "Medium",
            assignedTo: firstAssignee?.id || "",
            dueDate: getFutureDate(7),
          }}
        />
      </div>
    </ScrollableContent>
  );
}
