import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { MemoCreateForm } from "@/components/edms/memo-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import { generateMemoNumber, getCurrentDate } from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Memo | Quadra EDMS",
};

export default async function NewMemoPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const projectRows = await db
    .select({
      id: projects.id,
      name: projects.name,
      projectNumber: projects.projectNumber,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt));

  const firstProject = projectRows[0];

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            New Memo
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Create a new internal project memo for team coordination.
          </p>
        </div>

        <MemoCreateForm
          projects={projectRows}
          initialValues={{
            category: "Internal",
            content: "",
            date: getCurrentDate(),
            from: sessionUser.name,
            memoNumber: generateMemoNumber(firstProject?.projectNumber),
            projectId: firstProject?.id || "",
            status: "Distributed",
            subject: "",
            to: "",
            urgent: false,
          }}
        />
      </div>
    </ScrollableContent>
  );
}
