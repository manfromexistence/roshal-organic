import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { SafetyObservationCreateForm } from "@/components/edms/safety-observation-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import { generateSafetyObservationNumber } from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects, users } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Safety Observation | Quadra EDMS",
};

export default async function NewSafetyObservationPage() {
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

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            New Safety Observation
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Log unsafe acts, unsafe conditions, or near misses together with the
            corrective action owner.
          </p>
        </div>

        <SafetyObservationCreateForm
          assignees={assigneeRows}
          projects={projectRows}
          initialValues={{
            assignedTo: assigneeRows[0]?.id || "",
            description: "",
            immediateAction: "",
            location: "",
            observationNumber: generateSafetyObservationNumber(
              firstProject?.projectNumber,
            ),
            projectId: firstProject?.id || "",
            severity: "medium",
            type: "unsafe_condition",
          }}
        />
      </div>
    </ScrollableContent>
  );
}
