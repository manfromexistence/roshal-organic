"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { activityLog, safetyObservations } from "@/lib/schema";

const createSafetyObservationSchema = z.object({
  assignedTo: z.string().trim().optional(),
  description: z.string().trim().min(5),
  immediateAction: z.string().trim().optional(),
  location: z.string().trim().min(2),
  observationNumber: z.string().trim().min(2),
  projectId: z.string().min(1),
  severity: z.enum(["low", "medium", "high", "critical"]),
  type: z.enum(["unsafe_condition", "unsafe_act", "near_miss"]),
});

export async function createSafetyObservation(
  input: z.infer<typeof createSafetyObservationSchema>,
): Promise<{
  success: boolean;
  error?: { message: string };
  data?: { id: string };
}> {
  try {
    const sessionUser = await getRequiredDashboardSessionUser();
    const values = createSafetyObservationSchema.parse(input);
    const observationId = crypto.randomUUID();
    const createdAt = new Date();

    await db.insert(safetyObservations).values({
      assignedTo: values.assignedTo || null,
      createdAt,
      description: values.description,
      id: observationId,
      immediateAction: values.immediateAction || null,
      location: values.location,
      observationNumber: values.observationNumber,
      observedBy: sessionUser.id,
      projectId: values.projectId,
      severity: values.severity,
      status: "open",
      type: values.type,
      updatedAt: createdAt,
    });

    await db.insert(activityLog).values({
      action: "safety_observation_created",
      createdAt,
      description: `Created safety observation ${values.observationNumber}`,
      entityId: observationId,
      entityName: values.observationNumber,
      entityType: "safety_observation",
      id: crypto.randomUUID(),
      projectId: values.projectId,
      userId: sessionUser.id,
    });

    revalidatePath("/safety-observations");
    revalidatePath("/safety-observations/new");

    return { success: true, data: { id: observationId } };
  } catch (error) {
    console.error("Failed to create safety observation:", error);
    return {
      success: false,
      error: { message: "Failed to create the safety observation." },
    };
  }
}
