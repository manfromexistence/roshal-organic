import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { RfiCreateForm } from "@/components/edms/rfi-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import {
  generateRfiNumber,
  getCurrentDate,
  getFutureDate,
} from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New RFI | Quadra EDMS",
};

export default async function NewRfiPage() {
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
            New Request for Information
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Create a new RFI for clarification and information gathering.
          </p>
        </div>

        <RfiCreateForm
          assignees={assigneeRows}
          projects={projectRows}
          initialValues={{
            assignedTo: assigneeRows[0]?.id || "",
            category: "Design",
            date: getCurrentDate(),
            description: "",
            dueDate: getFutureDate(7),
            from: sessionUser.role || sessionUser.name,
            priority: "Medium",
            projectId: firstProject?.id || "",
            raisedBy: sessionUser.name,
            rfiNumber: generateRfiNumber(firstProject?.projectNumber),
            subject: "",
          }}
        />
      </div>
    </ScrollableContent>
  );
}
