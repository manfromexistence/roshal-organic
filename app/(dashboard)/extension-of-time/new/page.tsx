import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { ExtensionOfTimeCreateForm } from "@/components/edms/extension-of-time-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import { generateExtensionOfTimeNumber } from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Extension of Time | Quadra EDMS",
};

export default async function NewExtensionOfTimePage() {
  await getRequiredDashboardSessionUser();

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
            New Extension of Time
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Register a contractual time extension request with the delay reason
            and requested calendar days.
          </p>
        </div>

        <ExtensionOfTimeCreateForm
          projects={projectRows}
          initialValues={{
            eotNumber: generateExtensionOfTimeNumber(
              firstProject?.projectNumber,
            ),
            projectId: firstProject?.id || "",
            reason: "",
            requestedDays: 1,
          }}
        />
      </div>
    </ScrollableContent>
  );
}
