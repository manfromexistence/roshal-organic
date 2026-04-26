import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { InspectionCreateForm } from "@/components/edms/inspection-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import {
  generateInspectionNumber,
  getCurrentDate,
} from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Inspection | Quadra EDMS",
};

export default async function NewInspectionPage() {
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
            New Inspection
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Schedule or record a field inspection with the location, assigned
            inspector, and outcome.
          </p>
        </div>

        <InspectionCreateForm
          projects={projectRows}
          initialValues={{
            deficiencies: "",
            inspectionNumber: generateInspectionNumber(
              firstProject?.projectNumber,
            ),
            inspector: "",
            location: "",
            projectId: firstProject?.id || "",
            results: "pending",
            scheduledDate: getCurrentDate(),
            type: "Site Inspection",
          }}
        />
      </div>
    </ScrollableContent>
  );
}
