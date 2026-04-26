import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { WarrantyCreateForm } from "@/components/edms/warranty-create-form";
import { ScrollableContent } from "@/components/scrollable-content";
import { db } from "@/lib/db";
import {
  generateWarrantyNumber,
  getCurrentDate,
  getFutureDate,
} from "@/lib/edms/form-helpers";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { projects } from "@/lib/schema";

export const metadata: Metadata = {
  title: "New Warranty Record | Quadra EDMS",
};

export default async function NewWarrantyPage() {
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
            New Warranty Record
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Register warranty coverage periods, provider responsibility, and the
            covered item or system.
          </p>
        </div>

        <WarrantyCreateForm
          projects={projectRows}
          initialValues={{
            description: "",
            endDate: getFutureDate(365),
            item: "",
            projectId: firstProject?.id || "",
            startDate: getCurrentDate(),
            status: "active",
            warrantyNumber: generateWarrantyNumber(firstProject?.projectNumber),
            warrantyType: "manufacturer",
          }}
        />
      </div>
    </ScrollableContent>
  );
}
