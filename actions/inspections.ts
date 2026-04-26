"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { activityLog, inspectionRequests } from "@/lib/schema";

const createInspectionSchema = z.object({
  inspectionNumber: z.string().trim().min(2),
  inspector: z.string().trim().optional(),
  location: z.string().trim().min(2),
  projectId: z.string().min(1),
  results: z.enum(["pending", "pass", "fail", "conditional"]),
  scheduledDate: z.string().trim().min(1),
  type: z.string().trim().min(2),
  deficiencies: z.string().trim().optional(),
});

export async function createInspectionRequest(
  input: z.infer<typeof createInspectionSchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createInspectionSchema.parse(input);
    const inspectionId = crypto.randomUUID();
    const createdAt = new Date();

    await db.insert(inspectionRequests).values({
      createdAt,
      deficiencies: values.deficiencies || null,
      id: inspectionId,
      inspectionNumber: values.inspectionNumber,
      inspector: values.inspector || null,
      location: values.location,
      projectId: values.projectId,
      results: values.results,
      scheduledDate: new Date(values.scheduledDate),
      type: values.type,
      updatedAt: createdAt,
    });

    await db.insert(activityLog).values({
      action: "inspection_created",
      createdAt,
      description: `Created inspection request ${values.inspectionNumber}`,
      entityId: inspectionId,
      entityName: values.inspectionNumber,
      entityType: "inspection",
      id: crypto.randomUUID(),
      projectId: values.projectId,
      userId: sessionUser.id,
    });

    revalidatePath("/inspections");
    revalidatePath("/inspections/new");

    return { success: true, data: { id: inspectionId } };
  } catch (error) {
    console.error("Failed to create inspection request:", error);
    return {
      success: false,
      error: { message: "Failed to create the inspection request." },
    };
  }
}
